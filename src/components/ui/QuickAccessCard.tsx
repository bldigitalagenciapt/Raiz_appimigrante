import { cn } from '@/lib/utils';

interface QuickAccessCardProps {
  label: string;
  value?: string;
  placeholder: string;
  onClick?: () => void;
  className?: string;
}

export function QuickAccessCard({
  label,
  value,
  placeholder,
  onClick,
  className,
}: QuickAccessCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center p-4 rounded-2xl',
        'bg-card border border-border',
        'hover:shadow-md hover:border-primary/30 active:scale-[0.98]',
        'transition-all duration-200 min-w-[100px]',
        className
      )}
    >
      <span className="text-xs font-medium text-muted-foreground mb-1">
        {label}
      </span>
      {value ? (
        <span className="text-lg font-bold text-foreground tracking-wide">
          {value}
        </span>
      ) : (
        <span className="text-sm text-primary font-medium">
          {placeholder}
        </span>
      )}
    </button>
  );
}
