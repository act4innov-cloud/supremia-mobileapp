import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { AlertLevel } from '@/types/sensor.types';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true }) });

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) { console.warn('Push notifications require a physical device'); return null; }
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') { const { status } = await Notifications.requestPermissionsAsync(); finalStatus = status; }
  if (finalStatus !== 'granted') return null;
  const token = await Notifications.getExpoPushTokenAsync();
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('critical-alerts', { name: 'Alertes Critiques', importance: Notifications.AndroidImportance.MAX, sound: 'alert.wav', vibrationPattern: [0, 500, 250, 500], lightColor: '#FF0000' });
    await Notifications.setNotificationChannelAsync('warning-alerts', { name: 'Avertissements', importance: Notifications.AndroidImportance.HIGH });
  }
  return token.data;
}

export async function sendLocalAlert(title: string, body: string, level: AlertLevel) {
  const channelId = level === 'emergency' || level === 'critical' ? 'critical-alerts' : 'warning-alerts';
  await Notifications.scheduleNotificationAsync({ content: { title, body, sound: level === 'critical' || level === 'emergency' ? 'alert.wav' : undefined, priority: level === 'emergency' ? Notifications.AndroidNotificationPriority.MAX : undefined }, trigger: null });
}