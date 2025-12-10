-- ============================================
-- DOCUMIND ENGINE DATABASE SCHEMA
-- Version 1.0.0
-- ============================================

-- Documents table - Main storage for parsed documents
CREATE TABLE IF NOT EXISTS documind_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source tracking (which app/request created this)
  app_id VARCHAR(50) NOT NULL DEFAULT 'bidmate-ai',
  request_id VARCHAR(100),
  source_reference VARCHAR(255),
  
  -- File information
  original_filename VARCHAR(255),
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  storage_url TEXT NOT NULL,
  content_hash VARCHAR(64) NOT NULL,
  
  -- Fingerprints for template matching
  fingerprint_structure VARCHAR(64),
  fingerprint_layout VARCHAR(64),
  fingerprint_form VARCHAR(64),
  fingerprint_table VARCHAR(64),
  
  -- Document metadata (JSONB for flexibility)
  metadata JSONB NOT NULL DEFAULT '{}',
  page_count INTEGER,
  is_scanned BOOLEAN DEFAULT FALSE,
  is_encrypted BOOLEAN DEFAULT FALSE,
  detected_language VARCHAR(10) DEFAULT 'en',
  detected_type VARCHAR(50),
  
  -- Processing status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error_code VARCHAR(50),
  error_message TEXT,
  
  -- Processing info
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  processing_duration_ms INTEGER,
  ocr_used BOOLEAN DEFAULT FALSE,
  ocr_engine VARCHAR(50),
  ocr_confidence NUMERIC(5,4),
  
  -- Full parsed content (compressed JSONB)
  parsed_content JSONB,
  
  -- Layout analysis result
  layout JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Indexes for documents
CREATE INDEX IF NOT EXISTS idx_documind_documents_app ON documind_documents(app_id);
CREATE INDEX IF NOT EXISTS idx_documind_documents_status ON documind_documents(status);
CREATE INDEX IF NOT EXISTS idx_documind_documents_fingerprint ON documind_documents(fingerprint_structure);
CREATE INDEX IF NOT EXISTS idx_documind_documents_created ON documind_documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documind_documents_type ON documind_documents(detected_type);
CREATE INDEX IF NOT EXISTS idx_documind_documents_hash ON documind_documents(content_hash);


-- Document pages - Per-page content for large documents
CREATE TABLE IF NOT EXISTS documind_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documind_documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  
  -- Dimensions (in PDF points: 72 points = 1 inch)
  width NUMERIC(10,2) NOT NULL,
  height NUMERIC(10,2) NOT NULL,
  rotation INTEGER DEFAULT 0,
  
  -- Content
  full_text TEXT,
  text_blocks JSONB,
  lines JSONB,
  rectangles JSONB,
  images JSONB,
  
  -- OCR specific
  is_scanned BOOLEAN DEFAULT FALSE,
  ocr_confidence NUMERIC(5,4),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT documind_pages_unique UNIQUE (document_id, page_number)
);

CREATE INDEX IF NOT EXISTS idx_documind_pages_document ON documind_pages(document_id);


-- Detected fields - Form fields found in documents (for FormFlow)
CREATE TABLE IF NOT EXISTS documind_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documind_documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  
  -- Field identification
  field_name VARCHAR(255),
  label_text VARCHAR(500),
  
  -- Type and classification
  field_type VARCHAR(50) NOT NULL,
  input_type VARCHAR(50) NOT NULL,
  suggested_data_type VARCHAR(50),
  
  -- Position (PDF coordinates - origin bottom-left)
  position_x NUMERIC(10,4) NOT NULL,
  position_y NUMERIC(10,4) NOT NULL,
  position_width NUMERIC(10,4) NOT NULL,
  position_height NUMERIC(10,4) NOT NULL,
  
  -- Position (normalized 0-1, origin top-left)
  position_norm_x NUMERIC(10,6) NOT NULL,
  position_norm_y NUMERIC(10,6) NOT NULL,
  position_norm_width NUMERIC(10,6) NOT NULL,
  position_norm_height NUMERIC(10,6) NOT NULL,
  
  -- Label position (JSONB)
  label_position JSONB,
  
  -- Typography for filling
  font_name VARCHAR(100),
  font_size NUMERIC(6,2),
  font_weight VARCHAR(20),
  font_color VARCHAR(20),
  
  -- Detection info
  detection_method VARCHAR(50) NOT NULL,
  confidence NUMERIC(5,4),
  
  -- For native PDF form fields
  is_native_field BOOLEAN DEFAULT FALSE,
  native_field_name VARCHAR(255),
  native_field_value TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documind_fields_document ON documind_fields(document_id);
CREATE INDEX IF NOT EXISTS idx_documind_fields_page ON documind_fields(document_id, page_number);


-- Document templates - Known document types for matching
CREATE TABLE IF NOT EXISTS documind_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identification
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  
  -- Matching fingerprints
  fingerprint_structure VARCHAR(64) NOT NULL,
  fingerprint_layout VARCHAR(64),
  match_threshold NUMERIC(5,4) DEFAULT 0.80,
  
  -- Template definition
  field_mappings JSONB NOT NULL,
  page_count INTEGER,
  
  -- Metadata
  description TEXT,
  version VARCHAR(20),
  source VARCHAR(255),
  
  -- Statistics
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  accuracy_score NUMERIC(5,4),
  
  -- Ownership
  created_by VARCHAR(50),
  is_system BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documind_templates_fingerprint ON documind_templates(fingerprint_structure);
CREATE INDEX IF NOT EXISTS idx_documind_templates_category ON documind_templates(category);
CREATE INDEX IF NOT EXISTS idx_documind_templates_code ON documind_templates(code);

