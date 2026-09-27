import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Linking,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

import { APP_CONFIG } from '~/config';
import { useNetworkStatus } from '~/hooks/useNetworkStatus';

export type WebShellHandle = {
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  openInBrowser: () => void;
};

type Props = {
  /** Racine du site, ex. `https://app.supremia.io`. */
  url: string;
  style?: StyleProp<ViewStyle>;
  /** Masque le bandeau supérieur (utile pour un affichage « plein écran »). */
  hideHeader?: boolean;
  /** Notifie le parent de l'état de l'historique (bouton retour Android). */
  onCanGoBackChange?: (canGoBack: boolean) => void;
  onMessage?: (message: { type: string; [key: string]: unknown }) => void;
};

/**
 * Pont JavaScript injecté dans chaque page de la plateforme web.
 *
 * Côté web il suffit d'écrire :
 *   window.__SUPREMIA_NATIVE__?.logout()
 */
const BRIDGE_JS = `
(function () {
  if (window.__SUPREMIA_NATIVE__) return;
  var send = function (payload) {
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    } catch (e) {}
  };
  window.__SUPREMIA_NATIVE__ = {
    isNativeApp: true,
    platform: 'android',
    version: '1.0.0',
    send: send,
    logout: function () { send({ type: 'logout' }); },
    refresh: function () { send({ type: 'refresh' }); },
    isNativeAvailable: function () { return true; }
  };
})();
true;
`;

const UNSAFE_SCHEMES = /^(mailto:|tel:|sms:|whatsapp:|geo:|market:|intent:|bitcoin:)/i;

/** Forme minimale de l'erreur HTTP, non exportée par react-native-webview. */
type WebViewHttpErrorShape = { statusCode: number; description: string; url: string };

