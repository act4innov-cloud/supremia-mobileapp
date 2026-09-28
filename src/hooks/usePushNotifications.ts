import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import Storage, { StorageKeys } from '~/services/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type PermissionState = 'unknown' | 'granted' | 'denied';

/**
 * Enregistre le token de push Firebase et le persiste pour pouvoir le
 * transmettre à l'API de la plateforme (voir `registerPushToken`).
 *
 * ⚠️ Les notifications distantes ne fonctionnent PAS dans Expo Go sur Android
 * depuis le SDK 53 : il faut un *development build*
 * (`eas build --profile development`).
 */
export function usePushNotifications() {
  const [permission, setPermission] = useState<PermissionState>('unknown');
  const [pushToken, setPushToken] = useState<string | null>(null);
  const isRegistering = useRef(false);

  const register = useCallback(async () => {
    if (isRegistering.current) return;
    isRegistering.current = true;

    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('alerts', {
          name: 'Alertes SUPREMIA',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#22C55E',
        });
      }

      const existing = await Notifications.getPermissionsAsync();
      let status = existing.status;

      if (status !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        status = requested.status;
      }

      setPermission(status === 'granted' ? 'granted' : 'denied');

      if (status !== 'granted' || !Device.isDevice) {
        // `getExpoPushTokenAsync` échoue sur émulateur sans compte Google.
        return;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

      const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
      setPushToken(data);
      await Storage.setString(StorageKeys.pushToken, data);
    } catch {
      // Le push est optionnel : l'app doit rester fonctionnelle sans lui.
      setPermission('unknown');
    } finally {
      isRegistering.current = false;
    }
  }, []);

  useEffect(() => {
    // `register` est asynchrone et son premier `await` précède tout `setState` :
    // ce n'est donc pas une mise à jour synchrone dans l'effet, malgré ce que
    // suppose l'analyse statique de la règle react-hooks/set-state-in-effect.
    // L'enregistrement doit se déclencher au montage, donc il doit rester ici.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void register();
  }, [register]);

  // Affiche une alerte quand une notification arrive au premier plan.
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const title = notification.request.content.title ?? 'SUPREMIA';
        const body = notification.request.content.body ?? '';
        Alert.alert(title, body, [{ text: 'OK', onPress: () => void Linking.openSettings() }]);
      },
    );
    return () => subscription.remove();
  }, []);

  return { permission, pushToken, register, isDevice: Device.isDevice };
}
