import { GasType, SensorHistoryPoint } from '@/types/sensor.types';
import { GAS_THRESHOLDS } from '@/config/gas.config';

export function calculateTWA(readings: SensorHistoryPoint[], periodHours: number = 8): number {
  if (readings.length === 0) return 0;
  const totalPpm = readings.reduce((sum, r) => sum + r.value, 0);
  return totalPpm / readings.length;
}

export function calculateSTEL(readings: SensorHistoryPoint[]): number {
  if (readings.length === 0) return 0;
  const now = Date.now();
  const fifteenMinAgo = now - 15 * 60 * 1000;
  const recent = readings.filter(r => new Date(r.timestamp).getTime() >= fifteenMinAgo);
  if (recent.length === 0) return 0;
  return recent.reduce((sum, r) => sum + r.value, 0) / recent.length;
}

export function isAboveThreshold(gasType: GasType, value: number, thresholdType: 'twa' | 'stel' | 'idlh'): boolean {
  const threshold = GAS_THRESHOLDS[gasType];
  if (!threshold) return false;
  if (gasType === 'O2') return value < threshold[thresholdType];
  return value >= threshold[thresholdType];
}

export function getExposurePercentage(gasType: GasType, value: number): number {
  const threshold = GAS_THRESHOLDS[gasType];
  if (!threshold) return 0;
  return Math.min((value / threshold.twa) * 100, 200);
}