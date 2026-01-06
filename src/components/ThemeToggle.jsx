import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // ✅ default dark

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);

    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'fixed max-sm:hidden top-5 right-5 z-50 p-2 rounded-full transition-colors duration-300',
        'focus:outline-hidden'
      )}
    >
      {isDarkMode ? (
        <Sun className="h-6 w-6 text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-blue-900 " />
      )}
    </button>
  );
};
