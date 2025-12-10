-- ============================================
-- AI TENDER STRATEGIST DATABASE SCHEMA
-- ============================================

-- User Strategist Preferences (from onboarding questionnaire)
CREATE TABLE IF NOT EXISTS strategist_user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Experience Level
    experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
    
    -- Industry Focus (array of industries)
    industries JSONB DEFAULT '[]'::jsonb,
    
    -- Procurement Categories
    procurement_categories JSONB DEFAULT '[]'::jsonb,
    
    -- Geographic Focus
    provinces JSONB DEFAULT '[]'::jsonb,
    regions JSONB DEFAULT '[]'::jsonb,
    
    -- Company Capacity
    company_size TEXT,
    annual_turnover TEXT,
    employee_count TEXT,
    
    -- Past Performance
    past_tender_wins INTEGER DEFAULT 0,
    past_tender_losses INTEGER DEFAULT 0,
    average_contract_value TEXT,
    
    -- Certifications & Compliance
    cidb_grading TEXT,
    bee_level TEXT,
    has_tax_clearance BOOLEAN DEFAULT false,
    tax_clearance_expiry DATE,
    has_coida BOOLEAN DEFAULT false,
    coida_expiry DATE,
    has_csd_registration BOOLEAN DEFAULT false,
    
    -- Preferences
    preferred_contract_types JSONB DEFAULT '[]'::jsonb,
    risk_tolerance TEXT CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    notification_preferences JSONB DEFAULT '{}'::jsonb,
    
    -- Onboarding Status
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Strategist Conversations
CREATE TABLE IF NOT EXISTS strategist_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Context
    title TEXT,
    context_type TEXT CHECK (context_type IN ('general', 'tender', 'boq', 'strategy', 'learning')),
    tender_id UUID, -- Reference to tender if context is tender-specific
    
    -- Conversation State
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    
    -- Metadata
    message_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strategist Messages (within conversations)
CREATE TABLE IF NOT EXISTS strategist_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES strategist_conversations(id) ON DELETE CASCADE,
    
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    
    -- AI Metadata
    model_used TEXT,
    tokens_used INTEGER,
    
    -- Message Type
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'strategy', 'recommendation', 'alert', 'lesson')),
    
    -- Structured Data (for strategies, recommendations, etc.)
    structured_data JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Strategies
CREATE TABLE IF NOT EXISTS strategist_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tender_id UUID, -- Optional link to specific tender
    
    -- Strategy Details
    title TEXT NOT NULL,
    strategy_type TEXT CHECK (strategy_type IN ('bid', 'pricing', 'compliance', 'negotiation', 'general')),
    
    -- Strategy Content
    content JSONB NOT NULL, -- Full strategy document
    summary TEXT, -- Brief summary
    
    -- Analysis Scores
    viability_score NUMERIC(3,2), -- 0.00 to 1.00
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    win_probability NUMERIC(3,2), -- 0.00 to 1.00
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'submitted', 'won', 'lost', 'archived')),
    
    -- Export tracking
    exported_pdf_url TEXT,
    exported_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunity Recommendations
CREATE TABLE IF NOT EXISTS strategist_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Linked Tender
    scraped_tender_id UUID REFERENCES scraped_tenders(id) ON DELETE CASCADE,
    custom_tender_id UUID REFERENCES user_custom_tenders(id) ON DELETE CASCADE,
    
    -- Recommendation Details
    match_score NUMERIC(3,2) NOT NULL, -- 0.00 to 1.00
    match_reasons JSONB, -- Array of reasons for recommendation
    
    -- Categorization
    opportunity_type TEXT CHECK (opportunity_type IN ('low_risk', 'high_margin', 'quick_win', 'strategic', 'growth')),
    
    -- User Interaction
    is_viewed BOOLEAN DEFAULT false,
    is_saved BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    user_notes TEXT,
    
    -- AI Analysis
    ai_insights JSONB, -- Detailed AI analysis
    estimated_margin NUMERIC(5,2),
    estimated_effort TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE -- When the opportunity is no longer relevant
);

-- Learning Progress
CREATE TABLE IF NOT EXISTS strategist_learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Topic Tracking
    topic_id TEXT NOT NULL, -- e.g., 'tender_types', 'bbbee_scoring', 'pricing_strategy'
    topic_category TEXT NOT NULL, -- e.g., 'basics', 'compliance', 'strategy', 'advanced'
    
    -- Progress
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    lessons_completed JSONB DEFAULT '[]'::jsonb,
    quiz_scores JSONB DEFAULT '[]'::jsonb,
    
    -- Engagement
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, topic_id)
);

