import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

// Custom tab bar components
import { HapticTab } from '@/components/HapticTab'; // Tab with haptic feedback
import { IconSymbol } from '@/components/ui/IconSymbol'; // Unified icon component
import TabBarBackground from '@/components/ui/TabBarBackground'; // Custom tab bar background
import { Color } from '@/constants/Colors'; // Color scheme
import { Feather } from '@expo/vector-icons'; // Icon library

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Color.dark.tint, // Active tab icon color
        headerShown: false, // Hide default header
        tabBarButton: HapticTab, // Custom tab button with haptics
        tabBarBackground: TabBarBackground, // Custom background component
        tabBarStyle: Platform.select({ // Platform-specific styling
          ios: {
            position: 'absolute', // Floating tab bar for iOS
            height: 85, // Increased height for iPhone notch
            zIndex: 0,
          },
          default: {
            zIndex: 0,
          }, // Default Android styling
        }),
      }}>
      
      {/* Home Screen Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Main',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* Tasks Screen Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />

      {/* Profile Screen Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />, // Direct Feather icon
        }}
      />
    </Tabs>
  );
}