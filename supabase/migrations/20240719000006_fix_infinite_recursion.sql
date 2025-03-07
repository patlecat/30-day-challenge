-- Drop existing policies that might be causing infinite recursion
DROP POLICY IF EXISTS "Users can view their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can insert their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can update their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can delete their own challenges" ON challenges;

-- Create simple policies without recursive conditions
CREATE POLICY "Users can view their own challenges"
ON challenges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges"
ON challenges FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
ON challenges FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenges"
ON challenges FOR DELETE
USING (auth.uid() = user_id);

-- Add a public access policy for testing if needed
CREATE POLICY "Public read access"
ON challenges FOR SELECT
USING (true);
