import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: {
    primary: string;
    primaryLight: string;
    dark: string;
    light: string;
    grey: string;
    white: string;
    black: string;
    background: string;
  };
}

const defaultContext: ThemeContextType = {
  theme: 'light',
  toggleTheme: () => {},
  colors: {
    primary: '#3498db',
    primaryLight: '#5dade2',
    dark: '#333333',
    light: '#eeeeee',
    grey: '#cccccc',
    white: '#ffffff',
    black: '#000000',
    background: '#ffffff'
  }
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const colors = theme === 'light'
    ? {
        primary: '#3498db',
        primaryLight: '#5dade2',
        dark: '#333333',
        light: '#eeeeee',
        grey: '#cccccc',
        white: '#ffffff',
        black: '#000000',
        background: '#ffffff',
      }
    : {
        primary: '#2980b9',
        primaryLight: '#5499c7',
        dark: '#ffffff',
        light: '#222222',
        grey: '#666666',
        white: '#ffffff',
        black: '#000000',
        background: '#000000',
      };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 