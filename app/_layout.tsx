import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '../config/supabase';
import { CartProvider } from '../context/CartContext';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [authInitialized, setAuthInitialized] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    // 1. Query initial active verification session profile tokens on file load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
      setAuthInitialized(true);
    });

    // 2. Set up an active structural listener for changes to auth state (Sign In / Sign Out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authInitialized) return;

    // Check if the user is currently inside the tab group route folders
    const inTabsGroup = segments[0] === '(tabs)';

    if (!userSession && inTabsGroup) {
      // User is logged out but trying to access the menu app: Redirect to Auth screen
      router.replace('/auth');
    } else if (userSession && !inTabsGroup && segments[0] !== 'tracking') {
      // User is logged in but stuck outside: Push straight into main app menu
      router.replace('/(tabs)');
    }
  }, [userSession, segments, authInitialized]);

  if (!authInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090B', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#FF7600" size="large" />
      </View>
    );
  }

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tracking" />
      </Stack>
    </CartProvider>
  );
}