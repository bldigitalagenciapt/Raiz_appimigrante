import { useEffect, ReactNode } from 'react';
import { useProfile } from '@/hooks/useProfile';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (loading) return;

    const theme = profile?.theme || 'light';
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [profile?.theme, loading]);

  return <>{children}</>;
}
