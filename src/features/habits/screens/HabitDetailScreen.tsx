import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useHabits } from '../hooks/useHabits';
import { useStats } from '../../../features/stats/hooks/useStats';
import { colors, spacing, typography } from '../../../theme/theme';
import Heading from '../../../components/common/Heading';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { formatDate } from '../../../utils/dateUtils';

type HabitDetailScreenRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;
type HabitDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HabitDetailScreen: React.FC = () => {
  const route = useRoute<HabitDetailScreenRouteProp>();
  const navigation = useNavigation<HabitDetailScreenNavigationProp>();
  const { habit } = route.params;
  const { toggleHabitCompletion, deleteHabit } = useHabits();
  const { calculateHabitStats } = useStats();
  const [isDeleting, setIsDeleting] = useState(false);

  const stats = calculateHabitStats(habit);
  const today = formatDate(new Date());
  const isCompletedToday = habit.completedDates.includes(today);

  // Get urgency label
  const getUrgencyLabel = (level: number) => {
    switch (level) {
      case 1: return "Very Low";
      case 2: return "Low";
      case 3: return "Medium";
      case 4: return "High";
      case 5: return "Very High";
      default: return "Medium";
    }
  };
  
  // Get urgency color
  const getUrgencyColor = (level: number) => {
    switch (level) {
      case 1: return colors.success;
      case 2: return colors.info;
      case 3: return colors.warning;
      case 4: return colors.secondary;
      case 5: return colors.danger;
      default: return colors.warning;
    }
  };

  const handleToggleCompletion = async () => {
    try {
      await toggleHabitCompletion(habit.id, today);
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
  };

  const handleDeleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteHabit(habit.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting habit:', error);
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Heading title={habit.title} level={1} color={habit.color || colors.primary} />
        {habit.description ? (
          <Text style={styles.description}>{habit.description}</Text>
        ) : null}
        <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(habit.urgency) }]}>
          <Text style={styles.urgencyText}>
            Urgency: {getUrgencyLabel(habit.urgency)}
          </Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Habit Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Frequency:</Text>
          <Text style={styles.infoValue}>
            {habit.frequency === 'daily'
              ? 'Daily'
              : `${habit.targetDays} days per week`}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoValue}>
            {new Date(habit.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Current Streak:</Text>
          <Text style={styles.infoValue}>{habit.streakCount} days</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Urgency Level:</Text>
          <Text style={[styles.infoValue, { color: getUrgencyColor(habit.urgency) }]}>
            {habit.urgency} - {getUrgencyLabel(habit.urgency)}
          </Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{stats.totalCompletions}</Text>
            <Text style={styles.statsLabel}>Total Completions</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{stats.completionRate}%</Text>
            <Text style={styles.statsLabel}>Completion Rate</Text>
          </View>
        </View>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          title={isCompletedToday ? "Mark as Not Completed" : "Mark as Completed"}
          onPress={handleToggleCompletion}
          variant={isCompletedToday ? "outline" : "primary"}
          style={styles.actionButton}
        />
        <Button
          title="Delete Habit"
          onPress={handleDeleteHabit}
          variant="danger"
          isLoading={isDeleting}
          style={styles.actionButton}
        />
      </View>
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
    paddingTop: spacing.md,
  },
  description: {
    fontSize: typography.fontSizes.md,
    color: colors.grey,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  urgencyBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  urgencyText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: typography.fontSizes.sm,
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.fontSizes.md,
    color: colors.grey,
  },
  infoValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: '500',
    color: colors.dark,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statsItem: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statsValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statsLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  actionButton: {
    marginBottom: spacing.sm,
  }
});

export default HabitDetailScreen; 