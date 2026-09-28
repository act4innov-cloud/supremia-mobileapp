# SUPREMIA — Application Android

Application Android de la plateforme SUPREMIA (supervision de capteurs, caméras et alertes).

Deux modes de fonctionnement cohabitent :

- **Plateforme web** — la plateforme existante, encapsulée dans une WebView. C'est l'écran de
  démarrage, utilisable en production dès aujourd'hui.
- **Supervision native** — tableau de bord et fiche capteur alimentés en direct par le broker MQTT.
  Un bouton dans la barre d'outils de la WebView y donne accès.

---

## État du dépôt

| Domaine | Statut |
|---|---|
| Config Expo / EAS / TypeScript | ✅ fait |
| WebView + barre de navigation + hors-ligne | ✅ fait |
| Notifications push (token FCM enregistré) | ✅ fait |
| Icônes et splash (générées depuis votre logo) | ✅ fait |
| Connexion MQTT en direct (mqtt.js + polyfills) | ✅ fait |
| Tableau de bord et fiche capteur natifs | ✅ fait |
| Tests unitaires (54) + lint + typecheck | ✅ fait |
| Firebase Auth / Firestore | ⏳ en attente de vos identifiants |
| Caméras natives, rapports, back-office | ⏳ Phase 2 |

Versions validées : **Expo SDK 57.0.25**, React Native **0.86.3**, expo-router 57, WebView 13.16.1,
mqtt.js 5.14.

---

## Démarches

### 1. Prérequis

Déjà installé et vérifié sur ce poste : **Node.js 25.6**, **npm 11.8**, **git**, **Java (JDK)**.

Manquants, à installer seulement si vous voulez builder en local (inutile avec EAS) :

