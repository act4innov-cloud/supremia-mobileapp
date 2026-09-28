import { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card, Header, LoadingSpinner, MqttStatusBanner } from '~/components/common';
import { SensorCard } from '~/components/sensors';
import { APP_CONFIG } from '~/config';
import { STATUS_COLORS } from '~/config/gas.config';
import { siteStatus } from '~/utils/gasCalculations';
import { useSensors } from '~/hooks/useSensors';
import { formatAge } from '~/utils/formatters';
import type { GasStatus } from '~/types/sensor.types';

/** Vue d'ensemble : état global du site, alertes, puis capteurs. */
export default function DashboardScreen() {
  const router = useRouter();
  const { ordered, status, error, isLoading, messageCount, alerts, hasOffline, reconnect } =
    useSensors();

  const globalStatus = useMemo(() => siteStatus(ordered), [ordered]);

  const online = ordered.filter((reading) => reading.isOnline).length;

  return (
    <View style={styles.container}>
      <Header title="Tableau de bord" subtitle={APP_CONFIG.displayName} />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={status === 'connecting' || status === 'reconnecting'}
              onRefresh={reconnect}
              tintColor={APP_CONFIG.colors.accent}
              colors={[APP_CONFIG.colors.accent]}
            />
          }
        >
          <MqttStatusBanner status={status} error={error} messageCount={messageCount} />

          <Card
            title={headline[globalStatus]}
            subtitle={`${online} capteur${online > 1 ? 's' : ''} en ligne sur ${ordered.length}`}
            accent={STATUS_COLORS[globalStatus]}
          >
            <View style={styles.tiles}>
              <Tile
                label="Capteurs"
                value={String(ordered.length)}
                color={ordered.length > 0 ? undefined : STATUS_COLORS.unknown}
              />
              <Tile
                label="Alertes"
                value={String(alerts.length)}
                color={alerts.length > 0 ? STATUS_COLORS.warning : undefined}
              />
              <Tile
                label="Hors ligne"
                value={String(ordered.length - online)}
                color={hasOffline ? STATUS_COLORS.alarm : undefined}
              />
            </View>
            {alerts.length === 0 && ordered.length > 0 && (
              <Text style={styles.ok}>
                Aucune concentration au-dessus des seuils configurés.
              </Text>
            )}
          </Card>

          {alerts.length > 0 && (
            <Card title="Alertes en cours" subtitle="Triées par gravité">
              {alerts.map((reading) => (
                <View key={reading.id} style={styles.alertRow}>
                  <Text style={[styles.alertName, { color: STATUS_COLORS[reading.status] }]}>
                    {reading.name}
                  </Text>
                  <Text style={styles.alertDetail}>
                    {reading.status === 'alarm' ? 'Critique' : 'Alerte'} ·{' '}
                    {formatAge(reading.lastSeen)}
                  </Text>
                </View>
              ))}
            </Card>
          )}

          <Text style={styles.sectionTitle}>Capteurs</Text>
          {ordered.length === 0 ? (
            <Card>
              <Text style={styles.empty}>
                Aucun relevé reçu. Vérifiez l'accès au broker et le topic d'abonnement.
              </Text>
            </Card>
          ) : (
            ordered.map((reading) => (
              <SensorCard
                key={reading.id}
                reading={reading}
                onPress={() => router.push(`/(tabs)/sensors/${reading.id}`)}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const headline: Record<GasStatus, string> = {
  alarm: 'Site en situation critique',
  warning: 'Site sous surveillance',
  normal: 'Site conforme',
  // `siteStatus` renvoie `unknown` tant qu'aucun capteur n'a publié : sans
  // mesure, aucune conformité ne peut être affirmée.
  unknown: 'Aucune mesure reçue',
};

function Tile({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.tile}>
      <Text style={[styles.tileValue, color !== undefined && { color }]}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_CONFIG.colors.brand },
  content: { padding: 14, gap: 12, paddingBottom: 32 },
  tiles: { flexDirection: 'row', gap: 10 },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tileValue: { color: APP_CONFIG.colors.text, fontSize: 24, fontWeight: '700' },
  tileLabel: { color: APP_CONFIG.colors.textMuted, fontSize: 11 },
  ok: { color: STATUS_COLORS.normal, fontSize: 12 },
  sectionTitle: {
    color: APP_CONFIG.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  alertRow: { gap: 2, paddingVertical: 6 },
  alertName: { fontSize: 14, fontWeight: '700' },
  alertDetail: { color: APP_CONFIG.colors.textMuted, fontSize: 12 },
  empty: { color: APP_CONFIG.colors.textMuted, fontSize: 13, lineHeight: 19 },
});
