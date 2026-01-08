-- Tender Orchestration Progress Tracking Table
-- Tracks real-time progress of multi-engine analysis

CREATE TABLE IF NOT EXISTS tender_orchestration_progress (
  id UUID PRIMARY KEY,
  tender_id UUID NOT NULL REFERENCES user_tenders(id) ON DELETE CASCADE,
  orchestration_id UUID NOT NULL,
  user_id UUID NOT NULL,
  
  -- Overall status
  status TEXT NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'partial_failure', 'failed'
  overall_progress INT NOT NULL DEFAULT 0, -- 0-100
  
  -- Engine-specific progress (JSONB for flexibility)
  engines JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Example structure:
  -- {
  --   "document": { "status": "completed", "progress": 100, "duration": 2.3 },
  --   "tender_analysis": { "status": "processing", "progress": 75, "duration": null },
  --   "boq": { "status": "queued", "progress": 0, "duration": null }
  -- }
  
  -- Phase completion flags
  phase1_completed BOOLEAN DEFAULT FALSE,
  phase2_completed BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  estimated_completion TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orchestration_tender ON tender_orchestration_progress(tender_id);
CREATE INDEX IF NOT EXISTS idx_orchestration_user ON tender_orchestration_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_orchestration_status ON tender_orchestration_progress(status);
CREATE INDEX IF NOT EXISTS idx_orchestration_created ON tender_orchestration_progress(created_at DESC);

-- RLS Policies
ALTER TABLE tender_orchestration_progress ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orchestration progress
CREATE POLICY "Users can view own orchestration progress"
  ON tender_orchestration_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own orchestration records
CREATE POLICY "Users can create own orchestration progress"
  ON tender_orchestration_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own orchestration records
CREATE POLICY "Users can update own orchestration progress"
  ON tender_orchestration_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orchestration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orchestration_updated_at
  BEFORE UPDATE ON tender_orchestration_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_orchestration_updated_at();
