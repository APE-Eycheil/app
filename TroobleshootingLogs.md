# Troubleshooting

Pièges rencontrés et post-mortems : ce qui a cassé, pourquoi, comment l'éviter.

## Inscription : un mauvais code d'invitation arrive en `unexpected_failure`
- **Symptôme** : l'API REST brute renvoie « Code d'invitation invalide », mais `supabase-js` donne `AuthApiError` « Database error saving new user », code `unexpected_failure`.
- **Cause** : le trigger `check_invite_code` lève une exception ; GoTrue la masque côté client.
- **À faire** : se baser sur `error.code` (`SIGNUP_ERROR_MESSAGES` dans `js/auth.js`), jamais sur `error.message`.

## Le code d'invitation restait dans `raw_user_meta_data`
- **Cause** : GoTrue réécrit les métadonnées après l'insertion ; effacer le code dans le trigger `before insert` ne suffit pas.
- **À faire** : trigger `z_strip_invite_code` sur `insert or update of raw_user_meta_data` (`0002_inscription`).

## Tests Playwright : la redirection de `config.js` disparaît après un rechargement
- **Cause** : le service worker du site prend la main au rechargement ; ses requêtes ne passent pas par `page.route`, la page retombe sur le projet réel.
- **À faire** : contexte avec `service_workers='block'` (`tests/inscription.py`).

## `.invalid` refusé à l'inscription
- **Symptôme** : `email_address_invalid` sur `prenom@ape.invalid` tant que la confirmation par mail était active ; accepté une fois désactivée. L'identifiant est devenu l'e-mail réel (cahier §4.4).
