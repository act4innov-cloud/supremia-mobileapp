import AsyncStorage from '@react-native-async-storage/async-storage';

/** Préfixe unique : évite toute collision avec une autre app du même device. */
const PREFIX = '@supremia';

export const StorageKeys = {
  pushToken: `${PREFIX}/push-token`,
  lastUser: `${PREFIX}/last-user`,
  notificationPermission: `${PREFIX}/notif-permission`,
} as const;

const Storage = {
  async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setString(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Le stockage local n'est jamais critique : on ignore l'échec.
    }
  },

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await Storage.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setJson(key: string, value: unknown): Promise<void> {
    await Storage.setString(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // idem
    }
  },
};

export default Storage;
