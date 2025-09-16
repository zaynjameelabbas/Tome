// Root layout with authentication check
// Manages auth state and routing between auth screens and main app

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '../src/services/auth';
import { useRouter, useSegments } from 'expo-router';

// Root layout component
export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (user && inAuthGroup) {
      // User is signed in but on auth screen, redirect to main app
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      // User is not signed in but not on auth screen, redirect to login
      router.replace('/auth/login');
    }
  }, [user, segments, isLoading]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="book" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}