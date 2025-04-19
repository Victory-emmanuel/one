
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus, User, LayoutDashboard, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ThemeToggleAdvanced } from '@/components/theme/ThemeToggleAdvanced';

const Navbar = () => {
  const { user, profile, signOut, isAdmin } = useAuth();

  // Check if this is the specific admin user
  const isSpecificAdmin = user?.id === '9b2d6b23-213e-44bf-9f30-b36164239fee' &&
                         user?.email === 'marketinglot.blog@gmail.com';
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-marketing-dark dark:text-white">
            Marketing<span className="text-marketing-orange">Lot</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/services" className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors">
            Services
          </Link>
          <Link to="/about" className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors">
            About
          </Link>
          <Link to="/pricing" className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors">
            Pricing
          </Link>
          <Link to="/blog" className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors">
            Blog
          </Link>
          <div className="flex items-center space-x-3">
            <ThemeToggle variant="ghost" />
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-marketing-blue text-marketing-blue dark:text-blue-400 hover:bg-marketing-blue hover:text-white dark:border-blue-600 dark:hover:bg-blue-600">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="border-marketing-dark text-marketing-dark dark:border-gray-400 dark:text-gray-300 hover:bg-marketing-dark hover:text-white dark:hover:bg-gray-700">
                      <Shield className="mr-2 h-4 w-4" /> Admin
                    </Button>
                  </Link>
                )}
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
                      <Link to="/dashboard/profile" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="border-marketing-dark text-marketing-dark dark:border-gray-400 dark:text-gray-300 hover:bg-marketing-blue hover:text-white hover:border-marketing-blue dark:hover:bg-blue-600 dark:hover:border-blue-600">
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button variant="outline" className="border-marketing-blue text-marketing-blue dark:border-blue-600 dark:text-blue-400 hover:bg-marketing-blue hover:text-white dark:hover:bg-blue-600">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Button>
                </Link>
                {/* Special admin login link */}
                <Link to="/admin-login" className="text-xs text-gray-400 dark:text-gray-500 hover:text-marketing-blue dark:hover:text-blue-400 absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                  <Shield className="h-3 w-3 inline mr-1" />
                  <span>Admin</span>
                </Link>
              </>
            )}
            <Link to="/contact">
              <Button className="bg-marketing-blue hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                Get in Touch
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden text-marketing-dark"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 animate-fade-in">
          <div className="container-custom py-5 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/pricing"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" className="w-full border-marketing-blue text-marketing-blue dark:border-blue-600 dark:text-blue-400 hover:bg-marketing-blue hover:text-white dark:hover:bg-blue-600 mb-2">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="outline" className="w-full border-marketing-dark text-marketing-dark dark:border-gray-400 dark:text-gray-300 hover:bg-marketing-dark hover:text-white dark:hover:bg-gray-700 mb-2">
                      <Shield className="mr-2 h-4 w-4" /> Admin
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" className="w-full border-marketing-dark text-marketing-dark dark:border-gray-400 dark:text-gray-300 hover:bg-marketing-blue hover:text-white hover:border-marketing-blue dark:hover:bg-blue-600 dark:hover:border-blue-600 mb-2">
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Button>
                </Link>
                <Link
                  to="/auth?tab=register"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" className="w-full border-marketing-blue text-marketing-blue dark:border-blue-600 dark:text-blue-400 hover:bg-marketing-blue hover:text-white dark:hover:bg-blue-600 mb-2">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Button>
                </Link>
              </>
            )}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
            >
              <Button className="w-full bg-marketing-blue hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                Get in Touch
              </Button>
            </Link>

            <div className="flex justify-center mt-4">
              <ThemeToggleAdvanced className="mx-auto" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
