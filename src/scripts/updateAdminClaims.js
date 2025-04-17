// This script updates the JWT claims for a specific admin user
// Run this script with: node src/scripts/updateAdminClaims.js

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabaseUrl = 'https://fajtzqkkkaszbqemldel.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhanR6cWtra2FzemJxZW1sZGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDcxNTE2OCwiZXhwIjoyMDYwMjkxMTY4fQ.dBGWTOCpT8mqyxiizFib7a3FK6DEkq4eF4aLoMOtf2s';

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

// The admin user ID and email
const adminUserId = '9b2d6b23-213e-44bf-9f30-b36164239fee';
const adminEmail = 'marketinglot.blog@gmail.com';

updateAdminClaims(adminUserId, adminEmail)
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
