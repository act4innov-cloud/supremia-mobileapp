import { StyleSheet, Text, View } from 'react-native';

import { APP_CONFIG } from '~/config';
import { STATUS_COLORS, STATUS_LABELS } from '~/config/gas.config';
import type { GasStatus, MqttStatus } from '~/types/sensor.types';

type StatusProps = {
  status: GasStatus;
  /** `true` si le capteur n'a rien envoyé depuis un moment. */
  isOffline?: boolean;
  compact?: boolean;
};

/** Pastille d'état d'un capteur : couleur, libellé, et point d'état réseau. */
export function StatusIndicator({ status, isOffline = false, compact = false }: StatusProps) {
  const color = isOffline ? '#6B7280' : STATUS_COLORS[status];
  const label = isOffline ? 'Hors ligne' : STATUS_LABELS[status];
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }, compact && styles.labelCompact]}>{label}</Text>
    </View>
  );
}

type MqttProps = {
  status: MqttStatus;
  error?: string;
  messageCount: number;
};

/**
 * Bandeau d'état de la connexion au broker.
 *
 * Afficher explicitement l'état de la connexion est indispensable sur un écran
 * de supervision : un écran qui affiche des chiffres figés sans le dire donne
 * l'impression que la donnée est fraîche.
 */
export function MqttStatusBanner({ status, error, messageCount }: MqttProps) {
  const info = describe(status, error);
  return (
    <View style={[styles.banner, { backgroundColor: info.background }]}>
      <View style={[styles.dot, { backgroundColor: info.color }]} />
      <View style={styles.bannerText}>
        <Text style={[styles.bannerTitle, { color: info.color }]}>{info.title}</Text>
        {info.detail !== undefined && (
          <Text style={styles.bannerDetail} numberOfLines={2}>
            {info.detail}
          </Text>
        )}
      </View>
      {messageCount > 0 && <Text style={styles.count}>{messageCount}</Text>}
    </View>
  );
}

function describe(status: MqttStatus, error?: string) {
  switch (status) {
    case 'connected':
      return {
        title: 'Connecté au broker',
        detail: undefined,
        color: STATUS_COLORS.normal,
        background: '#052E16',
      };
    case 'connecting':
      return {
        title: 'Connexion en cours…',
        detail: undefined,
        color: STATUS_COLORS.warning,
        background: '#422006',
      };
    case 'reconnecting':
      return {
        title: 'Reconnexion en cours…',
        detail: 'La liaison avec le broker a été perdue.',
        color: STATUS_COLORS.warning,
        background: '#422006',
      };
    case 'offline':
      return {
        title: 'Hors ligne',
        detail: "Les valeurs affichées sont les dernières connues.",
        color: STATUS_COLORS.warning,
        background: '#422006',
      };
    case 'error':
      return {
        title: 'Connexion refusée',
        detail: error ?? 'Erreur inconnue.',
        color: STATUS_COLORS.alarm,
        background: '#450A0A',
      };
    case 'simulated':
      return {
        title: 'Données simulées',
        detail:
          "Aucun broker réel : les relevés sont générés localement (EXPO_PUBLIC_MQTT_SIMULATE=true).",
        color: '#38BDF8',
        background: '#082F49',
      };
    default:
      return {
        title: 'Connexion inactive',
        detail: undefined,
        color: STATUS_COLORS.unknown,
        background: 'rgba(255,255,255,0.06)',
      };
  }
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12, fontWeight: '600' },
  labelCompact: { fontSize: 11 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
  },
  bannerText: { flex: 1, gap: 2 },
  bannerTitle: { fontSize: 13, fontWeight: '700' },
  bannerDetail: { color: APP_CONFIG.colors.textMuted, fontSize: 11, lineHeight: 15 },
  count: { color: APP_CONFIG.colors.textMuted, fontSize: 11, fontVariant: ['tabular-nums'] },
});
