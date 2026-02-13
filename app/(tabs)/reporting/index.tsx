import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, SegmentedButtons, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MOCK_REPORTS = [
  { id: 'r1', title: 'Rapport Journalier - Jorf Lasfar', date: '2025-12-20', type: 'daily', status: 'generated' },
  { id: 'r2', title: 'Rapport Hebdomadaire S51', date: '2025-12-15', type: 'weekly', status: 'reviewed' },
  { id: 'r3', title: 'Rapport Mensuel Novembre', date: '2025-12-01', type: 'monthly', status: 'archived' },
  { id: 'r4', title: 'Incident H2S - JFC02', date: '2025-12-18', type: 'incident', status: 'reviewed' },
];

export default function ReportingScreen() {
  const [tab, setTab] = useState('reports');

  return (
    <ScrollView style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { value: 'reports', label: 'Rapports' },
          { value: 'archive', label: 'Archives' },
        ]}
        style={styles.tabs}
      />

      {tab === 'reports' && (
        <View>
          <Button
            mode="contained"
            icon="plus"
            buttonColor="#e94560"
            style={styles.newBtn}
            onPress={() => {}}
          >
            Nouveau Rapport
          </Button>

          {MOCK_REPORTS.map((report) => (
            <Card key={report.id} style={styles.card}>
              <Card.Content>
                <View style={styles.reportHeader}>
                  <MaterialCommunityIcons
                    name={report.type === 'incident' ? 'alert-circle' : 'file-document'}
                    size={24}
                    color={report.type === 'incident' ? '#F44336' : '#2196F3'}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text variant="titleSmall" style={styles.reportTitle}>{report.title}</Text>
                    <Text variant="bodySmall" style={styles.reportDate}>{report.date}</Text>
                  </View>
                  <Chip compact style={{ backgroundColor: '#0f3460' }}>
                    <Text style={{ fontSize: 10, color: '#aaa' }}>{report.status}</Text>
                  </Chip>
                </View>
                <View style={styles.actions}>
                  <Button compact mode="text" textColor="#e94560" icon="eye" onPress={() => {}}>Voir</Button>
                  <Button compact mode="text" textColor="#4CAF50" icon="download" onPress={() => {}}>PDF</Button>
                  <Button compact mode="text" textColor="#2196F3" icon="microsoft-excel" onPress={() => {}}>Excel</Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      {tab === 'archive' && (
        <View style={styles.archiveContainer}>
          <MaterialCommunityIcons name="archive" size={64} color="#444" />
          <Text style={styles.archiveText}>Archives des rapports passés</Text>
          <Text style={styles.archiveSubtext}>Recherche par date, unité ou type de rapport</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  tabs: { margin: 12 },
  newBtn: { marginHorizontal: 12, marginBottom: 16, borderRadius: 8 },
  card: { backgroundColor: '#16213e', marginHorizontal: 12, marginBottom: 10, borderRadius: 12 },
  reportHeader: { flexDirection: 'row', alignItems: 'center' },
  reportTitle: { color: '#fff', fontWeight: 'bold' },
  reportDate: { color: '#888', marginTop: 2 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  archiveContainer: { alignItems: 'center', paddingTop: 80 },
  archiveText: { color: '#aaa', marginTop: 16, fontSize: 16 },
  archiveSubtext: { color: '#666', marginTop: 4 },
});