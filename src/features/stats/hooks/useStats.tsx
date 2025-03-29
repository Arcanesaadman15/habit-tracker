import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HabitStats, OverallStats, StatsContextType } from '../types';
import { Habit } from '../../habits/types';

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const calculateHabitStats = (habit: Habit): HabitStats => {
    // Calculate completion rate
    const totalDays = Math.max(
      1, 
      Math.ceil((Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    );
    const completionRate = Math.round((habit.completedDates.length / totalDays) * 100);
    
    return {
      habitId: habit.id,
      title: habit.title,
      completionRate,
      currentStreak: habit.streakCount,
      longestStreak: habit.streakCount, // For simplicity - would need additional tracking for historical longest
      totalCompletions: habit.completedDates.length,
    };
  };

  const calculateOverallStats = (habits: Habit[]): OverallStats => {
    if (!habits.length) {
      return {
        totalHabits: 0,
        activeHabits: 0,
        averageCompletionRate: 0,
      };
    }

    const habitStats = habits.map(calculateHabitStats);
    const totalHabits = habits.length;
    
    // Consider a habit active if it has any completions in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTime = sevenDaysAgo.getTime();
    
    const activeHabits = habits.filter(habit => {
      return habit.completedDates.some(dateStr => {
        const completionDate = new Date(dateStr);
        return completionDate.getTime() >= sevenDaysAgoTime;
      });
    }).length;
    
    // Calculate average completion rate
    const averageCompletionRate = Math.round(
      habitStats.reduce((sum, stat) => sum + stat.completionRate, 0) / totalHabits
    );
    
    // Find top habit by completion rate
    const topHabit = [...habitStats].sort((a, b) => b.completionRate - a.completionRate)[0];
    
    return {
      totalHabits,
      activeHabits,
      averageCompletionRate,
      topHabit: topHabit ? {
        id: topHabit.habitId,
        title: topHabit.title,
        completionRate: topHabit.completionRate,
      } : undefined,
    };
  };

  return (
    <StatsContext.Provider
      value={{
        calculateHabitStats,
        calculateOverallStats,
        isLoading,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = (): StatsContextType => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}; 