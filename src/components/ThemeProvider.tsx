import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Global styles for theme optimization
const GlobalStyles = () => (
  <style>
    {`
      /* Global optimization styles */
      .theme-changing * {
        transition: none !important;
      }
      
      /* Fast transitions only for background colors */
      .theme-changing body,
      .theme-changing section,
      .theme-changing div:not(.geometric-pattern, .bg-grid-pattern) {
        transition: background-color 100ms linear !important;
      }
      
      /* Better performance for tables during theme changes */
      table, th, td, tr {
        transition: none !important;
      }
      
      /* Text that should never transition */
      h1, h2, h3, h4, h5, h6, .text-white, .text-rashmi-red {
        transition: none !important;
      }
    `}
  </style>
);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'rashmi-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Add optimization class before theme change to disable most transitions
    if (isTransitioning) {
      root.classList.add('theme-changing');
    }
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Remove optimization class after a short delay to re-enable transitions
    if (isTransitioning) {
      const timer = setTimeout(() => {
        root.classList.remove('theme-changing');
        setIsTransitioning(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [theme, isTransitioning]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setIsTransitioning(true);
        // Force a re-render to apply system theme
        setTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setIsTransitioning(true);
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <>
      <GlobalStyles />
      <ThemeProviderContext.Provider {...props} value={value}>
        {children}
      </ThemeProviderContext.Provider>
    </>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}; 