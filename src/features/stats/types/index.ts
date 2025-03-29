import { Habit } from '../../habits/types';

export interface HabitStats {
  habitId: string;
  title: string;
  completionRate: number; // percentage
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}

export interface OverallStats {
  totalHabits: number;
  activeHabits: number;
  averageCompletionRate: number;
  topHabit?: {
    id: string;
    title: string;
    completionRate: number;
  };
}

export type StatsContextType = {
  calculateHabitStats: (habit: Habit) => HabitStats;
  calculateOverallStats: (habits: Habit[]) => OverallStats;
  isLoading: boolean;
}; 