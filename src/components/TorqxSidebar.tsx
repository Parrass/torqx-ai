
import { SidebarBody } from '@/components/ui/sidebar';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import SidebarMainLinks from '@/components/sidebar/SidebarMainLinks';
import SidebarCategories from '@/components/sidebar/SidebarCategories';
import SidebarLoadingState from '@/components/sidebar/SidebarLoadingState';

const TorqxSidebar = () => {
  const { permissions, loading } = useUserPermissions();

  if (loading) {
    return <SidebarLoadingState />;
  }

  return (
    <SidebarBody>
      <div className="p-3 space-y-1 overflow-hidden">
        <SidebarMainLinks />
        <SidebarCategories userPermissions={permissions} />
      </div>
    </SidebarBody>
  );
};

export default TorqxSidebar;
