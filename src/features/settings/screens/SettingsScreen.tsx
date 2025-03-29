import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme/theme';

const SettingsScreen: React.FC = () => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.dark }]}>Settings</Text>
      
      {/* Prominent placeholder content */}
      <View style={[styles.emptyContainer, { 
        backgroundColor: colors.primary, 
        borderWidth: 2,
        borderColor: colors.dark
      }]}>
        <Text style={[styles.emptyText, { 
          color: colors.white,
          fontSize: 20,
          fontWeight: 'bold'
        }]}>
          Settings Page
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    fontSize: typography.fontSizes.xl,
    fontWeight: 'bold',
    marginVertical: spacing.lg,
  },
  emptyContainer: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginTop: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
  }
});

export default SettingsScreen; 