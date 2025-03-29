import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Habit, HabitFormData, HabitContextType } from '../types';
import { storeData, getData, STORAGE_KEYS } from '../../../utils/storage';
import { formatDate, calculateStreak } from '../../../utils/dateUtils';

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load habits from storage on mount
  useEffect(() => {
    const loadHabits = async () => {
      try {
        setIsLoading(true);
        const storedHabits = await getData<Habit[]>(STORAGE_KEYS.HABITS);
        if (storedHabits) {
          // Add default urgency to any existing habits that don't have it
          const migratedHabits = storedHabits.map(habit => {
            if (typeof habit.urgency !== 'number') {
              return {
                ...habit,
                urgency: 3, // Default to medium urgency
              };
            }
            return habit;
          });
          setHabits(migratedHabits);
        }
      } catch (error) {
        console.error('Error loading habits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHabits();
  }, []);

  // Save habits to storage whenever they change
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await storeData(STORAGE_KEYS.HABITS, habits);
      } catch (error) {
        console.error('Error saving habits:', error);
      }
    };

    if (!isLoading && habits.length > 0) {
      saveHabits();
    }
  }, [habits, isLoading]);

  const addHabit = async (habitData: HabitFormData): Promise<void> => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      ...habitData,
      completedDates: [],
      createdAt: new Date().toISOString(),
      streakCount: 0,
    };

    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  const toggleHabitCompletion = async (habitId: string, date: string): Promise<void> => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const formattedDate = formatDate(date);
          const isCompleted = habit.completedDates.includes(formattedDate);
          
          let updatedDates = isCompleted 
            ? habit.completedDates.filter(d => d !== formattedDate)
            : [...habit.completedDates, formattedDate];
            
          return {
            ...habit,
            completedDates: updatedDates,
            streakCount: calculateStreak(updatedDates),
          };
        }
        return habit;
      })
    );
  };

  const deleteHabit = async (habitId: string): Promise<void> => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        toggleHabitCompletion,
        deleteHabit,
        isLoading,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}; 