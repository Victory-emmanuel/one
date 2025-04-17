/**
 * Types related to user management
 */
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  role?: 'admin' | 'client' | 'user';
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
  phone?: string;
  company?: string;
  [key: string]: any; // For any additional fields
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  signupDate: string;
  avatar: string;
  user_metadata?: Record<string, unknown>;
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
}
