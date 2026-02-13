import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { GasType, GasThreshold } from '@/types/sensor.types';
import { GAS_THRESHOLDS, GAS_CONFIG, getAlertLevel } from '@/config/gas.config';

interface Props { gasType: GasType; value: number; showThresholds?: boolean; }

export default function GasLevelIndicator({ gasType, value, showThresholds = true }: Props) {
  const threshold = GAS_THRESHOLDS[gasType];
  const gas = GAS_CONFIG[gasType];
  const alert = getAlertLevel(gasType, value);
  const maxScale = threshold.idlh * 1.2;
  const pct = Math.min((value / maxScale) * 100, 100);
  const color = alert ? (alert === 'emergency' ? '#F44336' : alert === 'critical' ? '#FF5722' : alert === 'warning' ? '#FF9800' : '#2196F3') : '#4CAF50';

  return (
    <View style={s.wrap}>
      <View style={s.hdr}><Text style={[s.gasName, { color: gas?.color }]}>{gas?.name}</Text><Text style={[s.val, { color }]}>{value} {threshold.unit}</Text></View>
      <View style={s.barBg}>
        <View style={[s.bar, { width: `${pct}%`, backgroundColor: color }]} />
        {showThresholds && <>
          <View style={[s.mark, { left: `${(threshold.twa / maxScale) * 100}%` }]} /><Text style={[s.markLbl, { left: `${(threshold.twa / maxScale) * 100}%` }]}>TWA</Text>
          <View style={[s.mark, s.markStel, { left: `${(threshold.stel / maxScale) * 100}%` }]} /><Text style={[s.markLbl, { left: `${(threshold.stel / maxScale) * 100}%` }]}>STEL</Text>
          <View style={[s.mark, s.markIdlh, { left: `${(threshold.idlh / maxScale) * 100}%` }]} /><Text style={[s.markLbl, { left: `${(threshold.idlh / maxScale) * 100}%` }]}>IDLH</Text>
        </>}
      </View>
    </View>
  );
}
const s = StyleSheet.create({ wrap: { marginBottom: 12 }, hdr: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }, gasName: { fontWeight: 'bold', fontSize: 14 }, val: { fontWeight: 'bold', fontSize: 14 }, barBg: { height: 8, backgroundColor: '#0f3460', borderRadius: 4, position: 'relative' }, bar: { height: 8, borderRadius: 4 }, mark: { position: 'absolute', top: -2, width: 2, height: 12, backgroundColor: '#FF9800' }, markStel: { backgroundColor: '#FF5722' }, markIdlh: { backgroundColor: '#F44336' }, markLbl: { position: 'absolute', top: 12, fontSize: 8, color: '#888' } });