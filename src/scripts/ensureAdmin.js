// This script ensures that a user is an admin by updating both the profiles table and the user metadata
// Run this script with: node src/scripts/ensureAdmin.js

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://fajtzqkkkaszbqemldel.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin operations

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureAdmin(userId, email) {
  try {
    console.log(`Ensuring user ${email} (${userId}) is an admin...`);
    
    // Update the profiles table
    const { data: profileData, error: profileError } = await supabase
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
    
    // Update the user metadata in auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          role: 'admin',
          is_admin: true
        }
      }
    );
    
    if (userError) {
      throw userError;
    }
    
    console.log('User metadata updated:', userData);
    
    console.log(`User ${email} is now an admin`);
  } catch (error) {
    console.error('Error ensuring admin status:', error);
  }
}

// The user ID and email to make an admin
const userId = '9b2d6b23-213e-44bf-9f30-b36164239fee';
const email = 'marketinglot.blog@gmail.com';

ensureAdmin(userId, email)
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
