// ============================================
// AI TENDER STRATEGIST - PROMPT BUILDERS
// ============================================

import { STRATEGIST_SYSTEM_PROMPT } from "../constants"
import type { StrategistContext, ExperienceLevel, StrategyType } from "../types"

/**
 * Build the system prompt with user context
 */
export function buildStrategistPrompt(context: StrategistContext): string {
  let prompt = STRATEGIST_SYSTEM_PROMPT

  // Add user experience level context
  if (context.user_preferences?.experience_level) {
    const levelInstructions: Record<ExperienceLevel, string> = {
      beginner: `
## User Experience Level: BEGINNER
- Explain concepts in simple terms, avoid jargon
- Provide step-by-step guidance
- Define technical terms when first used
- Be extra supportive and encouraging
- Suggest learning resources when relevant`,
      intermediate: `
## User Experience Level: INTERMEDIATE  
- User has basic tendering knowledge
- Can use technical terminology with brief explanations
- Focus on strategic advice and optimization
- Highlight advanced techniques when relevant`,
      advanced: `
## User Experience Level: ADVANCED
- User is experienced in tendering
- Use technical terminology freely
- Focus on strategic optimization and edge cases
- Provide nuanced, detailed analysis
- Discuss advanced strategies and market insights`,
    }
    prompt += levelInstructions[context.user_preferences.experience_level]
  }

  // Add user profile context
  if (context.user_preferences || context.company_profile) {
    prompt += `

## User Profile Context`

    if (context.company_profile?.company_name) {
      prompt += `
Company: ${context.company_profile.company_name}`
    }
    if (context.company_profile?.industry) {
      prompt += `
Industry: ${context.company_profile.industry}`
    }
    if (context.user_preferences?.provinces?.length) {
      prompt += `
Regions: ${context.user_preferences.provinces.join(", ")}`
    }
    if (context.user_preferences?.cidb_grading) {
      prompt += `
CIDB Grading: ${context.user_preferences.cidb_grading}`
    }
    if (context.user_preferences?.bee_level || context.company_profile?.bee_status) {
      prompt += `
B-BBEE Status: ${context.user_preferences?.bee_level || context.company_profile?.bee_status}`
    }
  }

  // Add compliance status
  if (context.user_preferences) {
    const complianceItems: string[] = []
    if (context.user_preferences.has_tax_clearance) {
      complianceItems.push(
        `Tax Clearance: Valid${context.user_preferences.tax_clearance_expiry ? ` (expires ${context.user_preferences.tax_clearance_expiry})` : ""}`,
      )
    } else {
      complianceItems.push("Tax Clearance: Missing/Expired")
    }
    if (context.user_preferences.has_coida) {
      complianceItems.push(
        `COIDA: Valid${context.user_preferences.coida_expiry ? ` (expires ${context.user_preferences.coida_expiry})` : ""}`,
      )
    } else {
      complianceItems.push("COIDA: Missing")
    }
    if (context.user_preferences.has_csd_registration) {
      complianceItems.push("CSD Registration: Active")
    } else {
      complianceItems.push("CSD Registration: Missing")
    }

    if (complianceItems.length > 0) {
      prompt += `

## Compliance Status
${complianceItems.join("\n")}`
    }
  }

  // Add tender context if present
  if (context.tender_context) {
    prompt += `

## Current Tender Context
Title: ${context.tender_context.title}
Organization: ${context.tender_context.organization}
${context.tender_context.description ? `Description: ${context.tender_context.description}` : ""}
${context.tender_context.close_date ? `Closing Date: ${context.tender_context.close_date}` : ""}

When answering, reference this specific tender and provide targeted advice.`
  }

  // Add BOQ context if present
  if (context.boq_context) {
    prompt += `

## BOQ Context
This conversation is about pricing/BOQ for a tender with ${context.boq_context.total_items} line items.
Focus on pricing strategy, margin recommendations, and risk assessment.`
  }

  // Add competitiveness score if available
  if (context.competitiveness_score) {
    prompt += `

## User's Current Competitiveness Score
Overall: ${(context.competitiveness_score.overall_score * 100).toFixed(0)}%
- Documentation: ${(context.competitiveness_score.documentation_score * 100).toFixed(0)}%
- Compliance: ${(context.competitiveness_score.compliance_score * 100).toFixed(0)}%
- Experience: ${(context.competitiveness_score.experience_score * 100).toFixed(0)}%

Use this to tailor advice about improving their competitiveness.`
  }

  return prompt
}

/**
 * Build prompt for strategy generation
 */
export function buildStrategyGenerationPrompt(
  strategyType: StrategyType,
  tenderAnalysis: Record<string, any>,
  userContext: StrategistContext,
): string {
  const basePrompt = `Generate a comprehensive ${strategyType} strategy for this tender submission.

## Tender Information
${JSON.stringify(tenderAnalysis.tender_summary || {}, null, 2)}

## Evaluation Criteria
${JSON.stringify(tenderAnalysis.evaluation || {}, null, 2)}

## Compliance Requirements
${JSON.stringify(tenderAnalysis.compliance_summary || {}, null, 2)}

## User's Current Capabilities
${
  userContext.user_preferences
    ? JSON.stringify(
        {
          cidb_grading: userContext.user_preferences.cidb_grading,
          bee_level: userContext.user_preferences.bee_level,
          experience_level: userContext.user_preferences.experience_level,
          past_wins: userContext.user_preferences.past_tender_wins,
          past_losses: userContext.user_preferences.past_tender_losses,
        },
        null,
        2,
      )
    : "Not available"
}

## Company Profile
${userContext.company_profile ? JSON.stringify(userContext.company_profile, null, 2) : "Not available"}`

  const strategyInstructions: Record<StrategyType, string> = {
    bid: `
Generate a complete bid strategy including:
1. Bid viability analysis (should we bid?)
2. SWOT analysis for this tender
3. Compliance checklist with status
4. Supplier/subcontractor recommendations
5. Pricing strategy overview
6. Submission checklist
7. Risk register with mitigation plans
8. Win probability assessment`,

    pricing: `
Generate a detailed pricing strategy including:
1. Recommended pricing approach (cost-plus, competitive, value)
2. Margin recommendations by item category
3. Risk pricing factors
4. Competitive positioning advice
5. Areas for cost optimization
6. Contingency recommendations
7. Payment term considerations
8. Potential price negotiation points`,

    compliance: `
Generate a compliance strategy including:
1. All mandatory requirements mapped to user capabilities
2. Gap analysis with remediation actions
3. Document checklist with deadlines
4. Risk of non-compliance assessment
5. Alternative compliance approaches
6. Certification/registration requirements
7. Timeline for compliance preparation`,

    negotiation: `
Generate a negotiation strategy including:
1. Key negotiation points
2. Best Alternative to Negotiated Agreement (BATNA)
3. Concession strategy
4. Value propositions to emphasize
5. Potential objections and responses
6. Win-win opportunities
7. Relationship building approaches`,

    general: `
Generate a general tender strategy overview including:
1. Executive summary
2. Key success factors
3. Resource requirements
4. Timeline and milestones
5. Team responsibilities
6. Risk overview
7. Go/No-Go recommendation`,
  }

  return (
    basePrompt +
    strategyInstructions[strategyType] +
    `

Respond with a valid JSON object matching the StrategyContent interface with all sections populated.
Be specific, actionable, and realistic in your recommendations.
Reference actual tender requirements and user capabilities.`
  )
}
