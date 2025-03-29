import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface UrgencyBadgeProps {
  urgency: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const getUrgencyColor = (urgency: number, colors: any) => {
  switch (urgency) {
    case 1:
      return colors.success;
    case 2:
      return colors.info;
    case 3:
      return colors.warning;
    case 4:
      return colors.secondary;
    case 5:
      return colors.danger;
    default:
      return colors.grey;
  }
};

const getUrgencyLabel = (urgency: number): string => {
  switch (urgency) {
    case 1: return "Low";
    case 2: return "Medium-Low";
    case 3: return "Medium";
    case 4: return "High";
    case 5: return "Urgent";
    default: return "Medium";
  }
};

const getUrgencyIcon = (urgency: number): string => {
  switch (urgency) {
    case 1: return "alert-circle-outline";
    case 2: return "alert-circle-outline";
    case 3: return "alert-circle";
    case 4: return "warning-outline";
    case 5: return "warning";
    default: return "alert-circle";
  }
};

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ 
  urgency, 
  size = 'medium',
  showLabel = false 
}) => {
  const { colors } = useTheme();
  const badgeColor = getUrgencyColor(urgency, colors);
  const label = getUrgencyLabel(urgency);
  const icon = getUrgencyIcon(urgency);
  
  const getBadgeSize = () => {
    switch (size) {
      case 'small': return styles.badgeSmall;
      case 'large': return styles.badgeLarge;
      default: return styles.badgeMedium;
    }
  };
  
  const getTextSize = () => {
    switch (size) {
      case 'small': return styles.textSmall;
      case 'large': return styles.textLarge;
      default: return styles.textMedium;
    }
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 20;
      default: return 16;
    }
  };
  
  return (
    <View style={[styles.badgeContainer, getBadgeSize(), { backgroundColor: badgeColor }]}>
      {showLabel ? (
        <Text style={[styles.badgeText, getTextSize()]}>
          {label}
        </Text>
      ) : (
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={getIconSize()} color={colors.white} />
          <Text style={[styles.badgeText, getTextSize()]}>
            {urgency}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  badgeSmall: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
  },
  badgeMedium: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 12,
    minWidth: 26,
    height: 26,
  },
  badgeLarge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 32,
    height: 32,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textSmall: {
    fontSize: typography.fontSizes.xs - 2,
  },
  textMedium: {
    fontSize: typography.fontSizes.xs,
  },
  textLarge: {
    fontSize: typography.fontSizes.sm,
  },
});

export default UrgencyBadge; 