import { StyleSheet, Text, View } from 'react-native';

import { APP_CONFIG } from '~/config';
import { GAS_META, type GasReading } from '~/types/sensor.types';
import { STATUS_COLORS } from '~/config/gas.config';
import { fillRatio, warningRatio } from '~/utils/gasCalculations';
import { formatPpm } from '~/utils/formatters';

type Props = {
  reading: GasReading;
  /** Version compacte pour la ligne de synthèse d'une carte capteur. */
  compact?: boolean;
};

/**
 * Jauge d'un gaz : valeur, unité, et repères de seuil.
 *
 * La largeur de la barre est proportionnelle à la valeur, mais l'échelle s'arrête
 * au seuil d'alarme : les concentrations de H₂S exploitables se situent entre 0
 * et 20 ppm, une échelle linéaire sur 100 rendrait les variations illisibles.
 */
export function GasLevelIndicator({ reading, compact = false }: Props) {
  const meta = GAS_META[reading.kind];
  const color = STATUS_COLORS[reading.status];
  const ratio = fillRatio(reading.kind, reading.value);
  const seuil = warningRatio(reading.kind);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.label}>{meta.symbol}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color }]} numberOfLines={1}>
            {formatPpm(reading.value)}
          </Text>
          <Text style={styles.unit}>{reading.unit}</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(ratio * 100)}%`, backgroundColor: color }]} />
        {/* Repère du seuil d'alerte, en pointillés pour rester lisible. */}
        <View style={[styles.threshold, { left: `${Math.round(seuil * 100)}%` }]} />
      </View>

      {!compact && (
        <Text style={styles.thresholds}>
          Alerte {meta.symbol} {formatPpm(reading.warningLimit)} · Critique{' '}
          {formatPpm(reading.alarmLimit)} ppm
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 5 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  label: { color: APP_CONFIG.colors.textMuted, fontSize: 12, fontWeight: '700' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  value: { fontSize: 19, fontWeight: '700', fontVariant: ['tabular-nums'] },
  unit: { color: APP_CONFIG.colors.textMuted, fontSize: 11 },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: { height: '100%', borderRadius: 3 },
  threshold: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  thresholds: { color: APP_CONFIG.colors.textMuted, fontSize: 10 },
});
