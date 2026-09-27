# SUPREMIA — Application Android

Application Android de la plateforme SUPREMIA (supervision de capteurs, caméras et alertes).

Stratégie retenue : **Phase 1 = wrapper WebView**, puis **Phase 2 = migration native** écran par
écran. L'app est donc utilisable en production dès aujourd'hui, sans bloquer le calendrier sur une
réécriture complète.

---

## État du dépôt

| Domaine | Statut |
|---|---|
| Config Expo / EAS / TypeScript | ✅ fait |
| WebView + barre de navigation + hors-ligne | ✅ fait |
| Notifications push (token FCM enregistré) | ✅ fait |
| Icônes et splash (placeholders à remplacer) | ✅ généré |
| Écrans natifs (dashboard, capteurs, caméras, rapports, admin) | ⏳ Phase 2 |
| Firebase Auth / Firestore / MQTT en JS | ⏳ Phase 2 |

Versions validées : **Expo SDK 57.0.25**, React Native **0.86.3**, expo-router 57, WebView 13.16.1.

---

## Démarches

### 1. Prérequis

Déjà installé et vérifié sur ce poste : **Node.js 25.6**, **npm 11.8**, **git**, **Java (JDK)**.

Manquants, à installer seulement si vous voulez builder en local (inutile avec EAS) :

- **Android Studio** + SDK Android (Platform 34+, Build-Tools, Platform-Tools pour `adb`)
- Un compte gratuit sur [expo.dev](https://expo.dev) et un compte Google pour EAS Build

### 2. Relier l'app à votre plateforme web

Le fichier `.env` est déjà configuré pour `https://supremia.netlify.app`. Pour le reconfigurer ou le
transmettre à un collègue :

```bash
cp .env.example .env      # Windows : Copy-Item .env.example .env
```

Contenu utile de `.env` :

```ini
EXPO_PUBLIC_WEB_URL=https://supremia.netlify.app
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

## Remplacer le logo

Expo a besoin de quatre fichiers dérivés. Un seul script les produit à partir de votre logo :

```powershell
npm run icons -- --Source "C:\chemin\vers\logo.png" --Background "#0B1220"
```

| Fichier généré | Taille | Fond | Rôle |
|---|---|---|---|
| `icon.png` | 1024×1024 | plein | Icône du launcher |
| `adaptive-icon.png` | 1024×1024 | plein | Aperçu avant Android 8 |
| `foreground.png` | 1024×1024 | **transparent** | Icône adaptative (Android 8+) |
| `splash-icon.png` | 512×512 | **transparent** | Écran de démarrage |

Le logo est réduit automatiquement à 62 % dans `foreground.png`, car Android ne conserve que le
cercle central d'une icône adaptative — sans cela, votre logo serait rogné.

**Conseils pour le logo source :** PNG carré, fond transparent, 1024×1024 de préférence, sans
marge. Après le script, relancez `npm run build:preview` : le nom affiché sous l'icône vient de
`EXPO_PUBLIC_APP_DISPLAY_NAME`.

---

## Contrôles de qualité

```bash
npm run typecheck      # tsc --noEmit, mode strict
npm run bundle:check   # bundle Android complet, sans avoir besoin d'un SDK Android
npx expo-doctor        # 21 vérifications de configuration
```

Les trois passent actuellement sans erreur.

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

---

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `EXPO_PUBLIC_WEB_URL` | URL de la plateforme (obligatoire) |
| `EXPO_PUBLIC_APP_DISPLAY_NAME` | Nom sous l'icône |
| `EXPO_PUBLIC_BRAND_COLOR` | Fond principal |
| `EXPO_PUBLIC_ACCENT_COLOR` | Couleur d'accent |
| `EXPO_PUBLIC_INAPP_HOSTS` | Domaines autorisés à rester dans l'app (séparés par `,`) |
| `EXPO_PUBLIC_API_URL` | API native — Phase 2 |
| `EXPO_PUBLIC_MQTT_URL` | Broker MQTT — Phase 2 |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase — Phase 2 |

> Les variables `EXPO_PUBLIC_*` sont **compilées dans le binaire** et donc lisibles par
> quiconque extrait l'APK. N'y mettez jamais de secret : uniquement des clés publiques
> (`apiKey` Firebase est conçue pour cela) et des URLs.

---

## Feuille de route Phase 2

Ordre recommandé, du plus rentable au plus coûteux :

1. **Firebase Auth** — remplacer le formulaire web par un écran natif (`app/(auth)/login.tsx` est
   déjà en place)
2. **Dashboard** — lecture de l'API REST, mise en cache hors-ligne
3. **Capteurs temps réel** — MQTT over WebSocket (`src/hooks/useMQTT.ts`)
4. **Caméras** — WebRTC natif (`react-native-webrtc`) au lieu du flux dans la WebView
5. **Rapports** — génération et partage natifs du PDF/CSV
6. **Administration** — écrans de gestion (utilisateurs, unités, seuils)

Chaque écran existe déjà en stub : `app/(tabs)/**`. Il suffit de remplacer le `PhasePlaceholder`
par le vrai composant.

---

## Arborescence

```
app/                        Routes (expo-router)
├── _layout.tsx             Layout racine
├── index.tsx               WebView (écran principal v1)
└── (tabs)/, (auth)/        Écrans natifs — Phase 2
src/
├── components/common/      WebShell, ConfigNotice, PhasePlaceholder
├── config/app.config.ts    Config centrale (URL, couleurs, domaines autorisés)
├── hooks/                  usePushNotifications, useNetworkStatus
├── services/               storage (AsyncStorage)
└── assets/images/          Icônes et splash
```

## Documents

- `docs/INTEGRATION.md` — ce qu'il reste à fournir pour brancher la plateforme
- `docs/ARCHITECTURE.md` — pourquoi le WebView d'abord, et quoi migrer en priorité
- `docs/DEPLOYMENT.md` — EAS Build, signature, publication Play Store
