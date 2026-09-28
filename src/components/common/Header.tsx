import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { APP_CONFIG } from '~/config';

type Props = {
  title: string;
  subtitle?: string;
  /** Affiche une flèche de retour qui ramène à l'accueil. */
  showBack?: boolean;
  right?: React.ReactNode;
};

/** En-tête d'écran natif, avec retour vers la plateforme web. */
export function Header({ title, subtitle, showBack = true, right }: Props) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {showBack && (
        <Pressable
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Retour à la plateforme"
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
        >
          <Ionicons name="arrow-back" size={20} color={APP_CONFIG.colors.text} />
        </Pressable>
      )}
      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle !== undefined && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: APP_CONFIG.colors.brand,
  },
  back: { padding: 6, borderRadius: 8 },
  backPressed: { backgroundColor: 'rgba(255,255,255,0.1)' },
  titles: { flex: 1, gap: 1 },
  title: { color: APP_CONFIG.colors.text, fontSize: 17, fontWeight: '700' },
  subtitle: { color: APP_CONFIG.colors.textMuted, fontSize: 12 },
});
