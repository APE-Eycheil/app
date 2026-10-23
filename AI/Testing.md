# Tests

Deux temps, dans cet ordre : **headless en amont**, puis **test dans un vrai Chromium** sur l'appli en ligne.

## 1. En amont : automatisé, headless
Rapide, répétable, sans prise de focus. Données fictives uniquement.

| Couche | Quoi | Où |
|---|---|---|
| Droits (RLS) | Pour chaque rôle, les accès refusés le sont : membre ne lit pas les dépenses d'un autre ; compte en attente ne lit rien ; seul le trésorier vérifie / pointe | `supabase/tests/*.sql`, projet Supabase **de test** |
| Parcours | Playwright / Chromium headless : inscription → validation → connexion → « je m'en occupe » ; achat → photo → vérification → remboursement → export ; créneau → inscription / désinscription | `tests/*.py` |

```bash
python -m http.server 8080          # depuis la racine du dépôt
python tests/<parcours>.py          # ouvre http://localhost:8080, clique, capture, vérifie textes / états
```

## 2. Ensuite : Chromium réel, sur l'appli en ligne
Pour ce que le headless ne couvre pas : service worker, installation PWA, chemins sous `/app/` de GitHub Pages, vrai Supabase, rendu mobile (fenêtre 360 px), console du navigateur.
- Navigateur : le Chromium de l'interface web de Claude, ou celui de Félicien s'il donne l'accès (à décider au moment du test).
- Cible : l'adresse déployée (ou une prévisualisation), jamais des vraies données.
- Parcours : ceux de la fonctionnalité qui vient d'être faite, cliqués comme un utilisateur ; captures aux moments clés, erreurs de console relevées.
- Appareils : un Android et un iPhone en 4G faible, à la main par Félicien, avant l'ouverture générale.

## Compte de test
- Un compte dédié (prénom fictif, ex. « Test »), rôle choisi selon le parcours ; un compte par rôle au besoin (membre, bureau, admin).
- Les identifiants ne sont **jamais** écrits dans le dépôt, les docs, les captures ni les tests : donnés par Félicien pendant la session, ou lus dans une variable d'environnement.
- Données créées pendant les tests : préfixées « [TEST] », supprimées après.
- Le compte de test ne sert jamais à pointer ou vérifier de vraies dépenses.

## Avant de rendre une fonctionnalité
Lancer les tests headless puis le test en ligne ; dire ce qui n'a pas pu être testé. Captures et rapports dans le scratchpad de session, jamais dans le dépôt.
