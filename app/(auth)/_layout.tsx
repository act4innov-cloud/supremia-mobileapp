import { Stack } from 'expo-router';

/**
 * En v1 l'authentification est gerÃ©e par la plateforme web dans la WebView.
 * Ce groupe est conserve pour la Phase 2 (Firebase Auth natif).
 */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
