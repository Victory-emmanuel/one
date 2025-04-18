import { supabase } from '@/integrations/supabase/client';

// Store the last time we updated the JWT to avoid rate limiting
let lastJwtUpdateTime = 0;
const JWT_UPDATE_COOLDOWN = 60000; // 1 minute cooldown

/**
 * Ensures that the admin role is properly set in the JWT claims
 * This is needed because RLS policies check the JWT claims
 */
export const ensureAdminRole = async (): Promise<boolean> => {
  try {
    // Get the current user and session
    const { data: { user } } = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();

    if (!user) return false;

    // Check if the user has the admin role in their metadata
    const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.is_admin === true;

    if (!isAdmin) return false;

    // Check if the JWT already has the admin role
    const jwtHasAdminRole = session?.access_token && (
      (session.user.app_metadata?.role === 'admin') ||
      (session.user.app_metadata?.is_admin === true) ||
      (session.user.role === 'admin')
    );

    // If the JWT already has the admin role, no need to update
    if (jwtHasAdminRole) {
      console.log('JWT already has admin role');
      return true;
    }

    // Check if we're within the cooldown period
    const now = Date.now();
    if (now - lastJwtUpdateTime < JWT_UPDATE_COOLDOWN) {
      console.log('JWT update on cooldown, skipping');
      return true; // Return true to avoid blocking the UI
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
      return false;
    }

    // Update the last update time
    lastJwtUpdateTime = now;
    console.log('JWT updated with admin role');
    return true;
  } catch (error) {
    console.error('Error ensuring admin role:', error);
    return false;
  }
};
