# BidMateAI - Engine Architecture Overview

## Vision

A suite of decoupled, generic engines that power document processing, form intelligence, and data harvesting. These engines are designed to be reusable across multiple applications, with BidMateAI being the first consumer.

---

## Architecture Layers

\`\`\`
LAYER 4: PLATFORM SERVICES
├── EngineHub (API Gateway)
├── Developer Portal
└── Admin Console

LAYER 3: DATA ENGINES
├── DataHarvest (Web scraping, aggregation)
└── LearnLoop (Feedback, ML training)

LAYER 2: INTELLIGENCE ENGINES
├── ThinkEngine (AI orchestration)
├── KnowledgeVault (Domain knowledge)
└── PriceGraph (Pricing intelligence)

LAYER 1: CORE PROCESSING ENGINES
├── DocuMind (Document processing)
├── FormFlow (Form intelligence)
└── TableSense (Table extraction)
\`\`\`

---

## Engine Inventory

### Core Processing Engines

| Engine | Purpose | Status |
|--------|---------|--------|
| DocuMind | Parse documents, extract text/structure/positions | 30% |
| FormFlow | Detect fields, match templates, fill forms | 20% |
| TableSense | Extract and understand tables | 0% |

### Intelligence Engines

| Engine | Purpose | Status |
|--------|---------|--------|
| ThinkEngine | AI orchestration, analysis, NLU | 40% |
| KnowledgeVault | Domain knowledge, rules, compliance | 10% |
| PriceGraph | Pricing data, market intelligence | 0% |

### Data Engines

| Engine | Purpose | Status |
|--------|---------|--------|
| DataHarvest | Scrape, aggregate, normalize data | 60% |
| LearnLoop | Collect feedback, train models | 0% |

### Platform Services

| Service | Purpose | Status |
|---------|---------|--------|
| EngineHub | API gateway, auth, routing | 0% |
| Developer Portal | Docs, SDKs, onboarding | 0% |
| Admin Console | Monitoring, analytics | 0% |

---

## Engine Dependencies

\`\`\`
LearnLoop ←── Receives feedback from ALL engines
    │
    │ improves
    ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  DocuMind ──▶ FormFlow ──▶ TableSense          │
│     │            │            │                 │
│     └────────────┼────────────┘                 │
│                  ▼                              │
│            ThinkEngine                          │
│                  │                              │
│     ┌────────────┼────────────┐                │
│     ▼            ▼            ▼                │
│ KnowledgeVault PriceGraph DataHarvest          │
│                                                 │
└─────────────────────────────────────────────────┘
\`\`\`

---

## Data Flow: Document to Filled Form

\`\`\`
1. Document Upload
   └── DocuMind receives document

2. Document Processing (DocuMind)
   ├── Parse PDF/Word/Image
   ├── OCR if scanned
   ├── Extract text with positions
   ├── Analyze layout
   └── Generate fingerprint

3. Field Detection (FormFlow)
   ├── Match against known templates
   ├── If match: use pre-mapped fields
   ├── If no match: detect fields
   │   ├── Native PDF form fields
   │   ├── Line detection (underscores)
   │   ├── Box detection (rectangles)
   │   └── AI vision (fallback)
   └── Return field definitions

4. Form Generation (FormFlow)
   ├── Create dynamic form from fields
   ├── Apply auto-fill from user profile
   └── Present to user

5. Form Filling (FormFlow)
   ├── User fills form
   ├── Validate inputs
   └── Store responses

6. Document Generation (FormFlow)
   ├── Map values to field positions
   ├── Apply correct fonts
   ├── Generate filled PDF
   └── Return to user

7. Feedback Collection (LearnLoop)
   ├── Track auto-fill accuracy
   ├── Track position corrections
   └── Improve models
\`\`\`

---

## Data Flow: BOQ Processing

\`\`\`
1. Document with BOQ
   └── DocuMind receives document

2. Table Detection (DocuMind)
   ├── Identify table regions
   └── Pass to TableSense

3. Table Extraction (TableSense)
   ├── Parse table structure
   ├── Extract headers
   ├── Extract rows
   └── Identify columns (item, qty, unit, rate, total)

4. Item Classification (TableSense + ThinkEngine)
   ├── Categorize items (materials, labour, etc.)
   └── Identify missing items

5. Pricing (PriceGraph)
   ├── Look up historical prices
   ├── Apply regional adjustments
   ├── Calculate confidence scores
   └── Suggest pricing

6. User Review
   ├── Present BOQ with suggestions
   ├── User accepts/modifies prices
   └── Calculate totals

7. Feedback (LearnLoop)
   ├── Track accepted prices
   ├── Track modifications
   └── Improve pricing model
\`\`\`

---

## Third-Party App Integration

All engines are accessed via EngineHub API Gateway.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    THIRD-PARTY APPS                          │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ BidMateAI    │ App 2        │ App 3        │ App N         │
│ (Tendering)  │ (Legal Docs) │ (HR Forms)   │ (Any Domain)  │
└──────┬───────┴──────┬───────┴──────┬───────┴───────┬───────┘
       │              │              │               │
       └──────────────┴──────────────┴───────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   EngineHub     │
                    │   API Gateway   │
                    ├─────────────────┤
                    │ • Authentication│
                    │ • Rate Limiting │
                    │ • Routing       │
                    │ • Metering      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │DocuMind │         │FormFlow │         │TableSense│
   └─────────┘         └─────────┘         └─────────┘
\`\`\`

---

## API Structure

Base URL: `https://api.engines.bidmate.ai`

