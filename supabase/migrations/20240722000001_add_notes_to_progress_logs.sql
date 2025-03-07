-- Add notes column to progress_logs table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'progress_logs' AND column_name = 'notes') THEN
        ALTER TABLE progress_logs ADD COLUMN notes TEXT;
    END IF;
END
$$;

-- Enable realtime for progress_logs
alter publication supabase_realtime add table progress_logs;