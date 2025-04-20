import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Settings,
  CreditCard,
  LifeBuoy,
  MessageSquare,
  LogOut,
  ChevronLeft,
  Home,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';


interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DashboardSidebar = ({ open, setOpen }: DashboardSidebarProps) => {
  const { user, profile, signOut } = useAuth();

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };
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

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 h-screen flex-shrink-0 overflow-hidden ${open ? 'w-60' : 'w-20'} ${open ? 'md:relative fixed' : 'md:relative fixed'} ${open ? 'md:translate-x-0 translate-x-0' : 'md:translate-x-0 -translate-x-full'} transition-transform duration-300 shadow-xl`}
    >
      <div className="flex flex-col h-full">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {open && (
            <Link to="/" className="items-center md:flex hidden">
              <span className="text-xl font-bold text-marketing-dark dark:text-white">
                Marketing<span className="text-marketing-orange">Lot</span>
              </span>
            </Link>
          )}

          {/* Add mobile header elements when sidebar is open */}
          {open && (
            <div className="md:hidden flex items-center">
              <span className="text-sm font-medium text-gray-800 dark:text-white">Client Dashboard</span>
            </div>
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

        {/* Mobile Profile Section */}
        {open && (
          <div className="md:hidden p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar>
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-white">{profile?.full_name || user?.email}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
              <ThemeToggle variant="outline" size="sm" />
            </div>
            <div className="flex items-center justify-between mt-4 mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Notifications</span>
              <button
                type="button"
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-marketing-orange"></span>
              </button>
            </div>
          </div>
        )}

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
    </div>
  );
};

export default DashboardSidebar;
