
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isCompleted: boolean;
  isOptional: boolean;
  order: number;
}

export interface OnboardingProgress {
  userId: string;
  tenantId: string;
  currentStep: string;
  completedSteps: string[];
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
  progress: number;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  action: string;
  isCompleted: boolean;
  category: 'setup' | 'first-use' | 'learning';
  reward?: string;
}
