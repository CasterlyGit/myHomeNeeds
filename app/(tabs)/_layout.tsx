// FILE: app/(tabs)/_layout.tsx

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useUserRole } from '../../hooks/useUserRole'; // ← Import from hooks folder

export default function TabLayout() {
  const { role, loading } = useUserRole();

  if (loading) {
    return null; // Or you can return a loading screen
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#2c2c2e',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#0a0a0a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Home Tab - For everyone */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Browse Meals - Show for users and when not logged in */}
      {(role === 'user' || !role) && (
        <Tabs.Screen
          name="meals-browse"
          options={{
            title: 'Browse',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Orders - Different label for cooks vs users */}
      <Tabs.Screen
        name="user-orders"
        options={{
          title: role === 'cook' ? 'Orders' : 'My Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />

      {/* Cook Dashboard - Only for cooks */}
      {role === 'cook' && (
        <Tabs.Screen
          name="tasker-dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid" size={size} color={color} />
            ),
          }}
        />
      )}

      {/* Settings - For everyone */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />

      {/* Hide these screens from tab bar */}
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="tasker-register" options={{ href: null }} />
      <Tabs.Screen name="cook-menu" options={{ href: null }} />
      <Tabs.Screen name="meal-listing" options={{ href: null }} />
      <Tabs.Screen name="meal-edit" options={{ href: null }} />
      <Tabs.Screen name="tasker-orders" options={{ href: null }} />
      <Tabs.Screen name="tasker-profile" options={{ href: null }} />
      <Tabs.Screen name="tasker-services" options={{ href: null }} />
    </Tabs>
  );
}