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
    /** URL du broker MQTT (Phase 2, app native). */
    EXPO_PUBLIC_MQTT_URL?: string;
    EXPO_PUBLIC_FIREBASE_API_KEY?: string;
    EXPO_PUBLIC_FIREBASE_PROJECT_ID?: string;
  }
}
