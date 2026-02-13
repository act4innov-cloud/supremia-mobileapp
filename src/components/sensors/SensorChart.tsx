import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SensorHistoryPoint } from '@/types/sensor.types';

interface Props { data: SensorHistoryPoint[]; title?: string; height?: number; color?: string; }

export default function SensorChart({ data, title, height = 200, color = '#e94560' }: Props) {
  return (
    <View style={[s.wrap, { height: height + 40 }]}>
      {title && <Text variant="titleSmall" style={s.title}>{title}</Text>}
      <View style={[s.chart, { height }]}>
        <Text style={s.placeholder}>Graphique temps réel{'\n'}(Victory Native / Recharts)</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({ wrap: { marginBottom: 16 }, title: { color: '#fff', fontWeight: 'bold', marginBottom: 8 }, chart: { backgroundColor: '#0f3460', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }, placeholder: { color: '#444', textAlign: 'center' } });