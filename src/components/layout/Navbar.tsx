
import { useState, useEffect, useRef } from 'react';
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll
      document.body.style.overflow = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 overflow-x-hidden ${
        scrolled ? 'bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom flex items-center justify-between overflow-x-hidden">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-marketing-dark dark:text-white">
            NextGen<span className="text-marketing-orange">Digi</span>
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
          className="md:hidden flex items-center gap-1 text-marketing-dark dark:text-white p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          ref={menuButtonRef}
        >
          <span className="text-sm font-medium mr-1 hidden xs:inline">Menu</span>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 transition-opacity duration-300 md:hidden z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed ${scrolled ? 'top-[56px]' : 'top-[72px]'} left-0 right-0 w-full bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800 transition-all duration-300 z-40 max-h-[80vh] overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="container-custom py-5 flex flex-col space-y-4">
          <div className="flex justify-end md:hidden mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <div className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
            <Link
              to="/"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-3 px-2 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">Home</span>
            </Link>
            <Link
              to="/services"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-3 px-2 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 mt-1"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">Services</span>
            </Link>
            <Link
              to="/about"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-3 px-2 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 mt-1"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">About</span>
            </Link>
            <Link
              to="/pricing"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-3 px-2 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 mt-1"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">Pricing</span>
            </Link>
            <Link
              to="/blog"
              className="text-marketing-dark dark:text-gray-200 hover:text-marketing-blue dark:hover:text-blue-400 transition-colors py-3 px-2 flex items-center rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 mt-1"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">Blog</span>
            </Link>
          </div>
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
    </header>
  );
};

export default Navbar;
