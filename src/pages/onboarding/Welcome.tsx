import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto text-center animate-fade-in">
        {/* Logo */}
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8">
          <Leaf className="w-12 h-12 text-primary" />
        </div>
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
          Raiz
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-muted-foreground text-balance leading-relaxed">
          {t('welcome.subtitle')}
        </p>
      </div>

      {/* CTA Button */}
      <div className="w-full max-w-sm mt-auto">
        <Button
          onClick={() => navigate('/onboarding/language')}
          className="w-full h-14 text-lg font-semibold rounded-2xl btn-primary-elevated"
          size="lg"
        >
          {t('welcome.start')}
        </Button>
      </div>
    </div>
  );
}
