import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Star, FileText, Loader2, Check, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuments } from '@/hooks/useDocuments';
import { useQuickAccess } from '@/hooks/useQuickAccess';
import { useProfile } from '@/hooks/useProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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

  const { profile, updateProfile } = useProfile();
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [newBlockLabel, setNewBlockLabel] = useState('');
  const [newBlockValue, setNewBlockValue] = useState('');

  const customBlocks = profile?.custom_quick_access || [];

  const handleAddBlock = async () => {
    if (!newBlockLabel.trim()) return;
    const updatedBlocks = [...customBlocks, { label: newBlockLabel, value: newBlockValue, id: Date.now().toString() }];
    await updateProfile({ custom_quick_access: updatedBlocks });
    setShowAddBlock(false);
    setNewBlockLabel('');
    setNewBlockValue('');
  };

  const handleDeleteBlock = async (id: string) => {
    const updatedBlocks = customBlocks.filter((b) => b.id !== id);
    await updateProfile({ custom_quick_access: updatedBlocks });
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
            <p className="text-sm text-muted-foreground">Configurar blocos e documentos</p>
          </div>
        </div>

        {/* Custom Blocks Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Meus Blocos</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowAddBlock(true)} className="text-primary h-8 gap-1">
              <Plus className="w-4 h-4" /> Novo Bloco
            </Button>
          </div>

          <div className="space-y-2">
            {customBlocks.length === 0 ? (
              <p className="text-xs text-muted-foreground italic px-2">Nenhum bloco personalizado criado.</p>
            ) : (
              customBlocks.map((block) => (
                <div key={block.id} className="flex items-center gap-3 p-4 bg-card border rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{block.label}</p>
                    <p className="text-xs text-muted-foreground">{block.value || 'Toque para adicionar'}</p>
                  </div>
                  <button onClick={() => handleDeleteBlock(block.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 bg-info/10 border border-info/20 rounded-2xl">
          <div className="flex gap-3">
            <Star className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Documentos favoritos</p>
              <p className="text-xs text-muted-foreground mt-1">
                Selecione os documentos da sua lista para acesso rápido.
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
        <Button
          onClick={handleSave}
          className="w-full h-12 rounded-xl"
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            `Salvar Documentos (${selectedIds.length})`
          )}
        </Button>
      </div>

      {/* Add Block Dialog */}
      <Dialog open={showAddBlock} onOpenChange={setShowAddBlock}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Novo Bloco de Acesso Rápido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome do Bloco (ex: NIF, NISS)</Label>
              <Input value={newBlockLabel} onChange={(e) => setNewBlockLabel(e.target.value)} placeholder="Ex: NIF" className="rounded-xl h-12" />
            </div>
            <div className="space-y-2">
              <Label>Número (Opcional)</Label>
              <Input value={newBlockValue} onChange={(e) => setNewBlockValue(e.target.value)} placeholder="Digite o número" className="rounded-xl h-12" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAddBlock(false)} className="flex-1 h-12 rounded-xl">Cancelar</Button>
              <Button onClick={handleAddBlock} disabled={!newBlockLabel.trim()} className="flex-1 h-12 rounded-xl">Criar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
