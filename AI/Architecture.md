# Architecture

Résumé de conception. Besoins complets et décisions : `cahier-des-charges.md`.

## Couches
```
index.html (vues) → js/<vue>.js → js/data.js → Supabase (Auth · Postgres+RLS · Storage privé)
```
La page est publique ; **toute la protection est dans les RLS**. Une vue ne contient jamais de règle de sécurité, seulement de l'affichage.

## Rôles (cahier §3)
`profiles.role` ∈ membre / bureau / admin ; `profiles.status` ∈ en_attente / valide / refuse / desactive ; `profiles.is_treasurer` (droit transmissible, indépendant du rôle) = seul à vérifier / pointer les dépenses et à récupérer les justificatifs. Compte en attente : aucun accès.

## Auth (cahier §4)
E-mail + mot de passe (aucun mail envoyé : confirmation désactivée). Le prénom affiché vient des métadonnées d'inscription (`firstname`) et vit dans `profiles`. Inscription = `signUp` avec `invite_code` en métadonnée ; des triggers sur `auth.users` (`0002_inscription`) vérifient le code (haché dans `app_settings`), l'effacent des métadonnées et créent le profil `en_attente`. Pas de captcha : code + validation manuelle + limitation des tentatives. Mot de passe réinitialisé à la main par un admin.

## Dépenses (cahier §5.5)
Statuts : `annoncé` → `justificatif reçu` → `vérifié` → `pointé banque` (+ `refusé`), indicateur `remboursé` à part. Photos : bucket privé, redimensionnées côté appareil, supprimées de l'appli quand le trésorier clique « Justificatif récupéré » (la dépense garde « archivé par le trésorier »). Une dépense ne se supprime pas : elle s'annule ou se refuse. Export CSV au format de `tresorerie/journal.csv` du dossier APE.

## Données
Tables et champs : cahier §6. Chaque table : `id`, `created_at`, `updated_at`, `created_by`, RLS activée dès la création.

## Hors périmètre v1
Paiement en ligne, compta complète, envoi WhatsApp automatique, boutiques d'applis, notifications push, hors ligne (phase 4).
