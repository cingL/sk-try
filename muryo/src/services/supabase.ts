import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Missing Supabase environment variables. Please check GitHub Secrets.';
  console.error(errorMsg, {
    VITE_SUPABASE_URL: supabaseUrl ? 'set' : 'missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'set' : 'missing',
  });
  // Don't throw immediately - let the app render and show error in ErrorBoundary
  // This allows users to see what went wrong instead of a blank page
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');
