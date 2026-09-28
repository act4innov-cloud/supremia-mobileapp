import mqtt, { type MqttClient, type IClientOptions } from 'mqtt';

import { APP_CONFIG } from '~/config/app.config';
import { GAS_DISPLAY_MAX, GAS_THRESHOLDS, SENSOR_STALE_AFTER_MS } from '~/config/gas.config';
import { normalizeStatus, statusFor, worstStatus } from '~/utils/gasCalculations';
import {
  GAS_META,
  type GasKind,
  type GasReading,
  type MqttStatus,
  type SensorPayload,
  type SensorReading,
} from '~/types/sensor.types';

export type MqttListener = (reading: SensorReading) => void;
export type StatusListener = (status: MqttStatus, detail?: string) => void;

type Subscription = {
  listeners: Set<MqttListener>;
  statusListeners: Set<StatusListener>;
  status: MqttStatus;
  error?: string;
};

const subscribers = new Map<string, Subscription>();

let client: MqttClient | null = null;
let currentStatus: MqttStatus = 'idle';
let currentError: string | undefined;
let simulator: ReturnType<typeof setInterval> | null = null;

/* --- Normalisation des relevés -------------------------------------------- */

/** Convertit en nombre fini, ou `null` si la valeur est absente ou invalide. */
function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Extrait le nom du capteur d'un topic, ex. `supremia/data/client1` → `client1`. */
function sensorNameFromTopic(topic: string): string | null {
  const segments = topic.split('/').filter((part) => part.length > 0);
  const marker = segments.findIndex((part) => part === 'data' || part === 'status');
  if (marker >= 0 && segments.length > marker + 1) {
    return segments.slice(marker + 1).join('/');
  }
  return segments.length > 0 ? segments[segments.length - 1] : null;
}

/** Lit une mesure de gaz et calcule son statut. */
function readGas(kind: GasKind, payload: SensorPayload): GasReading {
  const { key, unit } = GAS_META[kind];
  const { warning, alarm } = GAS_THRESHOLDS[kind];
  const value = toNumber(payload[key]);
  return {
    kind,
    value,
    status: statusFor(kind, value),
    unit,
    warningLimit: warning,
    alarmLimit: alarm,
    displayMax: GAS_DISPLAY_MAX[kind],
    reportedStatus: normalizeStatus(payload[`${kind}_status` as keyof SensorPayload]),
  };
}

/** Transforme un payload brut en relevé affichable. */
export function toReading(payload: SensorPayload, topic: string, now: number): SensorReading {
  const name = payload.sensor_name?.trim() || sensorNameFromTopic(topic) || 'capteur inconnu';
  const gases = {
    h2s: readGas('h2s', payload),
    co: readGas('co', payload),
    co2: readGas('co2', payload),
  } as Record<GasKind, GasReading>;

  // Un topic `.../status` ne porte que des métadonnées : on l'ignore plutôt que
  // d'afficher un relevé vide qui ferait clignoter le dashboard.
  const isStatusOnly = topic.includes('/status');

  return {
    id: String(payload.sensor_id ?? name),
    name,
    location: payload.location?.trim() || 'Non renseignée',
    deviceType: payload.type?.trim() || 'ESP',
    status: isStatusOnly
      ? 'unknown'
      : worstStatus([gases.h2s.status, gases.co.status, gases.co2.status]),
    isOnline: true,
    lastSeen: now,
    temperature: toNumber(payload.temperature),
    humidity: toNumber(payload.humidity),
    wifiRssi: toNumber(payload.wifi_rssi),
    publishCount: toNumber(payload.publish_count),
    gases,
    topic,
  };
}

