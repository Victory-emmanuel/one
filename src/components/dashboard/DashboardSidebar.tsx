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
      className="bg-white border-r border-gray-200 z-30 h-screen flex-shrink-0 overflow-hidden"
      initial={open ? 'open' : 'closed'}
      animate={open ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {open && (
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-marketing-dark">
                Marketing<span className="text-marketing-orange">Lot</span>
              </span>
            </Link>
          )}
          <button 
            onClick={() => setOpen(!open)} 
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className={cn("h-5 w-5 text-gray-500 transition-transform", !open && "rotate-180")} />
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
                      ? "bg-marketing-blue text-white" 
                      : "text-gray-700 hover:bg-gray-100"
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
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={signOut}
            className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
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
