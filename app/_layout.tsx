// Root layout for the entire app
// This file configures global settings and navigation structure

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Root layout component - wraps the entire app
export default function RootLayout() {
  return (
    <>
      {/* Configure the status bar appearance */}
      <StatusBar style="auto" />
      
      {/* Stack navigator for the entire app */}
      <Stack
        screenOptions={{
          // Hide headers globally since our screens have their own
          headerShown: false,
        }}
      >
        {/* This will automatically include all routes in the app directory */}
        {/* No need to manually define routes - Expo Router handles this! */}
      </Stack>
    </>
  );
}