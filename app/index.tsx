import { useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { APP_CONFIG } from '~/config';
import { ConfigNotice } from '~/components/common/ConfigNotice';
import { WebShell, type WebShellHandle } from '~/components/common/WebShell';
import { usePushNotifications } from '~/hooks/usePushNotifications';

/**
 * Écran d'accueil de la v1 : la plateforme web encapsulée dans une WebView.
 *
 * L'application native (capteurs, dashboard) est accessible par l'icône de
 * mesure de la barre d'outils : la plateforme web reste le parcours principal, et
 * la supervision native est un complément, pas un écran qui s'interpose au
 * lancement.
 */
export default function IndexScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const shellRef = useRef<WebShellHandle>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Enregistre le token de push et demande la permission au 1er lancement.
  usePushNotifications();

  // Bouton retour Android : parcourt l'historique de la WebView, sinon il
  // laisse l'événement remonter (comportement système : quitter l'app).
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) return false;
      shellRef.current?.goBack();
      return true;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  if (APP_CONFIG.web.isPlaceholder) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <ConfigNotice />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <WebShell
        ref={shellRef}
        url={APP_CONFIG.web.url}
        onCanGoBackChange={setCanGoBack}
        headerRight={
          <Pressable
            onPress={() => router.push('/(tabs)/dashboard')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Ouvrir la supervision native des capteurs"
            style={({ pressed }) => [styles.sensorsButton, pressed && styles.sensorsButtonPressed]}
          >
            <Ionicons name="pulse-outline" size={19} color={APP_CONFIG.colors.accent} />
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: APP_CONFIG.colors.brand },
  sensorsButton: { padding: 8, borderRadius: 8 },
  sensorsButtonPressed: { backgroundColor: 'rgba(34,197,94,0.15)' },
});
