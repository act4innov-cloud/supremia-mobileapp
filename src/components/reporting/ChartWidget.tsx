import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface Props { title: string; type?: 'line' | 'bar' | 'pie'; height?: number; data?: any[]; }

export default function ChartWidget({ title, type = 'line', height = 200 }: Props) {
  return (
    <View style={[s.w, { height: height + 30 }]}>
      <Text variant="titleSmall" style={s.t}>{title}</Text>
      <View style={[s.chart, { height }]}>
        <Text style={s.ph}>Graphique {type}{'\n'}(Victory / Recharts)</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({ w: { marginBottom: 16 }, t: { color: '#fff', fontWeight: 'bold', marginBottom: 8 }, chart: { backgroundColor: '#0f3460', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }, ph: { color: '#444', textAlign: 'center' } });