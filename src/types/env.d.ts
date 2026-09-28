declare namespace NodeJS {
  interface ProcessEnv {
    /** URL de la plateforme web embarquée dans la WebView (Phase 1). */
    EXPO_PUBLIC_WEB_URL?: string;
    /** Nom affiché sous l'icône. */
    EXPO_PUBLIC_APP_DISPLAY_NAME?: string;
    /** Couleur de fond principale (bandeau, splash). */
    EXPO_PUBLIC_BRAND_COLOR?: string;
    /** Couleur d'accent (actions, indicateurs). */
    EXPO_PUBLIC_ACCENT_COLOR?: string;
    /**
     * Domaines autorisés à se charger dans la WebView, en plus du domaine
     * principal (portail d'authentification, CDN, identité...).
     */
    EXPO_PUBLIC_INAPP_HOSTS?: string;
    /** URL de l'API (Phase 2, app native). */
    EXPO_PUBLIC_API_URL?: string;

    // --- Broker MQTT ---------------------------------------------------------
    // ATTENTION : tout ce qui suit est prefixé EXPO_PUBLIC_, donc COMPILE DANS
    // L'APK. Le mot de passe est extractible par quiconque décompile l'app.
    // Voir docs/MQTT_SECURITY.md : le compte doit être en lecture seule.

    /** URL WebSocket du broker, utilisée par l'app (`wss://...`). */
    EXPO_PUBLIC_MQTT_URL?: string;
    /** URL MQTTS directe (`mqtts://...`), réservée aux capteurs et au backend. */
    EXPO_PUBLIC_MQTT_URL_TLS?: string;
    /** Identifiant MQTT. */
    EXPO_PUBLIC_MQTT_USER?: string;
    /** Mot de passe MQTT. Guillemets obligatoires s'il contient un `#`. */
    EXPO_PUBLIC_MQTT_PASSWORD?: string;
    /** Topic wildcard souscrit par l'app. Guillemets obligatoires s'il contient un `#`. */
    EXPO_PUBLIC_MQTT_TOPIC?: string;
    /**
     * `true` pour générer des relevés en local au lieu de lire le broker.
     * Développement et démonstration uniquement : jamais en production, car un
     * écran de supervision affichant des mesures fictives est un danger.
     */
    EXPO_PUBLIC_MQTT_SIMULATE?: string;

    EXPO_PUBLIC_FIREBASE_API_KEY?: string;
    EXPO_PUBLIC_FIREBASE_PROJECT_ID?: string;
  }
}
