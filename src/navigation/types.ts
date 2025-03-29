import { NavigatorScreenParams } from '@react-navigation/native';
import { Habit } from '../features/habits/types';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  HabitDetail: { habit: Habit };
  AddHabit: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
}; 