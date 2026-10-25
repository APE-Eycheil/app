# tests/

Parcours Playwright (Chromium headless), exécutés **sur le projet Supabase de test uniquement**. Principes : `AI/Testing.md`.

| Fichier | Parcours |
|---|---|
| `inscription.py` | Inscription (mauvais code refusé, bon code accepté) → compte `en_attente` refusé à la connexion ; avec `--connexion MAIL` : compte validé → accueil, session restaurée, déconnexion |

## Mode d'emploi
- Variables d'environnement `APE_TEST_URL`, `APE_TEST_KEY` (anon du projet de test), `APE_TEST_CODE` : jamais dans le dépôt.
- Le script sert le dépôt sur un port local et redirige `js/config.js` vers le projet de test ; le dépôt reste pointé sur le réel.
- Validation du compte entre les deux passes : `update public.profiles set status = 'valide'` sur le projet de test (le script ne le fait pas). Comptes `test-xxxx@ape.invalid` supprimés après.
- Prérequis hors dépôt : `pip install playwright`, `python -m playwright install chromium`.
