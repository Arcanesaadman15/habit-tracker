import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import UrgencyBadge from '../components/UrgencyBadge';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type HabitDetailScreenRouteProp = RouteProp<RootStackParamList, 'HabitDetail'>;
type HabitDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Circular progress component for completion rate
const CircularProgress: React.FC<{ percentage: number, size?: number, strokeWidth?: number }> = ({ 
  percentage, 
  size = 100, 
  strokeWidth = 10 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={[styles.progressContainer, { width: size, height: size }]}>
      <View style={styles.progressBackground}>
        <View 
          style={[
            styles.circleBackground, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              borderWidth: strokeWidth / 2,
              borderColor: `${colors.primary}30`
            }
          ]} 
        />
      </View>
      <View style={styles.progressForeground}>
        <View 
          style={[
            styles.circleForeground, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: colors.primary,
              borderTopColor: `${colors.primary}30`,
              borderRightColor: `${colors.primary}30`,
              transform: [{ rotate: `-${90 + (360 - (percentage * 3.6)) / 2}deg` }]
            }
          ]} 
        />
      </View>
      <View style={styles.progressText}>
        <Text style={styles.progressPercentage}>{percentage}%</Text>
        <Text style={styles.progressLabel}>Completion</Text>
      </View>
    </View>
  );
};

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
      <LinearGradient
        colors={[`${habit.color || colors.primary}20`, `${habit.color || colors.primary}05`, colors.background]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Heading title={habit.title} level={1} color={habit.color || colors.primary} />
          
          {habit.description ? (
            <Text style={styles.description}>{habit.description}</Text>
          ) : null}
          
          <View style={styles.badgeContainer}>
            <UrgencyBadge urgency={habit.urgency} size="large" showLabel={true} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.todayButton,
            isCompletedToday && styles.todayButtonCompleted
          ]}
          onPress={handleToggleCompletion}
        >
          <Ionicons 
            name={isCompletedToday ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={24} 
            color={isCompletedToday ? colors.white : colors.primary} 
          />
          <Text 
            style={[
              styles.todayButtonText,
              isCompletedToday && styles.todayButtonTextCompleted
            ]}
          >
            {isCompletedToday ? "Completed Today" : "Mark As Done"}
          </Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Progress Stats</Text>
        <View style={styles.statsOverview}>
          <CircularProgress percentage={stats.completionRate} />
          <View style={styles.statsDetails}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current Streak</Text>
              <View style={styles.statValueContainer}>
                <Ionicons name="flame" size={18} color={colors.primary} />
                <Text style={styles.statValue}>{habit.streakCount} days</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Completions</Text>
              <View style={styles.statValueContainer}>
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                <Text style={styles.statValue}>{stats.totalCompletions}</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Habit Details</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="repeat" size={18} color={colors.grey} />
            <Text style={styles.infoLabelText}>Frequency</Text>
          </View>
          <Text style={styles.infoValue}>
            {habit.frequency === 'daily'
              ? 'Daily'
              : `${habit.targetDays} days per week`}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Ionicons name="calendar" size={18} color={colors.grey} />
            <Text style={styles.infoLabelText}>Created</Text>
          </View>
          <Text style={styles.infoValue}>
            {new Date(habit.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Card>

      <View style={styles.deleteContainer}>
        <TouchableOpacity
          style={styles.deleteButtonContainer}
          onPress={handleDeleteHabit}
          disabled={isDeleting}
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.deleteButtonText}>
            {isDeleting ? 'Deleting...' : 'Delete Habit'}
          </Text>
          {isDeleting && <ActivityIndicator size="small" color={colors.danger} style={styles.deleteSpinner} />}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSizes.md,
    color: colors.grey,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  badgeContainer: {
    marginTop: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  todayButtonCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  todayButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  todayButtonTextCompleted: {
    color: colors.white,
  },
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: 12,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  statsOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBackground: {
    borderStyle: 'solid',
  },
  progressForeground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleForeground: {
    borderStyle: 'solid',
    transform: [{ rotate: '-90deg' }],
  },
  progressText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.grey,
    marginTop: 4,
  },
  statsDetails: {
    flex: 1,
    paddingLeft: spacing.lg,
  },
  statItem: {
    marginBottom: spacing.md,
  },
  statLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
    marginBottom: spacing.xs,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginLeft: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.grey}20`,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabelText: {
    fontSize: typography.fontSizes.md,
    color: colors.grey,
    marginLeft: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600',
    color: colors.dark,
  },
  deleteContainer: {
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl * 2,
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.danger}10`,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
  },
  deleteButtonText: {
    color: colors.danger,
    fontWeight: '600',
    marginLeft: spacing.xs,
    fontSize: typography.fontSizes.md,
  },
  deleteSpinner: {
    marginLeft: spacing.xs,
  },
  urgencyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  urgencyText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: typography.fontSizes.sm,
  },
});

export default HabitDetailScreen; 