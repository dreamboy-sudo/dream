'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'DREAM' | 'NIGHTMARE';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  isDream: boolean;
  isNightmare: boolean;
  colors: {
    primary: string;
    background: string;
    text: string;
    border: string;
    glass: {
      background: string;
      border: string;
      hover: string;
    };
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  DREAM: {
    primary: '#0fadf6',
    background: '#0fadf6',
    text: 'white',
    border: 'rgba(255, 255, 255, 0.2)',
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.2)',
      hover: 'rgba(255, 255, 255, 0.1)',
    },
  },
  NIGHTMARE: {
    primary: '#1a1a1a',
    background: '#1a1a1a',
    text: '#ff0000',
    border: 'rgba(255, 0, 0, 0.2)',
    glass: {
      background: 'rgba(255, 0, 0, 0.05)',
      border: 'rgba(255, 0, 0, 0.2)',
      hover: 'rgba(255, 0, 0, 0.1)',
    },
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('DREAM');

  // Persist theme mode in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'DREAM' ? 'NIGHTMARE' : 'DREAM';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const value = {
    mode,
    toggleMode,
    isDream: mode === 'DREAM',
    isNightmare: mode === 'NIGHTMARE',
    colors: themeColors[mode],
  };

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={mode.toLowerCase()}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
