import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Polyline } from 'react-native-svg';

interface Props { data: number[]; width?: number; height?: number; color?: string; label?: string; currentValue?: number; unit?: string; }
export default function SensorMiniChart({ data, width = 120, height = 40, color = '#e94560', label, currentValue, unit }: Props) {
  if (data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1, p = 2;
  const pts = data.map((v, i) => `${p+(i/(data.length-1))*(width-p*2)},${height-p-((v-min)/rng)*(height-p*2)}`).join(' ');
  return (
    <View>{label && <Text style={s.lbl}>{label}</Text>}<View style={s.row}><Svg width={width} height={height}><Polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} /></Svg>
    {currentValue !== undefined && <View style={s.vw}><Text style={[s.val, { color }]}>{currentValue}</Text>{unit && <Text style={s.u}>{unit}</Text>}</View>}</View></View>
  );
}
const s = StyleSheet.create({ lbl: { color: '#888', fontSize: 10, marginBottom: 2 }, row: { flexDirection: 'row', alignItems: 'center', gap: 8 }, vw: { flexDirection: 'row', alignItems: 'baseline', gap: 2 }, val: { fontSize: 18, fontWeight: 'bold' }, u: { color: '#888', fontSize: 10 } });