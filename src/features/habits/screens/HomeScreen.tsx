import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useHabits } from '../hooks/useHabits';
import { Habit } from '../types';
import { colors, spacing, typography } from '../../../theme/theme';
import Heading from '../../../components/common/Heading';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper function to get urgency label
const getUrgencyLabel = (level: number): string => {
  switch (level) {
    case 1: return "Very Low";
    case 2: return "Low";
    case 3: return "Medium";
    case 4: return "High";
    case 5: return "Very High";
    default: return "Medium";
  }
};

// Helper function to get urgency color
const getUrgencyColor = (level: number): string => {
  switch (level) {
    case 1: return colors.success;
    case 2: return colors.info;
    case 3: return colors.warning;
    case 4: return colors.secondary;
    case 5: return colors.danger;
    default: return colors.warning;
  }
};

// HabitItem component
const HabitItem: React.FC<{
  habit: Habit;
  onPress: (habit: Habit) => void;
  onToggle: (id: string, date: string) => void;
}> = ({ habit, onPress, onToggle }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);
  
  const handleToggle = () => {
    onToggle(habit.id, today);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.habitItem, 
        { borderLeftColor: habit.color || colors.primary }
      ]}
      onPress={() => onPress(habit)}
      activeOpacity={0.7}
    >
      <View style={styles.habitContent}>
        <View style={styles.titleRow}>
          <Text style={styles.habitTitle}>{habit.title}</Text>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(habit.urgency) }]}>
            <Text style={styles.urgencyText}>{habit.urgency}</Text>
          </View>
        </View>
        {habit.description ? (
          <Text style={styles.habitDescription} numberOfLines={2}>
            {habit.description}
          </Text>
        ) : null}
        <View style={styles.habitMeta}>
          <Text style={styles.habitStreak}>
            Streak: {habit.streakCount} days
          </Text>
          <Text style={styles.habitFrequency}>
            {habit.frequency === 'daily'
              ? 'Daily'
              : `${habit.targetDays}x per week`}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[
          styles.checkButton,
          isCompletedToday && styles.checkedButton,
        ]}
        onPress={handleToggle}
      >
        <Text style={[
          styles.checkButtonText,
          isCompletedToday && styles.checkedButtonText,
        ]}>
          {isCompletedToday ? 'Done' : 'Do it'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { habits, toggleHabitCompletion, isLoading } = useHabits();

  // Sort habits by urgency (highest to lowest)
  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => b.urgency - a.urgency);
  }, [habits]);

  const handleAddHabit = () => {
    navigation.navigate('AddHabit');
  };

  const handleHabitPress = useCallback((habit: Habit) => {
    navigation.navigate('HabitDetail', { habit });
  }, [navigation]);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>No habits added yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Tap the plus button below to create your first habit
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading title="My Habits" level={1} />
        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedHabits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            onPress={handleHabitPress}
            onToggle={toggleHabitCompletion}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
  },
  habitItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  habitTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.dark,
    flex: 1,
  },
  urgencyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  urgencyText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.fontSizes.xs,
  },
  habitDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
    marginBottom: spacing.xs,
  },
  habitMeta: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  habitStreak: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
    marginRight: spacing.md,
  },
  habitFrequency: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
  },
  checkButton: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  checkedButton: {
    backgroundColor: colors.primary,
  },
  checkButtonText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '500',
    color: colors.primary,
  },
  checkedButtonText: {
    color: colors.white,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyStateText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSizes.md,
    color: colors.grey,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});

export default HomeScreen; 