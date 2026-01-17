import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ChevronLeft, Globe, Shield, Cloud, Palette, Info, ChevronRight, LogOut, Loader2, User, FolderPlus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    navigate('/auth');
  };

  const handleLanguageChange = async (lang: string) => {
    await updateProfile({ language: lang });
    setShowLanguageDialog(false);
  };

  const handleThemeChange = async (theme: string) => {
    await updateProfile({ theme });
    setShowThemeDialog(false);
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

  const settingsItems = [
    {
      id: 'profile',
      icon: User,
      label: 'Meu Perfil',
      value: user?.email?.split('@')[0],
      onClick: () => navigate('/profile'),
    },
    {
      id: 'categories',
      icon: FolderPlus,
      label: 'Categorias de Documentos',
      onClick: () => navigate('/settings/categories'),
    },
    {
      id: 'quickaccess',
      icon: Star,
      label: 'Acesso Rápido',
      onClick: () => navigate('/settings/quick-access'),
    },
    {
      id: 'language',
      icon: Globe,
      label: 'Idioma',
      value: profile?.language === 'en' ? 'English' : 'Português',
      onClick: () => setShowLanguageDialog(true),
    },
    {
      id: 'theme',
      icon: Palette,
      label: 'Tema',
      value: profile?.theme === 'dark' ? 'Escuro' : 'Claro',
      onClick: () => setShowThemeDialog(true),
    },
    {
      id: 'about',
      icon: Info,
      label: 'Sobre o VOY',
      onClick: () => { },
    },
  ];

  return (
    <MobileLayout showNav={false}>
      <div className="px-5 py-6 safe-area-top">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        </div>

        {/* User Info */}
        <div className="mb-6 p-4 bg-card rounded-2xl border border-border">
          <p className="text-sm text-muted-foreground">Conectado como</p>
          <p className="font-semibold text-foreground">{user?.email}</p>
        </div>

        {/* Settings List */}
        <div className="space-y-2 mb-8">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border',
                  'hover:border-primary/30 transition-all animate-slide-up'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">{item.label}</p>
                </div>
                {item.value && (
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
            {loggingOut ? (
              <Loader2 className="w-5 h-5 text-destructive animate-spin" />
            ) : (
              <LogOut className="w-5 h-5 text-destructive" />
            )}
          </div>
          <span className="font-medium text-destructive">Sair da conta</span>
        </button>

        {/* Version */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">VOY v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">
            Feito com 💚 para imigrantes em Portugal
          </p>
        </div>
      </div>

      {/* Language Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Escolher idioma</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-4">
            <button
              onClick={() => handleLanguageChange('pt')}
              className={cn(
                'w-full p-4 rounded-xl border-2 text-left transition-all',
                profile?.language === 'pt'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <span className="font-medium">Português</span>
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={cn(
                'w-full p-4 rounded-xl border-2 text-left transition-all',
                profile?.language === 'en'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <span className="font-medium">English</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Theme Dialog */}
      <Dialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Escolher tema</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={cn(
                'w-full p-4 rounded-xl border-2 text-left transition-all',
                profile?.theme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <span className="font-medium">☀️ Claro</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={cn(
                'w-full p-4 rounded-xl border-2 text-left transition-all',
                profile?.theme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <span className="font-medium">🌙 Escuro</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
