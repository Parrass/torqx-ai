
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingProgress, OnboardingTask, OnboardingStep } from '@/types/onboarding';
import { OnboardingApiService } from '@/services/onboardingApi';
import { mapProgressFromDatabase, mapTasksFromDatabase } from '@/utils/onboardingMappers';
import { ONBOARDING_STEPS } from '@/constants/onboardingSteps';

export const useOnboarding = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Get current user and tenant
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Get tenant_id from users table
        const { data: userData } = await supabase
          .from('users')
          .select('tenant_id')
          .eq('id', user.id)
          .single();
        
        if (userData?.tenant_id) {
          setTenantId(userData.tenant_id);
        }
      }
    };

    getCurrentUser();
  }, []);

  // Load onboarding progress
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['onboarding-progress', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const data = await OnboardingApiService.loadProgress(userId);
        return data ? mapProgressFromDatabase(data) : null;
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
        return null;
      }
    },
    enabled: !!userId
  });

  // Load onboarding tasks
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['onboarding-tasks', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        const data = await OnboardingApiService.loadTasks(userId);
        return mapTasksFromDatabase(data || []);
      } catch (error) {
        console.error('Error loading onboarding tasks:', error);
        return [];
      }
    },
    enabled: !!userId
  });

  // Initialize onboarding data if it doesn't exist
  const initializeMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !tenantId) {
        throw new Error('User ID or Tenant ID not available');
      }

      console.log('Initializing onboarding for user:', userId, 'tenant:', tenantId);

      // Create initial progress and tasks
      const [progressData] = await Promise.all([
        OnboardingApiService.createInitialProgress(userId, tenantId),
        OnboardingApiService.createInitialTasks(userId, tenantId)
      ]);

      return mapProgressFromDatabase(progressData);
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-tasks', userId] });
    },
    onError: (error) => {
      console.error('Error initializing onboarding:', error);
    }
  });

  // Auto-initialize if no progress exists and we have user/tenant data
  useEffect(() => {
    if (userId && tenantId && !progressLoading && !progress && !initializeMutation.isPending) {
      console.log('Auto-initializing onboarding data...');
      initializeMutation.mutate();
    }
  }, [userId, tenantId, progress, progressLoading, initializeMutation]);

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async (stepId: string) => {
      if (!userId || !progress) return;

      const newCompletedSteps = [...progress.completedSteps];
      if (!newCompletedSteps.includes(stepId)) {
        newCompletedSteps.push(stepId);
      }

      const currentStepIndex = ONBOARDING_STEPS.findIndex(s => s.id === stepId);
      const nextStep = ONBOARDING_STEPS[currentStepIndex + 1];
      const newProgress = Math.round((newCompletedSteps.length / ONBOARDING_STEPS.length) * 100);

      const updates = {
        completed_steps: newCompletedSteps,
        current_step: nextStep ? nextStep.id : stepId,
        progress: newProgress,
        is_completed: newProgress === 100,
        completed_at: newProgress === 100 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      await OnboardingApiService.updateProgress(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', userId] });
    }
  });

  // Skip step mutation
  const skipStepMutation = useMutation({
    mutationFn: async (stepId: string) => {
      if (!userId || !progress) return;

      const currentStepIndex = ONBOARDING_STEPS.findIndex(s => s.id === stepId);
      const nextStep = ONBOARDING_STEPS[currentStepIndex + 1];

      const updates = {
        current_step: nextStep ? nextStep.id : stepId,
        updated_at: new Date().toISOString()
      };

      await OnboardingApiService.updateProgress(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', userId] });
    }
  });

  // Go to step mutation
  const goToStepMutation = useMutation({
    mutationFn: async (stepId: string) => {
      if (!userId) return;

      const updates = {
        current_step: stepId,
        updated_at: new Date().toISOString()
      };

      await OnboardingApiService.updateProgress(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', userId] });
    }
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!userId) return;
      await OnboardingApiService.completeTask(userId, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-tasks', userId] });
    }
  });

  // Reset onboarding mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      await OnboardingApiService.deleteAllProgress(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', userId] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-tasks', userId] });
    }
  });

  // Get current step
  const currentStep = progress && progress.currentStep 
    ? ONBOARDING_STEPS.find(s => s.id === progress.currentStep) 
    : ONBOARDING_STEPS[0];

  // Get steps with completion status
  const steps = ONBOARDING_STEPS.map(step => ({
    ...step,
    isCompleted: progress?.completedSteps.includes(step.id) || false
  }));

  return {
    // Data
    progress,
    tasks: tasks || [],
    steps,
    currentStep,
    
    // Loading states
    isLoading: progressLoading || tasksLoading || initializeMutation.isPending,
    
    // Actions
    completeStep: completeStepMutation.mutate,
    skipStep: skipStepMutation.mutate,
    goToStep: goToStepMutation.mutate,
    completeTask: completeTaskMutation.mutate,
    resetOnboarding: resetMutation.mutate,
    
    // Action states
    isCompletingStep: completeStepMutation.isPending,
    isSkippingStep: skipStepMutation.isPending,
    isCompletingTask: completeTaskMutation.isPending,
    isResetting: resetMutation.isPending
  };
};
