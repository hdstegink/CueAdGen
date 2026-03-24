import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseKey) {
  console.warn('SUPABASE_KEY is not set. Supabase operations will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