-- Add unique constraint on code if not exists
CREATE UNIQUE INDEX IF NOT EXISTS documind_templates_code_unique ON documind_templates(code) WHERE code IS NOT NULL;


-- Template matches - Track which templates matched which documents
CREATE TABLE IF NOT EXISTS documind_template_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documind_documents(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES documind_templates(id) ON DELETE CASCADE,
  
  match_score NUMERIC(5,4) NOT NULL,
  matched_fields INTEGER,
  total_fields INTEGER,
  
  matched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT documind_matches_unique UNIQUE (document_id, template_id)
);

CREATE INDEX IF NOT EXISTS idx_documind_matches_document ON documind_template_matches(document_id);
CREATE INDEX IF NOT EXISTS idx_documind_matches_template ON documind_template_matches(template_id);


-- Processing jobs - Queue for async processing
CREATE TABLE IF NOT EXISTS documind_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documind_documents(id) ON DELETE SET NULL,
  
  -- Input
  file_url TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '{}',
  
  -- Caller info
  app_id VARCHAR(50) NOT NULL DEFAULT 'bidmate-ai',
  request_id VARCHAR(100),
  webhook_url TEXT,
  
  -- Queue management
  priority VARCHAR(20) NOT NULL DEFAULT 'normal',
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  
  -- Progress tracking
  current_stage VARCHAR(50),
  progress_percent INTEGER DEFAULT 0,
  progress_message TEXT,
  
  -- Retry handling
  attempt INTEGER DEFAULT 1,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  timeout_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_documind_jobs_status ON documind_jobs(status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_documind_jobs_app ON documind_jobs(app_id);


-- Error logs - Track errors for debugging
CREATE TABLE IF NOT EXISTS documind_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Context
  document_id UUID,
  job_id UUID,
  app_id VARCHAR(50),
  request_id VARCHAR(100),
  
  -- Error details
  error_code VARCHAR(50) NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  
  -- Processing context
  processing_stage VARCHAR(50),
  file_info JSONB,
  
  -- Timestamp
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documind_errors_time ON documind_error_logs(occurred_at);
CREATE INDEX IF NOT EXISTS idx_documind_errors_code ON documind_error_logs(error_code);


-- Usage metrics - For billing and monitoring
CREATE TABLE IF NOT EXISTS documind_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  app_id VARCHAR(50) NOT NULL,
  
  -- Period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Counts
  documents_processed INTEGER DEFAULT 0,
  pages_processed INTEGER DEFAULT 0,
  ocr_pages INTEGER DEFAULT 0,
  storage_bytes BIGINT DEFAULT 0,
  
  -- Performance
  total_processing_ms BIGINT DEFAULT 0,
  
  -- Costs (in cents)
  ocr_cost_cents INTEGER DEFAULT 0,
  storage_cost_cents INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT documind_usage_unique UNIQUE (app_id, period_start)
);

CREATE INDEX IF NOT EXISTS idx_documind_usage_app ON documind_usage(app_id, period_start);


-- Feedback for learning - Corrections from users (for LearnLoop)
CREATE TABLE IF NOT EXISTS documind_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  document_id UUID REFERENCES documind_documents(id) ON DELETE SET NULL,
  field_id UUID REFERENCES documind_fields(id) ON DELETE SET NULL,
  template_id UUID REFERENCES documind_templates(id) ON DELETE SET NULL,
  
  -- Feedback type
  feedback_type VARCHAR(50) NOT NULL,
  
  -- Original vs corrected values
  original_value JSONB,
  corrected_value JSONB,
  
  -- Source
  app_id VARCHAR(50) NOT NULL DEFAULT 'bidmate-ai',
  user_id VARCHAR(100),
  
  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documind_feedback_type ON documind_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_documind_feedback_template ON documind_feedback(template_id);


-- Enable RLS on all tables
ALTER TABLE documind_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documind_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documind_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE documind_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE documind_template_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE documind_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documind_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documind_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE documind_feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating to avoid "already exists" error
DROP POLICY IF EXISTS "Service role full access on documind_documents" ON documind_documents;
DROP POLICY IF EXISTS "Service role full access on documind_pages" ON documind_pages;
DROP POLICY IF EXISTS "Service role full access on documind_fields" ON documind_fields;
DROP POLICY IF EXISTS "Service role full access on documind_templates" ON documind_templates;
DROP POLICY IF EXISTS "Service role full access on documind_template_matches" ON documind_template_matches;
DROP POLICY IF EXISTS "Service role full access on documind_jobs" ON documind_jobs;
DROP POLICY IF EXISTS "Service role full access on documind_error_logs" ON documind_error_logs;
DROP POLICY IF EXISTS "Service role full access on documind_usage" ON documind_usage;
DROP POLICY IF EXISTS "Service role full access on documind_feedback" ON documind_feedback;

-- RLS Policies - Allow service role full access (for API routes)
CREATE POLICY "Service role full access on documind_documents" ON documind_documents FOR ALL USING (true);
CREATE POLICY "Service role full access on documind_pages" ON documind_pages FOR ALL USING (true);
CREATE POLICY "Service role full access on documind_fields" ON documind_fields FOR ALL USING (true);
CREATE POLICY "Service role full access on documind_templates" ON documind_templates FOR ALL USING (true);
CREATE POLICY "Service role full access on documind_template_matches" ON documind_template_matches FOR ALL USING (true);
CREATE POLICY "Service role full access on documind_jobs" ON documind_jobs FOR ALL USING (true);
CREATE POLICY "Service role full access on documind_error_logs" ON documind_error_logs FOR ALL USING (true);
CREATE POLICY "Service role full access on documind_usage" ON documind_usage FOR ALL USING (true);
CREATE POLICY "Service role full access on documind_feedback" ON documind_feedback FOR ALL USING (true);
