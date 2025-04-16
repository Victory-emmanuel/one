// This script is for development purposes only
// It makes a user an admin by setting the is_admin field to true in the profiles table

// Usage: node makeAdmin.js <user_email>

const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://fajtzqkkkaszbqemldel.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhanR6cWtra2FzemJxZW1sZGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI0MzQ0NzIsImV4cCI6MTk5ODAxMDQ3Mn0.SZekMQQb7QO-0t9GtRUOVaSl_Wt3c_W-CKd6rIVIvIY';

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
