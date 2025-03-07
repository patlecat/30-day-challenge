-- Add description column if it doesn't exist yet
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS description TEXT;

-- Ensure the type column accepts all challenge types
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_type_check;
ALTER TABLE challenges ADD CONSTRAINT challenges_type_check CHECK (type IN ('distance', 'quantity', 'time', 'prose'));

-- Ensure daily_goal is text type to support all formats
ALTER TABLE challenges ALTER COLUMN daily_goal TYPE text USING daily_goal::text;

-- Add publication for realtime
alter publication supabase_realtime add table challenges;