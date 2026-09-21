import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, 10);
  const barHeight = 62 + safeBottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.borderColor,
          borderTopWidth: 1,
          height: barHeight,
          paddingTop: 8,
          paddingBottom: safeBottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          lineHeight: 16,
          marginTop: 2,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'football' : 'football-outline'}
              size={24}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="comparar"
        options={{
          title: 'Comparar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'}
              size={24}
              color={color as string}
            />
          ),
        }}
      />
      {/* Hide former 'buscar' route from tabs while redirecting to Inicio */}
      <Tabs.Screen
        name="buscar"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
