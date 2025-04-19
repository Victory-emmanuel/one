import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Settings,
  CreditCard,
  LifeBuoy,
  MessageSquare,
  LogOut,
  ChevronLeft,
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DashboardSidebar = ({ open, setOpen }: DashboardSidebarProps) => {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/dashboard'
    },
    {
      name: 'Profile',
      icon: <User className="h-5 w-5" />,
      path: '/dashboard/profile'
    },
    {
      name: 'Subscription',
      icon: <CreditCard className="h-5 w-5" />,
      path: '/dashboard/subscription'
    },
    {
      name: 'Support',
      icon: <LifeBuoy className="h-5 w-5" />,
      path: '/dashboard/support'
    },
    {
      name: 'Feedback',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/dashboard/feedback'
    },
    {
      name: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/dashboard/settings'
    },
  ];

  const sidebarVariants = {
    open: { width: '240px', transition: { duration: 0.3 } },
    closed: { width: '80px', transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 h-screen flex-shrink-0 overflow-hidden"
      initial={open ? 'open' : 'closed'}
      animate={open ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {open && (
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-marketing-dark dark:text-white">
                Marketing<span className="text-marketing-orange">Lot</span>
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <ChevronLeft className={cn("h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform", !open && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-marketing-blue text-white dark:bg-blue-600"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {open && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={signOut}
            className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
            {open && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardSidebar;
