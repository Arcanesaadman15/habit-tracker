import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../features/habits/screens/HomeScreen';
import StatsScreen from '../features/stats/screens/StatsScreen';
import HabitDetailScreen from '../features/habits/screens/HabitDetailScreen';
import AddHabitScreen from '../features/habits/screens/AddHabitScreen';
import { RootStackParamList, MainTabParamList } from './types';
import { colors } from '../theme/theme';

// Bottom tabs setup
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.light,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Habits',
          tabBarIcon: ({ color, size }) => (
            // Simple text icon for now
            <React.Fragment>•</React.Fragment>
          ),
        }} 
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <React.Fragment>📊</React.Fragment>
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

// Root stack setup
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
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
          options={{ title: 'Create a Habit' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 