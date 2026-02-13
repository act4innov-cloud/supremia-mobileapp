import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UnitStatus } from '@/types/unit.types';

interface Props { name: string; code: string; status: UnitStatus; healthScore: number; activeSensors: number; totalSensors: number; activeAlerts: number; onPress?: () => void; }
const SC: Record<UnitStatus, string> = { operational: '#4CAF50', degraded: '#FF9800', shutdown: '#9E9E9E', maintenance: '#2196F3', alarm: '#F44336' };

export default function UnitCard({ name, code, status, healthScore, activeSensors, totalSensors, activeAlerts, onPress }: Props) {
  const hc = healthScore > 80 ? '#4CAF50' : healthScore > 50 ? '#FF9800' : '#F44336';
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <Surface style={[s.card, activeAlerts > 0 && s.alert]} elevation={2}>
        <View style={s.hdr}>
          <View style={{ flex: 1 }}><Text variant="titleMedium" style={s.name}>{name}</Text><Text variant="bodySmall" style={s.code}>{code}</Text></View>
          <View style={[s.badge, { backgroundColor: SC[status] }]}><Text style={s.badgeTxt}>{status === 'operational' ? 'OK' : status.toUpperCase()}</Text></View>
        </View>
        <View style={s.hRow}><Text style={s.hLbl}>Santé</Text><Text style={[s.hVal, { color: hc }]}>{healthScore}%</Text></View>
        <View style={s.barBg}><View style={[s.bar, { width: `${healthScore}%`, backgroundColor: hc }]} /></View>
        <View style={s.ftr}>
          <View style={s.stat}><MaterialCommunityIcons name="gauge" size={14} color="#aaa" /><Text style={s.statTxt}>{activeSensors}/{totalSensors}</Text></View>
          {activeAlerts > 0 && <View style={s.alertChip}><Text style={s.alertTxt}>{activeAlerts} alerte(s)</Text></View>}
        </View>
      </Surface>
    </Pressable>
  );
}
const s = StyleSheet.create({
  card: { backgroundColor: '#16213e', borderRadius: 12, padding: 16 }, alert: { borderLeftWidth: 4, borderLeftColor: '#F44336' },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }, name: { color: '#fff', fontWeight: 'bold' }, code: { color: '#888', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }, badgeTxt: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  hRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }, hLbl: { color: '#aaa', fontSize: 12 }, hVal: { fontWeight: 'bold', fontSize: 12 },
  barBg: { height: 6, backgroundColor: '#0f3460', borderRadius: 3, marginBottom: 12 }, bar: { height: 6, borderRadius: 3 },
  ftr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, stat: { flexDirection: 'row', alignItems: 'center', gap: 4 }, statTxt: { color: '#aaa', fontSize: 12 },
  alertChip: { backgroundColor: '#F44336', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }, alertTxt: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});