-- Enhanced security and performance improvements for profiles table
-- This migration adds additional security policies and optimizations

-- Add additional RLS policies for better security
CREATE POLICY "Enable read access for authenticated users on own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy to prevent unauthorized profile creation
CREATE POLICY "Prevent unauthorized profile creation" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id AND 
    auth.uid() IS NOT NULL
  );

-- Policy for profile updates with additional validation
CREATE POLICY "Enable profile updates for authenticated users" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Ensure email cannot be changed to empty
    email IS NOT NULL AND
    email != ''
  );

-- Function to validate email format
CREATE OR REPLACE FUNCTION public.is_valid_email(email TEXT)
RETURNS BOOLEAN AS $
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$ LANGUAGE plpgsql IMMUTABLE;

-- Enhanced function to handle new user creation with validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
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
$ LANGUAGE plpgsql SECURITY DEFINER;

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
CREATE INDEX IF NOT EXISTS profiles_updated_at_idx ON profiles(updated_at);

-- Function to get user profile with error handling
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS profiles AS $
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
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile(UUID) TO authenticated;

-- Create a view for safe profile access (excluding sensitive data if needed)
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

-- Add comment for documentation
COMMENT ON TABLE profiles IS 'User profiles table with enhanced security and validation';
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to create user profile on auth.users insert with validation';
COMMENT ON FUNCTION public.get_user_profile(UUID) IS 'Safe function to retrieve user profile with error handling';