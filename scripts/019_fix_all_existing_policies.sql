-- Fix all existing policy conflicts
-- This script safely drops and recreates policies that already exist

-- =====================================================
-- 1. FIX STRATEGIST_USER_PREFERENCES POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can manage their own preferences" ON strategist_user_preferences;
DROP POLICY IF EXISTS "Users can view their own preferences" ON strategist_user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON strategist_user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON strategist_user_preferences;

CREATE POLICY "Users can manage their own preferences" ON strategist_user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 2. FIX USER_CUSTOM_TENDERS POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own custom tenders" ON user_custom_tenders;
DROP POLICY IF EXISTS "Users can insert their own custom tenders" ON user_custom_tenders;
DROP POLICY IF EXISTS "Users can update their own custom tenders" ON user_custom_tenders;
DROP POLICY IF EXISTS "Users can delete their own custom tenders" ON user_custom_tenders;

CREATE POLICY "Users can view their own custom tenders" ON user_custom_tenders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom tenders" ON user_custom_tenders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom tenders" ON user_custom_tenders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom tenders" ON user_custom_tenders
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. FIX DOCUMIND POLICIES (only if tables exist)
-- Note: documind tables use app_id for access control, not user_id
-- Service role has full access for backend operations
-- =====================================================
DO $$
BEGIN
  -- documind_documents policies - uses service_role for backend access
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_documents') THEN
    DROP POLICY IF EXISTS "Service role full access on documind_documents" ON documind_documents;
    
    -- Only service role policy - no user_id column exists
    CREATE POLICY "Service role full access on documind_documents" ON documind_documents
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
  
  -- documind_templates policies (only if table exists)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_templates') THEN
    DROP POLICY IF EXISTS "Service role full access on documind_templates" ON documind_templates;
    DROP POLICY IF EXISTS "Anyone can view templates" ON documind_templates;
    
    CREATE POLICY "Service role full access on documind_templates" ON documind_templates
      FOR ALL USING (auth.role() = 'service_role');
    
    CREATE POLICY "Anyone can view templates" ON documind_templates
      FOR SELECT USING (true);
  END IF;
  
  -- documind_fields policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_fields') THEN
    DROP POLICY IF EXISTS "Service role full access on documind_fields" ON documind_fields;
    
    CREATE POLICY "Service role full access on documind_fields" ON documind_fields
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
  
  -- documind_pages policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_pages') THEN
    DROP POLICY IF EXISTS "Service role full access on documind_pages" ON documind_pages;
    
    CREATE POLICY "Service role full access on documind_pages" ON documind_pages
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
  
  -- documind_jobs policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_jobs') THEN
    DROP POLICY IF EXISTS "Service role full access on documind_jobs" ON documind_jobs;
    
    CREATE POLICY "Service role full access on documind_jobs" ON documind_jobs
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
  
  -- documind_error_logs policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_error_logs') THEN
    DROP POLICY IF EXISTS "Service role full access on documind_error_logs" ON documind_error_logs;
    
    CREATE POLICY "Service role full access on documind_error_logs" ON documind_error_logs
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
  
  -- documind_feedback policies - uses user_id as varchar, not uuid
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_feedback') THEN
    DROP POLICY IF EXISTS "Service role full access on documind_feedback" ON documind_feedback;
    
    CREATE POLICY "Service role full access on documind_feedback" ON documind_feedback
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
  
  -- documind_usage policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_usage') THEN
    DROP POLICY IF EXISTS "Service role full access on documind_usage" ON documind_usage;
    
    CREATE POLICY "Service role full access on documind_usage" ON documind_usage
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
  
  -- documind_template_matches policies
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_template_matches') THEN
    DROP POLICY IF EXISTS "Service role full access on documind_template_matches" ON documind_template_matches;
    
    CREATE POLICY "Service role full access on documind_template_matches" ON documind_template_matches
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- =====================================================
-- 4. FIX DOCUMIND_TEMPLATES DUPLICATES (only if table exists)
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'documind_templates') THEN
    DELETE FROM documind_templates a
    USING documind_templates b
    WHERE a.id > b.id
    AND a.code = b.code;
  END IF;
END $$;

-- =====================================================
-- 5. FIX STRATEGIST TABLES POLICIES
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'strategist_conversations') THEN
    DROP POLICY IF EXISTS "Users can manage own conversations" ON strategist_conversations;
    DROP POLICY IF EXISTS "Users can manage their own conversations" ON strategist_conversations;
    CREATE POLICY "Users can manage own conversations" ON strategist_conversations
      FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'strategist_messages') THEN
    DROP POLICY IF EXISTS "Users can manage own messages" ON strategist_messages;
    DROP POLICY IF EXISTS "Users can view messages in their conversations" ON strategist_messages;
    CREATE POLICY "Users can manage own messages" ON strategist_messages
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM strategist_conversations c 
          WHERE c.id = strategist_messages.conversation_id 
          AND c.user_id = auth.uid()
        )
      );
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'strategist_strategies') THEN
    DROP POLICY IF EXISTS "Users can manage own strategies" ON strategist_strategies;
    DROP POLICY IF EXISTS "Users can manage their own strategies" ON strategist_strategies;
    CREATE POLICY "Users can manage own strategies" ON strategist_strategies
      FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'strategist_opportunities') THEN
    DROP POLICY IF EXISTS "Users can manage own opportunities" ON strategist_opportunities;
    DROP POLICY IF EXISTS "Users can manage their opportunities" ON strategist_opportunities;
    CREATE POLICY "Users can manage own opportunities" ON strategist_opportunities
      FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'strategist_alerts') THEN
    DROP POLICY IF EXISTS "Users can manage own alerts" ON strategist_alerts;
    DROP POLICY IF EXISTS "Users can manage their alerts" ON strategist_alerts;
    CREATE POLICY "Users can manage own alerts" ON strategist_alerts
      FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'strategist_competitiveness_scores') THEN
    DROP POLICY IF EXISTS "Users can manage own scores" ON strategist_competitiveness_scores;
    DROP POLICY IF EXISTS "Users can view their competitiveness scores" ON strategist_competitiveness_scores;
    CREATE POLICY "Users can manage own scores" ON strategist_competitiveness_scores
      FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'strategist_learning_progress') THEN
    DROP POLICY IF EXISTS "Users can manage own learning progress" ON strategist_learning_progress;
    DROP POLICY IF EXISTS "Users can manage their learning progress" ON strategist_learning_progress;
    CREATE POLICY "Users can manage own learning progress" ON strategist_learning_progress
      FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'strategist_digest_subscriptions') THEN
    DROP POLICY IF EXISTS "Users can manage their digest subscriptions" ON strategist_digest_subscriptions;
    CREATE POLICY "Users can manage their digest subscriptions" ON strategist_digest_subscriptions
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Done!
SELECT 'All policies fixed successfully' as result;
