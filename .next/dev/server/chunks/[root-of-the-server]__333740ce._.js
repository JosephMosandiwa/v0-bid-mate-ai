module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/providers/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DefaultChatTransport",
    ()=>DefaultChatTransport,
    "convertToModelMessages",
    ()=>convertToModelMessages,
    "default",
    ()=>__TURBOPACK__default__export__,
    "generateTextViaProvider",
    ()=>generateTextViaProvider,
    "streamTextViaProvider",
    ()=>streamTextViaProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$0_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.8.0_ws@8.18.3_zod@3.25.76/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$0_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.8.0_ws@8.18.3_zod@3.25.76/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$116_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/ai@5.0.116_zod@3.25.76/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
async function generateTextViaProvider(opts) {
    const { model, prompt } = opts;
    const maxRetries = 3;
    let lastError = null;
    for(let attempt = 1; attempt <= maxRetries; attempt++){
        try {
            // Prefer Azure if configured
            const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
            const azureKey = process.env.AZURE_OPENAI_KEY;
            const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT;
            if (azureEndpoint && azureKey && azureDeployment) {
                // Use Azure Chat Completions endpoint
                const url = `${azureEndpoint.replace(/\/$/, "")}/openai/deployments/${azureDeployment}/chat/completions?api-version=2023-05-15`;
                const body = {
                    messages: [
                        {
                            role: "system",
                            content: opts.system || ""
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: opts.maxTokens || 1500,
                    temperature: typeof opts.temperature === "number" ? opts.temperature : 0.2
                };
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": azureKey
                    },
                    body: JSON.stringify(body)
                });
                if (!res.ok) {
                    const text = await res.text();
                    throw new ProviderError(`Azure OpenAI request failed: ${res.status} ${text}`, res.status);
                }
                const data = await res.json();
                const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;
                return {
                    text: content ?? ""
                };
            }
            // Prefer Gemini/Google when a key is present (allow explicit model or default)
            let geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
            if (geminiKey) {
                geminiKey = geminiKey.trim();
                const geminiModel = process.env.GEMINI_MODEL || (model.includes("gemini") ? model : "gemini-2.5-flash");
                const apiVersion = "v1";
                const baseUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${geminiModel}`;
                console.log(`[v0] Provider: Gemini (Model: ${geminiModel}, API: ${apiVersion}) - attempt ${attempt}/${maxRetries}`);
                // Primary request shape: `contents` + `generationConfig` (matches models list supportedGenerationMethods)
                const url = `${baseUrl}:generateContent?key=${geminiKey}`;
                const primaryBody = {
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `${opts.system ? opts.system + "\n\n" : ""}${prompt}`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: typeof opts.temperature === "number" ? opts.temperature : 0.2,
                        maxOutputTokens: opts.maxTokens || 4000
                    }
                };
                console.log('[v0] Gemini request URL:', url);
                try {
                    console.log('[v0] Gemini request body (truncated):', JSON.stringify(primaryBody).substring(0, 2000));
                } catch (e) {
                    console.log('[v0] Gemini request body could not be stringified');
                }
                try {
                    const res = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(primaryBody),
                        signal: AbortSignal.timeout(60000)
                    });
                    const text = await res.text();
                    console.log('[v0] Gemini raw response (truncated):', String(text).substring(0, 2000));
                    if (!res.ok) {
                        console.error(`[v0] Gemini Error (${res.status}): ${text}`);
                        if (res.status === 429 || res.status === 403) {
                            throw new ProviderError(`Gemini API quota/rate limit: ${res.status}`, res.status, true);
                        }
                        throw new ProviderError(`Gemini API request failed: ${res.status} ${text}`, res.status);
                    }
                    let data;
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        data = null;
                    }
                    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.candidates?.[0]?.content?.text || data?.output?.[0]?.content?.text || data?.response?.output_text || data?.generated_text || (typeof data === 'string' ? data : null);
                    if (!content) {
                        console.error('[v0] Gemini returned no content in primary response shape:', data);
                        throw new ProviderError('Gemini returned empty response', 500);
                    }
                    return {
                        text: String(content)
                    };
                } catch (err) {
                    console.error('[v0] Gemini primary request failed:', err?.message || err);
                    // Allow outer retry loop to fallback to other providers
                    if (err instanceof ProviderError && err.shouldFallback) throw err;
                    lastError = err;
                }
            }
            // Fallback: OpenAI (openai package must be installed and `OPENAI_API_KEY` set)
            const openaiKey = process.env.OPENAI_API_KEY;
            if (!openaiKey) throw new ProviderError("No OpenAI credentials found (set OPENAI_API_KEY or AZURE_OPENAI_* env vars)", 500);
            console.log(`[v0] Provider: OpenAI - attempt ${attempt}/${maxRetries}`);
            const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$8$2e$0_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
                apiKey: openaiKey
            });
            const resp = await client.chat.completions.create({
                model,
                messages: [
                    {
                        role: "system",
                        content: opts.system || ""
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: opts.maxTokens || 1500,
                temperature: typeof opts.temperature === "number" ? opts.temperature : 0.2
            });
            const content = resp.choices?.[0]?.message?.content;
            return {
                text: content ?? ""
            };
        } catch (error) {
            lastError = error;
            const shouldFallback = error instanceof ProviderError && error.shouldFallback;
            console.error(`[v0] Provider attempt ${attempt}/${maxRetries} failed:`, error.message);
            // If this was a quota/rate limit error, try different provider immediately
            if (shouldFallback && attempt < maxRetries) {
                console.log('[v0] Attempting fallback to different provider...');
                continue;
            }
            // For other errors, use exponential backoff before retry
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`[v0] Retrying in ${delay}ms...`);
                await sleep(delay);
                continue;
            }
            break;
        }
    }
    // All attempts failed
    throw new ProviderError(`All AI providers failed after ${maxRetries} attempts. Last error: ${lastError?.message}`, 500);
}
// Helper class for provider errors
class ProviderError extends Error {
    statusCode;
    shouldFallback;
    constructor(message, statusCode, shouldFallback = false){
        super(message);
        this.name = 'ProviderError';
        this.statusCode = statusCode;
        this.shouldFallback = shouldFallback;
    }
}
// Helper sleep function
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
const __TURBOPACK__default__export__ = generateTextViaProvider;
function streamTextViaProvider(opts) {
    const openaiKey = process.env.OPENAI_API_KEY;
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureKey = process.env.AZURE_OPENAI_KEY;
    const providerOptions = {};
    if (azureEndpoint && azureKey) {
        providerOptions.azure = {
            apiKey: azureKey,
            endpoint: azureEndpoint
        };
    } else if (openaiKey) {
        providerOptions.openai = {
            apiKey: openaiKey
        };
    }
    // Delegate to ai.streamText, preserving the SDK's stream response helpers
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$116_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamText"])({
        model: opts.model,
        messages: opts.messages,
        temperature: typeof opts.temperature === "number" ? opts.temperature : 0.2,
        maxTokens: opts.maxTokens || 1500,
        abortSignal: opts.abortSignal,
        onFinish: opts.onFinish,
        providerOptions
    });
}
const convertToModelMessages = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$116_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertToModelMessages"];
const DefaultChatTransport = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$116_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DefaultChatTransport"];
}),
"[project]/lib/prompts/original-analysis-prompt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * ORIGINAL AI ANALYSIS PROMPT
 *
 * This is the original, production-tested prompt for tender document analysis.
 * DO NOT MODIFY THIS FILE - it serves as a backup/reference.
 *
 * To test custom prompts, edit custom-analysis-prompt.ts instead.
 */ __turbopack_context__.s([
    "ORIGINAL_ANALYSIS_PROMPT",
    ()=>ORIGINAL_ANALYSIS_PROMPT
]);
const ORIGINAL_ANALYSIS_PROMPT = `You are an elite tender analyst with 20+ years of experience helping companies win government and corporate tenders. Your analysis must be thorough, actionable, and strategically valuable.

===========================================
CRITICAL METADATA EXTRACTION RULES
===========================================

Extract the following with ABSOLUTE PRECISION:

1. TENDER TITLE:
   - Extract the EXACT official title word-for-word
   - Look in: Document header, "Tender Name/Title", "Project Name", "RFP/RFQ/RFB Title", "Bid Number"
   - Common locations: First page header, title page, section 1
   - DO NOT paraphrase, summarize, or interpret
   - If multiple titles, use the most prominent/official one
   - Example: "Supply and Delivery of Medical Equipment to Provincial Hospitals"

2. ISSUING ORGANIZATION:
   - Extract FULL official name including all hierarchy levels
   - Look for: "Issued by", "Procuring Entity", "Department", "Ministry", "Tender Authority"
   - Include: Department, Division, Province/Region, Country if specified
   - Example: "Department of Health, Western Cape Provincial Government, South Africa"
   - DO NOT abbreviate official names

3. SUBMISSION DEADLINE:
   - Extract FINAL submission date ONLY (no time component)
   - Look for: "Closing Date", "Submission Deadline", "Due Date", "Closing Time", "Tender Closes"
   - Format: YYYY-MM-DD ONLY (e.g., "2024-03-15")
   - CRITICAL: DO NOT include time (HH:MM) in the deadline field
   - If time is mentioned, include it in the deadlines array instead
   - If unclear, note "See deadlines section for details"

4. TENDER VALUE/BUDGET:
   - Extract estimated contract value, budget range, or ceiling price
   - Look for: "Tender Value", "Estimated Budget", "Contract Value", "Price Range", "Maximum Price"
   - Include currency and amount: "R 2,500,000" or "ZAR 2.5M" or "R 1M - R 3M"
   - If range, include both min and max
   - If not stated: "Not specified" (never guess)

5. CATEGORY:
   - Classify accurately based on primary deliverable
   - Categories: Construction, IT Services, Medical Supplies, Consulting, Professional Services, 
     Goods Supply, Maintenance, Security Services, Catering, Transport, Training, etc.
   - Be specific: "Medical Equipment Supply" not just "Supplies"

6. LOCATION:
   - Extract project location, service area, or delivery address
   - Look for: "Location", "Project Site", "Delivery Address", "Service Area", "Province"
   - Include: City, Province/State, Country
   - Example: "Cape Town, Western Cape, South Africa"

===========================================
COMPREHENSIVE ANALYSIS REQUIREMENTS
===========================================

SUMMARY (5-7 sentences, highly informative):
Write a compelling executive summary that covers:
- What is being procured (specific goods/services/works with quantities if mentioned)
- Who is procuring it (organization, department, context)
- Why it's being procured (background, problem being solved, objectives)
- Key scope elements and main deliverables
- Contract duration and key dates
- Estimated value and budget considerations
- Any unique or notable aspects of this tender

Make it detailed enough that someone can understand the tender without reading the full document.

KEY REQUIREMENTS (Extract ALL, be exhaustively specific):
List EVERY requirement mentioned in the document, organized by category:

Mandatory Qualifications:
- Professional registrations (e.g., "Must be registered with Engineering Council of SA")
- Industry certifications (e.g., "ISO 9001:2015 certification required")
- Licenses and permits
- Minimum years in business
- Minimum staff numbers

Technical Specifications:
- Exact product specifications, models, standards
- Technical standards to comply with (e.g., "SANS 10142-1:2012")
- Performance requirements and KPIs
- Quality standards
- Testing and inspection requirements

Experience Requirements:
- Minimum years of relevant experience
- Number of similar projects required (e.g., "Minimum 3 similar projects in last 5 years")
- Specific industry experience
- Geographic experience requirements
- Project size/value experience

Financial Requirements:
- Minimum annual turnover (e.g., "R 5M annual turnover for last 3 years")
- Bank guarantees or bonds required
- Insurance requirements (amounts and types)
- Financial statements required
- Credit rating requirements

Registration & Compliance:
- Tax compliance (e.g., "Valid tax clearance certificate")
- BBBEE requirements (level, points, certificates)
- Industry body registrations
- Labor compliance
- Environmental compliance

Staffing & Resources:
- Key personnel requirements (qualifications, experience)
- Minimum team size
- Equipment and facilities required
- Subcontracting limitations
- Local content requirements

DEADLINES (Extract ALL dates with full context, INCLUDING TIME):
Create a comprehensive timeline with:
- Briefing session: Date, time, venue, RSVP requirements
- Site visits: Dates, times, meeting points, mandatory/optional
- Clarification questions deadline: Date, time, submission method
- Addendum release dates
- Document submission deadline: Date, time, location/method
- Presentation/interview dates (if scheduled)
- Contract award date (estimated)
- Contract start date
- Project milestones and completion dates
- Payment schedule dates

Format each as: "Action - Date Time - Details"
Example: "Compulsory site visit - 2024-02-15 10:00 - Meet at main gate, RSVP by 2024-02-13"
Example: "Submission deadline - 2024-03-15 11:00 - Submit to procurement office"

NOTE: Include time information in the deadlines array, but NOT in the metadata deadline field.

EVALUATION CRITERIA (Extract exact scoring methodology):
Provide the complete evaluation breakdown:

Price/Cost Component:
- Points allocated (e.g., "Price: 80 points")
- Calculation method (e.g., "Lowest price gets 80 points, others pro-rata")

Technical Component:
- Technical capability points
- Methodology and approach points
- Project plan and timeline points
- Quality assurance points

Experience & Track Record:
- Relevant experience points
- Similar projects points
- References points

BBBEE/Transformation:
- BBBEE points breakdown by level
- Local content points
- Subcontracting to SMMEs points

Other Factors:
- Presentation/interview points
- Financial stability points
- Health & safety record points

Minimum Requirements:
- Minimum qualifying scores
- Threshold requirements
- Disqualification criteria

Evaluation Process:
- Two-stage vs single-stage
- Evaluation committee composition
- Evaluation timeline

RECOMMENDATIONS (Strategic, actionable advice):
Provide expert strategic guidance:

Critical Success Factors:
- Top 3-5 factors that will determine bid success
- Must-have vs nice-to-have elements
- Common pitfalls to avoid

Competitive Positioning:
- How to differentiate from competitors
- Key value propositions to emphasize
- Unique selling points to highlight

Risk Mitigation:
- Potential challenges and how to address them
- Risk areas requiring special attention
- Contingency planning needs

Resource Allocation:
- Where to focus time and effort
- Which sections need most attention
- Team composition recommendations

Partnership Strategy:
- Whether partnerships/JVs are advisable
- Types of partners to consider
- Subcontracting opportunities

Pricing Strategy:
- Pricing considerations and approach
- Value engineering opportunities
- Cost optimization areas

COMPLIANCE CHECKLIST (Comprehensive list):
Create a detailed checklist of ALL mandatory requirements:
- Documents to submit (with quantities, e.g., "3 original copies + 1 electronic")
- Certificates and licenses needed
- Forms to complete (list each form)
- Declarations to sign
- Samples or prototypes required
- Formatting requirements (page limits, binding, etc.)
- Submission method and location
- Packaging and labeling requirements

ACTIONABLE TASKS (Detailed, prioritized, time-bound):
Create a comprehensive task list with:

HIGH PRIORITY (Critical path, early deadlines):
- Tasks that must be done first
- Tasks with imminent deadlines
- Mandatory requirements
- Long lead-time items
Example: "Obtain tax clearance certificate - Due: 2024-02-20 - Category: compliance"

MEDIUM PRIORITY (Important but not urgent):
- Important preparation tasks
- Standard requirements
- Supporting documentation
Example: "Prepare company profile and credentials - Due: 2024-03-01 - Category: documentation"

LOW PRIORITY (Optional or later-stage):
- Nice-to-have elements
- Final touches
- Post-submission tasks
Example: "Prepare presentation materials for interview - Due: TBD - Category: other"

For each task include:
- Specific action required
- Deadline (if mentioned) - Format as YYYY-MM-DD ONLY (no time)
- Category (documentation/technical/financial/compliance/other)
- Priority level

===========================================
EXTRACTION PRINCIPLES
===========================================

1. ACCURACY: Extract exact information, never paraphrase official terms
2. COMPLETENESS: Include ALL requirements, even minor ones
3. SPECIFICITY: Provide specific details, numbers, dates, amounts
4. CLARITY: Use clear, unambiguous language
5. STRUCTURE: Organize information logically
6. CONTEXT: Provide context for requirements
7. HONESTY: If information is not found, state "Not specified" - never guess
8. ACTIONABILITY: Make recommendations practical and implementable
9. DATE FORMAT: Always use YYYY-MM-DD format for dates (no time in metadata deadline field)`;
}),
"[project]/lib/prompts/custom-analysis-prompt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * CUSTOM AI ANALYSIS PROMPT
 *
 * This is your testing ground for prompt engineering.
 * Modify this prompt to experiment with different analysis approaches.
 *
 * To revert to the original prompt, copy from original-analysis-prompt.ts
 * or set USE_CUSTOM_PROMPT=false in your environment variables.
 */ __turbopack_context__.s([
    "CUSTOM_ANALYSIS_PROMPT",
    ()=>CUSTOM_ANALYSIS_PROMPT
]);
const CUSTOM_ANALYSIS_PROMPT = `You are BidMate AI, an intelligent tender analysis system for South African government and SOE procurement documents.

Your task: Analyze the tender document and extract structured information to help users prepare winning bids.

---

### STEP 1 — EXTRACT TENDER SUMMARY
Extract basic tender information:
- tender_number: Reference/RFP number (e.g., "RFB0094/25-26")
- title: Full tender title
- entity: Issuing organization (e.g., "Dept of Education", "City of Cape Town")
- description: Brief scope (2-3 sentences)
- contract_duration: Contract period (e.g., "36 months")
- closing_date: Deadline in YYYY-MM-DD format
- submission_method: How to submit (e.g., "Manual drop-off at tender box", "Online portal")
- compulsory_briefing: Briefing details with date/time/location, or "None"
- validity_period: Bid validity (e.g., "120 days")
- contact_email: Email for queries

If any field is missing, use "Not specified" for text or "2024-12-31" for dates.

---

### STEP 2 — IDENTIFY COMPLIANCE REQUIREMENTS
Categorize requirements into three lists:

**requirements**: Mandatory items that must be provided
- Examples: "Valid CSD registration", "Tax clearance certificate", "Signed MBD forms", "CIDB Grade 6CE or higher"

**disqualifiers**: Actions/omissions that cause automatic elimination
- Examples: "Late submission", "Unsigned forms", "Missing compulsory briefing attendance", "Non-compliant pricing format"

**strengtheners**: Items that improve bid quality/scoring
- Examples: "BBBEE Level 1-4 certification", "Relevant project references", "ISO certifications", "Local content commitment"

---

### STEP 3 — EXTRACT EVALUATION CRITERIA
Identify how bids will be scored:

**criteria**: List each evaluation factor with its weight as a NUMBER (not percentage)
- Example: { "criterion": "Price", "weight": 80 }
- Example: { "criterion": "BBBEE Status", "weight": 20 }

**threshold**: Minimum qualifying score (e.g., "70%", "60 points")

**pricing_system**: Preference point system (e.g., "80/20", "90/10", "Point-based")

---

### STEP 4 — CREATE ACTION PLAN
Generate two lists to help users prepare:

**critical_dates**: Important dates with full details
- date: YYYY-MM-DD format
- event: What happens (e.g., "Compulsory site visit", "Closing date")
- time: HH:MM format or "Not specified"
- location: Physical location or "N/A"

**preparation_tasks**: Prioritized checklist of what to do
- task: Clear action item (e.g., "Obtain tax clearance certificate")
- priority: "High", "Medium", or "Low"
- deadline: YYYY-MM-DD or "Before submission"
- category: "Compliance", "Documentation", "Technical", or "Financial"

Include 5-10 tasks covering all major requirements.

---

### STEP 5 — EXTRACT FINANCIAL REQUIREMENTS
Identify all financial obligations and requirements:

- bank_guarantee: Amount and duration (e.g., "10% of contract value for 12 months")
- performance_bond: Amount and conditions
- insurance_requirements: List of required insurance types with coverage amounts
- financial_turnover: Minimum annual turnover requirement
- audited_financials: Period required (e.g., "Last 3 years")
- payment_terms: Payment schedule, retention amounts, payment timeframes

---

### STEP 6 — EXTRACT LEGAL & REGISTRATION REQUIREMENTS
Identify all registration and legal requirements:

- cidb_grading: Specific CIDB grade required (e.g., "CE6", "GB4")
- cipc_registration: Company registration requirements
- professional_registration: Required professional bodies (SACPCMP, ECSA, SACAP, etc.)
- joint_venture_requirements: JV limitations or requirements
- subcontracting_limitations: Maximum percentage allowed

---

### STEP 7 — EXTRACT LABOUR & EMPLOYMENT REQUIREMENTS
Identify workforce and local content requirements:

- local_content: Required percentage (e.g., "100%", "60%")
- subcontracting_limit: Maximum subcontracting percentage
- labour_composition: Required workforce demographics
- skills_development: Training or skills levy requirements
- employment_equity: EE plan requirements

---

### STEP 8 — EXTRACT TECHNICAL SPECIFICATIONS
Identify experience and capability requirements:

- minimum_experience: Years of experience required (e.g., "5 years in similar projects")
- project_references: Number and value of similar projects required
- key_personnel: Qualifications and experience for key staff
- equipment_resources: Required machinery, vehicles, or equipment
- methodology_requirements: Expected approach or methodology

---

### STEP 9 — EXTRACT SUBMISSION REQUIREMENTS
Identify how to submit the tender:

- number_of_copies: Hard and soft copies required
- formatting_requirements: Page limits, font sizes, binding
- submission_address: Physical address or portal URL
- query_deadline: Last date for questions
- late_submission_policy: Whether late submissions are accepted

---

### STEP 10 — EXTRACT PENALTIES & PAYMENT TERMS
Identify financial penalties and payment structure:

- late_completion_penalty: Daily or percentage penalty
- non_performance_penalty: Penalties for not meeting KPIs
- warranty_period: Defects liability period
- payment_schedule: Monthly, milestone-based, etc.
- retention_amount: Percentage held back
- payment_timeframe: Days from invoice (e.g., "30 days")

---

### STEP 11 — EXTRACT ALL FILLABLE FORM FIELDS
CRITICAL: You must scan the ENTIRE document and extract EVERY field that needs to be filled in by the bidder.

**SCAN FOR THESE SPECIFIC ELEMENTS:**

1. **Standard Bid Documents (SBD Forms)**:
   - SBD 1: Invitation to Bid (company details, contact info, pricing totals)
   - SBD 2: Tax Clearance Certificate requirements
   - SBD 3.1: Pricing Schedule - Firm Prices (line items, quantities, rates, totals)
   - SBD 3.2: Pricing Schedule - Non-Firm Prices
   - SBD 3.3: Pricing Schedule - Professional Services
   - SBD 4: Declaration of Interest (director details, relationships, conflicts)
   - SBD 6.1: Preference Points Claim Form (BBBEE level, ownership)
   - SBD 6.2: Local Content Declaration
   - SBD 7.1: Contract Form - Purchase of Goods
   - SBD 7.2: Contract Form - Rendering of Services
   - SBD 7.3: Contract Form - Disposal of Assets
   - SBD 8: Declaration of Bidder's Past SCM Practices
   - SBD 9: Certificate of Independent Bid Determination

2. **Municipal Bid Documents (MBD Forms)**:
   - MBD 1: Invitation to Bid
   - MBD 4: Declaration of Interest
   - MBD 5: Declaration for Procurement above R10 million
   - MBD 6.1: Preference Points Claim Form
   - MBD 6.2: Local Content Declaration
   - MBD 7.1-7.3: Contract Forms
   - MBD 8: Declaration of Bidder's Past SCM Practices
   - MBD 9: Certificate of Independent Bid Determination

3. **Tables and Schedules to Complete**:
   - Pricing schedules with columns (item, description, quantity, unit, rate, amount)
   - Bill of Quantities (BOQ)
   - Resource schedules (equipment, personnel)
   - Project programme/timeline tables
   - Experience/reference tables

4. **Declaration and Certification Fields**:
   - Signature blocks (name, designation, date, signature)
   - Witness signatures
   - Commissioner of Oaths sections
   - Director/shareholder declarations
   - Conflict of interest declarations

5. **Company Information Fields**:
   - Company name, trading name
   - Registration number (CIPC)
   - VAT number
   - CSD MAAA number
   - CIDB registration number and grading
   - BBBEE certificate details (level, expiry, verification agency)
   - Physical address, postal address
   - Contact details (phone, fax, email)
   - Banking details

6. **Technical Response Fields**:
   - Methodology descriptions (textarea)
   - Project approach
   - Implementation timeline
   - Quality management approach
   - Health and safety plan
   - Environmental management

7. **Personnel and Resources**:
   - Key personnel tables (name, qualification, experience, role)
   - CV summaries
   - Equipment lists (type, quantity, owned/hired)
   - Subcontractor details

**FIELD TYPES TO USE:**
- "text": Short text inputs (names, numbers, addresses)
- "textarea": Long text responses (methodology, descriptions)
- "number": Numeric values (prices, quantities, percentages)
- "date": Date fields (YYYY-MM-DD format)
- "email": Email addresses
- "tel": Phone/fax numbers
- "select": Dropdown choices (yes/no, levels, categories)
- "checkbox": Agreement/declaration confirmations
- "file": Document uploads (certificates, CVs)
- "table": Repeating rows (pricing items, personnel, references)

**FOR TABLE FIELDS, include:**
- columns: Array of column definitions with { id, label, type }
- minRows: Minimum number of rows required

**GENERATE 25-50 FORM FIELDS** covering every fillable element in the document.

Each field must have:
- id: Unique snake_case identifier (e.g., "sbd1_company_name", "pricing_item_1_rate")
- label: Display name matching the document label
- type: One of the types listed above
- required: true for mandatory fields, false for optional
- section: Group name (e.g., "SBD 1 - Invitation to Bid", "Pricing Schedule", "Declaration of Interest")
- placeholder: Example value or hint
- description: Help text explaining what to enter
- options: Array for select fields (e.g., ["Yes", "No"], ["Level 1", "Level 2", ...])
- validation: Optional regex pattern for validation
- columns: For table type, array of column definitions
- minRows: For table type, minimum rows required

**SECTION NAMES TO USE:**
- "SBD 1 - Invitation to Bid"
- "SBD 3.1 - Pricing Schedule"
- "SBD 4 - Declaration of Interest"
- "SBD 6.1 - Preference Points"
- "SBD 8 - Past SCM Practices"
- "SBD 9 - Independent Bid"
- "Company Information"
- "Technical Response"
- "Key Personnel"
- "Equipment & Resources"
- "Project References"
- "Banking Details"
- "Declarations & Signatures"

---

### STEP 12 — RISK ASSESSMENT & B-BBEE ANALYSIS
Analyze the tender for risks and B-BBEE scoring potential:

**risk_assessment**:
- **overall_risk_score**: Number from 1-10 (1=low risk, 10=high risk)
- **risk_level**: "Low", "Medium", "High", or "Critical"
- **risk_factors**: Array of specific risks identified, each with:
  - factor: Description of the risk
  - severity: "Low", "Medium", "High"
  - mitigation: Suggested way to address this risk
- **risk_reasoning**: 2-3 sentence summary of why this risk level was assigned

**bbbee_analysis**:
- **points_available**: Total B-BBEE preference points available (usually 10 or 20)
- **pricing_system**: "80/20" or "90/10" preference point system
- **level_points_breakdown**: Array showing points per B-BBEE level:
  - level: "Level 1", "Level 2", etc.
  - points: Points awarded for this level
- **sub_contracting_requirements**: Any mandatory subcontracting to EMEs/QSEs
- **local_content_bonus**: Additional points for local content commitment
- **recommendations**: Array of 3-5 actionable recommendations to maximize B-BBEE points

Consider these risk factors:
- Tight deadlines or unrealistic timeframes
- Onerous penalty clauses
- Unusual payment terms (long payment periods, high retentions)
- Complex technical requirements
- High financial requirements (guarantees, bonds, insurance)
- Mandatory certifications or registrations you may not have
- Geographic constraints or local preference requirements
- Joint venture or subcontracting complexities
- Ambiguous scope or specifications
- History of disputes or litigation with the entity

---

### OUTPUT FORMAT
Return ONE valid JSON object with this exact structure:

{
  "tender_summary": { ... },
  "compliance_summary": { ... },
  "evaluation": { ... },
  "action_plan": { ... },
  "financial_requirements": {
    "bank_guarantee": "",
    "performance_bond": "",
    "insurance_requirements": [],
    "financial_turnover": "",
    "audited_financials": "",
    "payment_terms": ""
  },
  "legal_registration": {
    "cidb_grading": "",
    "cipc_registration": "",
    "professional_registration": [],
    "joint_venture_requirements": "",
    "subcontracting_limitations": ""
  },
  "labour_employment": {
    "local_content": "",
    "subcontracting_limit": "",
    "labour_composition": "",
    "skills_development": "",
    "employment_equity": ""
  },
  "technical_specs": {
    "minimum_experience": "",
    "project_references": "",
    "key_personnel": [],
    "equipment_resources": [],
    "methodology_requirements": ""
  },
  "submission_requirements": {
    "number_of_copies": "",
    "formatting_requirements": "",
    "submission_address": "",
    "query_deadline": "",
    "late_submission_policy": ""
  },
  "penalties_payment": {
    "late_completion_penalty": "",
    "non_performance_penalty": "",
    "warranty_period": "",
    "payment_schedule": "",
    "retention_amount": "",
    "payment_timeframe": ""
  },
  "formFields": [
    {
      "id": "sbd1_company_name",
      "label": "Company Name",
      "type": "text",
      "required": true,
      "section": "SBD 1 - Invitation to Bid",
      "placeholder": "",
      "description": "Enter the name of your company",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_trading_name",
      "label": "Trading Name",
      "type": "text",
      "required": false,
      "section": "SBD 1 - Invitation to Bid",
      "placeholder": "",
      "description": "Enter your company's trading name if applicable",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_contact_email",
      "label": "Contact Email",
      "type": "email",
      "required": true,
      "section": "SBD 1 - Invitation to Bid",
      "placeholder": "example@example.com",
      "description": "Enter your company's contact email",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_contact_phone",
      "label": "Contact Phone",
      "type": "tel",
      "required": true,
      "section": "SBD 1 - Invitation to Bid",
      "placeholder": "123-456-7890",
      "description": "Enter your company's contact phone number",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_contact_fax",
      "label": "Contact Fax",
      "type": "tel",
      "required": false,
      "section": "SBD 1 - Invitation to Bid",
      "placeholder": "123-456-7890",
      "description": "Enter your company's contact fax number if applicable",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_physical_address",
      "label": "Physical Address",
      "type": "text",
      "required": true,
      "section": "SBD 1 - Invitation to Bid",
      "placeholder": "",
      "description": "Enter your company's physical address",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_postal_address",
      "label": "Postal Address",
      "type": "text",
      "required": true,
      "section": "SBD 1 - Invitation to Bid",
      "placeholder": "",
      "description": "Enter your company's postal address",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_cipc_registration",
      "label": "CIPC Registration Number",
      "type": "text",
      "required": true,
      "section": "Company Information",
      "placeholder": "",
      "description": "Enter your company's CIPC registration number",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_vat_number",
      "label": "VAT Number",
      "type": "text",
      "required": true,
      "section": "Company Information",
      "placeholder": "",
      "description": "Enter your company's VAT number",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_cidb_registration_number",
      "label": "CIDB Registration Number",
      "type": "text",
      "required": true,
      "section": "Company Information",
      "placeholder": "",
      "description": "Enter your company's CIDB registration number",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_cidb_grading",
      "label": "CIDB Grading",
      "type": "select",
      "required": true,
      "section": "Company Information",
      "placeholder": "",
      "description": "Select your company's CIDB grading",
      "options": ["CE6", "GB4", "Other"],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_bbbee_level",
      "label": "BBBEE Level",
      "type": "select",
      "required": true,
      "section": "Company Information",
      "placeholder": "",
      "description": "Select your company's BBBEE level",
      "options": ["Level 1", "Level 2", "Level 3", "Level 4"],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_bbbee_expiry",
      "label": "BBBEE Certificate Expiry",
      "type": "date",
      "required": true,
      "section": "Company Information",
      "placeholder": "",
      "description": "Enter the expiry date of your BBBEE certificate",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_bbbee_verification_agency",
      "label": "BBBEE Verification Agency",
      "type": "text",
      "required": true,
      "section": "Company Information",
      "placeholder": "",
      "description": "Enter the name of the BBBEE verification agency",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_director_name",
      "label": "Director's Name",
      "type": "text",
      "required": true,
      "section": "SBD 4 - Declaration of Interest",
      "placeholder": "",
      "description": "Enter the name of the director",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_director_designation",
      "label": "Director's Designation",
      "type": "text",
      "required": true,
      "section": "SBD 4 - Declaration of Interest",
      "placeholder": "",
      "description": "Enter the designation of the director",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_director_date",
      "label": "Declaration Date",
      "type": "date",
      "required": true,
      "section": "SBD 4 - Declaration of Interest",
      "placeholder": "",
      "description": "Enter the date of declaration",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_signature",
      "label": "Signature",
      "type": "file",
      "required": true,
      "section": "Declarations & Signatures",
      "placeholder": "",
      "description": "Upload your signature",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "sbd1_conflict_of_interest",
      "label": "Conflict of Interest Declaration",
      "type": "checkbox",
      "required": true,
      "section": "Declarations & Signatures",
      "placeholder": "",
      "description": "Confirm that there are no conflicts of interest",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "pricing_schedule",
      "label": "Pricing Schedule",
      "type": "table",
      "required": true,
      "section": "SBD 3.1 - Pricing Schedule",
      "placeholder": "",
      "description": "Enter pricing details",
      "options": [],
      "validation": "",
      "columns": [
        { "id": "item", "label": "Item", "type": "text" },
        { "id": "description", "label": "Description", "type": "text" },
        { "id": "quantity", "label": "Quantity", "type": "number" },
        { "id": "unit", "label": "Unit", "type": "text" },
        { "id": "rate", "label": "Rate", "type": "number" },
        { "id": "amount", "label": "Amount", "type": "number" }
      ],
      "minRows": 5
    },
    {
      "id": "project_references",
      "label": "Project References",
      "type": "table",
      "required": true,
      "section": "Project References",
      "placeholder": "",
      "description": "Enter your project references",
      "options": [],
      "validation": "",
      "columns": [
        { "id": "project_name", "label": "Project Name", "type": "text" },
        { "id": "project_value", "label": "Project Value", "type": "number" },
        { "id": "project_duration", "label": "Project Duration", "type": "text" }
      ],
      "minRows": 3
    },
    {
      "id": "key_personnel",
      "label": "Key Personnel",
      "type": "table",
      "required": true,
      "section": "Key Personnel",
      "placeholder": "",
      "description": "Enter details of key personnel",
      "options": [],
      "validation": "",
      "columns": [
        { "id": "name", "label": "Name", "type": "text" },
        { "id": "qualification", "label": "Qualification", "type": "text" },
        { "id": "experience", "label": "Experience", "type": "number" },
        { "id": "role", "label": "Role", "type": "text" }
      ],
      "minRows": 2
    },
    {
      "id": "equipment_resources",
      "label": "Equipment & Resources",
      "type": "table",
      "required": true,
      "section": "Equipment & Resources",
      "placeholder": "",
      "description": "Enter details of required equipment and resources",
      "options": [],
      "validation": "",
      "columns": [
        { "id": "type", "label": "Type", "type": "text" },
        { "id": "quantity", "label": "Quantity", "type": "number" },
        { "id": "owned_hired", "label": "Owned/Hired", "type": "select", "options": ["Owned", "Hired"] }
      ],
      "minRows": 3
    },
    {
      "id": "technical_response_methodology",
      "label": "Methodology Description",
      "type": "textarea",
      "required": true,
      "section": "Technical Response",
      "placeholder": "",
      "description": "Describe your methodology for the project",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "technical_response_project_approach",
      "label": "Project Approach",
      "type": "text",
      "required": true,
      "section": "Technical Response",
      "placeholder": "",
      "description": "Enter your project approach",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "technical_response_timeline",
      "label": "Implementation Timeline",
      "type": "textarea",
      "required": true,
      "section": "Technical Response",
      "placeholder": "",
      "description": "Enter your implementation timeline",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "technical_response_quality_management",
      "label": "Quality Management Approach",
      "type": "textarea",
      "required": true,
      "section": "Technical Response",
      "placeholder": "",
      "description": "Describe your quality management approach",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "technical_response_health_safety",
      "label": "Health and Safety Plan",
      "type": "textarea",
      "required": true,
      "section": "Technical Response",
      "placeholder": "",
      "description": "Describe your health and safety plan",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "technical_response_environmental",
      "label": "Environmental Management",
      "type": "textarea",
      "required": true,
      "section": "Technical Response",
      "placeholder": "",
      "description": "Describe your environmental management strategy",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    },
    {
      "id": "banking_details",
      "label": "Banking Details",
      "type": "textarea",
      "required": true,
      "section": "Banking Details",
      "placeholder": "",
      "description": "Enter your banking details",
      "options": [],
      "validation": "",
      "columns": [],
      "minRows": 0
    }
  ],
  "risk_assessment": {
    "overall_risk_score": 0,
    "risk_level": "",
    "risk_factors": [],
    "risk_reasoning": ""
  },
  "bbbee_analysis": {
    "points_available": 0,
    "pricing_system": "",
    "level_points_breakdown": [],
    "sub_contracting_requirements": "",
    "local_content_bonus": "",
    "recommendations": []
  }
}

CRITICAL RULES:
- Return ONLY valid JSON, no additional text
- Use South African terminology (CSD, CIDB, BBBEE, MBD, SBD)
- All dates must be YYYY-MM-DD format
- Weights must be numbers, not strings
- If information is unclear, provide sensible defaults
- Include at least one item in each array
- Use "Not specified" for missing fields`;
}),
"[project]/lib/prompts/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Prompt Management System
 *
 * This module manages AI analysis prompts and allows switching between
 * the original production prompt and custom test prompts.
 *
 * Usage:
 * - Set USE_CUSTOM_PROMPT=true in environment variables to use custom prompt
 * - Set USE_CUSTOM_PROMPT=false (or omit) to use original prompt
 * - Edit custom-analysis-prompt.ts to test new prompts
 * - Original prompt is always preserved in original-analysis-prompt.ts
 */ __turbopack_context__.s([
    "getAnalysisPrompt",
    ()=>getAnalysisPrompt,
    "getFormFieldsInstruction",
    ()=>getFormFieldsInstruction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prompts$2f$original$2d$analysis$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prompts/original-analysis-prompt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prompts$2f$custom$2d$analysis$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prompts/custom-analysis-prompt.ts [app-route] (ecmascript)");
;
;
function getAnalysisPrompt() {
    const useCustomPrompt = process.env.USE_CUSTOM_PROMPT === "true";
    if (useCustomPrompt) {
        console.log("[v0] Using CUSTOM analysis prompt");
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prompts$2f$custom$2d$analysis$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CUSTOM_ANALYSIS_PROMPT"];
    }
    console.log("[v0] Using ORIGINAL analysis prompt");
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prompts$2f$original$2d$analysis$2d$prompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ORIGINAL_ANALYSIS_PROMPT"];
}
function getFormFieldsInstruction(pdfFields) {
    if (pdfFields && pdfFields.length > 0) {
        return `
CRITICAL: The PDF has ${pdfFields.length} interactive form fields. You MUST use these EXACT field names as the 'id' property.

PDF Form Fields:
${pdfFields.map((f, idx)=>`${idx + 1}. "${f.name}" (${f.type})`).join("\n")}

FORM FIELD GENERATION RULES:
1. For EACH PDF field above, create a corresponding form field entry
2. Use the EXACT field name from the PDF as the 'id' (case-sensitive)
3. Create a human-readable label by:
   - Converting CamelCase to spaces (e.g., "CompanyName" → "Company Name")
   - Converting snake_case to spaces (e.g., "company_name" → "Company Name")
   - Capitalizing appropriately
4. Map the PDF field type to the appropriate form field type:
   - PDFTextField → "text" or "textarea" (use textarea for long text fields)
   - PDFCheckBox → "checkbox"
   - PDFRadioGroup → "radio"
   - PDFDropdown → "select"
5. Mark fields as required if they appear mandatory in the document
6. Add helpful descriptions based on the document context
7. Group fields into logical sections (Company Info, Financial, Technical, etc.)

Example:
PDF Field: "CompanyRegistrationNumber" (PDFTextField)
Form Field:
{
  "id": "CompanyRegistrationNumber",
  "label": "Company Registration Number",
  "type": "text",
  "required": true,
  "placeholder": "e.g., 2021/123456/07",
  "description": "Your company's official registration number",
  "section": "Company Information"
}
`;
    }
    return `
FORM FIELD GENERATION (No PDF fields detected - create comprehensive form):

Extract EVERY piece of information requested in the tender document and create appropriate form fields.
Be thorough and detailed - include ALL information requirements mentioned.

REQUIRED SECTIONS TO COVER:
1. Company Information:
   - Company name, registration number, VAT number
   - Physical and postal addresses
   - Contact person details (name, email, phone)
   - Company type, years in business
   - Website, social media

2. Financial Information:
   - Annual turnover (last 3 years)
   - Bank details (name, branch, account)
   - Tax clearance certificate
   - Financial statements
   - Credit references

3. Technical Capabilities:
   - Relevant experience (years)
   - Similar projects completed
   - Technical staff qualifications
   - Equipment and resources
   - Quality certifications (ISO, etc.)

4. Compliance & Legal:
   - BBBEE certificate and level
   - Professional indemnity insurance
   - Public liability insurance
   - Health and safety compliance
   - Industry-specific licenses

5. Project-Specific:
   - Methodology and approach
   - Project timeline
   - Resource allocation
   - Risk management plan
   - Quality assurance procedures

6. Pricing:
   - Detailed cost breakdown
   - Payment terms
   - Validity period
   - Assumptions and exclusions

7. References:
   - Client references (minimum 3)
   - Contact details for references
   - Project descriptions

8. Supporting Documents:
   - Company profile
   - Certificates and licenses
   - Previous work samples
   - CVs of key personnel

For each field, provide:
- Unique, descriptive ID (use snake_case)
- Clear, concise label
- Appropriate type (text, email, tel, number, date, textarea, select, checkbox, file)
- Whether it's required
- Helpful placeholder text
- Detailed description of what's needed
- Logical section grouping
- Options array for select/checkbox/radio fields
`;
}
;
}),
"[project]/lib/analysis/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analysisSchema",
    ()=>analysisSchema,
    "compactSchemaDescription",
    ()=>compactSchemaDescription,
    "default",
    ()=>__TURBOPACK__default__export__,
    "formFieldSchema",
    ()=>formFieldSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const formFieldSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    required: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    section: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    placeholder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    options: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    pdfFieldName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const analysisSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    tender_summary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        tender_number: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        entity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        contract_duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        closing_date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        submission_method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        compulsory_briefing: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        validity_period: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        contact_email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional(),
    compliance_summary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        requirements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
        disqualifiers: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
        strengtheners: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional()
    }).optional(),
    evaluation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        criteria: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            criterion: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            weight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nullable()
        })).optional(),
        threshold: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        pricing_system: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
    }).optional(),
    action_plan: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        critical_dates: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
        })).optional(),
        preparation_tasks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
            task: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
            priority: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            deadline: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
            category: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
        })).optional()
    }).optional(),
    financial_requirements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    legal_registration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    labour_employment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    technical_specs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    submission_requirements: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    penalties_payment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    formFields: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(formFieldSchema).optional(),
    pdfFormFieldsDetected: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    pdfFormFieldCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    diagnostics: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).optional(),
    version: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const compactSchemaDescription = `Top-level JSON object matching analysisSchema keys: tender_summary, compliance_summary, evaluation, action_plan, financial_requirements, legal_registration, labour_employment, technical_specs, submission_requirements, penalties_payment, formFields (array of {id,label,type,required,section,placeholder,description,options,pdfFieldName}), pdfFormFieldsDetected (bool), pdfFormFieldCount (number). Use ISO dates where possible. Respond with RAW JSON only.`;
const __TURBOPACK__default__export__ = analysisSchema;
}),
"[project]/lib/analysis/parser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compactSchemaForPrompt",
    ()=>compactSchemaForPrompt,
    "default",
    ()=>__TURBOPACK__default__export__,
    "extractJsonFromText",
    ()=>extractJsonFromText,
    "stripCodeFences",
    ()=>stripCodeFences,
    "validateJsonAgainstSchema",
    ()=>validateJsonAgainstSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analysis$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/analysis/schema.ts [app-route] (ecmascript)");
;
function extractJsonFromText(text) {
    if (!text) return null;
    const start = text.indexOf("{");
    if (start === -1) return null;
    let depth = 0;
    for(let i = start; i < text.length; i++){
        const ch = text[i];
        if (ch === "{") depth++;
        else if (ch === "}") depth--;
        if (depth === 0) {
            const candidate = text.substring(start, i + 1);
            return candidate;
        }
    }
    return null;
}
function stripCodeFences(text) {
    let s = text.trim();
    if (s.startsWith("```json")) s = s.replace(/^```json\s*/i, "");
    if (s.startsWith("```")) s = s.replace(/^```\s*/i, "");
    if (s.endsWith("```")) s = s.replace(/```\s*$/i, "");
    return s.trim();
}
function validateJsonAgainstSchema(obj) {
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analysis$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].safeParse(obj);
    if (res.success) return {
        valid: true,
        parsed: res.data
    };
    const errors = res.error.errors.map((e)=>({
            path: e.path,
            message: e.message
        }));
    return {
        valid: false,
        errors
    };
}
function compactSchemaForPrompt() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analysis$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compactSchemaDescription"];
}
const __TURBOPACK__default__export__ = {
    extractJsonFromText,
    stripCodeFences,
    validateJsonAgainstSchema,
    compactSchemaForPrompt
};
}),
"[project]/app/api/analyze-tender/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$providers$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/providers/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$unpdf$40$1$2e$4$2e$0_$40$napi$2d$rs$2b$canvas$40$0$2e$1$2e$85$2f$node_modules$2f$unpdf$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/unpdf@1.4.0_@napi-rs+canvas@0.1.85/node_modules/unpdf/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$pdf$2d$lib$40$1$2e$17$2e$1$2f$node_modules$2f$pdf$2d$lib$2f$es$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/pdf-lib@1.17.1/node_modules/pdf-lib/es/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$pdf$2d$lib$40$1$2e$17$2e$1$2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/pdf-lib@1.17.1/node_modules/pdf-lib/es/api/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prompts$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/prompts/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analysis$2f$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/analysis/parser.ts [app-route] (ecmascript)");
;
;
;
;
;
async function extractPdfFormFields(pdfUrl) {
    try {
        console.log("[v0] Extracting PDF form fields from:", pdfUrl);
        const pdfResponse = await fetch(pdfUrl);
        if (!pdfResponse.ok) {
            throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
        }
        const pdfBytes = await pdfResponse.arrayBuffer();
        const pdfDoc = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$pdf$2d$lib$40$1$2e$17$2e$1$2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PDFDocument"].load(pdfBytes, {
            ignoreEncryption: true
        });
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        const pages = pdfDoc.getPages();
        const extractedFields = fields.map((field)=>{
            const name = field.getName();
            const typeName = field.constructor.name;
            let type = "text";
            let options;
            let position;
            if (typeName === "PDFTextField") {
                type = "text";
            } else if (typeName === "PDFCheckBox") {
                type = "checkbox";
            } else if (typeName === "PDFRadioGroup") {
                type = "radio";
                try {
                    options = field.getOptions?.() || [];
                } catch  {
                    options = [];
                }
            } else if (typeName === "PDFDropdown") {
                type = "select";
                try {
                    options = field.getOptions?.() || [];
                } catch  {
                    options = [];
                }
            }
            try {
                const widgets = field.acroField.getWidgets();
                if (widgets.length > 0) {
                    const widget = widgets[0];
                    const rect = widget.getRectangle();
                    // Find which page this widget is on
                    let pageIndex = 0;
                    for(let i = 0; i < pages.length; i++){
                        const pageRef = pages[i].ref;
                        const widgetPage = widget.P();
                        if (widgetPage && pageRef.toString() === widgetPage.toString()) {
                            pageIndex = i;
                            break;
                        }
                    }
                    position = {
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height,
                        page: pageIndex + 1
                    };
                    console.log(`[v0] Field "${name}" position:`, position);
                }
            } catch (posError) {
                console.log(`[v0] Could not extract position for field "${name}"`);
            }
            return {
                name,
                type,
                options,
                position
            };
        });
        console.log("[v0] Found", extractedFields.length, "PDF form fields with positions");
        return {
            fields: extractedFields,
            hasFormFields: extractedFields.length > 0
        };
    } catch (error) {
        console.log("[v0] Could not extract PDF form fields:", error.message);
        return {
            fields: [],
            hasFormFields: false
        };
    }
}
async function POST(request) {
    try {
        const { documentText, documentUrl, pdfFields } = await request.json();
        console.log("[v0] ========================================");
        console.log("[v0] TENDER ANALYSIS REQUEST");
        console.log("[v0] ========================================");
        console.log("[v0] Document text length:", documentText?.length || 0, "characters");
        console.log("[v0] Document URL provided:", documentUrl ? "YES" : "NO");
        console.log("[v0] PDF fields provided:", pdfFields?.length || 0);
        if (!documentText && !documentUrl) {
            return Response.json({
                error: "Either document text or document URL is required"
            }, {
                status: 400
            });
        }
        let pdfFormFields = [];
        let hasPdfFormFields = false;
        if (documentUrl) {
            const pdfFieldsResult = await extractPdfFormFields(documentUrl);
            pdfFormFields = pdfFieldsResult.fields;
            hasPdfFormFields = pdfFieldsResult.hasFormFields;
            console.log("[v0] PDF has interactive form fields:", hasPdfFormFields);
        }
        let textToAnalyze = documentText;
        if (documentUrl && (!documentText || documentText === "")) {
            console.log("[v0] No text provided - extracting from PDF URL using unpdf...");
            console.log("[v0] PDF URL:", documentUrl);
            try {
                console.log("[v0] Step 1: Fetching PDF from blob storage...");
                const pdfResponse = await fetch(documentUrl);
                if (!pdfResponse.ok) {
                    throw new Error(`Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`);
                }
                const pdfArrayBuffer = await pdfResponse.arrayBuffer();
                console.log("[v0] PDF fetched successfully, size:", (pdfArrayBuffer.byteLength / 1024).toFixed(2), "KB");
                console.log("[v0] Step 2: Extracting text using unpdf library...");
                const { text, totalPages } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$unpdf$40$1$2e$4$2e$0_$40$napi$2d$rs$2b$canvas$40$0$2e$1$2e$85$2f$node_modules$2f$unpdf$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(pdfArrayBuffer, {
                    mergePages: true
                });
                textToAnalyze = text;
                console.log("[v0] ✓ Text extracted successfully using unpdf");
                console.log("[v0] Total pages:", totalPages);
                console.log("[v0] Extracted text length:", textToAnalyze.length, "characters");
                console.log("[v0] First 500 characters:", textToAnalyze.substring(0, 500));
                if (!textToAnalyze || textToAnalyze.trim().length < 50) {
                    throw new Error(`Insufficient text extracted from PDF - only got ${textToAnalyze?.length || 0} characters. The PDF might be scanned/image-based.`);
                }
                const wordCount = textToAnalyze.trim().split(/\s+/).length;
                const avgWordsPerPage = Math.round(wordCount / totalPages);
                console.log("[v0] Word count:", wordCount);
                console.log("[v0] Average words per page:", avgWordsPerPage);
                if (avgWordsPerPage < 50) {
                    console.warn("[v0] ⚠️ WARNING: Low word density - PDF might be partially scanned");
                }
            } catch (extractError) {
                console.error("[v0] PDF TEXT EXTRACTION FAILED");
                console.error("[v0] Error message:", extractError?.message);
                return Response.json({
                    error: "Failed to extract text from PDF",
                    errorType: "pdf_extraction_error",
                    details: extractError?.message || "Could not read PDF content",
                    hint: "The PDF might be scanned/image-based, corrupted, or password-protected. Try converting it to a text-based PDF first."
                }, {
                    status: 500
                });
            }
        }
        if (!textToAnalyze || textToAnalyze.length < 50) {
            return Response.json({
                error: "Document text is too short to analyze",
                errorType: "insufficient_content",
                details: `Only ${textToAnalyze?.length || 0} characters available.`
            }, {
                status: 400
            });
        }
        const truncatedText = textToAnalyze.substring(0, 100000);
        console.log("[v0] Using text for analysis, length:", truncatedText.length, "characters");
        const basePrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prompts$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getAnalysisPrompt"])();
        let pdfFieldsInstruction = "";
        if (hasPdfFormFields && pdfFormFields.length > 0) {
            pdfFieldsInstruction = `
IMPORTANT - PDF FORM FIELDS DETECTED:
This PDF document has ${pdfFormFields.length} interactive form fields. You MUST use these EXACT field names as the "id" for your formFields output so they can be auto-filled in the PDF.

Here are the actual PDF form field names and their types:
${pdfFormFields.map((f)=>{
                let info = `- "${f.name}" (type: ${f.type})`;
                if (f.options && f.options.length > 0) {
                    info += ` [options: ${f.options.join(", ")}]`;
                }
                if (f.position) {
                    info += ` [position: page ${f.position.page}, x ${f.position.x}, y ${f.position.y}, width ${f.position.width}, height ${f.position.height}]`;
                }
                return info;
            }).join("\n")}

For each PDF field above, create a corresponding formField entry with:
- id: Use the EXACT field name from the PDF (e.g., "${pdfFormFields[0]?.name || "Text1"}")
- label: A human-readable label describing what the field is for
- type: Match the PDF field type (text, checkbox, select, etc.)
- section: Group related fields together
- required: true if the field appears mandatory
- description: Help text for the user

If the PDF has fewer than 20 form fields, also add additional formFields for any information requested in the document text that doesn't have a corresponding PDF field.
`;
        } else {
            pdfFieldsInstruction = `
NOTE: This PDF does not have interactive form fields. Generate formFields based on ALL fillable information requested in the document text. Create 25-50 fields covering company details, pricing, declarations, technical responses, and all SBD/MBD forms referenced in the document.
`;
        }
        console.log("[v0] Step 3: Calling configured AI provider via wrapper for analysis...");
        // Validate provider configuration early to give actionable errors
        const hasOpenAI = !!process.env.OPENAI_API_KEY;
        const hasAzure = !!process.env.AZURE_OPENAI_ENDPOINT && !!process.env.AZURE_OPENAI_KEY && !!process.env.AZURE_OPENAI_DEPLOYMENT;
        const hasGemini = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
        if (!hasOpenAI && !hasAzure && !hasGemini) {
            console.error('[v0] No AI provider configured. Set OPENAI_API_KEY or GEMINI_API_KEY/GOOGLE_API_KEY or AZURE_OPENAI_* env vars.');
            return Response.json({
                error: 'No AI provider configured',
                errorType: 'no_ai_provider_configured',
                details: 'Set OPENAI_API_KEY or GEMINI_API_KEY/GOOGLE_API_KEY or AZURE_OPENAI_ENDPOINT+AZURE_OPENAI_KEY+AZURE_OPENAI_DEPLOYMENT in your environment.'
            }, {
                status: 400
            });
        }
        // Determine preferred provider for logging/response (actual selection may be influenced by provider wrapper)
        const preferredProvider = hasGemini ? 'Gemini' : hasAzure ? 'Azure' : 'OpenAI';
        const modelToUse = hasGemini ? 'gemini-1.5-flash' : hasAzure ? 'azure-deployment' : 'gpt-4o';
        const promptLength = (basePrompt + '\n' + truncatedText).length;
        console.log(`[v0] Provider selection: ${preferredProvider}; model hint: ${modelToUse}; prompt length: ${promptLength} chars; truncated text length: ${truncatedText.length}`);
        try {
            const startTime = Date.now();
            const { text: aiResponse } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$providers$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
                model: "gemini-2.5-flash",
                prompt: `${basePrompt}

${pdfFieldsInstruction}

IMPORTANT: You MUST respond with ONLY valid JSON. No markdown, no explanations, no code blocks. Just pure JSON.

===========================================
TENDER DOCUMENT TEXT
===========================================

${truncatedText}

===========================================
END OF DOCUMENT
===========================================

Respond with ONLY the following JSON structure (no markdown, no code blocks, just raw JSON):

{
  "tender_summary": {
    "tender_number": "string or Not specified",
    "title": "string or Not specified",
    "entity": "string or Not specified",
    "description": "string or Not specified",
    "contract_duration": "string or Not specified",
    "closing_date": "YYYY-MM-DD format or Not specified",
    "submission_method": "string or Not specified",
    "compulsory_briefing": "string or Not specified",
    "validity_period": "string or Not specified",
    "contact_email": "string or Not specified"
  },
  "compliance_summary": {
    "requirements": ["array of requirement strings"],
    "disqualifiers": ["array of disqualifier strings"],
    "strengtheners": ["array of strengthener strings"]
  },
  "evaluation": {
    "criteria": [{"criterion": "string", "weight": number}],
    "threshold": "string or Not specified",
    "pricing_system": "string or Not specified"
  },
  "action_plan": {
    "critical_dates": [{"date": "YYYY-MM-DD", "event": "string", "time": "string", "location": "string"}],
    "preparation_tasks": [{"task": "string", "priority": "High/Medium/Low", "deadline": "string", "category": "string"}]
  },
  "financial_requirements": {
    "bank_guarantee": "string or Not specified",
    "performance_bond": "string or Not specified",
    "insurance_requirements": ["array of strings"],
    "financial_turnover": "string or Not specified",
    "audited_financials": "string or Not specified",
    "payment_terms": "string or Not specified"
  },
  "legal_registration": {
    "cidb_grading": "string or Not specified",
    "cipc_registration": "string or Not specified",
    "professional_registration": ["array of strings"],
    "joint_venture_requirements": "string or Not specified",
    "subcontracting_limitations": "string or Not specified"
  },
  "labour_employment": {
    "local_content": "string or Not specified",
    "subcontracting_limit": "string or Not specified",
    "labour_composition": "string or Not specified",
    "skills_development": "string or Not specified",
    "employment_equity": "string or Not specified"
  },
  "technical_specs": {
    "minimum_experience": "string or Not specified",
    "project_references": "string or Not specified",
    "key_personnel": ["array of strings"],
    "equipment_resources": ["array of strings"],
    "methodology_requirements": "string or Not specified"
  },
  "submission_requirements": {
    "number_of_copies": "string or Not specified",
    "formatting_requirements": "string or Not specified",
    "submission_address": "string or Not specified",
    "query_deadline": "string or Not specified",
    "late_submission_policy": "string or Not specified"
  },
  "penalties_payment": {
    "late_completion_penalty": "string or Not specified",
    "non_performance_penalty": "string or Not specified",
    "warranty_period": "string or Not specified",
    "payment_schedule": "string or Not specified",
    "retention_amount": "string or Not specified",
    "payment_timeframe": "string or Not specified"
  },
  "formFields": [
    {
      "id": "unique_field_id_or_pdf_field_name",
      "label": "Field Label",
      "type": "text|textarea|number|date|select|checkbox|file|email|tel",
      "required": true/false,
      "section": "Section Name",
      "placeholder": "optional placeholder",
      "description": "optional description",
      "options": ["for select fields only"],
      "pdfFieldName": "original PDF field name if applicable"
    }
  ],
  "pdfFormFieldsDetected": ${hasPdfFormFields},
  "pdfFormFieldCount": ${pdfFormFields.length}
}`
            });
            const endTime = Date.now();
            console.log("[v0] AI generation completed in", (endTime - startTime) / 1000, "seconds");
            console.log("[v0] Raw AI response length:", aiResponse.length, "characters");
            console.log("[v0] AI response preview (first 200 chars):", aiResponse.substring(0, 200));
            console.log("[v0] First 500 chars of response:", aiResponse.substring(0, 500));
            // Robust parsing + verification loop
            let analysis = null;
            const diagnostics = {
                parseAttempts: 0,
                parseErrors: [],
                verifierAttempts: 0,
                providerRawPreview: aiResponse.substring(0, 2000)
            };
            let responseText = aiResponse;
            const maxAttempts = 2;
            for(let attempt = 1; attempt <= maxAttempts; attempt++){
                diagnostics.parseAttempts = attempt;
                try {
                    let cleaned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analysis$2f$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripCodeFences"])(responseText);
                    const candidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analysis$2f$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractJsonFromText"])(cleaned);
                    if (!candidate) {
                        diagnostics.parseErrors.push("no_json_found");
                        throw new Error("No JSON object could be extracted from the model response");
                    }
                    let parsed;
                    try {
                        parsed = JSON.parse(candidate);
                    } catch (e) {
                        diagnostics.parseErrors.push(`json_parse_error: ${e.message}`);
                        throw e;
                    }
                    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analysis$2f$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateJsonAgainstSchema"])(parsed);
                    if (!validation.valid) {
                        diagnostics.parseErrors.push({
                            validation: validation.errors
                        });
                        throw new Error("Schema validation failed");
                    }
                    // Success
                    analysis = parsed;
                    break;
                } catch (parseErr) {
                    console.warn(`[v0] Parse attempt ${attempt} failed:`, parseErr?.message);
                    // Call verifier on last attempt only if we still can try
                    if (attempt < maxAttempts) {
                        diagnostics.verifierAttempts += 1;
                        const verifierPrompt = `The assistant produced the following text when asked to return a single JSON object. Extract or correct the JSON so it matches this canonical schema and return RAW JSON only (no markdown, no explanation):\n\nSchema: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$analysis$2f$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compactSchemaForPrompt"])()}\n\nModel output:\n${responseText}`;
                        try {
                            const { text: verifierResp } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$providers$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
                                model: "gemini-2.5-flash",
                                prompt: verifierPrompt,
                                maxTokens: 4000
                            });
                            responseText = verifierResp;
                            console.log('[v0] Verifier response preview:', responseText.substring(0, 400));
                            continue;
                        } catch (verr) {
                            diagnostics.parseErrors.push(`verifier_error: ${verr?.message}`);
                            break;
                        }
                    }
                }
            }
            if (!analysis) {
                console.error('[v0] Failed to produce valid analysis after verifier attempts', diagnostics);
                return Response.json({
                    error: "Failed to parse or validate AI response as JSON",
                    errorType: "json_parse_or_validation_error",
                    details: diagnostics
                }, {
                    status: 500
                });
            }
            // Attach provider info and diagnostics to analysis for frontend visibility (no secrets)
            analysis.__meta = {
                provider: preferredProvider,
                model: modelToUse
            };
            analysis.diagnostics = analysis.diagnostics || {};
            analysis.diagnostics = {
                ...analysis.diagnostics,
                ...diagnostics
            };
            analysis.pdfFormFieldsDetected = hasPdfFormFields;
            analysis.pdfFormFieldCount = pdfFormFields.length;
            analysis.pdfFormFields = pdfFormFields;
            const defaults = {
                tender_summary: {
                    tender_number: "Not specified",
                    title: "Not specified",
                    entity: "Not specified",
                    description: "Not specified",
                    contract_duration: "Not specified",
                    closing_date: "Not specified",
                    submission_method: "Not specified",
                    compulsory_briefing: "Not specified",
                    validity_period: "Not specified",
                    contact_email: "Not specified"
                },
                compliance_summary: {
                    requirements: [],
                    disqualifiers: [],
                    strengtheners: []
                },
                evaluation: {
                    criteria: [],
                    threshold: "Not specified",
                    pricing_system: "Not specified"
                },
                action_plan: {
                    critical_dates: [],
                    preparation_tasks: []
                },
                financial_requirements: {
                    bank_guarantee: "Not specified",
                    performance_bond: "Not specified",
                    insurance_requirements: [],
                    financial_turnover: "Not specified",
                    audited_financials: "Not specified",
                    payment_terms: "Not specified"
                },
                legal_registration: {
                    cidb_grading: "Not specified",
                    cipc_registration: "Not specified",
                    professional_registration: [],
                    joint_venture_requirements: "Not specified",
                    subcontracting_limitations: "Not specified"
                },
                labour_employment: {
                    local_content: "Not specified",
                    subcontracting_limit: "Not specified",
                    labour_composition: "Not specified",
                    skills_development: "Not specified",
                    employment_equity: "Not specified"
                },
                technical_specs: {
                    minimum_experience: "Not specified",
                    project_references: "Not specified",
                    key_personnel: [],
                    equipment_resources: [],
                    methodology_requirements: "Not specified"
                },
                submission_requirements: {
                    number_of_copies: "Not specified",
                    formatting_requirements: "Not specified",
                    submission_address: "Not specified",
                    query_deadline: "Not specified",
                    late_submission_policy: "Not specified"
                },
                penalties_payment: {
                    late_completion_penalty: "Not specified",
                    non_performance_penalty: "Not specified",
                    warranty_period: "Not specified",
                    payment_schedule: "Not specified",
                    retention_amount: "Not specified",
                    payment_timeframe: "Not specified"
                },
                formFields: []
            };
            for (const key of Object.keys(defaults)){
                if (!analysis[key]) {
                    console.log(`[v0] Adding default for missing: ${key}`);
                    analysis[key] = defaults[key];
                } else if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
                    analysis[key] = {
                        ...defaults[key],
                        ...analysis[key]
                    };
                }
            }
            console.log("[v0] ========================================");
            console.log("[v0] ANALYSIS RESULTS");
            console.log("[v0] ========================================");
            console.log("[v0] Tender title:", analysis.tender_summary?.title);
            console.log("[v0] Requirements count:", analysis.compliance_summary?.requirements?.length || 0);
            console.log("[v0] Disqualifiers count:", analysis.compliance_summary?.disqualifiers?.length || 0);
            console.log("[v0] Criteria count:", analysis.evaluation?.criteria?.length || 0);
            console.log("[v0] Form fields count:", analysis.formFields?.length || 0);
            console.log("[v0] PDF form fields detected:", hasPdfFormFields);
            console.log("[v0] PDF form field count:", pdfFormFields.length);
            console.log("[v0] ========================================");
            return Response.json(analysis);
        } catch (aiError) {
            console.error("[v0] AI GENERATION ERROR");
            console.error("[v0] Error message:", aiError?.message);
            console.error("[v0] Error stack:", aiError?.stack?.substring?.(0, 1000));
            return Response.json({
                error: "AI generation failed",
                errorType: "ai_generation_error",
                details: aiError?.message || "Unknown AI error",
                // include truncated stack for local debugging
                stack: (aiError?.stack || '').substring(0, 1000),
                provider: preferredProvider,
                model: modelToUse
            }, {
                status: 502
            });
        }
    } catch (error) {
        console.error("[v0] ========================================");
        console.error("[v0] TENDER ANALYSIS ERROR");
        console.error("[v0] ========================================");
        console.error("[v0] Error type:", error?.constructor?.name);
        console.error("[v0] Error message:", error?.message);
        return Response.json({
            error: "Failed to analyze tender document",
            details: error?.message || "Unknown error",
            errorType: "server_error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__333740ce._.js.map