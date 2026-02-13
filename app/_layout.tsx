// ============================================================
// SUPREMIA Platform - Tab Navigation Layout
// ============================================================

import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, useWindowDimensions } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { profile } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const isAdmin = profile?.role === 'admin' || profile?.role === 'supervisor';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#16213e',
          borderTopColor: '#0f3460',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: isTablet ? 13 : 11,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerTitle: 'SUPREMIA - Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sensors"
        options={{
          title: 'Capteurs',
          headerTitle: 'Capteurs IoT',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="gauge" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cameras"
        options={{
          title: 'Caméras',
          headerTitle: 'Caméras PTZ',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cctv" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reporting"
        options={{
          title: 'Rapports',
          headerTitle: 'Reporting & Archives',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          headerTitle: 'Administration',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
          // Hide admin tab for non-admin users
          href: isAdmin ? undefined : null,
        }}
      />
    </Tabs>
  );
}