import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import HomeScreen from '../features/habits/screens/HomeScreen';
import StatsScreen from '../features/stats/screens/StatsScreen';
import SettingsScreen from '../features/settings/screens/SettingsScreen';
import HabitDetailScreen from '../features/habits/screens/HabitDetailScreen';
import AddHabitScreen from '../features/habits/screens/AddHabitScreen';
import { RootStackParamList } from './types';
import { colors } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';

// Create drawer and stack navigators
const Drawer = createDrawerNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Create a custom drawer header
const DrawerHeader = () => (
  <View style={styles.drawerHeader}>
    <Text style={styles.drawerHeaderText}>Habit Tracker</Text>
  </View>
);

// Main navigation stack for content accessible from drawer items
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
      <Stack.Screen name="AddHabit" component={AddHabitScreen} />
    </Stack.Navigator>
  );
};

// Unified AppNavigator with a single drawer navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false, // Hide the default drawer header
          drawerType: 'front',
          drawerStyle: {
            backgroundColor: '#f5f5f5',
            width: 280,
          },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.grey,
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
          // Make edge swipe area wider
          swipeEdgeWidth: 80,
        }}
        drawerContent={(props) => (
          <View style={styles.drawerContainer}>
            <DrawerHeader />
            {props.state.routes.map((route, index) => {
              const focused = props.state.index === index;
              const { title } = props.descriptors[route.key].options;
              
              // Determine icon based on route name
              let iconName = "home-outline";
              if (route.name === "Stats") {
                iconName = "bar-chart-outline";
              } else if (route.name === "Settings") {
                iconName = "settings-outline";
              }
              
              return (
                <TouchableOpacity
                  key={route.key}
                  style={[
                    styles.drawerItem,
                    focused && styles.drawerItemActive
                  ]}
                  onPress={() => props.navigation.navigate(route.name)}
                >
                  <Ionicons 
                    name={iconName as any} 
                    size={22} 
                    color={focused ? colors.primary : '#2C3A47'} 
                    style={styles.drawerIcon}
                  />
                  <Text 
                    style={[
                      styles.drawerLabel,
                      focused && styles.drawerLabelActive
                    ]}
                  >
                    {title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      >
        <Drawer.Screen 
          name="MainStack" 
          component={MainStack} 
          options={{ title: 'Habits' }} 
        />
        <Drawer.Screen 
          name="Stats" 
          component={StatsScreen} 
          options={{ title: 'Statistics' }} 
        />
        <Drawer.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }} 
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 0,
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    padding: 16,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 10,
  },
  drawerHeaderText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  drawerItemActive: {
    backgroundColor: 'rgba(83, 82, 237, 0.08)',
  },
  drawerIcon: {
    marginRight: 12,
  },
  drawerLabel: {
    fontSize: 16,
    color: '#2C3A47',
  },
  drawerLabelActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default AppNavigator; 