# Cahier des charges — Appli d'organisation de l'APE d'Eycheil

Version 0.2 — 2026-10-23 (v0.1 le même jour ; v0.2 : dépôt créé, décisions de Félicien intégrées, voir §14). Rédigé à partir des échanges avec Félicien (trésorier) et de l'analyse des groupes WhatsApp A et B. Contexte, besoins et décisions : [../synthese/besoins-et-outil-appli.md](../synthese/besoins-et-outil-appli.md).
Les points marqués **[À VALIDER]** ne sont pas tranchés ; les points marqués **[À VÉRIFIER]** sont des informations externes (tarifs, limites) à contrôler au moment du choix.

---

## 1. Objectif
Offrir au bureau et aux parents impliqués dans l'APE **un seul endroit** pour organiser les événements : qui fait quoi et quand, les listes de courses, les dépenses avec photo de facture, les présences et les créneaux de bénévolat. Remplacer ce qui se perd aujourd'hui dans les fils WhatsApp (tâches sans responsable, décisions oubliées, factures égarées, plannings recomposés à la main).

**Critères de réussite**
- Au loto (mars 2027, date **[À VÉRIFIER]**), toutes les tâches, courses, dépenses et créneaux de bénévoles passent par l'appli.
- 100 % des dépenses saisies ont une photo de justificatif ou un statut explicite « justificatif manquant ».
- Une personne qui ouvre l'appli sait en moins de 10 secondes ce qu'elle a à faire.
- Le trésorier peut exporter les dépenses vers `tresorerie/journal.csv` sans ressaisie.

## 2. Périmètre
**Dans le périmètre :** événements, tâches, listes (courses, matériel), dépenses et justificatifs, présence (RSVP), créneaux de bénévoles, sondages et décisions, contacts/fournisseurs, comptes avec validation manuelle, export.

**Hors périmètre (v1) :** paiement en ligne, comptabilité complète (le journal reste le livre de comptes), envoi automatique de messages WhatsApp, application dans les boutiques (Google Play / App Store), gestion des adhésions, stockage de mots de passe d'autres services (accès bancaires, comptes d'événements : jamais dans l'appli).

## 3. Utilisateurs et rôles
Public : le bureau et les parents d'élèves impliqués dans l'APE. Accès réservé aux personnes de l'école. Environ 10 à 30 comptes.

| Rôle | Qui | Droits |
|---|---|---|
| **Administrateur** | Trésorier (Félicien) + un autre membre du bureau **[À VALIDER]** | Valider/refuser/désactiver les comptes, réinitialiser un mot de passe, changer les rôles, changer le code d'invitation, exporter, supprimer |
| **Trésorier** (droit supplémentaire, transmissible) | Félicien | **Seul à vérifier et pointer les dépenses**, à télécharger puis supprimer les justificatifs, à marquer un remboursement |
| **Bureau** | Présidente, secrétaire, vice-trésorière, vice-secrétaire | Créer/modifier événements, tâches, listes, créneaux, sondages, décisions ; voir toutes les dépenses ; **ne vérifie ni ne pointe** les dépenses |
| **Membre** | Parents impliqués | Voir les événements ; créer des tâches et des listes ; se positionner (« je m'en occupe », « j'achète ») ; cocher présence et créneaux ; **ajouter des dépenses** avec photo ; voir ses propres dépenses |
| **En attente** | Compte demandé, pas encore validé | Aucun accès aux données |

Règle : un membre voit ses propres dépenses et leur statut ; le bureau et les administrateurs voient toutes les dépenses.

## 4. Comptes et authentification
**Décidé :** identifiant = prénom, mot de passe personnel, **aucun numéro de téléphone ni mail collecté**, validation manuelle par un administrateur, appareil resté connecté après la première connexion.

### 4.1 Demande d'accès (au choix)
- **Voie A — formulaire dans l'appli :** prénom (avec initiale du nom si doublon), mot de passe souhaité, code d'invitation. Le compte est créé au statut **en attente**.
- **Voie B — message à Félicien :** l'administrateur crée le compte lui-même depuis l'écran d'administration (statut directement « validé »).
- Dans les deux cas c'est un administrateur qui valide. Aucune donnée n'est accessible avant validation.

### 4.2 Code d'invitation
- Un code court communiqué dans les groupes WhatsApp (jamais sur les affiches publiques).
- **Vérifié côté serveur**, jamais dans le code de la page (le dépôt est public). Stocké sous forme hachée.
- L'administrateur peut le changer à tout moment ; l'ancien code cesse de fonctionner.

