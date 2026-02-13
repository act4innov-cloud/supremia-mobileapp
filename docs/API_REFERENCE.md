# 📡 SUPREMIA - API Reference

## Camera API
Base URL: `EXPO_PUBLIC_CAMERA_API_URL`

### Endpoints
- `GET /api/plants/:plantId/cameras` - Liste des caméras
- `POST /api/cameras/:cameraId/ptz` - Commande PTZ
- `POST /api/cameras/:cameraId/snapshot` - Capture d'image
- `GET /api/cameras/:cameraId/stream` - Flux vidéo (WebSocket)

## Firebase Collections
- `users` - Profils utilisateurs
- `plants` - Usines (Jorf Lasfar, Safi)
- `units` - Unités de production
- `sensors` - Configuration des capteurs
- `cameras` - Configuration des caméras
- `alerts` - Historique des alertes
- `reports` - Rapports générés
- `dashboard_layouts` - Configurations de dashboards
- `sensor_history` - Historique des mesures (sous-collection)

## MQTT Topics
Voir [MQTT_TOPICS.md](./MQTT_TOPICS.md)