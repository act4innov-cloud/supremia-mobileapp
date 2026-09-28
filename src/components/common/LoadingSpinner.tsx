import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { APP_CONFIG } from '~/config';

type Props = {
  label?: string;
  /** Message d'explication affiché sous le label. */
  hint?: string;
};

/** Attente lors de l'ouverture de la connexion au broker. */
export function LoadingSpinner({ label = 'Connexion au broker…', hint }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={APP_CONFIG.colors.accent} size="large" />
      <Text style={styles.label}>{label}</Text>
      {hint !== undefined && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 10, paddingVertical: 40, paddingHorizontal: 24 },
  label: { color: APP_CONFIG.colors.text, fontSize: 14, fontWeight: '600' },
  hint: {
    color: APP_CONFIG.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
});
