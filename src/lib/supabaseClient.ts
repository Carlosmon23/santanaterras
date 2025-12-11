import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://alnyrhzrhsepweapunwx.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbnlyaHpyaHNlcHdlYXB1bnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NzI0NjgsImV4cCI6MjA4MTA0ODQ2OH0.MpjUMmqLqVKWZZ9ZVKJoFo72jyvGKMkBU04jXn94mbw';

if (!url || !key) {
  console.error('Supabase URL ou ANON KEY não configurados');
}

export const supabase: SupabaseClient = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
