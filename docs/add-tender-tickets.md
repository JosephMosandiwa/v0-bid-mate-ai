# Add Tender — Actionable Tickets

This file contains a set of small, actionable tickets derived from the Add Tender user journey in `docs/add-tender-journey.md`.

1. UI: `UploadCustomTenderDialog` component

   - Create modal with drag-and-drop, file picker, supported types, max size.
   - Props: `onUploaded(tenderId)` callback.
   - Client validations for file type and size.

2. API: `POST /api/tenders` (upload)

   - Accept `multipart/form-data` with `file` and optional `metadata` JSON field.
   - Validate file type and size; save to storage (local disk for now), create DB placeholder (stub), return `{ tenderId, status: 'processing' }`.
   - Emit a background job/event to start extraction.

3. Backend: Orchestrator client stub

   - Add `lib/orchestrator.ts` with `extractFromStorage(tenderId, storageRef)` stub that logs and returns mocked extraction JSON.
   - Wire to a background worker or queue (simple in-process setTimeout for now).

4. DB: Tender model & persistence (stub)

   - Add simple JSON-backed store under `data/tenders.json` for prototyping.
   - Functions: `createTender({ storageRef, ownerId }) -> tenderId` and `updateTender(tenderId, patch)`.

5. UI: `TendersList` & `TenderDetails` placeholders

   - Add basic pages `/tenders` and `/tenders/[id]` that read from the JSON store and show status.
   - Show processing banner when `status === 'processing'`.

6. E2E Test: Upload flow

   - Test uploading a file to `POST /api/tenders`, assert response contains `tenderId`, poll `/api/tenders/:id` until status changes to `processed` (mock), and assert fields present.

7. Instrumentation & Tests

   - Add unit tests for mapping and orchestrator stub.
   - Add integration test for upload route.

8. Security/Validation
   - Ensure upload route enforces authentication in next iteration (for now, stubbed to allow requests).

---

Pick a ticket number to work on next, or I will implement ticket #2 (`POST /api/tenders`) now.
