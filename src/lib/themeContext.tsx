import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

// Create the theme context with a default value that will be overridden
const defaultContext: ThemeContextType = {
  theme: 'light',
  // We're providing a no-op function as the default value that will be overridden by the actual implementation
  // This is a common pattern when using React Context
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: () => {},
  isDark: false
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with the user's preferred theme or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    // Only use localStorage in a browser environment
    if (typeof window !== 'undefined') {
      // Check for saved theme preference in local storage
      const savedTheme = localStorage.getItem('rhyme-finder-theme');

      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme as Theme;
      }

      // Check for system preference if no saved preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }

    // Default to light
    return 'light';
  });

  // Add/remove dark class from the document element when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save the theme preference to local storage
    localStorage.setItem('rhyme-finder-theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Value object to be provided by the context
  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
