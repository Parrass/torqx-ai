
import { OnboardingTask } from '@/types/onboarding';

export const DEFAULT_ONBOARDING_TASKS: OnboardingTask[] = [
  {
    id: 'complete-workshop-info',
    title: 'Complete informações da oficina',
    description: 'Adicione logo, horários e dados de contato',
    action: '/workshop-settings',
    isCompleted: false,
    category: 'setup',
    reward: '🏢 Oficina Configurada'
  },
  {
    id: 'add-first-customer',
    title: 'Cadastre seu primeiro cliente',
    description: 'Adicione um cliente para começar',
    action: '/customers',
    isCompleted: false,
    category: 'first-use',
    reward: '👤 Primeiro Cliente'
  },
  {
    id: 'create-first-os',
    title: 'Crie sua primeira OS',
    description: 'Abra uma ordem de serviço',
    action: '/service-orders',
    isCompleted: false,
    category: 'first-use',
    reward: '🔧 Primeira OS'
  },
  {
    id: 'explore-reports',
    title: 'Explore os relatórios',
    description: 'Veja insights sobre seu negócio',
    action: '/reports',
    isCompleted: false,
    category: 'learning',
    reward: '📊 Analista'
  }
];
