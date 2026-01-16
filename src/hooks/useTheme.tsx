import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';

export function useTheme() {
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

  return { theme: profile?.theme || 'light' };
}
