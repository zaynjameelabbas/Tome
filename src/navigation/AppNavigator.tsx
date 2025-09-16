import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import our types
import { RootStackParamList, MainTabParamList } from '../types';

// Import our screens - now we have real React Native screens!
import LibraryScreen from '../screens/LibraryScreen';
import ScanScreen from '../screens/ScanScreen';
import SearchScreen from '../screens/SearchScreen';
// import BookDetailsScreen from '../screens/BookDetailsScreen'; // We'll create this later

// Create our navigators using the types we defined
const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabParamList>();

// This creates our bottom tabs (Library, Scan, Search)
function MainTabNavigator() {
    return (
        <MainTabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
            }}
        >
            <MainTabs.Screen
                name='Library'
                component={LibraryScreen}
                options={{
                    tabBarLabel: 'Library',
                    //Add Icon later
                }}
            />
            <MainTabs.Screen 
                name="Scan" 
                component={ScanScreen}
                options={{
                tabBarLabel: 'Scan',
                }}
            />
            <MainTabs.Screen 
                name="Search" 
                component={SearchScreen}
                options={{
                tabBarLabel: 'Search',
                }}
            />
        </MainTabs.Navigator>
    );
}

// This is our main app navigator
export default function AppNavigator() {
    return (
        <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {/* This shows our main tabs */}
            <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
            
            {/* Individual screens that are outside the tabs */}
            {/* <RootStack.Screen name="BookDetails" component={BookDetailsScreen} /> */}
        </RootStack.Navigator>
        </NavigationContainer>
    );
}
