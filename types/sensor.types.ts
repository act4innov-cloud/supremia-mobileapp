export type GasType = 'H2S' | 'CO2' | 'NH3' | 'SO2' | 'O2' | 'CO' | 'NO2' | 'CH4';
export type SensorStatus = 'online' | 'offline' | 'warning' | 'critical';

export interface SensorData {
  id: string;
  name: string;
  type: GasType;
  value: number;
  unit: string;
  status: SensorStatus;
  unitName: string;
  alert: 'warning' | 'critical' | null;
}

export interface Alert extends SensorData {
  status: 'warning' | 'critical';
}
