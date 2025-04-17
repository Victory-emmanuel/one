// This file contains a Supabase client with admin privileges
// It should ONLY be used on the server side or in admin-specific contexts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Create a Supabase client with the service role key
export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// IMPORTANT: This client has full admin rights to your database
// Only use it in secure contexts and never expose it to the client side
