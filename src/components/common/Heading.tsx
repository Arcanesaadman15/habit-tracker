import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, typography } from '../../theme/theme';

interface HeadingProps {
  title: string;
  level?: 1 | 2 | 3 | 4 | 5;
  color?: string;
  style?: TextStyle;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  level = 1,
  color = colors.dark,
  style,
  center = false,
}) => {
  const getFontSize = () => {
    switch (level) {
      case 1:
        return typography.fontSizes.xxl;
      case 2:
        return typography.fontSizes.xl;
      case 3:
        return typography.fontSizes.lg;
      case 4:
        return typography.fontSizes.md;
      case 5:
        return typography.fontSizes.sm;
      default:
        return typography.fontSizes.xxl;
    }
  };

  const getLineHeight = () => {
    return getFontSize() * 1.3;
  };

  return (
    <Text
      style={[
        styles.heading,
        {
          fontSize: getFontSize(),
          color,
          lineHeight: getLineHeight(),
          textAlign: center ? 'center' : 'left',
        },
        style,
      ]}
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700',
    marginBottom: 8,
  },
});

export default Heading; 