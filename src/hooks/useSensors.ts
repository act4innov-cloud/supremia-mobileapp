import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMQTT } from '~/hooks/useMQTT';
import { SENSOR_STALE_AFTER_MS } from '~/config/gas.config';
import { compareStatus } from '~/utils/gasCalculations';
import type { SensorReading } from '~/types/sensor.types';

export type UseSensorsResult = {
  /** Liste des capteurs, triés du plus critique au plus rassurant. */
  ordered: SensorReading[];
  status: ReturnType<typeof useMQTT>['status'];
  error?: string;
  /** `true` tant qu'aucun relevé n'est arrivé. */
  isLoading: boolean;
  /** Nombre de messages reçus depuis l'ouverture de l'écran. */
  messageCount: number;
  /** Capteurs en alerte ou critique. */
  alerts: SensorReading[];
  /** `true` si un seul capteur au moins est hors ligne. */
  hasOffline: boolean;
  /** Ferme puis rouvre la connexion au broker. */
  reconnect: () => void;
};

/**
 * Maintient l'état des capteurs à partir du flux MQTT.
 *
 * Un intervalle séparé marque les capteurs hors ligne : sans lui, une jauge
 * continuerait d'afficher la dernière valeur connue comme si elle était
 * fraîche. Sur un écran de supervision, une valeur périmée affichée comme
 * actuelle est plus dangereuse qu'une valeur absente.
 */
export function useSensors(): UseSensorsResult {
  const [sensors, setSensors] = useState<Record<string, SensorReading>>({});
  const [now, setNow] = useState(() => Date.now());

  const handleReading = useCallback((reading: SensorReading) => {
    setSensors((current) => ({ ...current, [reading.id]: reading }));
    setNow(Date.now());
  }, []);

  const { status, error, messageCount, reconnect } = useMQTT(handleReading);

  // Rafraîchit l'horloge pour recalculer l'ancienneté des relevés.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);

  const ordered = useMemo(
    () =>
      Object.values(sensors)
        .map((reading) => ({
          ...reading,
          isOnline: now - reading.lastSeen <= SENSOR_STALE_AFTER_MS,
        }))
        .sort((a, b) => {
          // Les capteurs hors ligne remontent aussi : un capteur muet est une
          // information, pas une absence d'information.
          if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
          const diff = compareStatus(a.status, b.status);
          return diff !== 0 ? diff : a.name.localeCompare(b.name);
        }),
    [sensors, now],
  );

  const alerts = useMemo(
    () => ordered.filter((reading) => reading.isOnline && reading.status !== 'normal'),
    [ordered],
  );

  return {
    ordered,
    status,
    error,
    isLoading: (status === 'connecting' || status === 'reconnecting') && ordered.length === 0,
    messageCount,
    alerts,
    hasOffline: ordered.some((reading) => !reading.isOnline),
    reconnect,
  };
}
