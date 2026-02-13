// ============================================================
// SUPREMIA Platform - Status Indicator Component
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';

type Status = 'online' | 'offline' | 'warning' | 'critical' | 'maintenance' | 'calibrating' | 'connecting';

interface StatusIndicatorProps {
  status: Status;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  pulse?: boolean;
}

const STATUS_MAP: Record<Status, { color: string; label: string }> = {
  online: { color: '#4CAF50', label: 'En ligne' },
  offline: { color: '#9E9E9E', label: 'Hors ligne' },
  warning: { color: '#FF9800', label: 'Attention' },
  critical: { color: '#F44336', label: 'Critique' },
  maintenance: { color: '#2196F3', label: 'Maintenance' },
  calibrating: { color: '#AB47BC', label: 'Calibration' },
  connecting: { color: '#FF9800', label: 'Connexion...' },
};

const SIZES = {
  small: 8,
  medium: 10,
  large: 14,
};

export default function StatusIndicator({
  status,
  label,
  size = 'medium',
  showLabel = true,
  pulse = false,
}: StatusIndicatorProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { color, label: defaultLabel } = STATUS_MAP[status] || STATUS_MAP.offline;
  const dotSize = SIZES[size];

  useEffect(() => {
    if (pulse && (status === 'critical' || status === 'warning')) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [status, pulse, pulseAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
            opacity: pulseAnim,
          },
        ]}
      />
      {showLabel && (
        <Text style={[styles.label, { fontSize: size === 'small' ? 10 : 12 }]}>
          {label || defaultLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {},
  label: {
    color: '#aaa',
  },
});