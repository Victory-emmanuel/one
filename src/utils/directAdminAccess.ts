import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Directly grants admin access to the current user by updating their JWT claims
 * This is a more direct approach that should work even if other methods fail
 */
export const grantDirectAdminAccess = async (): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You need to be logged in to access admin features.',
        variant: 'destructive',
      });
      return false;
    }
    
    // Update the user's JWT claims to include the admin role
    const { error } = await supabase.auth.updateUser({
      data: {
        role: 'admin',
        is_admin: true
      }
    });
    
    if (error) {
      console.error('Error updating user claims:', error);
      toast({
        title: 'Error granting admin access',
        description: error.message || 'An error occurred while granting admin access.',
        variant: 'destructive',
      });
      return false;
    }
    
    toast({
      title: 'Admin access granted',
      description: 'You now have admin access to manage blog posts.',
    });
    
    return true;
  } catch (error: any) {
    console.error('Error granting admin access:', error);
    toast({
      title: 'Error granting admin access',
      description: error.message || 'An error occurred while granting admin access.',
      variant: 'destructive',
    });
    return false;
  }
};
