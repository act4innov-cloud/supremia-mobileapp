import { useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_CONFIG } from '~/config';
import { ConfigNotice } from '~/components/common/ConfigNotice';
import { WebShell, type WebShellHandle } from '~/components/common/WebShell';
import { usePushNotifications } from '~/hooks/usePushNotifications';

/**
 * Écran unique de la v1 : la plateforme web encapsulée dans une WebView.
 *
 * En Phase 2, cet écran sera remplacé par un `Redirect` vers `/(tabs)/dashboard`
 * et l'authentification passera par Firebase Auth.
 */
export default function IndexScreen() {
  const insets = useSafeAreaInsets();
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
      <WebShell ref={shellRef} url={APP_CONFIG.web.url} onCanGoBackChange={setCanGoBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: APP_CONFIG.colors.brand },
});
