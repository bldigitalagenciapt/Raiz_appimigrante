import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'warning' | 'success';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/5 border-primary/20',
  warning: 'bg-warning/10 border-warning/30',
  success: 'bg-success/10 border-success/30',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/15 text-primary',
  warning: 'bg-warning/20 text-warning',
  success: 'bg-success/20 text-success',
};

export function ActionCard({
  icon,
  title,
  description,
  onClick,
  variant = 'default',
  className,
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300',
        'glass-card-hover',
        variantStyles[variant],
        className
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
        iconStyles[variant]
      )}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
