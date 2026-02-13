import { useState, useCallback } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Report, ReportType, ExportFormat } from '@/types/dashboard.types';
import { COLLECTIONS } from '@/config/firebase.config';
import { useAuth } from '@/contexts/AuthContext';

export function useReporting() {
  const { profile } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async (plantId: string, type?: ReportType) => {
    setLoading(true);
    try {
      let q = query(collection(db, COLLECTIONS.REPORTS), where('plantId', '==', plantId), orderBy('generatedAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Report));
      setReports(type ? data.filter(r => r.type === type) : data);
    } finally { setLoading(false); }
  }, []);

  const generateReport = useCallback(async (type: ReportType, plantId: string, unitIds: string[], startDate: string, endDate: string) => {
    if (!profile) return;
    const report: Omit<Report, 'id'> = {
      title: `Rapport ${type} - ${new Date().toLocaleDateString('fr-FR')}`,
      type, status: 'generated', plantId, unitIds,
      dateRange: { start: startDate, end: endDate },
      generatedBy: profile.uid, generatedAt: new Date().toISOString(), format: 'pdf',
      summary: { totalAlerts: 0, criticalEvents: 0, averageHealthScore: 0, sensorUptime: 0, complianceScore: 0 },
      sections: [], createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, COLLECTIONS.REPORTS), report);
    await fetchReports(plantId);
  }, [profile, fetchReports]);

  return { reports, loading, fetchReports, generateReport };
}
export default useReporting;