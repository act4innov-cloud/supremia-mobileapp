import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import Button from '@/components/common/Button';
import { ProductionUnit } from '@/types/unit.types';

interface Props { unit?: Partial<ProductionUnit>; onSave: (data: Partial<ProductionUnit>) => void; onCancel: () => void; loading?: boolean; }

export default function UnitForm({ unit, onSave, onCancel, loading }: Props) {
  const [name, setName] = useState(unit?.name || '');
  const [code, setCode] = useState(unit?.code || '');
  const [type, setType] = useState(unit?.type || '');
  const [desc, setDesc] = useState(unit?.description || '');
  return (
    <ScrollView style={s.w}>
      <Text variant="titleMedium" style={s.t}>{unit?.id ? 'Modifier l\'unité' : 'Nouvelle unité'}</Text>
      <TextInput label="Nom" value={name} onChangeText={setName} mode="outlined" style={s.i} outlineColor="#333" activeOutlineColor="#e94560" />
      <TextInput label="Code" value={code} onChangeText={setCode} mode="outlined" style={s.i} outlineColor="#333" activeOutlineColor="#e94560" />
      <TextInput label="Type" value={type} onChangeText={setType} mode="outlined" style={s.i} outlineColor="#333" activeOutlineColor="#e94560" />
      <TextInput label="Description" value={desc} onChangeText={setDesc} mode="outlined" multiline numberOfLines={3} style={s.i} outlineColor="#333" activeOutlineColor="#e94560" />
      <View style={s.btns}>
        <Button label="Annuler" mode="outlined" variant="secondary" onPress={onCancel} />
        <Button label="Enregistrer" variant="primary" onPress={() => onSave({ name, code, type, description: desc })} loading={loading} />
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({ w: { padding: 16 }, t: { color: '#fff', fontWeight: 'bold', marginBottom: 16 }, i: { marginBottom: 12, backgroundColor: '#16213e' }, btns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 } });