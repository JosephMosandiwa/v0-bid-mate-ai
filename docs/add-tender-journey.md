## Add Tender — User Journey (Technical Breakdown)

Purpose: define the end-to-end "Add Tender" journey and break each step into concrete technical functionality, API contracts, data mappings, UI behavior, error handling, tests, and acceptance criteria.

### Summary Flow

- User clicks Add Tender → upload dialog opens
- File upload to backend → store file and create tender placeholder
- Trigger orchestrator extraction (sync/async) → receive structured output + confidences
- Map extraction to tender data model → persist and validate
- Redirect user to tenders list and open new tender details page (`/tenders/:id`)
- Tender Details page: view original doc, edit fields, run actions (invite, publish, export, start evaluation)

### 1) Step: Click Add Tender (UX + Client)

Technical functionality

- UI: an `Add Tender` button (primary) opens `UploadCustomTenderDialog` (modal).
- UX: show supported file types, max size, drag-and-drop area, progress UI, and help text.
- Accessibility: focus trap, keyboard support, aria labels.

Edge cases & validations

- Enforce file type & size client-side; show clear errors.
- Prevent duplicate submissions: disable button during upload, ensure idempotency token.

Acceptance criteria

- Clicking `Add Tender` opens upload dialog; keyboard usable.

### 2) Step: Upload Document (Client → API)

API contract

- Endpoint: `POST /api/tenders` (multipart/form-data)
  - body: `file` (required), `metadata` (optional JSON string: {ownerId, tags})
  - response: 202 Accepted with payload { tenderId, status: 'processing' } or 201 Created if extraction sync

Client behavior

- Display upload progress; on success, redirect to user tenders list and open details for `tenderId` after creation response.
- Use a temporary placeholder UI / skeleton for the new tender while extraction runs.

Server-side functionality

- Validate file (type/size/virus-scan) and store to object storage (S3/GCS/Azure Blob).
- Create tender record with status `processing` and attach storage ref.
- Emit event or queue job to call orchestrator for extraction: `orchestrator.extract(tenderId, storageRef)`.
- Return tenderId to client.

Resiliency

- Ensure idempotency keys to avoid duplicate tender records on retries.
- If storage or DB write fails, return appropriate 4xx/5xx and let client show error and retry option.

Acceptance criteria

- Upload succeeds with progress; file stored and `tenderId` returned; placeholder tender is visible.

### 3) Step: Orchestrator Extraction (Background job)

Functionality

- Background worker picks up `tender.process` job with `tenderId` and `storageRef`.
- Worker calls `POST /api/orchestrator/extract` or internal orchestrator client with the file reference.
- Orchestrator returns structured JSON: fields, per-field confidence, offsets/word-spans, detected tables, attachments.

Data contract (orchestrator → app)

- Example:
  {
  "title": {"value":"Tender ABC","confidence":0.95, "span": {"start": 120, "end": 135}},
  "closingDate": {"value":"2026-02-10T14:00:00Z","confidence":0.88},
  "lots": [{...}],
  "rawText": "...",
  "attachments": [{"name":"spec.pdf", "url":"..."}]
  }

Server handling

- Validate extraction structure and map to DB model.
- For fields with confidence < threshold (e.g., 0.7), mark `needsReview: true` and surface in UI.
- Persist raw extraction JSON in `tender_extractions` with audit metadata (engine version, requestId).
- Update tender status `processed` (or `partial` if critical fields missing).
- Notify client via WebSocket/real-time channel or set a flag so next page load shows updated data.

Error handling & retries

- If orchestrator is unavailable, retry with exponential backoff, up to a limit; update tender status `error` if final.
- On partial extraction, persist what is available and surface manual correction flow.

Acceptance criteria

- Extraction result saved, field confidences available, low-confidence fields flagged.

### 4) Step: Mapping Extraction → Data Model

Mapping rules

- Map core fields to `tenders` table: `title, referenceId, buyer, closingDate, status`.
- Map arrays: `lots` → `tender_lots`, `contacts` → `tender_contacts`.
- Store `raw_extraction` in `tender_extractions` for replay/audit.
- Map attachments as `tender_documents` with storage refs.

Validation & normalization

- Normalize dates to UTC ISO format; validate currency codes and numeric parsing for values.
- Cross-check required fields: if `closingDate` absent or invalid, set `status: incomplete` and `needsReview: true`.

Conflict resolution & manual edits

- If mapping finds existing tender with same referenceId, raise duplicate flag and route to merge/confirm workflow.
- Record every correction in `tender_field_history` with user id and timestamp.

Acceptance criteria

- Mapped fields are persisted consistently; missing critical fields set `needsReview`.

### 5) Step: Redirect & Open Tender Details (Client Navigation)

Behavior

- After `POST /api/tenders` returns tenderId, client navigates to `/tenders` and then to `/tenders/:id` (or directly to `/tenders/:id`).
- When the details page loads, if `status === processing`, show a progress banner and auto-refresh/subscribe to updates.

