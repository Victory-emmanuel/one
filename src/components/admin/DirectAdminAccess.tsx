import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const DirectAdminAccess = () => {
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if this is the specific admin user
  const isTargetAdmin = user?.id === '9b2d6b23-213e-44bf-9f30-b36164239fee' &&
                        user?.email === 'marketinglot.blog@gmail.com';

  const grantAdminAccess = async () => {
    if (!isTargetAdmin) return;

    setIsLoading(true);

    try {
      // Update user metadata only - this will update the JWT claims
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          role: 'admin',
          is_admin: true
        }
      });

      if (metadataError) throw metadataError;

      // Sign out and sign back in to refresh the JWT token
      await supabase.auth.signOut();

      toast({
        title: 'Admin access granted',
        description: 'Please sign in again to activate your admin access.',
      });

      // Navigate to admin login page
      navigate('/admin-login');
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

  // Only show this component for the target admin
  if (!isTargetAdmin) return null;

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-yellow-500" />
          <CardTitle>Admin Access</CardTitle>
        </div>
        <CardDescription>
          Grant admin access to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Your account is identified as an admin but may not have the proper permissions set.
          Click the button below to grant yourself admin access to the dashboard.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={grantAdminAccess}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Granting access...
            </>
          ) : (
            'Grant Admin Access'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DirectAdminAccess;
