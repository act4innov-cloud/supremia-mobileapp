import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { GasThreshold } from '@/types/sensor.types';

interface Props { threshold: GasThreshold; currentValue: number; }

export default function ThresholdBar({ threshold, currentValue }: Props) {
  const max = threshold.idlh * 1.3;
  const twaP = (threshold.twa / max) * 100;
  const stelP = (threshold.stel / max) * 100;
  const idlhP = (threshold.idlh / max) * 100;
  const valP = Math.min((currentValue / max) * 100, 100);
  return (
    <View style={s.wrap}>
      <View style={s.bar}>
        <View style={[s.zone, { width: `${twaP}%`, backgroundColor: '#4CAF5033' }]} />
        <View style={[s.zone, { width: `${stelP - twaP}%`, backgroundColor: '#FF980033' }]} />
        <View style={[s.zone, { width: `${idlhP - stelP}%`, backgroundColor: '#F4433633' }]} />
        <View style={[s.needle, { left: `${valP}%` }]} />
      </View>
      <View style={s.labels}>
        <Text style={[s.lbl, { left: `${twaP}%` }]}>TWA: {threshold.twa}</Text>
        <Text style={[s.lbl, { left: `${stelP}%` }]}>STEL: {threshold.stel}</Text>
        <Text style={[s.lbl, { left: `${idlhP}%` }]}>IDLH: {threshold.idlh}</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({ wrap: { marginVertical: 8 }, bar: { height: 12, backgroundColor: '#0f3460', borderRadius: 6, flexDirection: 'row', overflow: 'hidden', position: 'relative' }, zone: { height: 12 }, needle: { position: 'absolute', top: -2, width: 3, height: 16, backgroundColor: '#fff', borderRadius: 1.5 }, labels: { flexDirection: 'row', marginTop: 4, position: 'relative', height: 14 }, lbl: { position: 'absolute', fontSize: 9, color: '#888' } });