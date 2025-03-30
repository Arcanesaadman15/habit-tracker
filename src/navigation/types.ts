import { NavigatorScreenParams } from '@react-navigation/native';
import { Habit } from '../features/habits/types';

// Define the drawer param list for the drawer navigator
export type DrawerParamList = {
  MainStack: undefined;
  Stats: undefined;
  Settings: undefined;
};

// Root stack param list for the application navigation
export type RootStackParamList = {
  // Drawer routes
  MainStack: undefined;
  Stats: undefined;
  Settings: undefined;
  
  // Stack routes
  Home: undefined;
  HabitDetail: { habit: Habit };
  AddHabit: undefined;
}; 