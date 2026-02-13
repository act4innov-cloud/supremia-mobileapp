import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface Props { sensors?: any[]; height?: number; }

export default function SensorMap({ sensors = [], height = 300 }: Props) {
  return (
    <View style={[s.wrap, { height }]}>
      <Text style={s.placeholder}>Carte des capteurs{'\n'}(react-native-maps){'\n'}{sensors.length} capteurs</Text>
    </View>
  );
}
const s = StyleSheet.create({ wrap: { backgroundColor: '#0f3460', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }, placeholder: { color: '#444', textAlign: 'center' } });