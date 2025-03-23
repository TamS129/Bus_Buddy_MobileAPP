import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Keep icon colors as they are without affecting them
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault, // Keep icon color as is
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
     
      <Tabs.Screen
        name="AddFavorite"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="add.fill" color={color} />
          ),
        
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].tabBarBackground,
          },
          tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabIconSelected, // Active background color
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabIconSelected, // Active background color
        }}
      />
      <Tabs.Screen
        name="FavoritesList"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
          tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabIconSelected, // Active background color
        }}
      />
    </Tabs>
  );
}
