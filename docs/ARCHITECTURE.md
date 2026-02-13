# 🏗️ SUPREMIA - Architecture Technique

## Vue d'ensemble
Application React Native (Expo) universelle : Android, iOS, Web.

## Couches applicatives
1. **Presentation Layer** - Screens + Components (React Native Paper)
2. **State Layer** - Zustand stores + React Query cache
3. **Service Layer** - Firebase, MQTT, REST API
4. **Data Layer** - Firestore (persistent) + MQTT (real-time)

## Flux de données
- Capteurs ESP32 → MQTT Broker → App (WebSocket) → Zustand Store → UI
- Configuration → Firebase Firestore → React Query → UI
- Authentification → Firebase Auth → AuthContext → Navigation guard

## Patterns utilisés
- **Provider Pattern** : AuthProvider, MQTTProvider, ThemeProvider
- **Custom Hooks** : useSensors, useCameras, useDashboard, useAlerts
- **Store Pattern** : Zustand pour state global (sensors, alerts, settings)
- **File-based Routing** : Expo Router avec groupes (auth), (tabs)
- **RBAC** : Role-Based Access Control via UserRole + ROLE_PERMISSIONS