import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="meals-browse" />
      <Stack.Screen name="cook-menu" />
      <Stack.Screen name="tasker-register" />
      <Stack.Screen name="tasker-dashboard" />
      <Stack.Screen name="meal-listing" />
      <Stack.Screen name="tasker-services" />
      <Stack.Screen name="meal-edit" />
      <Stack.Screen name="tasker-orders" />
      <Stack.Screen name="user-orders" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
