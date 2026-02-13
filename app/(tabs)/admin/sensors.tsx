// ============================================================
// SUPREMIA Platform - Admin: Gestion des Capteurs
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { Text, Card, FAB, Searchbar, Chip, SegmentedButtons, Portal, Modal, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Sensor, GasType, SensorStatus } from '@/types/sensor.types';
import { GAS_CONFIG, GAS_THRESHOLDS } from '@/config/gas.config';
import SensorForm from '@/components/admin/SensorForm';
import Button from '@/components/common/Button';

const MOCK_SENSORS: Partial<Sensor>[] = [
  { id: 's1', name: 'H2S-JFC01-001', type: 'H2S', unitId: '1', status: 'online', model: 'Dräger X-am 8000', serialNumber: 'DRG-2024-001', firmwareVersion: '3.2.1', lastCalibrationDate: '2025-11-01', nextCalibrationDate: '2026-02-01' },
  { id: 's2', name: 'CO2-JFC01-002', type: 'CO2', unitId: '1', status: 'online', model: 'Honeywell BW Ultra', serialNumber: 'HWL-2024-015', firmwareVersion: '2.8.0', lastCalibrationDate: '2025-10-15', nextCalibrationDate: '2026-01-15' },
  { id: 's3', name: 'H2S-JFC02-001', type: 'H2S', unitId: '2', status: 'warning', model: 'MSA ALTAIR 5X', serialNumber: 'MSA-2024-003', firmwareVersion: '4.1.0', lastCalibrationDate: '2025-09-20', nextCalibrationDate: '2025-12-20' },
  { id: 's4', name: 'NH3-SAP01-001', type: 'NH3', unitId: '4', status: 'critical', model: 'RAE Systems MiniRAE', serialNumber: 'RAE-2024-008', firmwareVersion: '1.5.3', lastCalibrationDate: '2025-08-01', nextCalibrationDate: '2025-11-01' },
  { id: 's5', name: 'SO2-JFC02-002', type: 'SO2', unitId: '2', status: 'online', model: 'Crowcon T4x', serialNumber: 'CRW-2024-022', firmwareVersion: '5.0.2', lastCalibrationDate: '2025-12-01', nextCalibrationDate: '2026-03-01' },
  { id: 's6', name: 'O2-JFC03-001', type: 'O2', unitId: '3', status: 'offline', model: 'BW Clip4', serialNumber: 'BW4-2024-011', firmwareVersion: '2.3.0', lastCalibrationDate: '2025-07-15', nextCalibrationDate: '2025-10-15' },
];

const STATUS_COLORS: Record<SensorStatus, string> = {
  online: '#4CAF50', offline: '#9E9E9E', warning: '#FF9800', critical: '#F44336', maintenance: '#2196F3', calibrating: '#AB47BC',
};

