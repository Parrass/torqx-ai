
import { useQuery } from '@tanstack/react-query';
import { OnboardingApiService } from '@/services/onboardingApi';
import { mapTasksFromDatabase } from '@/utils/onboardingMappers';

export const useOnboardingTasks = (userId: string | null, tenantId: string | null, isInitialized: boolean) => {
  return useQuery({
    queryKey: ['onboarding-tasks', userId, tenantId],
    queryFn: async () => {
      if (!userId || !tenantId) {
        console.log('useOnboardingTasks: Missing userId or tenantId', { userId, tenantId });
        return [];
      }
      
      try {
        console.log('useOnboardingTasks: Loading tasks for user:', userId, 'tenant:', tenantId);
        const data = await OnboardingApiService.loadTasks(userId);
        const mappedTasks = mapTasksFromDatabase(data || []);
        console.log('useOnboardingTasks: Tasks loaded:', mappedTasks.length, 'tasks');
        return mappedTasks;
      } catch (error) {
        console.error('useOnboardingTasks: Error loading tasks:', error);
        return [];
      }
    },
    enabled: !!userId && !!tenantId && isInitialized,
    retry: 1
  });
};
