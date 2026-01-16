import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface CustomCategory {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('custom_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      logger.error('Error fetching categories');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (label: string): Promise<{ data?: CustomCategory; error?: Error }> => {
    if (!user) return { error: new Error('No user') };

    try {
      const { data, error } = await supabase
        .from('custom_categories')
        .insert({
          user_id: user.id,
          label: label.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      toast({
        title: "Categoria criada!",
        description: `A categoria "${label}" foi adicionada.`,
      });
      return { data };
    } catch (error) {
      logger.error('Error adding category');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar a categoria.",
      });
      return { error: error as Error };
    }
  };

  const updateCategory = async (id: string, label: string): Promise<{ error?: Error }> => {
    if (!user) return { error: new Error('No user') };

    try {
      const { error } = await supabase
        .from('custom_categories')
        .update({ label: label.trim() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, label: label.trim() } : cat
      ));
      toast({
        title: "Categoria atualizada!",
      });
      return {};
    } catch (error) {
      logger.error('Error updating category');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar a categoria.",
      });
      return { error: error as Error };
    }
  };

  const deleteCategory = async (id: string): Promise<{ error?: Error }> => {
    if (!user) return { error: new Error('No user') };

    try {
      const { error } = await supabase
        .from('custom_categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast({
        title: "Categoria excluída",
      });
      return {};
    } catch (error) {
      logger.error('Error deleting category');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a categoria.",
      });
      return { error: error as Error };
    }
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
