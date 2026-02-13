import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { ProductionUnit } from '@/types/unit.types';
import { useAuth } from '@/contexts/AuthContext';
import { COLLECTIONS } from '@/config/firebase.config';

export function useDashboard() {
  const { profile } = useAuth();
  const [units, setUnits] = useState<ProductionUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.plantId) return;
    const q = query(collection(db, COLLECTIONS.UNITS), where('plantId', '==', profile.plantId));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProductionUnit));
      setUnits(data);
      setLoading(false);
    });
    return unsub;
  }, [profile?.plantId]);

  const overallHealthScore = units.length > 0 ? Math.round(units.reduce((a, u) => a + u.healthScore, 0) / units.length) : 0;
  return { units, loading, overallHealthScore, plantId: profile?.plantId || '' };
}
export default useDashboard;