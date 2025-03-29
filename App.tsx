import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './src/features/habits/screens/HomeScreen';
import StatsScreen from './src/features/stats/screens/StatsScreen';
import SettingsScreen from './src/features/settings/screens/SettingsScreen';
import HabitDetailScreen from './src/features/habits/screens/HabitDetailScreen';
import AddHabitScreen from './src/features/habits/screens/AddHabitScreen';

// Import context providers
import { HabitProvider } from './src/features/habits/hooks/useHabits';
import { StatsProvider } from './src/features/stats/hooks/useStats';
import { ThemeProvider } from './src/theme/ThemeContext';

// Import types
import { DrawerParamList, RootStackParamList } from './src/navigation/types';

// Create drawer navigator
const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Drawer navigator component
const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'My Habits' }}
      />
      <Drawer.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ title: 'Statistics' }}
      />
      <Drawer.Screen 
        name="SettingsDrawer" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <HabitProvider>
          <StatsProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen 
                  name="Main" 
                  component={MainDrawerNavigator} 
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="HabitDetail" 
                  component={HabitDetailScreen} 
                  options={{ title: 'Habit Details' }} 
                />
                <Stack.Screen 
                  name="AddHabit" 
                  component={AddHabitScreen} 
                  options={{ title: 'Create Habit' }} 
                />
                <Stack.Screen 
                  name="Settings" 
                  component={SettingsScreen} 
                  options={{ 
                    title: 'Settings',
                    presentation: 'modal' 
                  }} 
                />
              </Stack.Navigator>
            </NavigationContainer>
          </StatsProvider>
        </HabitProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
