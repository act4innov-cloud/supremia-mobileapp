// ============================================================
// SUPREMIA Platform - Admin: Gestion des Unités
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { Text, Card, FAB, Searchbar, Chip, Divider, Portal, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ProductionUnit, UnitStatus } from '@/types/unit.types';
import UnitForm from '@/components/admin/UnitForm';
import Button from '@/components/common/Button';

const STATUS_COLORS: Record<UnitStatus, string> = {
  operational: '#4CAF50', degraded: '#FF9800', shutdown: '#9E9E9E', maintenance: '#2196F3', alarm: '#F44336',
};

const MOCK_UNITS: Partial<ProductionUnit>[] = [
  { id: '1', name: 'Unité Acide Phosphorique', code: 'JFC-01', type: 'Phosphoric Acid', status: 'operational', healthScore: 92, sensors: ['s1','s2','s3'], cameras: ['c1','c2'], description: 'Production acide phosphorique 54%', responsiblePerson: 'Ahmed Benali', nextInspectionDate: '2026-02-15' },
  { id: '2', name: 'Unité Acide Sulfurique', code: 'JFC-02', type: 'Sulfuric Acid', status: 'degraded', healthScore: 74, sensors: ['s4','s5'], cameras: ['c3'], description: 'Production acide sulfurique', responsiblePerson: 'Fatima Zahra', nextInspectionDate: '2026-01-20' },
  { id: '3', name: 'Unité Engrais DAP', code: 'JFC-03', type: 'Fertilizer', status: 'operational', healthScore: 88, sensors: ['s6','s7','s8'], cameras: ['c4'], description: 'DAP production line', responsiblePerson: 'Karim Idrissi', nextInspectionDate: '2026-03-01' },
  { id: '4', name: 'Unité Granulation', code: 'SAP-01', type: 'Granulation', status: 'alarm', healthScore: 45, sensors: ['s9','s10'], cameras: ['c5'], description: 'Granulation des engrais', responsiblePerson: 'Youssef Tazi', nextInspectionDate: '2026-02-01' },
];

