// ============================================================
// SUPREMIA Platform - Dashboard Screen
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { Text, Card, Chip, Badge, IconButton, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useMQTT } from '@/contexts/MQTTContext';
import { useSensors } from '@/hooks/useSensors';
import { ALERT_COLORS } from '@/config/gas.config';
import { UnitStatus } from '@/types/unit.types';

// Placeholder data - replace with Firestore queries
const MOCK_UNITS = [
  { id: '1', name: 'Unité Acide Phosphorique', code: 'JFC-01', status: 'operational' as UnitStatus, healthScore: 92, activeSensors: 12, alerts: 0 },
  { id: '2', name: 'Unité Acide Sulfurique', code: 'JFC-02', status: 'degraded' as UnitStatus, healthScore: 74, activeSensors: 8, alerts: 2 },
  { id: '3', name: 'Unité Engrais DAP', code: 'JFC-03', status: 'operational' as UnitStatus, healthScore: 88, activeSensors: 10, alerts: 0 },
  { id: '4', name: 'Unité Granulation', code: 'SAP-01', status: 'alarm' as UnitStatus, healthScore: 45, activeSensors: 6, alerts: 3 },
];

const STATUS_COLORS: Record<UnitStatus, string> = {
  operational: '#4CAF50',
  degraded: '#FF9800',
  shutdown: '#9E9E9E',
  maintenance: '#2196F3',
  alarm: '#F44336',
};

export default function DashboardScreen() {
  const { profile } = useAuth();
  const { status: mqttStatus } = useMQTT();
  const { alerts, criticalAlerts } = useSensors({ plantId: profile?.plantId });
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const isTablet = width >= 768;
  const columns = isTablet ? 2 : 1;

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data from Firestore
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />}
    >
      {/* Connection Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: mqttStatus === 'connected' ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            MQTT: {mqttStatus === 'connected' ? 'Connecté' : 'Déconnecté'}
          </Text>
        </View>
        {criticalAlerts.length > 0 && (
          <Chip
            icon="alert"
            style={{ backgroundColor: '#F44336' }}
            textStyle={{ color: '#fff', fontSize: 12 }}
          >
            {criticalAlerts.length} alerte(s) critique(s)
          </Chip>
        )}
      </View>

      {/* Summary Cards */}
      <View style={[styles.summaryRow, isTablet && styles.summaryRowTablet]}>
        <SummaryCard icon="factory" label="Unités" value="4" color="#2196F3" />
        <SummaryCard icon="gauge" label="Capteurs" value="36" color="#4CAF50" />
        <SummaryCard icon="alert-circle" label="Alertes" value={`${alerts.length}`} color="#FF9800" />
        <SummaryCard icon="cctv" label="Caméras" value="12" color="#9C27B0" />
      </View>

      {/* Units Grid */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Unités de Production
      </Text>

      <View style={[styles.unitsGrid, { flexDirection: isTablet ? 'row' : 'column', flexWrap: 'wrap' }]}>
        {MOCK_UNITS.map((unit) => (
          <Card
            key={unit.id}
            style={[styles.unitCard, isTablet && { width: '48%', marginHorizontal: '1%' }]}
            onPress={() => router.push(`/(tabs)/dashboard/${unit.id}`)}
          >
            <Card.Content>
              <View style={styles.unitHeader}>
                <View>
                  <Text variant="titleMedium" style={styles.unitName}>{unit.name}</Text>
                  <Text variant="bodySmall" style={styles.unitCode}>{unit.code}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[unit.status] }]}>
                  <Text style={styles.statusBadgeText}>
                    {unit.status === 'operational' ? 'OK' : unit.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Health Score Bar */}
              <View style={styles.healthRow}>
                <Text variant="bodySmall" style={styles.healthLabel}>Santé</Text>
                <Text variant="bodySmall" style={[styles.healthValue, {
                  color: unit.healthScore > 80 ? '#4CAF50' : unit.healthScore > 50 ? '#FF9800' : '#F44336'
                }]}>
                  {unit.healthScore}%
                </Text>
              </View>
              <View style={styles.healthBarBg}>
                <View
                  style={[styles.healthBar, {
                    width: `${unit.healthScore}%`,
                    backgroundColor: unit.healthScore > 80 ? '#4CAF50' : unit.healthScore > 50 ? '#FF9800' : '#F44336',
                  }]}
                />
              </View>

              <View style={styles.unitFooter}>
                <Text variant="bodySmall" style={styles.unitStat}>
                  <MaterialCommunityIcons name="gauge" size={14} color="#aaa" /> {unit.activeSensors} capteurs
                </Text>
                {unit.alerts > 0 && (
                  <Chip
                    compact
                    style={{ backgroundColor: '#FF5722', height: 24 }}
                    textStyle={{ color: '#fff', fontSize: 10 }}
                  >
                    {unit.alerts} alerte(s)
                  </Chip>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <Surface style={styles.summaryCard} elevation={2}>
      <MaterialCommunityIcons name={icon as any} size={28} color={color} />
      <Text variant="headlineSmall" style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text variant="bodySmall" style={styles.summaryLabel}>{label}</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  statusItem: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: '#aaa', fontSize: 12 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    flexWrap: 'wrap',
  },
  summaryRowTablet: { paddingHorizontal: 24 },
  summaryCard: {
    flex: 1,
    minWidth: 72,
    alignItems: 'center',
    padding: 12,
    margin: 4,
    borderRadius: 12,
    backgroundColor: '#16213e',
  },
  summaryValue: { fontWeight: 'bold', marginTop: 4 },
  summaryLabel: { color: '#aaa', marginTop: 2 },
  sectionTitle: {
    color: '#fff',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  unitsGrid: { padding: 8 },
  unitCard: {
    backgroundColor: '#16213e',
    marginBottom: 12,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  unitName: { color: '#fff', fontWeight: 'bold' },
  unitCode: { color: '#888', marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  healthLabel: { color: '#aaa' },
  healthValue: { fontWeight: 'bold' },
  healthBarBg: {
    height: 6,
    backgroundColor: '#0f3460',
    borderRadius: 3,
    marginBottom: 12,
  },
  healthBar: { height: 6, borderRadius: 3 },
  unitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitStat: { color: '#aaa', fontSize: 12 },
});