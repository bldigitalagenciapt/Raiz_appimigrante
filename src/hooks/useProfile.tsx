import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Profile {
  id: string;
  user_id: string;
  language: string;
  user_profile: string | null;
  nif: string | null;
  niss: string | null;
  sns: string | null;
  passport: string | null;
  notifications_enabled: boolean;
  biometric_enabled: boolean;
  theme: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      logger.error('Error fetching profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Salvo com sucesso!",
        description: "Suas informações foram atualizadas.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Tente novamente.",
      });
      return { error };
    }
  };

  const updateNumber = async (field: 'nif' | 'niss' | 'sns' | 'passport', value: string) => {
    return updateProfile({ [field]: value });
  };

  return {
    profile,
    loading,
    updateProfile,
    updateNumber,
    refetch: fetchProfile,
  };
}
