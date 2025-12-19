-- Creating table to track scraping progress in real-time
CREATE TABLE IF NOT EXISTS scraping_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'running', -- running, completed, failed
  total_sources INTEGER DEFAULT 0,
  completed_sources INTEGER DEFAULT 0,
  current_source TEXT,
  current_source_id INTEGER,
  total_tenders INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_scraping_progress_status ON scraping_progress(status);
CREATE INDEX IF NOT EXISTS idx_scraping_progress_created ON scraping_progress(created_at DESC);
