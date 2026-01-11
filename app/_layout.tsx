import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/lib/auth-context';

export const unstable_settings = {
  initialRouteName: 'index',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    // If not logged in and trying to access tabs, redirect to login
    // Note: We changed welcome screen to 'index', login is 'login'
    // Let's refine this:
    // Public routes: index (welcome), login, signup
    // Protected routes: (tabs)

    if (!session && inAuthGroup) {
      router.replace('/'); // Go to Welcome screen
    } else if (session && !inAuthGroup) {
      // If logged in and on public screen, go to tabs
      // But only if we are on index/login/signup, not if we just logged out
      // Actually standard pattern:
      if (segments[0] !== '(tabs)') {
          // Check if we are already in the tabs group to avoid loop
          // But segments[0] would be '(tabs)' if we were.
          // The issue is segments array might be empty initially or just root.
          router.replace('/(tabs)/dashboard');
      }
    }
  }, [session, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
