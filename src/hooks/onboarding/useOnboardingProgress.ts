
import { useQuery } from '@tanstack/react-query';
import { OnboardingApiService } from '@/services/onboardingApi';
import { mapProgressFromDatabase } from '@/utils/onboardingMappers';

export const useOnboardingProgress = (userId: string | null, tenantId: string | null, isInitialized: boolean) => {
  return useQuery({
    queryKey: ['onboarding-progress', userId, tenantId],
    queryFn: async () => {
      if (!userId || !tenantId) {
        console.log('useOnboardingProgress: Missing userId or tenantId', { userId, tenantId });
        return null;
      }
      
      try {
        console.log('useOnboardingProgress: Loading progress for user:', userId, 'tenant:', tenantId);
        const data = await OnboardingApiService.loadProgress(userId);
        
        if (data) {
          const mappedProgress = mapProgressFromDatabase(data);
          console.log('useOnboardingProgress: Progress loaded:', mappedProgress);
          return mappedProgress;
        }
        
        console.log('useOnboardingProgress: No progress found, will initialize');
        return null;
      } catch (error) {
        console.error('useOnboardingProgress: Error loading progress:', error);
        return null;
      }
    },
    enabled: !!userId && !!tenantId && isInitialized,
    retry: 1
  });
};
