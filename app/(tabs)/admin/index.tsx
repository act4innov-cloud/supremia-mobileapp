import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ADMIN_SECTIONS = [
  { id: 'units', title: 'Gestion des Unités', subtitle: 'Ajouter, modifier les unités de production', icon: 'factory', color: '#2196F3', route: '/(tabs)/admin/units' },
  { id: 'sensors', title: 'Gestion des Capteurs', subtitle: 'Configurer les capteurs IoT et seuils', icon: 'gauge', color: '#4CAF50', route: '/(tabs)/admin/sensors' },
  { id: 'users', title: 'Gestion des Utilisateurs', subtitle: 'Rôles et permissions', icon: 'account-group', color: '#FF9800', route: '/(tabs)/admin/users' },
  { id: 'dashboard', title: 'Personnaliser le Dashboard', subtitle: 'Widgets, layout, thèmes', icon: 'view-dashboard-edit', color: '#9C27B0', route: '/(tabs)/admin/settings' },
  { id: 'mqtt', title: 'Configuration MQTT', subtitle: 'Broker, topics, QoS', icon: 'lan', color: '#00BCD4', route: '/(tabs)/admin/settings' },
  { id: 'settings', title: 'Paramètres Généraux', subtitle: 'Notifications, export, intégrations', icon: 'cog', color: '#607D8B', route: '/(tabs)/admin/settings' },
];

export default function AdminScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Administration</Text>
      {ADMIN_SECTIONS.map((section) => (
        <Card
          key={section.id}
          style={styles.card}
          onPress={() => router.push(section.route as any)}
        >
          <Card.Content style={styles.cardContent}>
            <View style={[styles.iconBox, { backgroundColor: section.color + '22' }]}>
              <MaterialCommunityIcons name={section.icon as any} size={28} color={section.color} />
            </View>
            <View style={styles.cardText}>
              <Text variant="titleSmall" style={styles.cardTitle}>{section.title}</Text>
              <Text variant="bodySmall" style={styles.cardSubtitle}>{section.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  sectionTitle: { color: '#fff', margin: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#16213e', marginHorizontal: 12, marginBottom: 8, borderRadius: 12 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardText: { flex: 1, marginLeft: 14 },
  cardTitle: { color: '#fff', fontWeight: 'bold' },
  cardSubtitle: { color: '#888', marginTop: 2 },
});