Real-time updates

- Use WebSocket or polling (e.g., `GET /api/tenders/:id/status`) to update extraction completion and then re-render fields.

Acceptance criteria

- User lands on the new tender details page and sees either processed data or an obvious processing state with ETA.

### 6) Step: Tender Details Page — Full Technical Spec

Primary responsibilities

- Display original document with highlight-to-field mapping.
- Display extracted fields grouped (Summary cards) with inline edit controls.
- Provide a clear correction flow: edit field → save → record audit entry.
- Offer actions: `Publish`, `Duplicate`, `Archive`, `Invite Suppliers`, `Export`, `Download original`.

UI Layout (suggested)

- Header: `Title`, `Status`, primary action buttons.
- Left: `DocumentViewer` with text highlight overlays (click highlight → focus field card).
- Center: `ExtractionSummary` with editable `ExtractionFieldCard` components (field name, value, confidence badge, edit icon).
- Right: `AIRecommendations` and `QuickActions` (Invite, Add collaborator, Create task).
- Tabs: `Overview | Documents | Q&A | Suppliers | Tasks | Timeline | Audit`

Component contracts

- `ExtractionFieldCard` props: { fieldKey, value, confidence, editable, onSave(fieldKey, newValue) }
- `DocumentViewer` props: { documents[], highlights: [{fieldKey, span}] }

Field correction flow

- User clicks edit → UI shows inline input → on save, call `PATCH /api/tenders/:id` with {fieldKey, value, userId}.
- Server validates save, updates `tenders` and appends to `tender_field_history`.
- If user corrects a low-confidence field, optionally trigger re-run of dependent validations/calculations.

Permissions & collaboration

- Enforce RBAC: only users with `tender.edit` can patch; `tender.view` for read-only collaborators.
- Audit events for view/edit/export actions.

Acceptance criteria

- All primary fields editable and persisted; highlights map to values; audit history visible.

### 7) Actions & Background Workflows

Invite Suppliers

- `POST /api/tenders/:id/invite` — input list of supplier identifiers/emails, sends personalized invitation emails, records invites.

Start Evaluation

- `POST /api/tenders/:id/evaluation` — creates evaluation workflow, locks tender metadata if required.

Export

- `GET /api/tenders/:id/export?format=pdf|csv` — generate export via background job and provide download link.

Task creation

- `POST /api/tenders/:id/tasks` — create tasks assigned to users; integrate with notifications.

Acceptance criteria

- Actions complete and update tender state; relevant notifications delivered.

### 8) Error Handling, Observability & Monitoring

Errors to handle

- File validation errors, storage errors, orchestrator timeouts, mapping failures, DB transaction failures.

Observability

- Log structured events: `tender.created`, `tender.extraction.succeeded`, `tender.extraction.failed`.
- Metrics: upload success rate, extraction latency, per-field confidence distribution, manual correction rate.

Alerts

- Alert on orchestrator failures > X/min or extraction failure rate above threshold.

Acceptance criteria

- Errors surfaced to user; retry paths exist; key metrics are captured.

### 9) Security & Compliance

- Authenticate endpoint access (JWT/session) and authorize by role.
- Scan uploaded documents for malware; optionally redact PII before ML processing if required.
- Data retention: store raw documents and extractions per retention policy; respect data subject requests.

### 10) Testing & QA

Unit tests

- Mapping functions for extraction JSON → DB model
- Field parsers (dates, currencies, numeric values)

Integration tests

- `POST /api/tenders` flow with mocked orchestrator responses (happy path, partial, failure).

E2E tests

- Upload file, wait for processing, ensure redirect to `/tenders/:id` and data visible and editable.

Acceptance criteria

- Tests cover happy path, partial extraction, and orchestrator errors.

### 11) Non-functional considerations

Performance

- Use chunked uploads for large files; offload extraction to background workers.

Scalability

- Worker autoscaling and orchestrator concurrency limits; queue depth monitoring.

UX

- Provide helpful inline guidance for low-confidence fields and an easy way to accept AI suggestions.

### 12) Acceptance Criteria (condensed)

- Upload creates `tenderId` and placeholder, extraction persisted with confidences.
- Redirect lands on `/tenders/:id`; page shows extraction or processing banner.
- User can edit and save extracted fields; edits are audited.
- Document viewer links highlights to fields; downloads and exports work.

### 13) Next Implementation Steps (recommended)

1. Locate existing orchestrator client (`lib/engines` or `api/orchestrator`) and add method hooks.
2. Scaffold `TenderDetailsPage` in `components/` and `app/tenders/[id]/page.tsx` with placeholders.
3. Implement `POST /api/tenders` and background worker orchestration.
4. Add tests for mapping and integration.

---

Document created by product/engineering pairing session. Update this file with concrete field mappings once the orchestrator field schema is finalized.
