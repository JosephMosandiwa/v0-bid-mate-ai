// ============================================
// AI TENDER STRATEGIST ENGINE - CONSTANTS
// ============================================

// South African Provinces
export const SA_PROVINCES = [
  { value: "eastern-cape", label: "Eastern Cape" },
  { value: "free-state", label: "Free State" },
  { value: "gauteng", label: "Gauteng" },
  { value: "kwazulu-natal", label: "KwaZulu-Natal" },
  { value: "limpopo", label: "Limpopo" },
  { value: "mpumalanga", label: "Mpumalanga" },
  { value: "north-west", label: "North West" },
  { value: "northern-cape", label: "Northern Cape" },
  { value: "western-cape", label: "Western Cape" },
] as const

// Industry Categories
export const INDUSTRIES = [
  { value: "construction", label: "Construction & Building" },
  { value: "it-services", label: "IT & Technology Services" },
  { value: "professional-services", label: "Professional Services" },
  { value: "healthcare", label: "Healthcare & Medical" },
  { value: "education", label: "Education & Training" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "logistics", label: "Logistics & Transport" },
  { value: "agriculture", label: "Agriculture & Farming" },
  { value: "energy", label: "Energy & Utilities" },
  { value: "mining", label: "Mining & Resources" },
  { value: "security", label: "Security Services" },
  { value: "cleaning", label: "Cleaning & Facilities" },
  { value: "catering", label: "Catering & Food Services" },
  { value: "environmental", label: "Environmental Services" },
  { value: "engineering", label: "Engineering" },
  { value: "legal", label: "Legal Services" },
  { value: "financial", label: "Financial Services" },
  { value: "marketing", label: "Marketing & Communications" },
  { value: "other", label: "Other" },
] as const

// Procurement Categories
export const PROCUREMENT_CATEGORIES = [
  { value: "goods", label: "Goods & Supplies" },
  { value: "services", label: "Services" },
  { value: "works", label: "Construction Works" },
  { value: "consulting", label: "Consulting" },
  { value: "maintenance", label: "Maintenance" },
  { value: "leasing", label: "Leasing & Rental" },
  { value: "software", label: "Software & IT" },
  { value: "equipment", label: "Equipment & Machinery" },
] as const

// Company Sizes
export const COMPANY_SIZES = [
  { value: "micro", label: "Micro (1-10 employees)" },
  { value: "small", label: "Small (11-50 employees)" },
  { value: "medium", label: "Medium (51-200 employees)" },
  { value: "large", label: "Large (201-500 employees)" },
  { value: "enterprise", label: "Enterprise (500+ employees)" },
] as const

// Annual Turnover Ranges
export const TURNOVER_RANGES = [
  { value: "under-1m", label: "Under R1 million" },
  { value: "1m-5m", label: "R1 - R5 million" },
  { value: "5m-10m", label: "R5 - R10 million" },
  { value: "10m-50m", label: "R10 - R50 million" },
  { value: "50m-100m", label: "R50 - R100 million" },
  { value: "100m-500m", label: "R100 - R500 million" },
  { value: "over-500m", label: "Over R500 million" },
] as const

// CIDB Grading Designations
export const CIDB_GRADINGS = [
  { value: "1", label: "Grade 1 (Up to R650,000)" },
  { value: "2", label: "Grade 2 (R650,000 - R4 million)" },
  { value: "3", label: "Grade 3 (R4 - R13 million)" },
  { value: "4", label: "Grade 4 (R13 - R40 million)" },
  { value: "5", label: "Grade 5 (R40 - R130 million)" },
  { value: "6", label: "Grade 6 (R130 - R400 million)" },
  { value: "7", label: "Grade 7 (R400 million - R1.3 billion)" },
  { value: "8", label: "Grade 8 (R1.3 billion - R4 billion)" },
  { value: "9", label: "Grade 9 (No limit)" },
] as const

