# Architecture

## Vue d'ensemble

```
┌─────────────────────────────────────────────┐
│  Application Android (Expo / React Native) │
│                                             │
│  app/index.tsx                              │
│   └─ WebShell (react-native-webview)  ──────┼──►  Plateforme web SUPREMIA
│        ├─ barre nav (retour/av/reload)      │
│        ├─ détection réseau                   │
│        └─ pont JS window.__SUPREMIA_NATIVE__ │
│                                             │
│  app/(tabs)/, app/(auth)/   ── Phase 2 ────►  API REST + MQTT + Firebase
└─────────────────────────────────────────────┘
```

## Pourquoi un wrapper WebView d'abord

| Critère | WebView (v1) | Natif (v2) |
|---|---|---|
| Mise en production | 1 à 2 jours | 2 à 4 semaines |
| Risque de régression | nul (même code que le web) | élevé |
|Notifications push | ✅ token FCM | ✅ |
| MQTT / capteurs temps réel | ⚠️ polling dans la page | ✅ natif |
| Flux caméras WebRTC | ⚠️ dépend du navigateur embarqué | ✅ `react-native-webrtc` |
| Mode hors-ligne | ⚠️ cache WebView | ✅ SQLite |
| Coût de maintenance | 1 codebase | 2 codebases |

Conclusion : la WebView fait livrer de la valeur immédiatement sans dupliquer la logique métier,
et les écrans les plus coûteux en WebView (capteurs temps réel, caméras) sont migrés en priorité
en Phase 2.

## Couches

### `src/config/app.config.ts`
Source de vérité unique. Lit les variables `EXPO_PUBLIC_*`, dérive la liste des domaines autorisés
et signale si l'URL est encore celle de démonstration.

### `src/components/common/WebShell.tsx`
Encapsule la `WebView` et centralise les décisions sensibles :

- **Navigation** : seules les URL du domaine autorisé restent dans l'app, tout le reste part vers
  le navigateur système (évite le piège de la WebView) ;
- **Permissions** : `CAMERA` et `RECORD_AUDIO` sont déclarées dans `app.json` ; le module Android
  de `react-native-webview` les réclame à l'exécution quand une page appelle `getUserMedia`
  (la prop JS `onPermissionRequest` n'existe plus depuis la v13) ;
- **Médias** : `mediaPlaybackRequiresUserAction={false}` + `allowsInlineMediaPlayback` requis
  pour lire un flux caméra sans interaction utilisateur ;
- **Fichiers** : les téléchargements (rapports PDF/CSV) sont confiés au navigateur.

### `src/hooks/usePushNotifications.ts`
Enregistre le token Expo/FCM et le persiste. **Le push ne fonctionne pas dans Expo Go** sur Android
depuis le SDK 53 : il faut un *development build* (`eas build --profile development`).

### Règles de navigation
- Android : le bouton retour physique parcourt l'historique de la WebView ; quand l'historique est
  vide, l'événement est relâché pour obtenir le comportement système (quitter l'app).
- iOS : le geste de swipe retour est fourni par `allowsBackForwardNavigationGestures`.

## Versions

L'alignement se fait sur `node_modules/expo/bundledNativeModules.json`, qui fait foi pour le SDK
utilisé. Ne pas installer les versions `latest` de npm pour `react-native` ou ses libraries
natives : elles peuvent être en avance sur le SDK et casser le bundling.

Versions actuelles validées :

| Package | Version |
|---|---|
| expo | 57.0.25 |
| react-native | 0.86.3 |
| react | 19.2.3 |
| expo-router | 57.0.23 |
| react-native-webview | 13.16.1 |
| react-native-screens | 4.26.0 |
| react-native-safe-area-context | 5.7.0 |
| typescript | 6.0.3 |

Mettre à jour avec `npx expo install --check` plutôt qu'en éditant `package.json` à la main.
