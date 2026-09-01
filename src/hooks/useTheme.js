import { useState, useEffect, useRef } from 'react';

function readStoredTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // localStorage unavailable (private browsing, blocked storage, etc.)
  }
  return 'dark';
}

export default function useTheme() {
  const [theme, setTheme] = useState(readStoredTheme);

  const isFirstRun = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Ignore write failures; theme still applies for this session.
    }

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return undefined;
    }

    root.classList.add('theme-transition');
    const timeoutId = window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
