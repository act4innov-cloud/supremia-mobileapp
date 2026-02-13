// ============================================================
// SUPREMIA Platform - MQTT Type Definitions
// ============================================================

export type MQTTConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

export type MQTTQoS = 0 | 1 | 2;

export interface MQTTConfig {
  brokerUrl: string;
  port: number;
  username: string;
  password: string;
  clientId: string;
  keepAlive: number;
  reconnectPeriod: number;
  connectTimeout: number;
  clean: boolean;
  ssl: boolean;
}

export interface MQTTSubscription {
  topic: string;
  qos: MQTTQoS;
  handler: (topic: string, message: MQTTMessage) => void;
}

export interface MQTTMessage {
  topic: string;
  payload: string;
  qos: MQTTQoS;
  retain: boolean;
  timestamp: number;
}

// Topic patterns
export const MQTT_TOPICS = {
  SENSOR_DATA: 'supremia/plant/+/unit/+/sensor/+/data',
  SENSOR_STATUS: 'supremia/plant/+/unit/+/sensor/+/status',
  SENSOR_ALERT: 'supremia/plant/+/unit/+/sensor/+/alert',
  CAMERA_STATUS: 'supremia/plant/+/camera/+/status',
  UNIT_STATUS: 'supremia/plant/+/unit/+/status',
  SYSTEM_HEARTBEAT: 'supremia/system/heartbeat',
} as const;

// Topic builder helpers
export const buildTopic = {
  sensorData: (plantId: string, unitId: string, sensorId: string) =>
    `supremia/plant/${plantId}/unit/${unitId}/sensor/${sensorId}/data`,
  sensorStatus: (plantId: string, unitId: string, sensorId: string) =>
    `supremia/plant/${plantId}/unit/${unitId}/sensor/${sensorId}/status`,
  sensorAlert: (plantId: string, unitId: string, sensorId: string) =>
    `supremia/plant/${plantId}/unit/${unitId}/sensor/${sensorId}/alert`,
  cameraStatus: (plantId: string, cameraId: string) =>
    `supremia/plant/${plantId}/camera/${cameraId}/status`,
  unitStatus: (plantId: string, unitId: string) =>
    `supremia/plant/${plantId}/unit/${unitId}/status`,
};

// Parse topic to extract IDs
export function parseTopic(topic: string): {
  plantId?: string;
  unitId?: string;
  sensorId?: string;
  cameraId?: string;
  messageType?: string;
} {
  const parts = topic.split('/');
  const result: Record<string, string> = {};

  parts.forEach((part, index) => {
    if (part === 'plant' && parts[index + 1]) result.plantId = parts[index + 1];
    if (part === 'unit' && parts[index + 1]) result.unitId = parts[index + 1];
    if (part === 'sensor' && parts[index + 1]) result.sensorId = parts[index + 1];
    if (part === 'camera' && parts[index + 1]) result.cameraId = parts[index + 1];
  });

  result.messageType = parts[parts.length - 1];
  return result;
}