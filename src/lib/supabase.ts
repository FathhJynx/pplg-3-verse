import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('CRITICAL: Supabase Environment Variables are missing. Backend features will be disabled. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.');
}

// Fallback to empty strings to prevent createClient from crashing if vars are missing, 
// though downstream API calls will still fail and be caught by the service layer.
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
