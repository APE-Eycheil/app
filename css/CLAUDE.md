# css/

Chargé dans l'ordre par `index.html` (avec `?v=N`). Mobile d'abord.

| Fichier | Rôle |
|---|---|
| `reset.css` | Reset global, `[hidden]` toujours respecté |
| `variables.css` | Tokens (couleurs, espacements, rayons, taille tactile) + thème sombre automatique |
| `base.css` | Typographie, focus, composants réutilisables (`.btn`, `.form-input`, `.form-error`) |
| `layout.css` | Barre du haut, boutons de navigation, `.view` |

## Règles
- Toute valeur répétée devient une variable ; les couleurs ne sont définies que dans `variables.css`, avec leur version sombre.
- Une propriété par ligne ; états (`:hover`, `.active`) sous la règle de base ; media queries en fin de fichier.
- Un fichier par vue au-delà du socle (`tasks.css`, `expenses.css`…), ajouté après `layout.css`.
- Palette reprise de ChooseYourScore (fond crème, accent indigo) ; à ajuster avec Félicien.