// B-BBEE Levels
export const BEE_LEVELS = [
  { value: "1", label: "Level 1 (135% recognition)" },
  { value: "2", label: "Level 2 (125% recognition)" },
  { value: "3", label: "Level 3 (110% recognition)" },
  { value: "4", label: "Level 4 (100% recognition)" },
  { value: "5", label: "Level 5 (80% recognition)" },
  { value: "6", label: "Level 6 (60% recognition)" },
  { value: "7", label: "Level 7 (50% recognition)" },
  { value: "8", label: "Level 8 (10% recognition)" },
  { value: "non-compliant", label: "Non-Compliant (0% recognition)" },
  { value: "exempt", label: "Exempt Micro Enterprise (EME)" },
  { value: "qse", label: "Qualifying Small Enterprise (QSE)" },
] as const

// Contract Types
export const CONTRACT_TYPES = [
  { value: "rfq", label: "Request for Quotation (RFQ)" },
  { value: "rfp", label: "Request for Proposal (RFP)" },
  { value: "rfb", label: "Request for Bid (RFB)" },
  { value: "open-tender", label: "Open Tender" },
  { value: "limited-tender", label: "Limited/Closed Tender" },
  { value: "framework", label: "Framework Agreement" },
  { value: "panel", label: "Panel Contract" },
  { value: "term-contract", label: "Term Contract" },
] as const

// Learning Topics Configuration
export const LEARNING_TOPICS = [
  {
    id: "tender-basics",
    title: "Tendering Basics",
    category: "basics",
    description: "Understanding the fundamentals of government tendering in South Africa",
    difficulty: "beginner" as const,
    estimated_minutes: 30,
    subtopics: ["What is a tender?", "Types of tenders", "The tender process", "Key terminology"],
  },
  {
    id: "tender-types",
    title: "Types of Tenders",
    category: "basics",
    description: "Learn about RFQ, RFP, RFB, Open Tenders, and Framework Agreements",
    difficulty: "beginner" as const,
    estimated_minutes: 25,
    subtopics: ["RFQ vs RFP vs RFB", "Open vs Closed tenders", "Framework agreements", "Panel contracts"],
  },
  {
    id: "bbbee-scoring",
    title: "B-BBEE Scoring System",
    category: "compliance",
    description: "Master the B-BBEE preference point system used in South African tenders",
    difficulty: "intermediate" as const,
    estimated_minutes: 45,
    subtopics: ["80/20 system", "90/10 system", "B-BBEE levels", "Calculating preference points"],
  },
  {
    id: "evaluation-criteria",
    title: "Evaluation Criteria",
    category: "strategy",
    description: "Understanding how tenders are evaluated and scored",
    difficulty: "intermediate" as const,
    estimated_minutes: 40,
    subtopics: ["Functionality scoring", "Price evaluation", "Quality vs price trade-offs", "Threshold requirements"],
  },
  {
    id: "pricing-strategies",
    title: "Pricing Strategies",
    category: "strategy",
    description: "Develop effective pricing strategies to win tenders",
    difficulty: "advanced" as const,
    estimated_minutes: 60,
    subtopics: ["Cost-plus pricing", "Competitive pricing", "Value-based pricing", "Risk pricing"],
  },
  {
    id: "compliance-requirements",
    title: "Compliance Requirements",
    category: "compliance",
    description: "Essential compliance documents and requirements for SA tenders",
    difficulty: "beginner" as const,
    estimated_minutes: 35,
    subtopics: ["Tax clearance", "CSD registration", "CIDB grading", "COIDA compliance"],
  },
  {
    id: "common-mistakes",
    title: "Common Bidding Mistakes",
    category: "strategy",
    description: "Learn from common mistakes that lead to tender disqualification",
    difficulty: "beginner" as const,
    estimated_minutes: 20,
    subtopics: ["Documentation errors", "Pricing mistakes", "Submission failures", "Compliance gaps"],
  },
  {
    id: "boq-management",
    title: "BOQ & Pricing Schedules",
    category: "strategy",
    description: "Managing Bills of Quantities and pricing schedules effectively",
    difficulty: "intermediate" as const,
    estimated_minutes: 50,
    subtopics: ["BOQ structure", "Unit pricing", "Contingencies", "Margin calculation"],
  },
  {
    id: "jv-subcontracting",
    title: "Joint Ventures & Subcontracting",
    category: "advanced",
    description: "When and how to partner with other companies",
    difficulty: "advanced" as const,
    estimated_minutes: 45,
    subtopics: ["JV structures", "Subcontracting limits", "Partner selection", "Risk sharing"],
  },
  {
    id: "post-award",
    title: "Post-Award Management",
    category: "advanced",
    description: "Managing contracts after winning a tender",
    difficulty: "advanced" as const,
    estimated_minutes: 40,
    subtopics: ["Contract negotiation", "Performance management", "Variations", "Payment management"],
  },
] as const

