import { NavigatorScreenParams } from '@react-navigation/native';
import { Habit } from '../features/habits/types';

// Define the drawer param list for the drawer navigator
export type DrawerParamList = {
  Home: undefined;
  Stats: undefined;
  SettingsDrawer: undefined;
};

// Root stack param list for the application navigation
export type RootStackParamList = {
  Main: NavigatorScreenParams<DrawerParamList>;
  HabitDetail: { habit: Habit };
  AddHabit: undefined;
  Settings: undefined;
}; 