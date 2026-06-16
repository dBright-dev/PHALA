import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Home, ShoppingBag, ClipboardList, User, UtensilsCrossed} from 'lucide-react-native'
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'dark'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColors.tint,
        tabBarInactiveTintColor: activeColors.tabIconDefault,
        headerShown: true,
        headerStyle: {
          backgroundColor: activeColors.background,
          borderBottomWidth: 1,
          borderBottomColor: '#262626',
        },
        headerTitleStyle: {
          fontWeight: '900',
          color: activeColors.text,
          fontSize: 18,
        },
        tabBarStyle: {
          backgroundColor: activeColors.background,
          borderTopWidth: 1,
          borderTopColor: '#262626',
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Thabi's Grill",
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          headerShown: false,
          // Attaches a crisp, cooking-focused kitchen icon to your directory layout tab
          tabBarIcon: ({ color, size }) => <UtensilsCrossed size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Shopping Cart',
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Track My Orders',
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
