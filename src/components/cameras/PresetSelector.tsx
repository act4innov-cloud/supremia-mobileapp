import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { CameraPreset } from '@/types/camera.types';

interface Props { presets: CameraPreset[]; activePresetId?: string; onSelect: (presetId: string) => void; }

export default function PresetSelector({ presets, activePresetId, onSelect }: Props) {
  return (
    <View style={s.wrap}>
      <Text variant="titleSmall" style={s.title}>Presets</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.list}>
        {presets.map(p => (
          <Chip
            key={p.id}
            selected={p.id === activePresetId}
            onPress={() => onSelect(p.id)}
            style={[s.chip, p.id === activePresetId && s.active]}
            textStyle={{ color: p.id === activePresetId ? '#fff' : '#aaa', fontSize: 12 }}
          >
            {p.name}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({ wrap: { marginVertical: 12 }, title: { color: '#fff', fontWeight: 'bold', marginBottom: 8, marginLeft: 4 }, list: { gap: 8, paddingHorizontal: 4 }, chip: { backgroundColor: '#16213e' }, active: { backgroundColor: '#e94560' } });