export const WebShell = forwardRef<WebShellHandle, Props>(function WebShell(
  { url, style, hideHeader = false, onCanGoBackChange, onMessage },
  ref,
) {
  const webviewRef = useRef<WebView>(null);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOnline } = useNetworkStatus();

  const allowedHosts = useMemo(() => APP_CONFIG.allowedHosts, []);

  useImperativeHandle(
    ref,
    () => ({
      goBack: () => webviewRef.current?.goBack(),
      goForward: () => webviewRef.current?.goForward(),
      reload: () => webviewRef.current?.reload(),
      openInBrowser: () => void Linking.openURL(currentUrl).catch(() => undefined),
    }),
    [currentUrl],
  );

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      let payload: { type: string; [key: string]: unknown } | null = null;
      try {
        payload = JSON.parse(event.nativeEvent.data);
      } catch {
        return;
      }
      if (!payload?.type) return;

      switch (payload.type) {
        case 'logout':
          onMessage?.(payload);
          break;
        case 'refresh':
          webviewRef.current?.reload();
          break;
        case 'share': {
          const shareUrl = String(payload.url ?? currentUrl);
          const title = String(payload.title ?? APP_CONFIG.displayName);
          void Share.share({ message: `${title}\n${shareUrl}` });
          break;
        }
        default:
          onMessage?.(payload);
      }
    },
    [currentUrl, onMessage],
  );

  /**
   * Tout ce qui sort du domaine de la plateforme est ouvert dans le navigateur
   * système : on évite ainsi de piéger l'utilisateur dans la WebView.
   */
  const shouldStartLoad = useCallback(
    (request: { url: string; navigationType?: string }) => {
      const { url: target } = request;

      if (UNSAFE_SCHEMES.test(target)) {
        void Linking.openURL(target).catch(() => undefined);
        return false;
      }

      const host = /^[a-z]+:\/\/([^/?#]+)/i.exec(target)?.[1]?.toLowerCase() ?? '';
      const isHttp = /^https?:/i.test(target);

      if (isHttp && host && !allowedHosts.includes(host)) {
        void Linking.openURL(target).catch(() => undefined);
        return false;
      }

      return true;
    },
    [allowedHosts],
  );

  const openInBrowser = useCallback(() => {
    void Linking.openURL(currentUrl).catch(() => undefined);
  }, [currentUrl]);

  return (
    <View style={[styles.container, style]}>
      {!hideHeader && (
        <View style={styles.header}>
          <HeaderButton
            icon="arrow-back"
            disabled={!canGoBack}
            onPress={() => webviewRef.current?.goBack()}
            accessibilityLabel="Précédent"
          />
          <HeaderButton
            icon="arrow-forward"
            disabled={!canGoForward}
            onPress={() => webviewRef.current?.goForward()}
            accessibilityLabel="Suivant"
          />
          <HeaderButton
            icon="refresh"
            onPress={() => {
              setError(null);
              webviewRef.current?.reload();
            }}
            accessibilityLabel="Recharger"
          />
          <View style={styles.urlPill}>
            <Text numberOfLines={1} style={styles.urlText}>
              {prettyHost(currentUrl)}
            </Text>
          </View>
          <HeaderButton
            icon="share-outline"
            onPress={() => void Share.share({ message: currentUrl })}
            accessibilityLabel="Partager"
          />
          <HeaderButton
            icon="open-outline"
            onPress={openInBrowser}
            accessibilityLabel="Ouvrir dans le navigateur"
          />
        </View>
      )}

      {progress > 0 && progress < 1 && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      )}

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={14} color="#FDE68A" />
          <Text style={styles.offlineText}>Hors ligne — affichage des dernières données</Text>
        </View>
      )}

      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        style={styles.webview}
        containerStyle={styles.webviewContainer}
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={shouldStartLoad}
        onNavigationStateChange={(nav: WebViewNavigation) => {
          setCurrentUrl(nav.url);
          setCanGoBack(nav.canGoBack);
          setCanGoForward(nav.canGoForward);
          onCanGoBackChange?.(nav.canGoBack);
        }}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        onLoadStart={() => setProgress(0.05)}
        onLoadEnd={() => setProgress(1)}
        onError={(event: { nativeEvent: { description: string } }) =>
          setError(event.nativeEvent.description)
        }
        onHttpError={({ nativeEvent }: { nativeEvent: WebViewHttpErrorShape }) => {
          const { statusCode, description } = nativeEvent;
          // 401/403 : la plateforme affiche sa propre page de reconnexion.
          if (statusCode >= 500) setError(description);
        }}
        onFileDownload={({ nativeEvent }: { nativeEvent: { downloadUrl: string } }) => {
          void Linking.openURL(nativeEvent.downloadUrl).catch(() => undefined);
        }}
        // Requis pour les flux caméras / PDF embarqués.
        // Les permissions caméra et micro sont demandées nativement par le
        // module Android à partir des permissions déclarées dans app.json.
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        cacheEnabled
        geolocationEnabled
        // Nécessaire si la plateforme est testée en HTTP sur IP locale
        mixedContentMode="compatibility"
        setSupportMultipleWindows={false}
        originWhitelist={['https://*', 'http://*']}
        textZoom={100}
        injectedJavaScriptBeforeContentLoaded={BRIDGE_JS}
        startInLoadingState={false}
      />

      {error !== null && (
        <View style={styles.errorOverlay}>
          <Ionicons name="alert-circle-outline" size={40} color={APP_CONFIG.colors.danger} />
          <Text style={styles.errorTitle}>Chargement impossible</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              webviewRef.current?.reload();
            }}
          >
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});

function HeaderButton({
  icon,
  onPress,
  disabled = false,
  accessibilityLabel,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        styles.headerButton,
        pressed && !disabled && styles.headerButtonPressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={disabled ? 'rgba(249,250,251,0.3)' : APP_CONFIG.colors.text}
      />
    </Pressable>
  );
}

function prettyHost(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || url;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_CONFIG.colors.brand },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: APP_CONFIG.colors.brand,
  },
  headerButton: { padding: 8, borderRadius: 8 },
  headerButtonPressed: { backgroundColor: 'rgba(255,255,255,0.1)' },
  urlPill: {
    flex: 1,
    marginHorizontal: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  urlText: { color: APP_CONFIG.colors.textMuted, fontSize: 12 },
  progressTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
  progressBar: { height: 2, backgroundColor: APP_CONFIG.colors.accent },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    backgroundColor: '#422006',
  },
  offlineText: { color: '#FDE68A', fontSize: 12 },
  webview: { flex: 1, backgroundColor: 'transparent' },
  webviewContainer: { flex: 1 },
  errorOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: APP_CONFIG.colors.brand,
  },
  errorTitle: { color: APP_CONFIG.colors.text, fontSize: 17, fontWeight: '700' },
  errorMessage: {
    color: APP_CONFIG.colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: APP_CONFIG.colors.accent,
  },
  retryText: { color: '#052E16', fontWeight: '700' },
});
