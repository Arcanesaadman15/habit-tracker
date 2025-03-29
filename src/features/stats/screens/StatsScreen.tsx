import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../../theme/theme';
import { useHabits } from '../../habits/hooks/useHabits';
import { useStats } from '../hooks/useStats';
import Card from '../../../components/common/Card';
import Heading from '../../../components/common/Heading';

const StatsScreen: React.FC = () => {
  const { habits } = useHabits();
  const { calculateOverallStats } = useStats();

  const overallStats = calculateOverallStats(habits);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Heading title="My Progress" level={1} />
      </View>

      <Card style={styles.overviewCard}>
        <Text style={styles.cardTitle}>Overall Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{overallStats.averageCompletionRate}%</Text>
            <Text style={styles.statDescription}>Completion Rate</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Habit Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{overallStats.totalHabits}</Text>
            <Text style={styles.statDescription}>Total Habits</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{overallStats.activeHabits}</Text>
            <Text style={styles.statDescription}>Active Habits</Text>
          </View>
        </View>

        {overallStats.topHabit && (
          <View style={styles.topHabitContainer}>
            <Text style={styles.topHabitLabel}>Top Habit</Text>
            <Text style={styles.topHabitTitle}>{overallStats.topHabit.title}</Text>
            <Text style={styles.topHabitRate}>
              {overallStats.topHabit.completionRate}% completion rate
            </Text>
          </View>
        )}
      </Card>

      {habits.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No habits to analyze</Text>
          <Text style={styles.emptyStateSubtext}>
            Start adding habits to see your progress stats
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  overviewCard: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  statBox: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statNumber: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
  },
  topHabitContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.light,
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  topHabitLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
    marginBottom: spacing.xs,
  },
  topHabitTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  topHabitRate: {
    fontSize: typography.fontSizes.md,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyStateContainer: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    padding: spacing.xxl,
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
  },
});

export default StatsScreen; 