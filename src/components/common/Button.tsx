// ============================================================
// SUPREMIA Platform - Custom Button Component
// ============================================================

import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

interface SupremiaButtonProps {
  label: string;
  onPress: () => void;
  mode?: 'contained' | 'outlined' | 'text';
  variant?: 'primary' | 'danger' | 'success' | 'secondary';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  compact?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

const VARIANT_COLORS = {
  primary: '#e94560',
  danger: '#F44336',
  success: '#4CAF50',
  secondary: '#0f3460',
};

export default function Button({
  label,
  onPress,
  mode = 'contained',
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  compact = false,
  style,
  labelStyle,
}: SupremiaButtonProps) {
  const color = VARIANT_COLORS[variant];

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      icon={icon}
      loading={loading}
      disabled={disabled}
      compact={compact}
      buttonColor={mode === 'contained' ? color : undefined}
      textColor={mode === 'contained' ? '#fff' : color}
      style={[styles.button, mode === 'outlined' && { borderColor: color }, style]}
      labelStyle={[styles.label, labelStyle]}
      contentStyle={styles.content}
    >
      {label}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  content: {
    height: 44,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});