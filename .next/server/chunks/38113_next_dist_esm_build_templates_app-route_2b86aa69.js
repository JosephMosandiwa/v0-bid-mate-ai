module.exports=[661628,e=>{"use strict";var t=e.i(248749),i=e.i(219650),n=e.i(508677),o=e.i(615159),r=e.i(548938),a=e.i(273073),s=e.i(129714),l=e.i(403736),c=e.i(817889),d=e.i(428765),p=e.i(762198),m=e.i(117109),u=e.i(590702),f=e.i(462216),g=e.i(539401),h=e.i(222695),y=e.i(193695);e.i(31514);var b=e.i(267074),E=e.i(303826),_=e.i(278893);e.i(801612);var v=e.i(430497);let R=`You are an elite tender analyst with 20+ years of experience helping companies win government and corporate tenders. Your analysis must be thorough, actionable, and strategically valuable.

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
9. DATE FORMAT: Always use YYYY-MM-DD format for dates (no time in metadata deadline field)`,D=`You are BidMate AI, an intelligent tender analysis system for South African government and SOE procurement documents.

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
- Use "Not specified" for missing fields`;async function S(e){try{console.log("[v0] Extracting PDF form fields from:",e);let t=await fetch(e);if(!t.ok)throw Error(`Failed to fetch PDF: ${t.status}`);let i=await t.arrayBuffer(),n=await v.PDFDocument.load(i,{ignoreEncryption:!0}),o=n.getForm().getFields(),r=n.getPages(),a=o.map(e=>{let t,i,n=e.getName(),o=e.constructor.name,a="text";if("PDFTextField"===o)a="text";else if("PDFCheckBox"===o)a="checkbox";else if("PDFRadioGroup"===o){a="radio";try{t=e.getOptions?.()||[]}catch{t=[]}}else if("PDFDropdown"===o){a="select";try{t=e.getOptions?.()||[]}catch{t=[]}}try{let t=e.acroField.getWidgets();if(t.length>0){let e=t[0],o=e.getRectangle(),a=0;for(let t=0;t<r.length;t++){let i=r[t].ref,n=e.P();if(n&&i.toString()===n.toString()){a=t;break}}i={x:o.x,y:o.y,width:o.width,height:o.height,page:a+1},console.log(`[v0] Field "${n}" position:`,i)}}catch(e){console.log(`[v0] Could not extract position for field "${n}"`)}return{name:n,type:a,options:t,position:i}});return console.log("[v0] Found",a.length,"PDF form fields with positions"),{fields:a,hasFormFields:a.length>0}}catch(e){return console.log("[v0] Could not extract PDF form fields:",e.message),{fields:[],hasFormFields:!1}}}async function T(e){try{let{documentText:t,documentUrl:i,pdfFields:n}=await e.json();if(console.log("[v0] ========================================"),console.log("[v0] TENDER ANALYSIS REQUEST"),console.log("[v0] ========================================"),console.log("[v0] Document text length:",t?.length||0,"characters"),console.log("[v0] Document URL provided:",i?"YES":"NO"),console.log("[v0] PDF fields provided:",n?.length||0),!t&&!i)return Response.json({error:"Either document text or document URL is required"},{status:400});let o=[],r=!1;if(i){let e=await S(i);o=e.fields,r=e.hasFormFields,console.log("[v0] PDF has interactive form fields:",r)}let a=t;if(i&&(!t||""===t)){console.log("[v0] No text provided - extracting from PDF URL using unpdf..."),console.log("[v0] PDF URL:",i);try{console.log("[v0] Step 1: Fetching PDF from blob storage...");let e=await fetch(i);if(!e.ok)throw Error(`Failed to fetch PDF: ${e.status} ${e.statusText}`);let t=await e.arrayBuffer();console.log("[v0] PDF fetched successfully, size:",(t.byteLength/1024).toFixed(2),"KB"),console.log("[v0] Step 2: Extracting text using unpdf library...");let{text:n,totalPages:o}=await (0,_.extractText)(t,{mergePages:!0});if(a=n,console.log("[v0] ✓ Text extracted successfully using unpdf"),console.log("[v0] Total pages:",o),console.log("[v0] Extracted text length:",a.length,"characters"),console.log("[v0] First 500 characters:",a.substring(0,500)),!a||a.trim().length<50)throw Error(`Insufficient text extracted from PDF - only got ${a?.length||0} characters. The PDF might be scanned/image-based.`);let r=a.trim().split(/\s+/).length,s=Math.round(r/o);console.log("[v0] Word count:",r),console.log("[v0] Average words per page:",s),s<50&&console.warn("[v0] ⚠️ WARNING: Low word density - PDF might be partially scanned")}catch(e){return console.error("[v0] PDF TEXT EXTRACTION FAILED"),console.error("[v0] Error message:",e?.message),Response.json({error:"Failed to extract text from PDF",errorType:"pdf_extraction_error",details:e?.message||"Could not read PDF content",hint:"The PDF might be scanned/image-based, corrupted, or password-protected. Try converting it to a text-based PDF first."},{status:500})}}if(!a||a.length<50)return Response.json({error:"Document text is too short to analyze",errorType:"insufficient_content",details:`Only ${a?.length||0} characters available.`},{status:400});let s=a.substring(0,1e5);console.log("[v0] Using text for analysis, length:",s.length,"characters");let l="true"===process.env.USE_CUSTOM_PROMPT?(console.log("[v0] Using CUSTOM analysis prompt"),D):(console.log("[v0] Using ORIGINAL analysis prompt"),R),c="";c=r&&o.length>0?`
IMPORTANT - PDF FORM FIELDS DETECTED:
This PDF document has ${o.length} interactive form fields. You MUST use these EXACT field names as the "id" for your formFields output so they can be auto-filled in the PDF.

Here are the actual PDF form field names and their types:
${o.map(e=>{let t=`- "${e.name}" (type: ${e.type})`;return e.options&&e.options.length>0&&(t+=` [options: ${e.options.join(", ")}]`),e.position&&(t+=` [position: page ${e.position.page}, x ${e.position.x}, y ${e.position.y}, width ${e.position.width}, height ${e.position.height}]`),t}).join("\n")}

For each PDF field above, create a corresponding formField entry with:
- id: Use the EXACT field name from the PDF (e.g., "${o[0]?.name||"Text1"}")
- label: A human-readable label describing what the field is for
- type: Match the PDF field type (text, checkbox, select, etc.)
- section: Group related fields together
- required: true if the field appears mandatory
- description: Help text for the user

If the PDF has fewer than 20 form fields, also add additional formFields for any information requested in the document text that doesn't have a corresponding PDF field.
`:`
NOTE: This PDF does not have interactive form fields. Generate formFields based on ALL fillable information requested in the document text. Create 25-50 fields covering company details, pricing, declarations, technical responses, and all SBD/MBD forms referenced in the document.
`,console.log("[v0] Step 3: Calling configured AI provider via wrapper for analysis...");try{let e,t=Date.now(),{text:i}=await (0,E.default)({model:"gemini-1.5-flash",prompt:`${l}

${c}

IMPORTANT: You MUST respond with ONLY valid JSON. No markdown, no explanations, no code blocks. Just pure JSON.

===========================================
TENDER DOCUMENT TEXT
===========================================

${s}

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
  "pdfFormFieldsDetected": ${r},
  "pdfFormFieldCount": ${o.length}
}`}),n=Date.now();console.log("[v0] AI generation completed in",(n-t)/1e3,"seconds"),console.log("[v0] Raw AI response length:",i.length,"characters"),console.log("[v0] First 500 chars of response:",i.substring(0,500));try{let t=i.trim();t.startsWith("```json")&&(t=t.slice(7)),t.startsWith("```")&&(t=t.slice(3)),t.endsWith("```")&&(t=t.slice(0,-3)),t=t.trim(),e=JSON.parse(t),console.log("[v0] ✓ JSON parsed successfully")}catch(e){return console.error("[v0] JSON parse error:",e.message),console.error("[v0] Response that failed to parse:",i.substring(0,1e3)),Response.json({error:"Failed to parse AI response as JSON",errorType:"json_parse_error",details:e.message},{status:500})}e.pdfFormFieldsDetected=r,e.pdfFormFieldCount=o.length,e.pdfFormFields=o;let a={tender_summary:{tender_number:"Not specified",title:"Not specified",entity:"Not specified",description:"Not specified",contract_duration:"Not specified",closing_date:"Not specified",submission_method:"Not specified",compulsory_briefing:"Not specified",validity_period:"Not specified",contact_email:"Not specified"},compliance_summary:{requirements:[],disqualifiers:[],strengtheners:[]},evaluation:{criteria:[],threshold:"Not specified",pricing_system:"Not specified"},action_plan:{critical_dates:[],preparation_tasks:[]},financial_requirements:{bank_guarantee:"Not specified",performance_bond:"Not specified",insurance_requirements:[],financial_turnover:"Not specified",audited_financials:"Not specified",payment_terms:"Not specified"},legal_registration:{cidb_grading:"Not specified",cipc_registration:"Not specified",professional_registration:[],joint_venture_requirements:"Not specified",subcontracting_limitations:"Not specified"},labour_employment:{local_content:"Not specified",subcontracting_limit:"Not specified",labour_composition:"Not specified",skills_development:"Not specified",employment_equity:"Not specified"},technical_specs:{minimum_experience:"Not specified",project_references:"Not specified",key_personnel:[],equipment_resources:[],methodology_requirements:"Not specified"},submission_requirements:{number_of_copies:"Not specified",formatting_requirements:"Not specified",submission_address:"Not specified",query_deadline:"Not specified",late_submission_policy:"Not specified"},penalties_payment:{late_completion_penalty:"Not specified",non_performance_penalty:"Not specified",warranty_period:"Not specified",payment_schedule:"Not specified",retention_amount:"Not specified",payment_timeframe:"Not specified"},formFields:[]};for(let t of Object.keys(a))e[t]?"object"!=typeof a[t]||Array.isArray(a[t])||(e[t]={...a[t],...e[t]}):(console.log(`[v0] Adding default for missing: ${t}`),e[t]=a[t]);return console.log("[v0] ========================================"),console.log("[v0] ANALYSIS RESULTS"),console.log("[v0] ========================================"),console.log("[v0] Tender title:",e.tender_summary?.title),console.log("[v0] Requirements count:",e.compliance_summary?.requirements?.length||0),console.log("[v0] Disqualifiers count:",e.compliance_summary?.disqualifiers?.length||0),console.log("[v0] Criteria count:",e.evaluation?.criteria?.length||0),console.log("[v0] Form fields count:",e.formFields?.length||0),console.log("[v0] PDF form fields detected:",r),console.log("[v0] PDF form field count:",o.length),console.log("[v0] ========================================"),Response.json(e)}catch(e){if(console.error("[v0] AI GENERATION ERROR"),console.error("[v0] Error message:",e?.message),e?.message?.includes("429")||e?.message?.includes("quota")){console.warn("[v0] ⚠️ OpenAI Quota Exceeded. Using MOCK DATA for analysis to unblock testing.");let e={tender_summary:{tender_number:"MOCK-429-TEST",title:"Mock Tender (Quota Exceeded Fallback)",entity:"Fallback Entity",description:"This is a generated mock description because the OpenAI API key has exceeded its quota. The application flow is preserved for testing purposes.",closing_date:new Date(Date.now()+12096e5).toISOString().split("T")[0],contract_duration:"12 Months"},compliance_summary:{requirements:["Mock Requirement 1","Mock Requirement 2"],disqualifiers:["Mock Disqualifier"],strengtheners:["Mock Strengthener"]},evaluation:{criteria:[{criterion:"Price",weight:80},{criterion:"BEE",weight:20}]},formFields:[],pdfFormFieldsDetected:r,pdfFormFieldCount:o.length,pdfFormFields:o};return Response.json(e)}return console.error("[v0] Error stack:",e?.stack?.substring(0,500)),Response.json({error:"AI generation failed",errorType:"ai_generation_error",details:e?.message||"Unknown AI error"},{status:500})}}catch(e){return console.error("[v0] ========================================"),console.error("[v0] TENDER ANALYSIS ERROR"),console.error("[v0] ========================================"),console.error("[v0] Error type:",e?.constructor?.name),console.error("[v0] Error message:",e?.message),Response.json({error:"Failed to analyze tender document",details:e?.message||"Unknown error",errorType:"server_error"},{status:500})}}e.s(["POST",()=>T],832437);var N=e.i(832437);let C=new t.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/analyze-tender/route",pathname:"/api/analyze-tender",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/analyze-tender/route.ts",nextConfigOutput:"",userland:N}),{workAsyncStorage:I,workUnitAsyncStorage:P,serverHooks:x}=C;function q(){return(0,n.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:P})}async function w(e,t,n){C.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let E="/api/analyze-tender/route";E=E.replace(/\/index$/,"")||"/";let _=await C.prepare(e,t,{srcPage:E,multiZoneDraftMode:!1});if(!_)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:v,params:R,nextConfig:D,parsedUrl:S,isDraftMode:T,prerenderManifest:N,routerServerContext:I,isOnDemandRevalidate:P,revalidateOnlyGenerated:x,resolvedPathname:q,clientReferenceManifest:w,serverActionsManifest:A}=_,B=(0,l.normalizeAppPath)(E),M=!!(N.dynamicRoutes[B]||N.routes[q]),F=async()=>((null==I?void 0:I.render404)?await I.render404(e,t,S,!1):t.end("This page could not be found"),null);if(M&&!T){let e=!!N.routes[q],t=N.dynamicRoutes[B];if(t&&!1===t.fallback&&!e){if(D.experimental.adapterPath)return await F();throw new y.NoFallbackError}}let O=null;!M||C.isDev||T||(O="/index"===(O=q)?"/":O);let k=!0===C.isDev||!M,L=M&&!k;A&&w&&(0,a.setReferenceManifestsSingleton)({page:E,clientReferenceManifest:w,serverActionsManifest:A,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:A})});let Y=e.method||"GET",U=(0,r.getTracer)(),j=U.getActiveScopeSpan(),H={params:R,prerenderManifest:N,renderOpts:{experimental:{authInterrupts:!!D.experimental.authInterrupts},cacheComponents:!!D.cacheComponents,supportsDynamicResponse:k,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:D.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,i,n)=>C.onRequestError(e,t,n,I)},sharedContext:{buildId:v}},$=new c.NodeNextRequest(e),G=new c.NodeNextResponse(t),V=d.NextRequestAdapter.fromNodeNextRequest($,(0,d.signalFromNodeResponse)(t));try{let a=async e=>C.handle(V,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let i=U.getRootSpanAttributes();if(!i)return;if(i.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${i.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=i.get("next.route");if(n){let t=`${Y} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${Y} ${E}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var r,l;let c=async({previousCacheEntry:i})=>{try{if(!s&&P&&x&&!i)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await a(o);e.fetchMetrics=H.renderOpts.fetchMetrics;let l=H.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let c=H.renderOpts.collectedTags;if(!M)return await (0,u.sendResponse)($,G,r,H.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,f.toNodeOutgoingHttpHeaders)(r.headers);c&&(t[h.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let i=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,n=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:i,expire:n}}}}catch(t){throw(null==i?void 0:i.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:P})},I),t}},d=await C.handleResponse({req:e,nextConfig:D,cacheKey:O,routeKind:i.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:x,responseGenerator:c,waitUntil:n.waitUntil,isMinimalMode:s});if(!M)return null;if((null==d||null==(r=d.value)?void 0:r.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",P?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,f.fromNodeOutgoingHttpHeaders)(d.value.headers);return s&&M||p.delete(h.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,g.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)($,G,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};j?await l(j):await U.withPropagatedContext(e.headers,()=>U.trace(p.BaseServerSpan.handleRequest,{spanName:`${Y} ${E}`,kind:r.SpanKind.SERVER,attributes:{"http.method":Y,"http.target":e.url}},l))}catch(t){if(t instanceof y.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:B,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:P})}),M)throw t;return await (0,u.sendResponse)($,G,new Response(null,{status:500})),null}}e.s(["handler",()=>w,"patchFetch",()=>q,"routeModule",()=>C,"serverHooks",()=>x,"workAsyncStorage",()=>I,"workUnitAsyncStorage",()=>P],661628)}];

//# sourceMappingURL=38113_next_dist_esm_build_templates_app-route_2b86aa69.js.map