import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';
import { logger } from '@/lib/logger';

interface ImportantDate {
  label: string;
  date: string;
}

interface AimaProcess {
  id: string;
  user_id: string;
  process_type: string | null;
  completed_steps: string[];
  important_dates: ImportantDate[];
  protocols: string[];
  notes: string | null;
  step: number;
  created_at: string;
  updated_at: string;
}

export function useAimaProcess() {
  const { user } = useAuth();
  const [process, setProcess] = useState<AimaProcess | null>(null);
  const [loading, setLoading] = useState(true);

  const parseImportantDates = (data: Json | null): ImportantDate[] => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => {
      if (typeof item === 'object' && item !== null && 'label' in item && 'date' in item) {
        return { label: String(item.label), date: String(item.date) };
      }
      return { label: '', date: '' };
    }).filter(d => d.label && d.date);
  };

  const fetchProcess = useCallback(async () => {
    if (!user) {
      setProcess(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('aima_processes')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProcess({
          ...data,
          completed_steps: data.completed_steps || [],
          important_dates: parseImportantDates(data.important_dates),
          protocols: data.protocols || [],
          step: (data.completed_steps?.length || 0) + 1,
        });
      } else {
        setProcess(null);
      }
    } catch (error) {
      logger.error('Error fetching AIMA process');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProcess();
  }, [fetchProcess]);

  // Helper to calculate step locally for optimistic updates
  const calculateStep = (completedHelper: string[]) => (completedHelper?.length || 0) + 1;

  const createOrUpdateProcess = async (updates: {
    process_type?: string | null;
    completed_steps?: string[];
    important_dates?: ImportantDate[];
    protocols?: string[];
    notes?: string | null;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const dbUpdates = {
        process_type: updates.process_type,
        completed_steps: updates.completed_steps,
        important_dates: updates.important_dates as unknown as Json,
        protocols: updates.protocols,
        notes: updates.notes,
      };

      // Remove undefined values
      Object.keys(dbUpdates).forEach(key => {
        if (dbUpdates[key as keyof typeof dbUpdates] === undefined) {
          delete dbUpdates[key as keyof typeof dbUpdates];
        }
      });

      if (process) {
        // Update existing
        const { error } = await supabase
          .from('aima_processes')
          .update(dbUpdates)
          .eq('user_id', user.id);

        if (error) throw error;

        setProcess(prev => prev ? {
          ...prev,
          ...updates,
          important_dates: updates.important_dates || prev.important_dates,
          step: calculateStep(updates.completed_steps || prev.completed_steps),
        } : null);
      } else {
        // Create new
        const { data, error } = await supabase
          .from('aima_processes')
          .insert({
            user_id: user.id,
            process_type: updates.process_type || null,
            completed_steps: updates.completed_steps || [],
            important_dates: (updates.important_dates || []) as unknown as Json,
            protocols: updates.protocols || [],
            notes: updates.notes || null,
          })
          .select()
          .single();

        if (error) throw error;

        setProcess({
          ...data,
          completed_steps: data.completed_steps || [],
          important_dates: parseImportantDates(data.important_dates),
          protocols: data.protocols || [],
          step: calculateStep(data.completed_steps || []),
        });
      }

      toast({
        title: "Informações salvas!",
        description: "Seu processo foi atualizado com sucesso.",
      });

      return { error: null };
    } catch (error) {
      logger.error('Error updating AIMA process');
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Tente novamente.",
      });
      return { error };
    }
  };

  const selectProcessType = async (type: string) => {
    return createOrUpdateProcess({
      process_type: type,
      completed_steps: [],
      important_dates: [],
      protocols: [],
    });
  };

  const toggleStep = async (stepId: string) => {
    if (!process) return { error: new Error('No process found') };

    const currentSteps = process.completed_steps || [];
    const newSteps = currentSteps.includes(stepId)
      ? currentSteps.filter(s => s !== stepId)
      : [...currentSteps, stepId];

    return createOrUpdateProcess({ completed_steps: newSteps });
  };

  const addDate = async (date: ImportantDate) => {
    if (!process) return { error: new Error('No process found') };

    const newDates = [...(process.important_dates || []), date];
    return createOrUpdateProcess({ important_dates: newDates });
  };

  const addProtocol = async (protocol: string) => {
    if (!process) return { error: new Error('No process found') };

    const newProtocols = [...(process.protocols || []), protocol];
    return createOrUpdateProcess({ protocols: newProtocols });
  };

  const clearProcess = async () => {
    return createOrUpdateProcess({
      process_type: null,
      completed_steps: [],
      important_dates: [],
      protocols: [],
    });
  };

  return {
    process,
    loading,
    selectProcessType,
    toggleStep,
    addDate,
    addProtocol,
    clearProcess,
    updateProcess: createOrUpdateProcess,
    refetch: fetchProcess,
  };
}
