
import { OnboardingStep } from '@/types/onboarding';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Torqx',
    description: 'Conheça a plataforma e seus benefícios',
    component: 'WelcomeStep',
    isCompleted: false,
    isOptional: false,
    order: 1
  },
  {
    id: 'workshop-setup',
    title: 'Configurar Oficina',
    description: 'Complete as informações da sua oficina',
    component: 'WorkshopSetupStep',
    isCompleted: false,
    isOptional: false,
    order: 2
  },
  {
    id: 'team-setup',
    title: 'Configurar Equipe',
    description: 'Adicione usuários e defina permissões',
    component: 'TeamSetupStep',
    isCompleted: false,
    isOptional: true,
    order: 3
  },
  {
    id: 'first-customer',
    title: 'Primeiro Cliente',
    description: 'Cadastre seu primeiro cliente',
    component: 'FirstCustomerStep',
    isCompleted: false,
    isOptional: false,
    order: 4
  },
  {
    id: 'first-vehicle',
    title: 'Primeiro Veículo',
    description: 'Cadastre o primeiro veículo',
    component: 'FirstVehicleStep',
    isCompleted: false,
    isOptional: false,
    order: 5
  },
  {
    id: 'first-service-order',
    title: 'Primeira OS',
    description: 'Crie sua primeira ordem de serviço',
    component: 'FirstServiceOrderStep',
    isCompleted: false,
    isOptional: false,
    order: 6
  },
  {
    id: 'tour',
    title: 'Tour da Plataforma',
    description: 'Conheça todas as funcionalidades',
    component: 'PlatformTourStep',
    isCompleted: false,
    isOptional: true,
    order: 7
  }
];
