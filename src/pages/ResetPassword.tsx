import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validatePassword, getPasswordStrength } from '@/lib/passwordValidation';
import { toast } from 'sonner';

export default function ResetPassword() {
    const navigate = useNavigate();
    const { updatePassword, session } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const passwordStrength = getPasswordStrength(password);

    useEffect(() => {
        // If no session (user didn't come from email link), redirect to auth
        if (!session) {
            const timeout = setTimeout(() => {
                if (!session) navigate('/auth');
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [session, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        const validation = validatePassword(password);
        if (!validation.isValid) {
            setError(validation.errors[0]);
            return;
        }

        setLoading(true);

        try {
            const { error } = await updatePassword(password);
            if (error) {
                setError('Erro ao atualizar senha. O link pode ter expirado.');
            } else {
                setIsSuccess(true);
                toast.success('Senha atualizada com sucesso!');
                setTimeout(() => navigate('/home'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-sm text-center">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-success" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Senha redefinida!</h2>
                    <p className="text-muted-foreground mb-8">
                        Sua senha foi atualizada com sucesso. Redirecionando para a tela inicial...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-foreground">Nova Senha</h1>
                        <p className="text-muted-foreground mt-2">Digite sua nova senha de acesso</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nova Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="h-12 pl-10 pr-10 rounded-xl"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        <div className={cn("h-1 flex-1 rounded", passwordStrength === 'weak' ? 'bg-destructive' : passwordStrength === 'medium' ? 'bg-warning' : 'bg-success')} />
                                        <div className={cn("h-1 flex-1 rounded", passwordStrength === 'medium' ? 'bg-warning' : passwordStrength === 'strong' ? 'bg-success' : 'bg-muted')} />
                                        <div className={cn("h-1 flex-1 rounded", passwordStrength === 'strong' ? 'bg-success' : 'bg-muted')} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••"
                                    className="h-12 pl-10 rounded-xl"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm text-center">{error}</div>}

                        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" disabled={loading}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Atualizar Senha'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
