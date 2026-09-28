import { useCallback, useEffect, useRef, useState } from 'react';

import { mqttService } from '~/services/mqtt';
import type { MqttStatus, SensorReading } from '~/types/sensor.types';

export type UseMqttResult = {
  status: MqttStatus;
  error?: string;
  /** `true` dès qu'un message a été reçu : permet d'afficher « en direct ». */
  isLive: boolean;
  /** Nombre de messages reçus depuis l'ouverture de l'écran. */
  messageCount: number;
  /** Dernier relevé reçu, tous capteurs confondus. */
  latest?: SensorReading;
  /** Ferme puis rouvre la connexion au broker. */
  reconnect: () => void;
};

/**
 * Connexion au broker et diffusion du flux brut de relevés.
 *
 * Cette couche ne connaît rien au domaine : elle se contente de relier le
 * service MQTT à l'arbre de composants. `useSensors` construit l'état métier
 * par-dessus.
 */
export function useMQTT(onReading?: (reading: SensorReading) => void): UseMqttResult {
  const [status, setStatus] = useState<MqttStatus>('idle');
  const [error, setError] = useState<string | undefined>(undefined);
  const [messageCount, setMessageCount] = useState(0);
  const [latest, setLatest] = useState<SensorReading | undefined>(undefined);

  // Conserve le callback le plus récent sans rouvrir la connexion à chaque rendu.
  // La mise à jour a lieu dans un effet et non pendant le rendu : écrire dans
  // une ref au rendu est proscrit par les règles React, car un rendu concurrent
  // pourrait observer la valeur avant qu'elle soit à jour.
  const handlerRef = useRef(onReading);
  useEffect(() => {
    handlerRef.current = onReading;
  });

  useEffect(() => {
    const handleReading = (reading: SensorReading) => {
      setMessageCount((count) => count + 1);
      setLatest(reading);
      handlerRef.current?.(reading);
    };
    const handleStatus = (next: MqttStatus, detail?: string) => {
      setStatus(next);
      setError(detail);
    };

    mqttService.subscribe(handleReading, handleStatus);
    return () => {
      mqttService.unsubscribe(handleReading, handleStatus);
    };
  }, []);

  const reconnect = useCallback(() => {
    mqttService.reset();
    setMessageCount(0);
    setLatest(undefined);
    setStatus('connecting');
  }, []);

  return { status, error, isLive: messageCount > 0, messageCount, latest, reconnect };
}
