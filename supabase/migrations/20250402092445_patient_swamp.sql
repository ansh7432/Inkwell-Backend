/*
  # Fix profile creation and constraints

  1. Changes
    - Ensure profiles table has proper constraints
    - Add default values for required fields
    - Update RLS policies

  2. Security
    - Maintain RLS policies for profiles table
*/

-- Add default values and ensure proper constraints
ALTER TABLE profiles
ALTER COLUMN username SET DEFAULT '',
ALTER COLUMN email SET DEFAULT '';

-- Update RLS policies for profiles
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure proper foreign key constraints
ALTER TABLE posts
DROP CONSTRAINT IF EXISTS posts_author_id_fkey,
ADD CONSTRAINT posts_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;