export default function AdminUnitsScreen() {
  const [units, setUnits] = useState(MOCK_UNITS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<ProductionUnit> | undefined>();
  const [saving, setSaving] = useState(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const filtered = units.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.code || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Partial<ProductionUnit>) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    if (editing?.id) {
      setUnits(prev => prev.map(u => u.id === editing.id ? { ...u, ...data } : u));
    } else {
      setUnits(prev => [...prev, { ...data, id: `u_${Date.now()}`, status: 'maintenance' as UnitStatus, healthScore: 0, sensors: [], cameras: [] }]);
    }
    setSaving(false);
    setShowForm(false);
    setEditing(undefined);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Suppression', 'Confirmer la suppression de cette unité ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => setUnits(prev => prev.filter(u => u.id !== id)) },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Gestion des Unités', headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }} />
      <View style={s.container}>
        <Searchbar placeholder="Rechercher..." value={search} onChangeText={setSearch} style={s.search} inputStyle={{ color: '#fff' }} iconColor="#aaa" placeholderTextColor="#666" />

        <View style={s.statsRow}>
          <Chip icon="factory" style={s.chip}><Text style={s.chipTxt}>{units.length} unités</Text></Chip>
          <Chip icon="check-circle" style={[s.chip, { backgroundColor: '#4CAF5022' }]}><Text style={[s.chipTxt, { color: '#4CAF50' }]}>{units.filter(u => u.status === 'operational').length} OK</Text></Chip>
          <Chip icon="alert" style={[s.chip, { backgroundColor: '#F4433622' }]}><Text style={[s.chipTxt, { color: '#F44336' }]}>{units.filter(u => u.status === 'alarm' || u.status === 'degraded').length} alerte</Text></Chip>
        </View>

        <Portal>
          <Modal visible={showForm} onDismiss={() => { setShowForm(false); setEditing(undefined); }} contentContainerStyle={s.modal}>
            <UnitForm unit={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(undefined); }} loading={saving} />
          </Modal>
        </Portal>

        <ScrollView style={s.scroll}>
          <View style={isTablet ? s.grid : undefined}>
            {filtered.map(unit => {
              const hc = (unit.healthScore || 0) > 80 ? '#4CAF50' : (unit.healthScore || 0) > 50 ? '#FF9800' : '#F44336';
              return (
                <Card key={unit.id} style={[s.card, isTablet && { width: '48%', marginHorizontal: '1%' }]}>
                  <Card.Content>
                    <View style={s.hdr}>
                      <View style={{ flex: 1 }}>
                        <Text variant="titleMedium" style={s.name}>{unit.name}</Text>
                        <View style={s.tags}><Chip compact style={s.tag}><Text style={s.tagTxt}>{unit.code}</Text></Chip><Chip compact style={s.tag}><Text style={s.tagTxt}>{unit.type}</Text></Chip></View>
                      </View>
                      <View style={[s.badge, { backgroundColor: STATUS_COLORS[unit.status || 'maintenance'] }]}>
                        <Text style={s.badgeTxt}>{(unit.status || '').toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={s.desc}>{unit.description}</Text>
                    <Divider style={s.divider} />
                    <View style={s.info}>
                      <View style={s.infoItem}><MaterialCommunityIcons name="gauge" size={14} color="#aaa" /><Text style={s.infoTxt}>{(unit.sensors || []).length} capteurs</Text></View>
                      <View style={s.infoItem}><MaterialCommunityIcons name="cctv" size={14} color="#aaa" /><Text style={s.infoTxt}>{(unit.cameras || []).length} caméras</Text></View>
                      <View style={s.infoItem}><MaterialCommunityIcons name="heart-pulse" size={14} color={hc} /><Text style={[s.infoTxt, { color: hc, fontWeight: 'bold' }]}>{unit.healthScore}%</Text></View>
                    </View>
                    <Text style={s.meta}>👤 {unit.responsiblePerson} · 📅 Inspection: {unit.nextInspectionDate}</Text>
                    <View style={s.actions}>
                      <Button label="Modifier" mode="text" variant="primary" icon="pencil" compact onPress={() => { setEditing(unit); setShowForm(true); }} />
                      <Button label="Supprimer" mode="text" variant="danger" icon="delete" compact onPress={() => handleDelete(unit.id!)} />
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
          {filtered.length === 0 && <View style={s.empty}><MaterialCommunityIcons name="magnify" size={48} color="#333" /><Text style={s.emptyTxt}>Aucune unité trouvée</Text></View>}
          <View style={{ height: 80 }} />
        </ScrollView>

        <FAB icon="plus" label="Nouvelle unité" style={s.fab} color="#fff" onPress={() => { setEditing(undefined); setShowForm(true); }} />
      </View>
    </>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  search: { margin: 12, backgroundColor: '#16213e', borderRadius: 12 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  chip: { backgroundColor: '#16213e' }, chipTxt: { color: '#aaa', fontSize: 11 },
  scroll: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 4 },
  card: { backgroundColor: '#16213e', borderRadius: 12, marginBottom: 10, marginHorizontal: 8 },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  name: { color: '#fff', fontWeight: 'bold' },
  tags: { flexDirection: 'row', gap: 6, marginTop: 4 }, tag: { backgroundColor: '#0f3460', height: 22 }, tagTxt: { color: '#aaa', fontSize: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' }, badgeTxt: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  desc: { color: '#777', fontSize: 12, marginBottom: 8 },
  divider: { backgroundColor: '#0f3460', marginVertical: 8 },
  info: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 }, infoTxt: { color: '#aaa', fontSize: 11 },
  meta: { color: '#555', fontSize: 11, marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  empty: { alignItems: 'center', paddingTop: 60 }, emptyTxt: { color: '#555', marginTop: 12 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#e94560', borderRadius: 16 },
  modal: { backgroundColor: '#1a1a2e', margin: 16, borderRadius: 16, maxHeight: '85%' },
});