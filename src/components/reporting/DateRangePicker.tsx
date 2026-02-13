import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';

interface Props { startDate: string; endDate: string; onChange: (start: string, end: string) => void; }

export default function DateRangePicker({ startDate, endDate, onChange }: Props) {
  return (
    <View style={s.w}>
      <TextInput label="Date début" value={startDate} onChangeText={(v) => onChange(v, endDate)} mode="outlined" style={s.input} outlineColor="#333" activeOutlineColor="#e94560" left={<TextInput.Icon icon="calendar" />} />
      <Text style={s.sep}>→</Text>
      <TextInput label="Date fin" value={endDate} onChangeText={(v) => onChange(startDate, v)} mode="outlined" style={s.input} outlineColor="#333" activeOutlineColor="#e94560" left={<TextInput.Icon icon="calendar" />} />
    </View>
  );
}
const s = StyleSheet.create({ w: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }, input: { flex: 1, backgroundColor: '#16213e' }, sep: { color: '#888' } });