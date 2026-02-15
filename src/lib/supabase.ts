import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safe initialization to prevent hard-crash on missing env vars
const getSupabaseClient = () => {
    if (!supabaseUrl || !supabaseKey) {
        console.warn('CRITICAL: Supabase Environment Variables are missing. Backend features will be disabled. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.');

        // Return a proxy that swallows calls but warns the developer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Proxy({} as any, {
            get: (_, prop) => {
                return () => {
                    console.error(`Supabase call to ".${String(prop)}" failed: Client not initialized due to missing environment variables.`);
                    return { from: () => ({ select: () => ({ order: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not initialized') }) }) }) }) }) };
                };
            }
        });
    }
    return createClient(supabaseUrl, supabaseKey);
};

export const supabase = getSupabaseClient();
