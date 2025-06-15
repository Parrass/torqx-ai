
import { Home } from 'lucide-react';
import { SidebarLink } from '@/components/ui/sidebar';

const SidebarMainLinks = () => {
  const mainLinks = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="text-torqx-primary dark:text-white w-4 h-4" />,
    }
  ];

  return (
    <>
      {mainLinks.map((link, idx) => (
        <SidebarLink key={idx} link={link} />
      ))}
      <div className="border-t border-gray-200 dark:border-torqx-primary-light my-3"></div>
    </>
  );
};

export default SidebarMainLinks;
