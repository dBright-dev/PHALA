import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRETS } from './Secrets'; // Import our new secure object

// Pull strings cleanly from your hardcoded config container file
const supabaseUrl = SUPABASE_SECRETS.URL.trim();
const supabaseAnonKey = SUPABASE_SECRETS.ANON_KEY.trim();

if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.warn(
    '⚠️ Supabase Connection Warning: Please paste your real project keys ' +
    'inside config/Secrets.ts to connect to your live database instance.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});