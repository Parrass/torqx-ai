
import { useEffect } from 'react';
import { useOnboardingProgress } from './onboarding/useOnboardingProgress';
import { useOnboardingTasks } from './onboarding/useOnboardingTasks';
import { useOnboardingMutations } from './onboarding/useOnboardingMutations';
import { useUserInitialization } from './onboarding/useUserInitialization';
import { getCurrentStep, getStepsWithCompletion, shouldAutoInitialize } from '@/utils/onboardingHelpers';
import { ONBOARDING_STEPS } from '@/constants/onboardingSteps';

export const useOnboarding = () => {
  // Initialize user and tenant
  const { userId, tenantId, isInitialized } = useUserInitialization();

  // Load onboarding data
  const { data: progress, isLoading: progressLoading, refetch: refetchProgress } = useOnboardingProgress(userId, tenantId, isInitialized);
  const { data: tasks, isLoading: tasksLoading } = useOnboardingTasks(userId, tenantId, isInitialized);

  // Get mutations
  const {
    initializeMutation,
    completeStepMutation,
    skipStepMutation,
    goToStepMutation,
    completeTaskMutation,
    resetMutation
  } = useOnboardingMutations(userId, tenantId, progress);

  // Auto-initialize if conditions are met
  useEffect(() => {
    if (shouldAutoInitialize(
      userId,
      tenantId,
      isInitialized,
      progressLoading,
      progress,
      initializeMutation.isPending,
      initializeMutation.isSuccess
    )) {
      console.log('useOnboarding: Auto-initializing onboarding data...');
      initializeMutation.mutate();
    }
  }, [userId, tenantId, isInitialized, progress, progressLoading, initializeMutation]);

  // Update refetch function for initialization mutation
  useEffect(() => {
    if (initializeMutation.isSuccess) {
      refetchProgress();
    }
  }, [initializeMutation.isSuccess, refetchProgress]);

  // Get current step and steps with completion status
  const currentStep = getCurrentStep(progress);
  const steps = getStepsWithCompletion(progress);

  const isLoading = !isInitialized || progressLoading || tasksLoading || initializeMutation.isPending;

  console.log('useOnboarding: Current state:', {
    userId,
    tenantId,
    isInitialized,
    progressLoading,
    tasksLoading,
    hasProgress: !!progress,
    progressValue: progress?.progress,
    isCompleted: progress?.isCompleted,
    isLoading,
    initializationPending: initializeMutation.isPending,
    currentStepId: progress?.currentStep,
    completedStepsCount: progress?.completedSteps.length,
    totalSteps: ONBOARDING_STEPS.length
  });

  return {
    // Data
    progress,
    tasks: tasks || [],
    steps,
    currentStep,
    
    // Loading states
    isLoading,
    
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
