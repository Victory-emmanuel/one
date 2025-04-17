import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { getAdminSessionKey } from '@/constants/auth';

const AdminAccessButton = () => {
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  // Check if this is the specific admin user
  const isSpecificAdmin = user?.id === '9b2d6b23-213e-44bf-9f30-b36164239fee' &&
                         user?.email === 'marketinglot.blog@gmail.com';

  // Check if access has been granted in this session
  useEffect(() => {
    if (isSpecificAdmin && user) {
      // Create a unique key for this user session
      const sessionKey = getAdminSessionKey(user.id);
      const hasAccess = localStorage.getItem(sessionKey) === 'true';
      setAccessGranted(hasAccess);
    }
  }, [isSpecificAdmin, user]);

  if (!isSpecificAdmin) {
    return null;
  }

  // If access is already granted, show a success button
  if (accessGranted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="ml-auto bg-green-50 text-green-600 border-green-200"
        disabled
      >
        <Check className="mr-2 h-4 w-4" />
        API Access Granted
      </Button>
    );
  }

  const handleGrantAdminAccess = async () => {
    setIsLoading(true);

    try {
      // Update user metadata
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: {
            role: 'admin',
            is_admin: true
          },
          app_metadata: {
            role: 'admin',
            is_admin: true
          }
        }
      );

      if (error) throw error;

      // Update profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          is_admin: true,
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Refresh the profile
      await refreshProfile();

      // Store access granted state in localStorage for this session
      if (user) {
        const sessionKey = getAdminSessionKey(user.id);
        localStorage.setItem(sessionKey, 'true');
        setAccessGranted(true);
      }

      toast({
        title: 'Admin access granted',
        description: 'You now have full access to the Supabase Auth Admin API for this session.',
      });
    } catch (error: any) {
      console.error('Error granting admin access:', error);
      toast({
        title: 'Error granting admin access',
        description: error.message || 'An error occurred while granting admin access.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGrantAdminAccess}
      disabled={isLoading}
      className="ml-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Granting access...
        </>
      ) : (
        <>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Grant Admin API Access
        </>
      )}
    </Button>
  );
};

export default AdminAccessButton;
