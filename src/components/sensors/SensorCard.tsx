import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, StatusIndicator } from '~/components/common';
import { GasLevelIndicator } from './GasLevelIndicator';
import { APP_CONFIG } from '~/config';
import { STATUS_COLORS } from '~/config/gas.config';
import { formatAge, formatHumidity, formatTemperature } from '~/utils/formatters';
import type { GasKind, GasReading, SensorReading } from '~/types/sensor.types';

type Props = {
  reading: SensorReading;
  onPress?: () => void;
};

const GAS_ORDER: GasKind[] = ['h2s', 'co', 'co2'];

/** Carte d'un capteur dans la liste : synthèse des trois gaz et de l'ambiance. */
export function SensorCard({ reading, onPress }: Props) {
  const gases = GAS_ORDER.map((kind) => reading.gases[kind] as GasReading);
  const color = reading.isOnline ? STATUS_COLORS[reading.status] : STATUS_COLORS.unknown;

  const content = (
    <>
      <View style={styles.head}>
        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1}>
            {reading.name}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {reading.location}
          </Text>
        </View>
        <View style={styles.badge}>
          <StatusIndicator status={reading.status} isOffline={!reading.isOnline} compact />
        </View>
      </View>

      <View style={styles.gases}>
        {gases.map((gas) => (
          <GasLevelIndicator key={gas.kind} reading={gas} compact />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta} numberOfLines={1}>
          {formatTemperature(reading.temperature)} · {formatHumidity(reading.humidity)} ·{' '}
          {reading.deviceType}
        </Text>
        <Text style={[styles.meta, !reading.isOnline && styles.metaStale]}>
          {formatAge(reading.lastSeen)}
        </Text>
      </View>
    </>
  );

  if (onPress === undefined) {
    return (
      <Card accent={color} contentStyle={styles.cardBody}>
        {content}
      </Card>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Capteur ${reading.name}`}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <Card accent={color} contentStyle={styles.cardBody}>
        {content}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
  cardBody: { gap: 12 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  identity: { flex: 1, gap: 2 },
  name: { color: APP_CONFIG.colors.text, fontSize: 15, fontWeight: '700' },
  location: { color: APP_CONFIG.colors.textMuted, fontSize: 12 },
  badge: { paddingTop: 2 },
  gases: { gap: 8 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingTop: 2,
  },
  meta: { color: APP_CONFIG.colors.textMuted, fontSize: 11, fontVariant: ['tabular-nums'] },
  metaStale: { color: '#F59E0B' },
});
