import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

import { ToastProvider } from '../context/ToastContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { ComparisonProvider } from '../context/ComparisonContext';
import { AppToast } from '../components/AppToast';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <FavoritesProvider>
          <ComparisonProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="jugador/[id]" options={{ headerShown: false }} />
            </Stack>
            <AppToast />
          </ComparisonProvider>
        </FavoritesProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
