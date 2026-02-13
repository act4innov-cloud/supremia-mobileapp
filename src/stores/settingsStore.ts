import { create } from 'zustand';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en' | 'ar';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  dashboardRefreshInterval: number;
  defaultPlantId: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'fr' | 'en' | 'ar') => void;
  toggleNotifications: () => void;
  toggleSound: () => void;
  setRefreshInterval: (ms: number) => void;
  setDefaultPlant: (id: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  language: 'fr',
  notificationsEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  dashboardRefreshInterval: 5000,
  defaultPlantId: 'jorf_lasfar',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  toggleNotifications: () => set(s => ({ notificationsEnabled: !s.notificationsEnabled })),
  toggleSound: () => set(s => ({ soundEnabled: !s.soundEnabled })),
  setRefreshInterval: (dashboardRefreshInterval) => set({ dashboardRefreshInterval }),
  setDefaultPlant: (defaultPlantId) => set({ defaultPlantId }),
}));
export default useSettingsStore;