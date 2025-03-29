import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { HabitFormData } from '../types';
import { useHabits } from '../hooks/useHabits';
import { colors, spacing, typography } from '../../../theme/theme';
import Button from '../../../components/common/Button';

type AddHabitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const COLORS = [
  colors.primary,
  colors.secondary,
  colors.success,
  colors.danger,
  colors.warning,
  colors.info,
];

const AddHabitScreen: React.FC = () => {
  const navigation = useNavigation<AddHabitScreenNavigationProp>();
  const { addHabit, isLoading } = useHabits();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [targetDays, setTargetDays] = useState(7);
  const [selectedColor, setSelectedColor] = useState(colors.primary);
  const [urgency, setUrgency] = useState(3); // Default urgency level is 3 (medium)
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFrequencyChange = (newFrequency: 'daily' | 'weekly') => {
    setFrequency(newFrequency);
    if (newFrequency === 'daily') {
      setTargetDays(7);
    } else if (targetDays > 7) {
      setTargetDays(7);
    }
  };

  const handleTargetDaysChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 7) {
      setTargetDays(numValue);
    }
  };

  const handleUrgencyChange = (value: number) => {
    setUrgency(value);
  };

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        setError('Please enter a title for your habit');
        return;
      }

      setError('');
      setSubmitting(true);
      
      await addHabit({
        title,
        description,
        frequency,
        targetDays,
        color: selectedColor,
        urgency,
      });
      
      navigation.goBack();
    } catch (error) {
      console.error('Error adding habit:', error);
      setError('Failed to add habit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render urgency level buttons
  const renderUrgencyLevels = () => {
    const levels = [1, 2, 3, 4, 5];
    
    return (
      <View style={styles.urgencyContainer}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.urgencyButton,
              urgency === level && styles.selectedUrgencyButton,
              { backgroundColor: getUrgencyColor(level) }
            ]}
            onPress={() => handleUrgencyChange(level)}
          >
            <Text 
              style={[
                styles.urgencyButtonText,
                urgency === level && styles.selectedUrgencyButtonText
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Get color based on urgency level
  const getUrgencyColor = (level: number) => {
    switch (level) {
      case 1: return `${colors.success}40`; // Low urgency - green with opacity
      case 2: return `${colors.info}40`;
      case 3: return `${colors.warning}40`;
      case 4: return `${colors.secondary}40`;
      case 5: return `${colors.danger}40`; // High urgency - red with opacity
      default: return `${colors.warning}40`;
    }
  };

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="What habit do you want to build?"
          placeholderTextColor={colors.grey}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add some details about this habit"
          placeholderTextColor={colors.grey}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Urgency (Required)</Text>
        <Text style={styles.urgencyDescription}>
          Select how urgent this habit is (1-5). Higher urgency habits will appear at the top.
        </Text>
        {renderUrgencyLevels()}
        <Text style={styles.selectedUrgencyLabel}>
          Selected: {getUrgencyLabel(urgency)}
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.frequencyButton,
              frequency === 'daily' && styles.frequencyButtonActive,
            ]}
            onPress={() => handleFrequencyChange('daily')}
          >
            <Text
              style={[
                styles.frequencyButtonText,
                frequency === 'daily' && styles.frequencyButtonTextActive,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.frequencyButton,
              frequency === 'weekly' && styles.frequencyButtonActive,
            ]}
            onPress={() => handleFrequencyChange('weekly')}
          >
            <Text
              style={[
                styles.frequencyButtonText,
                frequency === 'weekly' && styles.frequencyButtonTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {frequency === 'weekly' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Target days per week</Text>
          <TextInput
            style={[styles.input, styles.numberInput]}
            value={targetDays.toString()}
            onChangeText={handleTargetDaysChange}
            keyboardType="number-pad"
            maxLength={1}
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorContainer}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={styles.colorWrapper}
              onPress={() => setSelectedColor(color)}
            >
              <View
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  color === selectedColor && styles.selectedColor,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title="Create Habit"
        onPress={handleSubmit}
        isLoading={submitting || isLoading}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    marginBottom: spacing.xs,
    color: colors.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    backgroundColor: colors.white,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  numberInput: {
    width: 80,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  frequencyButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: spacing.sm,
    borderRadius: 8,
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary,
  },
  frequencyButtonText: {
    color: colors.primary,
    fontWeight: '500',
  },
  frequencyButtonTextActive: {
    color: colors.white,
  },
  urgencyDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.grey,
    marginBottom: spacing.sm,
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  urgencyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
  },
  selectedUrgencyButton: {
    borderWidth: 2,
    borderColor: colors.dark,
    transform: [{ scale: 1.1 }],
  },
  urgencyButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: '700',
    color: colors.dark,
  },
  selectedUrgencyButtonText: {
    color: colors.dark,
  },
  selectedUrgencyLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    color: colors.dark,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorWrapper: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: colors.dark,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default AddHabitScreen; 