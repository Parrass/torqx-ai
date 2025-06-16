
import { ONBOARDING_STEPS } from '@/constants/onboardingSteps';
import { OnboardingProgress } from '@/types/onboarding';

export const getCurrentStep = (progress: OnboardingProgress | null) => {
  return progress && progress.currentStep 
    ? ONBOARDING_STEPS.find(s => s.id === progress.currentStep) 
    : ONBOARDING_STEPS[0];
};

export const getStepsWithCompletion = (progress: OnboardingProgress | null) => {
  return ONBOARDING_STEPS.map(step => ({
    ...step,
    isCompleted: progress?.completedSteps.includes(step.id) || false
  }));
};

export const shouldAutoInitialize = (
  userId: string | null,
  tenantId: string | null,
  isInitialized: boolean,
  progressLoading: boolean,
  progress: OnboardingProgress | null,
  initializationPending: boolean,
  initializationSuccess: boolean
) => {
  return userId && 
         tenantId && 
         isInitialized && 
         !progressLoading && 
         !progress && 
         !initializationPending &&
         !initializationSuccess;
};
