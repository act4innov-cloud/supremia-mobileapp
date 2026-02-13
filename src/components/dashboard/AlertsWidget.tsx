import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AlertBadge from '@/components/common/AlertBadge';
import { SensorAlert } from '@/types/sensor.types';
import { GAS_CONFIG, ALERT_COLORS } from '@/config/gas.config';

interface Props { alerts: SensorAlert[]; maxVisible?: number; onAcknowledge?: (id: string) => void; onViewAll?: () => void; }
export default function AlertsWidget({ alerts, maxVisible = 5, onAcknowledge, onViewAll }: Props) {
  const vis = alerts.slice(0, maxVisible);
  return (
    <View style={s.box}>
      <View style={s.hdr}><Text variant="titleSmall" style={s.title}>Alertes ({alerts.length})</Text>{onViewAll && alerts.length > maxVisible && <Text style={s.link} onPress={onViewAll}>Voir tout →</Text>}</View>
      {vis.length === 0 ? <View style={s.empty}><MaterialCommunityIcons name="check-circle" size={32} color="#4CAF50" /><Text style={s.emptyTxt}>Aucune alerte</Text></View>
      : vis.map(a => (
        <View key={a.id} style={[s.item, { borderLeftColor: ALERT_COLORS[a.level].text }]}>
          <View style={{ flex: 1 }}><AlertBadge level={a.level} compact /><Text style={s.msg}>{GAS_CONFIG[a.gasType]?.name}: {a.value} — {a.sensorName}</Text></View>
          {onAcknowledge && !a.acknowledged && <IconButton icon="check" iconColor="#4CAF50" size={18} onPress={() => onAcknowledge(a.id)} />}
        </View>
      ))}
    </View>
  );
}
const s = StyleSheet.create({ box: { backgroundColor: '#16213e', borderRadius: 12, padding: 14 }, hdr: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }, title: { color: '#fff', fontWeight: 'bold' }, link: { color: '#e94560', fontSize: 12 }, item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a2e', borderRadius: 8, marginBottom: 6, borderLeftWidth: 3, padding: 8 }, msg: { color: '#ccc', fontSize: 12, marginTop: 4 }, empty: { alignItems: 'center', padding: 20 }, emptyTxt: { color: '#888', marginTop: 8 } });