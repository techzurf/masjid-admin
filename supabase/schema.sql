-- ==============================================================================
-- Supabase Schema: prayer_times for Madina Masjid MKB Nagar
-- Exact structure requested:
-- id: UUID PRIMARY KEY gen_random_uuid()
-- prayer_date: DATE NOT NULL UNIQUE (prevents duplicates)
-- fajr: TIME NOT NULL
-- sunrise: TIME (Optional)
-- dhuhr: TIME NOT NULL
-- asr: TIME NOT NULL
-- maghrib: TIME NOT NULL
-- isha: TIME NOT NULL
-- jummah_1: TIME (Optional)
-- jummah_2: TIME (Optional)
-- jummah_3: TIME (Optional)
-- created_at: TIMESTAMPTZ DEFAULT now()
-- updated_at: TIMESTAMPTZ DEFAULT now()
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

-- Index for fast lookup by prayer_date
CREATE INDEX IF NOT EXISTS idx_prayer_times_prayer_date ON public.prayer_times (prayer_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.prayer_times ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Single-Masjid Prototype:
-- 1. Public / App Read Access
DROP POLICY IF EXISTS "Allow public read access to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public read access to prayer_times"
  ON public.prayer_times
  FOR SELECT
  TO public
  USING (true);

-- 2. Insert Access for Admin (Anon & Authenticated)
DROP POLICY IF EXISTS "Allow public insert to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public insert to prayer_times"
  ON public.prayer_times
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 3. Update Access for Admin
DROP POLICY IF EXISTS "Allow public update to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public update to prayer_times"
  ON public.prayer_times
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- 4. Delete Access for Admin
DROP POLICY IF EXISTS "Allow public delete to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public delete to prayer_times"
  ON public.prayer_times
  FOR DELETE
  TO public
  USING (true);

-- Auto-update updated_at timestamp trigger
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

-- Seed initial record for today and tomorrow for Madina Masjid MKB Nagar
INSERT INTO public.prayer_times (prayer_date, fajr, sunrise, dhuhr, asr, maghrib, isha, jummah_1, jummah_2, jummah_3)
VALUES 
  (CURRENT_DATE, '05:12:00', '06:28:00', '13:04:00', '16:32:00', '19:14:00', '20:36:00', '13:15:00', '14:15:00', NULL),
  (CURRENT_DATE + INTERVAL '1 day', '05:12:00', '06:28:00', '13:04:00', '16:31:00', '19:13:00', '20:35:00', '13:15:00', '14:15:00', NULL)
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

-- ==============================================================================
-- Supabase Schema: community_members for Madina Masjid MKB Nagar
-- Stores community registrations submitted via the Public Registration Screen
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  gender TEXT,
  date_of_birth DATE,
  address TEXT,
  notes TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index for lookup and sorting
CREATE INDEX IF NOT EXISTS idx_community_members_created_at ON public.community_members (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_members_mobile ON public.community_members (mobile_number);

-- Enable Row Level Security (RLS)
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- 1. Insert Policy (Public / Anonymous users can submit registration)
DROP POLICY IF EXISTS "Allow public registration insert" ON public.community_members;
CREATE POLICY "Allow public registration insert"
  ON public.community_members
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 2. Select Policy (Allowed for reading registrations in admin panel)
DROP POLICY IF EXISTS "Allow select community_members" ON public.community_members;
CREATE POLICY "Allow select community_members"
  ON public.community_members
  FOR SELECT
  TO public
  USING (true);

-- 3. Update Policy (Admin update access)
DROP POLICY IF EXISTS "Allow update community_members" ON public.community_members;
CREATE POLICY "Allow update community_members"
  ON public.community_members
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- 4. Delete Policy (Admin delete access)
DROP POLICY IF EXISTS "Allow delete community_members" ON public.community_members;
CREATE POLICY "Allow delete community_members"
  ON public.community_members
  FOR DELETE
  TO public
  USING (true);

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS tr_community_members_updated_at ON public.community_members;
CREATE TRIGGER tr_community_members_updated_at
  BEFORE UPDATE ON public.community_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_prayer_times_updated_at();

