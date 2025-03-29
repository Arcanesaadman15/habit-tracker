export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  targetDays: number; // How many days per week
  completedDates: string[]; // Array of ISO date strings
  createdAt: string;
  streakCount: number;
  color?: string;
  urgency: number; // 1-5 scale, 5 being most urgent
}

export interface HabitFormData {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  targetDays: number;
  color?: string;
  urgency: number; // 1-5 scale, 5 being most urgent
}

export type HabitContextType = {
  habits: Habit[];
  addHabit: (habit: HabitFormData) => Promise<void>;
  toggleHabitCompletion: (habitId: string, date: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  isLoading: boolean;
}; 