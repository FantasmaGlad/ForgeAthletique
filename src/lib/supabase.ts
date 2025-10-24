import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ujrcgswilbfvvgmtovbk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcmNnc3dpbGJmdnZnbXRvdmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDYzMDEsImV4cCI6MjA3Njg4MjMwMX0.Ga0IOvc8M0p1PFJ5ZtcOg5RBfmqQLSXQekTjP8IZPiI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables Supabase manquantes');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
