import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { APP_CONFIG } from '~/config';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Écran introuvable</Text>
      <Text style={styles.body}>
        Cette route n'existe pas dans l'application. Utilisez la plateforme web pour y accéder.
      </Text>
      <Link href="/" style={styles.link}>
        Retour à l'application
      </Link>
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
    backgroundColor: APP_CONFIG.colors.brand,
  },
  code: { color: APP_CONFIG.colors.accent, fontSize: 48, fontWeight: '800' },
  title: { color: APP_CONFIG.colors.text, fontSize: 20, fontWeight: '700' },
  body: { color: APP_CONFIG.colors.textMuted, fontSize: 14, textAlign: 'center' },
  link: { color: APP_CONFIG.colors.accent, marginTop: 12, fontWeight: '600' },
});
