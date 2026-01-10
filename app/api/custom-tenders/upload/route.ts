export const runtime = 'nodejs'

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"
import { put } from "@vercel/blob"
import type { NextRequest } from "next/server"
import { engineOrchestrator } from "@/lib/engines/orchestrator"
import { randomUUID } from "crypto"
import fs from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting custom tender upload")

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    const effectiveUser =
      user ?? (process.env.NODE_ENV === "development" ? { id: process.env.DEV_USER_ID || "dev-local" } : null)

    if (authError || !user) {
      if (!effectiveUser) {
        console.error("[v0] Auth error:", authError)
        return Response.json({ error: "Unauthorized" }, { status: 401 })
      } else {
        console.warn("[v0] Auth session missing — continuing in development as dev user:", effectiveUser.id)
      }
    }

    console.log("[v0] User:", effectiveUser.id)

    // Ensure DB-friendly user id (Postgres expects UUID). In development, map
    // non-UUID dev ids to a generated stable UUID stored in `process.env.DEV_USER_UUID`.
    const rawUserId = (effectiveUser as any).id
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[089abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
    let dbUserId: string = String(rawUserId)
    if (!uuidRegex.test(dbUserId)) {
      if (process.env.DEV_USER_UUID) {
        dbUserId = process.env.DEV_USER_UUID
      } else {
        const newUuid = randomUUID()
        process.env.DEV_USER_UUID = newUuid
        dbUserId = newUuid
        console.warn(`[v0] Using generated dev UUID for DB user_id: ${newUuid}`)
      }
    }

    // Ensure minimal dev user exists in `users` table to satisfy foreign keys.
    // Use the admin/service-role client where possible to bypass RLS/schema cache issues.
    if (process.env.NODE_ENV === "development") {
      const devEmail = (effectiveUser as any)?.email || `dev+${dbUserId}@local`

      try {
        const admin = createAdminClient()

        // Try inserting a minimal users row via admin client
        const { error: adminErr } = await admin
          .from("users")
          .upsert({ id: dbUserId, email: devEmail, created_at: new Date().toISOString() }, { onConflict: "id" })

        if (adminErr) {
          console.warn("[v0] Admin client upsert into 'users' failed (non-fatal):", adminErr)

          // If users table not present or admin couldn't write, fall back to trying profiles with standard client
          if (adminErr.code === "PGRST205") {
            console.warn("[v0] 'users' table not found via admin client, attempting upsert into 'profiles' instead")
            try {
              const { error: profileErr } = await supabase
                .from("profiles")
                .upsert({ id: dbUserId, email: devEmail, updated_at: new Date().toISOString() }, { onConflict: "id" })

              if (profileErr) {
                console.warn("[v0] Dev profile upsert returned error (non-fatal):", profileErr)
              } else {
                console.log("[v0] Ensured dev profile exists in profiles table:", dbUserId)
              }
            } catch (profileEx) {
              console.warn("[v0] Exception while upserting into profiles (non-fatal):", profileEx)
            }
          }
        } else {
          console.log("[v0] Ensured dev user exists in users table via admin client:", dbUserId)
        }
      } catch (upsertEx) {
        console.warn("[v0] Exception while upserting dev user with admin client (non-fatal):", upsertEx)
      }
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("[v0] No file in form data")
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      console.error("[v0] Invalid file type:", file.type)
      return Response.json({ error: "File must be a PDF" }, { status: 400 })
    }

    console.log("[v0] Uploading custom tender. File:", file.name, "Size:", file.size)

    let blob: { url: string; pathname?: string } | null = null
    try {
      blob = await put(`custom-tenders/${dbUserId}/${Date.now()}-${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      })
      console.log("[v0] PDF uploaded to blob:", blob.url)
    } catch (putErr: any) {
      console.warn('[v0] Vercel Blob upload failed or not configured, continuing in dev without blob:', putErr?.message || putErr)
      blob = null
    }

    // Prepare PDF buffer for orchestrator: if blob upload succeeded, fetch it; otherwise use uploaded file bytes directly
    let arrayBuffer: ArrayBuffer
    if (blob && blob.url) {
      console.log('[v0] Fetching uploaded blob for orchestration at', blob.url)
      const pdfResp = await fetch(blob.url)
      if (!pdfResp.ok) {
        console.error('[v0] Failed to fetch uploaded PDF for orchestration:', pdfResp.status)
        throw new Error('Failed to fetch uploaded PDF for processing')
      }
      arrayBuffer = await pdfResp.arrayBuffer()
    } else {
      console.log('[v0] Using in-memory file buffer for orchestration')
      arrayBuffer = await file.arrayBuffer()
    }

    const orchestratorResult = await engineOrchestrator.processUploadedDocument(arrayBuffer, file.type, dbUserId)

    console.log("[v0] Orchestrator result:", { success: orchestratorResult.success })

    const analysis = orchestratorResult.document
      ? {
          document: orchestratorResult.document,
          extracted: orchestratorResult.extractedTenderData,
          validation: orchestratorResult.validation,
          fieldMappings: orchestratorResult.fieldMappings || null,
        }
      : {}
    const tenderSummary = (analysis as any).extracted || {}
    const extractedTitle = tenderSummary.title || file.name.replace(".pdf", "")
    const extractedDescription = [
      tenderSummary.description || "",
      tenderSummary.entity ? `Issued by: ${tenderSummary.entity}` : "",
      tenderSummary.tender_number ? `Tender #: ${tenderSummary.tender_number}` : "",
    ]
      .filter(Boolean)
      .join("\n\n")

    console.log("[v0] Creating tender with title:", extractedTitle)

    // Map internal status to DB-allowed values (table check constraint)
    // Allowed values per migrations: 'draft', 'in-progress', 'submitted'
    const status = orchestratorResult && orchestratorResult.success ? "submitted" : "in-progress"

    let usingSupabase = true
    let tender: any = null
    const { data: insertedTender, error: tenderError } = await supabase
      .from("user_custom_tenders")
      .insert({
        user_id: dbUserId,
        title: extractedTitle,
        description: extractedDescription,
        category: tenderSummary.category || "Custom Upload",
        status,
        organization: tenderSummary.entity || null,
        deadline: tenderSummary.closing_date || null,
        value: tenderSummary.estimated_value || null,
        location: tenderSummary.location || null,
        estimated_value: tenderSummary.estimated_value || null,
        close_date: tenderSummary.closing_date ? new Date(tenderSummary.closing_date) : null,
      })
      .select()
      .single()

    if (tenderError || !insertedTender) {
      console.error("[v0] Error creating tender (supabase):", tenderError)
      usingSupabase = false

      // Fallback: persist to local JSON store under ./data/tenders.json for dev/testing
      try {
        const dataDir = path.join(process.cwd(), "data")
        await fs.mkdir(dataDir, { recursive: true })
        const filePath = path.join(dataDir, "tenders.json")
        let store: any = { tenders: [], documents: [], analysis: [] }
        try {
          const raw = await fs.readFile(filePath, "utf8")
          store = JSON.parse(raw)
        } catch (e) {
          // ignore if file missing or invalid
        }

        const localId = randomUUID()
        const now = new Date().toISOString()
        const localTender = {
          id: localId,
          user_id: dbUserId,
          title: extractedTitle,
          description: extractedDescription,
          category: tenderSummary.category || "Custom Upload",
          status,
          organization: tenderSummary.entity || null,
          deadline: tenderSummary.closing_date || null,
          value: tenderSummary.estimated_value || null,
          location: tenderSummary.location || null,
          estimated_value: tenderSummary.estimated_value || null,
          close_date: tenderSummary.closing_date ? new Date(tenderSummary.closing_date).toISOString() : null,
          created_at: now,
          updated_at: now,
        }

        store.tenders = store.tenders || []
        store.tenders.push(localTender)
        await fs.writeFile(filePath, JSON.stringify(store, null, 2), "utf8")
        tender = localTender
        console.log("[v0] Created local fallback tender:", tender.id)
      } catch (fsErr) {
        console.error("[v0] Failed to write local tenders.json fallback:", fsErr)
        throw new Error("Failed to create tender record")
      }
    } else {
      tender = insertedTender
      console.log("[v0] Created tender:", tender.id)
    }

    // Store document (Supabase if available; otherwise persist to local JSON store)
    if (usingSupabase) {
      const { error: docError } = await supabase.from("user_custom_tender_documents").insert({
        tender_id: tender.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        blob_url: blob?.url ?? null,
        storage_path: blob?.pathname ?? null,
      })

      if (docError) {
        console.error("[v0] Error storing document:", docError)
      }
    } else {
      try {
        const filePath = path.join(process.cwd(), "data", "tenders.json")
        const raw = await fs.readFile(filePath, "utf8")
        const store = JSON.parse(raw)
        store.documents = store.documents || []
        store.documents.push({
          id: randomUUID(),
          tender_id: tender.id,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          blob_url: blob?.url ?? null,
          storage_path: blob?.pathname ?? null,
          created_at: new Date().toISOString(),
        })
        await fs.writeFile(filePath, JSON.stringify(store, null, 2), "utf8")
      } catch (storeDocErr) {
        console.error("[v0] Failed to persist document to local store:", storeDocErr)
      }
    }

    // Store analysis results if available
    if (analysis && Object.keys(analysis).length > 0) {
      if (usingSupabase) {
        try {
          const { error: analysisError } = await supabase.from("user_custom_tender_analysis").insert({
            tender_id: tender.id,
            analysis_data: analysis,
            engine: "orchestrator",
          })

          if (analysisError) {
            console.error("[v0] Error storing analysis:", analysisError)
          }
        } catch (storeErr) {
          console.error("[v0] Exception while storing analysis:", storeErr)
        }
      } else {
        try {
          const filePath = path.join(process.cwd(), "data", "tenders.json")
          const raw = await fs.readFile(filePath, "utf8")
          const store = JSON.parse(raw)
          store.analysis = store.analysis || []
          store.analysis.push({
            id: randomUUID(),
            tender_id: tender.id,
            analysis_data: analysis,
            engine: "orchestrator",
            analyzed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          })
          await fs.writeFile(filePath, JSON.stringify(store, null, 2), "utf8")
        } catch (storeErr) {
          console.error("[v0] Failed to persist analysis to local store:", storeErr)
        }
      }
    }

    // Persist per-field confidences to tender record if available (best-effort)
    try {
      const extracted = (analysis as any).extracted || orchestratorResult.extractedTenderData || null
      const fieldMappings = (analysis as any).fieldMappings || orchestratorResult.fieldMappings || null
      const confidences: Record<string, number> = {}

      if (extracted) {
        // If extracted is an object where fields may be { value, confidence }
        for (const [k, v] of Object.entries(extracted)) {
          if (v && typeof v === "object" && Object.prototype.hasOwnProperty.call(v, "confidence")) {
            confidences[k] = Number((v as any).confidence) || 0
          }
        }

        // If there's an explicit _confidences map
        if ((extracted as any)._confidences && typeof (extracted as any)._confidences === "object") {
          Object.assign(confidences, (extracted as any)._confidences)
        }
      }

      if (Object.keys(confidences).length > 0) {
        // Best-effort update; column may not exist
        const { error: confErr } = await supabase
          .from("user_custom_tenders")
          .update({ extraction_confidences: confidences })
          .eq("id", tender.id)

        if (confErr) {
          console.warn("[v0] Could not persist extraction confidences (column may be missing):", confErr.message)
        }
      }
    } catch (confStoreErr) {
      console.warn("[v0] Exception when persisting confidences:", confStoreErr)
    }

    // Persist field mapping positions to analysis row if available (best-effort)
    try {
      const fieldMappings = (analysis as any).fieldMappings || orchestratorResult.fieldMappings || null
      if (fieldMappings && Object.keys(fieldMappings).length > 0) {
        const { error: fdErr } = await supabase.from("user_custom_tender_analysis").update({
          analysis_data: { ...analysis, fieldMappings },
        }).match({ tender_id: tender.id, engine: "orchestrator" })

        if (fdErr) {
          console.warn("[v0] Could not persist field mappings to analysis record:", fdErr.message)
        }
      }
    } catch (fmErr) {
      console.warn("[v0] Exception when persisting field mappings:", fmErr)
    }

    // Trigger strategist enrichment asynchronously (best-effort)
    try {
      engineOrchestrator.enrichTenderWithStrategy(tender.id, "custom", dbUserId).then((res) => {
        console.log("[v0] Strategist enrichment result:", { success: res.success })
      })
    } catch (enrichErr) {
      console.error("[v0] Failed to trigger strategist enrichment:", enrichErr)
    }

    // Start full tender orchestration (will run TenderOrchestrator phases and background engines)
    let orchestrationInfo: any = null
    try {
      const orchRes = await engineOrchestrator.processUploadedDocument(arrayBuffer, file.type, dbUserId, {
        tenderId: tender.id,
        documentUrl: blob?.url ?? undefined,
      })
      orchestrationInfo = orchRes.orchestration ?? null
      console.log('[v0] Orchestration kickstarted:', orchestrationInfo?.orchestrationId ?? orchestrationInfo?.status ?? null)
    } catch (orchErr) {
      console.warn('[v0] Failed to kick off TenderOrchestrator:', orchErr)
    }

    console.log("[v0] Upload complete. Tender ID:", tender.id)

    return Response.json({
      success: true,
      tender: {
        id: tender.id,
        title: tender.title,
        description: tender.description,
      },
      analysis,
      orchestration: orchestrationInfo,
    })
  } catch (error: any) {
    console.error("[v0] Error uploading custom tender:", error)
    console.error("[v0] Error stack:", error.stack)
    return Response.json({ error: error.message || "Failed to upload tender" }, { status: 500 })
  }
}
