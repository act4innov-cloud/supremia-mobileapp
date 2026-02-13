import { useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useSensorStore } from '@/stores/sensorStore';
import { useAuth } from '@/contexts/AuthContext';
import { COLLECTIONS } from '@/config/firebase.config';

export function useAlerts() {
  const { profile } = useAuth();
  const { alerts, getActiveAlerts, getCriticalAlerts, acknowledgeAlert, resolveAlert } = useSensorStore();

  const acknowledge = useCallback(async (alertId: string) => {
    if (!profile) return;
    acknowledgeAlert(alertId, profile.uid);
    try { await updateDoc(doc(db, COLLECTIONS.ALERTS, alertId), { acknowledged: true, acknowledgedBy: profile.uid, acknowledgedAt: new Date().toISOString() }); } catch (e) { console.error('Failed to acknowledge alert:', e); }
  }, [profile, acknowledgeAlert]);

  const resolve = useCallback(async (alertId: string) => {
    resolveAlert(alertId);
    try { await updateDoc(doc(db, COLLECTIONS.ALERTS, alertId), { resolved: true, resolvedAt: new Date().toISOString() }); } catch (e) { console.error('Failed to resolve alert:', e); }
  }, [resolveAlert]);

  return { alerts, activeAlerts: getActiveAlerts(), criticalAlerts: getCriticalAlerts(), acknowledge, resolve };
}
export default useAlerts;