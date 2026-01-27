import { Home, FileText, Globe, StickyNote, MessageCircle, Wallet, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/home', icon: Home, labelKey: 'nav.home', label: 'Início' },
  { path: '/documents', icon: FileText, labelKey: 'nav.documents', label: 'Docs' },
  { path: '/community', icon: Heart, labelKey: 'nav.community', label: 'Mural' },
  { path: '/aima', icon: Globe, labelKey: 'nav.aima', label: 'AIMA' },
  { path: '/meu-bolso', icon: Wallet, labelKey: 'nav.meuBolso', label: 'Bolso' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom pb-2">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          // Fallback verify: if translation seems wrong (too long), use default
          const translated = t(item.labelKey);
          const label = translated.length > 15 ? item.label : translated;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center min-w-[64px] py-1 px-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 mb-1 transition-transform duration-200',
                  isActive && 'scale-110'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                'text-[10px] font-medium leading-none',
                isActive && 'font-black'
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
