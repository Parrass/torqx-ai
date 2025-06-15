
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

  const loadOnboardingProgress = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Buscar progresso do onboarding
      const { data: progressData, error: progressError } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error loading onboarding progress:', progressError);
        return;
      }

      // Buscar tarefas do onboarding
      const { data: tasksData, error: tasksError } = await supabase
        .from('onboarding_tasks')
        .select('*')
        .eq('user_id', user.id);

      if (tasksError) {
        console.error('Error loading onboarding tasks:', tasksError);
        return;
      }

      if (progressData) {
        const mappedProgress: OnboardingProgress = {
          userId: progressData.user_id,
          tenantId: progressData.tenant_id,
          currentStep: progressData.current_step,
          completedSteps: progressData.completed_steps || [],
          startedAt: progressData.started_at,
          completedAt: progressData.completed_at,
          isCompleted: progressData.is_completed,
          progress: progressData.progress
        };
        setProgress(mappedProgress);

        const current = steps.find(step => step.id === progressData.current_step);
        setCurrentStep(current || steps[0]);
      } else {
        // Criar novo progresso
        await createInitialProgress();
      }

      if (tasksData && tasksData.length > 0) {
        const mappedTasks: OnboardingTask[] = tasksData.map(task => ({
          id: task.task_id,
          title: task.title,
          description: task.description || '',
          action: task.action || '',
          isCompleted: task.is_completed,
          category: task.category as 'setup' | 'first-use' | 'learning',
          reward: task.reward
        }));
        setTasks(mappedTasks);
      } else {
        // Criar tarefas padrão
        await createInitialTasks();
      }
    } catch (error) {
      console.error('Error in loadOnboardingProgress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createInitialProgress = async () => {
    if (!user) return;

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      console.error('No tenant_id found for user');
      return;
    }

    const newProgress = {
      user_id: user.id,
      tenant_id: tenantId,
      current_step: steps[0].id,
      completed_steps: [],
      is_completed: false,
      progress: 0
    };

    const { data, error } = await supabase
      .from('onboarding_progress')
      .insert(newProgress)
      .select()
      .single();

    if (error) {
      console.error('Error creating initial progress:', error);
      return;
    }

    const mappedProgress: OnboardingProgress = {
      userId: data.user_id,
      tenantId: data.tenant_id,
      currentStep: data.current_step,
      completedSteps: data.completed_steps || [],
      startedAt: data.started_at,
      completedAt: data.completed_at,
      isCompleted: data.is_completed,
      progress: data.progress
    };

    setProgress(mappedProgress);
    setCurrentStep(steps[0]);
  };

  const createInitialTasks = async () => {
    if (!user) return;

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) return;

    const tasksToInsert = defaultTasks.map(task => ({
      user_id: user.id,
      tenant_id: tenantId,
      task_id: task.id,
      title: task.title,
      description: task.description,
      action: task.action,
      category: task.category,
      reward: task.reward,
      is_completed: false
    }));

    const { error } = await supabase
      .from('onboarding_tasks')
      .insert(tasksToInsert);

    if (error) {
      console.error('Error creating initial tasks:', error);
      return;
    }

    setTasks(defaultTasks);
  };

  const completeStep = async (stepId: string) => {
    if (!progress || !user) return;

    const currentIndex = steps.findIndex(s => s.id === stepId);
    const nextStep = steps[currentIndex + 1];
    
    const updatedCompletedSteps = [...progress.completedSteps, stepId];
    const newProgress = Math.round((updatedCompletedSteps.length / steps.length) * 100);
    const isCompleted = !nextStep;

    const updates: any = {
      completed_steps: updatedCompletedSteps,
      progress: newProgress,
      updated_at: new Date().toISOString()
    };

    if (nextStep) {
      updates.current_step = nextStep.id;
    } else {
      updates.is_completed = true;
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('onboarding_progress')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating progress:', error);
      return;
    }

    const updatedProgress: OnboardingProgress = {
      ...progress,
      completedSteps: updatedCompletedSteps,
      progress: newProgress,
      currentStep: nextStep?.id || progress.currentStep,
      isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : progress.completedAt
    };

    setProgress(updatedProgress);
    
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('onboarding_tasks')
      .update({ 
        is_completed: true, 
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('task_id', taskId);

    if (error) {
      console.error('Error completing task:', error);
      return;
    }

    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, isCompleted: true } : task
    ));
  };

  const skipStep = async (stepId: string) => {
    if (!progress || !user) return;

    const currentIndex = steps.findIndex(s => s.id === stepId);
    const nextStep = steps[currentIndex + 1];
    
    if (!nextStep) return;

    const { error } = await supabase
      .from('onboarding_progress')
      .update({ 
        current_step: nextStep.id,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error skipping step:', error);
      return;
    }

    const updatedProgress: OnboardingProgress = {
      ...progress,
      currentStep: nextStep.id
    };

    setProgress(updatedProgress);
    setCurrentStep(nextStep);
  };

  const goToStep = async (stepId: string) => {
    if (!progress || !user) return;

    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    const { error } = await supabase
      .from('onboarding_progress')
      .update({ 
        current_step: stepId,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating current step:', error);
      return;
    }

    const updatedProgress: OnboardingProgress = {
      ...progress,
      currentStep: stepId
    };

    setProgress(updatedProgress);
    setCurrentStep(step);
  };

  const resetOnboarding = async () => {
    if (!user) return;

    const { error: progressError } = await supabase
      .from('onboarding_progress')
      .delete()
      .eq('user_id', user.id);

    const { error: tasksError } = await supabase
      .from('onboarding_tasks')
      .delete()
      .eq('user_id', user.id);

    if (progressError || tasksError) {
      console.error('Error resetting onboarding:', { progressError, tasksError });
      return;
    }

    await createInitialProgress();
    await createInitialTasks();
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
