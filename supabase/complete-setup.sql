-- Complete database setup script for Supabase authentication
-- Run this script in the Supabase SQL Editor to set up the database
-- This consolidates all migration files into a single executable script

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- INITIAL SCHEMA SETUP (001_initial_schema.sql)
-- =============================================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_updated_at_idx ON public.profiles(updated_at);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- =============================================================================
-- ENHANCED SECURITY SETUP (002_enhanced_security.sql)
-- =============================================================================

-- Function to validate email format
CREATE OR REPLACE FUNCTION public.is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Enhanced function to handle new user creation with validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
  user_avatar TEXT;
BEGIN
  -- Extract user data with null checks
  user_email := COALESCE(NEW.email, '');
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name');
  user_avatar := NEW.raw_user_meta_data->>'avatar_url';

  -- Validate email format
  IF NOT public.is_valid_email(user_email) THEN
    RAISE EXCEPTION 'Invalid email format: %', user_email;
  END IF;

  -- Insert profile with validation
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    user_email,
    user_name,
    user_avatar
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and re-raise
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add constraint to ensure email is not empty
ALTER TABLE profiles 
ADD CONSTRAINT profiles_email_not_empty 
CHECK (email IS NOT NULL AND email != '');

-- Add constraint for name length
ALTER TABLE profiles 
ADD CONSTRAINT profiles_name_length 
CHECK (name IS NULL OR (LENGTH(name) >= 1 AND LENGTH(name) <= 100));

-- Create additional indexes for better query performance
CREATE INDEX IF NOT EXISTS profiles_name_idx ON profiles(name) WHERE name IS NOT NULL;

-- Function to get user profile with error handling
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS profiles AS $$
DECLARE
  user_profile profiles;
BEGIN
  SELECT * INTO user_profile
  FROM profiles
  WHERE id = user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found for user: %', user_id;
  END IF;

  RETURN user_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile(UUID) TO authenticated;

-- Create a view for safe profile access
CREATE OR REPLACE VIEW public.safe_profiles AS
SELECT 
  id,
  email,
  name,
  avatar_url,
  created_at,
  updated_at
FROM profiles;

-- Grant access to the view
GRANT SELECT ON public.safe_profiles TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles table with enhanced security and validation';
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to create user profile on auth.users insert with validation';
COMMENT ON FUNCTION public.get_user_profile(UUID) IS 'Safe function to retrieve user profile with error handling';

-- =============================================================================
-- VERIFICATION SECTION
-- =============================================================================

DO $$
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
$$;