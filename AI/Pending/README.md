# AI/Pending

Un fichier **temporaire** par fonctionnalité : tout ce dont seule son implémentation a besoin (étapes ponctuelles, réglages Supabase à faire à la main, valeurs à copier). Les règles durables vont dans le `CLAUDE.md` du dossier concerné. Créé à l'étape 3 du workflow (`CLAUDE.md` racine), consommé à l'étape 4, **supprimé quand il est vide**.

## Modèle : `AI/Pending/<Feature>.md`
```
# <Feature> — pending

Goal: une ligne — le Pourquoi.
Docs written: liste des CLAUDE.md / AI/*.md qui la décrivent.

## Code (à implémenter)
- [ ] chemin/fichier — ce qu'il doit faire (noms issus des CLAUDE.md)

## Base / Supabase (à la main ou en SQL)
- [ ] migration / réglage / bucket — valeur

## Vérifier
- [ ] test ou parcours qui prouve que ça marche
```

- Chemins, noms et valeurs concrets ; pas de prose.
- Jamais d'identifiant, de clé secrète ni de mot de passe dans un Pending (dépôt public).
