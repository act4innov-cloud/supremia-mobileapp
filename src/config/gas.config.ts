// ISO 45001 Gas Thresholds for OCP Industrial Plants
export type GasType = 'H2S' | 'CO2' | 'CO' | 'NH3' | 'SO2' | 'NO2' | 'O2' | 'CH4';

export interface GasThreshold {
  type: GasType;
  name: string;
  unit: string;
  twa: number;    // Time Weighted Average (8h)
  stel: number;   // Short Term Exposure Limit (15min)
  idlh: number;   // Immediately Dangerous to Life or Health
  color: string;
  icon: string;
}

export const GAS_THRESHOLDS: Record<GasType, GasThreshold> = {
  H2S: { type: 'H2S', name: 'Hydrogene Sulfure', unit: 'ppm', twa: 10, stel: 15, idlh: 100, color: '#FF5722', icon: 'skull-crossbones' },
  CO2: { type: 'CO2', name: 'Dioxyde de Carbone', unit: 'ppm', twa: 5000, stel: 30000, idlh: 40000, color: '#607D8B', icon: 'cloud' },
  CO:  { type: 'CO', name: 'Monoxyde de Carbone', unit: 'ppm', twa: 25, stel: 200, idlh: 1200, color: '#F44336', icon: 'fire' },
  NH3: { type: 'NH3', name: 'Ammoniac', unit: 'ppm', twa: 25, stel: 35, idlh: 300, color: '#4CAF50', icon: 'flask' },
  SO2: { type: 'SO2', name: 'Dioxyde de Soufre', unit: 'ppm', twa: 2, stel: 5, idlh: 100, color: '#FF9800', icon: 'alert-circle' },
  NO2: { type: 'NO2', name: 'Dioxyde Azote', unit: 'ppm', twa: 3, stel: 5, idlh: 20, color: '#9C27B0', icon: 'alert-octagon' },
  O2:  { type: 'O2', name: 'Oxygene', unit: '%', twa: 20.9, stel: 23.5, idlh: 16, color: '#2196F3', icon: 'weather-windy' },
  CH4: { type: 'CH4', name: 'Methane', unit: '% LEL', twa: 10, stel: 25, idlh: 50, color: '#795548', icon: 'gas-cylinder' },
};

export const getAlertLevel = (type: GasType, value: number): 'normal' | 'warning' | 'critical' | 'danger' => {
  const t = GAS_THRESHOLDS[type];
  if (type === 'O2') {
    if (value < t.idlh) return 'danger';
    if (value < 19.5) return 'critical';
    if (value < 20.0 || value > t.stel) return 'warning';
    return 'normal';
  }
  if (value >= t.idlh) return 'danger';
  if (value >= t.stel) return 'critical';
  if (value >= t.twa) return 'warning';
  return 'normal';
};

export default GAS_THRESHOLDS;