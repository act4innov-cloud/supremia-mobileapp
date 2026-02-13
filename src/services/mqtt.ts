// ============================================================
// SUPREMIA Platform - MQTT Client Service
// ============================================================

import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import { MQTTConfig, MQTTConnectionStatus, MQTTQoS, parseTopic } from '@/types/mqtt.types';

type MessageHandler = (topic: string, payload: Record<string, unknown>) => void;
type StatusHandler = (status: MQTTConnectionStatus) => void;

class MQTTService {
  private client: MqttClient | null = null;
  private subscriptions: Map<string, Set<MessageHandler>> = new Map();
  private statusListeners: Set<StatusHandler> = new Set();
  private _status: MQTTConnectionStatus = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  get status(): MQTTConnectionStatus {
    return this._status;
  }

  get isConnected(): boolean {
    return this._status === 'connected';
  }

  // --- Connection Management ---

  connect(config: MQTTConfig): void {
    if (this.client) {
      this.disconnect();
    }

    this.setStatus('connecting');

    const options: IClientOptions = {
      clientId: config.clientId || `supremia_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
      username: config.username,
      password: config.password,
      keepalive: config.keepAlive || 60,
      reconnectPeriod: config.reconnectPeriod || 5000,
      connectTimeout: config.connectTimeout || 30000,
      clean: config.clean !== false,
      protocol: config.ssl ? 'wss' : 'ws',
    };

    // Use WebSocket URL for React Native compatibility
    const brokerUrl = config.brokerUrl;

    try {
      this.client = mqtt.connect(brokerUrl, options);
      this.setupEventHandlers();
    } catch (error) {
      console.error('[MQTT] Connection error:', error);
      this.setStatus('error');
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.end(true);
      this.client = null;
    }
    this.subscriptions.clear();
    this.setStatus('disconnected');
    this.reconnectAttempts = 0;
  }

  // --- Subscription Management ---

  subscribe(topic: string, handler: MessageHandler, qos: MQTTQoS = 1): () => void {
    // Register handler
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic)!.add(handler);

    // Subscribe on broker if connected
    if (this.client && this.isConnected) {
      this.client.subscribe(topic, { qos }, (err) => {
        if (err) {
          console.error(`[MQTT] Subscribe error for ${topic}:`, err);
        } else {
          console.log(`[MQTT] Subscribed to ${topic}`);
        }
      });
    }

    // Return unsubscribe function
    return () => {
      const handlers = this.subscriptions.get(topic);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscriptions.delete(topic);
          this.client?.unsubscribe(topic);
        }
      }
    };
  }

  // Subscribe to all sensor data for a plant
  subscribeToPlantSensors(plantId: string, handler: MessageHandler): () => void {
    return this.subscribe(`supremia/plant/${plantId}/unit/+/sensor/+/data`, handler);
  }

  // Subscribe to all alerts for a plant
  subscribeToPlantAlerts(plantId: string, handler: MessageHandler): () => void {
    return this.subscribe(`supremia/plant/${plantId}/unit/+/sensor/+/alert`, handler);
  }

  // Subscribe to a specific sensor
  subscribeToSensor(plantId: string, unitId: string, sensorId: string, handler: MessageHandler): () => void {
    return this.subscribe(`supremia/plant/${plantId}/unit/${unitId}/sensor/${sensorId}/data`, handler);
  }

  // --- Publish ---

  publish(topic: string, payload: Record<string, unknown>, qos: MQTTQoS = 1): void {
    if (!this.client || !this.isConnected) {
      console.warn('[MQTT] Cannot publish: not connected');
      return;
    }

    this.client.publish(topic, JSON.stringify(payload), { qos, retain: false });
  }

  // --- Status Listeners ---

  onStatusChange(handler: StatusHandler): () => void {
    this.statusListeners.add(handler);
    // Immediately notify of current status
    handler(this._status);
    return () => this.statusListeners.delete(handler);
  }

  // --- Private Methods ---

  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('connect', () => {
      console.log('[MQTT] Connected to broker');
      this.setStatus('connected');
      this.reconnectAttempts = 0;
      this.resubscribeAll();
    });

    this.client.on('reconnect', () => {
      this.reconnectAttempts++;
      console.log(`[MQTT] Reconnecting... attempt ${this.reconnectAttempts}`);
      this.setStatus('reconnecting');

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[MQTT] Max reconnect attempts reached');
        this.disconnect();
      }
    });

    this.client.on('error', (error) => {
      console.error('[MQTT] Error:', error);
      this.setStatus('error');
    });

    this.client.on('offline', () => {
      console.log('[MQTT] Client offline');
      this.setStatus('disconnected');
    });

    this.client.on('close', () => {
      console.log('[MQTT] Connection closed');
      this.setStatus('disconnected');
    });

    this.client.on('message', (topic: string, message: Buffer) => {
      try {
        const payload = JSON.parse(message.toString());
        this.dispatchMessage(topic, payload);
      } catch (error) {
        console.error('[MQTT] Failed to parse message:', error);
      }
    });
  }

  private dispatchMessage(topic: string, payload: Record<string, unknown>): void {
    this.subscriptions.forEach((handlers, subscribedTopic) => {
      if (this.topicMatches(subscribedTopic, topic)) {
        handlers.forEach((handler) => {
          try {
            handler(topic, payload);
          } catch (error) {
            console.error('[MQTT] Handler error:', error);
          }
        });
      }
    });
  }

  private topicMatches(pattern: string, topic: string): boolean {
    const patternParts = pattern.split('/');
    const topicParts = topic.split('/');

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '#') return true;
      if (patternParts[i] === '+') continue;
      if (patternParts[i] !== topicParts[i]) return false;
    }

    return patternParts.length === topicParts.length;
  }

  private resubscribeAll(): void {
    if (!this.client) return;

    this.subscriptions.forEach((_, topic) => {
      this.client!.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`[MQTT] Resubscribe error for ${topic}:`, err);
        }
      });
    });
  }

  private setStatus(status: MQTTConnectionStatus): void {
    this._status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }
}

// Singleton instance
export const mqttService = new MQTTService();
export default mqttService;