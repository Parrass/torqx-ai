
import { SidebarBody } from '@/components/ui/sidebar';

const SidebarLoadingState = () => {
  return (
    <SidebarBody>
      <div className="p-3">
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </SidebarBody>
  );
};

export default SidebarLoadingState;
