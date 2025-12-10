-- ============================================
-- FIX STRATEGIST RLS POLICIES
-- Drop existing policies and recreate them
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own preferences" ON strategist_user_preferences;
DROP POLICY IF EXISTS "Users can manage their own conversations" ON strategist_conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON strategist_messages;
DROP POLICY IF EXISTS "Users can manage their own strategies" ON strategist_strategies;
DROP POLICY IF EXISTS "Users can manage their opportunities" ON strategist_opportunities;
DROP POLICY IF EXISTS "Users can manage their learning progress" ON strategist_learning_progress;
DROP POLICY IF EXISTS "Users can manage their alerts" ON strategist_alerts;
DROP POLICY IF EXISTS "Users can view their competitiveness scores" ON strategist_competitiveness_scores;
DROP POLICY IF EXISTS "Users can manage their digest subscriptions" ON strategist_digest_subscriptions;

-- Recreate RLS Policies
CREATE POLICY "Users can manage their own preferences"
    ON strategist_user_preferences FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own conversations"
    ON strategist_conversations FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their conversations"
    ON strategist_messages FOR ALL
    USING (conversation_id IN (SELECT id FROM strategist_conversations WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own strategies"
    ON strategist_strategies FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their opportunities"
    ON strategist_opportunities FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their learning progress"
    ON strategist_learning_progress FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their alerts"
    ON strategist_alerts FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their competitiveness scores"
    ON strategist_competitiveness_scores FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their digest subscriptions"
    ON strategist_digest_subscriptions FOR ALL
    USING (auth.uid() = user_id);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_strategist_conversations_user ON strategist_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_strategist_messages_conversation ON strategist_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_strategist_strategies_user ON strategist_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategist_opportunities_user ON strategist_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_strategist_alerts_user ON strategist_alerts(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_strategist_learning_user ON strategist_learning_progress(user_id);
