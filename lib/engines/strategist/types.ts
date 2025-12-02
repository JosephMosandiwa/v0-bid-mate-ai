// ============================================
// AI TENDER STRATEGIST ENGINE - TYPES
// ============================================

// User Experience Level
export type ExperienceLevel = "beginner" | "intermediate" | "advanced"

// Risk Tolerance
export type RiskTolerance = "low" | "medium" | "high"

// Strategy Types
export type StrategyType = "bid" | "pricing" | "compliance" | "negotiation" | "general"

// Opportunity Types
export type OpportunityType = "low_risk" | "high_margin" | "quick_win" | "strategic" | "growth"

// Alert Types
export type AlertType =
  | "document_expiry"
  | "tender_deadline"
  | "compliance_gap"
  | "opportunity_match"
  | "market_insight"
  | "capacity_alert"
  | "price_alert"
  | "learning_reminder"

// Alert Priority
export type AlertPriority = "low" | "medium" | "high" | "urgent"

// Conversation Context Types
export type ConversationContextType = "general" | "tender" | "boq" | "strategy" | "learning"

// Message Types
export type MessageType = "text" | "strategy" | "recommendation" | "alert" | "lesson"

// User Preferences from Onboarding
export interface StrategistUserPreferences {
  id: string
  user_id: string
  experience_level: ExperienceLevel | null
  industries: string[]
  procurement_categories: string[]
  provinces: string[]
  regions: string[]
  company_size: string | null
  annual_turnover: string | null
  employee_count: string | null
  past_tender_wins: number
  past_tender_losses: number
  average_contract_value: string | null
  cidb_grading: string | null
  bee_level: string | null
  has_tax_clearance: boolean
  tax_clearance_expiry: string | null
  has_coida: boolean
  coida_expiry: string | null
  has_csd_registration: boolean
  preferred_contract_types: string[]
  risk_tolerance: RiskTolerance | null
  notification_preferences: Record<string, boolean>
  onboarding_completed: boolean
  onboarding_completed_at: string | null
  created_at: string
  updated_at: string
}

// Conversation
export interface StrategistConversation {
  id: string
  user_id: string
  title: string | null
  context_type: ConversationContextType
  tender_id: string | null
  status: "active" | "archived" | "deleted"
  message_count: number
  last_message_at: string | null
  created_at: string
  updated_at: string
}

// Message
export interface StrategistMessage {
  id: string
  conversation_id: string
  role: "user" | "assistant" | "system"
  content: string
  model_used: string | null
  tokens_used: number | null
  message_type: MessageType
  structured_data: Record<string, any> | null
  created_at: string
}

// Strategy Document
export interface StrategistStrategy {
  id: string
  user_id: string
  tender_id: string | null
  title: string
  strategy_type: StrategyType
  content: StrategyContent
  summary: string | null
  viability_score: number | null
  risk_level: "low" | "medium" | "high" | "critical" | null
  win_probability: number | null
  status: "draft" | "active" | "submitted" | "won" | "lost" | "archived"
  exported_pdf_url: string | null
  exported_at: string | null
  created_at: string
  updated_at: string
}

// Strategy Content Structure
export interface StrategyContent {
  bid_viability_analysis: {
    summary: string
    score: number
    factors: Array<{ factor: string; assessment: string; impact: "positive" | "negative" | "neutral" }>
  }
  strengths_weaknesses: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  compliance_strategy: {
    requirements: Array<{ requirement: string; status: "met" | "partial" | "not_met"; action: string }>
    gaps: string[]
    mitigation_plan: string[]
  }
  supplier_subcontractor_strategy: {
    recommended_partners: string[]
    subcontracting_approach: string
    jv_considerations: string | null
  }
  pricing_strategy: {
    approach: string
    margin_recommendation: string
    risk_factors: string[]
    competitive_positioning: string
  }
  submission_checklist: Array<{ item: string; required: boolean; status: "complete" | "pending" | "not_started" }>
  risk_mitigation_plan: Array<{ risk: string; probability: string; impact: string; mitigation: string }>
}

