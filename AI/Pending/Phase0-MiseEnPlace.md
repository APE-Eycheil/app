# Phase 0 — mise en place — pending

Goal: une page vide installable avec connexion fonctionnelle, sur le vrai hébergement (cahier §10, phase 0).
Docs written: `CLAUDE.md`, `AI/Architecture.md`, `js/CLAUDE.md`, `css/CLAUDE.md`, `supabase/CLAUDE.md`.

## Décisions avant de continuer (Félicien)
- [ ] Second propriétaire de l'organisation GitHub `APE-Eycheil` : **aucun pour l'instant** (Félicien seul). Risque : dépendance à une personne (cahier §13). À reprendre dès qu'un membre du bureau accepte ; d'ici là, export régulier du dépôt.
- [ ] Compte Supabase rattaché à l'asso, second administrateur.

## Hébergement
- [ ] Activer GitHub Pages sur `APE-Eycheil/app` (branche `main`, racine) ; vérifier l'adresse réelle `https://ape-eycheil.github.io/app/`.
- [ ] Vérifier que le dépôt public est bien requis pour Pages gratuit.
- [ ] Générer le QR code une fois l'adresse confirmée.

## Supabase
- [ ] Créer le projet avec : Data API activée, exposition automatique des tables **désactivée**, RLS automatique **activée**. Vérifier limites de l'offre gratuite (stockage, bande passante, mise en pause).
- [ ] Authentification : confirmation par mail désactivée ; vérifier que l'identifiant `prenom@ape.invalid` est accepté ; limitation des tentatives activée.
- [ ] Appliquer `supabase/migrations/0001_profiles.sql` sur un projet de test, relire les RLS.
- [ ] Table `app_settings` + fonction d'inscription avec code d'invitation haché (`0002_…`).
- [ ] Bucket `justificatifs` privé (phase 2, mais à créer privé dès le départ).
- [ ] Créer le premier compte administrateur (Félicien) à la main, `is_treasurer = true`.

## Compte de test
- [ ] Projet Supabase de test (ou comptes de test sur le projet) : un compte fictif « Test » par rôle utile ; identifiants transmis par Félicien pendant la session, jamais dans le dépôt.
- [ ] Décider : Chromium de l'interface web de Claude, ou accès au Chromium de Félicien.

## Code
- [ ] `index.html` : ajouter le `<script>` du client Supabase en version figée (CDN, avant `js/data.js`).
- [ ] `js/config.js` : renseigner URL et clé `anon` (publiques).
- [ ] Icônes PNG 192 / 512 (iPhone n'utilise pas le SVG) dans `icons/` + `manifest.webmanifest`.
- [ ] Lire la session au chargement (`db.auth.getSession()`), charger `currentProfile`, router vers `home` ou `login`.

## Vérifier
- [ ] Ouverture sur Android et iPhone, ajout à l'écran d'accueil, connexion d'un compte validé, refus d'un compte en attente.
- [ ] `supabase/tests/` : un compte en attente ne lit rien.
