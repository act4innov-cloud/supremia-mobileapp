// ============================================================
// SUPREMIA Platform - MQTT Context
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { mqttService } from '@/services/mqtt';
import { MQTTConnectionStatus } from '@/types/mqtt.types';
import { useAuth } from './AuthContext';

interface MQTTContextValue {
  status: MQTTConnectionStatus;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: (topic: string, handler: (topic: string, payload: any) => void) => () => void;
  publish: (topic: string, payload: Record<string, unknown>) => void;
}

const MQTTContext = createContext<MQTTContextValue | undefined>(undefined);

export function MQTTProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<MQTTConnectionStatus>('disconnected');
  const { isAuthenticated } = useAuth();
  const statusUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    statusUnsubRef.current = mqttService.onStatusChange(setStatus);
    return () => {
      statusUnsubRef.current?.();
    };
  }, []);

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      mqttService.connect({
        brokerUrl: process.env.EXPO_PUBLIC_MQTT_BROKER_URL || 'wss://localhost:8884/mqtt',
        port: 8884,
        username: process.env.EXPO_PUBLIC_MQTT_USERNAME || '',
        password: process.env.EXPO_PUBLIC_MQTT_PASSWORD || '',
        clientId: `supremia_app_${Date.now()}`,
        keepAlive: 60,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
        clean: true,
        ssl: true,
      });
    } else {
      mqttService.disconnect();
    }

    return () => {
      mqttService.disconnect();
    };
  }, [isAuthenticated]);

  const connect = useCallback(() => {
    mqttService.connect({
      brokerUrl: process.env.EXPO_PUBLIC_MQTT_BROKER_URL || 'wss://localhost:8884/mqtt',
      port: 8884,
      username: process.env.EXPO_PUBLIC_MQTT_USERNAME || '',
      password: process.env.EXPO_PUBLIC_MQTT_PASSWORD || '',
      clientId: `supremia_app_${Date.now()}`,
      keepAlive: 60,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      clean: true,
      ssl: true,
    });
  }, []);

  const disconnect = useCallback(() => {
    mqttService.disconnect();
  }, []);

  const subscribe = useCallback(
    (topic: string, handler: (topic: string, payload: any) => void) => {
      return mqttService.subscribe(topic, handler);
    },
    [],
  );

  const publish = useCallback((topic: string, payload: Record<string, unknown>) => {
    mqttService.publish(topic, payload);
  }, []);

  return (
    <MQTTContext.Provider
      value={{
        status,
        isConnected: status === 'connected',
        connect,
        disconnect,
        subscribe,
        publish,
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
}

export function useMQTT(): MQTTContextValue {
  const context = useContext(MQTTContext);
  if (!context) {
    throw new Error('useMQTT must be used within a MQTTProvider');
  }
  return context;
}

export default MQTTContext;