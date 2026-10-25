# Phase 0 — mise en place — pending

Goal: une page vide installable avec connexion fonctionnelle, sur le vrai hébergement (cahier §10, phase 0).
Docs written: `CLAUDE.md`, `AI/Architecture.md`, `js/CLAUDE.md`, `css/CLAUDE.md`, `supabase/CLAUDE.md`, `tests/CLAUDE.md`.

## Supabase
- [ ] À vérifier à la main dans le tableau de bord, sur les **deux** projets : limitation des tentatives de connexion activée ; mot de passe 8 caractères minimum ; limites de l'offre gratuite (stockage, bande passante, mise en pause).
- [ ] Bucket `justificatifs` privé (phase 2, mais à créer privé dès le départ).
- [ ] Créer le premier compte administrateur : Félicien s'inscrit dans l'appli en ligne avec le code, puis promotion par SQL sur le projet réel (`role = 'admin'`, `status = 'valide'`, `is_treasurer = true`).

## Test dans un vrai Chromium (après déploiement)
- [ ] Pousser sur `main` (sur demande de Félicien) pour que `https://ape-eycheil.github.io/app/` serve la nouvelle version.
- [ ] Décider : Chromium de l'interface web de Claude, ou accès au Chromium de Félicien.
- [ ] Parcours sur l'appli en ligne : service worker, chemins sous `/app/`, rendu 360 px, console.

## Vérifier
- [ ] Ouverture sur Android et iPhone, ajout à l'écran d'accueil (icônes PNG), connexion d'un compte validé, refus d'un compte en attente.
- [ ] `supabase/tests/` : un compte en attente ne lit rien (vérifié à la main sur le test le 2026-10-25, pas encore écrit en SQL).
