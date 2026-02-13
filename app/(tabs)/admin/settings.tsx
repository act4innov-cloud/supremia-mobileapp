// ============================================================
// SUPREMIA Platform - Admin: Paramètres
// ============================================================

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Divider, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useSettingsStore } from '@/stores/settingsStore';
import { useMQTT } from '@/contexts/MQTTContext';
import StatusIndicator from '@/components/common/StatusIndicator';

export default function AdminSettingsScreen() {
  const settings = useSettingsStore();
  const { status: mqttStatus, connect, disconnect } = useMQTT();

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Paramètres', headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }} />
      <ScrollView style={s.container}>

        {/* Dashboard Settings */}
        <List.Section>
          <List.Subheader style={s.sectionTitle}>📊 Dashboard</List.Subheader>
          <View style={s.card}>
            <List.Item
              title="Thème" description={settings.theme === 'dark' ? 'Sombre' : settings.theme === 'light' ? 'Clair' : 'Système'}
              titleStyle={s.itemTitle} descriptionStyle={s.itemDesc}
              left={() => <MaterialCommunityIcons name="theme-light-dark" size={24} color="#AB47BC" style={s.icon} />}
            />
            <RadioButton.Group onValueChange={(v) => settings.setTheme(v as any)} value={settings.theme}>
              <View style={s.radioRow}>
                <RadioButton.Item label="Sombre" value="dark" labelStyle={s.radioLabel} color="#e94560" />
                <RadioButton.Item label="Clair" value="light" labelStyle={s.radioLabel} color="#e94560" />
                <RadioButton.Item label="Système" value="system" labelStyle={s.radioLabel} color="#e94560" />
              </View>
            </RadioButton.Group>

            <Divider style={s.divider} />

            <List.Item
              title="Langue" description={settings.language === 'fr' ? 'Français' : settings.language === 'en' ? 'English' : 'العربية'}
              titleStyle={s.itemTitle} descriptionStyle={s.itemDesc}
              left={() => <MaterialCommunityIcons name="translate" size={24} color="#2196F3" style={s.icon} />}
            />
            <RadioButton.Group onValueChange={(v) => settings.setLanguage(v as any)} value={settings.language}>
              <View style={s.radioRow}>
                <RadioButton.Item label="Français" value="fr" labelStyle={s.radioLabel} color="#e94560" />
                <RadioButton.Item label="English" value="en" labelStyle={s.radioLabel} color="#e94560" />
                <RadioButton.Item label="العربية" value="ar" labelStyle={s.radioLabel} color="#e94560" />
              </View>
            </RadioButton.Group>

            <Divider style={s.divider} />

            <List.Item
              title="Intervalle de rafraîchissement"
              description={`${settings.dashboardRefreshInterval / 1000}s`}
              titleStyle={s.itemTitle} descriptionStyle={s.itemDesc}
              left={() => <MaterialCommunityIcons name="refresh" size={24} color="#4CAF50" style={s.icon} />}
            />
          </View>
        </List.Section>

        {/* MQTT Settings */}
        <List.Section>
          <List.Subheader style={s.sectionTitle}>📡 MQTT / IoT</List.Subheader>
          <View style={s.card}>
            <List.Item
              title="État de la connexion"
              titleStyle={s.itemTitle}
              left={() => <MaterialCommunityIcons name="lan" size={24} color="#00BCD4" style={s.icon} />}
              right={() => <StatusIndicator status={mqttStatus === 'connected' ? 'online' : mqttStatus === 'reconnecting' ? 'connecting' : 'offline'} />}
            />
            <List.Item
              title="Broker URL"
              description={process.env.EXPO_PUBLIC_MQTT_BROKER_URL || 'Non configuré'}
              titleStyle={s.itemTitle} descriptionStyle={s.itemDesc}
              left={() => <MaterialCommunityIcons name="server" size={24} color="#607D8B" style={s.icon} />}
            />
            <List.Item
              title="Qualité de service (QoS)"
              description="Alertes: QoS 2 · Données: QoS 1 · Status: QoS 0"
              titleStyle={s.itemTitle} descriptionStyle={s.itemDesc}
              left={() => <MaterialCommunityIcons name="signal" size={24} color="#FF9800" style={s.icon} />}
            />
          </View>
        </List.Section>

        {/* Notifications */}
        <List.Section>
          <List.Subheader style={s.sectionTitle}>🔔 Notifications</List.Subheader>
          <View style={s.card}>
            <List.Item
              title="Notifications push"
              titleStyle={s.itemTitle}
              left={() => <MaterialCommunityIcons name="bell" size={24} color="#e94560" style={s.icon} />}
              right={() => <Switch value={settings.notificationsEnabled} onValueChange={settings.toggleNotifications} color="#e94560" />}
            />
            <Divider style={s.divider} />
            <List.Item
              title="Sons d'alerte"
              titleStyle={s.itemTitle}
              left={() => <MaterialCommunityIcons name="volume-high" size={24} color="#FF5722" style={s.icon} />}
              right={() => <Switch value={settings.soundEnabled} onValueChange={settings.toggleSound} color="#e94560" />}
            />
          </View>
        </List.Section>

        {/* About */}
        <List.Section>
          <List.Subheader style={s.sectionTitle}>ℹ️ À propos</List.Subheader>
          <View style={s.card}>
            <List.Item title="Version" description="1.0.0" titleStyle={s.itemTitle} descriptionStyle={s.itemDesc} left={() => <MaterialCommunityIcons name="information" size={24} color="#9E9E9E" style={s.icon} />} />
            <Divider style={s.divider} />
            <List.Item title="Développeur" description="ACT4INNOV" titleStyle={s.itemTitle} descriptionStyle={s.itemDesc} left={() => <MaterialCommunityIcons name="code-tags" size={24} color="#9E9E9E" style={s.icon} />} />
            <Divider style={s.divider} />
            <List.Item title="Conformité" description="ISO 45001" titleStyle={s.itemTitle} descriptionStyle={s.itemDesc} left={() => <MaterialCommunityIcons name="shield-check" size={24} color="#4CAF50" style={s.icon} />} />
          </View>
        </List.Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#16213e', borderRadius: 12, marginHorizontal: 12, marginBottom: 8, overflow: 'hidden' },
  itemTitle: { color: '#fff' },
  itemDesc: { color: '#888' },
  icon: { marginLeft: 12, marginTop: 8 },
  divider: { backgroundColor: '#0f3460' },
  radioRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  radioLabel: { color: '#aaa', fontSize: 13 },
});