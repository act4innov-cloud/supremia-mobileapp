# @supremia/domain — cœur de domaine SUPREMIA

Règles métier partagées entre les deux cibles de la plateforme :

| Cible | Branche | Rôle |
|---|---|---|
| Application Android | `main` | supervision terrain, WebView + MQTT |
| Plateforme web | `develop` | back-office, rapports, administration |

## Pourquoi un paquet séparé

Les deux cibles n'ont pas la même pile technique : l'app est en Expo SDK 57
(React Native 0.86, React 19), la plateforme web en SDK 52 (React Native 0.76,
React 18). Partager des composants ou des écrans est donc impossible à court
terme — les versions d'`expo-router`, `react-native-paper` et `expo-notifications`
divergent.

Ce qui est partageable, en revanche, c'est la logique : les mêmes seuils, les
m mêmes rôles, les mêmes règles de validation. C'est précisément ce qui doit
être identique, car une divergence produit des écarts invisibles — la plateforme
web autorise un export que l'app refuse, ou classe un gaz à un niveau différent.

D'où la règle qui rend le paquet réutilisable :

> **Aucun import de `react`, `expo-*`, `react-native` ou `mqtt` dans
> `packages/domain/src`.**

Un calcul métier qui dépend de l'interface n'est pas du domaine. Cette
contrainte est ce qui permet aux deux branches de partager le même code malgré
leurs piles divergentes.

## Organisation

```
packages/domain/src/
  types/        user, unit, camera, report — structures de données
  config/       gas (seuils d'exposition), plants (sites, rafraîchissement)
  auth/         permissions — vérification des droits par rôle
  validation/   validators — schémas zod de saisie
```

## Divergence des seuils d'exposition

⚠️ **Les seuils de cette branche et ceux de l'app diffèrent, et c'est à trancher.**

| Gaz | `main` (affiché par l'app) | `develop` / ce paquet (TWA-STEL-IDLH) |
|---|---|---|
| H₂S | alerte 10 / alarme 20 ppm | TWA 10 / STEL 15 / IDLH 100 |
| CO | alerte 25 / alarme 50 ppm | TWA 25 / STEL 200 / IDLH 1200 |
| CO₂ | alerte 1000 / alarme 5000 ppm | TWA 5000 / STEL 30000 / IDLH 40000 |

Les deux jeux ne sont pas contradictoires mais **granulaires différemment** :

- Le modèle `develop` distingue trois niveaux sur la base de durées d'exposition
  (8 h, 15 min, seuil de retrait). C'est le bon modèle, et les valeurs sont
  cohérentes entre les deux sources.
- Le modèle `main` n'a que deux niveaux, et son seuil d'alerte CO₂ (1000 ppm) est
  un **seuil de gêne**, pas une valeur limite d'exposition. C'est un choix
  d'affichage, pas une erreur — mais l'app classe donc 1000 ppm CO₂ en « Alerte »
  là où la plateforme web affiche « Normal ».

Tant que ce point n'est pas arbitré, **les deux cibles n'affichent pas le même
statut pour une même mesure**. Un exploitant qui compare les deux écrans
constatera l'écart.

Deux options, à décider avec le responsable HSE :

1. **Aligner l'app sur le modèle à trois niveaux** — le plus juste, mais
   l'app devient plus sévère qu'aujourd'hui sur le CO₂.
2. **Ajouter un seuil de gêne distinct** dans le cœur de domaine, pour que les
   deux cibles puissent afficher à la fois « conforme à la VLE » et « gêne
   sensorielle ».

Aucune des deux n'a été appliquée : changer les seuils affichés d'un écran de
supervision sans validation HSE relèverait de l'arbitraire.

## Vérifier la synchronisation

```bash
npm run sync:check
```

Compare le contenu de `packages/domain` entre `main` et `origin/develop` et sort
en erreur au premier écart. À lancer avant chaque merge, et à câbler en CI : une
divergence du cœur de domaine est un bug de production, pas un détail de
gestion de sources.

Tant que le paquet n'est pas encore présent sur `develop`, le script signale
« aucun fichier » avec le code de sortie 2.
