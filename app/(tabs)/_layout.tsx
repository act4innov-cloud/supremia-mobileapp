import { Stack } from 'expo-router';

/**
 * Écrans natifs de supervision.
 *
 * Ce groupe n'est pas l'écran d'accueil : l'application démarre sur la
 * plateforme web (`app/index.tsx`). On y accède par l'icône de la barre
 * d'outils, et les routes `/(tabs)/dashboard` et `/(tabs)/sensors` sont
 * accessibles en direct pour le deep linking.
 */
export default function Phase2Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0B1220' },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="sensors" />
    </Stack>
  );
}
