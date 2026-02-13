import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import Button from '@/components/common/Button';
import { Sensor, GasType } from '@/types/sensor.types';

interface Props { sensor?: Partial<Sensor>; onSave: (data: Partial<Sensor>) => void; onCancel: () => void; loading?: boolean; }

export default function SensorForm({ sensor, onSave, onCancel, loading }: Props) {
  const [name, setName] = useState(sensor?.name || '');
  const [type, setType] = useState<string>(sensor?.type || 'H2S');
  const [model, setModel] = useState(sensor?.model || '');
  const [serial, setSerial] = useState(sensor?.serialNumber || '');
  return (
    <ScrollView style={s.w}>
      <Text variant="titleMedium" style={s.t}>{sensor?.id ? 'Modifier capteur' : 'Nouveau capteur'}</Text>
      <TextInput label="Nom" value={name} onChangeText={setName} mode="outlined" style={s.i} outlineColor="#333" activeOutlineColor="#e94560" />
      <TextInput label="Type de gaz" value={type} onChangeText={setType} mode="outlined" style={s.i} outlineColor="#333" activeOutlineColor="#e94560" />
      <TextInput label="Modèle" value={model} onChangeText={setModel} mode="outlined" style={s.i} outlineColor="#333" activeOutlineColor="#e94560" />
      <TextInput label="N° de série" value={serial} onChangeText={setSerial} mode="outlined" style={s.i} outlineColor="#333" activeOutlineColor="#e94560" />
      <View style={s.btns}>
        <Button label="Annuler" mode="outlined" variant="secondary" onPress={onCancel} />
        <Button label="Enregistrer" variant="primary" onPress={() => onSave({ name, type: type as GasType, model, serialNumber: serial })} loading={loading} />
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({ w: { padding: 16 }, t: { color: '#fff', fontWeight: 'bold', marginBottom: 16 }, i: { marginBottom: 12, backgroundColor: '#16213e' }, btns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 } });