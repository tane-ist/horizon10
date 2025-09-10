import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sthtvhmdclvgqynyjepq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aHR2aG1kY2x2Z3F5bnlqZXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzA2NTcsImV4cCI6MjA3MjkwNjY1N30.5GV9TUR1sHNGMo4TV37meoRkTS1jWkEeF8mGfsqwSIA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);