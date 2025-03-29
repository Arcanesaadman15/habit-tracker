import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useHabits } from '../hooks/useHabits';
import { Habit } from '../types';
import { colors, spacing, typography } from '../../../theme/theme';
import Heading from '../../../components/common/Heading';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import UrgencyBadge from '../components/UrgencyBadge';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

  // Generate a lighter version of the card border color
  const cardColor = habit.color || colors.primary;
  const cardGradientStart = `${cardColor}20`; // 20% opacity
  const cardGradientEnd = `${cardColor}05`;   // 5% opacity

  return (
    <TouchableOpacity 
      style={styles.habitItemContainer}
      onPress={() => onPress(habit)}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[cardGradientStart, cardGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.habitItem,
          { borderLeftColor: habit.color || colors.primary },
        ]}
      >
        <View style={styles.habitContent}>
          <View style={styles.titleRow}>
            <Text style={styles.habitTitle}>{habit.title}</Text>
            <UrgencyBadge urgency={habit.urgency} size="medium" />
          </View>
          
          {habit.description ? (
            <Text style={styles.habitDescription} numberOfLines={2}>
              {habit.description}
            </Text>
          ) : null}
          
          <View style={styles.habitMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="flame" size={14} color={colors.grey} />
              <Text style={styles.habitStreak}>
                {habit.streakCount} days
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="repeat" size={14} color={colors.grey} />
              <Text style={styles.habitFrequency}>
                {habit.frequency === 'daily'
                  ? 'Daily'
                  : `${habit.targetDays}x / week`}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.checkButton,
            isCompletedToday && styles.checkedButton,
          ]}
          onPress={handleToggle}
        >
          {isCompletedToday ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.white} />
          ) : (
            <Ionicons name="checkmark-circle-outline" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { habits, toggleHabitCompletion } = useHabits();

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

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="list" size={70} color={`${colors.primary}50`} />
      <Text style={styles.emptyStateText}>No habits added yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Tap the plus button to create your first habit
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={handleAddHabit}
      >
        <Text style={styles.emptyStateButtonText}>Add Your First Habit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleOpenDrawer} style={styles.drawerButton}>
          <Ionicons name="menu" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Heading title="My Habits" level={1} />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddHabit}
        >
          <Ionicons name="add" size={24} color={colors.white} />
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
        contentContainerStyle={[
          styles.listContainer,
          habits.length === 0 && styles.emptyList
        ]}
        showsVerticalScrollIndicator={false}
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
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.grey}20`,
  },
  drawerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${colors.grey}15`,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  habitItemContainer: {
    marginBottom: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  habitItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
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
    fontWeight: '700',
    marginBottom: spacing.xs,
    color: colors.dark,
    flex: 1,
  },
  urgencyBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
    lineHeight: 20,
  },
  habitMeta: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  habitStreak: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
    marginLeft: 4,
  },
  habitFrequency: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
    marginLeft: 4,
  },
  checkButton: {
    alignSelf: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  checkedButton: {
    backgroundColor: colors.primary,
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
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSizes.md,
    color: colors.grey,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 25,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default HomeScreen; 