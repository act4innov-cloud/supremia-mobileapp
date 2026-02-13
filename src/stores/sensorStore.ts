// ============================================================
// SUPREMIA Platform - Sensor Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { Sensor, SensorReading, SensorAlert, AlertLevel } from '@/types/sensor.types';

interface SensorState {
  sensors: Map<string, Sensor>;
  readings: Map<string, SensorReading>;
  alerts: SensorAlert[];
  selectedSensorId: string | null;

  // Actions
  setSensors: (sensors: Sensor[]) => void;
  updateSensor: (sensor: Partial<Sensor> & { id: string }) => void;
  updateReading: (reading: SensorReading) => void;
  addAlert: (alert: SensorAlert) => void;
  acknowledgeAlert: (alertId: string, userId: string) => void;
  resolveAlert: (alertId: string) => void;
  setSelectedSensor: (sensorId: string | null) => void;
  clearAlerts: () => void;

  // Selectors
  getSensorsByUnit: (unitId: string) => Sensor[];
  getSensorsByPlant: (plantId: string) => Sensor[];
  getActiveAlerts: () => SensorAlert[];
  getCriticalAlerts: () => SensorAlert[];
  getReadingForSensor: (sensorId: string) => SensorReading | undefined;
}

export const useSensorStore = create<SensorState>((set, get) => ({
  sensors: new Map(),
  readings: new Map(),
  alerts: [],
  selectedSensorId: null,

  setSensors: (sensors) => {
    const map = new Map<string, Sensor>();
    sensors.forEach((s) => map.set(s.id, s));
    set({ sensors: map });
  },

  updateSensor: (partial) => {
    set((state) => {
      const sensors = new Map(state.sensors);
      const existing = sensors.get(partial.id);
      if (existing) {
        sensors.set(partial.id, { ...existing, ...partial });
      }
      return { sensors };
    });
  },

  updateReading: (reading) => {
    set((state) => {
      const readings = new Map(state.readings);
      readings.set(reading.sensorId, reading);
      return { readings };
    });
  },

  addAlert: (alert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 500), // Keep last 500 alerts
    }));
  },

  acknowledgeAlert: (alertId, userId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId
          ? { ...a, acknowledged: true, acknowledgedBy: userId, acknowledgedAt: new Date().toISOString() }
          : a,
      ),
    }));
  },

  resolveAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a,
      ),
    }));
  },

  setSelectedSensor: (sensorId) => set({ selectedSensorId: sensorId }),

  clearAlerts: () => set({ alerts: [] }),

  getSensorsByUnit: (unitId) => {
    return Array.from(get().sensors.values()).filter((s) => s.unitId === unitId);
  },

  getSensorsByPlant: (plantId) => {
    return Array.from(get().sensors.values()).filter((s) => s.plantId === plantId);
  },

  getActiveAlerts: () => {
    return get().alerts.filter((a) => !a.resolved);
  },

  getCriticalAlerts: () => {
    return get().alerts.filter((a) => !a.resolved && (a.level === 'critical' || a.level === 'emergency'));
  },

  getReadingForSensor: (sensorId) => {
    return get().readings.get(sensorId);
  },
}));

export default useSensorStore;