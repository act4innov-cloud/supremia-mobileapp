/**
 * Types du relevé capteur.
 *
 * Le payload brut est celui publié par les ESP et consommé par la plateforme
 * web (`supremia/data/<client>`). Il est volontairement typé avec des
 * champs optionnels : un capteur plus ancien ou un Firmware allégé peut
 * n'envoyer qu'un sous-ensemble, et l'app doit rester utilisable.
 */

/** Statut d'un gaz, du plus rassurant au plus critique. */
export type GasStatus = 'normal' | 'warning' | 'alarm' | 'unknown';

/** Gaz mesurés par les capteurs SUPREMIA. */
export type GasKind = 'h2s' | 'co' | 'co2';

/** Libellés et unités, indexés par type de gaz. */
export const GAS_META: Record<
  GasKind,
  { label: string; symbol: string; unit: string; key: keyof SensorPayload }
> = {
  h2s: { label: 'H₂S', symbol: 'H2S', unit: 'ppm', key: 'h2s_ppm' },
  co: { label: 'CO', symbol: 'CO', unit: 'ppm', key: 'co_ppm' },
  co2: { label: 'CO₂', symbol: 'CO2', unit: 'ppm', key: 'co2_ppm' },
};

/** Message brut reçu sur le topic, avant normalisation. */
export type SensorPayload = {
  sensor_name?: string;
  sensor_id?: number | string;
  type?: string;
  location?: string;
  temperature?: number;
  humidity?: number;
  h2s_ppm?: number;
  co_ppm?: number;
  co2_ppm?: number;
  h2s_status?: string;
  co_status?: string;
  co2_status?: string;
  status?: string;
  wifi_rssi?: number;
  publish_count?: number;
};

/** Mesure d'un gaz, calculée et seuillée côté app. */
export type GasReading = {
  kind: GasKind;
  /** Valeur mesurée, ou `null` si le capteur ne l'envoie pas. */
  value: number | null;
  /** Statut calculé à partir des seuils, prioritaire sur celui du capteur. */
  status: GasStatus;
  /** Unité de mesure, toujours `ppm` pour les trois gaz. */
  unit: string;
  /** Premier seuil dépassé, en ppm. */
  warningLimit: number;
  /** Second seuil, plus grave, en ppm. */
  alarmLimit: number;
  /** Échelle de la jauge : au-delà, l'affichage sature. */
  displayMax: number;
  /** Statut tel que rapporté par le capteur, pour comparaison. */
  reportedStatus: GasStatus;
};

/** Relevé complet et normalisé, prêt à afficher. */
export type SensorReading = {
  /** Identifiant stable, dérivé du nom du capteur. */
  id: string;
  name: string;
  location: string;
  /** Type de matériel rapporté (`ESP8266`, `ESP32`…). */
  deviceType: string;
  /** Statut global : le pire des trois gaz. */
  status: GasStatus;
  /** `false` si aucun message n'est arrivé depuis un délai de veille. */
  isOnline: boolean;
  /** Date de réception du dernier message. */
  lastSeen: number;
  temperature: number | null;
  humidity: number | null;
  /** Puissance Wi-Fi en dBm, sert à anticiper les coupures. */
  wifiRssi: number | null;
  publishCount: number | null;
  gases: Record<GasKind, GasReading>;
  /** Topic d'origine, utile pour déboguer un capteur mal configuré. */
  topic: string;
};

/** États du cycle de vie de la connexion, exposés à l'interface. */
export type MqttStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'offline'
  | 'error'
  | 'simulated';
