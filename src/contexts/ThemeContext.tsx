import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/stores/settingsStore';
import COLORS from '@/utils/colors';

type ThemeMode = 'light' | 'dark';
interface ThemeContextValue { mode: ThemeMode; colors: typeof COLORS; isDark: boolean; }

const ThemeContext = createContext<ThemeContextValue>({ mode: 'dark', colors: COLORS, isDark: true });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const { theme } = useSettingsStore();
  const mode: ThemeMode = theme === 'system' ? (systemScheme || 'dark') : theme;
  const isDark = mode === 'dark';
  return <ThemeContext.Provider value={{ mode, colors: COLORS, isDark }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
export default ThemeContext;