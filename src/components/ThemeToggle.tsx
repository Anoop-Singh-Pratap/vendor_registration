import React, { useRef, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Map our theme structure to original
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Toggle between light and dark, preserving system if that's the current setting
  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(isDark ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  // Interactive hover effect
  useEffect(() => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!toggle) return;
      const rect = toggle.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      toggle.style.setProperty('--x', `${x}px`);
      toggle.style.setProperty('--y', `${y}px`);
    };

    toggle.addEventListener('mousemove', handleMouseMove);
    return () => {
      toggle.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.button
      ref={toggleRef}
      onClick={toggleTheme}
      className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-background to-secondary 
                 overflow-hidden shadow-md transition-all duration-500 hover:shadow-lg
                 before:absolute before:w-16 before:h-16 before:rounded-full 
                 before:bg-gradient-to-tr before:from-rashmi-red/50 before:to-foreground/20 
                 before:transition-all before:duration-500 before:opacity-0 before:hover:opacity-100
                 before:blur-sm before:transform-gpu"
      style={{
        '--x': '50%',
        '--y': '50%',
      } as React.CSSProperties}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-5 w-5 text-foreground" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: 180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -180 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-5 w-5 text-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}; 