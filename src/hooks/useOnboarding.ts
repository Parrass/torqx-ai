
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Get current user and setup tenant
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('useOnboarding: No user found');
          return;
        }

        console.log('useOnboarding: User found:', user.id);
        setUserId(user.id);
        
        // Try to get existing tenant from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('tenant_id')
          .eq('id', user.id)
          .maybeSingle();
        
        if (userError) {
          console.error('useOnboarding: Error fetching user data:', userError);
        }

        let currentTenantId = userData?.tenant_id;

        // If no tenant, create one
        if (!currentTenantId) {
          console.log('useOnboarding: Creating new tenant...');
          try {
            const { data: newTenantId, error: tenantError } = await supabase.rpc('get_or_create_tenant_for_user');
            
            if (tenantError) {
              console.error('useOnboarding: Error creating tenant:', tenantError);
              // Try direct creation as fallback
              const { data: directTenant, error: directError } = await supabase
                .from('tenants')
                .insert({
                  name: user.email?.split('@')[0] || 'Oficina',
                  business_name: user.email?.split('@')[0] || 'Oficina',
                  email: user.email || '',
                  document_number: '00000000000',
                  status: 'active'
                })
                .select()
                .single();

              if (directError) {
                console.error('useOnboarding: Direct tenant creation failed:', directError);
                return;
              }

              currentTenantId = directTenant.id;
              
              // Update user with tenant_id
              await supabase
                .from('users')
                .update({ tenant_id: currentTenantId })
                .eq('id', user.id);
            } else {
              currentTenantId = newTenantId;
            }
          } catch (error) {
            console.error('useOnboarding: Exception creating tenant:', error);
            return;
          }
        }

        if (currentTenantId) {
          console.log('useOnboarding: Tenant ID obtained:', currentTenantId);
          setTenantId(currentTenantId);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('useOnboarding: Error in initializeUser:', error);
        setIsInitialized(true);
      }
    };

    initializeUser();
  }, []);

  // Load onboarding progress
  const { data: progress, isLoading: progressLoading, refetch: refetchProgress } = useQuery({
    queryKey: ['onboarding-progress', userId, tenantId],
    queryFn: async () => {
      if (!userId || !tenantId) {
        console.log('useOnboarding: Missing userId or tenantId for progress');
        return null;
      }
      
      try {
        console.log('useOnboarding: Loading progress for user:', userId, 'tenant:', tenantId);
        const data = await OnboardingApiService.loadProgress(userId);
        
        if (data) {
          const mappedProgress = mapProgressFromDatabase(data);
          console.log('useOnboarding: Progress loaded:', mappedProgress);
          return mappedProgress;
        }
        
        console.log('useOnboarding: No progress found, will initialize');
        return null;
      } catch (error) {
        console.error('useOnboarding: Error loading progress:', error);
        return null;
      }
    },
    enabled: !!userId && !!tenantId && isInitialized
  });

  // Load onboarding tasks
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['onboarding-tasks', userId, tenantId],
    queryFn: async () => {
      if (!userId || !tenantId) {
        console.log('useOnboarding: Missing userId or tenantId for tasks');
        return [];
      }
      
      try {
        console.log('useOnboarding: Loading tasks for user:', userId);
        const data = await OnboardingApiService.loadTasks(userId);
        const mappedTasks = mapTasksFromDatabase(data || []);
        console.log('useOnboarding: Tasks loaded:', mappedTasks);
        return mappedTasks;
      } catch (error) {
        console.error('useOnboarding: Error loading tasks:', error);
        return [];
      }
    },
    enabled: !!userId && !!tenantId && isInitialized
  });

  // Initialize onboarding data if it doesn't exist
  const initializeMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !tenantId) {
        throw new Error('User ID or Tenant ID not available');
      }

      console.log('useOnboarding: Initializing onboarding for user:', userId, 'tenant:', tenantId);

      try {
        // Create initial progress and tasks
        const [progressData] = await Promise.all([
          OnboardingApiService.createInitialProgress(userId, tenantId),
          OnboardingApiService.createInitialTasks(userId, tenantId)
        ]);

        console.log('useOnboarding: Onboarding initialized successfully');
        return mapProgressFromDatabase(progressData);
      } catch (error) {
        console.error('useOnboarding: Error in initialization:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('useOnboarding: Initialization successful, refetching data');
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-tasks'] });
      refetchProgress();
    },
    onError: (error) => {
      console.error('useOnboarding: Error initializing onboarding:', error);
    }
  });

  // Auto-initialize if conditions are met
  useEffect(() => {
    const shouldInitialize = userId && 
                           tenantId && 
                           isInitialized && 
                           !progressLoading && 
                           !progress && 
                           !initializeMutation.isPending &&
                           !initializeMutation.isSuccess;

    if (shouldInitialize) {
      console.log('useOnboarding: Auto-initializing onboarding data...');
      initializeMutation.mutate();
    }
  }, [userId, tenantId, isInitialized, progress, progressLoading, initializeMutation]);

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

  // Get current step
  const currentStep = progress && progress.currentStep 
    ? ONBOARDING_STEPS.find(s => s.id === progress.currentStep) 
    : ONBOARDING_STEPS[0];

  // Get steps with completion status
  const steps = ONBOARDING_STEPS.map(step => ({
    ...step,
    isCompleted: progress?.completedSteps.includes(step.id) || false
  }));

  const isLoading = !isInitialized || progressLoading || tasksLoading || initializeMutation.isPending;

  console.log('useOnboarding: Current state:', {
    userId,
    tenantId,
    isInitialized,
    progressLoading,
    tasksLoading,
    progress: progress?.progress,
    isCompleted: progress?.isCompleted,
    isLoading
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
