
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SidebarLink, useSidebar } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  permission?: string;
}

interface SidebarCategoryItemProps {
  category: {
    label: string;
    icon: React.JSX.Element | React.ReactNode;
    items: SidebarItem[];
  };
  userPermissions: string[];
}

const SidebarCategoryItem = ({ category, userPermissions }: SidebarCategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { open } = useSidebar();

  const allowedItems = category.items.filter(item => 
    !item.permission || userPermissions.includes(item.permission)
  );

  if (allowedItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-torqx-primary-light transition-colors text-left overflow-hidden"
      >
        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {category.icon}
        </div>
        <motion.span 
          className="text-torqx-primary dark:text-white text-sm font-medium flex-1 whitespace-nowrap"
          animate={{
            opacity: open ? 1 : 0,
            width: open ? "auto" : 0,
          }}
          style={{
            opacity: open ? 1 : 0,
            width: open ? "auto" : 0,
          }}
        >
          {category.label}
        </motion.span>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-torqx-primary dark:text-white" />
            ) : (
              <ChevronRight className="w-3 h-3 text-torqx-primary dark:text-white" />
            )}
          </motion.div>
        )}
      </button>
      
      {isExpanded && open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-4 mt-1 space-y-1 overflow-hidden"
        >
          {allowedItems.map((item, idx) => (
            <SidebarLink key={idx} link={item} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SidebarCategoryItem;
