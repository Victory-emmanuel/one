import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminAccessButton from './AdminAccessButton';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader = ({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  // Manual logout function as a fallback
  const handleManualLogout = () => {
    // Clear all localStorage items related to Supabase
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.')) {
        localStorage.removeItem(key);
      }
    });

    // Navigate to home page
    navigate('/');

    // Reload the page to ensure all state is reset
    window.location.reload();
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'A';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button and title */}
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 flex items-center">
              <Shield className="h-5 w-5 text-marketing-blue mr-2" />
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
              <Badge variant="outline" className="ml-2 bg-marketing-blue text-white">
                Admin
              </Badge>

              {/* Admin Access Button */}
              <div className="ml-4">
                <AdminAccessButton />
              </div>
            </div>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-marketing-orange"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <div className="py-2 px-4 text-sm">
                    <div className="font-medium">New client signup</div>
                    <div className="text-muted-foreground">John Doe signed up for a free trial</div>
                    <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="py-2 px-4 text-sm">
                    <div className="font-medium">New support ticket</div>
                    <div className="text-muted-foreground">Jane Smith submitted a new support ticket</div>
                    <div className="text-xs text-muted-foreground mt-1">5 hours ago</div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer justify-center">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {profile?.full_name || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    <span>Client Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Log out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleManualLogout}>
                  Force Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
