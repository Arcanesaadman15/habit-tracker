import React, { useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, StatusBar, Animated } from 'react-native';
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
  
  return (
    <TouchableOpacity 
      style={styles.habitItemContainer}
      onPress={() => onPress(habit)}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[`${cardColor}15`, `${cardColor}05`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.habitItem,
          { borderLeftColor: cardColor },
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
              <Ionicons name="flame" size={16} color={colors.warning} />
              <Text style={styles.habitStreak}>
                {habit.streakCount} days
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="repeat" size={16} color={colors.info} />
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
            <Ionicons name="checkmark-circle" size={28} color={colors.white} />
          ) : (
            <Ionicons name="checkmark-circle-outline" size={28} color={colors.primary} />
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
      
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[colors.background, `${colors.background}F0`]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft} />
            
            <Heading title="My Habits" level={1} />
            
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={handleAddHabit}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.addButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add" size={26} color={colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
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
  },
  headerContainer: {
    zIndex: 10,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerGradient: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerLeft: {
    width: 48,
    height: 48,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitItemContainer: {
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  habitItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    borderLeftWidth: 5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  habitContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  habitTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: '#2C3A47',
    flex: 1,
    marginRight: spacing.sm,
  },
  habitDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    backgroundColor: `${colors.light}80`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  habitStreak: {
    fontSize: typography.fontSizes.sm,
    color: '#2C3A47',
    fontWeight: '500',
    marginLeft: 4,
  },
  habitFrequency: {
    fontSize: typography.fontSizes.sm,
    color: '#2C3A47',
    fontWeight: '500',
    marginLeft: 4,
  },
  checkButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderRadius: 20,
    alignSelf: 'center',
  },
  checkedButton: {
    backgroundColor: colors.primary,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.fontSizes.xl,
    color: '#2C3A47',
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSizes.md,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: typography.fontSizes.md,
  },
});

export default HomeScreen; 