# 🚀 SUPREMIA - Guide de Déploiement

## Prérequis
- Compte Expo (expo.dev)
- Projet Firebase configuré
- Broker MQTT (Mosquitto/HiveMQ)
- Certificats SSL

## Android
```bash
# Preview (APK interne)
npx eas build --platform android --profile preview

# Production (AAB pour Play Store)
npx eas build --platform android --profile production
npx eas submit --platform android
```

## iOS
```bash
# Nécessite macOS + Apple Developer Account
npx eas build --platform ios --profile production
npx eas submit --platform ios
```

## Web
```bash
npx expo export --platform web
# Déployer le dossier dist/ sur votre serveur
```

## Variables d'environnement
Configurer dans EAS Secrets : `eas secret:create`

## CI/CD
GitHub Actions configuré dans `.github/workflows/ci.yml`
- Push sur `develop` → Build preview Android
- Push sur `main` → Build production Android + Web