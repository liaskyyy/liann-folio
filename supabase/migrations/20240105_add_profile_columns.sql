-- Add profile_picture and resume_file columns to the about table
ALTER TABLE public.about
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS resume_file TEXT;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Allow uploads" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Allow updates" ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio');

CREATE POLICY "Allow deletes" ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio');
