import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  /** Nom de l'écran, ex. `Sensors`. */
  title: string;
  /** Raison pour laquelle l'écran n'est pas encore natif. */
  phase: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
};

/**
 * Écran provisoire pour les routes prévues en Phase 2 (migration native).
 *
 * Tant que la v1 est un wrapper WebView, ces écrans ne sont pas accessibles
 * depuis l'UI : ce composant évite simplement qu'un `// TODO` vide ne fasse
 * planter la navigation.
 */
export function PhasePlaceholder({ title, phase, icon = 'construct-outline' }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color="#6B7280" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.phase}>{phase}</Text>
      <Text style={styles.hint}>
        Cette vue est disponible dans l'application via la WebView. La version native est prévue
        en Phase 2.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 32,
    backgroundColor: '#0B1220',
  },
  title: { color: '#F9FAFB', fontSize: 20, fontWeight: '700' },
  phase: { color: '#22C55E', fontSize: 13, fontWeight: '600' },
  hint: { color: '#9CA3AF', fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
