import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { HabitProvider } from './src/features/habits/hooks/useHabits';
import { StatsProvider } from './src/features/stats/hooks/useStats';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <HabitProvider>
        <StatsProvider>
          <AppNavigator />
        </StatsProvider>
      </HabitProvider>
    </SafeAreaProvider>
  );
}
