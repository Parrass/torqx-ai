
"use client";

import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<"div">) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen, animate } = useSidebar();
  
  const { onMouseEnter, onMouseLeave, ...restProps } = props;
  
  return (
    <motion.div
      className={cn(
        "h-[calc(100vh-4rem)] px-3 py-3 hidden md:flex md:flex-col bg-white dark:bg-torqx-primary flex-shrink-0 fixed left-0 top-16 z-40 shadow-lg border-r border-gray-200 dark:border-torqx-primary-light",
        className
      )}
      animate={{
        width: animate ? (open ? "240px" : "60px") : "240px",
      }}
      style={{
        width: animate ? (open ? "240px" : "60px") : "240px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div {...restProps} className="flex flex-col h-full">
        {children}
      </div>
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-[calc(100vh-4rem)] w-80 top-16 left-0 bg-white dark:bg-torqx-primary p-6 z-50 flex flex-col shadow-xl border-r border-gray-200 dark:border-torqx-primary-light md:hidden",
              className
            )}
          >
            <div className="flex justify-end mb-4">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-torqx-primary-light"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5 text-torqx-primary dark:text-white" />
              </button>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: any;
}) => {
  const { open, animate } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = location.pathname === link.href;
  
  const handleClick = () => {
    navigate(link.href);
  };
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 group/sidebar py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-torqx-primary-light transition-colors min-h-[36px] w-full text-left",
        isActive && "bg-torqx-secondary/10 text-torqx-secondary",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
        {link.icon}
      </div>
      <span
        className={`text-torqx-primary dark:text-white text-sm group-hover/sidebar:translate-x-1 transition-all duration-300 whitespace-nowrap overflow-hidden ${
          open ? 'opacity-100 w-auto' : 'opacity-0 w-0'
        } ${isActive ? 'text-torqx-secondary font-medium' : ''}`}
      >
        {link.label}
      </span>
    </button>
  );
};

// Missing components that are needed
export const SidebarContent = ({ children, className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("flex flex-col flex-1 overflow-y-auto", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarGroup = ({ children, className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarGroupContent = ({ children, className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarGroupLabel = ({ children, className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("px-2 text-xs font-semibold text-torqx-primary/60 dark:text-white/60 mb-2", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarMenu = ({ children, className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul className={cn("space-y-1", className)} {...props}>
      {children}
    </ul>
  );
};

export const SidebarMenuItem = ({ children, className, ...props }: React.ComponentProps<"li">) => {
  return (
    <li className={cn("", className)} {...props}>
      {children}
    </li>
  );
};

export const SidebarMenuButton = ({ children, className, asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) => {
  return (
    <button className={cn("flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-torqx-primary-light transition-colors", className)} {...props}>
      {children}
    </button>
  );
};

export const SidebarHeader = ({ children, className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("px-3 py-2 border-b border-gray-200 dark:border-torqx-primary-light", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarFooter = ({ children, className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("px-3 py-2 border-t border-gray-200 dark:border-torqx-primary-light mt-auto", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarTrigger = ({ className, ...props }: React.ComponentProps<"button">) => {
  const { setOpen } = useSidebar();
  
  return (
    <button
      className={cn("p-2 rounded-lg hover:bg-gray-100 md:hidden", className)}
      onClick={() => setOpen(true)}
      {...props}
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};
