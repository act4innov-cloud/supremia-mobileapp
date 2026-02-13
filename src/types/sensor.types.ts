// ============================================================
// SUPREMIA Platform - Sensor Type Definitions
// ============================================================

export type GasType = 'H2S' | 'CO2' | 'CO' | 'NH3' | 'SO2' | 'O2' | 'CH4' | 'NO2';

export type SensorStatus = 'online' | 'offline' | 'warning' | 'critical' | 'maintenance' | 'calibrating';

export type AlertLevel = 'info' | 'warning' | 'critical' | 'emergency';

export interface GasThreshold {
  twa: number;       // Time-Weighted Average (8h)
  stel: number;      // Short-Term Exposure Limit (15min)
  idlh: number;      // Immediately Dangerous to Life or Health
  unit: string;      // ppm, %, mg/m³
}

export interface SensorLocation {
  latitude: number;
  longitude: number;
  zone: string;       // Zone name in the plant
  building: string;
  floor: number;
  description: string;
}

export interface Sensor {
  id: string;
  name: string;
  type: GasType;
  unitId: string;           // Production unit ID
  plantId: string;          // Plant ID (jorf_lasfar | safi)
  model: string;            // Hardware model
  serialNumber: string;
  firmwareVersion: string;
  status: SensorStatus;
  location: SensorLocation;
  thresholds: GasThreshold;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  installationDate: string;
  batteryLevel?: number;    // 0-100 for wireless sensors
  signalStrength?: number;  // RSSI for wireless sensors
  createdAt: string;
  updatedAt: string;
}

export interface SensorReading {
  sensorId: string;
  value: number;
  unit: string;
  timestamp: string;
  alertLevel: AlertLevel | null;
  isValid: boolean;
}

export interface SensorHistoryPoint {
  timestamp: string;
  value: number;
  alertLevel: AlertLevel | null;
}

export interface SensorAlert {
  id: string;
  sensorId: string;
  sensorName: string;
  gasType: GasType;
  level: AlertLevel;
  value: number;
  threshold: number;
  thresholdType: 'twa' | 'stel' | 'idlh';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolved: boolean;
  resolvedAt?: string;
  unitId: string;
  plantId: string;
}

export interface MQTTSensorMessage {
  sensor_id: string;
  gas_type: GasType;
  value: number;
  unit: string;
  timestamp: number;
  battery?: number;
  rssi?: number;
  status: SensorStatus;
}