// ============================================================
// SUPREMIA Platform - Root Layout
// ============================================================

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { MQTTProvider } from '@/contexts/MQTTContext';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 2,
    },
  },
});

const supremiaColors = {
  primary: '#e94560',
  secondary: '#0f3460',
  tertiary: '#16213e',
  surface: '#1a1a2e',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const theme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...supremiaColors } }
      : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: supremiaColors.primary } };

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <MQTTProvider>
            <StatusBar style="auto" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </MQTTProvider>
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}