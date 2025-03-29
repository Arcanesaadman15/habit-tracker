import { format, startOfDay, isSameDay, parseISO, isToday, subDays, differenceInDays } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

export const isDateToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

export const isSameDayCheck = (date1: Date | string, date2: Date | string): boolean => {
  const date1Obj = typeof date1 === 'string' ? parseISO(date1) : date1;
  const date2Obj = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(date1Obj, date2Obj);
};

export const getLastNDays = (n: number): Date[] => {
  const today = startOfDay(new Date());
  const dates: Date[] = [];
  
  for (let i = 0; i < n; i++) {
    dates.push(subDays(today, i));
  }
  
  return dates;
};

export const calculateStreak = (completedDates: string[]): number => {
  if (!completedDates.length) return 0;
  
  // Convert to Date objects and sort descending
  const dates = completedDates
    .map(date => parseISO(date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 1;
  let currentDate = dates[0];
  
  // If the most recent date is not today or yesterday, streak is broken
  if (differenceInDays(new Date(), currentDate) > 1) {
    return 0;
  }
  
  // Calculate consecutive days
  for (let i = 1; i < dates.length; i++) {
    const diff = differenceInDays(currentDate, dates[i]);
    
    if (diff === 1) {
      streak++;
      currentDate = dates[i];
    } else if (diff > 1) {
      break;
    }
  }
  
  return streak;
}; 