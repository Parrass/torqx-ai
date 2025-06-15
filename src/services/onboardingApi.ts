
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_ONBOARDING_TASKS } from '@/constants/onboardingTasks';
import { ONBOARDING_STEPS } from '@/constants/onboardingSteps';

export class OnboardingApiService {
  static async loadProgress(userId: string) {
    console.log('OnboardingApiService: Loading progress for user:', userId);
    
    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('OnboardingApiService: Error loading progress:', error);
      throw error;
    }

    console.log('OnboardingApiService: Progress data:', data);
    return data;
  }

  static async loadTasks(userId: string) {
    console.log('OnboardingApiService: Loading tasks for user:', userId);
    
    const { data, error } = await supabase
      .from('onboarding_tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('OnboardingApiService: Error loading tasks:', error);
      throw error;
    }

    console.log('OnboardingApiService: Tasks data:', data);
    return data;
  }

  static async createInitialProgress(userId: string, tenantId: string) {
    console.log('OnboardingApiService: Creating initial progress for user:', userId, 'tenant:', tenantId);
    
    const newProgress = {
      user_id: userId,
      tenant_id: tenantId,
      current_step: ONBOARDING_STEPS[0].id,
      completed_steps: [],
      is_completed: false,
      progress: 0
    };

    console.log('OnboardingApiService: Inserting progress:', newProgress);

    const { data, error } = await supabase
      .from('onboarding_progress')
      .insert(newProgress)
      .select()
      .single();

    if (error) {
      console.error('OnboardingApiService: Error creating progress:', error);
      throw error;
    }

    console.log('OnboardingApiService: Progress created:', data);
    return data;
  }

  static async createInitialTasks(userId: string, tenantId: string) {
    console.log('OnboardingApiService: Creating initial tasks for user:', userId, 'tenant:', tenantId);
    
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

    console.log('OnboardingApiService: Inserting tasks:', tasksToInsert);

    const { error } = await supabase
      .from('onboarding_tasks')
      .insert(tasksToInsert);

    if (error) {
      console.error('OnboardingApiService: Error creating tasks:', error);
      throw error;
    }

    console.log('OnboardingApiService: Tasks created successfully');
    return DEFAULT_ONBOARDING_TASKS;
  }

  static async updateProgress(userId: string, updates: any) {
    console.log('OnboardingApiService: Updating progress for user:', userId, 'updates:', updates);
    
    const { error } = await supabase
      .from('onboarding_progress')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      console.error('OnboardingApiService: Error updating progress:', error);
      throw error;
    }

    console.log('OnboardingApiService: Progress updated successfully');
  }

  static async completeTask(userId: string, taskId: string) {
    console.log('OnboardingApiService: Completing task for user:', userId, 'task:', taskId);
    
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
      console.error('OnboardingApiService: Error completing task:', error);
      throw error;
    }

    console.log('OnboardingApiService: Task completed successfully');
  }

  static async deleteAllProgress(userId: string) {
    console.log('OnboardingApiService: Deleting all progress for user:', userId);
    
    const { error: progressError } = await supabase
      .from('onboarding_progress')
      .delete()
      .eq('user_id', userId);

    const { error: tasksError } = await supabase
      .from('onboarding_tasks')
      .delete()
      .eq('user_id', userId);

    if (progressError || tasksError) {
      console.error('OnboardingApiService: Error resetting:', { progressError, tasksError });
      throw new Error('Error resetting onboarding');
    }

    console.log('OnboardingApiService: All progress deleted successfully');
  }
}
