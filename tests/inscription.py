"""Parcours inscription → attente → connexion, sur le projet Supabase DE TEST (jamais le réel).

Variables d'environnement (jamais écrites dans le dépôt) :
  APE_TEST_URL, APE_TEST_KEY  : URL et clé anon du projet de test
  APE_TEST_CODE               : code d'invitation du projet de test

  python tests/inscription.py                  crée un compte « [TEST] » et vérifie qu'il reste en attente
  python tests/inscription.py --connexion MAIL vérifie qu'un compte validé entre sur l'accueil
Le compte de test est supprimé à la main après coup (voir AI/Testing.md).
"""
import os, subprocess, sys, time, uuid
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8081
BASE = f'http://localhost:{PORT}/'
PASSWORD = 'motdepasse-test-1'

URL, KEY, CODE = (os.environ[k] for k in ('APE_TEST_URL', 'APE_TEST_KEY', 'APE_TEST_CODE'))
CONFIG = f"const SUPABASE_URL = '{URL}';\nconst SUPABASE_ANON_KEY = '{KEY}';\n"

failures = []


def check(label, condition):
    print(('OK   ' if condition else 'ÉCHEC'), label)
    if not condition:
        failures.append(label)


def text_of(page, selector):
    return page.locator(selector).inner_text() if page.locator(selector).is_visible() else ''


def run(page, email, signup):
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    # Le dépôt pointe vers le projet réel : on redirige config.js vers le projet de test.
    page.route('**/js/config.js*', lambda route: route.fulfill(body=CONFIG, content_type='text/javascript'))
    page.goto(BASE)

    if signup:
        page.click('#btn-to-signup')
        for code, expected in (('faux', "Code d'invitation invalide"), (CODE, None)):
            page.fill('#signup-firstname', '[TEST] Prénom')
            page.fill('#signup-email', email)
            page.fill('#signup-password', PASSWORD)
            page.fill('#signup-code', code)
            page.click('#signup-form button[type=submit]')
            if expected:
                page.wait_for_selector('#signup-error:not([hidden])')
                check('mauvais code refusé', expected in text_of(page, '#signup-error'))
            else:
                page.wait_for_selector('#login-info:not([hidden])')
                check('inscription : message « demande envoyée »', 'Demande envoyée' in text_of(page, '#login-info'))
        page.fill('#login-email', email)
        page.fill('#login-password', PASSWORD)
        page.click('#login-form button[type=submit]')
        page.wait_for_selector('#login-error:not([hidden])')
        check('compte en attente refusé', 'en attente' in text_of(page, '#login-error'))
        check('accueil non affiché', not page.locator('#view-home').is_visible())
    else:
        page.fill('#login-email', email)
        page.fill('#login-password', PASSWORD)
        page.click('#login-form button[type=submit]')
        page.wait_for_selector('#view-home:not([hidden])')
        check('compte validé : accueil affiché', True)
        page.reload()
        page.wait_for_selector('#view-home:not([hidden])')
        check('session restaurée après rechargement', True)
        page.click('#btn-logout')
        page.wait_for_selector('#view-login:not([hidden])')
        check('déconnexion : retour à la connexion', True)

    check('aucune erreur JS', not errors)
    if errors:
        print(errors)


if __name__ == '__main__':
    signup = '--connexion' not in sys.argv
    email = f'test-{uuid.uuid4().hex[:8]}@ape.invalid' if signup else sys.argv[sys.argv.index('--connexion') + 1]
    server = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT,
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            # Service worker bloqué : il contournerait la redirection de config.js au rechargement.
            page = browser.new_context(viewport={'width': 360, 'height': 740}, service_workers='block').new_page()
            run(page, email, signup)
            browser.close()
    finally:
        server.terminate()
    if signup:
        print('Compte créé :', email)
    sys.exit(1 if failures else 0)
