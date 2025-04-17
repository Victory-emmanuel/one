// This script is for development purposes only
// It makes a user an admin by setting the is_admin field to true in the profiles table

// Usage: node makeAdmin.js <user_email>

const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file
require('dotenv').config();

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeAdmin(email) {
  try {
    // Get the user by email
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id, email, is_admin')
      .eq('email', email)
      .limit(1);

    if (userError) {
      throw userError;
    }

    if (!users || users.length === 0) {
      console.error(`User with email ${email} not found`);
      return;
    }

    const user = users[0];

    if (user.is_admin) {
      console.log(`User ${email} is already an admin`);
      return;
    }

    // Update the user to be an admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`User ${email} is now an admin`);
  } catch (error) {
    console.error('Error making user an admin:', error);
  }
}

// Get the email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.error('Usage: node makeAdmin.js <user_email>');
  process.exit(1);
}

makeAdmin(email);
