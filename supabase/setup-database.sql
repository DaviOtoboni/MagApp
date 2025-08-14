-- Complete database setup script for Supabase authentication
-- Run this script in the Supabase SQL Editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run initial schema migration
\i 001_initial_schema.sql

-- Run enhanced security migration
\i 002_enhanced_security.sql

-- Verify setup by checking if everything was created correctly
DO $
DECLARE
  table_count INTEGER;
  policy_count INTEGER;
  function_count INTEGER;
  trigger_count INTEGER;
BEGIN
  -- Check if profiles table exists
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'profiles';
  
  IF table_count = 0 THEN
    RAISE EXCEPTION 'Profiles table was not created successfully';
  END IF;

  -- Check if RLS policies exist
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'profiles';
  
  IF policy_count < 3 THEN
    RAISE WARNING 'Expected at least 3 RLS policies, found %', policy_count;
  END IF;

  -- Check if functions exist
  SELECT COUNT(*) INTO function_count
  FROM information_schema.routines
  WHERE routine_schema = 'public' 
  AND routine_name IN ('handle_new_user', 'handle_updated_at', 'get_user_profile', 'is_valid_email');
  
  IF function_count < 4 THEN
    RAISE WARNING 'Expected 4 functions, found %', function_count;
  END IF;

  -- Check if triggers exist
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE event_object_schema = 'public' 
  AND event_object_table = 'profiles'
  AND trigger_name IN ('on_profiles_updated');
  
  -- Check auth trigger separately
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users'
  AND trigger_name = 'on_auth_user_created';
  
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables: %, Policies: %, Functions: %, Triggers: %', 
    table_count, policy_count, function_count, trigger_count;
END;
$;