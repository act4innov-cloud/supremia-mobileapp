import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text, Card, Chip, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import HealthGauge from '@/components/dashboard/HealthGauge';
import AlertsWidget from '@/components/dashboard/AlertsWidget';
import SensorMiniChart from '@/components/dashboard/SensorMiniChart';
import { GAS_CONFIG } from '@/config/gas.config';
import { GasType } from '@/types/sensor.types';

const UNIT = { name: 'Unité Acide Phosphorique', code: 'JFC-01', status: 'operational', healthScore: 92, description: 'Production acide phosphorique 54%', responsible: 'Ahmed Benali' };
const SENSORS = [
  { id: 's1', name: 'H2S-JFC01-001', type: 'H2S' as GasType, value: 4.2, unit: 'ppm', history: [3.1,3.8,4.0,3.5,4.2,3.9,4.1,4.2] },
  { id: 's2', name: 'CO2-JFC01-002', type: 'CO2' as GasType, value: 2800, unit: 'ppm', history: [2600,2750,2900,2800,2650,2800,2700,2800] },
  { id: 's3', name: 'CO-JFC01-003', type: 'CO' as GasType, value: 8, unit: 'ppm', history: [6,7,9,8,7,8,9,8] },
  { id: 's4', name: 'O2-JFC01-004', type: 'O2' as GasType, value: 20.8, unit: '%', history: [20.9,20.8,20.7,20.8,20.9,20.8,20.8,20.8] },
];

export default function UnitDetailScreen() {
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const [tab, setTab] = useState('overview');
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <>
      <Stack.Screen options={{ title: UNIT.name, headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }} />
      <ScrollView style={s.bg}>
        {/* Header Card */}
        <View style={s.hdr}>
          <HealthGauge score={UNIT.healthScore} size={90} strokeWidth={9} />
          <View style={s.hdrInfo}>
            <Text variant="titleLarge" style={s.name}>{UNIT.name}</Text>
            <View style={s.chips}>
              <Chip compact style={s.chip}><Text style={s.chipTxt}>{UNIT.code}</Text></Chip>
              <Chip compact style={[s.chip, { backgroundColor: '#4CAF5022' }]}><Text style={[s.chipTxt, { color: '#4CAF50' }]}>OPÉRATIONNEL</Text></Chip>
            </View>
            <Text style={s.desc}>{UNIT.description}</Text>
            <Text style={s.resp}>👤 {UNIT.responsible}</Text>
          </View>
        </View>

        <SegmentedButtons
          value={tab}
          onValueChange={setTab}
          buttons={[
            { value: 'overview', label: 'Général' },
            { value: 'sensors', label: 'Capteurs' },
            { value: 'cameras', label: 'Caméras' },
          ]}
          style={s.tabs}
        />

        {/* Overview Tab */}
        {tab === 'overview' && (
          <View style={s.sec}>
            <View style={s.statRow}>
              <StatBox icon="gauge" label="Capteurs" value={`${SENSORS.length}`} color="#4CAF50" />
              <StatBox icon="alert-circle" label="Alertes" value="0" color="#FF9800" />
              <StatBox icon="cctv" label="Caméras" value="2" color="#2196F3" />
              <StatBox icon="clock" label="Uptime" value="99.8%" color="#AB47BC" />
            </View>

            <Text variant="titleSmall" style={s.secTitle}>Capteurs temps réel</Text>
            <View style={isTablet ? s.grid : undefined}>
              {SENSORS.map(sn => {
                const g = GAS_CONFIG[sn.type];
                return (
                  <Card
                    key={sn.id}
                    style={[s.sCard, isTablet && { width: '48%', marginHorizontal: '1%' }]}
                    onPress={() => router.push(`/(tabs)/sensors/${sn.id}`)}
                  >
                    <Card.Content>
                      <View style={s.sHdr}>
                        <MaterialCommunityIcons name={(g?.icon || 'gauge') as any} size={20} color={g?.color} />
                        <Text style={[s.gLbl, { color: g?.color }]}>{g?.name}</Text>
                        <View style={[s.dot, { backgroundColor: '#4CAF50' }]} />
                      </View>
                      <SensorMiniChart data={sn.history} color={g?.color} currentValue={sn.value} unit={sn.unit} width={isTablet ? 140 : 110} />
                      <Text style={s.sId}>{sn.name}</Text>
                    </Card.Content>
                  </Card>
                );
              })}
            </View>

            <Text variant="titleSmall" style={s.secTitle}>Alertes récentes</Text>
            <AlertsWidget alerts={[]} />
          </View>
        )}

        {/* Sensors Tab */}
        {tab === 'sensors' && (
          <View style={s.sec}>
            {SENSORS.map(sn => {
              const g = GAS_CONFIG[sn.type];
              return (
                <Card key={sn.id} style={s.fCard} onPress={() => router.push(`/(tabs)/sensors/${sn.id}`)}>
                  <Card.Content>
                    <View style={s.fHdr}>
                      <MaterialCommunityIcons name={(g?.icon || 'gauge') as any} size={28} color={g?.color} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={s.fName}>{sn.name}</Text>
                        <Text style={s.fType}>{g?.fullName}</Text>
                      </View>
                      <Text style={[s.fVal, { color: g?.color }]}>
                        {sn.value} <Text style={s.fUnit}>{sn.unit}</Text>
                      </Text>
                    </View>
                    <SensorMiniChart data={sn.history} color={g?.color} width={width - 80} height={50} />
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        )}

        {/* Cameras Tab */}
        {tab === 'cameras' && (
          <View style={[s.sec, s.camPh]}>
            <MaterialCommunityIcons name="cctv" size={48} color="#444" />
            <Text style={s.phTxt}>2 caméras associées à cette unité</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

function StatBox({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={s.stat}>
      <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      <Text style={[s.statV, { color }]}>{value}</Text>
      <Text style={s.statL}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#1a1a2e' },
  hdr: { flexDirection: 'row', padding: 16, gap: 14, backgroundColor: '#16213e', borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  hdrInfo: { flex: 1 },
  name: { color: '#fff', fontWeight: 'bold', marginBottom: 4 },
  chips: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  chip: { backgroundColor: '#0f3460', height: 22 },
  chipTxt: { color: '#aaa', fontSize: 10 },
  desc: { color: '#888', fontSize: 12, marginBottom: 2 },
  resp: { color: '#666', fontSize: 11 },
  tabs: { margin: 12 },
  sec: { paddingHorizontal: 12 },
  secTitle: { color: '#fff', fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
  statRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#16213e', borderRadius: 12, padding: 14, marginBottom: 8 },
  stat: { alignItems: 'center', gap: 4 },
  statV: { fontWeight: 'bold', fontSize: 18 },
  statL: { color: '#888', fontSize: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  sCard: { backgroundColor: '#16213e', borderRadius: 12, marginBottom: 8, marginHorizontal: 2 },
  sHdr: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  gLbl: { fontWeight: 'bold', fontSize: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, marginLeft: 'auto' },
  sId: { color: '#666', fontSize: 10, marginTop: 4 },
  fCard: { backgroundColor: '#16213e', borderRadius: 12, marginBottom: 10 },
  fHdr: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  fName: { color: '#fff', fontWeight: 'bold' },
  fType: { color: '#888', fontSize: 11 },
  fVal: { fontWeight: 'bold', fontSize: 22 },
  fUnit: { fontSize: 12, color: '#aaa' },
  camPh: { height: 200, backgroundColor: '#16213e', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  phTxt: { color: '#666', marginTop: 12 },
});