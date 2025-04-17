/**
 * Service for managing users
 */
import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin } from '@/integrations/supabase/adminClient';
import { UserProfile, ClientData } from '@/types/user';
import { toast } from '@/components/ui/use-toast';

/**
 * Get a user's profile
 * @param userId The user ID
 * @returns The user profile or null if not found
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Update a user's profile
 * @param userId The user ID
 * @param profileData The profile data to update
 * @returns True if successful, false otherwise
 */
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    toast({
      title: 'Error updating profile',
      description: 'Could not update your profile. Please try again later.',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Get all clients (admin only)
 * @returns Array of client data
 */
export const getAllClients = async (): Promise<ClientData[]> => {
  try {
    // Fetch all users using the admin client
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();

    if (userError) throw userError;

    // Get subscription data for each user
    const { data: subscriptionsData, error: subscriptionsError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*, plan:pricing_plans(*)');

    if (subscriptionsError) throw subscriptionsError;

    // Get profiles data for each user
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;

    // Transform auth users data to match the expected format
    const clientsData = userData.users.map(user => {
      // Find subscription for this user
      const subscription = subscriptionsData?.find(sub => sub.user_id === user.id);

      // Find profile for this user
      const profile = profilesData?.find(profile => profile.id === user.id);

      return {
        id: user.id,
        name: profile?.full_name || user.user_metadata?.full_name || 'Unknown',
        email: user.email || '',
        plan: subscription?.plan?.name || 'Basic',
        status: subscription?.status || 'inactive',
        signupDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : '',
        avatar: profile?.avatar_url || '',
        user_metadata: user.user_metadata || {}
      };
    });

    return clientsData;
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

/**
 * Create a new client (admin only)
 * @param email The client's email
 * @param password The client's password
 * @param userData The client's user data
 * @returns The created user or null if failed
 */
export const createClient = async (email: string, password: string, userData: any): Promise<any> => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userData || {},
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating client:', error);
    toast({
      title: 'Error creating client',
      description: error.message || 'An error occurred while creating the client.',
      variant: 'destructive',
    });
    return null;
  }
};

/**
 * Delete a client (admin only)
 * @param userId The client's user ID
 * @returns True if successful, false otherwise
 */
export const deleteClient = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error deleting client:', error);
    toast({
      title: 'Error deleting client',
      description: error.message || 'An error occurred while deleting the client.',
      variant: 'destructive',
    });
    return false;
  }
};
