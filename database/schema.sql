-- ============================================
-- Alpine Skiing Video Platform - Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'athlete' CHECK (role IN ('admin', 'coach', 'athlete')),
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- VIDEOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  athlete_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- File info
  title TEXT NOT NULL,
  original_filename TEXT,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,

  -- Video metadata
  duration_seconds FLOAT,
  file_size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  fps FLOAT DEFAULT 30,

  -- Skiing metadata
  run_date DATE,
  location TEXT,
  discipline TEXT CHECK (discipline IN ('slalom', 'giant_slalom', 'super_g', 'downhill', 'combined', 'training')),
  tags TEXT[],
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMPARISONS TABLE (saved comparison sessions)
-- ============================================
CREATE TABLE IF NOT EXISTS comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

  video_1_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  video_2_id UUID REFERENCES videos(id) ON DELETE CASCADE,

  -- Sync points (seconds)
  sync_point_1 FLOAT DEFAULT 0,
  sync_point_2 FLOAT DEFAULT 0,

  title TEXT,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_videos_team_id ON videos(team_id);
CREATE INDEX IF NOT EXISTS idx_videos_athlete_id ON videos(athlete_id);
CREATE INDEX IF NOT EXISTS idx_videos_run_date ON videos(run_date);
CREATE INDEX IF NOT EXISTS idx_videos_discipline ON videos(discipline);
CREATE INDEX IF NOT EXISTS idx_profiles_team_id ON profiles(team_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Coaches can view team members
CREATE POLICY "Coaches can view team members" ON profiles
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid() AND role = 'coach'
    )
  );

-- VIDEOS POLICIES
-- Athletes can view their own videos
CREATE POLICY "Athletes can view own videos" ON videos
  FOR SELECT USING (athlete_id = auth.uid());

-- Coaches can view all team videos
CREATE POLICY "Coaches can view team videos" ON videos
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid() AND role IN ('coach', 'admin')
    )
  );

-- Coaches can insert videos
CREATE POLICY "Coaches can insert videos" ON videos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('coach', 'admin')
    )
  );

-- Coaches can update team videos
CREATE POLICY "Coaches can update team videos" ON videos
  FOR UPDATE USING (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid() AND role IN ('coach', 'admin')
    )
  );

-- Coaches can delete team videos
CREATE POLICY "Coaches can delete team videos" ON videos
  FOR DELETE USING (
    team_id IN (
      SELECT team_id FROM profiles WHERE id = auth.uid() AND role IN ('coach', 'admin')
    )
  );

-- COMPARISONS POLICIES
-- Users can view comparisons they created
CREATE POLICY "Users can view own comparisons" ON comparisons
  FOR SELECT USING (created_by = auth.uid());

-- Users can create comparisons
CREATE POLICY "Users can create comparisons" ON comparisons
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run this in Storage settings or via SQL:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('videos', 'videos', false);

-- Storage policies (run in Storage > Policies):
-- Allow authenticated users to upload
-- Allow users to download their own videos or team videos