export default function AdminSensorsScreen() {
  const [sensors, setSensors] = useState(MOCK_SENSORS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Sensor> | undefined>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const filtered = sensors.filter(s => {
    const matchSearch = (s.name || '').toLowerCase().includes(search.toLowerCase()) || (s.type || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || filter === s.status || (filter === 'alerts' && (s.status === 'warning' || s.status === 'critical'));
    return matchSearch && matchFilter;
  });

  const handleSave = async (data: Partial<Sensor>) => {
    await new Promise(r => setTimeout(r, 500));
    if (editing?.id) {
      setSensors(prev => prev.map(s => s.id === editing.id ? { ...s, ...data } : s));
    } else {
      setSensors(prev => [...prev, { ...data, id: `s_${Date.now()}`, status: 'maintenance' as SensorStatus }]);
    }
    setShowForm(false);
    setEditing(undefined);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Suppression', 'Supprimer ce capteur ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => setSensors(prev => prev.filter(s => s.id !== id)) },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Gestion des Capteurs', headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }} />
      <View style={st.container}>
        <Searchbar placeholder="Rechercher un capteur..." value={search} onChangeText={setSearch} style={st.search} inputStyle={{ color: '#fff' }} iconColor="#aaa" placeholderTextColor="#666" />

        <SegmentedButtons value={filter} onValueChange={setFilter} buttons={[
          { value: 'all', label: `Tous (${sensors.length})` },
          { value: 'online', label: 'En ligne' },
          { value: 'alerts', label: 'Alertes' },
          { value: 'offline', label: 'Hors ligne' },
        ]} style={st.filters} />

        <Portal>
          <Modal visible={showForm} onDismiss={() => { setShowForm(false); setEditing(undefined); }} contentContainerStyle={st.modal}>
            <SensorForm sensor={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(undefined); }} />
          </Modal>
        </Portal>

        <ScrollView style={st.scroll}>
          <View style={isTablet ? st.grid : undefined}>
            {filtered.map(sensor => {
              const gas = GAS_CONFIG[sensor.type as GasType];
              const threshold = GAS_THRESHOLDS[sensor.type as GasType];
              const needsCalibration = sensor.nextCalibrationDate && new Date(sensor.nextCalibrationDate) < new Date();
              return (
                <Card key={sensor.id} style={[st.card, isTablet && { width: '48%', marginHorizontal: '1%' }, sensor.status === 'critical' && st.criticalCard]}>
                  <Card.Content>
                    <View style={st.hdr}>
                      <View style={st.sensorInfo}>
                        <MaterialCommunityIcons name={(gas?.icon || 'gauge') as any} size={28} color={gas?.color || '#aaa'} />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text variant="titleSmall" style={st.sName}>{sensor.name}</Text>
                          <Text style={st.sModel}>{sensor.model}</Text>
                        </View>
                      </View>
                      <View style={[st.statusDot, { backgroundColor: STATUS_COLORS[sensor.status || 'offline'] }]} />
                    </View>

                    <View style={st.chipRow}>
                      <Chip compact style={[st.gasChip, { borderColor: gas?.color }]}><Text style={[st.gasChipTxt, { color: gas?.color }]}>{gas?.name || sensor.type}</Text></Chip>
                      <Chip compact style={st.fwChip}><Text style={st.fwTxt}>FW {sensor.firmwareVersion}</Text></Chip>
                      {needsCalibration && <Chip compact icon="alert" style={st.calChip}><Text style={st.calTxt}>Calibration requise</Text></Chip>}
                    </View>

                    <Divider style={st.divider} />

                    <View style={st.thresholds}>
                      <Text style={st.thTitle}>Seuils ({threshold?.unit || 'ppm'})</Text>
                      <View style={st.thRow}>
                        <Text style={st.thItem}>TWA: <Text style={st.thVal}>{threshold?.twa}</Text></Text>
                        <Text style={st.thItem}>STEL: <Text style={[st.thVal, { color: '#FF9800' }]}>{threshold?.stel}</Text></Text>
                        <Text style={st.thItem}>IDLH: <Text style={[st.thVal, { color: '#F44336' }]}>{threshold?.idlh}</Text></Text>
                      </View>
                    </View>

                    <Text style={st.serial}>S/N: {sensor.serialNumber} · Calibré: {sensor.lastCalibrationDate}</Text>

                    <View style={st.actions}>
                      <Button label="Configurer" mode="text" variant="primary" icon="cog" compact onPress={() => { setEditing(sensor as Partial<Sensor>); setShowForm(true); }} />
                      <Button label="Calibrer" mode="text" variant="success" icon="tune" compact onPress={() => {}} />
                      <Button label="Supprimer" mode="text" variant="danger" icon="delete" compact onPress={() => handleDelete(sensor.id!)} />
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
          <View style={{ height: 80 }} />
        </ScrollView>

        <FAB icon="plus" label="Nouveau capteur" style={st.fab} color="#fff" onPress={() => { setEditing(undefined); setShowForm(true); }} />
      </View>
    </>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  search: { margin: 12, backgroundColor: '#16213e', borderRadius: 12 },
  filters: { marginHorizontal: 12, marginBottom: 8 },
  scroll: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 4 },
  card: { backgroundColor: '#16213e', borderRadius: 12, marginBottom: 10, marginHorizontal: 8 },
  criticalCard: { borderLeftWidth: 4, borderLeftColor: '#F44336' },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sensorInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  sName: { color: '#fff', fontWeight: 'bold' }, sModel: { color: '#666', fontSize: 11 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  chipRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  gasChip: { backgroundColor: 'transparent', borderWidth: 1 }, gasChipTxt: { fontSize: 11, fontWeight: 'bold' },
  fwChip: { backgroundColor: '#0f3460' }, fwTxt: { color: '#888', fontSize: 10 },
  calChip: { backgroundColor: '#FF980022' }, calTxt: { color: '#FF9800', fontSize: 10 },
  divider: { backgroundColor: '#0f3460', marginVertical: 8 },
  thresholds: { marginBottom: 8 }, thTitle: { color: '#888', fontSize: 10, marginBottom: 4 },
  thRow: { flexDirection: 'row', gap: 16 }, thItem: { color: '#aaa', fontSize: 11 }, thVal: { color: '#fff', fontWeight: 'bold' },
  serial: { color: '#555', fontSize: 10, marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#e94560', borderRadius: 16 },
  modal: { backgroundColor: '#1a1a2e', margin: 16, borderRadius: 16, maxHeight: '85%' },
});