
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SidebarLink } from '@/components/ui/sidebar';

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

  // Filtrar itens com base nas permissões do usuário
  const allowedItems = category.items.filter(item => 
    !item.permission || userPermissions.includes(item.permission)
  );

  // Se não há itens permitidos, não renderizar a categoria
  if (allowedItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-torqx-primary-light transition-colors text-left"
      >
        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {category.icon}
        </div>
        <span className="text-torqx-primary dark:text-white text-sm font-medium flex-1">
          {category.label}
        </span>
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 text-torqx-primary dark:text-white" />
        ) : (
          <ChevronRight className="w-3 h-3 text-torqx-primary dark:text-white" />
        )}
      </button>
      
      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {allowedItems.map((item, idx) => (
            <SidebarLink key={idx} link={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarCategoryItem;
