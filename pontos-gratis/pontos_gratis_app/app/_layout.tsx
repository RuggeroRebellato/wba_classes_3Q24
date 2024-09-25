import '../polyfills'
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f89736' }, // Apply design system colors (carrot-orange)
          headerTintColor: '#f9f3e8', // Text color for headers (floral white)
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 }, // Consistent typography from design system
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

