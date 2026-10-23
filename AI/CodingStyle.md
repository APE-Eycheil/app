# Style de code

## La simplicité d'abord
Résoudre exactement la demande, rien de plus. Avant d'écrire, chercher le mécanisme le plus simple déjà disponible (élément HTML natif, fonction existante) et l'utiliser.
- **Simple, pas seulement court.** Constructions plates, flux évident. Si la version courte oblige à deviner pourquoi elle marche, la longue gagne.
- **Plus petit diff correct.** Réutiliser ou étendre l'existant plutôt qu'ajouter à côté.
- **Un mécanisme, pas deux.** Pas d'état en plus pour suivre ce qu'une construction existante borne déjà.
- **YAGNI.** Pas de paramètre ni de fonctionnalité spéculative. Supprimer déclaration *et* implémentation quand le dernier appel disparaît.
- **Aucun reste.** On retire une fonctionnalité en entier (code, HTML, CSS, docs) ; on ne la cache pas.
- Pas de bibliothèque ajoutée sans nécessité : pas de build, pas de npm, pour qu'une autre personne reprenne.

## Écrire du code
- JS : scripts classiques, fonctions globales, `const` par défaut, `async/await`. Indentation 2 espaces.
- Plusieurs `if` fusionnés avec `&&` plutôt qu'imbriqués. Pas de sortie anticipée au milieu d'une fonction : garde au début ou résultat retourné.
- Nom = ce que fait exactement le code (`isOverdue`, pas `check`). Pas d'abréviation. Corriger le nom dans le même changement si le comportement change.
- **Uniformité** : deux choses qui font pareil passent par un seul helper dans `ui.js` / `utils.js`, paramétré. Toute liste réordonnable utilise `makeReorderBtns` / `syncReorderBtns`.
- **Tout texte saisi inséré dans `innerHTML` passe par `escapeHtml()`** ; sinon `textContent`.
- **Seul `js/data.js` appelle Supabase.** Les vues appellent ses fonctions (`loadTasks()`, `saveTask()`…).
- Pas de style inline sauf valeur calculée. Valeur répétée → variable CSS.
- HTML sémantique : `<button type="button">` pour les actions, `<label for>` sur chaque champ, `aria-label` sur un bouton à icône seule, focus visible.
- Mobile d'abord (≥ 360 px), cibles tactiles ≥ 44 px, thème clair/sombre automatique.
- Découper un fichier au-delà de ~300 lignes.

## Commentaires
- Bannières de section : `// ═══…` en tête de fichier, `// ── Titre ──…` à l'intérieur ; CSS : `/* ── Titre ── */`.
- Commenter le pourquoi non évident (règle métier, contournement), pas ce que le code dit déjà. En français.

## Cache
Toute modification de `css/` ou `js/` incrémente le `?v=N` de `index.html` partout et `CACHE_VERSION` de `sw.js`.

## Données et sécurité
- Aucun secret ni donnée réelle dans le dépôt (public). Clé `anon` seule.
- Les droits se décident dans les RLS, jamais seulement en cachant un bouton.
- Jamais d'identifiant, téléphone, IBAN, nom d'enfant dans le code, les tests ou les captures.
