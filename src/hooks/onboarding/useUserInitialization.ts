
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserInitialization = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        console.log('useUserInitialization: Initializing user...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('useUserInitialization: No user found');
          setIsInitialized(true);
          return;
        }

        console.log('useUserInitialization: User found:', user.id);
        setUserId(user.id);
        
        console.log('useUserInitialization: Getting/creating tenant...');
        const { data: tenantId, error } = await supabase.rpc('get_or_create_tenant_for_user');
        
        if (error) {
          console.error('useUserInitialization: Error getting/creating tenant:', error);
          setIsInitialized(true);
          return;
        }

        if (tenantId) {
          console.log('useUserInitialization: Tenant ID obtained:', tenantId);
          setTenantId(tenantId);
        } else {
          console.warn('useUserInitialization: No tenant ID returned from function');
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('useUserInitialization: Error in initializeUser:', error);
        setIsInitialized(true);
      }
    };

    initializeUser();
  }, []);

  return { userId, tenantId, isInitialized };
};
