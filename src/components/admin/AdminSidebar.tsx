import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  DollarSign, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronLeft,
  Mail
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AdminSidebar = ({ open, setOpen }: AdminSidebarProps) => {
  const { signOut } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Reports & Analytics', 
      icon: <BarChart3 className="h-5 w-5" />, 
      path: '/admin' 
    },
    { 
      name: 'Clients', 
      icon: <Users className="h-5 w-5" />, 
      path: '/admin/clients' 
    },
    { 
      name: 'Subscriptions', 
      icon: <CreditCard className="h-5 w-5" />, 
      path: '/admin/subscriptions' 
    },
    { 
      name: 'Revenue', 
      icon: <DollarSign className="h-5 w-5" />, 
      path: '/admin/revenue' 
    },
    { 
      name: 'Complaints', 
      icon: <MessageSquare className="h-5 w-5" />, 
      path: '/admin/complaints' 
    },
    { 
      name: 'Email Analytics', 
      icon: <Mail className="h-5 w-5" />, 
      path: '/admin/email-analytics' 
    },
    { 
      name: 'Settings', 
      icon: <Settings className="h-5 w-5" />, 
      path: '/admin/settings' 
    },
  ];

  const sidebarVariants = {
    open: { width: '240px', transition: { duration: 0.3 } },
    closed: { width: '80px', transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="bg-marketing-dark text-white border-r border-gray-800 z-30 h-screen flex-shrink-0 overflow-hidden"
      initial={open ? 'open' : 'closed'}
      animate={open ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {open && (
            <Link to="/admin" className="flex items-center">
              <span className="text-xl font-bold text-white">
                Admin<span className="text-marketing-orange">Panel</span>
              </span>
            </Link>
          )}
          <button 
            onClick={() => setOpen(!open)} 
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className={cn("h-5 w-5 text-gray-300 transition-transform", !open && "rotate-180")} />
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
                      : "text-gray-300 hover:bg-gray-700"
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
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={signOut}
            className="flex items-center w-full px-3 py-2 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {open && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
