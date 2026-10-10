import { LessonCategory } from "@/models/Lesson";
import type { SeedLesson } from "./lessons";

export const frenchSeedLessons: SeedLesson[] = [
  {
    title: "Introduction au Français FLE : Cadre et Objectifs",
    slug: "fr-01-introduction-et-objectifs",
    sectionNumber: 101,
    category: "Gramática" as LessonCategory,
    order: 101,
    language: "francais",
    content: `# Introduction au Français FLE : Cadre et Objectifs

Bienvenue dans le cursus complet de langue française ! Ce cours a été élaboré pour les apprenants et enseignants désireux d'atteindre une maîtrise authentique, fluide et professionnelle du français (niveaux B2, C1 et C2).

---

### Pourquoi ce manuel et cette plateforme ?
Le passage d'un niveau intermédiaire à un niveau avancé exige de dépasser la simple traduction mot à mot. En français, la précision lexicale, la maîtrise des modes verbaux (notamment le subjonctif) et l'élégance du registre soutenu sont indispensables dans un contexte universitaire ou professionnel international.

> **Objectif clé :** Éviter les pièges récurrents des hispanophones et lusophones (faux amis, prépositions, accords complexes) et consolider les compétences requises pour les certifications officielles (**DELF B2, DALF C1/C2, TCF, TEF**).

---

### Structure du parcours
1. **Grammaire et structure :** Le subjonctif, la concordance des temps, les pronoms relatifs complexes (*auquel*, *duquel*), le passif et les inversions.
2. **Orthographe et accords :** Accords du participe passé avec *avoir* et les verbes pronominaux.
3. **Vocabulaire et registre soutenu :** Lexique de l'argumentation, faux amis critiques, homophones complets et tournures administratives.
4. **Pratique interactive & Jeux :** Jeux d'identification d'objets du quotidien (**C'est quoi ?**), entraînements d'écoute et exercices d'application.`,
  },
  {
    title: "Le Subjonctif : Maîtrise, Déclencheurs et Pièges",
    slug: "fr-02-le-subjonctif-declencheurs-et-pieges",
    sectionNumber: 102,
    category: "Gramática" as LessonCategory,
    order: 102,
    language: "francais",
    content: `# Le Subjonctif : Maîtrise, Déclencheurs et Pièges

Le subjonctif est le mode du doute, du sentiment, de la volonté, de la nécessité et de l'incertitude. Il est systématiquement évalué dans les examens de niveau avancé.

---

### 1. Quand utiliser obligatoirement le subjonctif ?
Le subjonctif s'emploie principalement dans les propositions subordonnées introduites par **que**, lorsque les sujets de la principale et de la subordonnée sont différents :

| Catégorie | Déclencheurs fréquents | Exemple |
| :--- | :--- | :--- |
| **Volonté / Souhait** | vouloir que, exiger que, souhaiter que | *Je veux qu'elle **vienne** demain.* |
| **Émotion / Sentiment** | être ravi que, regretter que, avoir peur que | *Nous regrettons qu'il **soit** absent.* |
| **Nécessité impersonnelle** | il faut que, il est indispensable que | *Il faut que tu **finisses** ce rapport.* |
| **Doute / Négation** | douter que, ne pas penser que, ne pas croire que | *Je ne crois pas qu'il **ait** compris.* |
| **Conjonctions** | bien que, pour que, avant que, à moins que | *Bien qu'il **fasse** froid, nous sortons.* |

> ⚠️ **Piège classique :**
> - *Je pense que tu **as** raison.* (Certitude → Indicatif)
> - *Je **ne** pense **pas** que tu **aies** raison.* (Doute/négation → Subjonctif)
> - *Espérer que* est TOUJOURS suivi de l'indicatif : *J'espère qu'il **viendra**.* (Jamais le subjonctif !)

---

### 2. Conjugaisons irrégulières indispensables

| Verbe | Présent du subjonctif (que je / que tu / qu'il / que nous / que vous / qu'ils) |
| :--- | :--- |
| **Être** | que je sois, tu sois, il soit, nous soyons, vous soyez, ils soient |
| **Avoir** | que j'aie, tu aies, il ait, nous ayons, vous ayez, ils aient |
| **Faire** | que je fasse, tu fasses, il fasse, nous fassions, vous fassiez, ils fassent |
| **Aller** | que j'aille, tu ailles, il aille, nous allions, vous alliez, ils aillent |
| **Pouvoir** | que je puisse, tu puisses, il puisse, nous puissions, vous puissiez, ils puissent |
| **Savoir** | que je sache, tu saches, il sache, nous sachions, vous sachiez, ils sachent |`,
  },
  {
    title: "La Concordance des Temps et le Conditionnel",
    slug: "fr-03-concordance-des-temps-et-conditionnel",
    sectionNumber: 103,
    category: "Gramática" as LessonCategory,
    order: 103,
    language: "francais",
    content: `# La Concordance des Temps et le Conditionnel

La concordance des temps régit les relations chronologiques (antériorité, simultanéité, postériorité) entre la proposition principale et la subordonnée.

---

### 1. Tableau de concordance à l'indicatif

| Temps de la principale | Rapport temporel | Temps de la subordonnée | Exemple |
| :--- | :--- | :--- | :--- |
| **Présent** | Simultanéité | Présent | *Je sais qu'il **travaille**.* |
| **Présent** | Antériorité | Passé composé | *Je sais qu'il **a travaillé**.* |
| **Présent** | Postériorité | Futur simple | *Je sais qu'il **travaillera**.* |
| **Passé** | Simultanéité | Imparfait | *Je savais qu'il **travaillait**.* |
| **Passé** | Antériorité | Plus-que-parfait | *Je savais qu'il **avait travaillé**.* |
| **Passé** | Postériorité | Conditionnel présent | *Je savais qu'il **travaillerait**.* |

---

### 2. Les nuances du Conditionnel
Le conditionnel exprime le potentiel, l'atténuation de politesse ou l'irréel :
- **Politesse :** *Pourriez-vous m'accorder un instant ?*
- **Hypothèse présente (Si + Imparfait → Conditionnel présent) :** *Si j'avais le temps, je **voyagerais** davantage.*
- **Hypothèse passée irréelle (Si + Plus-que-parfait → Conditionnel passé) :** *Si j'avais su, je ne **serais pas venu**.*
- **Information journalistique non confirmée :** *Un accord international **aurait été signé** ce matin.*`,
  },
  {
    title: "Orthographe et Accords : Les Pièges du Participe Passé",
    slug: "fr-04-orthographe-et-accords-participe-passe",
    sectionNumber: 104,
    category: "Gramática" as LessonCategory,
    order: 104,
    language: "francais",
    content: `# Orthographe et Accords : Les Pièges du Participe Passé

L'accord du participe passé constitue l'un des exercices les plus sélectifs en rédaction formelle.

---

### 1. Avec l'auxiliaire ÊTRE
Le participe passé s'accorde toujours en genre et en nombre avec le **sujet** :
- *Elles sont **parties** tôt ce matin.*
- *Les dossiers sont **classés** par ordre chronologique.*

---

### 2. Avec l'auxiliaire AVOIR
Le participe passé ne s'accorde **JAMAIS** avec le sujet. Il s'accorde uniquement avec le **Complément d'Objet Direct (COD)** s'il est placé **AVANT** le verbe :
- *J'ai lu les lettres.* (COD *les lettres* est après → invariable: **lu**)
- *Les lettres que j'ai **lues** étaient émouvantes.* (COD *que = les lettres* est avant → accord féminin pluriel: **lues**)
- *Combien d'erreurs as-tu **trouvées** ?* (COD *Combien d'erreurs* est avant → **trouvées**)

---

### 3. Les verbes pronominaux
- Si le pronom réfléchi est COD : accord avec le COD placé avant (*Elle s'est **lavée**.*)
- Si le pronom réfléchi est COI : pas d'accord (*Ils se sont **parlé**.* car on parle *à* quelqu'un ; *Ils se sont **téléphoné**.*)

---

### 4. Les indéfinis : Tout, Tous, Toute, Toutes
- **Adjectif :** s'accorde avec le nom (*Toute la journée*, *Tous les étudiants*).
- **Pronom :** remplace un groupe (*Ils sont tous là* [prononcé /tus/]).
- **Adverbe :** invariable (*Elle est tout heureuse*), sauf devant un adjectif féminin commençant par une consonne ou un h aspiré (*Elle est **toute** contente*, *Elles sont **toutes** honteuses*).`,
  },
  {
    title: "Les Faux Amis Fréquents (Français / Portugais / Anglais)",
    slug: "fr-05-faux-amis-frequents",
    sectionNumber: 105,
    category: "Vocabulário" as LessonCategory,
    order: 105,
    language: "francais",
    content: `# Les Faux Amis Fréquents (Français / Portugais / Anglais)

Pour les locuteurs lusophones et hispanophones, certains mots français ont une forme trompeuse qui induit de graves contresens.

---

### Tableau comparatif des faux amis majeurs

| Mot français | Faux ami en portugais | Vrai sens en français | Équivalent portugais correct |
| :--- | :--- | :--- | :--- |
| **Actuellement** | "Atualmente" (parfois pris pour "na verdade") | En ce moment, à l'heure actuelle | Atualmente |
| **Attendre** | "Atender" | Rester dans l'attente de qqn/qqch | Esperar |
| **Assister à** | "Assistir" (dans le sens soigner/aider) | Être spectateur ou présent | Presenciar / Ver |
| **Blesser** | "Benzer" ou "Beijar" | Faire une blessure physique ou morale | Ferir / Magoar |
| **Entendre** | "Entender" | Percevoir un son par l'ouïe / vouloir dire | Ouvir / Escutar |
| **Journée** | "Jornada de trabalho" | Période du jour du lever au coucher | Dia (duração) |
| **Prétendre** | "Pretender" (avoir l'intention) | Affirmer quelque chose avec insistance | Afirmar / Sustentar |
| **Pousser** | "Puxar" | Exercer une pression vers l'avant | Empurrar |
| **Tirer** | "Tirar" (enlever) | Faire venir à soi / faire feu avec une arme | Puxar / Atirar |
| **Subir** | "Subir" (monter) | Endurer, éprouver un dommage | Sofrer / Suportar |

> 💡 **Conseil mnémotechnique :**
> - *Pour ouvrir une porte :* **Tirez** = puxar (vem para você) / **Poussez** = empurrar (vai para frente).
> - *Pour exprimer une intention :* Ne dites pas *"Je prétends partir"*, mais *"J'ai l'intention de partir"* ou *"Je compte partir"* !`,
  },
  {
    title: "Verbes à Préposition Fixe (À vs De)",
    slug: "fr-06-verbes-a-preposition-fixe",
    sectionNumber: 106,
    category: "Gramática" as LessonCategory,
    order: 106,
    language: "francais",
    content: `# Verbes à Préposition Fixe (À vs De)

La maîtrise des prépositions régies par les verbes est une marque déterminante d'un niveau C1/C2. 

---

### 1. Verbes construits avec la préposition À
- **Commencer à** faire qqch (*Il commence à comprendre.*)
- **Hésiter à** faire qqch (*Elle hésite à accepter cette offre.*)
- **Réussir à** faire qqch (*Nous avons réussi à finaliser le projet.*)
- **Renoncer à** qqch (*Il a renoncé à ses privilèges.*)
- **S'habituer à** qqch (*Je m'habitue au climat.*)
- **Participer à** un événement (*Elle participe à la conférence.*)

---

### 2. Verbes construits avec la préposition DE
- **Accepter de** faire qqch (*Il accepte de nous accompagner.*)
- **Cesser de** faire qqch (*Ils ont cessé de protester.*)
- **Décider de** faire qqch (*La direction a décidé d'embaucher.*)
- **Refuser de** faire qqch (*Elle refuse de céder.*)
- **Se souvenir de** qqch/qqn (*Je me souviens de cette rencontre.*)
- **Manquer de** temps/moyens (*Nous manquons d'informations fiables.*)

---

### 3. Changement de sens selon la préposition
- **Manquer à qqn :** *Tu me manques.* (Tu fazes falta para mim).
- **Manquer de qqch :** *La soupe manque de sel.* (Falta sal na sopa).
- **Penser à :** Avoir à l'esprit (*Je pense à mon avenir.*)
- **Penser de :** Avoir une opinion (*Que pensez-vous de ce film ?*)`,
  },
  {
    title: "Registre Soutenu et Vocabulaire Professionnel",
    slug: "fr-07-registre-soutenu-et-vocabulaire-pro",
    sectionNumber: 107,
    category: "Vocabulário" as LessonCategory,
    order: 107,
    language: "francais",
    content: `# Registre Soutenu et Vocabulaire Professionnel

Le registre soutenu est indispensable pour la correspondance formelle, les présentations en entreprise et la rédaction universitaire.

---

### 1. Remplacer les verbes courants par des verbes précis

| Verbe courant | Équivalent soutenu / précis | Exemple d'emploi |
| :--- | :--- | :--- |
| Faire un rapport | **Rédiger** un rapport | *Nous avons rédigé le compte-rendu annuel.* |
| Faire une erreur | **Commettre** une bévue / une méprise | *L'équipe a commis une méprise regrettable.* |
| Avoir un problème | **Rencontrer** une difficulté / un écueil | *Le projet rencontre des écueils imprévus.* |
| Donner son accord | **Entériner** une décision / **Octroyer** | *Le conseil d'administration a entériné la motion.* |
| Dire que | **Stipuler** / **Faire observer que** | *Le contrat stipule expressément ces clauses.* |
| Aider | **Prêter main-forte** / **Contribuer à** | *L'expert a contribué à l'optimisation des coûts.* |

---

### 2. Connecteurs logiques d'argumentation C1/C2
- **Concession :** *Nonobstant* (malgré), *en dépit de*, *bien que (+ subjonctif)*, *quand bien même (+ conditionnel)*.
- **Cause formelle :** *Eu égard à*, *en raison de*, *d'autant plus que*.
- **Conséquence :** *Partant*, *dès lors*, *il s'ensuit que*.
- **Transition :** *S'agissant de*, *en ce qui concerne*, *pour ce qui est de*.`,
  },
  {
    title: "Le Grand Guide des Homophones Français",
    slug: "fr-08-guide-des-homophones-francais",
    sectionNumber: 108,
    category: "Vocabulário" as LessonCategory,
    order: 108,
    language: "francais",
    content: `# Le Grand Guide des Homophones Français

Les homophones sont des mots qui se prononcent de la même façon mais s'écrivent différemment. Une erreur d'homophone nuit gravement à la crédibilité d'un texte écrit.

---

### 1. Les paires fondamentales

| Paire | Règle de distinction | Astuce de substitution |
| :--- | :--- | :--- |
| **a / à** | **a** = verbe *avoir* (3e pers. sg) / **à** = préposition | Si on peut remplacer par *avait* → écrire **a** sans accent. Sinon → **à**. |
| **ce / se** | **ce** = démonstratif (*ce livre*, *c'est*) / **se** = pronom réfléchi (*se lever*) | Devant un verbe pronominal → **se** (*il se tait*). Devant un nom → **ce** (*ce projet*). |
| **ces / ses** | **ces** = pluriel de *ce/cette* / **ses** = possessif (*les siens*) | Remplacer par *son/sa* → **ses**. Remplacer par *ce/cette* → **ces**. |
| **c'est / s'est** | **c'est** = cela est / **s'est** = forme pronominale passée | Si on peut dire *cela est* → **c'est**. S'il s'agit d'une action réfléchie → **s'est** (*il s'est lavé*). |
| **ou / où** | **ou** = choix (*fromage ou dessert*) / **où** = lieu ou temps | Si on peut remplacer par *ou bien* → **ou**. S'il s'agit d'un lieu/temps → **où**. |
| **la / l'a / là** | **la** = article/pronom / **l'a** = le/la + a (avoir) / **là** = adverbe de lieu | Remplacer par *l'avait* → **l'a**. Indique un lieu (*ici ou là*) → **là**. |
| **leur / leurs** | **leur** = pronom personnel invariable / **leurs** = possessif pluriel | Devant un verbe → toujours invariable : **leur** (*je leur parle*). Devant un nom au pluriel → **leurs** (*leurs affaires*). |`,
  },
  {
    title: "Expressions Idiomatiques et Argot Francophone",
    slug: "fr-09-expressions-idiomatiques-et-argot",
    sectionNumber: 109,
    category: "Diálogos" as LessonCategory,
    order: 109,
    language: "francais",
    content: `# Expressions Idiomatiques et Argot Francophone

Pour comprendre les conversations authentiques, les films et les échanges entre collègues, ces expressions imagées sont fondamentales.

---

### 1. Expressions idiomatiques courantes

| Expression | Signification | Équivalent portugais |
| :--- | :--- | :--- |
| **Poser un lapin à qqn** | Ne pas venir à un rendez-vous convenu | Dar um bolo / Dar o cano |
| **Couper la poire en deux** | Trouver un compromis équitable | Chegar a um meio-termo |
| **Avoir le cafard** | Être triste, déprimé ou mélancolique | Estar na fossa / estar desanimado |
| **Tomber dans les pommes** | S'évanouir, perdre connaissance | Desmaiar |
| **Coûter les yeux de la tête** | Être extrêmement cher | Custar os olhos da cara |
| **Raconter des salades** | Raconter des mensonges ou des bêtises | Contar lorotas / mentiras |
| **Mettre les pieds dans le plat** | Aborder un sujet embarrassant sans ménagement | Dar uma mancada / cometer gafe |

---

### 2. Mots d'argot et français familier (registre courant)
- **Le boulot / Le taf :** Le travail (*J'ai trop de boulot en ce moment.*)
- **Les fringues :** Les vêtements (*Où as-tu acheté ces fringues ?*)
- **La boîte :** L'entreprise, la société (*Il travaille dans une boîte de tech.*)
- **Un pote / Une pote :** Un ami, un camarade (*Je prends un verre avec des potes.*)
- **Kiffer :** Aimer beaucoup (*Je kiffe cette chanson !*)`,
  },
  {
    title: "Erreurs Fréquentes chez les Locuteurs Avancés",
    slug: "fr-10-erreurs-frequentes-locuteurs-avances",
    sectionNumber: 110,
    category: "Gramática" as LessonCategory,
    order: 110,
    language: "francais",
    content: `# Erreurs Fréquentes chez les Locuteurs Avancés

Même des apprenants de niveau C1 commettent régulièrement ces erreurs par calque syntaxique ou habitude sonore.

---

### 1. "Malgré que" vs "Bien que"
- ❌ **Erreur :** *Malgré qu'il fasse beau...*
- ✅ **Correction :** *Bien qu'il fasse beau...* (ou *Malgré le beau temps...*).
> **Règle :** *Malgré* s'utilise toujours avec un groupe nominal (*malgré les obstacles*). Seule l'expression figée *"malgré que j'en aie"* est acceptée en français littéraire.

---

### 2. "Pallier à" vs "Pallier"
- ❌ **Erreur :** *Nous devons pallier à ce manque.*
- ✅ **Correction :** *Nous devons **pallier ce manque**.*
> **Règle :** Le verbe *pallier* est transitif direct (pas de préposition *à*).

---

### 3. "Après que" + Indicatif (et non subjonctif !)
- ❌ **Erreur :** *Après qu'il soit parti...*
- ✅ **Correction :** *Après qu'il **est parti**...*
> **Règle :** Contrairement à *avant que* qui exprime un événement incertain et requiert le subjonctif, *après que* décrit une action déjà accomplie, donc à l'indicatif.

---

### 4. "Rappeler" vs "Se rappeler de"
- ❌ **Erreur :** *Je me rappelle de cette réunion.*
- ✅ **Correction :** *Je me **rappelle cette réunion**.* (Transitif direct) OU *Je me **souviens de** cette réunion.*`,
  },
  {
    title: "Compréhension Écrite : Stratégies de Lecture Efficace",
    slug: "fr-11-comprehension-ecrite-strategies",
    sectionNumber: 111,
    category: "Diálogos" as LessonCategory,
    order: 111,
    language: "francais",
    content: `# Compréhension Écrite : Stratégies de Lecture Efficace

En examen (DELF B2 / DALF C1) ou en lecture de presse spécialisée (Le Monde, Les Échos, Courrier International), la gestion du temps et la saisie de l'implicite sont décisives.

---

### Les trois niveaux de lecture
1. **Lecture sélective (écrémage) :** 
   - Lire le titre, sous-titres, chapeau et le premier paragraphe.
   - Identifier le thème central et la thèse de l'auteur en moins de 2 minutes.
2. **Repérage des articulations logiques :**
   - Souligner les connecteurs d'opposition (*or, néanmoins, toutefois*) et de conclusion (*partant, en somme*).
   - Repérer le basculement entre la présentation des faits et l'argumentation critique.
3. **Analyse de la modalisation (le ton de l'auteur) :**
   - Repérer le vocabulaire mélioratif (*remarquable, précurseur*) ou péjoratif (*dérisoire, prétendu, chimère*).
   - Décoder l'ironie, les guillemets de mise à distance et le conditionnel de réserve.`,
  },
  {
    title: "Production Écrite : L'Art de l'Essai et de la Synthèse",
    slug: "fr-12-production-ecrite-argumentation",
    sectionNumber: 112,
    category: "Exercícios" as LessonCategory,
    order: 112,
    language: "francais",
    content: `# Production Écrite : L'Art de l'Essai et de la Synthèse

La tradition académique francophone obéit à des normes rhétoriques strictes, notamment le plan dialectique (Thèse – Antithèse – Synthèse).

---

### 1. La structure universelle de l'essai argumentatif
- **Introduction (3 étapes indispensables) :**
  1. *L'accroche :* Un fait marquant, une statistique ou une citation pour situer le débat.
  2. *La problématique :* La question centrale posée de manière stimulante.
  3. *L'annonce du plan :* Les deux ou trois axes qui composeront le développement.
- **Développement (2 à 3 parties équilibrées) :**
  - Chaque paragraphe commence par un argument fort, suivi d'une explication théorique et illustré par un exemple précis de société ou de culture.
- **Conclusion (2 étapes) :**
  1. *Le bilan :* Synthèse claire des positions défendues.
  2. *L'élargissement / Ouverture :* Une perspective nouvelle pour poursuivre la réflexion.

---

### 2. Formules d'introduction et d'amorce
- *"De nos jours, force est de constater que..."*
- *"Cette question suscite de vives controverses au sein de l'opinion publique..."*
- *"Il convient d'examiner dans quelle mesure..."*`,
  },
  {
    title: "Compréhension Orale : Débits, Enchaînements et Liaisons",
    slug: "fr-13-comprehension-orale-liaisons",
    sectionNumber: 113,
    category: "Diálogos" as LessonCategory,
    order: 113,
    language: "francais",
    content: `# Compréhension Orale : Débits, Enchaînements et Liaisons

La difficulté majeure du français parlé réside dans la différence entre l'orthographe écrite et la chaîne sonore continue.

---

### 1. Les liaisons obligatoires
- Entre le déterminant et le nom : *un [n] ami*, *les [z] enfants*, *leurs [z] affaires*.
- Entre le pronom personnel et le verbe : *nous [z] allons*, *on [n] arrive*, *ils [z] écoutent*.
- Entre un adjectif placé avant le nom et ce nom : *un grand [t] arbre*, *de beaux [z] yeux*.
- Dans les expressions figées : *de temps [z] en temps*, *tout [t] à l'heure*.

---

### 2. Les liaisons interdites (fautes sévères)
- ❌ Après la conjonction **et** : jamais de liaison ! (*un père et [pause] une mère*).
- ❌ Devant un **h aspiré** : *les [pause] héros*, *des [pause] haricots*.
- ❌ Après un nom au singulier : *Le président [pause] a parlé*.

---

### 3. Les phénomènes du français parlé quotidien
- **Chute du "ne" dans la négation :** *J'sais pas* au lieu de *Je ne sais pas*.
- **Élision du "tu" devant voyelle :** *T'as faim ?* au lieu de *Tu as faim ?*.
- **Assimilation consonantique :** *Je suis* prononcé */ʃɥi/* ("chui").`,
  },
  {
    title: "Préparation aux Examens Officiels : DELF B2 et DALF C1",
    slug: "fr-14-preparation-tests-officiels-delf-dalf",
    sectionNumber: 114,
    category: "Referência" as LessonCategory,
    order: 114,
    language: "francais",
    content: `# Préparation aux Examens Officiels : DELF B2 et DALF C1

Guide pratique pour aborder avec sérénité et méthode les 4 épreuves clés des certifications de France Éducation International.

---

### Grille de synthèse des épreuves

| Épreuve | Niveau DELF B2 | Niveau DALF C1 | Compétence évaluée |
| :--- | :--- | :--- | :--- |
| **Compréhension de l'oral** | ~30 min (documents courts et longs) | ~40 min (documents longs et entretiens) | Extraire l'essentiel et l'argumentation implicite |
| **Compréhension des écrits** | ~1 h (articles informatifs et argumentatifs) | ~50 min (textes longs littéraires ou journalistiques) | Analyser la portée critique et le parti pris |
| **Production écrite** | 1 h (lettre formelle ou essai argumenté) | 2 h 30 (synthèse de documents + essai argumenté) | Clarté de la pensée, fluidité et vocabulaire soutenu |
| **Production orale** | ~20 min (monologue suivi d'un débat) | ~30 min (exposé structuré à partir d'un dossier + entretien) | Capacité de conviction et nuance dans l'argumentation |

> 🎯 **Conseil pour l'oral :** Ne cherchez pas à parler à toute vitesse. Privilégiez l'articulation, le placement des pauses, les connecteurs logiques (*En premier lieu, toutefois, par conséquent*) et maintenez un contact visuel engagé avec les examinateurs.`,
  },
  {
    title: "Exercices de Consolidation et Corrigés Détaillés",
    slug: "fr-15-exercices-de-consolidation-et-corriges",
    sectionNumber: 115,
    category: "Exercícios" as LessonCategory,
    order: 115,
    language: "francais",
    content: `# Exercices de Consolidation et Corrigés Détaillés

Testez vos connaissances en grammaire, accords et vocabulaire avec ces exercices commentés.

---

### Exercice 1 : Indicatif ou Subjonctif ?
Choisissez la forme correcte pour chaque phrase :
1. *Je doute qu'il (vient / vienne) à la réunion.*
2. *Il est évident que cette méthode (est / soit) efficace.*
3. *Bien qu'elle (a / ait) beaucoup d'expérience, elle continue d'apprendre.*
4. *Nous espérons que vous (passerez / passiez) un excellent séjour.*

> **Corrigé de l'Exercice 1 :**
> 1. **vienne** (*douter que* exprime le doute → subjonctif).
> 2. **est** (*il est évident que* exprime une certitude → indicatif).
> 3. **ait** (*bien que* requiert systématiquement le subjonctif).
> 4. **passerez** (*espérer que* s'emploie toujours à l'indicatif futur ou présent).

---

### Exercice 2 : Accord du Participe Passé
Complétez avec le participe passé correct du verbe entre parenthèses :
1. *Ces propositions, nous les avons toutes (analyser) ______.*
2. *Elles se sont (téléphoner) ______ hier soir pendant une heure.*
3. *La solution qu'il a (choisir) ______ semble prometteuse.*

> **Corrigé de l'Exercice 2 :**
> 1. **analysées** (COD *les* = *ces propositions*, placé avant l'auxiliaire *avoir* → accord fém. pluriel).
> 2. **téléphoné** (verbe pronominal avec COI : téléphoner *à* qqn → invariable).
> 3. **choisie** (COD *que* = *la solution*, placé avant → accord fém. singulier).`,
  },
  {
    title: "Plan d'Études Intensif sur 6 Semaines",
    slug: "fr-16-plan-etudes-intensif-6-semaines",
    sectionNumber: 116,
    category: "Referência" as LessonCategory,
    order: 116,
    language: "francais",
    content: `# Plan d'Études Intensif sur 6 Semaines

Un calendrier méthodique pour consolider votre français et passer du niveau B2 au niveau C1 en 42 jours.

---

### Calendrier hebdomadaire

- **Semaine 1 : Fondations des modes verbaux**
  - Maîtrise exhaustive du subjonctif présent et passé.
  - Identification des verbes d'opinion (indicatif en affirmative, subjonctif en négative/interrogative).
  - 10 minutes quotidiennes de jeu d'objets (**C'est quoi ?**).

- **Semaine 2 : Accords critiques et fluidité orthographique**
  - Accord du participe passé avec avoir et verbes pronominaux.
  - Liste intégrale des homophones grammaticaux (*ce/se, ces/ses, leur/leurs*).

- **Semaine 3 : Syntaxe avancée et connecteurs**
  - Pronoms relatifs complexes (*auquel, duquel, pour lequel*).
  - Verbes à préposition fixe (*commencer à, décider de*).
  - Rédaction d'un paragraphe argumentatif par jour.

- **Semaine 4 : Registre soutenu et vocabulaire professionnel**
  - Vocabulaire de l'analyse économique, sociologique et scientifique.
  - Faux amis fréquents et expressions idiomatiques.

- **Semaine 5 : Entraînement aux épreuves de test (DELF/DALF)**
  - Deux simulations complètes de compréhension écrite et orale.
  - Rédaction d'un essai argumentatif complet sous contrainte de temps (1 h).

- **Semaine 6 : Révision générale, confiance et pratique orale**
  - Enregistrement de monologues argumentés de 5 minutes.
  - Relecture de l'index grammatical et révision ciblée des points d'hésitation.`,
  },
  {
    title: "Ressources et Médias Recommandés pour Progresser",
    slug: "fr-17-ressources-et-medias-recommandes",
    sectionNumber: 117,
    category: "Cultura" as LessonCategory,
    order: 117,
    language: "francais",
    content: `# Ressources et Médias Recommandés pour Progresser

L'immersion quotidienne dans des contenus authentiques francophones est le levier le plus puissant pour assimiler naturellement la langue.

---

### 1. Podcasts francophones recommandés
- **L'Heure du Monde :** L'actualité décryptée quotidiennement avec un français clair et soigné.
- **Affaires Sensibles (France Inter) :** Histoires et énigmes du XXe siècle, contées avec suspense et un vocabulaire riche.
- **Journal en français facile (RFI) :** Idéal pour travailler la compréhension orale avec transcription disponible.
- **Transfert (Slate) :** Témoignages intimes permettant de s'habituer aux débits naturels et aux expressions de la vie quotidienne.

---

### 2. Presse et revues de référence
- **Le Monde :** Journalisme d'analyse et de référence, indispensable pour le vocabulaire sociopolitique.
- **Courrier International :** Articles traduits de la presse mondiale en français d'un registre remarquable.
- **Philosophie Magazine :** Textes réflexifs et conceptuels parfaits pour préparer les épreuves du DALF C1/C2.

---

### 3. Dictionnaires en ligne fiables
- **CNRTL (Centre National de Ressources Textuelles et Lexicales) :** Le dictionnaire le plus exhaustif pour l'étymologie et les nuances littéraires.
- **Le Robert & Larousse :** Définitions claires, exemples contemporains et conjugaisons complètes.`,
  },
  {
    title: "Guide Pédagogique pour Enseignants et Formateurs FLE",
    slug: "fr-18-guide-pedagogique-enseignants-fle",
    sectionNumber: 118,
    category: "Cultura" as LessonCategory,
    order: 118,
    language: "francais",
    content: `# Guide Pédagogique pour Enseignants et Formateurs FLE

Conseils pratiques et approches méthodologiques pour animer une classe de FLE dynamique, bienveillante et axée sur l'autonomie de l'apprenant.

---

### 1. La posture de l'enseignant
- **Privilégier la fluidité avant la correction immédiate :** Lors des phases d'expression orale spontanée, notez les erreurs discrètement et consacrez les 10 dernières minutes du cours à une remédiation collective anonymisée.
- **La rétroaction valorisante :** Soulignez toujours une tournure élégante ou un mot de vocabulaire soutenu réussi avant de signaler un point d'amélioration.

---

### 2. Activités pédagogiques stimulantes
- **Le jeu d'objets interactif (*C'est quoi ?*) :** Idéal en rituel de début de cours (5 minutes) pour réveiller le lexique du quotidien, travailler la rapidité de réaction et fixer la prononciation avec l'écoute audio.
- **Le débat en binômes contradictoires :** Distribuer une thématique de société (ex: le télétravail, l'intelligence artificielle) en imposant l'usage d'au moins 3 subjonctifs et 2 connecteurs de concession par intervention.
- **L'atelier de reformulation :** Proposer une phrase familière et demander aux élèves de la convertir successivement en registre courant puis en registre soutenu.`,
  },
  {
    title: "Index Rapide des Points Grammaticaux",
    slug: "fr-19-index-rapide-des-points-grammaticaux",
    sectionNumber: 119,
    category: "Referência" as LessonCategory,
    order: 119,
    language: "francais",
    content: `# Index Rapide des Points Grammaticaux

Utilisez cet index pour retrouver en quelques secondes la leçon qui traite d'un point précis (les numéros renvoient aux chapitres du *Manuel Complet de Français*).

| Point | Chapitre du manuel |
| :--- | :--- |
| Accents et trémas | 3.3 |
| Accord du participe passé | 3.1 et 14.2 |
| Argot francophone | 8 |
| Compréhension écrite | 10 |
| Compréhension orale | 12 |
| Concordance des temps | 2.2 |
| Conditionnel | 2.3 |
| Connecteurs logiques | 6.2 |
| Discours indirect | 2.8 |
| Erreurs fréquentes | 9 |
| Expressions idiomatiques | 8 |
| Faux amis | 4 |
| Figures de style | 10.3 |
| Gérondif / participe présent | 2.6 |
| Homophones | 7 et 14.4 |
| Plan de révision | 15 |
| Pronoms relatifs complexes | 2.4 |
| Registre soutenu | 6 |
| Subjonctif | 2.1 et 14.1 |
| Temps du passé | 2.5 |
| Tests officiels (DELF / DALF / TEF / TCF) | 13 |
| Verbes à préposition fixe | 5 |
| Voix passive | 2.7 |

> « La langue est la carte routière d'une culture. »
> Bonne chance dans votre parcours professionnel et pédagogique international !`,
  },
  {
    title: "Le Français Insolite et Divertissant (Chapitre Bonus)",
    slug: "fr-20-le-francais-insolite-et-divertissant",
    sectionNumber: 120,
    category: "Cultura" as LessonCategory,
    order: 120,
    language: "francais",
    content: `# Le Français Insolite et Divertissant

Ce chapitre bonus s'éloigne volontairement du format grammatical classique : anecdotes, records, devinettes et formats prêts à publier pour donner à voir un français vivant, surprenant et un peu joueur.

---

### 1. Anecdotes étymologiques — d'où viennent ces expressions ?

- **Poser un lapin** : selon l'explication la plus répandue, l'expression date de la fin du XIXᵉ siècle, quand elle désignait familièrement le fait de ne rien payer en échange d'une faveur. Le sens a glissé vers l'idée de laisser quelqu'un « les mains vides », d'où le rendez-vous auquel on ne se présente jamais.
- **Avoir un coup de foudre** : littéralement un « coup de tonnerre » — soudain, violent, impossible à anticiper. Utilisée au sens amoureux dès le XVIIIᵉ siècle.
- **Filer à l'anglaise** : quitter discrètement une soirée sans dire au revoir. En anglais, la même attitude se nomme *to take French leave* : chaque culture attribue à l'autre le manque de politesse !
- **Chercher midi à quatorze heures** : à l'époque des cadrans solaires, associer une heure précise à un autre moment de la journée n'avait aucun sens — d'où l'image d'une complication inutile.
- **Avoir le cafard** : le mot désignant l'insecte a pris au XIXᵉ siècle un sens figuré de mélancolie tenace.
- **Tomber dans les pommes** : l'expression « être dans les pommes » apparaît dans la correspondance de George Sand avec le sens d'être hors d'état, avant de signifier « s'évanouir ».

---

### 2. Mots intraduisibles — la « French touch »

| Mot | Ce qu'il exprime |
| :--- | :--- |
| **Dépaysement** | La sensation, agréable ou déstabilisante, de ne plus être dans son environnement culturel habituel |
| **Flâner** | Se promener sans but précis, pour le seul plaisir de la marche et de l'observation |
| **Retrouvailles** | La joie particulière de revoir quelqu'un après une longue séparation |
| **Terroir** | Le caractère unique qu'un lieu (sol, climat, savoir-faire) donne à un produit alimentaire |
| **Sortable** | Une personne suffisamment présentable pour être emmenée en public sans gêne |
| **Empêchement** | Un contretemps imprévu qui empêche d'assister à quelque chose de prévu |
| **Chez** | Le lieu associé à une personne ou à un groupe (« chez moi », « chez les Anglais ») |
| **Bricoler** | Réparer ou fabriquer soi-même avec les moyens du bord |
| **Retrousser ses manches** | Se préparer à un effort concret, sans détour |

---

### 3. Le français en chiffres et records

- **Mot le plus long d'usage courant :** « anticonstitutionnellement » (25 lettres).
- **Phrase la plus courte de la littérature classique :** « Va ! » — réplique de Chimène dans *Le Cid* de Corneille (1637).
- **Académie française :** fondée en 1635 par le cardinal de Richelieu pour codifier et protéger la langue.
- **Diffusion internationale :** le français est langue officielle d'une trentaine d'États, sur cinq continents.
- **Un mot, deux sens opposés :** « hôte » désigne à la fois celui qui reçoit et celui qui est reçu.

> **Palindromes à tester :** « Ésope reste ici et se repose » et « Engage le jeu que je le gagne » se lisent de la même façon dans les deux sens.

---

### 4. Vrai ou faux ?

| Affirmation | Réponse |
| :--- | :--- |
| Le français est parlé sur les cinq continents. | Vrai |
| Toutes les lettres muettes du français sont totalement inutiles. | Faux — elles conservent souvent une trace de l'origine du mot ou permettent une liaison |
| « Courriel » est le terme recommandé par l'Académie française à la place d'« email ». | Vrai |
| Le mot « orange » n'a aucune rime parfaite en français. | Vrai |
| Toutes les expressions contenant un animal appartiennent au registre familier. | Faux — « avoir le bras long » ou « poser un lapin » sont d'usage courant |

---

### 5. Virelangues et devinettes

**Virelangues traditionnels**
- Les chaussettes de l'archiduchesse sont-elles sèches, archi-sèches ?
- Un chasseur sachant chasser sait chasser sans son chien.
- Si six scies scient six cyprès, six cent six scies scient six cent six cyprès.

**Devinettes lexicales**
1. *Je commence comme « chat », je finis comme « eau », et je suis un logement fortifié.* → **Château**
2. *On me trouve entre le vin et le verre : je suis un homophone du chiffre 100.* → **Sang / Cent / Sent**
3. *Retirez ma première lettre, je reste identique à l'oral : je suis un piège classique.* → **Les homophones** (ex. : « ces » / « ses »)

---

### 6. Pour aller plus loin : un rituel de révision

| Jour | Type de contenu |
| :--- | :--- |
| Lundi | Expression idiomatique de la semaine + son origine |
| Mercredi | Piège grammatical ou orthographique du jour |
| Vendredi | Mot intraduisible ou record insolite |
| Week-end | Quiz vrai/faux ou devinette |`,
  },
];