// Opportunity Recommendation
export interface StrategistOpportunity {
  id: string
  user_id: string
  scraped_tender_id: string | null
  custom_tender_id: string | null
  match_score: number
  match_reasons: string[]
  opportunity_type: OpportunityType
  is_viewed: boolean
  is_saved: boolean
  is_dismissed: boolean
  user_notes: string | null
  ai_insights: Record<string, any> | null
  estimated_margin: number | null
  estimated_effort: string | null
  created_at: string
  expires_at: string | null
  // Joined tender data
  tender?: {
    id: string
    title: string
    organization: string
    close_date: string | null
    category: string | null
    estimated_value: string | null
  }
}

// Alert
export interface StrategistAlert {
  id: string
  user_id: string
  alert_type: AlertType
  title: string
  message: string
  priority: AlertPriority
  related_tender_id: string | null
  related_document_type: string | null
  action_url: string | null
  action_label: string | null
  is_read: boolean
  is_dismissed: boolean
  is_actioned: boolean
  trigger_date: string
  expiry_date: string | null
  created_at: string
}

// Learning Progress
export interface StrategistLearningProgress {
  id: string
  user_id: string
  topic_id: string
  topic_category: string
  progress_percent: number
  lessons_completed: string[]
  quiz_scores: Array<{ quiz_id: string; score: number; completed_at: string }>
  time_spent_minutes: number
  last_accessed_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

// Competitiveness Score
export interface StrategistCompetitivenessScore {
  id: string
  user_id: string
  tender_id: string | null
  documentation_score: number
  pricing_score: number
  compliance_score: number
  experience_score: number
  capacity_score: number
  overall_score: number
  score_breakdown: Record<string, any>
  improvement_suggestions: string[]
  win_probability: number | null
  win_probability_factors: Record<string, any> | null
  calculated_at: string
  valid_until: string | null
}

// AI Context for Strategist
export interface StrategistContext {
  user_preferences: StrategistUserPreferences | null
  company_profile: {
    company_name: string | null
    industry: string | null
    company_size: string | null
    bee_status: string | null
    province: string | null
  } | null
  tender_context?: {
    id: string
    title: string
    organization: string
    description: string | null
    close_date: string | null
    analysis?: Record<string, any>
  }
  boq_context?: {
    tender_id: string
    items: Array<{ description: string; quantity: number; unit: string }>
    total_items: number
  }
  competitiveness_score?: StrategistCompetitivenessScore
  recent_alerts?: StrategistAlert[]
}

// Chat Request/Response
export interface StrategistChatRequest {
  message: string
  conversation_id?: string
  context_type?: ConversationContextType
  tender_id?: string
  include_context?: boolean
}

export interface StrategistChatResponse {
  message: string
  conversation_id: string
  message_type: MessageType
  structured_data?: Record<string, any>
  suggestions?: string[]
}

// Strategy Generation Request
export interface StrategyGenerationRequest {
  tender_id: string
  strategy_type: StrategyType
  include_pricing?: boolean
  include_compliance?: boolean
  include_risk_analysis?: boolean
}

// Opportunity Discovery Request
export interface OpportunityDiscoveryRequest {
  limit?: number
  opportunity_types?: OpportunityType[]
  min_match_score?: number
  include_dismissed?: boolean
}

// Learning Topics
export interface LearningTopic {
  id: string
  title: string
  description: string
  category: string
  difficulty: ExperienceLevel
  estimated_minutes: number
  lessons: LearningLesson[]
}

export interface LearningLesson {
  id: string
  title: string
  content: string
  examples?: string[]
  quiz?: LearningQuiz
}

export interface LearningQuiz {
  questions: Array<{
    question: string
    options: string[]
    correct_answer: number
    explanation: string
  }>
}
