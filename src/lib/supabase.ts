import { createClient } from '@supabase/supabase-js';

// Hardcoded values to prevent environment variable issues
const supabaseUrl = "https://eilngpeznczwxlfkhwai.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpbG5ncGV6bmN6d3hsZmtod2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NDM3MzYsImV4cCI6MjA4NzQxOTczNn0.sbG4WoNTd-qXdguVAvIlL6yQILWbjy6vMBW_r5fqM0A";

// Validate URL format
if (!supabaseUrl.startsWith('http')) {
  console.error('Invalid Supabase URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
