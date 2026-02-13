import { Stack } from 'expo-router';
export default function SensorsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[sensorId]" options={{ headerShown: true, headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }} />
    </Stack>
  );
}