import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('marketinglot.blog@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if this is the admin user
      if (data.user?.id === '9b2d6b23-213e-44bf-9f30-b36164239fee') {
        // Update user metadata only - this will update the JWT claims
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            role: 'admin',
            is_admin: true
          }
        });

        if (metadataError) {
          console.error('Error updating user metadata:', metadataError);
          throw metadataError;
        }

        // Sign out and sign back in to refresh the JWT token with the new claims
        await supabase.auth.signOut();

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Refresh the profile to update the isAdmin state
        await refreshProfile();

        toast({
          title: 'Admin login successful',
          description: 'You have been logged in as an admin.',
        });

        // Navigate to admin dashboard
        navigate('/admin');
      } else {
        toast({
          title: 'Not an admin user',
          description: 'This login page is only for admin users.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-marketing-blue" />
            <CardTitle>Admin Login</CardTitle>
          </div>
          <CardDescription>
            Login to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled
              />
              <p className="text-xs text-muted-foreground">
                This admin login is specifically for marketinglot.blog@gmail.com
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login as Admin'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
