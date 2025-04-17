// This script updates the JWT claims for a specific admin user
// Run this script with: node src/scripts/updateAdminClaims.js

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
// Load environment variables from .env file
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_KEY environment variables are required');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function updateAdminClaims(userId, email) {
  try {
    console.log(`Updating JWT claims for admin user ${email} (${userId})...`);

    // Update user metadata
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
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

    if (userError) {
      throw userError;
    }

    console.log('User metadata updated:', userData);

    // Update profile in the profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        is_admin: true,
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    if (profileError) {
      throw profileError;
    }

    console.log('Profile updated:', profileData);

    console.log(`Admin claims updated for user ${email}`);
  } catch (error) {
    console.error('Error updating admin claims:', error);
  }
}

// The admin user ID and email from environment variables
const adminUserId = process.env.VITE_ADMIN_USER_ID;
const adminEmail = process.env.VITE_ADMIN_USER_EMAIL;

if (!adminUserId || !adminEmail) {
  console.error('VITE_ADMIN_USER_ID and VITE_ADMIN_USER_EMAIL environment variables are required');
  process.exit(1);
}

updateAdminClaims(adminUserId, adminEmail)
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
