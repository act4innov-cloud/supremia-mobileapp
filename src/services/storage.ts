import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = { AUTH_TOKEN: '@supremia_auth_token', USER_PREFS: '@supremia_user_prefs', DASHBOARD_LAYOUT: '@supremia_dashboard_layout', MQTT_CONFIG: '@supremia_mqtt_config', LAST_PLANT: '@supremia_last_plant' };

export async function setItem(key: string, value: any): Promise<void> { await AsyncStorage.setItem(key, JSON.stringify(value)); }
export async function getItem<T>(key: string): Promise<T | null> { const v = await AsyncStorage.getItem(key); return v ? JSON.parse(v) : null; }
export async function removeItem(key: string): Promise<void> { await AsyncStorage.removeItem(key); }
export async function clearAll(): Promise<void> { await AsyncStorage.clear(); }

export const StorageKeys = KEYS;
export default { setItem, getItem, removeItem, clearAll, KEYS };