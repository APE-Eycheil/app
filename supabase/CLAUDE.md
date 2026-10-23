# supabase/

Base, droits (RLS) et réglages. **Écrire les RLS avant les écrans** qui lisent la table.

| Élément | Rôle |
|---|---|
| `migrations/NNNN_nom.sql` | SQL numéroté, appliqué dans l'ordre ; RLS activée dès la création de chaque table |
| `tests/` | Tests de droits par rôle (à créer en phase 1) |

## Réglages du projet (sécurité)
- Data API : **activée**. « Automatically expose new tables » : **désactivé**. « Enable automatic RLS » : **activé**.
- Conséquence : toute migration qui crée une table écrit ses `GRANT` explicites, au rôle `authenticated` uniquement et seulement les opérations utiles (jamais `anon`, jamais `all`), puis ses politiques RLS. Table sans politique = inaccessible.
- Confirmation par mail désactivée (identifiants `prenom@ape.invalid`) ; limitation des tentatives de connexion activée ; mots de passe 8 caractères minimum.
- Bucket `justificatifs` privé.

## Deux projets : réel et test
- Chaque migration et chaque réglage s'appliquent aux **deux** projets (réel et test), dans le même état. Le fichier de `migrations/` est la source.
- Les tests (droits par rôle, parcours) tournent **uniquement sur le projet test**, jamais sur le réel (comptes fictifs, données jetables).
- Tant que l'appli n'est pas en production, le projet réel peut recevoir une migration directement. Dès la prod, le test passe d'abord.
- Accès MCP : un serveur par projet dans `.mcp.json` (`supabase` = réel, `supabase-test` = test).

## Invariants
- Le dépôt est public : seule la clé `anon` est utilisée côté page ; `service_role` n'entre jamais dans le dépôt.
- Statut `valide` requis pour toute lecture ; `is_validated()` / `is_admin()` (security definer) servent aux politiques.
- Seuls les admins modifient rôle, statut, `is_treasurer`. Seul le trésorier (`is_treasurer`) vérifie / pointe les dépenses.
- Le code d'invitation est vérifié par une fonction SQL, stocké haché dans `app_settings`, jamais dans la page.
- Un membre ne lit que ses propres dépenses ; bureau et admins voient toutes les dépenses ; photos : bucket privé, accès selon les mêmes droits.
- Réglages du tableau de bord (confirmation mail désactivée, limitation des tentatives, bucket privé) : à la main, listés dans le Pending de la phase.
