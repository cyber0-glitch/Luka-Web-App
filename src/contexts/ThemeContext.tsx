import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useApp } from './AppContext';

interface ThemeContextType {
  theme: 'light' | 'dark';
  darkModeStyle: 'true_black' | 'gray';
  toggleTheme: () => void;
  setDarkModeStyle: (style: 'true_black' | 'gray') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, dispatch } = useApp();
  const { theme: themePreference, darkModeStyle } = state.settings;

  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (themePreference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themePreference;
  };

  const theme = getEffectiveTheme();

  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'true-black');

    // Apply theme
    if (theme === 'dark') {
      root.classList.add('dark');
      if (darkModeStyle === 'true_black') {
        root.classList.add('true-black');
      }
    } else {
      root.classList.add('light');
    }
  }, [theme, darkModeStyle]);

  // Listen for system theme changes
  useEffect(() => {
    if (themePreference !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark', 'true-black');

      if (mediaQuery.matches) {
        root.classList.add('dark');
        if (darkModeStyle === 'true_black') {
          root.classList.add('true-black');
        }
      } else {
        root.classList.add('light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themePreference, darkModeStyle]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: newTheme } });
  };

  const setDarkModeStyle = (style: 'true_black' | 'gray') => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { darkModeStyle: style } });
  };

  return (
    <ThemeContext.Provider value={{ theme, darkModeStyle, toggleTheme, setDarkModeStyle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
