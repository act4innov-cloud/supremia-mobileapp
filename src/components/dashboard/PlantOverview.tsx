import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HealthGauge from './HealthGauge';

interface Props { plantName: string; healthScore: number; totalUnits: number; operationalUnits: number; totalSensors: number; onlineSensors: number; activeAlerts: number; criticalAlerts: number; }
export default function PlantOverview({ plantName, healthScore, totalUnits, operationalUnits, totalSensors, onlineSensors, activeAlerts, criticalAlerts }: Props) {
  return (
    <Surface style={s.box} elevation={2}>
      <View style={s.hdr}><View><Text variant="titleLarge" style={s.nm}>{plantName}</Text><Text variant="bodySmall" style={s.sub}>Vue d'ensemble</Text></View><HealthGauge score={healthScore} size={80} strokeWidth={8} /></View>
      <View style={s.grid}>
        <St icon="factory" label="Unités" value={`${operationalUnits}/${totalUnits}`} color="#2196F3" />
        <St icon="gauge" label="Capteurs" value={`${onlineSensors}/${totalSensors}`} color="#4CAF50" />
        <St icon="alert-circle" label="Alertes" value={`${activeAlerts}`} color="#FF9800" />
        <St icon="alert-octagon" label="Critiques" value={`${criticalAlerts}`} color="#F44336" />
      </View>
    </Surface>
  );
}
function St({ icon, label, value, color }: any) { return <View style={s.st}><MaterialCommunityIcons name={icon} size={20} color={color} /><Text style={[s.stV, { color }]}>{value}</Text><Text style={s.stL}>{label}</Text></View>; }
const s = StyleSheet.create({ box: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, margin: 8 }, hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, nm: { color: '#fff', fontWeight: 'bold' }, sub: { color: '#888', marginTop: 2 }, grid: { flexDirection: 'row', justifyContent: 'space-around' }, st: { alignItems: 'center', gap: 4 }, stV: { fontWeight: 'bold', fontSize: 18 }, stL: { color: '#888', fontSize: 11 } });