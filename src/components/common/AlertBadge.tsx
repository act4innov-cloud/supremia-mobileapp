// ============================================================
// SUPREMIA Platform - Alert Badge Component
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AlertLevel } from '@/types/sensor.types';
import { ALERT_COLORS } from '@/config/gas.config';

interface AlertBadgeProps {
  level: AlertLevel;
  label?: string;
  showIcon?: boolean;
  compact?: boolean;
}

const ALERT_ICONS: Record<AlertLevel, string> = {
  info: 'information',
  warning: 'alert',
  critical: 'alert-circle',
  emergency: 'alert-octagon',
};

export default function AlertBadge({
  level,
  label,
  showIcon = true,
  compact = false,
}: AlertBadgeProps) {
  const colors = ALERT_COLORS[level];
  const displayLabel = label || colors.labelFr;

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, compact && styles.compact]}>
      {showIcon && (
        <MaterialCommunityIcons
          name={ALERT_ICONS[level] as any}
          size={compact ? 12 : 16}
          color={colors.text}
        />
      )}
      <Text style={[styles.label, { color: colors.text }, compact && styles.compactLabel]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  compactLabel: {
    fontSize: 10,
  },
});