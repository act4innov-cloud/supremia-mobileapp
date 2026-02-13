import { GasType } from "@/types/sensor.types";

export const GAS_CONFIG: Record<GasType, { name: string; icon: string; color: string; unit: string; thresholds: { warning: number; critical: number } }> = {
    H2S: { name: 'H₂S', icon: 'molecule-co2', color: '#FFD700', unit: 'ppm', thresholds: { warning: 10, critical: 20 } },
    CO2: { name: 'CO₂', icon: 'molecule-co2', color: '#87CEEB', unit: 'ppm', thresholds: { warning: 5000, critical: 10000 } },
    NH3: { name: 'NH₃', icon: 'molecule', color: '#90EE90', unit: 'ppm', thresholds: { warning: 25, critical: 50 } },
    SO2: { name: 'SO₂', icon: 'cloud', color: '#FFA07A', unit: 'ppm', thresholds: { warning: 2, critical: 5 } },
    O2: { name: 'O₂', icon: 'air-filter', color: '#ADD8E6', unit: '%', thresholds: { warning: 19.5, critical: 23.5 } }, // Note: O2 thresholds are for depletion and enrichment
    CO: { name: 'CO', icon: 'molecule-co', color: '#C0C0C0', unit: 'ppm', thresholds: { warning: 50, critical: 100 } },
    NO2: { name: 'NO₂', icon: 'cloud', color: '#A52A2A', unit: 'ppm', thresholds: { warning: 1, critical: 3 } },
    CH4: { name: 'CH₄', icon: 'gas-cylinder', color: '#32CD32', unit: 'ppm', thresholds: { warning: 5000, critical: 10000 } },
};

export const ALERT_COLORS = {
    warning: { bg: '#FFC107', text: '#000', labelFr: 'Avertissement' },
    critical: { bg: '#F44336', text: '#fff', labelFr: 'Critique' },
};
