// ============================================================
// SUPREMIA Platform - Custom Card Component
// ============================================================

import React from 'react';
import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Surface, Text } from 'react-native-paper';

interface SupremiaCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'critical';
  padding?: number;
}

export default function Card({
  children,
  onPress,
  style,
  variant = 'default',
  padding = 16,
}: SupremiaCardProps) {
  const cardStyle = [
    styles.card,
    variant === 'critical' && styles.critical,
    variant === 'outlined' && styles.outlined,
    { padding },
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        <Surface style={cardStyle} elevation={variant === 'elevated' ? 3 : 1}>
          {children}
        </Surface>
      </Pressable>
    );
  }

  return (
    <Surface style={cardStyle} elevation={variant === 'elevated' ? 3 : 1}>
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 10,
  },
  critical: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#0f3460',
    backgroundColor: 'transparent',
  },
});