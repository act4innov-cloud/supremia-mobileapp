// ============================================================
// SUPREMIA Platform - Header Component
// ============================================================

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, IconButton, Badge } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMQTT } from '@/contexts/MQTTContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showMqttStatus?: boolean;
  alertCount?: number;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  leftAction?: React.ReactNode;
}

export default function Header({
  title,
  subtitle,
  showMqttStatus = true,
  alertCount = 0,
  onNotificationPress,
  onSettingsPress,
  leftAction,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { status: mqttStatus } = useMQTT();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : 8 }]}>
      <View style={styles.leftSection}>
        {leftAction}
        <View>
          <Text variant="titleLarge" style={styles.title}>{title}</Text>
          {subtitle && <Text variant="bodySmall" style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.rightSection}>
        {showMqttStatus && (
          <View style={styles.mqttStatus}>
            <View
              style={[
                styles.mqttDot,
                { backgroundColor: mqttStatus === 'connected' ? '#4CAF50' : mqttStatus === 'reconnecting' ? '#FF9800' : '#F44336' },
              ]}
            />
          </View>
        )}

        {onNotificationPress && (
          <View>
            <IconButton
              icon="bell"
              iconColor="#fff"
              size={22}
              onPress={onNotificationPress}
            />
            {alertCount > 0 && (
              <Badge style={styles.badge} size={16}>{alertCount > 99 ? '99+' : alertCount}</Badge>
            )}
          </View>
        )}

        {onSettingsPress && (
          <IconButton icon="cog" iconColor="#aaa" size={20} onPress={onSettingsPress} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mqttStatus: {
    marginRight: 8,
    padding: 4,
  },
  mqttDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F44336',
  },
});