### 4.3 Mot de passe
- 8 caractères minimum, pas de mot de passe vide. Les mots de passe ne sont **jamais stockés en clair ni dans notre code** : le service d'authentification les **hache** (empreinte irréversible, plus sûr qu'un chiffrement que l'on pourrait déchiffrer).
- Pas de récupération automatique : **l'administrateur réinitialise à la main** (écran dédié, mot de passe provisoire à changer à la connexion).
- **Protection anti-robot (décidé) : pas de captcha séparé**, elle repose sur le système d'identification : code d'invitation obligatoire, **validation manuelle** de chaque compte (un faux compte n'accède à rien), limitation des tentatives de connexion et d'inscription fournie par le service.

### 4.4 Réalisation technique (proposition)
Le service d'authentification type Supabase exige un identifiant de forme « mail ». Solution : générer en interne un **identifiant technique** (par exemple `prenom-initiale@ape.invalid`) jamais affiché, que l'utilisateur ne voit pas. L'utilisateur saisit son prénom ; l'appli convertit en identifiant technique. Pas de confirmation par mail. Le statut « validé » est tenu dans une table de profils et **contrôlé par les règles de sécurité de la base**, pas par la page. **[À VÉRIFIER]** que l'offre gratuite autorise ce fonctionnement sans mail.

## 5. Exigences fonctionnelles
Priorités : **P1** = indispensable au premier test, **P2** = important, **P3** = confort. Les phases sont décrites au §10.

### 5.1 Événements (P1)
- Créer/modifier/archiver un événement : titre, type (vide ta chambre, loto, kermesse, vente, réunion, autre), dates de début et fin, lieu, description, statut (à venir, en cours, terminé, annulé).
- Page événement = tableau de bord : tâches ouvertes, listes de courses, créneaux manquants, dépenses de l'événement (total), présence.
- Section **« Leçons pour la prochaine fois »** ajoutable après l'événement (texte libre, par événement).
- *Critère d'acceptation :* depuis la page d'un événement, je vois en un écran le nombre de tâches non faites, le nombre de créneaux sans bénévole et le total des dépenses.

### 5.2 Tâches (P1)
- Champs : titre, **quoi** (description), **qui** (un ou plusieurs responsables, ou « à désigner »), **quand** (échéance), **comment** (notes, consignes), statut, priorité (normale, urgente), événement lié (facultatif), commentaires.
- Statuts : à faire, en cours, fait, bloqué (avec motif).
- Bouton **« Je m'en occupe »** sur toute tâche « à désigner ».
- Vues : **Mes tâches**, **Toutes les tâches** (filtres : événement, personne, statut, échéance), **À désigner**, **En retard**.
- Historique des changements d'état (qui, quand), comme dans `taches/suivi.md`.
- Import initial des tâches actuelles de `taches/suivi.md`.
- *Critère :* je clique sur « Je m'en occupe » ; la tâche apparaît dans Mes tâches, et les autres voient mon prénom.

### 5.3 Présence / RSVP (P1)
- Pour un événement, une réunion ou une activité : réponse **oui / non / peut-être** en un clic, modifiable.
- Récapitulatif visible : nombre de oui, liste des prénoms, liste des « pas encore répondu » (bureau).
- *Critère :* la présidente voit qui n'a pas répondu pour la réunion du jeudi sans relire un fil.

### 5.4 Listes de courses et de matériel (P2)
- Une liste par événement (ou libre) ; type : courses, matériel à apporter, checklist (samedi / dimanche / jour J).
- Ligne : article, quantité, unité, **magasin**, **qui achète/apporte**, statut (à acheter, acheté, annulé), prix estimé, commentaire.
- Regroupement par magasin (Carrefour, Action, Netto…) pour partir faire les courses.
- Cocher « acheté » propose de **créer la dépense** correspondante (montant, photo de la facture) et rattache les lignes à cette dépense.
- Dupliquer une liste d'un événement précédent (ex. liste du loto réutilisée).
- Version **imprimable** d'une liste ou d'une checklist (utile jour J sans réseau).
- *Critère :* je coche 5 articles achetés chez Action, je saisis un seul montant avec la photo ; les 5 lignes sont liées à une seule dépense.

### 5.5 Dépenses et justificatifs (P2, valeur centrale pour le trésorier)
- **Tout utilisateur validé** peut ajouter une dépense. Champs : date d'achat, montant TTC, fournisseur/magasin, description, événement lié, **qui a payé** (membre ou « chèque/compte de l'asso »), **mode de remboursement attendu** (aucun, chèque, virement, à définir), **photo(s) du justificatif**.
- Photo prise depuis l'appareil ; redimensionnée côté appareil avant l'envoi (économie de stockage) ; plusieurs photos possibles.
- **Les justificatifs transitent par l'appli, ils n'y sont pas archivés (décidé).** Le trésorier **télécharge** les photos (une par une ou en lot) vers son propre dossier, puis clique sur **« Justificatif récupéré »** : la photo est **supprimée de l'appli**, la dépense reste avec l'indication « justificatif archivé par le trésorier ». Un rappel liste les justificatifs en attente de récupération.
- **Statuts** (alignés sur `tresorerie/journal.csv`) :
  1. `annoncé` : saisi sans justificatif ;
  2. `justificatif reçu` : photo jointe, ou photo déjà récupérée et supprimée (« archivé par le trésorier ») ;
  3. `vérifié` : contrôlé par le trésorier ;
  4. `pointé banque` : retrouvé sur un relevé ;
  5. `refusé` : avec motif.
  À part, un indicateur **remboursé : oui/non** (date, moyen).
