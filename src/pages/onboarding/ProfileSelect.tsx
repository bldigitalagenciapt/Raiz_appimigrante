import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Plane, Home, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const profiles = [
  {
    id: 'recent' as const,
    icon: Plane,
    labelKey: 'profile.recent',
    descKey: 'profile.recent.desc',
  },
  {
    id: 'resident' as const,
    icon: Home,
    labelKey: 'profile.resident',
    descKey: 'profile.resident.desc',
  },
  {
    id: 'legalizing' as const,
    icon: Clock,
    labelKey: 'profile.legalizing',
    descKey: 'profile.legalizing.desc',
  },
];

export default function ProfileSelect() {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, t } = useApp();
  const { updateProfile, loading } = useProfile();

  const handleContinue = async () => {
    if (userProfile) {
      await updateProfile({ user_profile: userProfile });
    }
    navigate('/onboarding/notifications');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12">
      <div className="flex-1 max-w-sm mx-auto w-full">
        <h1 className="text-2xl font-bold text-foreground mb-2 animate-fade-in">
          {t('profile.select')}
        </h1>
        <p className="text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Isso nos ajuda a personalizar sua experiência.
        </p>

        <div className="space-y-3">
          {profiles.map((profile, index) => {
            const Icon = profile.icon;
            const isSelected = userProfile === profile.id;

            return (
              <button
                key={profile.id}
                onClick={() => setUserProfile(profile.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 animate-slide-up',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50'
                )}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  isSelected ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-lg">{t(profile.labelKey)}</p>
                  <p className="text-sm text-muted-foreground">{t(profile.descKey)}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto mt-8">
        <Button
          onClick={handleContinue}
          disabled={!userProfile}
          className="w-full h-14 text-lg font-semibold rounded-2xl btn-primary-elevated disabled:opacity-50"
          size="lg"
        >
          {t('continue')}
        </Button>
      </div>
    </div>
  );
}