### Authentication
All requests require API key in header:
\`\`\`
Authorization: Bearer {api_key}
X-App-ID: {app_id}
\`\`\`

### Endpoints by Engine

#### DocuMind
\`\`\`
POST   /documind/parse
GET    /documind/document/{id}
POST   /documind/ocr
POST   /documind/match
GET    /documind/health
\`\`\`

#### FormFlow
\`\`\`
POST   /formflow/detect
POST   /formflow/fill
GET    /formflow/template/{id}
POST   /formflow/template
GET    /formflow/health
\`\`\`

#### TableSense
\`\`\`
POST   /tablesense/extract
GET    /tablesense/table/{id}
GET    /tablesense/health
\`\`\`

#### ThinkEngine
\`\`\`
POST   /think/analyze
POST   /think/chat
GET    /think/health
\`\`\`

#### DataHarvest
\`\`\`
GET    /harvest/tenders
GET    /harvest/tender/{id}
POST   /harvest/search
GET    /harvest/health
\`\`\`

#### LearnLoop
\`\`\`
POST   /learn/feedback
GET    /learn/metrics
GET    /learn/health
\`\`\`

---

## Database Architecture

Each engine has isolated tables with clear ownership.

### DocuMind Tables
- documents
- document_pages
- document_fields
- document_templates
- template_matches

### FormFlow Tables
- form_definitions
- form_fields
- field_mappings
- fill_sessions
- fill_values

### TableSense Tables
- extracted_tables
- table_rows
- table_columns
- table_templates

### ThinkEngine Tables
- analysis_results
- prompts
- conversations

### DataHarvest Tables
- sources
- scraped_tenders
- normalized_tenders
- scrape_jobs

### LearnLoop Tables
- feedback_events
- corrections
- model_versions
- training_runs
- accuracy_metrics

---

## Technology Stack (All Engines)

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Next.js API Routes / Standalone |
| Database | PostgreSQL (Supabase) |
| Cache | Redis (Upstash) |
| Queue | QStash (Upstash) |
| Storage | Vercel Blob |
| AI | Vercel AI Gateway |
| Monitoring | Vercel Analytics |

---

## Implementation Priority

| Order | Engine | Rationale |
|-------|--------|-----------|
| 1 | DocuMind | Foundation - all engines depend on it |
| 2 | FormFlow | Core feature - currently broken |
| 3 | TableSense | Enables BOQ feature |
| 4 | KnowledgeVault | Improves analysis quality |
| 5 | PriceGraph | Enables pricing intelligence |
| 6 | LearnLoop | Needs data from other engines |
| 7 | EngineHub | Decouple once engines stable |

---

## Cost Summary (Monthly)

### Development Phase
- Total: ~$100/month
- OCR, storage, cache, queue

### Production (10K docs/month)
- DocuMind: ~$85
- FormFlow: ~$50
- TableSense: ~$40
- ThinkEngine: ~$200
- DataHarvest: ~$50
- LearnLoop: ~$30
- **Total: ~$455/month**

### Scale (100K docs/month)
- **Total: ~$2,000/month**
