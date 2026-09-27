import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { APP_CONFIG } from '~/config';

/**
 * Écran affiché tant que `EXPO_PUBLIC_WEB_URL` pointe encore vers l'URL de
 * démonstration. Évite un écran vide silencieux après un premier lancement.
 */
export function ConfigNotice() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configuration requise</Text>
      <Text style={styles.body}>
        L'application n'a pas encore été reliée à votre plateforme web.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>1. Copiez le fichier d'exemple</Text>
        <Text style={styles.code}>cp .env.example .env</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>2. Renseignez l'URL de la plateforme</Text>
        <Text style={styles.code}>EXPO_PUBLIC_WEB_URL=https://votre-plateforme.example.com</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>3. Relancez l'application</Text>
        <Text style={styles.code}>npm run android</Text>
      </View>

      <Text style={styles.footnote}>
        URL actuellement configurée : {APP_CONFIG.web.url}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: APP_CONFIG.colors.brand,
  },
  title: { color: APP_CONFIG.colors.text, fontSize: 22, fontWeight: '700' },
  body: { color: APP_CONFIG.colors.textMuted, fontSize: 14, marginBottom: 8 },
  card: {
    gap: 6,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  cardLabel: { color: APP_CONFIG.colors.text, fontSize: 13, fontWeight: '600' },
  code: {
    color: APP_CONFIG.colors.accent,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  footnote: { color: APP_CONFIG.colors.textMuted, fontSize: 12, marginTop: 8 },
});
