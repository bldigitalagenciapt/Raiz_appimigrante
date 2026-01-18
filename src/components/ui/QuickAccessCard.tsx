import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAccessCardProps {
  label: string;
  value?: string;
  placeholder: string;
  onClick?: () => void;
  className?: string;
  isSecure?: boolean;
}

export function QuickAccessCard({
  label,
  value,
  placeholder,
  onClick,
  className,
  isSecure = false,
}: QuickAccessCardProps) {
  const [isVisible, setIsVisible] = useState(!isSecure);

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  const displayValue = isVisible ? value : '••••••••';

  return (
    <div className="relative group min-w-[120px]">
      <button
        onClick={onClick}
        className={cn(
          'w-full flex flex-col items-center justify-center p-4 rounded-2xl',
          'bg-[#F8FAFC] border border-slate-200 shadow-sm',
          'hover:shadow-md hover:border-primary/30 active:scale-[0.98]',
          'transition-all duration-200',
          className
        )}
      >
        <span className="text-xs font-medium text-muted-foreground mb-1">
          {label}
        </span>
        {value ? (
          <span className="text-lg font-bold text-foreground tracking-wide">
            {displayValue}
          </span>
        ) : (
          <span className="text-sm text-primary font-medium">
            {placeholder}
          </span>
        )}
      </button>

      {isSecure && value && (
        <button
          onClick={toggleVisibility}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/50 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isVisible ? (
            <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      )}
    </div>
  );
}
