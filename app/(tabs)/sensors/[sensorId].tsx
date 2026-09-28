import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Card, Header, MqttStatusBanner, StatusIndicator } from '~/components/common';
import { GasLevelIndicator } from '~/components/sensors';
import { APP_CONFIG } from '~/config';
import { GAS_THRESHOLDS, STATUS_COLORS } from '~/config/gas.config';
import { useSensors } from '~/hooks/useSensors';
import { formatAge, formatHumidity, formatPpm, formatRssi, formatTemperature, formatTime } from '~/utils/formatters';

/** Fiche d'un capteur : jauges détaillées, ambiance et diagnostic. */
export default function SensorDetailScreen() {
  const { sensorId } = useLocalSearchParams<{ sensorId: string }>();
  const { ordered, status, error, messageCount } = useSensors();
  const reading = ordered.find((item) => item.id === sensorId);

  if (reading === undefined) {
    return (
      <View style={styles.container}>
        <Header title="Capteur introuvable" />
        <View style={styles.missing}>
          <Text style={styles.missingText}>
            Ce capteur n'a pas encore publié de relevé. Il apparaîtra ici dès son premier message.
          </Text>
        </View>
      </View>
    );
  }

  const rssi = formatRssi(reading.wifiRssi);

  return (
    <View style={styles.container}>
      <Header
        title={reading.name}
        subtitle={reading.location}
        right={<StatusIndicator status={reading.status} isOffline={!reading.isOnline} compact />}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <MqttStatusBanner status={status} error={error} messageCount={messageCount} />

        <Card title="Mesures des gaz" subtitle="Seuils OSHA / NIOSH, à valider par votre HSE">
          <View style={styles.gases}>
            {(['h2s', 'co', 'co2'] as const).map((kind) => (
              <View key={kind} style={styles.gasBlock}>
                <GasLevelIndicator reading={reading.gases[kind]} />
              </View>
            ))}
          </View>
        </Card>

        <Card title="Conditions ambiantes">
          <View style={styles.metrics}>
            <Metric label="Température" value={formatTemperature(reading.temperature)} />
            <Metric label="Humidité" value={formatHumidity(reading.humidity)} />
            <Metric label="Matériel" value={reading.deviceType} />
            <Metric label="Identifiant" value={String(reading.id)} />
          </View>
        </Card>

        <Card title="Diagnostic" subtitle={formatTime(reading.lastSeen)}>
          <View style={styles.metrics}>
            <Metric
              label="Dernier relevé"
              value={formatAge(reading.lastSeen)}
              tone={reading.isOnline ? undefined : STATUS_COLORS.warning}
            />
            <Metric
              label="Signal Wi-Fi"
              value={rssi.text}
              tone={
                rssi.quality === 'good'
                  ? STATUS_COLORS.normal
                  : rssi.quality === 'fair'
                    ? STATUS_COLORS.warning
                    : STATUS_COLORS.alarm
              }
            />
            <Metric
              label="Messages publiés"
              value={reading.publishCount?.toLocaleString('fr-FR') ?? '—'}
            />
            <Metric
              label="État annoncé"
              value={reading.gases.h2s.reportedStatus === 'unknown' ? '—' : reading.gases.h2s.reportedStatus}
            />
          </View>
        </Card>

        <Card title="Seuils appliqués" subtitle="Modifiables dans src/config/gas.config.ts">
          <View style={styles.thresholds}>
            {(['h2s', 'co', 'co2'] as const).map((kind) => (
              <View key={kind} style={styles.thresholdRow}>
                <Text style={styles.thresholdLabel}>{kind.toUpperCase()}</Text>
                <Text style={styles.thresholdValue}>
                  alerte {formatPpm(GAS_THRESHOLDS[kind].warning)} · critique{' '}
                  {formatPpm(GAS_THRESHOLDS[kind].alarm)} ppm
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.warning}>
            Ces seuils sont des valeurs par défaut issues de publications OSHA et NIOSH. Ils doivent
            être remplacés par ceux de votre document unique d'intervention avant toute mise en
            production.
          </Text>
        </Card>

        <Text style={styles.topic} numberOfLines={2}>
          {reading.topic}
        </Text>
      </ScrollView>
    </View>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, tone !== undefined && { color: tone }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_CONFIG.colors.brand },
  content: { padding: 14, gap: 12, paddingBottom: 32 },
  gases: { gap: 14 },
  gasBlock: { gap: 4 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 },
  metric: { width: '50%', gap: 2 },
  metricLabel: { color: APP_CONFIG.colors.textMuted, fontSize: 11 },
  metricValue: { color: APP_CONFIG.colors.text, fontSize: 15, fontWeight: '600' },
  thresholds: { gap: 8 },
  thresholdRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  thresholdLabel: { color: APP_CONFIG.colors.text, fontSize: 12, fontWeight: '700' },
  thresholdValue: { color: APP_CONFIG.colors.textMuted, fontSize: 12, fontVariant: ['tabular-nums'] },
  warning: { color: '#F59E0B', fontSize: 11, lineHeight: 16, marginTop: 4 },
  topic: { color: APP_CONFIG.colors.textMuted, fontSize: 10, fontFamily: 'monospace' },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  missingText: {
    color: APP_CONFIG.colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
});
