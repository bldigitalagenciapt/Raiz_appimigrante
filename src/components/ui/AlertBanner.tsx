import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  message: string;
  action?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  variant?: 'warning' | 'info' | 'success';
  className?: string;
}

const variantStyles = {
  warning: 'bg-warning/15 border-warning/30 text-warning-foreground',
  info: 'bg-info/15 border-info/30 text-info-foreground',
  success: 'bg-success/15 border-success/30 text-success-foreground',
};

const iconColors = {
  warning: 'text-warning',
  info: 'text-info',
  success: 'text-success',
};

export function AlertBanner({
  message,
  action,
  onAction,
  onDismiss,
  variant = 'warning',
  className,
}: AlertBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-2xl border',
        variantStyles[variant],
        className
      )}
    >
      <AlertTriangle className={cn('w-5 h-5 flex-shrink-0', iconColors[variant])} />
      <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          {action}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
