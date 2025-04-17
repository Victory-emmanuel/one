// This file contains a Supabase client with admin privileges
// It should ONLY be used on the server side or in admin-specific contexts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fajtzqkkkaszbqemldel.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhanR6cWtra2FzemJxZW1sZGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDcxNTE2OCwiZXhwIjoyMDYwMjkxMTY4fQ.dBGWTOCpT8mqyxiizFib7a3FK6DEkq4eF4aLoMOtf2s";

// Create a Supabase client with the service role key
export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// IMPORTANT: This client has full admin rights to your database
// Only use it in secure contexts and never expose it to the client side