- **Règle métier (CLAUDE.md) :** une dépense ne peut passer à `pointé banque` que si un justificatif est joint **et** une référence de relevé est saisie. Un justificatif « archivé par le trésorier » compte comme joint. **Seul le trésorier vérifie et pointe, et il vérifie chaque dépense (décidé).**
- Vues : Mes dépenses ; À vérifier (trésorier) ; À rembourser (regroupées par personne, avec total dû) ; Par événement (total, par catégorie).
- Notification interne au trésorier à chaque nouvelle dépense.
- **Export CSV** au format de `tresorerie/journal.csv` (colonnes à reprendre du fichier existant) ; **téléchargement des photos en lot** (archive) pour la récupération par le trésorier.
- Une dépense ne se supprime pas : elle s'annule ou se refuse (traçabilité).
- *Critère :* après l'événement, le trésorier obtient en un clic la liste des sommes à rembourser, par personne, avec les justificatifs.

### 5.6 Créneaux de bénévoles (P2)
- L'organisateur définit des **créneaux** : titre (buvette matin, maquillage…), début/fin, nombre de personnes nécessaires, notes.
- Chacun s'inscrit/se désinscrit en un clic ; compteur « 1/2 inscrits », mise en évidence des créneaux manquants.
- Vue planning par jour ; vue « mes créneaux ».
- Accessible aussi aux parents occasionnels dotés d'un compte validé (seulement créneaux, présence et leurs dépenses).
- *Critère :* la grille « 2 matin / 4 midi / 2 après-midi » du vide ta chambre se saisit en moins de 5 minutes et se remplit sans intervention du bureau.

### 5.7 Sondages et décisions (P3)
- **Sondage** : question, options, une ou plusieurs réponses, date limite, résultat visible (nominatif ou anonyme au choix de l'auteur).
- **Décision** : texte, date, événement lié, auteur, éventuellement lien vers le sondage. Page « Décisions » consultable et filtrable (réponse à « on avait dit quoi ? »).
- Comptes rendus de réunion : texte + liste des décisions + tâches issues de la réunion.

### 5.8 Contacts et fournisseurs (P3)
- Fiches : organisme (boulangerie, imprimerie, brasserie, mairie…), rôle, notes, **tarifs/devis comparés** (texte), événements liés.
- **Aucun numéro de téléphone, mot de passe ni donnée bancaire** dans l'appli ; l'accès à ces fiches est limité au bureau. Pas de données sur des particuliers hors organisations.

### 5.9 Matériel et stock (P3)
- Inventaire : objet, quantité, **où il est / qui l'a**, état, prêté à, date de retour.
- Reprise du contenu de `synthese/materiel-et-stock.md` (restes de boissons, gaufriers, percolateur, machine à hot dog…).

### 5.10 Calendrier (P3)
- Vue calendrier mensuel/agenda regroupant événements, réunions, échéances de tâches, créneaux. Échéances administratives (subventions avant le 31 mars, etc.).

### 5.11 Diffusion vers WhatsApp (P2)
WhatsApp n'a pas d'envoi automatique gratuit. À la place : **bouton « Copier le résumé »** qui génère un texte prêt à coller dans le groupe (tâches de la semaine, créneaux manquants, rappel de présence). **Pas de notifications push pour l'instant (décidé)** ; possible plus tard (sur iPhone, uniquement si l'appli est ajoutée à l'écran d'accueil).

