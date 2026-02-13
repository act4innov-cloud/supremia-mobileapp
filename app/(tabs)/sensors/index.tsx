// ============================================================
// SUPREMIA Platform - Sensors Screen
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text, Card, Chip, Searchbar, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { GAS_CONFIG, ALERT_COLORS } from '@/config/gas.config';
import { GasType, SensorStatus } from '@/types/sensor.types';

const MOCK_SENSORS = [
  { id: 's1', name: 'H2S-JFC01-001', type: 'H2S' as GasType, value: 4.2, unit: 'ppm', status: 'online' as SensorStatus, unitName: 'Acide Phosphorique', alert: null },
  { id: 's2', name: 'CO2-JFC01-002', type: 'CO2' as GasType, value: 2800, unit: 'ppm', status: 'online' as SensorStatus, unitName: 'Acide Phosphorique', alert: null },
  { id: 's3', name: 'H2S-JFC02-001', type: 'H2S' as GasType, value: 12.5, unit: 'ppm', status: 'warning' as SensorStatus, unitName: 'Acide Sulfurique', alert: 'warning' },
  { id: 's4', name: 'NH3-SAP01-001', type: 'NH3' as GasType, value: 38, unit: 'ppm', status: 'critical' as SensorStatus, unitName: 'Granulation', alert: 'critical' },
  { id: 's5', name: 'SO2-JFC02-002', type: 'SO2' as GasType, value: 1.1, unit: 'ppm', status: 'online' as SensorStatus, unitName: 'Acide Sulfurique', alert: null },
  { id: 's6', name: 'O2-JFC03-001', type: 'O2' as GasType, value: 20.8, unit: '%', status: 'online' as SensorStatus, unitName: 'Engrais DAP', alert: null },
];

export default function SensorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const filtered = MOCK_SENSORS.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.unitName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'alerts' && s.alert) || (filter === 'offline' && s.status === 'offline');
    return matchesSearch && matchesFilter;
  });

  return (
    <ScrollView style={styles.container}>
      <Searchbar
        placeholder="Rechercher un capteur..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
        inputStyle={{ color: '#fff' }}
        iconColor="#aaa"
        placeholderTextColor="#666"
      />

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'all', label: 'Tous' },
          { value: 'alerts', label: 'Alertes' },
          { value: 'offline', label: 'Hors ligne' },
        ]}
        style={styles.filters}
      />

      <View style={[styles.grid, isTablet && { flexDirection: 'row', flexWrap: 'wrap' }]}>
        {filtered.map((sensor) => {
          const gasInfo = GAS_CONFIG[sensor.type];
          return (
            <Card
              key={sensor.id}
              style={[
                styles.sensorCard,
                isTablet && { width: '48%', marginHorizontal: '1%' },
                sensor.alert === 'critical' && styles.criticalBorder,
              ]}
              onPress={() => router.push(`/(tabs)/sensors/${sensor.id}`)}
            >
              <Card.Content>
                <View style={styles.sensorHeader}>
                  <View style={styles.sensorInfo}>
                    <MaterialCommunityIcons
                      name={gasInfo?.icon as any || 'gauge'}
                      size={24}
                      color={gasInfo?.color || '#fff'}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text variant="titleSmall" style={styles.sensorName}>{sensor.name}</Text>
                      <Text variant="bodySmall" style={styles.sensorUnit}>{sensor.unitName}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusDot, {
                    backgroundColor: sensor.status === 'online' ? '#4CAF50' : sensor.status === 'warning' ? '#FF9800' : sensor.status === 'critical' ? '#F44336' : '#666',
                  }]} />
                </View>

                <View style={styles.valueRow}>
                  <Text variant="headlineMedium" style={[styles.value, { color: gasInfo?.color || '#fff' }]}>
                    {sensor.value}
                  </Text>
                  <Text variant="bodySmall" style={styles.valueUnit}>{sensor.unit}</Text>
                  <Text variant="titleMedium" style={[styles.gasName, { color: gasInfo?.color }]}>
                    {gasInfo?.name || sensor.type}
                  </Text>
                </View>

                {sensor.alert && (
                  <Chip
                    icon="alert"
                    compact
                    style={{ backgroundColor: ALERT_COLORS[sensor.alert as keyof typeof ALERT_COLORS]?.bg, alignSelf: 'flex-start', marginTop: 8 }}
                    textStyle={{ color: ALERT_COLORS[sensor.alert as keyof typeof ALERT_COLORS]?.text, fontSize: 11 }}
                  >
                    {ALERT_COLORS[sensor.alert as keyof typeof ALERT_COLORS]?.labelFr}
                  </Chip>
                )}
              </Card.Content>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  search: { margin: 12, backgroundColor: '#16213e', borderRadius: 12 },
  filters: { marginHorizontal: 12, marginBottom: 12 },
  grid: { padding: 4 },
  sensorCard: { backgroundColor: '#16213e', marginBottom: 10, marginHorizontal: 8, borderRadius: 12 },
  criticalBorder: { borderLeftWidth: 4, borderLeftColor: '#F44336' },
  sensorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sensorInfo: { flexDirection: 'row', alignItems: 'center' },
  sensorName: { color: '#fff', fontWeight: 'bold' },
  sensorUnit: { color: '#888', fontSize: 11 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  value: { fontWeight: 'bold' },
  valueUnit: { color: '#aaa' },
  gasName: { marginLeft: 'auto', fontWeight: 'bold' },
});