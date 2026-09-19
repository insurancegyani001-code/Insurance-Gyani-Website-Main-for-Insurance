import { createClient } from '@supabase/supabase-js';

// Apni Supabase project ki real URL aur Anon Key yahan dalein
const supabaseUrl = 'https://wgpjsihzqxcijqvhbojv.supabase.co';
const supabaseAnonKey = 'sb_publishable_QFrJ-wBpp7o5myE0ozVM4Q_-OXs5Rst';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);