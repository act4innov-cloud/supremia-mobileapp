import { useState, useEffect } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { SensorData, Alert, GasType } from '@/types/sensor.types';
import { GAS_CONFIG } from '@/config/gas.config';

interface UseSensorsProps {
  plantId?: string;
  unitId?: string;
}

export function useSensors({ plantId, unitId }: UseSensorsProps) {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sensorsQuery: any = collection(firestore, 'sensors');

    if (unitId) {
      sensorsQuery = query(sensorsQuery, where('unitId', '==', unitId));
    } else if (plantId) {
      sensorsQuery = query(sensorsQuery, where('plantId', '==', plantId));
    }

    const unsubscribe = onSnapshot(sensorsQuery, (snapshot) => {
      const allSensors: SensorData[] = [];
      const allAlerts: Alert[] = [];

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const gasConfig = GAS_CONFIG[data.type as GasType];
        if (!gasConfig) return;

        const sensor: SensorData = {
          id: doc.id,
          name: data.name,
          type: data.type,
          value: data.currentValue,
          unit: gasConfig.unit,
          status: data.status,
          unitName: data.unitId, // You might want to fetch the actual unit name
          alert: null,
        };

        let alertType: 'warning' | 'critical' | null = null;
        if (data.status !== 'online') {
            alertType = data.status === 'critical' ? 'critical' : 'warning';
        }
        else if (data.currentValue >= gasConfig.thresholds.critical) {
          alertType = 'critical';
        } else if (data.currentValue >= gasConfig.thresholds.warning) {
          alertType = 'warning';
        }

        if (alertType) {
          sensor.alert = alertType;
          allAlerts.push({ ...sensor, status: alertType });
        }

        allSensors.push(sensor);
      });

      setSensors(allSensors);
      setAlerts(allAlerts.sort((a, b) => (a.status === 'critical' ? -1 : 1)));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching sensors:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [plantId, unitId]);

  return { sensors, alerts, loading };
}
