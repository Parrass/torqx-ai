
import { OnboardingProgress, OnboardingTask } from '@/types/onboarding';

export function mapProgressFromDatabase(data: any): OnboardingProgress {
  return {
    userId: data.user_id,
    tenantId: data.tenant_id,
    currentStep: data.current_step,
    completedSteps: data.completed_steps || [],
    startedAt: data.started_at,
    completedAt: data.completed_at,
    isCompleted: data.is_completed,
    progress: data.progress
  };
}

export function mapTasksFromDatabase(data: any[]): OnboardingTask[] {
  return data.map(task => ({
    id: task.task_id,
    title: task.title,
    description: task.description || '',
    action: task.action || '',
    isCompleted: task.is_completed,
    category: task.category as 'setup' | 'first-use' | 'learning',
    reward: task.reward
  }));
}
