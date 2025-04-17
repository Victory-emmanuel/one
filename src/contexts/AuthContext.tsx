import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { getAdminSessionKey } from '@/constants/auth';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        setIsAdmin(false);
      } else {
        setProfile(data);

        // Check for admin status in profile, user metadata, and JWT claims
        const isAdminInProfile = data?.is_admin === true || data?.role === 'admin';
        const isAdminInMetadata = user?.user_metadata?.role === 'admin' || user?.user_metadata?.is_admin === true;

        // Special case for our specific admin user
        const isSpecificAdmin = userId === '9b2d6b23-213e-44bf-9f30-b36164239fee' &&
                               user?.email === 'marketinglot.blog@gmail.com';

        // Log admin status for debugging
        console.log('Admin status check:', {
          userId,
          email: user?.email,
          isAdminInProfile,
          isAdminInMetadata,
          isSpecificAdmin,
          profileData: data,
          userMetadata: user?.user_metadata
        });

        // Set admin status if any source indicates admin or if it's our specific admin user
        setIsAdmin(isAdminInProfile || isAdminInMetadata || isSpecificAdmin);

        // If this is our specific admin user, update their profile to ensure they have admin status
        if (isSpecificAdmin && !isAdminInProfile) {
          console.log('Updating admin status for specific admin user');
          try {
            await supabase
              .from('profiles')
              .update({
                is_admin: true,
                role: 'admin',
                updated_at: new Date().toISOString()
              })
              .eq('id', userId);
          } catch (error) {
            console.error('Error updating admin status:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    try {
      // Clear admin access session if it exists
      if (user) {
        const adminSessionKey = getAdminSessionKey(user.id);
        localStorage.removeItem(adminSessionKey);
      }

      // Try the standard signOut method first
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch (signOutError) {
        console.error('Standard signOut failed:', signOutError);
        // If standard signOut fails, manually clear auth data
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.refreshToken');
        // Clear any other Supabase-related items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.')) {
            localStorage.removeItem(key);
          }
        });
      }

      // Reset state
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);

      // Navigate to home page
      navigate('/');

      // Reload the page to ensure all state is reset
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
