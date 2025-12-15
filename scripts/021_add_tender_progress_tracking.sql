-- Add progress tracking for tenders

-- Add status tracking columns to user_custom_tenders
ALTER TABLE user_custom_tenders
ADD COLUMN IF NOT EXISTS progress_status TEXT DEFAULT 'reviewing',
ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_progress_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS submission_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS decision_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS outcome TEXT;

-- Create tender_progress_logs table for detailed tracking
CREATE TABLE IF NOT EXISTS tender_progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL,
  tender_type TEXT NOT NULL CHECK (tender_type IN ('custom', 'scraped')),
  user_id UUID NOT NULL,
  status TEXT NOT NULL,
  progress_percent INTEGER NOT NULL,
  milestone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_system BOOLEAN DEFAULT FALSE
);

-- Create tender_project_plans table for strategic planning
CREATE TABLE IF NOT EXISTS tender_project_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL,
  tender_type TEXT NOT NULL CHECK (tender_type IN ('custom', 'scraped')),
  user_id UUID NOT NULL,
  project_title TEXT NOT NULL,
  project_summary TEXT,
  estimated_budget JSONB, -- {total, breakdown: {labor, materials, equipment, overhead}}
  estimated_timeline JSONB, -- {total_weeks, phases: [{name, duration_weeks, tasks}]}
  resource_requirements JSONB, -- {personnel, equipment, materials}
  risk_assessment JSONB, -- {risks: [{risk, impact, likelihood, mitigation}]}
  success_criteria JSONB, -- [criteria]
  key_deliverables JSONB, -- [deliverable]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE tender_progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_project_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress logs" ON tender_progress_logs;
CREATE POLICY "Users can view their own progress logs"
  ON tender_progress_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress logs" ON tender_progress_logs;
CREATE POLICY "Users can insert their own progress logs"
  ON tender_progress_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own project plans" ON tender_project_plans;
CREATE POLICY "Users can view their own project plans"
  ON tender_project_plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own project plans" ON tender_project_plans;
CREATE POLICY "Users can manage their own project plans"
  ON tender_project_plans FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tender_progress_logs_tender ON tender_progress_logs(tender_id, tender_type);
CREATE INDEX IF NOT EXISTS idx_tender_progress_logs_user ON tender_progress_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_tender_project_plans_tender ON tender_project_plans(tender_id, tender_type);
CREATE INDEX IF NOT EXISTS idx_tender_project_plans_user ON tender_project_plans(user_id);

-- Add comment
COMMENT ON TABLE tender_progress_logs IS 'Tracks progress milestones for tender responses';
COMMENT ON TABLE tender_project_plans IS 'Stores AI-generated project plans for tender delivery';
