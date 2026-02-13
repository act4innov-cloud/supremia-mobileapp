import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Text, Card, Chip, Searchbar, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { GAS_CONFIG, ALERT_COLORS } from '@/config/gas.config';
import { useSensors } from '@/hooks/useSensors';

export default function SensorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Fetch all sensors (Jorf Lasfar and Safi)
  const { sensors: jorfSensors, loading: jorfLoading } = useSensors({ plantId: 'jorf_lasfar' });
  const { sensors: safiSensors, loading: safiLoading } = useSensors({ plantId: 'safi' });

  const allSensors = [...jorfSensors, ...safiSensors];
  const loading = jorfLoading || safiLoading;

  const filtered = allSensors.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.unitName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'alerts' && s.alert) || (filter === 'offline' && s.status === 'offline');
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

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
