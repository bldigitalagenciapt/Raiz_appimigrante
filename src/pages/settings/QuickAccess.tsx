import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Star, FileText, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuments } from '@/hooks/useDocuments';
import { useQuickAccess } from '@/hooks/useQuickAccess';

export default function QuickAccess() {
  const navigate = useNavigate();
  const { documents, loading: docsLoading } = useDocuments();
  const { quickAccessIds, loading: qaLoading, saveQuickAccess } = useQuickAccess();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Sync selected IDs with fetched quick access IDs
  useEffect(() => {
    if (!qaLoading) {
      setSelectedIds(quickAccessIds);
    }
  }, [quickAccessIds, qaLoading]);

  const toggleDocument = (docId: string) => {
    setSelectedIds(prev => 
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await saveQuickAccess(selectedIds);
    setSaving(false);
    navigate(-1);
  };

  if (docsLoading || qaLoading) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showNav={false}>
      <div className="px-5 py-6 safe-area-top">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Acesso Rápido</h1>
            <p className="text-sm text-muted-foreground">Escolha documentos favoritos</p>
          </div>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 bg-info/10 border border-info/20 rounded-2xl">
          <div className="flex gap-3">
            <Star className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Documentos favoritos</p>
              <p className="text-xs text-muted-foreground mt-1">
                Selecione os documentos que você quer acessar rapidamente na tela inicial.
              </p>
            </div>
          </div>
        </div>

        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Nenhum documento</h3>
            <p className="text-sm text-muted-foreground">
              Adicione documentos primeiro para selecionar favoritos.
            </p>
          </div>
        ) : (
          <div className="space-y-2 mb-6">
            {documents.map((doc) => {
              const isSelected = selectedIds.includes(doc.id);
              
              return (
                <button
                  key={doc.id}
                  onClick={() => toggleDocument(doc.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all',
                    isSelected
                      ? 'bg-primary/5 border-primary'
                      : 'bg-card border-border hover:border-primary/30'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    isSelected ? 'bg-primary/15' : 'bg-muted'
                  )}>
                    <FileText className={cn(
                      'w-5 h-5',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{doc.category}</p>
                  </div>
                  <div className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground'
                  )}>
                    {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Save Button */}
        {documents.length > 0 && (
          <Button
            onClick={handleSave}
            className="w-full h-12 rounded-xl"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              `Salvar (${selectedIds.length} selecionados)`
            )}
          </Button>
        )}
      </div>
    </MobileLayout>
  );
}