/** Analyse un message brut. Renvoie `null` si le message n'est pas exploitable. */
export function parseMessage(topic: string, raw: string | Uint8Array, now = Date.now()) {
  const text = typeof raw === 'string' ? raw : new TextDecoder().decode(raw);
  let payload: SensorPayload;
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null) return null;
    payload = parsed as SensorPayload;
  } catch {
    return null;
  }
  // Sans nom de capteur, la plateforme web ignore aussi le message : on fait
  // de même, sinon chaque message parasite créerait un capteur fantôme.
  if (!payload.sensor_name && !sensorNameFromTopic(topic)) return null;
  return toReading(payload, topic, now);
}

/* --- Diffusion ------------------------------------------------------------- */

function broadcast(reading: SensorReading) {
  for (const entry of subscribers.values()) {
    for (const listener of entry.listeners) listener(reading);
  }
}

function setStatus(status: MqttStatus, error?: string) {
  currentStatus = status;
  currentError = error;
  for (const entry of subscribers.values()) {
    entry.status = status;
    entry.error = error;
    for (const listener of entry.statusListeners) listener(status, error);
  }
}

/* --- Connexion ------------------------------------------------------------- */

function buildOptions(): IClientOptions {
  const { user, password } = APP_CONFIG.mqtt;
  return {
    // Préfixe aligné sur la plateforme web (`ocp_dashboard_*`) : certains brokers
    // restreignent l'accès à une liste de préfixes de clientId.
    clientId: `ocp_mobile_${Math.random().toString(16).slice(2, 10)}`,
    clean: true,
    connectTimeout: 10_000,
    reconnectPeriod: 5_000,
    keepalive: 60,
    // Un broker privé refuse la connexion anonyme : n'envoie le couple que s'il
    // est réellement renseigné, sinon mqtt.js envoie un username vide qui peut
    // être interprété comme une tentative d'anonymous.
    ...(user.length > 0 ? { username: user, password } : {}),
  };
}

function startSimulator() {
  if (simulator !== null) return;
  setStatus('simulated');
  simulator = setInterval(() => {
    broadcast(simulateReading());
  }, 3_000);
}

function start() {
  if (APP_CONFIG.mqtt.simulate) {
    startSimulator();
    return;
  }
  if (APP_CONFIG.mqtt.url.length === 0) {
    setStatus('error', "EXPO_PUBLIC_MQTT_URL n'est pas renseigné dans le .env");
    return;
  }
  if (APP_CONFIG.mqtt.user.length > 0 && APP_CONFIG.mqtt.password.length === 0) {
    setStatus('error', "Identifiants MQTT incomplets : le broker privé refusera la connexion");
    return;
  }

  try {
    client = mqtt.connect(APP_CONFIG.mqtt.url, buildOptions());
  } catch (error) {
    setStatus('error', error instanceof Error ? error.message : String(error));
    return;
  }

  client.on('connect', () => {
    client?.subscribe(APP_CONFIG.mqtt.topic, { qos: 0 }, (error) => {
      if (error) {
        setStatus('error', `Abonnement refusé sur ${APP_CONFIG.mqtt.topic} : ${error.message}`);
        return;
      }
      setStatus('connected');
    });
  });

  client.on('message', (topic, payload) => {
    const reading = parseMessage(topic, payload);
    if (reading !== null) broadcast(reading);
  });

  client.on('error', (error) => {
    setStatus('error', error.message);
  });

  client.on('reconnect', () => setStatus('reconnecting'));
  client.on('offline', () => setStatus('offline'));
  client.on('close', () => {
    if (currentStatus !== 'error') setStatus('offline');
  });
}

/**
 * Ouvre la connexion au premier abonnement et la referme au dernier désabonnement.
 * Un seul client est partagé par tous les écrans : se connecter par écran
 * multiplierait les connexions chez le broker, ce que les offres free-tier
 * sanctionnent.
 */
function subscribe(listener: MqttListener, statusListener: StatusListener) {
  let entry = subscribers.get('default');
  const isFirst = entry === undefined;
  if (entry === undefined) {
    entry = { listeners: new Set(), statusListeners: new Set(), status: currentStatus };
    subscribers.set('default', entry);
  }
  entry.listeners.add(listener);
  entry.statusListeners.add(statusListener);
  if (isFirst) start();
  // Notifie immédiatement l'abonné qui vient d'arriver, pour qu'il n'attende pas
  // le prochain changement d'état.
  statusListener(entry.status, entry.error);
  return entry;
}

