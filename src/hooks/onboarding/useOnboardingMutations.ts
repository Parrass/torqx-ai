
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OnboardingApiService } from '@/services/onboardingApi';
import { OnboardingProgress } from '@/types/onboarding';
import { ONBOARDING_STEPS } from '@/constants/onboardingSteps';

export const useOnboardingMutations = (userId: string | null, tenantId: string | null, progress: OnboardingProgress | null) => {
  const queryClient = useQueryClient();

  // Initialize onboarding data
  const initializeMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !tenantId) {
        throw new Error('User ID or Tenant ID not available');
      }

      console.log('useOnboardingMutations: Initializing onboarding for user:', userId, 'tenant:', tenantId);

      try {
        const [progressData] = await Promise.all([
          OnboardingApiService.createInitialProgress(userId, tenantId),
          OnboardingApiService.createInitialTasks(userId, tenantId)
        ]);

        console.log('useOnboardingMutations: Onboarding initialized successfully');
        return progressData;
      } catch (error) {
        console.error('useOnboardingMutations: Error in initialization:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('useOnboardingMutations: Initialization successful, refetching data');
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-tasks'] });
    },
    onError: (error) => {
      console.error('useOnboardingMutations: Error initializing onboarding:', error);
    }
  });

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
      const isOnboardingCompleted = newCompletedSteps.length === ONBOARDING_STEPS.length;

      console.log('useOnboardingMutations: Completing step:', stepId, {
        completedStepsCount: newCompletedSteps.length,
        totalSteps: ONBOARDING_STEPS.length,
        newProgress,
        isOnboardingCompleted
      });

      const updates = {
        completed_steps: newCompletedSteps,
        current_step: nextStep ? nextStep.id : stepId,
        progress: newProgress,
        is_completed: isOnboardingCompleted,
        completed_at: isOnboardingCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      await OnboardingApiService.updateProgress(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
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
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
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
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
    }
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!userId) return;
      await OnboardingApiService.completeTask(userId, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-tasks'] });
    }
  });

  // Reset onboarding mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      await OnboardingApiService.deleteAllProgress(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-tasks'] });
    }
  });

  return {
    initializeMutation,
    completeStepMutation,
    skipStepMutation,
    goToStepMutation,
    completeTaskMutation,
    resetMutation
  };
};
