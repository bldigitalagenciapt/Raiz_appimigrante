import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ChevronLeft, Plus, Pencil, Trash2, FileText, Briefcase, Heart, Home as HomeIcon, Loader2, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';

// Default categories that can't be deleted
const defaultCategories = [
  { id: 'immigration', icon: FileText, label: 'Imigração', color: 'bg-primary/15 text-primary', isDefault: true },
  { id: 'work', icon: Briefcase, label: 'Trabalho', color: 'bg-info/15 text-info', isDefault: true },
  { id: 'health', icon: Heart, label: 'Saúde', color: 'bg-success/15 text-success', isDefault: true },
  { id: 'housing', icon: HomeIcon, label: 'Moradia', color: 'bg-warning/15 text-warning', isDefault: true },
];

export default function DocumentCategories() {
  const navigate = useNavigate();
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!categoryName.trim()) return;
    setSaving(true);
    
    await addCategory(categoryName);
    setCategoryName('');
    setShowAddDialog(false);
    setSaving(false);
  };

  const handleEdit = async () => {
    if (!categoryName.trim() || !showEditDialog) return;
    setSaving(true);
    
    await updateCategory(showEditDialog, categoryName);
    setCategoryName('');
    setShowEditDialog(null);
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    
    await deleteCategory(deleteId);
    setDeleteId(null);
    setSaving(false);
  };

  const openEditDialog = (category: { id: string; label: string }) => {
    setCategoryName(category.label);
    setShowEditDialog(category.id);
  };

  if (loading) {
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
            <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas categorias de documentos</p>
          </div>
          <Button
            onClick={() => {
              setCategoryName('');
              setShowAddDialog(true);
            }}
            size="sm"
            className="rounded-xl gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova
          </Button>
        </div>

        {/* Default Categories */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Categorias padrão
          </h2>
          <div className="space-y-2">
            {defaultCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', cat.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium flex-1">{cat.label}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    Padrão
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Categories */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Categorias personalizadas
          </h2>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Você ainda não criou categorias personalizadas
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium flex-1">{cat.label}</span>
                  <button
                    onClick={() => openEditDialog(cat)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="catName">Nome da categoria</Label>
              <Input
                id="catName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Ex: Educação, Finanças..."
                className="h-12 rounded-xl"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1 h-12 rounded-xl"
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAdd}
                className="flex-1 h-12 rounded-xl"
                disabled={!categoryName.trim() || saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!showEditDialog} onOpenChange={() => setShowEditDialog(null)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Editar categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="editCatName">Nome da categoria</Label>
              <Input
                id="editCatName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Nome da categoria"
                className="h-12 rounded-xl"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(null)}
                className="flex-1 h-12 rounded-xl"
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEdit}
                className="flex-1 h-12 rounded-xl"
                disabled={!categoryName.trim() || saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Os documentos desta categoria não serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
}
