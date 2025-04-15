// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AuthLayout() {
  const { user, initialized } = useAuth();

  useEffect(() => {
    if (initialized && user) {
      router.replace("/(tabs)");
    }
  }, [user, initialized]);

  if (!initialized) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}