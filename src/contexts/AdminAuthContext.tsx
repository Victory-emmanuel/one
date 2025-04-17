import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';
import { getAdminSessionKey } from '@/constants/auth';
import { updateUserSubscription } from '@/services/subscription.service';
import { createClient, deleteClient } from '@/services/user.service';
import { SubscriptionStatus } from '@/types/subscription';

type AdminAuthContextType = {
  isAdminLoaded: boolean;
  adminFunctions: {
    listUsers: () => Promise<any>;
    createUser: (email: string, password: string, userData?: any) => Promise<any>;
    deleteUser: (userId: string) => Promise<any>;
    updateUserById: (userId: string, userData: any) => Promise<any>;
    resetPasswordForUser: (userId: string, password: string) => Promise<any>;
    inviteUserByEmail: (email: string, options?: any) => Promise<any>;
    updateUserSubscription: (userId: string, planName: string, status: SubscriptionStatus) => Promise<boolean>;
  };
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const [isAdminLoaded, setIsAdminLoaded] = useState(false);

  // Check if this is the specific admin user we want to give special permissions to
  const isSpecificAdmin = user?.id === import.meta.env.VITE_ADMIN_USER_ID &&
                         user?.email === import.meta.env.VITE_ADMIN_USER_EMAIL;

  // Check if admin access has been granted for this session
  const [hasSessionAccess, setHasSessionAccess] = useState(false);

  useEffect(() => {
    // Check if admin access has been granted for this session
    if (isSpecificAdmin && user) {
      const sessionKey = getAdminSessionKey(user.id);
      const hasAccess = localStorage.getItem(sessionKey) === 'true';
      setHasSessionAccess(hasAccess);
    } else {
      setHasSessionAccess(false);
    }
  }, [isSpecificAdmin, user]);

  useEffect(() => {
    // Initialize admin functions if the user is an admin or the specific admin user with session access
    if (user && (isAdmin || (isSpecificAdmin && hasSessionAccess))) {
      setIsAdminLoaded(true);
      console.log('Admin functions loaded for user:', user.email,
                 isAdmin ? '(is admin)' : '(has session access)');
    } else {
      setIsAdminLoaded(false);
    }
  }, [user, isAdmin, isSpecificAdmin, hasSessionAccess]);

  // Admin functions that use the Supabase Auth Admin API
  const adminFunctions = {
    // List all users
    listUsers: async () => {
      try {
        // Use the admin client with service role key
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error listing users:', error);
        toast({
          title: 'Error listing users',
          description: error.message || 'An error occurred while listing users.',
          variant: 'destructive',
        });
        return null;
      }
    },

    // Create a new user
    createUser: async (email: string, password: string, userData?: any) => {
      return createClient(email, password, userData);
    },

    // Delete a user
    deleteUser: async (userId: string) => {
      return deleteClient(userId);
    },

    // Update a user by ID
    updateUserById: async (userId: string, userData: any) => {
      try {
        // Use the admin client with service role key
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, userData);

        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error updating user:', error);
        toast({
          title: 'Error updating user',
          description: error.message || 'An error occurred while updating the user.',
          variant: 'destructive',
        });
        return null;
      }
    },

    // Reset password for a user
    resetPasswordForUser: async (userId: string, password: string) => {
      try {
        // Use the admin client with service role key
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password,
        });

        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error resetting password:', error);
        toast({
          title: 'Error resetting password',
          description: error.message || 'An error occurred while resetting the password.',
          variant: 'destructive',
        });
        return null;
      }
    },

    // Invite a user by email
    inviteUserByEmail: async (email: string, options?: any) => {
      try {
        // Use the admin client with service role key
        const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, options);

        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error inviting user:', error);
        toast({
          title: 'Error inviting user',
          description: error.message || 'An error occurred while inviting the user.',
          variant: 'destructive',
        });
        return null;
      }
    },

    // Update user subscription
    updateUserSubscription: async (userId: string, planName: string, status: SubscriptionStatus) => {
      return updateUserSubscription({ userId, planName, status });
    },
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLoaded, adminFunctions }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
