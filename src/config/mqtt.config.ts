export const MQTT_CONFIG = {
  brokerUrl: process.env.EXPO_PUBLIC_MQTT_BROKER_URL || 'wss://broker.hivemq.com:8884/mqtt',
  username: process.env.EXPO_PUBLIC_MQTT_USERNAME || '',
  password: process.env.EXPO_PUBLIC_MQTT_PASSWORD || '',
  clientId: `supremia_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
  keepAlive: 60,
  reconnectPeriod: 5000,
  connectTimeout: 30000,
  clean: true,
  qos: 1 as const,
};

// MQTT Topic Structure for OCP Plants
export const MQTT_TOPICS = {
  // Sensor data: ocp/{plantId}/{unitId}/sensors/{sensorId}/data
  sensorData: (plantId: string, unitId: string, sensorId: string) =>
    `ocp/${plantId}/${unitId}/sensors/${sensorId}/data`,

  // Sensor status: ocp/{plantId}/{unitId}/sensors/{sensorId}/status
  sensorStatus: (plantId: string, unitId: string, sensorId: string) =>
    `ocp/${plantId}/${unitId}/sensors/${sensorId}/status`,

  // Alerts: ocp/{plantId}/alerts
  alerts: (plantId: string) => `ocp/${plantId}/alerts`,

  // Camera commands: ocp/{plantId}/{unitId}/cameras/{cameraId}/cmd
  cameraCommand: (plantId: string, unitId: string, cameraId: string) =>
    `ocp/${plantId}/${unitId}/cameras/${cameraId}/cmd`,

  // Subscribe to all sensors in a plant
  allSensors: (plantId: string) => `ocp/${plantId}/+/sensors/+/data`,

  // Subscribe to all alerts
  allAlerts: (plantId: string) => `ocp/${plantId}/alerts`,

  // Subscribe to everything
  all: 'ocp/#',
} as const;

export const MQTT_QOS_LEVELS = {
  AT_MOST_ONCE: 0,
  AT_LEAST_ONCE: 1,
  EXACTLY_ONCE: 2,
} as const;
