// ============================================================
// SUPREMIA Platform - useSensors Hook
// ============================================================

import { useEffect, useCallback, useRef } from 'react';
import { useMQTT } from '@/contexts/MQTTContext';
import { useSensorStore } from '@/stores/sensorStore';
import { getAlertLevel } from '@/config/gas.config';
import { parseTopic } from '@/types/mqtt.types';
import { SensorReading, SensorAlert, MQTTSensorMessage } from '@/types/sensor.types';

interface UseSensorsOptions {
  plantId?: string;
  unitId?: string;
  sensorId?: string;
  enabled?: boolean;
}

export function useSensors(options: UseSensorsOptions = {}) {
  const { plantId, unitId, sensorId, enabled = true } = options;
  const { subscribe, isConnected } = useMQTT();
  const {
    sensors,
    readings,
    alerts,
    updateReading,
    addAlert,
    getSensorsByUnit,
    getSensorsByPlant,
    getActiveAlerts,
    getCriticalAlerts,
  } = useSensorStore();

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Handle incoming sensor data
  const handleSensorData = useCallback(
    (topic: string, payload: MQTTSensorMessage) => {
      const { sensorId: msgSensorId } = parseTopic(topic);
      if (!msgSensorId) return;

      const alertLevel = getAlertLevel(payload.gas_type, payload.value);

      const reading: SensorReading = {
        sensorId: payload.sensor_id || msgSensorId,
        value: payload.value,
        unit: payload.unit,
        timestamp: new Date(payload.timestamp * 1000).toISOString(),
        alertLevel,
        isValid: true,
      };

      updateReading(reading);

      // Auto-create alert if threshold exceeded
      if (alertLevel && (alertLevel === 'critical' || alertLevel === 'emergency')) {
        const alert: SensorAlert = {
          id: `alert_${Date.now()}_${msgSensorId}`,
          sensorId: msgSensorId,
          sensorName: payload.sensor_id || msgSensorId,
          gasType: payload.gas_type,
          level: alertLevel,
          value: payload.value,
          threshold: 0,
          thresholdType: 'stel',
          message: `${payload.gas_type} level ${alertLevel}: ${payload.value} ${payload.unit}`,
          timestamp: new Date().toISOString(),
          acknowledged: false,
          resolved: false,
          unitId: parseTopic(topic).unitId || '',
          plantId: parseTopic(topic).plantId || '',
        };

        addAlert(alert);
      }
    },
    [updateReading, addAlert],
  );

  // Subscribe to MQTT topics
  useEffect(() => {
    if (!enabled || !isConnected) return;

    let topic: string;

    if (sensorId && unitId && plantId) {
      topic = `supremia/plant/${plantId}/unit/${unitId}/sensor/${sensorId}/data`;
    } else if (unitId && plantId) {
      topic = `supremia/plant/${plantId}/unit/${unitId}/sensor/+/data`;
    } else if (plantId) {
      topic = `supremia/plant/${plantId}/unit/+/sensor/+/data`;
    } else {
      topic = 'supremia/plant/+/unit/+/sensor/+/data';
    }

    unsubscribeRef.current = subscribe(topic, handleSensorData);

    return () => {
      unsubscribeRef.current?.();
    };
  }, [enabled, isConnected, plantId, unitId, sensorId, subscribe, handleSensorData]);

  return {
    sensors: plantId
      ? unitId
        ? getSensorsByUnit(unitId)
        : getSensorsByPlant(plantId)
      : Array.from(sensors.values()),
    readings,
    alerts: getActiveAlerts(),
    criticalAlerts: getCriticalAlerts(),
    isConnected,
  };
}

export default useSensors;