-- Proactive Alerts
CREATE TABLE IF NOT EXISTS strategist_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Alert Details
    alert_type TEXT NOT NULL CHECK (alert_type IN (
        'document_expiry', 'tender_deadline', 'compliance_gap', 
        'opportunity_match', 'market_insight', 'capacity_alert',
        'price_alert', 'learning_reminder'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Priority
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Context
    related_tender_id UUID,
    related_document_type TEXT,
    action_url TEXT, -- Where to go to address this alert
    action_label TEXT, -- CTA label
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    is_actioned BOOLEAN DEFAULT false,
    
    -- Timing
    trigger_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bid Competitiveness Scores (cached calculations)
CREATE TABLE IF NOT EXISTS strategist_competitiveness_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tender_id UUID, -- Can be linked to specific tender or general
    
    -- Score Components
    documentation_score NUMERIC(3,2) DEFAULT 0,
    pricing_score NUMERIC(3,2) DEFAULT 0,
    compliance_score NUMERIC(3,2) DEFAULT 0,
    experience_score NUMERIC(3,2) DEFAULT 0,
    capacity_score NUMERIC(3,2) DEFAULT 0,
    
    -- Overall Score
    overall_score NUMERIC(3,2) GENERATED ALWAYS AS (
        (documentation_score + pricing_score + compliance_score + experience_score + capacity_score) / 5
    ) STORED,
    
    -- Breakdown Details
    score_breakdown JSONB, -- Detailed breakdown of each component
    improvement_suggestions JSONB, -- Array of suggestions
    
    -- Win Probability
    win_probability NUMERIC(3,2),
    win_probability_factors JSONB,
    
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE
);

-- Weekly Digest Preferences
CREATE TABLE IF NOT EXISTS strategist_digest_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    is_subscribed BOOLEAN DEFAULT true,
    frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
    preferred_day TEXT DEFAULT 'monday',
    preferred_time TIME DEFAULT '09:00',
    
    -- Content Preferences
    include_opportunities BOOLEAN DEFAULT true,
    include_lessons BOOLEAN DEFAULT true,
    include_tips BOOLEAN DEFAULT true,
    include_market_insights BOOLEAN DEFAULT true,
    
    -- Last Sent
    last_sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE strategist_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategist_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategist_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategist_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategist_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategist_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategist_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategist_competitiveness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategist_digest_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Drop existing first then recreate
DROP POLICY IF EXISTS "Users can manage their own preferences" ON strategist_user_preferences;
CREATE POLICY "Users can manage their own preferences"
    ON strategist_user_preferences FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own conversations" ON strategist_conversations;
CREATE POLICY "Users can manage their own conversations"
    ON strategist_conversations FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON strategist_messages;
CREATE POLICY "Users can view messages in their conversations"
    ON strategist_messages FOR ALL
    USING (conversation_id IN (SELECT id FROM strategist_conversations WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage their own strategies" ON strategist_strategies;
CREATE POLICY "Users can manage their own strategies"
    ON strategist_strategies FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their opportunities" ON strategist_opportunities;
CREATE POLICY "Users can manage their opportunities"
    ON strategist_opportunities FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their learning progress" ON strategist_learning_progress;
CREATE POLICY "Users can manage their learning progress"
    ON strategist_learning_progress FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their alerts" ON strategist_alerts;
CREATE POLICY "Users can manage their alerts"
    ON strategist_alerts FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their competitiveness scores" ON strategist_competitiveness_scores;
CREATE POLICY "Users can view their competitiveness scores"
    ON strategist_competitiveness_scores FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their digest subscriptions" ON strategist_digest_subscriptions;
CREATE POLICY "Users can manage their digest subscriptions"
    ON strategist_digest_subscriptions FOR ALL
    USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_strategist_conversations_user ON strategist_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_strategist_messages_conversation ON strategist_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_strategist_strategies_user ON strategist_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategist_opportunities_user ON strategist_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_strategist_alerts_user ON strategist_alerts(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_strategist_learning_user ON strategist_learning_progress(user_id);
