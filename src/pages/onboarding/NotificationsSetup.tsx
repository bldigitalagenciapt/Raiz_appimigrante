import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export default function NotificationsSetup() {
  const navigate = useNavigate();
  const { t } = useApp();

  const handleAllow = () => {
    // In a real app, request notification permissions here
    navigate('/onboarding/biometric');
  };

  const handleSkip = () => {
    navigate('/onboarding/biometric');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto text-center">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 animate-scale-in">
          <Bell className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
          {t('notifications.title')}
        </h1>
        
        <p className="text-muted-foreground text-balance animate-fade-in" style={{ animationDelay: '200ms' }}>
          {t('notifications.desc')}
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-3 mt-8">
        <Button
          onClick={handleAllow}
          className="w-full h-14 text-lg font-semibold rounded-2xl btn-primary-elevated"
          size="lg"
        >
          {t('notifications.allow')}
        </Button>
        <Button
          onClick={handleSkip}
          variant="ghost"
          className="w-full h-14 text-lg font-medium rounded-2xl text-muted-foreground"
          size="lg"
        >
          {t('notifications.skip')}
        </Button>
      </div>
    </div>
  );
}
