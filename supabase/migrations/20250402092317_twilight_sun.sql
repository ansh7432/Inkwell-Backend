/*
  # Fix profiles and posts tables

  1. Changes
    - Add email column to profiles table
    - Ensure proper foreign key constraints
    - Add RLS policies

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users
*/

-- Add email column to profiles table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;

-- Update RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Ensure proper policies are in place
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure posts table has proper foreign key constraint
ALTER TABLE posts
  DROP CONSTRAINT IF EXISTS posts_author_id_fkey,
  ADD CONSTRAINT posts_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;