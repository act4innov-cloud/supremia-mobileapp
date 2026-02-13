import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '@/components/common/Button';
import { Report, ReportStatus, ReportType } from '@/types/dashboard.types';

interface Props { report: Report; onView?: () => void; onExportPdf?: () => void; onExportExcel?: () => void; }

const TYPE_ICONS: Record<ReportType, string> = { daily: 'calendar-today', weekly: 'calendar-week', monthly: 'calendar-month', custom: 'calendar-range', incident: 'alert-circle' };
const STATUS_COLORS: Record<ReportStatus, string> = { draft: '#9E9E9E', generated: '#2196F3', reviewed: '#4CAF50', archived: '#607D8B' };

export default function ReportCard({ report, onView, onExportPdf, onExportExcel }: Props) {
  return (
    <Surface style={s.card} elevation={1}>
      <View style={s.hdr}>
        <MaterialCommunityIcons name={(TYPE_ICONS[report.type] || 'file-document') as any} size={24} color={report.type === 'incident' ? '#F44336' : '#2196F3'} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text variant="titleSmall" style={s.title}>{report.title}</Text>
          <Text variant="bodySmall" style={s.date}>{report.dateRange.start} → {report.dateRange.end}</Text>
        </View>
        <Chip compact style={{ backgroundColor: STATUS_COLORS[report.status] + '33' }}>
          <Text style={{ fontSize: 10, color: STATUS_COLORS[report.status] }}>{report.status}</Text>
        </Chip>
      </View>
      <View style={s.summary}>
        <Stat label="Alertes" value={report.summary.totalAlerts} color="#FF9800" />
        <Stat label="Critiques" value={report.summary.criticalEvents} color="#F44336" />
        <Stat label="Santé moy." value={`${report.summary.averageHealthScore}%`} color="#4CAF50" />
        <Stat label="Uptime" value={`${report.summary.sensorUptime}%`} color="#2196F3" />
      </View>
      <View style={s.actions}>
        {onView && <Button label="Voir" mode="text" variant="primary" icon="eye" onPress={onView} compact />}
        {onExportPdf && <Button label="PDF" mode="text" variant="danger" icon="file-pdf-box" onPress={onExportPdf} compact />}
        {onExportExcel && <Button label="Excel" mode="text" variant="success" icon="microsoft-excel" onPress={onExportExcel} compact />}
      </View>
    </Surface>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return <View style={s.stat}><Text style={[s.statVal, { color }]}>{value}</Text><Text style={s.statLbl}>{label}</Text></View>;
}

const s = StyleSheet.create({
  card: { backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 10 },
  hdr: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { color: '#fff', fontWeight: 'bold' }, date: { color: '#888', marginTop: 2 },
  summary: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12, paddingVertical: 8, backgroundColor: '#1a1a2e', borderRadius: 8 },
  stat: { alignItems: 'center' }, statVal: { fontWeight: 'bold', fontSize: 16 }, statLbl: { color: '#888', fontSize: 10, marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
});