-- ==============================================================================
-- Supabase Migration: Create prayer_times table for Madina Masjid MKB Nagar
-- Table: prayer_times
-- Columns:
--   id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
--   prayer_date: DATE NOT NULL UNIQUE
--   fajr: TIME NOT NULL
--   sunrise: TIME
--   dhuhr: TIME NOT NULL
--   asr: TIME NOT NULL
--   maghrib: TIME NOT NULL
--   isha: TIME NOT NULL
--   jummah_1: TIME
--   jummah_2: TIME
--   jummah_3: TIME
--   created_at: TIMESTAMPTZ DEFAULT now()
--   updated_at: TIMESTAMPTZ DEFAULT now()
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.prayer_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_date DATE NOT NULL UNIQUE,
  fajr TIME WITHOUT TIME ZONE NOT NULL,
  sunrise TIME WITHOUT TIME ZONE,
  dhuhr TIME WITHOUT TIME ZONE NOT NULL,
  asr TIME WITHOUT TIME ZONE NOT NULL,
  maghrib TIME WITHOUT TIME ZONE NOT NULL,
  isha TIME WITHOUT TIME ZONE NOT NULL,
  jummah_1 TIME WITHOUT TIME ZONE,
  jummah_2 TIME WITHOUT TIME ZONE,
  jummah_3 TIME WITHOUT TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prayer_times_prayer_date ON public.prayer_times (prayer_date);

-- Enable RLS
ALTER TABLE public.prayer_times ENABLE ROW LEVEL SECURITY;

-- Read policy
DROP POLICY IF EXISTS "Allow public read access to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public read access to prayer_times"
  ON public.prayer_times FOR SELECT TO public USING (true);

-- Insert policy
DROP POLICY IF EXISTS "Allow public insert to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public insert to prayer_times"
  ON public.prayer_times FOR INSERT TO public WITH CHECK (true);

-- Update policy
DROP POLICY IF EXISTS "Allow public update to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public update to prayer_times"
  ON public.prayer_times FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Delete policy
DROP POLICY IF EXISTS "Allow public delete to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public delete to prayer_times"
  ON public.prayer_times FOR DELETE TO public USING (true);

-- Auto updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_prayer_times_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prayer_times_updated_at ON public.prayer_times;
CREATE TRIGGER tr_prayer_times_updated_at
  BEFORE UPDATE ON public.prayer_times
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_prayer_times_updated_at();

-- Seed initial record for current date
INSERT INTO public.prayer_times (prayer_date, fajr, sunrise, dhuhr, asr, maghrib, isha, jummah_1, jummah_2, jummah_3)
VALUES 
  (CURRENT_DATE, '05:12:00', '06:28:00', '13:04:00', '16:32:00', '19:14:00', '20:36:00', '13:15:00', '14:15:00', NULL)
ON CONFLICT (prayer_date) DO UPDATE SET
  fajr = EXCLUDED.fajr,
  sunrise = EXCLUDED.sunrise,
  dhuhr = EXCLUDED.dhuhr,
  asr = EXCLUDED.asr,
  maghrib = EXCLUDED.maghrib,
  isha = EXCLUDED.isha,
  jummah_1 = EXCLUDED.jummah_1,
  jummah_2 = EXCLUDED.jummah_2,
  jummah_3 = EXCLUDED.jummah_3,
  updated_at = NOW();
