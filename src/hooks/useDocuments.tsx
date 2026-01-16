import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Document {
  id: string;
  user_id: string;
  name: string;
  category: string;
  file_url: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      logger.error('Error fetching documents');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const addDocument = async (name: string, category: string, file?: File) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      let fileUrl = null;
      let fileType = null;

      if (file) {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        // Determine content type - use file.type or infer from extension
        let contentType = file.type;
        if (!contentType || contentType === 'application/octet-stream') {
          const mimeTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'webp': 'image/webp',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          };
          contentType = mimeTypes[fileExt] || 'application/octet-stream';
        }
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file, {
            contentType,
            upsert: false,
          });

        if (uploadError) {
          logger.error('Storage upload failed');
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
        fileType = contentType;
      }

      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name,
          category,
          file_url: fileUrl,
          file_type: fileType,
        })
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => [data, ...prev]);
      
      toast({
        title: "Documento salvo!",
        description: "Seu documento foi adicionado com sucesso.",
      });

      return { error: null, data };
    } catch (error) {
      logger.error('Error adding document');
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível fazer upload. Verifique sua conexão.",
      });
      return { error };
    }
  };

  const updateDocument = async (id: string, updates: { name?: string; category?: string }) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setDocuments(prev => 
        prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc)
      );
      
      toast({
        title: "Documento atualizado!",
        description: "As alterações foram salvas.",
      });

      return { error: null };
    } catch (error) {
      logger.error('Error updating document');
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Tente novamente.",
      });
      return { error };
    }
  };

  const deleteDocument = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      toast({
        title: "Documento excluído",
        description: "O documento foi removido.",
      });

      return { error: null };
    } catch (error) {
      logger.error('Error deleting document');
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Tente novamente.",
      });
      return { error };
    }
  };

  return {
    documents,
    loading,
    addDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments,
  };
}