### 5.12 Administration (P1)
- Liste des comptes en attente : **valider / refuser**.
- Liste des comptes : changer le rôle, désactiver, réinitialiser le mot de passe.
- Changer le code d'invitation.
- Journal d'activité (connexions refusées, validations, vérifications de dépenses, exports).

## 6. Modèle de données (proposition)
Toutes les tables ont `id`, `created_at`, `updated_at`, `created_by`.

| Table | Champs principaux |
|---|---|
| `profiles` | prénom, nom affiché, rôle (admin, bureau, membre), statut (en_attente, validé, refusé, désactivé) |
| `events` | titre, type, début, fin, lieu, description, statut, leçons |
| `tasks` | event_id, titre, description (quoi), notes (comment), échéance, statut, priorité, motif_blocage |
| `task_assignees` | task_id, profile_id |
| `task_log` | task_id, profile_id, ancien/nouveau statut, date |
| `task_comments` | task_id, profile_id, texte |
| `rsvp` | event_id, profile_id, réponse (oui, non, peut-être) |
| `lists` | event_id, titre, type (courses, matériel, checklist) |
| `list_items` | list_id, libellé, quantité, unité, magasin, assigné, statut, prix_estimé, expense_id |
| `expenses` | event_id, date_achat, montant, fournisseur, description, payeur_id (ou « asso »), mode_remboursement, statut, remboursé, date_remboursement, référence_relevé, note_trésorier, vérifié_par/le |
| `expense_files` | expense_id, chemin du fichier (stockage privé), taille |
| `shifts` | event_id, titre, début, fin, nombre_requis, notes |
| `shift_signups` | shift_id, profile_id |
| `polls`, `poll_options`, `poll_votes` | sondages |
| `decisions` | event_id, texte, date, auteur, poll_id |
| `contacts` | organisme, rôle, notes, tarifs |
| `inventory` | objet, quantité, localisation/détenteur, état, prêté_à, retour |
| `app_settings` | code d'invitation (haché), paramètres |
| `audit_log` | profile_id, action, objet, date |

