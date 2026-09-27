# Sécurité du broker MQTT

Ce document explique un problème qui n'apparaît pas dans le code mais qui
conditionne toute la phase 2 : **les identifiants MQTT ne peuvent pas rester
secrets dans une application mobile.**

## Le problème

Les variables `EXPO_PUBLIC_*` sont **remplacées par leur valeur au moment du
build**, puis intégrées au bundle JavaScript de l'app. Ce bundle est embarqué
dans l'APK. Extraire le mot de passe prend quelques minutes avec `apktool` ou
`jadx` :

```bash
npx @expo/fingerprint          # ou simplement unzip + grep
# sur un APK :
strings app-release.apk | grep -i hivemq
```

Autrement dit : **tout ce qui est écrit dans `.env` avec le préfixe
`EXPO_PUBLIC_` est public dès que l'app est installée.** C'est documenté par
Expo, ce n'est pas une faille.

## Ce que l'application Web fait aujourd'hui

`suprem-ia.netlify.app` se connecte au broker depuis le navigateur, donc le
mot de passe est visible dans le JavaScript servi publiquement. Elaborer l'app
sans corriger cela reviendrait à reproduire le problème à l'échelle de l'APK.

## La solution : un compte en lecture seule

HiveMQ Cloud permet de créer plusieurs comptes avec des permissions distinctes.
Il faut **deux comptes séparés**, jamais un seul partagé :

| Compte | Usage | Droits |
|---|---|---|
| `supremia-sensor-*` | publication depuis les ESP | **publish** uniquement, sur `supremia/data/#` |
| `supremia-mobile` | application Android et site web | **subscribe** uniquement, sur `supremia/#` |

Avec cette séparation, un mot de passe extrait de l'APK ne permet que de **lire**
les données. Il ne permet plus d'écrire. C'est la différence entre une fuite de
données et une **fausse alarme de sécurité**.

> Sur une détection de H2S, CO et CO2, la capacité à publier une valeur arbitraire
> n'est pas un problème de qualité de données : c'est un risque sur les personnes.
> Quelqu'un qui publie `h2s_ppm: 0` sur `supremia/data/client1` fait apparaître un
> site « conforme » sur un écran de supervision pendant une fuite réelle.

## La solution correcte à terme

Aucune application mobile ne devrait se connecter directement à un broker de
production. Le schéma cible :

```
capteur ESP ──mqtts──▶ broker HiveMQ ──▶ backend ──▶ API REST ──▶ app mobile
                          (privé)      (authentifie)   (jeton)   (lecture seule)
```

L'app obtient un **jeton court** auprès de l'API après login, et n'a jamais de
mot de passe broker en clair. Le backend applique les ACL par utilisateur. C'est
ce que fait déjà `docs/INTEGRATION.md` pour l'authentification de la plateforme,
et c'est la même logique.

En attendant, le compte `EXPO_PUBLIC_MQTT_USER` de l'app doit rester en lecture
seule, et le mot de passe doit pouvoir être changé sans publier une nouvelle
version de l'app.

## Topics

Réduire la surface d'écoute autant que possible :

| Topic | Contenu | Abonné par l'app |
|---|---|---|
| `supremia/#` | tout (joker) | à éviter en production |
| `supremia/data/client1` | relevé complet d'un capteur | oui |
| `supremia/data/client1/temp` | température seule | redondant, le relevé complet suffit |
| `supremia/data/client1/humidity` | humidité seule | redondant |
| `supremia/status/client1` | état de l'appareil | utile pour la disponibilité |

`supremia/#` est celui que la plateforme web utilise aujourd'hui. Il est
fonctionnel mais dépend d'un thème : dès qu'un capteur publie ailleurs sous
`supremia/`, l'app le verra. Préférer un explicitement versionné, par exemple
`supremia/v1/data/#`, et faire migrer les capteurs.

## Points à faire avant la production

- [ ] Créer un compte HiveMQ `supremia-mobile` en **subscribe only**
- [ ] Réserver `supremia-sensor-*` en **publish only** pour les ESP
- [ ] Ne plus utiliser le même compte pour l'app et pour les capteurs
- [ ] Définir des ACL par topic, pas seulement par action
- [ ] Configurer un renouvellement de mot de passe sans redéploiement de l'app
- [ ] Remplacer `supremia/#` par un préfixe versionné
- [ ] Activer la rétention et le quota de débit sur le cluster
- [ ] Brancher les alertes HiveMQ vers votre canal d'astreinte
