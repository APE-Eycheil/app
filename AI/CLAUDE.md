# AI/

Docs et espaces de travail pour l'agent. Les cartes du code sont dans les `CLAUDE.md` de `js/`, `css/`, `supabase/`.

## Docs thématiques
| Contexte | Fichier |
|---|---|
| Style de code, réutilisation, sécurité du DOM | `CodingStyle.md` |
| Conception transverse : rôles, données, auth, photos | `Architecture.md` |
| Tests : parcours, droits par rôle, Playwright | `Testing.md` |

## Dossiers
| Dossier | Rôle |
|---|---|
| `Pending/` | Un fichier temporaire par fonctionnalité → `Pending/README.md` |

## Règles de travail
- Ce dossier, les `CLAUDE.md` du code, `cahier-des-charges.md` et `TroobleshootingLogs.md` sont la seule mémoire : rien de durable ailleurs.
- Un parcours de test qui resservira devient un script dans `tests/` (ligne dans son `CLAUDE.md`), jamais laissé dans le scratchpad.
