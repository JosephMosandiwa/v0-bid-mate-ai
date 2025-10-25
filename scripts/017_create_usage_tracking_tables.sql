-- Create usage tracking tables for monitoring costs and usage

-- Table to track AI analysis usage
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tender_id UUID REFERENCES scraped_tenders(id) ON DELETE SET NULL,
  model_used TEXT NOT NULL DEFAULT 'gpt-4o',
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost_usd DECIMAL(10, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track scraping usage
CREATE TABLE IF NOT EXISTS scraping_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id INTEGER REFERENCES tender_sources(id) ON DELETE SET NULL,
  scrape_type TEXT NOT NULL, -- 'manual', 'cron', 'bulk'
  tenders_found INTEGER NOT NULL DEFAULT 0,
  api_credits_used INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track blob storage usage (snapshots)
CREATE TABLE IF NOT EXISTS storage_usage_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_files INTEGER NOT NULL DEFAULT 0,
  total_size_bytes BIGINT NOT NULL DEFAULT 0,
  total_size_gb DECIMAL(10, 4) NOT NULL DEFAULT 0,
  estimated_cost_usd DECIMAL(10, 4) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track overall monthly usage summary
CREATE TABLE IF NOT EXISTS monthly_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  ai_analyses_count INTEGER NOT NULL DEFAULT 0,
  ai_total_cost_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  scraping_requests_count INTEGER NOT NULL DEFAULT 0,
  scraping_credits_used INTEGER NOT NULL DEFAULT 0,
  storage_avg_gb DECIMAL(10, 4) NOT NULL DEFAULT 0,
  storage_cost_usd DECIMAL(10, 4) NOT NULL DEFAULT 0,
  total_estimated_cost_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month_year)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_scraping_usage_logs_created_at ON scraping_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_monthly_usage_summary_month_year ON monthly_usage_summary(month_year);

-- Enable Row Level Security
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_usage_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_usage_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies (admin only access)
CREATE POLICY "Admin can view all ai_usage_logs" ON ai_usage_logs
  FOR SELECT USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM profiles WHERE email LIKE '%admin%'
  ));

CREATE POLICY "Admin can view all scraping_usage_logs" ON scraping_usage_logs
  FOR SELECT USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM profiles WHERE email LIKE '%admin%'
  ));

CREATE POLICY "Admin can view all storage_usage_snapshots" ON storage_usage_snapshots
  FOR SELECT USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM profiles WHERE email LIKE '%admin%'
  ));

CREATE POLICY "Admin can view all monthly_usage_summary" ON monthly_usage_summary
  FOR SELECT USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM profiles WHERE email LIKE '%admin%'
  ));
