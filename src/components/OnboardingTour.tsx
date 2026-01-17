import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useProfile } from '@/hooks/useProfile';

export function OnboardingTour() {
    const { profile } = useProfile();
    const [hasSeenTour, setHasSeenTour] = useState(false);

    useEffect(() => {
        // Only run if profile loaded, is a valid user, and hasn't seen tour
        if (profile && !hasSeenTour && !localStorage.getItem('hasSeenTour')) {
            const driverObj = driver({
                showProgress: true,
                animate: true,
                steps: [
                    {
                        element: '.text-2xl.font-bold',
                        popover: {
                            title: 'Bem-vindo ao VOY!',
                            description: 'Este é seu espaço para organizar sua vida em Portugal.',
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: '.overflow-x-auto',
                        popover: {
                            title: 'Acesso Rápido',
                            description: 'Guarde aqui seus números importantes como NIF, NISS e SNS para ter sempre à mão.',
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: '[href="/documents"]',
                        popover: {
                            title: 'Seus Documentos',
                            description: 'Organize todos os seus documentos por categorias e tenha backup seguro.',
                            side: "top",
                            align: 'start'
                        }
                    },
                    {
                        element: '[href="/aima"]',
                        popover: {
                            title: 'Processo AIMA',
                            description: 'Acompanhe o status do seu processo de imigração e veja os próximos passos.',
                            side: "top",
                            align: 'start'
                        }
                    },
                    {
                        element: '[href="/assistant"]',
                        popover: {
                            title: 'Assistente e Ajuda',
                            description: 'Tire suas dúvidas sobre documentação e processos a qualquer momento.',
                            side: "top",
                            align: 'start'
                        }
                    }
                ],
                onDestroyStarted: () => {
                    localStorage.setItem('hasSeenTour', 'true');
                    setHasSeenTour(true);
                    driverObj.destroy();
                },
            });

            driverObj.drive();
        }
    }, [profile, hasSeenTour]);

    return null;
}
