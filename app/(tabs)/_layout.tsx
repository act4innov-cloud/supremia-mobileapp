import { Stack } from 'expo-router';

/**
 * En v1 l'app est un wrapper WebView : ce groupe n'est pas expose dans l'UI.
 * Il conserve l'arborescence prevue pour la Phase 2 (migration native).
 */
export default function Phase2Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
