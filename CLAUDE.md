# CLAUDE.md — Appli de l'APE d'Eycheil

## Projet
Appli web (PWA) d'organisation de l'APE d'Eycheil : événements, tâches, listes, dépenses + justificatifs, présence, créneaux de bénévoles. Mobile d'abord, tout en français, 0 €. Besoins : `cahier-des-charges.md` (v0.2, source de vérité fonctionnelle : rôles, statuts de dépenses, phases). Utilisateur = Félicien, trésorier. Dossier « mère » de l'asso : `C:\Users\Felou\Documents\APE\` (tresorerie/, taches/, synthese/).

## Workflow (chaque fonctionnalité) — PORTE OBLIGATOIRE
Par défaut. Dérogation, pour cette demande seulement : l'utilisateur demande directement le code (« code-le », « fais-le direct », « quick fix ») → on code tout de suite, sans docs ni Pending. Un objectif ou une idée sans demande de code n'est pas une dérogation.

1. **Pourquoi** — l'utilisateur donne le but. Aucun fichier écrit.
2. **Comment** — on discute l'approche, ou il la dicte. Aucun fichier écrit.
3. **Écrire** — le `CLAUDE.md` de chaque dossier de code touché, rédigé comme si la fonctionnalité existait (carte, intention, invariants). Puis UN fichier temporaire `AI/Pending/<Feature>.md` (ligne `Goal:` = le Pourquoi, puis tout le reste à faire ; modèle : `AI/Pending/README.md`). Stop : l'utilisateur relit.
   Test de tri de chaque info : *encore vraie et utile après livraison ?* Oui → `CLAUDE.md` du dossier feuille concerné. Non (étapes ponctuelles, valeurs à copier) → Pending seulement.
4. **Faire** — sur le go de l'utilisateur : implémenter ce que disent les docs, cocher le Pending, le supprimer quand il est vide, corriger tout CLAUDE.md qui a dérivé. Tests écrits et lancés (`AI/Testing.md`).

Règles de la porte :
- Pas de code pour une fonctionnalité tant que l'étape 3 n'est pas sur disque, sauf dérogation.
- Étape 4 depuis un contexte vidé : on part des docs et du Pending. Sinon, première ligne : `Contexte non vidé — docs + discussion.` Un changement de conception retourne dans les docs.
- Exempt : fautes / commentaires, lancer des tests, répondre à une question, revert.
- Autonomie totale (« débrouille-toi », « je suis absent ») : plus d'arrêt, on enchaîne plan → code → tests jusqu'au bout.

## Règles
- Avant d'écrire du code : lire `AI/CodingStyle.md`. Pour planifier ou répondre : non.
- Navigation par les docs : ce fichier → `CLAUDE.md` du dossier → fichiers. Explorer en aveugle seulement pour une zone non documentée.
- **Aucun fichier mémoire.** Un fait durable va dans le fichier du tableau « Où va un fait » ; une règle énoncée par l'utilisateur (« toujours… », « jamais… ») y est écrite, pas retenue.
- Lancer, commiter, pousser, déployer : seulement sur demande de Félicien. Petit changement : rendre le code et dire que ce n'est pas testé dans un navigateur.
- Tests : headless en amont, puis test dans un vrai Chromium sur l'appli en ligne avec le compte de test (`AI/Testing.md`). Ne jamais prendre la souris / le focus de la machine de Félicien sans demande ; jamais d'identifiants de test dans le dépôt.
- Écrire dans le dépôt uniquement du code et des docs ; scratch, rapports, essais → scratchpad de session.
- Pièges et post-mortems → `TroobleshootingLogs.md`, pas dans les CLAUDE.md.

### Règles absolues (héritées du dossier APE)
- **Dépôt public** : aucun secret, aucune donnée réelle, aucune photo, aucun téléphone / IBAN / mot de passe. Seule la clé publique (anon) Supabase peut apparaître.
- Prénoms uniquement ; pas de nom d'enfant ni de donnée de santé.
- Une dépense n'est `pointé banque` que si justificatif joint (ou « archivé par le trésorier ») **et** référence de relevé saisie. Seul le trésorier vérifie et pointe.
- RLS (règles de sécurité de la base) écrites et testées **avant** les écrans qui utilisent les données.
- Ne jamais renommer l'organisation GitHub `APE-Eycheil` ni le dépôt `app` (le QR code casserait). Chemins toujours **relatifs** (l'appli vit sous `/app/`).

## Où va un fait
| Type de fait | Fichier |
|---|---|
| Fonctionnement d'un dossier / fichier, invariant, ordre | `CLAUDE.md` du dossier feuille |
| Conception transverse (données, rôles, auth, stockage photos) | `AI/Architecture.md` |
| Style de code, réutilisation, conventions | `AI/CodingStyle.md` |
| Tests, droits par rôle, parcours | `AI/Testing.md` |
| Besoins fonctionnels, phases, décisions de Félicien | `cahier-des-charges.md` |
| Ce qui a cassé et pourquoi | `TroobleshootingLogs.md` |
| Ce dont seule cette fonctionnalité a besoin (étapes ponctuelles, réglages Supabase à faire à la main) | `AI/Pending/<Feature>.md` |
| Comment l'agent doit se comporter | ce fichier |

## Écrire un CLAUDE.md
- Une carte, pas une documentation : ligne d'objet, tableau fichier → rôle en une ligne, puis seulement ce que le code ne dit pas (intention, pourquoi, invariants, ordre, liens entre classes).
- Concis : fragments, pas de phrases. La bonne façon de faire, jamais l'historique « ne fais pas X ».
- ≥ 3 fichiers du même genre → sous-dossier avec son propre `CLAUDE.md`. Chaque doc assez petit pour être lu en entier.
- Chaque fait à un seul endroit ; ailleurs, on y renvoie.

## Où sont les choses
| Besoin | Fichier |
|---|---|
| JS (accès données, vues, helpers) | `js/CLAUDE.md` |
| CSS (tokens, composants, vues) | `css/CLAUDE.md` |
| Base, RLS, migrations, réglages Supabase | `supabase/CLAUDE.md` |
| Docs thématiques de l'agent | `AI/CLAUDE.md` |
| Travail restant d'une fonctionnalité | `AI/Pending/` |

## Stack
HTML / CSS / JS **sans build ni framework**, scripts classiques (`<script src>`), fonctions globales, pas de modules ES ni npm à l'exécution (modèle : ChooseYourScore). **Supabase** (auth, Postgres + RLS, stockage privé) via client CDN en version figée. **GitHub Pages** (`https://ape-eycheil.github.io/app/`, à vérifier). PWA : `manifest.webmanifest` + `sw.js`.

## Cache : toujours incrémenter `?v=`
Dans `index.html`, chaque `<link rel="stylesheet">` et `<script src>` porte `?v=N`. À chaque modification d'un fichier de `css/` ou `js/`, **incrémenter N partout (même numéro)**, et `CACHE_VERSION` dans `sw.js`. Sinon les téléphones gardent d'anciens fichiers.

## Git
Avant de commencer : `git fetch origin main`, aligner la branche de travail sur `origin/main`. Branche `claude/<sujet>` → commit → PR → merge, seulement quand Félicien le demande. Une phase du cahier (§10) = une version utilisable.

## État
Phase 0 : squelette posé, aucun projet Supabase créé. Points ouverts (cahier §14) : second propriétaire GitHub, photos visibles du bureau ou non, date du loto 2027, vérifs techniques (Pages, limites gratuites, connexion sans mail). Prochaine étape : `AI/Pending/Phase0-MiseEnPlace.md`.
