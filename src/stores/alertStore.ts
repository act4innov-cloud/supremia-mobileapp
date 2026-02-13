import { create } from 'zustand';
import { SensorAlert } from '@/types/sensor.types';

interface AlertState {
  alerts: SensorAlert[];
  unreadCount: number;
  addAlert: (alert: SensorAlert) => void;
  acknowledgeAlert: (id: string, userId: string) => void;
  resolveAlert: (id: string) => void;
  markAllRead: () => void;
  clearResolved: () => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  unreadCount: 0,
  addAlert: (alert) => set(s => ({ alerts: [alert, ...s.alerts].slice(0, 500), unreadCount: s.unreadCount + 1 })),
  acknowledgeAlert: (id, userId) => set(s => ({ alerts: s.alerts.map(a => a.id === id ? { ...a, acknowledged: true, acknowledgedBy: userId, acknowledgedAt: new Date().toISOString() } : a) })),
  resolveAlert: (id) => set(s => ({ alerts: s.alerts.map(a => a.id === id ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a) })),
  markAllRead: () => set({ unreadCount: 0 }),
  clearResolved: () => set(s => ({ alerts: s.alerts.filter(a => !a.resolved) })),
}));
export default useAlertStore;