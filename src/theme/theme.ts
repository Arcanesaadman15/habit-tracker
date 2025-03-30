// Define theme type
export type ThemeColors = {
  primary: string;
  primaryLight: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  dark: string;
  light: string;
  grey: string;
  white: string;
  black: string;
  background: string;
  text: string;
  textSecondary: string;
  card: string;
  border: string;
};

// Light theme colors
export const light: ThemeColors = {
  primary: '#5352ED',
  primaryLight: '#8785FF',
  secondary: '#FF6B6B',
  success: '#20BF6B',
  danger: '#EB3B5A',
  warning: '#F7B731',
  info: '#3867D6',
  dark: '#2C3A47',
  light: '#F7F7F7',
  grey: '#A4B0BD',
  white: '#FFFFFF',
  black: '#000000',
  background: '#F1F2F6',
  text: '#2C3A47',
  textSecondary: '#A4B0BD',
  card: '#FFFFFF',
  border: '#E9ECEF',
};

// Dark theme colors
export const dark: ThemeColors = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  secondary: '#FF6B6B',
  success: '#20BF6B',
  danger: '#EB3B5A',
  warning: '#F7B731',
  info: '#3867D6',
  dark: '#F7F7F7', // Inverted
  light: '#2C3A47', // Inverted
  grey: '#A4B0BD',
  white: '#1E272E', // Inverted
  black: '#FFFFFF', // Inverted
  background: '#121212',
  text: '#F7F7F7',
  textSecondary: '#A4B0BD',
  card: '#1E1E1E',
  border: '#333333',
};

// For backward compatibility
export const colors = {
  ...light,
  dark,
  light,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

export default {
  colors,
  spacing,
  typography,
}; 