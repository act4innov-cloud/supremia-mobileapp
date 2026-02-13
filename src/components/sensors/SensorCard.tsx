import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatusIndicator from '@/components/common/StatusIndicator';
import AlertBadge from '@/components/common/AlertBadge';
import { GasType, SensorStatus, AlertLevel } from '@/types/sensor.types';
import { GAS_CONFIG } from '@/config/gas.config';

interface Props { id: string; name: string; gasType: GasType; value: number; unit: string; status: SensorStatus; alertLevel: AlertLevel | null; unitName: string; onPress?: () => void; }

export default function SensorCard({ name, gasType, value, unit, status, alertLevel, unitName, onPress }: Props) {
  const gas = GAS_CONFIG[gasType];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <Surface style={[s.card, alertLevel === 'critical' || alertLevel === 'emergency' ? s.critical : null]} elevation={2}>
        <View style={s.hdr}>
          <View style={s.info}><MaterialCommunityIcons name={(gas?.icon || 'gauge') as any} size={24} color={gas?.color || '#fff'} />
            <View style={{ marginLeft: 10 }}><Text variant="titleSmall" style={s.name}>{name}</Text><Text variant="bodySmall" style={s.unit}>{unitName}</Text></View>
          </View>
          <StatusIndicator status={status} showLabel={false} size="small" pulse={status === 'critical'} />
        </View>
        <View style={s.valRow}>
          <Text variant="headlineMedium" style={[s.val, { color: gas?.color }]}>{value}</Text>
          <Text style={s.valUnit}>{unit}</Text>
          <Text variant="titleMedium" style={[s.gasName, { color: gas?.color }]}>{gas?.name || gasType}</Text>
        </View>
        {alertLevel && <AlertBadge level={alertLevel} compact />}
      </Surface>
    </Pressable>
  );
}
const s = StyleSheet.create({ card: { backgroundColor: '#16213e', borderRadius: 12, padding: 14 }, critical: { borderLeftWidth: 4, borderLeftColor: '#F44336' }, hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, info: { flexDirection: 'row', alignItems: 'center' }, name: { color: '#fff', fontWeight: 'bold' }, unit: { color: '#888', fontSize: 11 }, valRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 8 }, val: { fontWeight: 'bold' }, valUnit: { color: '#aaa' }, gasName: { marginLeft: 'auto', fontWeight: 'bold' } });