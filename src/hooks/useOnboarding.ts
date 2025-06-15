
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingStep, OnboardingProgress, OnboardingTask } from '@/types/onboarding';

export const useOnboarding = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const steps: OnboardingStep[] = [
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

  const defaultTasks: OnboardingTask[] = [
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

  useEffect(() => {
    if (user) {
      loadOnboardingProgress();
    }
  }, [user]);

  const loadOnboardingProgress = () => {
    setIsLoading(true);
    
    // Simular carregamento do localStorage por enquanto
    const savedProgress = localStorage.getItem(`onboarding_${user?.id}`);
    const savedTasks = localStorage.getItem(`onboarding_tasks_${user?.id}`);
    
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setProgress(progress);
      
      const current = steps.find(step => step.id === progress.currentStep);
      setCurrentStep(current || steps[0]);
    } else {
      // Criar novo progresso
      const newProgress: OnboardingProgress = {
        userId: user?.id || '',
        tenantId: user?.user_metadata?.tenant_id || '',
        currentStep: steps[0].id,
        completedSteps: [],
        startedAt: new Date().toISOString(),
        isCompleted: false,
        progress: 0
      };
      setProgress(newProgress);
      setCurrentStep(steps[0]);
      saveProgress(newProgress);
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(defaultTasks);
      saveTasks(defaultTasks);
    }

    setIsLoading(false);
  };

  const saveProgress = (newProgress: OnboardingProgress) => {
    localStorage.setItem(`onboarding_${user?.id}`, JSON.stringify(newProgress));
    setProgress(newProgress);
  };

  const saveTasks = (newTasks: OnboardingTask[]) => {
    localStorage.setItem(`onboarding_tasks_${user?.id}`, JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const completeStep = (stepId: string) => {
    if (!progress) return;

    const updatedProgress = {
      ...progress,
      completedSteps: [...progress.completedSteps, stepId],
      progress: Math.round(((progress.completedSteps.length + 1) / steps.length) * 100)
    };

    // Mover para próximo step
    const currentIndex = steps.findIndex(s => s.id === stepId);
    const nextStep = steps[currentIndex + 1];
    
    if (nextStep) {
      updatedProgress.currentStep = nextStep.id;
      setCurrentStep(nextStep);
    } else {
      updatedProgress.isCompleted = true;
      updatedProgress.completedAt = new Date().toISOString();
    }

    saveProgress(updatedProgress);
  };

  const completeTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, isCompleted: true } : task
    );
    saveTasks(updatedTasks);
  };

  const skipStep = (stepId: string) => {
    if (!progress) return;

    const currentIndex = steps.findIndex(s => s.id === stepId);
    const nextStep = steps[currentIndex + 1];
    
    if (nextStep) {
      const updatedProgress = {
        ...progress,
        currentStep: nextStep.id
      };
      saveProgress(updatedProgress);
      setCurrentStep(nextStep);
    }
  };

  const goToStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && progress) {
      const updatedProgress = {
        ...progress,
        currentStep: stepId
      };
      saveProgress(updatedProgress);
      setCurrentStep(step);
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem(`onboarding_${user?.id}`);
    localStorage.removeItem(`onboarding_tasks_${user?.id}`);
    loadOnboardingProgress();
  };

  return {
    progress,
    currentStep,
    steps,
    tasks,
    isLoading,
    completeStep,
    completeTask,
    skipStep,
    goToStep,
    resetOnboarding
  };
};
