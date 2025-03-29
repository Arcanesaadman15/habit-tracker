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
import { RootStackParamList, DrawerParamList } from './types';
import { colors } from '../theme/theme';

// Create a drawer navigator
const Drawer = createDrawerNavigator<DrawerParamList>();

// Create a custom drawer header
const DrawerHeader = () => (
  <View style={styles.drawerHeader}>
    <Text style={styles.drawerHeaderText}>Habit Tracker</Text>
  </View>
);

const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.grey,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 250,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
      drawerContent={(props) => (
        <View style={styles.drawerContainer}>
          <DrawerHeader />
          {props.state.routes.map((route, index) => {
            const focused = props.state.index === index;
            const { title } = props.descriptors[route.key].options;
            
            return (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.drawerItem,
                  focused && styles.drawerItemActive
                ]}
                onPress={() => props.navigation.navigate(route.name)}
              >
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
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Habits',
        }}
      />
      <Drawer.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{
          title: 'Statistics',
        }}
      />
      <Drawer.Screen 
        name="SettingsDrawer" 
        component={SettingsScreen} 
        options={{
          title: 'Settings',
        }}
      />
    </Drawer.Navigator>
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
          options={{ title: 'Create a Habit' }} 
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
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  drawerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  drawerItemActive: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  drawerLabel: {
    fontSize: 16,
    color: colors.dark,
  },
  drawerLabelActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default AppNavigator; 