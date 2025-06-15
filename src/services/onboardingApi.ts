
import { supabase } from '@/integrations/supabase/client';
import { OnboardingProgress, OnboardingTask } from '@/types/onboarding';
import { DEFAULT_ONBOARDING_TASKS } from '@/constants/onboardingTasks';
import { ONBOARDING_STEPS } from '@/constants/onboardingSteps';

export class OnboardingApiService {
  static async loadProgress(userId: string) {
    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  static async loadTasks(userId: string) {
    const { data, error } = await supabase
      .from('onboarding_tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data;
  }

  static async createInitialProgress(userId: string, tenantId: string) {
    const newProgress = {
      user_id: userId,
      tenant_id: tenantId,
      current_step: ONBOARDING_STEPS[0].id,
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
      throw error;
    }

    return data;
  }

  static async createInitialTasks(userId: string, tenantId: string) {
    const tasksToInsert = DEFAULT_ONBOARDING_TASKS.map(task => ({
      user_id: userId,
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
      throw error;
    }

    return DEFAULT_ONBOARDING_TASKS;
  }

  static async updateProgress(userId: string, updates: any) {
    const { error } = await supabase
      .from('onboarding_progress')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  }

  static async completeTask(userId: string, taskId: string) {
    const { error } = await supabase
      .from('onboarding_tasks')
      .update({ 
        is_completed: true, 
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('task_id', taskId);

    if (error) {
      throw error;
    }
  }

  static async deleteAllProgress(userId: string) {
    const { error: progressError } = await supabase
      .from('onboarding_progress')
      .delete()
      .eq('user_id', userId);

    const { error: tasksError } = await supabase
      .from('onboarding_tasks')
      .delete()
      .eq('user_id', userId);

    if (progressError || tasksError) {
      throw new Error('Error resetting onboarding');
    }
  }
}