- **Android Studio** + SDK Android (Platform 34+, Build-Tools, Platform-Tools pour `adb`)
- Un compte gratuit sur [expo.dev](https://expo.dev) et un compte Google pour EAS Build

### 2. Relier l'app à votre plateforme web

Le fichier `.env` est déjà configuré pour `https://suprem-ia.netlify.app`. Pour le reconfigurer ou le
transmettre à un collègue :

```bash
cp .env.example .env      # Windows : Copy-Item .env.example .env
```

Contenu utile de `.env` :

```ini
EXPO_PUBLIC_WEB_URL=https://suprem-ia.netlify.app
EXPO_PUBLIC_APP_DISPLAY_NAME=SUPREMIA
EXPO_PUBLIC_BRAND_COLOR=#0B1220
EXPO_PUBLIC_ACCENT_COLOR=#22C55E
```

> `EXPO_PUBLIC_WEB_URL` est l'**URL de connexion de votre plateforme**. L'authentification se fait
> avec le formulaire email/mot de passe de la plateforme : l'app ne gère pas encore les identifiants.
> Si la variable manque, l'app affiche un écran d'aide au lieu d'une page blanche.

### 3. Lancer en développement

```bash
npm install
npm run android            # appareil/emulateur Android branché en USB
# ou, sans câble ni Android Studio :
npm start                  # puis scanner le QR code avec Expo Go
```

### 4. Builder l'APK à installer (test avec des utilisateurs)

```bash
npm run build:preview
```

EAS renvoie un lien de téléchargement de l'APK. Installez-le sur les téléphones de vos testeurs
(autoriser « sources inconnues »). Un `.apk` se met à jour **par réinstallation** : l'APK suivant
doit avoir un `versionCode` supérieur, sinon Android refuse l'installation.

### 5. Publier sur le Play Store

```bash
npm run build:prod         # génère un .aab
```

Puis : [Play Console](https://play.google.com/console) → *Créer une application* → TELECHARGER l'AAB.

Pour le Play Store, il faut au préalable :

- un compte développeur Google **25 $** (paiement unique) ;
- une **clé de signature** (keystore) : voir `docs/DEPLOYMENT.md` ;
- le **`targetSdkVersion`** courant — Expo le gère, ne pas le figer.

### 6. Activer les notifications push

Les notifications distantes **ne fonctionnent pas dans Expo Go** sur Android. Il faut un build de
développement :

```bash
eas build --profile development --platform android
```

Puis l'app demande la permission au premier lancement et enregistre le token. **Il reste à
transmettre ce token à votre backend** (voir ci-dessous).

---

## Supervision native des capteurs

Le bouton **pulse** (onde) dans la barre d'outils de la WebView ouvre le tableau de bord natif.

| Écran | Route | Contenu |
|---|---|---|
| Tableau de bord | `/(tabs)/dashboard` | état global du site, décompte alertes et hors-ligne, liste des capteurs |
| Liste des capteurs | `/(tabs)/sensors` | une carte par capteur : H₂S, CO, CO₂, ambiance, ancienneté |
| Fiche capteur | `/(tabs)/sensors/[sensorId]` | jauges détaillées, conditions ambiantes, diagnostic Wi-Fi, seuils appliqués |

Principes retenus pour une application de sécurité :

- **L'état de la connexion est affiché en permanence.** Un écran qui affiche des chiffres figés
  sans le dire donne l'impression que la donnée est fraîche.
- **Un capteur qui se tait reste visible.** Passé 90 s sans message, il passe « hors ligne » et
  remonte dans la liste : perdre la vue d'un capteur est une information, pas une absence
  d'information.
- **Une mesure absente n'est jamais affichée 0.** Un capteur qui n'envoie pas de CO affiche « — »
  et un statut *inconnu*, pas 0 ppm.
- **Le statut affiché vient des seuils, pas du capteur.** Si un capteur annonce « ok » alors que sa
  mesure dépasse le seuil, c'est la mesure qui l'emporte.
- **Un site dont un capteur est hors ligne n'est jamais déclaré « conforme ».**

### Seuils de détection

Les seuils par défaut sont dans `src/config/gas.config.ts` :

| Gaz | Alerte | Critique | Référence |
|---|---|---|---|
| H₂S | 10 ppm | 20 ppm | OSHA PEL 10 ppm, NIOSH IDLH 100 ppm |
| CO | 25 ppm | 50 ppm | NIOSH REL 35 ppm, OSHA PEL 50 ppm |
| CO₂ | 1 000 ppm | 5 000 ppm | seuil de gêne, OSHA PEL 5 000 ppm |

> ⚠️ **Ces valeurs doivent être validées par votre responsable HSE.** Ce sont des valeurs par
> défaut issues de publications reconnues, pas des consignes validées pour votre site. Un écran qui
> affiche « conforme » sur la base d'un seuil faux est plus dangereux qu'un écran vide. Remplacez-les
> par les valeurs de votre document unique d'intervention avant toute mise en production. Le
> message est rappelé sur la fiche de chaque capteur.

### Mode démonstration

Tant que l'accès au broker n'est pas réglé, l'application peut fonctionner en données simulées :

```ini
EXPO_PUBLIC_MQTT_SIMULATE=true
```

L'app génère alors des relevés réalistes en local, ce qui permet de développer et de présenter les
écrans sans capteur ni broker. **Un bandeau bleu « Données simulées » reste affiché en permanence** :
une démonstration ne doit jamais laisser croire que des mesures sont réelles. Repassez à `false`
dès que le broker répond.

---

## Broker MQTT

L'app se connecte à HiveMQ Cloud en WebSocket (`wss://`, seul transport supporté sous React Native)
et s'abonne à `supremia/#`.

```ini
EXPO_PUBLIC_MQTT_URL=wss://<cluster>.s1.eu.hivemq.cloud:8884/mqtt
EXPO_PUBLIC_MQTT_URL_TLS=mqtts://<cluster>.s1.eu.hivemq.cloud:8883   # capteurs + backend
EXPO_PUBLIC_MQTT_USER=
EXPO_PUBLIC_MQTT_PASSWORD=""
EXPO_PUBLIC_MQTT_TOPIC="supremia/#"
```

> ⚠️ **Guillemets obligatoires** autour du topic et du mot de passe : sans eux, le lecteur de `.env`
> traite le `#` comme un début de commentaire et tronque silencieusement la valeur. C'est un piège
> qui ne produit aucune erreur, seulement une connexion au mauvais topic.

> ⚠️ **Le mot de passe est compilé dans l'APK et extractible.** Ce n'est pas un secret, quel que soit
> le soin apporté au code. Utilisez un compte dédié, en **lecture seule** (abonnement, aucune
> publication), et ne partagez jamais le même compte entre l'app et les capteurs. Si un mot de passe
> disposant du droit de publier fuite, quelqu'un peut injecter de fausses mesures « conformes ».
> Voir `docs/MQTT_SECURITY.md`.

Format du message attendu, identique à celui consommé par la plateforme web :

```json
{
  "sensor_name": "client1", "sensor_id": 1, "type": "ESP8266",
  "location": "Bâtiment A", "temperature": 27.4, "humidity": 41.2,
  "h2s_ppm": 3.2, "co_ppm": 6, "co2_ppm": 820,
  "h2s_status": "normal", "co_status": "normal", "co2_status": "normal",
  "status": "online", "wifi_rssi": -58, "publish_count": 1234
}
```

---

## Remplacer le logo

Expo a besoin de quatre fichiers dérivés. Un seul script les produit à partir de votre logo :

```powershell
npm run icons -- --Source "C:\chemin\vers\logo.png" --Background "#0B1220"
```

| Fichier généré | Taille | Fond | Rôle |
|---|---|---|---|
| `icon.png` | 1024×1024 | plein | Icône du launcher |
| `adaptive-icon.png` | 1024×1024 | plein | Aperçu avant Android 8 |
| `foreground.png` | 1024×1024 | plein | Icône adaptative (Android 8+) |
| `splash-icon.png` | 512×512 | plein | Écran de démarrage |

Le script détecte le type de source : un **PNG à fond transparent** produit une icône adaptative avec
une zone de sécurité de 62 % (Android ne conserve que le cercle central) ; un **JPEG ou une image à
fond coloré** est utilisé en plein cadre, sans zone de sécurité, afin qu'aucun rectangle coloré
n'apparaisse dans le masque circulaire d'Android 8+.

**Conseils pour le logo source :** PNG carré, fond transparent, 1024×1024 de préférence, sans
marge. Après le script, relancez `npm run build:preview` : le nom affiché sous l'icône vient de
`EXPO_PUBLIC_APP_DISPLAY_NAME`.

---

## Contrôles de qualité

```bash
npm run typecheck      # tsc --noEmit, mode strict
npm test               # 54 tests : parsing MQTT, seuils, formatage
npm run lint           # ESLint (config plate, règles React Hooks)
npx expo-doctor        # 21 vérifications de configuration
npm run bundle:check   # bundle Android complet, sans avoir besoin d'un SDK Android
```

Les cinq passent actuellement sans erreur. Les tests ciblent en priorité ce qui décide de ce qui est
affiché à l'écran : un cas limite non couvert (une mesure absente confondue avec 0, un seuil mal
appliqué) se traduirait par une alerte manquée.

> Après un changement de `.env`, `npm run bundle:check` ne suffit pas à prouver que la valeur est
> arrivée dans l'app. Les variables ne sont remplacées que si elles sont lues par une **expression
> littérale** (`process.env.EXPO_PUBLIC_X`), jamais par un index dynamique. `src/config/app.config.ts`
> documente cette contrainte.

---

## Pont web ↔ app

Du côté web (à ajouter à votre plateforme), le snippet suivant est déjà injecté par l'app :

```js
window.__SUPREMIA_NATIVE__?.isNativeAvailable(); // true dans l'app, undefined sur navigateur
window.__SUPREMIA_NATIVE__?.logout();             // demande à l'app de purger la session
window.__SUPREMIA_NATIVE__?.send({ type: 'logout' });
```

Utile pour : afficher/masquer un bouton « Ouvrir dans l'app », ou empêcher la WebView d'afficher
le formulaire de connexion (puisque l'app gère l'auth en Phase 2).

---

## Ce que l'app fait déjà

- **Navigation** : barre Retour / Suivant / Recharger / Partager / Ouvrir dans le navigateur
- **Bouton retour Android** : parcourt l'historique, puis quitte l'app normalement
- **Liens externes** (`mailto:`, `tel:`, PDF, autres domaines) ouverts dans le navigateur système
- **Caméras / micro** : les permissions Android (`CAMERA`, `RECORD_AUDIO`) sont déclarées dans
  `app.json` et demandées à l'exécution par le module WebView — les flux WebRTC démarrent
- **Fichiers** : `<input type="file">` et `capture` caméra fonctionnent
- **Hors ligne** : bandeau affiché, le cache WebView conserve la dernière page
- **Push** : token FCM enregistré et conservé, alertes au premier plan
- **MQTT** : reconnexion automatique, état de connexion affiché, capteurs hors ligne détectés

---

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `EXPO_PUBLIC_WEB_URL` | URL de la plateforme (obligatoire) |
| `EXPO_PUBLIC_APP_DISPLAY_NAME` | Nom sous l'icône |
| `EXPO_PUBLIC_BRAND_COLOR` | Fond principal |
| `EXPO_PUBLIC_ACCENT_COLOR` | Couleur d'accent |
| `EXPO_PUBLIC_INAPP_HOSTS` | Domaines autorisés à rester dans l'app (séparés par `,`) |
| `EXPO_PUBLIC_MQTT_URL` | Broker MQTT en WebSocket |
| `EXPO_PUBLIC_MQTT_URL_TLS` | Broker MQTT en TLS direct (capteurs, backend) |
| `EXPO_PUBLIC_MQTT_USER` | Identifiant MQTT |
| `EXPO_PUBLIC_MQTT_PASSWORD` | Mot de passe MQTT — **guillemets obligatoires** |
| `EXPO_PUBLIC_MQTT_TOPIC` | Topic souscrit — **guillemets obligatoires** |
| `EXPO_PUBLIC_MQTT_SIMULATE` | `true` pour des relevés générés en local |
| `EXPO_PUBLIC_API_URL` | API native — Phase 2 |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase — Phase 2 |

> Les variables `EXPO_PUBLIC_*` sont **compilées dans le binaire** et donc lisibles par
> quiconque extrait l'APK. N'y mettez jamais de secret : uniquement des clés publiques
> (`apiKey` Firebase est conçue pour cela) et des URLs.

---

## Feuille de route Phase 2

Ordre recommandé, du plus rentable au plus coûteux :

1. **Firebase Auth** — remplacer le formulaire web par un écran natif (`app/(auth)/login.tsx` est
   déjà en place). Il faut votre `google-services.json` et votre clé API Firebase.
2. **Persistance des relevés** — conserver un historique local pour une consultation hors-ligne et
   pour les rapports.
3. **Caméras** — WebRTC natif (`react-native-webrtc`) au lieu du flux dans la WebView
4. **Rapports** — génération et partage natifs du PDF/CSV
5. **Administration** — écrans de gestion (utilisateurs, unités, seuils)

Chaque écran existe déjà en stub : `app/(tabs)/**`. Il suffit de remplacer le `PhasePlaceholder`
par le vrai composant.

---

## Arborescence

```
app/                        Routes (expo-router)
├── _layout.tsx             Layout racine
├── index.tsx               WebView (écran principal v1)
└── (tabs)/                 Supervision native
    ├── dashboard/index.tsx     état global du site
    └── sensors/                 liste et fiche capteur
src/
├── components/common/      WebShell, Card, Header, StatusIndicator, ConfigNotice
├── components/sensors/     SensorCard, GasLevelIndicator
├── config/
│   ├── app.config.ts       Config centrale (URL, couleurs, domaines, MQTT)
│   └── gas.config.ts       Seuils, couleurs, libellés — à valider par la HSE
├── hooks/                  useMQTT, useSensors, usePushNotifications, useNetworkStatus
├── services/               mqtt (client), storage (AsyncStorage)
├── types/                  sensor.types.ts, env.d.ts
└── utils/                  gasCalculations (seuillage), formatters
__tests__/                  54 tests unitaires
```

## Documents

- `docs/INTEGRATION.md` — ce qu'il reste à fournir pour brancher la plateforme
- `docs/MQTT_SECURITY.md` — pourquoi le mot de passe broker n'est pas un secret dans un APK
- `docs/ARCHITECTURE.md` — pourquoi le WebView d'abord, et quoi migrer en priorité
- `docs/DEPLOYMENT.md` — EAS Build, signature, publication Play Store
