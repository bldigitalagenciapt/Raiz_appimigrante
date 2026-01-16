import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  category: string | null;
  is_important: boolean;
  reminder_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('is_important', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      logger.error('Error fetching notes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (note: {
    title: string;
    content?: string;
    category?: string;
    is_important?: boolean;
    reminder_date?: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: note.title,
          content: note.content || null,
          category: note.category || null,
          is_important: note.is_important || false,
          reminder_date: note.reminder_date || null,
        })
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      
      toast({
        title: "Anotação salva!",
        description: "Sua nota foi criada com sucesso.",
      });

      return { error: null, data };
    } catch (error) {
      logger.error('Error adding note');
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Tente novamente.",
      });
      return { error };
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => 
        prev.map(note => note.id === id ? { ...note, ...updates } : note)
      );
      
      toast({
        title: "Anotação atualizada!",
        description: "As alterações foram salvas.",
      });

      return { error: null };
    } catch (error) {
      logger.error('Error updating note');
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Tente novamente.",
      });
      return { error };
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== id));
      
      toast({
        title: "Anotação excluída",
        description: "A nota foi removida.",
      });

      return { error: null };
    } catch (error) {
      logger.error('Error deleting note');
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Tente novamente.",
      });
      return { error };
    }
  };

  const toggleImportant = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      return updateNote(id, { is_important: !note.is_important });
    }
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    toggleImportant,
    refetch: fetchNotes,
  };
}
