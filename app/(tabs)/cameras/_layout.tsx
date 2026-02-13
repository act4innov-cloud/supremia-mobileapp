import { Stack } from 'expo-router';
export default function CamerasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[cameraId]" options={{ headerShown: true, headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }} />
    </Stack>
  );
}