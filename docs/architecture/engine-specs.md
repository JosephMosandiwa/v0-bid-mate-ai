# Engine Specifications Index

This document links to detailed specifications for each engine.

---

## Core Processing Engines

### DocuMind
**Status:** In Progress (30%)
**Spec:** [documind-spec.md](../engines/documind-spec.md)

Parse, extract, and understand document structure and content.

Key capabilities:
- PDF/Word/Image parsing
- OCR for scanned documents
- Layout analysis
- Position mapping
- Document fingerprinting

---

### FormFlow
**Status:** Planned (20%)
**Spec:** [formflow-spec.md](../engines/formflow-spec.md) *(to be created)*

Detect fields, match templates, and fill forms.

Key capabilities:
- Field detection (native, lines, boxes, AI)
- Template matching and storage
- Dynamic form generation
- Smart form filling
- Font matching

---

### TableSense
**Status:** Not Started (0%)
**Spec:** [tablesense-spec.md](../engines/tablesense-spec.md) *(to be created)*

Extract and understand tables from documents.

Key capabilities:
- Table region detection
- Structure parsing (rows, columns, headers)
- Cell extraction with positions
- BOQ-specific parsing
- Table templates

---

## Intelligence Engines

### ThinkEngine
**Status:** Partial (40%)
**Spec:** [thinkengine-spec.md](../engines/thinkengine-spec.md) *(to be created)*

AI orchestration, analysis, and natural language understanding.

Key capabilities:
- LLM gateway (multi-provider)
- Prompt management
- Structured output parsing
- Context management
- Analysis pipelines

---

### KnowledgeVault
**Status:** Minimal (10%)
**Spec:** [knowledgevault-spec.md](../engines/knowledgevault-spec.md) *(to be created)*

Domain knowledge storage and querying.

Key capabilities:
- Regulatory database
- Entity profiles
- Compliance rules
- Form library
- Best practices

---

### PriceGraph
**Status:** Not Started (0%)
**Spec:** [pricegraph-spec.md](../engines/pricegraph-spec.md) *(to be created)*

Pricing intelligence and market data.

Key capabilities:
- Historical pricing database
- Regional variations
- Inflation adjustments
- Price suggestions
- Competitor tracking

---

## Data Engines

### DataHarvest
**Status:** Working (60%)
**Spec:** [dataharvest-spec.md](../engines/dataharvest-spec.md) *(to be created)*

Web scraping, data aggregation, and normalization.

Key capabilities:
- Multi-source scraping
- Data normalization
- Search indexing
- Matching algorithms
- Alert system

---

### LearnLoop
**Status:** Not Started (0%)
**Spec:** [learnloop-spec.md](../engines/learnloop-spec.md) *(to be created)*

Feedback collection and model training.

Key capabilities:
- Feedback event collection
- Correction tracking
- Model training pipeline
- A/B testing
- Accuracy metrics

---

## Platform Services

### EngineHub
**Status:** Not Started (0%)
**Spec:** [enginehub-spec.md](../platform/enginehub-spec.md) *(to be created)*

API gateway for all engines.

Key capabilities:
- Authentication
- Rate limiting
- Request routing
- Usage metering
- Webhook management

---

### Developer Portal
**Status:** Not Started (0%)
**Spec:** [devportal-spec.md](../platform/devportal-spec.md) *(to be created)*

Documentation and developer onboarding.

Key capabilities:
- API documentation
- SDKs
- Code examples
- API key management
- Usage dashboard

---

### Admin Console
**Status:** Not Started (0%)
**Spec:** [adminconsole-spec.md](../platform/adminconsole-spec.md) *(to be created)*

Engine management and monitoring.

Key capabilities:
- Health monitoring
- Performance metrics
- Cost tracking
- Model management
- User management
