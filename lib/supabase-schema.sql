-- Supabase SQL för att skapa tabellen för landningssideanalyser
-- Kör detta i Supabase SQL Editor

CREATE TABLE IF NOT EXISTS landing_page_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id TEXT NOT NULL,
  url TEXT NOT NULL,
  email TEXT,
  industry TEXT,
  primary_goal TEXT,
  current_conversion TEXT,
  biggest_frustration TEXT,
  page_title TEXT,
  meta_description TEXT,
  h1_headings JSONB,
  h2_headings JSONB,
  cta_buttons JSONB,
  form_count INTEGER,
  word_count INTEGER,
  image_count INTEGER,
  images_with_alt INTEGER,
  has_mobile_viewport BOOLEAN,
  detected_tech JSONB,
  grade TEXT,
  score INTEGER,
  design_analysis TEXT,
  copy_analysis TEXT,
  seo_analysis TEXT,
  strategy_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index för snabbare sökningar
CREATE INDEX IF NOT EXISTS idx_audits_email ON landing_page_audits(email);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON landing_page_audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_grade ON landing_page_audits(grade);

-- Row Level Security (RLS)
ALTER TABLE landing_page_audits ENABLE ROW LEVEL SECURITY;

-- Policy för att läsa alla audits (kan anpassas efter behov)
CREATE POLICY "Tillåt läsning av audits" ON landing_page_audits
  FOR SELECT USING (true);

-- Policy för att infoga nya audits
CREATE POLICY "Tillåt infogning av audits" ON landing_page_audits
  FOR INSERT WITH CHECK (true);

-- Trigger för att uppdatera updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_landing_page_audits_updated_at
  BEFORE UPDATE ON landing_page_audits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
