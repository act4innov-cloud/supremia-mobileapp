import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function DashboardEditor() {
  return (
    <View style={s.w}>
      <Text variant="titleMedium" style={s.t}>Éditeur de Dashboard</Text>
      <Text style={s.p}>Interface drag & drop pour personnaliser les widgets, le layout et le thème du dashboard.</Text>
    </View>
  );
}
const s = StyleSheet.create({ w: { padding: 16 }, t: { color: '#fff', fontWeight: 'bold', marginBottom: 12 }, p: { color: '#aaa' } });