## 7. Architecture et technologies
| Brique | Choix proposé | Remarque |
|---|---|---|
| Interface | **HTML / CSS / JavaScript** modules, **sans étape de compilation** | Facile à entretenir, rien à installer pour modifier |
| Hébergement de la page | **GitHub Pages**, dépôt `https://github.com/APE-Eycheil/app` (organisation GitHub de l'APE, **créée**) | Adresse prévue : `https://ape-eycheil.github.io/app/` **[À VÉRIFIER après activation de Pages]**. Dépôt public (nécessaire pour Pages gratuit **[À VÉRIFIER]**) : code seulement, **jamais de données ni de secrets** |
| Données, authentification, stockage des photos | **Supabase** (offre gratuite) | **[À VÉRIFIER]** limites actuelles : stockage, bande passante, mise en pause en cas d'inactivité |
| « App » | **PWA** : manifeste, icônes, service worker | Installable depuis le navigateur ; **aucune boutique** |
| Distribution | Lien + **QR code** + notice Android/iPhone | Adresse issue du nom de l'organisation et du dépôt : **ne jamais renommer l'organisation ni le dépôt** (le QR code casserait). Pas de nom de domaine propre. L'appli étant dans le sous-dossier `/app/`, tous les chemins (manifeste, service worker, icônes) doivent être **relatifs** |
| Bibliothèque de base | client Supabase chargé depuis un CDN en version figée, ou copié dans le dépôt | |

### 7.1 Sécurité
- Le dépôt étant public, la clé « publique » du service est visible : c'est normal. **Toute la protection repose sur les règles de sécurité de la base (Row Level Security)**, écrites et testées pour chaque table :
  - non connecté ou en attente : aucun accès ;
  - membre : lecture des événements, tâches, listes, créneaux ; écriture sur ce qu'il crée ; dépenses : lecture/écriture seulement des siennes ;
  - bureau : lecture de toutes les dépenses, écriture des événements/créneaux ;
  - administrateur : tout, y compris vérification et pointage.
- Aucune clé secrète (service role) dans le dépôt ni dans la page.
- Stockage des photos : **bucket privé**, accès par liens temporaires, selon les mêmes droits que les dépenses.
- Protection contre l'injection de contenu (échappement de tout texte saisi), HTTPS uniquement, en-têtes raisonnables.
- Limitation du nombre de connexions et d'inscriptions ; anti-robot par code d'invitation + validation manuelle (§4.3).
- **Aucune donnée sensible dans l'appli** : pas de mot de passe d'autres services, pas de donnée bancaire, pas de téléphone, pas de santé. L'appli est un outil d'organisation, pas un coffre.

### 7.2 Vie privée (RGPD)
- Données collectées : prénom, rôle, contenu saisi, photos de factures. **Pas de téléphone, pas de mail, pas de données de santé, pas de nom d'enfant.**
- Les justificatifs peuvent contenir des données de tiers : consigne de cadrer la facture ; la photo n'est visible que du saisissant et du trésorier (le bureau voit la dépense, pas la photo **[À VALIDER]**) ; elle est **supprimée de l'appli dès que le trésorier l'a récupérée** (décidé). La conservation légale des justificatifs relève du trésorier, hors de l'appli (durée **[À VÉRIFIER]** avec les obligations de l'association).
- Information aux membres à l'inscription (courte mention : finalité, qui voit quoi, comment être supprimé) ; suppression/anonymisation d'un compte à la demande.
- Les identifiants GitHub/Supabase ne sont écrits nulle part dans ce dossier.

### 7.3 Sauvegarde et export
- Export CSV/JSON complet (administrateur) au minimum après chaque événement.
- Les photos de justificatifs sont récupérées par le trésorier dans son dossier puis supprimées de l'appli ; **c'est lui qui assure leur conservation**. Faire une copie de sauvegarde de ce dossier.
- Le journal `tresorerie/journal.csv` reste la référence comptable ; l'appli le **complète**, elle ne le remplace pas.

## 8. Exigences non fonctionnelles
- **Mobile d'abord** : utilisable dès 360 px de large, à une main ; boutons larges ; prise de photo directe.
- Tout en **français**.
- Rapidité : écran principal utile en moins de 3 secondes en 4G.
- **Hors ligne : reporté (décidé)**, à étudier après les phases 1 à 3 (phase 4). Il faudrait alors : consultation des dernières listes, checklists et planning ; saisie hors ligne mise en attente puis synchronisée. D'ici là, la **version imprimable** des listes (phase 2) couvre le jour J.
- Accessibilité : contrastes suffisants, tailles de texte lisibles, utilisable au clavier, thème clair/sombre automatique.
- Navigateurs : Chrome/Edge/Firefox récents, Safari iPhone et Android récents.
- Maintenabilité : pas de compilation, code commenté, dossiers simples, mise à jour par simple envoi au dépôt.
- Coût : **0 €** au départ (pas de nom de domaine, pas de SMS) ; tout coût éventuel (dépassement de l'offre gratuite) décidé par le bureau.

## 9. Mise en place (hors code)
1. ~~Créer l'organisation GitHub~~ **Fait** : `APE-Eycheil`, dépôt `app`. Reste : ajouter un **second propriétaire** du bureau **[À VALIDER]** et ne jamais renommer.
2. Créer le projet de base de données (compte rattaché à l'asso, pas à une personne ; second administrateur).
3. Activer GitHub Pages sur le dépôt ; vérifier l'adresse réelle (`https://ape-eycheil.github.io/app/`).
4. Générer le **QR code** une fois l'adresse vérifiée (elle ne change plus).
5. Préparer la **notice d'installation** Android et iPhone (captures) et un texte de présentation à l'école.
6. Définir le **code d'invitation** initial.
7. Informations d'accès : conservées par Félicien et le second administrateur, **hors du dossier du projet**.

## 10. Phases et planning (proposition)
Calendrier à ajuster ; objectif : appli stable avant le loto (mars 2027). Un premier usage réel avant (chocolats de Noël, réunion maîtresses du 2026-11-05) n'est pas obligatoire.

| Phase | Contenu | Livrable utilisable |
|---|---|---|
| **0. Mise en place** | §9 : organisation, base, hébergement, squelette PWA, règles de sécurité de base | Page vide installable, connexion |
| **1. Socle (MVP)** | Comptes + validation, administration, événements, tâches, présence | Remplace `taches/suivi.md` pour le bureau |
| **2. Argent et courses** | Listes, dépenses + photos, vérification/pointage, export CSV, résumé WhatsApp, impression | Usage par tous pour les achats |
| **3. Bénévoles** | Créneaux, sondages, décisions, comptes rendus | Planning des bénévoles du loto |
| **4. Compléments** | Contacts, matériel, calendrier, hors ligne, notifications | Confort |

Repères : fin 2026 = phase 1 testée par le bureau ; janvier-février 2027 = phases 2 et 3 ; février = ouverture aux parents impliqués ; mars = loto, premier test en grandeur nature.

## 11. Tests et recette
- **Droits** : pour chaque rôle, vérifier à la main et automatiquement que les accès refusés le sont (un membre ne lit pas les dépenses d'un autre ; un compte en attente ne lit rien).
- **Parcours clés** : inscription → validation → première connexion → « je m'en occupe » ; achat → photo → vérification → remboursement → export ; créneau → inscription/désinscription.
- **Appareils** : au moins un Android et un iPhone, en 4G faible.
- **Recette finale** : une répétition complète sur un faux événement avec 3 à 5 personnes du bureau avant l'ouverture générale.

## 12. Données initiales à importer
- Tâches de `taches/suivi.md` (avec responsables par prénom).
- Dépenses annoncées de `tresorerie/journal.csv` (statuts conservés ; aucune ligne marquée « pointée » sans justificatif).
- Matériel de `synthese/materiel-et-stock.md`.
- Événements de `synthese/evenements-et-calendrier.md`.
- **Pas d'import** de numéros, identifiants, IBAN ni mots de passe (règle absolue du projet).

## 13. Risques
| Risque | Parade |
|---|---|
| Dépendance à une personne (Félicien) | Organisation GitHub, second administrateur, export régulier, doc de passation |
| Faille de sécurité (dépôt public) | Règles de base testées, pas de secret dans le code, revue avant chaque ouverture |
| Faible adoption par les parents | Tout en un clic, QR code, première utilisation à la réunion, WhatsApp comme relais |
| Limites de l'offre gratuite dépassées (photos) | Photos compressées et supprimées après récupération par le trésorier, donc stockage quasi vide |
| Justificatif perdu après suppression de l'appli | Le trésorier confirme la bonne réception avant de cliquer sur « Justificatif récupéré » ; sauvegarde de son dossier |
| Service gratuit modifié ou mis en pause | Exports réguliers, possibilité de changer de service (code organisé en couches) |
| iPhone : installation moins évidente | Notice illustrée, appli utilisable sans installation |
| Données personnelles sensibles dans les justificatifs | Consigne de cadrage, accès limité, suppression à la demande |

## 14. Décisions à trancher avant de coder
**Décidé le 2026-10-23 (Félicien)**
- Organisation et dépôt : `https://github.com/APE-Eycheil/app` (créé).
- Pas de nom de domaine propre : l'adresse découle de GitHub.
- Anti-robot par le système d'identification (code d'invitation, validation manuelle, mots de passe hachés), pas de captcha ; aucune donnée sensible dans l'appli.
- Hors ligne : à étudier ensuite (phase 4).
- Pas de notifications pour l'instant.
- Le trésorier seul vérifie et pointe les dépenses.
- Justificatifs : transmis au trésorier, supprimés de l'appli une fois récupérés.
- Date du loto 2027 : pas encore connue.

**Reste à trancher**
1. Second propriétaire de l'organisation GitHub (un autre membre du bureau).
2. Le bureau voit-il les photos de justificatifs, ou seulement la dépense ? (proposition : photos visibles du saisissant et du trésorier seulement)
3. Date du loto 2027 (pour caler le calendrier).
4. Vérifications techniques : GitHub Pages sur le dépôt, limites de l'offre gratuite de la base, connexion sans mail.

## 15. Consignes pour le développement
- Respecter strictement les règles du `CLAUDE.md` : français, aucune donnée sensible recopiée, pas de « pointé » sans justificatif.
- Toujours livrer par petites étapes testables (une phase = une version utilisable).
- Écrire les règles de sécurité **avant** les écrans qui utilisent les données.
- Ne jamais mettre de secret, de donnée réelle ni de photo dans le dépôt Git.
- Garder le code simple (pas de compilation, pas de dépendances inutiles) pour qu'une autre personne puisse reprendre.
