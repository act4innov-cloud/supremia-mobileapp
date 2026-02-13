import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MOCK_CAMERAS = [
  { id: 'c1', name: 'CAM-JFC01-PTZ01', type: 'PTZ', status: 'online', unit: 'Acide Phosphorique', resolution: '1080p' },
  { id: 'c2', name: 'CAM-JFC01-DOME02', type: 'Dome', status: 'online', unit: 'Acide Phosphorique', resolution: '4K' },
  { id: 'c3', name: 'CAM-JFC02-PTZ01', type: 'PTZ', status: 'offline', unit: 'Acide Sulfurique', resolution: '1080p' },
  { id: 'c4', name: 'CAM-SAP01-PTZ01', type: 'PTZ', status: 'recording', unit: 'Granulation', resolution: '1080p' },
];

export default function CamerasScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Caméras de surveillance</Text>
      <View style={[styles.grid, isTablet && { flexDirection: 'row', flexWrap: 'wrap' }]}>
        {MOCK_CAMERAS.map((cam) => (
          <Card
            key={cam.id}
            style={[styles.card, isTablet && { width: '48%', marginHorizontal: '1%' }]}
            onPress={() => router.push(`/(tabs)/cameras/${cam.id}`)}
          >
            <Card.Content>
              <View style={styles.placeholder}>
                <MaterialCommunityIcons name="cctv" size={48} color="#444" />
                <Text style={styles.placeholderText}>Flux vidéo</Text>
              </View>
              <View style={styles.camInfo}>
                <Text variant="titleSmall" style={styles.camName}>{cam.name}</Text>
                <View style={styles.camMeta}>
                  <Chip compact style={styles.chip}><Text style={{ fontSize: 10, color: '#fff' }}>{cam.type}</Text></Chip>
                  <Chip compact style={styles.chip}><Text style={{ fontSize: 10, color: '#fff' }}>{cam.resolution}</Text></Chip>
                  <View style={[styles.dot, { backgroundColor: cam.status === 'online' || cam.status === 'recording' ? '#4CAF50' : '#F44336' }]} />
                </View>
                <Text variant="bodySmall" style={styles.unit}>{cam.unit}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  sectionTitle: { color: '#fff', margin: 16, fontWeight: 'bold' },
  grid: { padding: 4 },
  card: { backgroundColor: '#16213e', marginBottom: 12, marginHorizontal: 8, borderRadius: 12 },
  placeholder: { height: 140, backgroundColor: '#0f3460', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  placeholderText: { color: '#444', marginTop: 4, fontSize: 12 },
  camInfo: {},
  camName: { color: '#fff', fontWeight: 'bold' },
  camMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  chip: { backgroundColor: '#0f3460', height: 22 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  unit: { color: '#888', marginTop: 4, fontSize: 11 },
});