import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text, Card, Chip, Divider, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack } from 'expo-router';
import GasLevelIndicator from '@/components/sensors/GasLevelIndicator';
import ThresholdBar from '@/components/sensors/ThresholdBar';
import SensorChart from '@/components/sensors/SensorChart';
import StatusIndicator from '@/components/common/StatusIndicator';
import { GAS_CONFIG, GAS_THRESHOLDS } from '@/config/gas.config';
import { GasType } from '@/types/sensor.types';

const SENSOR = {
  id: 's1', name: 'H2S-JFC01-001', type: 'H2S' as GasType, value: 4.2, unit: 'ppm',
  status: 'online' as const, model: 'Dräger X-am 8000', serial: 'DRG-2024-001',
  firmware: '3.2.1', battery: 85, rssi: -42,
  unitName: 'Acide Phosphorique', unitCode: 'JFC-01',
  lastCal: '2025-11-01', nextCal: '2026-02-01', installed: '2024-03-15',
  zone: 'Zone A - Bâtiment 1', lat: 33.1, lon: -8.6,
  twa8h: 3.8, stel15m: 4.5,
};

export default function SensorDetailScreen() {
  const { sensorId } = useLocalSearchParams<{ sensorId: string }>();
  const [tab, setTab] = useState('realtime');
  const { width } = useWindowDimensions();
  const gas = GAS_CONFIG[SENSOR.type];
  const threshold = GAS_THRESHOLDS[SENSOR.type];

  return (
    <>
      <Stack.Screen options={{ title: SENSOR.name, headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }} />
      <ScrollView style={s.bg}>
        {/* Header */}
        <View style={s.hdr}>
          <View style={s.hdrTop}>
            <View style={s.gasIconWrap}>
              <MaterialCommunityIcons name={(gas?.icon || 'gauge') as any} size={36} color={gas?.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleLarge" style={s.sName}>{SENSOR.name}</Text>
              <Text style={s.gasFullName}>{gas?.fullName}</Text>
              <View style={s.chipRow}>
                <Chip compact style={s.chip}><Text style={s.chipTxt}>{SENSOR.unitCode} · {SENSOR.unitName}</Text></Chip>
                <StatusIndicator status={SENSOR.status} size="small" />
              </View>
            </View>
            <View style={s.liveVal}>
              <Text style={[s.bigVal, { color: gas?.color }]}>{SENSOR.value}</Text>
              <Text style={s.valUnit}>{SENSOR.unit}</Text>
              <Text style={[s.gasLabel, { color: gas?.color }]}>{gas?.name}</Text>
            </View>
          </View>
          <View style={s.hdrBar}>
            <GasLevelIndicator gasType={SENSOR.type} value={SENSOR.value} />
          </View>
        </View>

        {/* Tabs */}
        <SegmentedButtons
          value={tab}
          onValueChange={setTab}
          buttons={[
            { value: 'realtime', label: 'Temps réel' },
            { value: 'history', label: 'Historique' },
            { value: 'info', label: 'Informations' },
          ]}
          style={s.tabs}
        />

        {/* Real-time Tab */}
        {tab === 'realtime' && (
          <View style={s.sec}>
            <SensorChart title="Évolution en temps réel" height={200} color={gas?.color} />

            <Text variant="titleSmall" style={s.secTitle}>Seuils d'exposition (ISO 45001)</Text>
            <Card style={s.card}>
              <Card.Content>
                <ThresholdBar threshold={threshold} currentValue={SENSOR.value} />
                <View style={s.thGrid}>
                  <ThItem label="TWA (8h)" value={`${threshold.twa} ${threshold.unit}`} sublabel={`Actuel: ${SENSOR.twa8h} ${threshold.unit}`} color="#4CAF50" />
                  <ThItem label="STEL (15min)" value={`${threshold.stel} ${threshold.unit}`} sublabel={`Actuel: ${SENSOR.stel15m} ${threshold.unit}`} color="#FF9800" />
                  <ThItem label="IDLH" value={`${threshold.idlh} ${threshold.unit}`} sublabel="Danger immédiat" color="#F44336" />
                </View>
              </Card.Content>
            </Card>

            <Text variant="titleSmall" style={s.secTitle}>État du capteur</Text>
            <Card style={s.card}>
              <Card.Content>
                <InfoRow icon="battery" label="Batterie" value={`${SENSOR.battery}%`} color={SENSOR.battery > 50 ? '#4CAF50' : SENSOR.battery > 20 ? '#FF9800' : '#F44336'} />
                <Divider style={s.divider} />
                <InfoRow icon="signal" label="Signal (RSSI)" value={`${SENSOR.rssi} dBm`} color={SENSOR.rssi > -60 ? '#4CAF50' : '#FF9800'} />
                <Divider style={s.divider} />
                <InfoRow icon="map-marker" label="Zone" value={SENSOR.zone} color="#2196F3" />
                <Divider style={s.divider} />
                <InfoRow icon="thermometer" label="Température" value="42°C" color="#FF5722" />
                <Divider style={s.divider} />
                <InfoRow icon="water-percent" label="Humidité" value="68%" color="#00BCD4" />
              </Card.Content>
            </Card>
          </View>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <View style={s.sec}>
            <SensorChart title="Dernières 24 heures" height={220} color={gas?.color} />
            <SensorChart title="7 derniers jours" height={220} color={gas?.color} />
            <SensorChart title="30 derniers jours" height={220} color={gas?.color} />

            <Text variant="titleSmall" style={s.secTitle}>Statistiques</Text>
            <Card style={s.card}>
              <Card.Content>
                <View style={s.statsGrid}>
                  <StatItem label="Min (24h)" value="1.2 ppm" color="#4CAF50" />
                  <StatItem label="Max (24h)" value="7.8 ppm" color="#F44336" />
                  <StatItem label="Moy (24h)" value="3.9 ppm" color="#FF9800" />
                  <StatItem label="Écart type" value="1.4 ppm" color="#2196F3" />
                </View>
              </Card.Content>
            </Card>

            <Text variant="titleSmall" style={s.secTitle}>Alertes récentes</Text>
            <Card style={s.card}>
              <Card.Content>
                <AlertItem time="Hier 14:32" level="warning" message="TWA dépassé: 11.2 ppm pendant 22min" />
                <Divider style={s.divider} />
                <AlertItem time="12/12 08:15" level="info" message="Calibration automatique effectuée" />
                <Divider style={s.divider} />
                <AlertItem time="10/12 22:48" level="warning" message="Pic détecté: 13.8 ppm" />
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Info Tab */}
        {tab === 'info' && (
          <View style={s.sec}>
            <Text variant="titleSmall" style={s.secTitle}>Identification</Text>
            <Card style={s.card}>
              <Card.Content>
                <InfoRow icon="tag" label="Identifiant" value={SENSOR.id} color="#9E9E9E" />
                <Divider style={s.divider} />
                <InfoRow icon="label" label="Nom" value={SENSOR.name} color="#fff" />
                <Divider style={s.divider} />
                <InfoRow icon="smoke-detector-variant" label="Type de gaz" value={`${gas?.name} (${gas?.fullName})`} color={gas?.color || '#fff'} />
                <Divider style={s.divider} />
                <InfoRow icon="factory" label="Unité" value={`${SENSOR.unitName} (${SENSOR.unitCode})`} color="#2196F3" />
              </Card.Content>
            </Card>

            <Text variant="titleSmall" style={s.secTitle}>Matériel</Text>
            <Card style={s.card}>
              <Card.Content>
                <InfoRow icon="cellphone" label="Modèle" value={SENSOR.model} color="#aaa" />
                <Divider style={s.divider} />
                <InfoRow icon="barcode" label="N° de série" value={SENSOR.serial} color="#aaa" />
                <Divider style={s.divider} />
                <InfoRow icon="update" label="Firmware" value={`v${SENSOR.firmware}`} color="#aaa" />
                <Divider style={s.divider} />
                <InfoRow icon="calendar-check" label="Installé le" value={SENSOR.installed} color="#aaa" />
              </Card.Content>
            </Card>

            <Text variant="titleSmall" style={s.secTitle}>Calibration</Text>
            <Card style={s.card}>
              <Card.Content>
                <InfoRow icon="tune" label="Dernière calibration" value={SENSOR.lastCal} color="#4CAF50" />
                <Divider style={s.divider} />
                <InfoRow icon="calendar-clock" label="Prochaine calibration" value={SENSOR.nextCal} color={new Date(SENSOR.nextCal) < new Date() ? '#F44336' : '#FF9800'} />
                <Divider style={s.divider} />
                <InfoRow icon="certificate" label="Conformité" value="ISO 45001 ✓" color="#4CAF50" />
              </Card.Content>
            </Card>

            <Text variant="titleSmall" style={s.secTitle}>Localisation</Text>
            <Card style={s.card}>
              <Card.Content>
                <InfoRow icon="map-marker" label="Zone" value={SENSOR.zone} color="#FF9800" />
                <Divider style={s.divider} />
                <InfoRow icon="crosshairs-gps" label="Coordonnées" value={`${SENSOR.lat}, ${SENSOR.lon}`} color="#aaa" />
              </Card.Content>
            </Card>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

function InfoRow({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={s.infoRow}>
      <MaterialCommunityIcons name={icon as any} size={18} color={color} />
      <Text style={s.infoLbl}>{label}</Text>
      <Text style={[s.infoVal, { color }]}>{value}</Text>
    </View>
  );
}

function ThItem({ label, value, sublabel, color }: { label: string; value: string; sublabel: string; color: string }) {
  return (
    <View style={s.thItem}>
      <Text style={s.thLabel}>{label}</Text>
      <Text style={[s.thVal, { color }]}>{value}</Text>
      <Text style={s.thSub}>{sublabel}</Text>
    </View>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={s.statItem}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={[s.statValue, { color }]}>{value}</Text>
    </View>
  );
}

function AlertItem({ time, level, message }: { time: string; level: string; message: string }) {
  const color = level === 'warning' ? '#FF9800' : level === 'critical' ? '#F44336' : '#2196F3';
  return (
    <View style={s.alertItem}>
      <View style={s.alertHeader}>
        <View style={[s.alertDot, { backgroundColor: color }]} />
        <Text style={[s.alertLevel, { color }]}>{level.toUpperCase()}</Text>
        <Text style={s.alertTime}>{time}</Text>
      </View>
      <Text style={s.alertMsg}>{message}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#1a1a2e' },
  hdr: { backgroundColor: '#16213e', padding: 16, borderBottomWidth: 1, borderBottomColor: '#0f3460' },
  hdrTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  gasIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#0f3460', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sName: { color: '#fff', fontWeight: 'bold' },
  gasFullName: { color: '#888', fontSize: 12 },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  chip: { backgroundColor: '#0f3460', height: 22 },
  chipTxt: { color: '#aaa', fontSize: 10 },
  liveVal: { alignItems: 'center' },
  bigVal: { fontSize: 32, fontWeight: 'bold' },
  valUnit: { color: '#888', fontSize: 12 },
  gasLabel: { fontWeight: 'bold', fontSize: 14, marginTop: 2 },
  hdrBar: { marginTop: 4 },
  tabs: { margin: 12 },
  sec: { paddingHorizontal: 12 },
  secTitle: { color: '#fff', fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  card: { backgroundColor: '#16213e', borderRadius: 12, marginBottom: 12 },
  divider: { backgroundColor: '#0f3460', marginVertical: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  infoLbl: { color: '#888', flex: 1, marginLeft: 10, fontSize: 13 },
  infoVal: { fontWeight: '600', fontSize: 13 },
  thGrid: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  thItem: { alignItems: 'center' },
  thLabel: { color: '#888', fontSize: 10 },
  thVal: { fontWeight: 'bold', fontSize: 16, marginTop: 2 },
  thSub: { color: '#666', fontSize: 9, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', width: '45%', paddingVertical: 10 },
  statLabel: { color: '#888', fontSize: 11 },
  statValue: { fontWeight: 'bold', fontSize: 16, marginTop: 4 },
  alertItem: { paddingVertical: 6 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  alertDot: { width: 8, height: 8, borderRadius: 4 },
  alertLevel: { fontWeight: 'bold', fontSize: 10 },
  alertTime: { color: '#666', fontSize: 10, marginLeft: 'auto' },
  alertMsg: { color: '#ccc', fontSize: 12, marginLeft: 14 },
});