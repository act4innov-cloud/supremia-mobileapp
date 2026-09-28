/**
 * Configuration centrale de l'application.
 *
 * Toutes les valeurs proviennent des variables d'environnement `EXPO_PUBLIC_*`
 * (voir `.env.example`) afin de pouvoir builder la même base de code pour le
 * dev, la recette et la production sans dupliquer `app.json`.
 *
 * ⚠️ CONTRAINTE IMPORTANTE
 * Expo remplace `process.env.EXPO_PUBLIC_*` par une valeur littérale au moment
 * du build, mais uniquement si l'accès est STATIQUE. Un accès dynamique
 * (`process.env[maVariable]`) n'est PAS remplacé : la variable arrive alors
 * `undefined` dans l'app, sans aucune erreur. Chaque variable est donc lue
 * par une expression littérale ci-dessous, et jamais via une boucle ou un index.
 */

/**
 * URL de garde : sert uniquement de témoin pour détecter un `.env` absent ou
 * mal renseigné, et afficher l'écran d'aide au lieu d'une page blanche.
 */
const MISSING_WEB_URL = 'https://EXPO_PUBLIC_WEB_URL_NON_DEFINIE';

/* --- Lecture statique des variables (ne pas refactorer en accès dynamique) - */
const ENV = {
  webUrl: process.env.EXPO_PUBLIC_WEB_URL,
  displayName: process.env.EXPO_PUBLIC_APP_DISPLAY_NAME,
  brandColor: process.env.EXPO_PUBLIC_BRAND_COLOR,
  accentColor: process.env.EXPO_PUBLIC_ACCENT_COLOR,
  inAppHosts: process.env.EXPO_PUBLIC_INAPP_HOSTS,
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  mqttUrl: process.env.EXPO_PUBLIC_MQTT_URL,
  mqttUrlTls: process.env.EXPO_PUBLIC_MQTT_URL_TLS,
  mqttUser: process.env.EXPO_PUBLIC_MQTT_USER,
  mqttPassword: process.env.EXPO_PUBLIC_MQTT_PASSWORD,
  mqttTopic: process.env.EXPO_PUBLIC_MQTT_TOPIC,
  mqttSimulate: process.env.EXPO_PUBLIC_MQTT_SIMULATE,
  firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
};

/** Trim non destructif, avec repli sur une valeur par défaut. */
function clean(raw: string | undefined, fallback: string): string {
  const value = raw?.trim();
  return value && value.length > 0 ? value : fallback;
}

/** Normalise une URL : sans espaces, sans barre oblique finale. */
function normalizeUrl(raw: string | undefined): string {
  return clean(raw, '').replace(/\/+$/, '');
}

/** Découpe une liste d'hôtes séparés par des virgules. */
function parseHostList(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0);
}

/** Extrait l'hôte d'une URL (`https://exemple.com/x` → `exemple.com`). */
function hostOf(url: string): string {
  const match = /^[a-z]+:\/\/([^/?#]+)/i.exec(url);
  return match ? match[1].toLowerCase() : '';
}

const webUrl = normalizeUrl(ENV.webUrl) || MISSING_WEB_URL;

/* --- MQTT (valeurs dérivées, cf. le bloc `mqtt` plus bas) ------------------- */
const mqttUrl = clean(ENV.mqttUrl, '');
const mqttUser = clean(ENV.mqttUser, '');
const mqttPassword = clean(ENV.mqttPassword, '');

/**
 * `true` si le broker n'est pas exploitable en l'état : URL absente, ou
 * identifiant sans mot de passe (les brokers privés refusent alors la
 * connexion). Permet aux écrans d'afficher la cause plutôt qu'une erreur muette.
 */
const MQTT_UNAVAILABLE =
  mqttUrl.length === 0 || (mqttUser.length > 0 && mqttPassword.length === 0);

export const APP_CONFIG = {
  /** Nom affiché sous l'icône. */
  displayName: clean(ENV.displayName, 'SUPREMIA'),

  web: {
    /** Page chargée au démarrage. */
    url: webUrl,
    /** `true` si `EXPO_PUBLIC_WEB_URL` est absente ou vide dans le `.env`. */
    isPlaceholder: webUrl === MISSING_WEB_URL,
    /** Hôte autorisé à être chargé dans la WebView. */
    host: hostOf(webUrl),
  },

  colors: {
    brand: clean(ENV.brandColor, '#0B1220'),
    accent: clean(ENV.accentColor, '#22C55E'),
    danger: '#EF4444',
    surface: '#111827',
    text: '#F9FAFB',
    textMuted: '#9CA3AF',
  },

  /**
   * Domaines autorisés à se charger DANS la WebView : celui de la plateforme,
   * plus les hôtes listés dans `EXPO_PUBLIC_INAPP_HOSTS` (portail d'authentification,
   * CDN, identité…). Tout le reste part vers le navigateur système, ce qui évite
   * de piéger l'utilisateur dans l'app.
   */
  allowedHosts: [hostOf(webUrl), ...parseHostList(ENV.inAppHosts)].filter(
    (host, index, all) => host.length > 0 && all.indexOf(host) === index,
  ),

  api: {
    baseUrl: normalizeUrl(ENV.apiUrl),
  },

  mqtt: {
    /**
     * URL WebSocket. MQTT.js n'utilise que ce transport sous React Native,
     * d'où le `wss://`. La valeur est figée ici pour être incluse dans le
     * bundle : un accès dynamique à `process.env` ne serait pas remplacé.
     */
    url: mqttUrl,
    /** URL MQTTS directe, réservée aux capteurs ESP et au backend. */
    urlTls: clean(ENV.mqttUrlTls, ''),
    user: mqttUser,
    /**
     * ⚠️ Valeur vide = connexion anonyme. Sur HiveMQ Cloud un broker privé
     * refuse alors la connexion. Voir docs/MQTT_SECURITY.md : ce mot de passe
     * est compilé dans l'APK et n'est donc pas secret.
     */
    password: mqttPassword,
    /** Topic wildcard souscrit par l'app. */
    topic: clean(ENV.mqttTopic, 'supremia/#'),
    /**
     * Génère des relevés localement au lieu de lire le broker. Sert à faire
     * une démonstration et à développer l'interface sans capteur branché, et
     * permet de valider les écrans pendant que l'accès broker est en attente.
     * Passer à `false` dès que le broker réel répond.
     */
    simulate: clean(ENV.mqttSimulate, 'false') === 'true',
    /** `true` si la configuration broker est inexploitable en l'état. */
    unavailable: MQTT_UNAVAILABLE,
  },

  firebase: {
    apiKey: ENV.firebaseApiKey?.trim() ?? '',
    projectId: ENV.firebaseProjectId?.trim() ?? '',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
