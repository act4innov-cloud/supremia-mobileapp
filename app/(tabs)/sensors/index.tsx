import { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Header, LoadingSpinner, MqttStatusBanner } from '~/components/common';
import { SensorCard } from '~/components/sensors';
import { APP_CONFIG } from '~/config';
import { useSensors } from '~/hooks/useSensors';
import type { SensorReading } from '~/types/sensor.types';

/**
 * Liste des capteurs, alimentée en direct par le broker MQTT.
 *
 * Les capteurs hors ligne restent visibles : un capteur qui se tait est une
 * information critique sur une installation de détection, pas un détail à
 * masquer.
 */
export default function SensorsScreen() {
  const router = useRouter();
  const { ordered, status, error, isLoading, messageCount, alerts, hasOffline, reconnect } =
    useSensors();

  const summary = useMemo(() => {
    const online = ordered.filter((reading) => reading.isOnline).length;
    return `${online}/${ordered.length} en ligne · ${alerts.length} en alerte`;
  }, [ordered, alerts]);

  const openDetail = useMemo(
    () => (reading: SensorReading) => router.push(`/(tabs)/sensors/${reading.id}`),
    [router],
  );

  return (
    <View style={styles.container}>
      <Header title="Capteurs" subtitle={summary} />

      <View style={styles.banner}>
        <MqttStatusBanner status={status} error={error} messageCount={messageCount} />
      </View>

      {isLoading ? (
        <LoadingSpinner hint="Les relevés apparaissent dès que le premier message arrive." />
      ) : (
        <FlatList
          data={ordered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <SensorCard reading={item} onPress={() => openDetail(item)} />}
          refreshControl={
            <RefreshControl
              refreshing={status === 'connecting' || status === 'reconnecting'}
              onRefresh={reconnect}
              tintColor={APP_CONFIG.colors.accent}
              colors={[APP_CONFIG.colors.accent]}
            />
          }
          ListEmptyComponent={<EmptyState hasError={status === 'error'} detail={error} />}
          ListFooterComponent={
            hasOffline ? (
              <Text style={styles.footer}>
                Un capteur n'a rien envoyé depuis plus de 90 s. Vérifiez son alimentation et sa
                connexion Wi-Fi.
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

function EmptyState({ hasError, detail }: { hasError: boolean; detail?: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>
        {hasError ? 'Aucun accès au broker' : 'Aucun capteur reçu'}
      </Text>
      <Text style={styles.emptyBody}>
        {hasError
          ? (detail ?? 'La connexion au broker MQTT a échoué.')
          : "Aucun message reçu sur le topic d'abonnement. Vérifiez que les capteurs publient et que le topic configuré est le bon."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_CONFIG.colors.brand },
  banner: { paddingHorizontal: 14, paddingBottom: 10 },
  list: { padding: 14, gap: 12, paddingBottom: 32 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 48, paddingHorizontal: 24 },
  emptyTitle: { color: APP_CONFIG.colors.text, fontSize: 15, fontWeight: '700' },
  emptyBody: {
    color: APP_CONFIG.colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  footer: {
    color: '#F59E0B',
    fontSize: 12,
    lineHeight: 17,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
});
