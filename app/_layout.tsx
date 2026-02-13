
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MQTTProvider } from '@/contexts/MQTTContext';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

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

const InitialLayout = () => {
  const { user, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && !inAuthGroup) {
      router.replace('/(tabs)/dashboard');
    } else if (!user) {
      router.replace('/(auth)/login');
    }
  }, [user, initialized, segments, router]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <Slot />;
};

const RootLayout = () => {
  const colorScheme = useColorScheme();

  const theme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...supremiaColors } }
      : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: supremiaColors.primary } };

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <MQTTProvider>
            <StatusBar style="auto" />
            <InitialLayout />
          </MQTTProvider>
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
