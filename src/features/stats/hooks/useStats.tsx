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
    if (habits.length === 0) {
      return {
        totalHabits: 0,
        activeHabits: 0,
        averageCompletionRate: 0,
        topHabits: []
      };
    }

    // Consider a habit active if it has any completions in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTime = sevenDaysAgo.getTime();
    
    const activeHabits = habits.filter(habit => {
      return habit.completedDates.some(dateStr => {
        const completionDate = new Date(dateStr);
        return completionDate.getTime() >= sevenDaysAgoTime;
      });
    });

    // Calculate average completion rate
    let totalCompletionRate = 0;
    
    activeHabits.forEach(habit => {
      const habitStats = calculateHabitStats(habit);
      totalCompletionRate += habitStats.completionRate;
    });

    const averageCompletionRate = activeHabits.length > 0
      ? totalCompletionRate / activeHabits.length
      : 0;

    // Find habits with the highest streak count
    let highestStreakCount = 0;
    let topHabitsArray: { id: string; title: string; streakCount: number }[] = [];

    habits.forEach(habit => {
      const streakCount = habit.streakCount;

      if (streakCount > highestStreakCount) {
        // New highest streak found, reset array with this habit
        highestStreakCount = streakCount;
        topHabitsArray = [{ 
          id: habit.id, 
          title: habit.title, 
          streakCount: streakCount 
        }];
      } else if (streakCount === highestStreakCount && streakCount > 0) {
        // Equal highest streak, add to array
        topHabitsArray.push({ 
          id: habit.id, 
          title: habit.title, 
          streakCount: streakCount 
        });
      }
    });

    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      averageCompletionRate,
      topHabits: topHabitsArray
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