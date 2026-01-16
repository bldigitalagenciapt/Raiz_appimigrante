import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export function useQuickAccess() {
  const { user } = useAuth();
  const [quickAccessIds, setQuickAccessIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuickAccess = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('quick_access_documents')
        .select('document_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setQuickAccessIds(data?.map(item => item.document_id) || []);
    } catch (error) {
      logger.error('Error fetching quick access');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQuickAccess();
  }, [fetchQuickAccess]);

  const toggleQuickAccess = async (documentId: string): Promise<{ error?: Error }> => {
    if (!user) return { error: new Error('No user') };

    const isCurrentlySelected = quickAccessIds.includes(documentId);

    try {
      if (isCurrentlySelected) {
        // Remove from quick access
        const { error } = await supabase
          .from('quick_access_documents')
          .delete()
          .eq('user_id', user.id)
          .eq('document_id', documentId);

        if (error) throw error;
        setQuickAccessIds(prev => prev.filter(id => id !== documentId));
      } else {
        // Add to quick access
        const { error } = await supabase
          .from('quick_access_documents')
          .insert({
            user_id: user.id,
            document_id: documentId,
          });

        if (error) throw error;
        setQuickAccessIds(prev => [...prev, documentId]);
      }
      return {};
    } catch (error) {
      logger.error('Error toggling quick access');
      return { error: error as Error };
    }
  };

  const saveQuickAccess = async (documentIds: string[]): Promise<{ error?: Error }> => {
    if (!user) return { error: new Error('No user') };

    try {
      // Delete all current quick access entries
      await supabase
        .from('quick_access_documents')
        .delete()
        .eq('user_id', user.id);

      // Insert new ones if any
      if (documentIds.length > 0) {
        const { error } = await supabase
          .from('quick_access_documents')
          .insert(
            documentIds.map(docId => ({
              user_id: user.id,
              document_id: docId,
            }))
          );

        if (error) throw error;
      }

      setQuickAccessIds(documentIds);
      toast({
        title: "Salvo!",
        description: "Seus documentos de acesso rápido foram atualizados.",
      });
      return {};
    } catch (error) {
      logger.error('Error saving quick access');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar.",
      });
      return { error: error as Error };
    }
  };

  return {
    quickAccessIds,
    loading,
    toggleQuickAccess,
    saveQuickAccess,
    refetch: fetchQuickAccess,
  };
}
