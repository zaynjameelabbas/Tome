// Simple icon components to replace emoji
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={{ 
    width: size, 
    height: size, 
    borderWidth: 1.5,
    borderColor: color,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <View style={{
      width: size * 0.6,
      height: size * 0.5,
      borderWidth: 1,
      borderColor: color,
      borderBottomWidth: 0,
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
    }} />
    <View style={{
      width: size * 0.3,
      height: size * 0.2,
      backgroundColor: color,
      position: 'absolute',
      bottom: 2
    }} />
  </View>
);

const SearchIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.7,
      height: size * 0.7,
      borderWidth: 1.5,
      borderColor: color,
      borderRadius: size * 0.35,
    }} />
    <View style={{
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: size * 0.25,
      height: 1.5,
      backgroundColor: color,
      transform: [{ rotate: '45deg' }]
    }} />
  </View>
);

const CreateIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: 1.5,
      height: size * 0.8,
      backgroundColor: color,
    }} />
    <View style={{
      position: 'absolute',
      width: size * 0.8,
      height: 1.5,
      backgroundColor: color,
    }} />
  </View>
);

const LibraryIcon = ({ color, size }: { color: string; size: number }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    {/* Stack of books */}
    <View style={{
      width: size * 0.8,
      height: size * 0.15,
      backgroundColor: color,
      position: 'absolute',
      bottom: size * 0.1,
    }} />
    <View style={{
      width: size * 0.7,
      height: size * 0.15,
      backgroundColor: color,
      position: 'absolute',
      bottom: size * 0.3,
    }} />
    <View style={{
      width: size * 0.6,
      height: size * 0.15,
      backgroundColor: color,
      position: 'absolute',
      bottom: size * 0.5,
    }} />
  </View>
);// Tab navigation layout for the main app screens
// Updated to match modern book app navigation with proper icons

import { Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';

// Tab layout component - creates bottom tab navigation
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Hide headers since our screens have custom headers
        headerShown: false,
        
        // Tab bar styling - darker, more premium
        tabBarStyle: {
          backgroundColor: '#1a1a1a',       // Slightly lighter than pure black
          borderTopWidth: 0,                // Remove top border
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          shadowColor: '#000',              // Add subtle shadow
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        
        // Active tab styling - rich emerald accent
        tabBarActiveTintColor: '#00674F',    // Rich emerald green for active tabs
        tabBarInactiveTintColor: '#666666',  // Darker gray for inactive tabs
        
        // Tab label styling - smaller, cleaner
        tabBarLabelStyle: {
          fontSize: 11,                      // Smaller text
          fontWeight: '500',                 // Medium weight
          marginTop: 2,                      // Less space above label
        },
      }}
    >
      
      {/* Home Tab (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',                     // Changed from "Library" to "Home"
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />

      {/* Search Tab (search.tsx) */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <SearchIcon color={color} size={size} />
          ),
        }}
      />

      {/* Create Tab (scan.tsx) */}
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',                   // Changed from "Scan" to "Create"
          tabBarIcon: ({ color, size }) => (
            <CreateIcon color={color} size={size} />
          ),
        }}
      />

      {/* Library Tab - we'll create this later */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => (
            <LibraryIcon color={color} size={size} />
          ),
        }}
      />
      
    </Tabs>
  );
}