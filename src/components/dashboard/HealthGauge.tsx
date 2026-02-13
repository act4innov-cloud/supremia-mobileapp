import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';

interface Props { score: number; size?: number; strokeWidth?: number; label?: string; }
export default function HealthGauge({ score, size = 120, strokeWidth = 10, label = 'Santé' }: Props) {
  const r = (size - strokeWidth) / 2, c = 2 * Math.PI * r, p = Math.max(0, Math.min(100, score));
  const offset = c * (1 - p / 100), color = p > 80 ? '#4CAF50' : p > 50 ? '#FF9800' : '#F44336';
  return (
    <View style={{ position: 'relative' }}>
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={r} stroke="#0f3460" strokeWidth={strokeWidth} fill="none" />
        <Circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={strokeWidth} fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" rotation="-90" origin={`${size/2},${size/2}`} />
      </Svg>
      <View style={[s.c, { width: size, height: size }]}><Text style={[s.v, { color, fontSize: size*0.25 }]}>{Math.round(p)}</Text><Text style={[s.l, { fontSize: size*0.1 }]}>{label}</Text></View>
    </View>
  );
}
const s = StyleSheet.create({ c: { position: 'absolute', top: 0, left: 0, justifyContent: 'center', alignItems: 'center' }, v: { fontWeight: 'bold' }, l: { color: '#aaa', marginTop: 2 } });