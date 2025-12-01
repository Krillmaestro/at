-- Meta Ads Automation - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- AD ACCOUNTS
-- ============================================
CREATE TABLE ad_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meta_account_id TEXT NOT NULL,
  meta_page_id TEXT NOT NULL,
  meta_pixel_id TEXT,
  meta_instagram_id TEXT,
  access_token TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, meta_account_id)
);

-- ============================================
-- DRIVE FOLDERS
-- ============================================
CREATE TABLE drive_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  folder_id TEXT NOT NULL,
  folder_name TEXT,
  watch_enabled BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, folder_id)
);

-- ============================================
-- ASSETS (Images/Videos from Google Drive)
-- ============================================
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  drive_folder_id UUID REFERENCES drive_folders(id) ON DELETE SET NULL,
  drive_file_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER,
  thumbnail_url TEXT,
  web_view_link TEXT,
  -- Meta upload results
  meta_asset_id TEXT,
  meta_asset_hash TEXT,
  -- AI analysis results
  ai_analysis JSONB,
  ai_suggested_copy JSONB,
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'downloading', 'analyzing', 'analyzed', 'uploading', 'uploaded', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, drive_file_id)
);

-- ============================================
-- CAMPAIGNS
-- ============================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  meta_campaign_id TEXT,
  name TEXT NOT NULL,
  objective TEXT DEFAULT 'OUTCOME_SALES',
  special_ad_categories TEXT[] DEFAULT ARRAY['NONE'],
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AD SETS
-- ============================================
CREATE TABLE ad_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  meta_adset_id TEXT,
  name TEXT NOT NULL,
  daily_budget INTEGER DEFAULT 500, -- in cents
  lifetime_budget INTEGER,
  optimization_goal TEXT DEFAULT 'OFFSITE_CONVERSIONS',
  billing_event TEXT DEFAULT 'IMPRESSIONS',
  bid_strategy TEXT DEFAULT 'LOWEST_COST_WITHOUT_CAP',
  pixel_id TEXT,
  custom_event_type TEXT DEFAULT 'ADD_TO_CART',
  targeting JSONB DEFAULT '{"geo_locations": {"countries": ["US"]}}',
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATIVES
-- ============================================
CREATE TABLE creatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  meta_creative_id TEXT,
  name TEXT NOT NULL,
  -- Ad copy
  primary_text TEXT,
  headline TEXT,
  description TEXT,
  call_to_action TEXT DEFAULT 'LEARN_MORE',
  destination_url TEXT,
  -- Creative config
  creative_type TEXT DEFAULT 'single_image' CHECK (creative_type IN ('single_image', 'single_video', 'multi_image', 'carousel')),
  object_story_spec JSONB,
  -- Multi-image support
  additional_asset_ids UUID[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'created', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADS
-- ============================================
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_set_id UUID REFERENCES ad_sets(id) ON DELETE CASCADE,
  creative_id UUID REFERENCES creatives(id) ON DELETE SET NULL,
  meta_ad_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'PAUSED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JOBS (Batch Operations)
-- ============================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('sync_folder', 'ai_analysis', 'create_ads', 'full_pipeline')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  progress INTEGER DEFAULT 0,
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  failed_items INTEGER DEFAULT 0,
  -- Configuration for this job
  config JSONB DEFAULT '{}',
  -- Results
  result JSONB,
  error_message TEXT,
  -- Timing
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JOB ITEMS (Individual items in a job)
-- ============================================
CREATE TABLE job_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'skipped')),
  step TEXT,
  error_message TEXT,
  -- Created Meta IDs
  meta_ids JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SETTINGS (User preferences)
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  -- Default ad settings
  default_ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE SET NULL,
  default_daily_budget INTEGER DEFAULT 500,
  default_optimization_goal TEXT DEFAULT 'OFFSITE_CONVERSIONS',
  default_custom_event_type TEXT DEFAULT 'ADD_TO_CART',
  default_targeting JSONB DEFAULT '{"geo_locations": {"countries": ["US"]}}',
  default_destination_url TEXT,
  default_call_to_action TEXT DEFAULT 'LEARN_MORE',
  -- Notification preferences
  slack_webhook_url TEXT,
  email_notifications BOOLEAN DEFAULT true,
  -- AI preferences
  auto_analyze_assets BOOLEAN DEFAULT true,
  use_ai_copy_suggestions BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOG
-- ============================================
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_assets_user_status ON assets(user_id, status);
CREATE INDEX idx_assets_drive_file ON assets(drive_file_id);
CREATE INDEX idx_jobs_user_status ON jobs(user_id, status);
CREATE INDEX idx_jobs_created ON jobs(created_at DESC);
CREATE INDEX idx_job_items_job ON job_items(job_id);
CREATE INDEX idx_creatives_asset ON creatives(asset_id);
CREATE INDEX idx_ads_adset ON ads(ad_set_id);
CREATE INDEX idx_activity_user ON activity_log(user_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can access own ad_accounts" ON ad_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own drive_folders" ON drive_folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own assets" ON assets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own ad_sets" ON ad_sets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own creatives" ON creatives FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own ads" ON ads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own jobs" ON jobs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own job_items" ON job_items FOR ALL USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_items.job_id AND jobs.user_id = auth.uid())
);
CREATE POLICY "Users can access own settings" ON settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own activity_log" ON activity_log FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_ad_accounts_updated_at BEFORE UPDATE ON ad_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_job_items_updated_at BEFORE UPDATE ON job_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_job_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO activity_log (user_id, action, entity_type, entity_id, job_id, details)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_job_id, p_details)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;
