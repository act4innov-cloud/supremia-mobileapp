// ============================================================
// SUPREMIA Platform - Gas Thresholds Configuration
// Based on OCP Safety Standards & ISO 45001
// ============================================================

import { GasType, GasThreshold, AlertLevel } from '@/types/sensor.types';

export const GAS_THRESHOLDS: Record<GasType, GasThreshold> = {
  H2S: {
    twa: 10,      // 10 ppm (8h TWA)
    stel: 15,     // 15 ppm (15min STEL)
    idlh: 100,    // 100 ppm (IDLH)
    unit: 'ppm',
  },
  CO2: {
    twa: 5000,    // 5000 ppm (8h TWA)
    stel: 30000,  // 30000 ppm (15min STEL)
    idlh: 40000,  // 40000 ppm (IDLH)
    unit: 'ppm',
  },
  CO: {
    twa: 25,      // 25 ppm (8h TWA)
    stel: 100,    // 100 ppm (ceiling)
    idlh: 1200,   // 1200 ppm (IDLH)
    unit: 'ppm',
  },
  NH3: {
    twa: 25,      // 25 ppm (8h TWA)
    stel: 35,     // 35 ppm (15min STEL)
    idlh: 300,    // 300 ppm (IDLH)
    unit: 'ppm',
  },
  SO2: {
    twa: 2,       // 2 ppm (8h TWA)
    stel: 5,      // 5 ppm (15min STEL)
    idlh: 100,    // 100 ppm (IDLH)
    unit: 'ppm',
  },
  O2: {
    twa: 19.5,    // 19.5% minimum safe level
    stel: 23.5,   // 23.5% maximum safe level
    idlh: 16,     // Below 16% immediately dangerous
    unit: '%',
  },
  CH4: {
    twa: 1000,    // 1000 ppm (TWA)
    stel: 5000,   // 5000 ppm = 10% LEL
    idlh: 25000,  // 50% LEL
    unit: 'ppm',
  },
  NO2: {
    twa: 3,       // 3 ppm (8h TWA)
    stel: 5,      // 5 ppm (15min STEL)
    idlh: 20,     // 20 ppm (IDLH)
    unit: 'ppm',
  },
};

// Determine alert level based on gas reading
export function getAlertLevel(gasType: GasType, value: number): AlertLevel | null {
  const threshold = GAS_THRESHOLDS[gasType];
  if (!threshold) return null;

  // Special handling for O2 (danger is LOW levels)
  if (gasType === 'O2') {
    if (value < threshold.idlh) return 'emergency';
    if (value < threshold.twa) return 'critical';
    if (value > threshold.stel) return 'warning'; // Too much O2 is also dangerous
    return null;
  }

  // For all other gases (danger is HIGH levels)
  if (value >= threshold.idlh) return 'emergency';
  if (value >= threshold.stel) return 'critical';
  if (value >= threshold.twa) return 'warning';
  if (value >= threshold.twa * 0.8) return 'info'; // 80% of TWA

  return null;
}

// Gas display configuration
export const GAS_CONFIG: Record<GasType, {
  name: string;
  fullName: string;
  color: string;
  icon: string;
  dangerColor: string;
}> = {
  H2S: { name: 'H₂S', fullName: 'Hydrogène Sulfuré', color: '#FF6B35', icon: 'alert-circle', dangerColor: '#FF0000' },
  CO2: { name: 'CO₂', fullName: 'Dioxyde de Carbone', color: '#4ECDC4', icon: 'cloud', dangerColor: '#FF4444' },
  CO:  { name: 'CO',  fullName: 'Monoxyde de Carbone', color: '#FF6B6B', icon: 'alert-triangle', dangerColor: '#CC0000' },
  NH3: { name: 'NH₃', fullName: 'Ammoniac', color: '#45B7D1', icon: 'droplet', dangerColor: '#FF6600' },
  SO2: { name: 'SO₂', fullName: 'Dioxyde de Soufre', color: '#96CEB4', icon: 'wind', dangerColor: '#FF3300' },
  O2:  { name: 'O₂',  fullName: 'Oxygène', color: '#2196F3', icon: 'heart', dangerColor: '#FF0000' },
  CH4: { name: 'CH₄', fullName: 'Méthane', color: '#FFA726', icon: 'flame', dangerColor: '#FF0000' },
  NO2: { name: 'NO₂', fullName: 'Dioxyde d\'Azote', color: '#AB47BC', icon: 'alert-octagon', dangerColor: '#CC0000' },
};

// Alert level colors and labels
export const ALERT_COLORS: Record<AlertLevel, { bg: string; text: string; label: string; labelFr: string }> = {
  info:      { bg: '#E3F2FD', text: '#1565C0', label: 'Info',      labelFr: 'Information' },
  warning:   { bg: '#FFF3E0', text: '#E65100', label: 'Warning',   labelFr: 'Attention' },
  critical:  { bg: '#FCE4EC', text: '#C62828', label: 'Critical',  labelFr: 'Critique' },
  emergency: { bg: '#F44336', text: '#FFFFFF', label: 'Emergency', labelFr: 'Urgence' },
};