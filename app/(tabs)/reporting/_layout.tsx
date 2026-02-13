import { Stack } from 'expo-router';

export default function ReportingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1a1a2e' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Rapports' }} />
      <Stack.Screen name="archive" options={{ title: 'Archives' }} />
    </Stack>
  );
}