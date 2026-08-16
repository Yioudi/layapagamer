// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.PUBLIC_SUPABASE_URL ||
  'https://etnzpnnqnzsmovbqqrnw.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bnpwbm5xbnpzbW92YnFxcm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NjU2MzgsImV4cCI6MjEwMjI0MTYzOH0.ECAKaX3iOH2Z-wkq_lLZ8lu6QvkB8DxIKZJEGPce7jM';

export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);