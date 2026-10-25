# js/

Scripts classiques chargés par `index.html` dans cet ordre (avec `?v=N`). Fonctions globales, pas de modules ES.

| Fichier | Rôle |
|---|---|
| `config.js` | URL + clé publique Supabase |
| `utils.js` | Fonctions pures : `escapeHtml` |
| `ui.js` | Helpers DOM partagés : `showMessage`, `makeReorderBtns`, `syncReorderBtns`, `setReorderDisabled` |
| `data.js` | **Seul accès à Supabase** : `initData()`, auth (`signIn`, `signUp`, `signOut`, `loadOwnProfile`), puis `loadX()/saveX()` asynchrones par table |
| `auth.js` | Connexion par e-mail, inscription (prénom, e-mail, mot de passe, code), déconnexion, `currentProfile` |
| `nav.js` | `showView(name)`, `NAV_BUTTONS` |
| `app.js` | Point d'entrée : branche les formulaires, service worker, première vue |

## Ajouter une vue
Une vue = `<section id="view-xxx" class="view">` dans `index.html` + `js/xxx.js` (fonction `initXxx()`) + entrée dans `NAV_BUTTONS` + une ligne `if (name === 'xxx') initXxx();` dans `showView` + bouton `#nav-xxx`. Même numéro `?v=` pour le nouveau script.

## Invariants
- Une vue ne parle jamais à Supabase directement : elle appelle `data.js`.
- `initData()` renvoie `false` tant que le projet n'est pas configuré : l'appli affiche alors un message au lieu de planter.
- Les droits réels sont dans les RLS ; `currentProfile.role` ne sert qu'à afficher ou masquer.
