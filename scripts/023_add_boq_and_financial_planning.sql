-- Add BOQ (Bill of Quantities) tracking
CREATE TABLE IF NOT EXISTS tender_boq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid NOT NULL,
  tender_type text NOT NULL CHECK (tender_type IN ('custom', 'scraped')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- BOQ Details
  boq_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- Structure: [{ item_no, description, unit, quantity, unit_rate, amount, notes, category }]
  
  subtotal numeric(15, 2) DEFAULT 0,
  contingency_percent numeric(5, 2) DEFAULT 10,
  contingency_amount numeric(15, 2) DEFAULT 0,
  profit_margin_percent numeric(5, 2) DEFAULT 15,
  profit_amount numeric(15, 2) DEFAULT 0,
  vat_percent numeric(5, 2) DEFAULT 15,
  vat_amount numeric(15, 2) DEFAULT 0,
  total_amount numeric(15, 2) DEFAULT 0,
  
  -- Pricing Strategy
  pricing_strategy jsonb DEFAULT '{}'::jsonb,
  -- Structure: { strategy_type, competitive_analysis, risk_premium, discount_offered, payment_terms }
  
  -- Cost Breakdown
  direct_costs jsonb DEFAULT '{}'::jsonb,
  -- Structure: { labor, materials, equipment, subcontractors }
  
  indirect_costs jsonb DEFAULT '{}'::jsonb,
  -- Structure: { overhead, admin, transport, insurance, certifications, compliance }
  
  -- Financial Analysis
  break_even_analysis jsonb DEFAULT '{}'::jsonb,
  cash_flow_projection jsonb DEFAULT '{}'::jsonb,
  profitability_analysis jsonb DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(tender_id, tender_type, user_id)
);

-- Enable RLS
ALTER TABLE tender_boq ENABLE ROW LEVEL SECURITY;

-- Users can manage their own BOQs
CREATE POLICY "Users can manage own BOQs"
  ON tender_boq
  FOR ALL
  USING (auth.uid() = user_id);

-- Add pricing history tracking
CREATE TABLE IF NOT EXISTS tender_pricing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid NOT NULL,
  tender_type text NOT NULL CHECK (tender_type IN ('custom', 'scraped')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  boq_id uuid REFERENCES tender_boq(id) ON DELETE CASCADE,
  
  version_number integer NOT NULL DEFAULT 1,
  total_amount numeric(15, 2) NOT NULL,
  changes_summary text,
  changed_items jsonb DEFAULT '[]'::jsonb,
  reason text,
  
  created_at timestamp with time zone DEFAULT now(),
  created_by_user boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE tender_pricing_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own pricing history
CREATE POLICY "Users can manage own pricing history"
  ON tender_pricing_history
  FOR ALL
  USING (auth.uid() = user_id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tender_boq_tender ON tender_boq(tender_id, tender_type);
CREATE INDEX IF NOT EXISTS idx_tender_boq_user ON tender_boq(user_id);
CREATE INDEX IF NOT EXISTS idx_pricing_history_tender ON tender_pricing_history(tender_id, tender_type);
CREATE INDEX IF NOT EXISTS idx_pricing_history_boq ON tender_pricing_history(boq_id);