function unsubscribe(listener: MqttListener, statusListener: StatusListener) {
  const entry = subscribers.get('default');
  if (!entry) return;
  entry.listeners.delete(listener);
  entry.statusListeners.delete(statusListener);
  if (entry.listeners.size > 0) return;

  subscribers.delete('default');
  if (simulator !== null) {
    clearInterval(simulator);
    simulator = null;
  }
  if (client !== null) {
    client.end(true);
    client = null;
  }
  currentStatus = 'idle';
  currentError = undefined;
}

/** Libère le client sans rebrancher, pour les tests. */
export function resetMqttClient() {
  if (simulator !== null) {
    clearInterval(simulator);
    simulator = null;
  }
  if (client !== null) {
    client.end(true);
    client = null;
  }
  subscribers.clear();
  currentStatus = 'idle';
  currentError = undefined;
}

/* --- Simulation ------------------------------------------------------------ */

const SIMULATED_SENSORS = [
  { sensor_name: 'client1', location: 'Bâtiment A — Salle des compresseurs', type: 'ESP32' },
  { sensor_name: 'client2', location: 'Bâtiment B — Local technique', type: 'ESP8266' },
  { sensor_name: 'client3', location: 'Zone de stockage — Sud', type: 'ESP32' },
] as const;

/** Dérive une valeur autour d'un point de départ : dérive aléatoire lissée. */
function drift(base: number, step: number, min: number, max: number) {
  const next = base + (Math.random() - 0.5) * step;
  return Math.min(max, Math.max(min, next));
}

let h2s = 2.4;
let co = 6;
let co2 = 820;
let temperature = 27.5;
let humidity = 41;

/**
 * Produit un relevé simulé, au format exact du firmware ESP.
 * Sert uniquement au développement et à la démonstration : jamais en production.
 */
export function simulateReading(topic = APP_CONFIG.mqtt.topic): SensorReading {
  const sensor = SIMULATED_SENSORS[Math.floor(Math.random() * SIMULATED_SENSORS.length)];
  h2s = drift(h2s, 1.2, 0, 60);
  co = drift(co, 3, 0, 120);
  co2 = drift(co2, 120, 400, 9000);
  temperature = drift(temperature, 0.6, 5, 55);
  humidity = drift(humidity, 3, 5, 95);

  const payload: SensorPayload = {
    sensor_name: sensor.sensor_name,
    sensor_id: SIMULATED_SENSORS.indexOf(sensor) + 1,
    type: sensor.type,
    location: sensor.location,
    temperature: Number(temperature.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    h2s_ppm: Number(h2s.toFixed(2)),
    co_ppm: Number(co.toFixed(1)),
    co2_ppm: Number(co2.toFixed(0)),
    h2s_status: statusFor('h2s', h2s),
    co_status: statusFor('co', co),
    co2_status: statusFor('co2', co2),
    status: 'online',
    wifi_rssi: Math.round(drift(-58, 4, -92, -42)),
    publish_count: Math.floor(Math.random() * 1_000_000),
  };

  return toReading(payload, `${topic.replace(/#$/, '')}data/${sensor.sensor_name}`, Date.now());
}

/* --- Surface publique ------------------------------------------------------ */

export const mqttService = {
  subscribe,
  unsubscribe,
  reset: resetMqttClient,
  parseMessage,
  toReading,
  simulateReading,
  get status() {
    return currentStatus;
  },
  get error() {
    return currentError;
  },
  /** `true` si un relevé est arrivé récemment et que le capteur répond. */
  isStale(reading: SensorReading, now = Date.now()) {
    return now - reading.lastSeen > SENSOR_STALE_AFTER_MS;
  },
};
