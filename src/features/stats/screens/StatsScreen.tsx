import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { useHabits } from '../../habits/hooks/useHabits';
import { useStats } from '../hooks/useStats';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

const StatsScreen = () => {
  const { habits } = useHabits();
  const { calculateOverallStats } = useStats();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;

  const overallStats = calculateOverallStats(habits);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: themeColors.text }]}>Your Stats</Text>
        
        <View style={[styles.statsCard, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>Overall Stats</Text>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Total Habits</Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>{overallStats.totalHabits}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Active Habits</Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>{overallStats.activeHabits}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Avg. Completion Rate</Text>
            <Text style={[styles.statValue, { color: themeColors.text }]}>{overallStats.averageCompletionRate}%</Text>
          </View>
        </View>
        
        {overallStats.topHabits.length > 0 && (
          <View style={[styles.statsCard, { backgroundColor: themeColors.card }]}>
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>
              {overallStats.topHabits.length === 1 ? 'Top Habit' : 'Top Habits'}
            </Text>
            <Text style={[styles.cardSubtitle, { color: themeColors.textSecondary }]}>
              {overallStats.topHabits.length === 1 ? 'Your most consistent habit' : 'Your most consistent habits'}
            </Text>
            
            {overallStats.topHabits.map((habit, index) => (
              <View key={habit.id} style={[
                styles.topHabitItem, 
                index < overallStats.topHabits.length - 1 && styles.topHabitItemWithBorder
              ]}>
                <View style={styles.topHabitTitleContainer}>
                  <Ionicons name="trophy" size={18} color={themeColors.primary} style={styles.trophyIcon} />
                  <Text style={[styles.topHabitTitle, { color: themeColors.text }]}>
                    {habit.title}
                  </Text>
                </View>
                <View style={styles.streakContainer}>
                  <Ionicons name="flame" size={18} color="#FF9500" style={styles.streakIcon} />
                  <Text style={[styles.streakCount, { color: themeColors.text }]}>
                    {habit.streakCount}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* More stats cards can be added here */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  topHabitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  topHabitItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  topHabitTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trophyIcon: {
    marginRight: 8,
  },
  topHabitTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  streakIcon: {
    marginRight: 4,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StatsScreen; 