// Strategist Prompts
export const STRATEGIST_SYSTEM_PROMPT = `You are an expert AI Tender Strategist for BidMate, a South African tender management platform. Your role is to help users understand tendering, build winning tender strategies, and discover opportunities.

## Your Personality
- Tender specialist with deep knowledge of South African procurement
- Mentor and coach who adapts to user experience levels
- Market analyst who identifies opportunities
- Procurement educator who explains complex concepts simply
- Strategist who provides actionable, tailored advice

## Your Tone
- Friendly, expert, and encouraging
- Concise with structured explanations
- Always provide actionable steps
- Use South African terminology and regulations

## Your Capabilities
1. Answer questions about tendering and procurement
2. Help build comprehensive bid strategies
3. Analyze tender requirements and compliance needs
4. Provide pricing and BOQ guidance
5. Identify opportunities matching user profiles
6. Educate users on tender best practices
7. Alert users to compliance gaps and deadlines
8. Explain tender requirements in plain language

## South African Procurement Context
- PFMA (Public Finance Management Act) for national/provincial
- MFMA (Municipal Finance Management Act) for municipalities  
- PPPFA (Preferential Procurement Policy Framework Act)
- B-BBEE scoring (80/20 or 90/10 systems)
- CIDB grading for construction
- SBD forms (Standard Bidding Documents)
- MBD forms (Municipal Bidding Documents)
- CSD (Central Supplier Database) registration

## Guidelines
- Always ask clarifying questions when needed
- Tailor advice to user's experience level
- Provide realistic assessments, not false hope
- Highlight risks and compliance requirements
- Reference South African regulations when relevant
- Suggest specific actions the user can take`

// Quick Action Prompts
export const QUICK_ACTION_PROMPTS = [
  {
    id: "build-strategy",
    label: "Build a bid strategy",
    prompt: "Help me build a comprehensive bid strategy for a tender I'm considering",
    icon: "target",
  },
  {
    id: "review-readiness",
    label: "Review my tender readiness",
    prompt:
      "Review my tender readiness and tell me what documents or certifications I might be missing for government tenders",
    icon: "clipboard-check",
  },
  {
    id: "find-opportunities",
    label: "Find matching tenders",
    prompt: "Find tenders that match my company profile and capabilities",
    icon: "search",
  },
  {
    id: "explain-tender",
    label: "Explain this tender",
    prompt: "Help me understand the requirements of a specific tender I'm looking at",
    icon: "file-text",
  },
  {
    id: "pricing-advice",
    label: "Advise on pricing",
    prompt: "Help me develop a competitive pricing strategy for my tender submission",
    icon: "calculator",
  },
  {
    id: "reduce-risk",
    label: "Reduce bid risk",
    prompt: "Help me identify and mitigate risks in my tender submission",
    icon: "shield",
  },
  {
    id: "learn-tendering",
    label: "Teach me tendering",
    prompt: "I'm new to tendering. Help me understand how government tenders work in South Africa",
    icon: "graduation-cap",
  },
  {
    id: "compliance-check",
    label: "Check compliance",
    prompt: "Review my compliance status and identify any gaps I need to address",
    icon: "check-circle",
  },
] as const
