import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Surveille la connectivité pour afficher un bandeau « hors ligne » au-dessus
 * de la WebView quand la plateforme web devient injoignable.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    NetInfo.fetch().then((state) => {
      if (mounted) setIsOnline(state.isConnected !== false);
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected !== false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { isOnline };
}
