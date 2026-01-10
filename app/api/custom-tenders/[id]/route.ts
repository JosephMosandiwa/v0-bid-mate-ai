import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { engineOrchestrator } from '@/lib/engines/orchestrator'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

async function readStore() {
  const filePath = path.join(process.cwd(), 'data', 'tenders.json')
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { tenders: [], documents: [], analysis: [] }
  }
}

async function writeStore(store: any) {
  const filePath = path.join(process.cwd(), 'data', 'tenders.json')
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(store, null, 2), 'utf8')
}

export async function GET(request: Request, context: any) {
  try {
    const { params } = context
    const id = params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    try {
      const supabase = await createServerClient()
      const { data: tenderRows, error: tenderErr } = await supabase.from('user_custom_tenders').select('*').eq('id', id).limit(1)
      if (!tenderErr && tenderRows && tenderRows.length > 0) {
        const tender = tenderRows[0]
        // fetch analysis
        const { data: analysisRows } = await supabase.from('user_custom_tender_analysis').select('analysis_data').eq('tender_id', id).limit(1)
        const analysis = analysisRows && analysisRows.length > 0 ? analysisRows[0].analysis_data : null
        // fetch orchestration progress if exists
        const { data: orchRows } = await supabase.from('tender_orchestration_progress').select('*').eq('tender_id', id).limit(1)
        const orchestration = orchRows && orchRows.length > 0 ? orchRows[0] : null
        return NextResponse.json({ success: true, tender, analysis, orchestration })
      }
    } catch (dbErr) {
      console.warn('[custom-tender GET] Supabase read failed, falling back to local store:', dbErr?.message || dbErr)
    }

    const store = await readStore()
    const tender = (store.tenders || []).find((t: any) => String(t.id) === String(id))
    const analysis = (store.analysis || []).find((a: any) => String(a.tender_id) === String(id))
    const orchestration = null
    if (!tender) return NextResponse.json({ error: 'Tender not found' }, { status: 404 })
    return NextResponse.json({ success: true, tender, analysis: analysis?.analysis_data || null, orchestration })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: any) {
  try {
    const { params } = context
    const id = params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const body = await request.json().catch(() => ({}))
    const updates = body || {}

    try {
      const supabase = await createServerClient()
      // get current tender
      const { data: existingRows } = await supabase.from('user_custom_tenders').select('*').eq('id', id).limit(1)
      const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null

      // prepare history inserts for changed fields
      const userResp = await supabase.auth.getUser()
      const userId = userResp?.data?.user?.id || null
      const now = new Date().toISOString()
      const historyInserts: any[] = []
      for (const [k, v] of Object.entries(updates)) {
        const old = existing ? (existing as any)[k] : null
        if (String(old) !== String(v)) {
          historyInserts.push({ tender_id: id, user_id: userId, field_key: k, old_value: old, new_value: v, created_at: now })
        }
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from('user_custom_tenders').update(updates).eq('id', id)
      }

      if (historyInserts.length > 0) {
        await supabase.from('user_custom_tender_field_history').insert(historyInserts)
      }

      return NextResponse.json({ success: true })
    } catch (dbErr) {
      console.warn('[custom-tender PATCH] Supabase write failed, falling back to local store:', dbErr?.message || dbErr)
    }

    // Fallback local store
    const store = await readStore()
    store.tenders = store.tenders || []
    const idx = store.tenders.findIndex((t: any) => String(t.id) === String(id))
    if (idx === -1) return NextResponse.json({ error: 'Tender not found' }, { status: 404 })
    const now = new Date().toISOString()
    store.tenders[idx] = { ...store.tenders[idx], ...updates, updated_at: now }
    // write history
    store.history = store.history || {}
    store.history[id] = store.history[id] || []
    for (const [k, v] of Object.entries(updates)) {
      store.history[id].push({ id: 'h_' + Math.random().toString(36).slice(2, 9), field_key: k, old_value: null, new_value: v, created_at: now })
    }
    await writeStore(store)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: tender, error: tenderError } = await supabase
      .from("user_custom_tenders")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (tenderError || !tender) {
      console.error("[v0] Tender not found:", tenderError)
      return Response.json({ error: "Tender not found" }, { status: 404 })
    }

    const { data: documents } = await supabase
      .from("user_custom_tender_documents")
      .select("*")
      .eq("tender_id", id)
      .order("created_at", { ascending: false })

    const { data: analysisData } = await supabase
      .from("user_custom_tender_analysis")
      .select("*")
      .eq("tender_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return Response.json({
      tender,
      documents: documents || [],
      analysis: analysisData?.analysis_data || null,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching custom tender:", error)
    return Response.json({ error: "Failed to fetch tender" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Support two payload styles:
    // 1) Full object update: { title, organization, close_date, value, description }
    // 2) Field-level edit: { fieldKey: "title", value: "New Title" }

    let updatePayload: any = {}
    let historyEntry: any = null

    if (body && typeof body.fieldKey === "string") {
      const { fieldKey, value } = body
      // Map simple field keys to column names if necessary
      const columnMap: Record<string, string> = {
        title: "title",
        entity: "organization",
        organization: "organization",
        close_date: "close_date",
        closing_date: "close_date",
        value: "value",
        description: "description",
        tender_number: "tender_number",
      }

      const column = columnMap[fieldKey] || fieldKey
      updatePayload[column] = value

      historyEntry = {
        tender_id: id,
        user_id: user.id,
        field_key: fieldKey,
        new_value: value,
        created_at: new Date().toISOString(),
      }
    } else {
      const { title, organization, close_date, value, description } = body
      updatePayload = { title, organization, close_date, value, description }
    }

    updatePayload.updated_at = new Date().toISOString()

    const { data: tender, error: updateError } = await supabase
      .from("user_custom_tenders")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Error updating tender:", updateError)
      return Response.json({ error: "Failed to update tender" }, { status: 500 })
    }

    // Attempt to store field history (best-effort). Table `user_custom_tender_field_history` may not exist in all environments.
    if (historyEntry) {
      try {
        const { error: historyError } = await supabase.from("user_custom_tender_field_history").insert(historyEntry)
        if (historyError) {
          console.warn("[v0] Could not write field history, table may not exist:", historyError.message)
        }
      } catch (histErr) {
        console.warn("[v0] Exception when writing field history:", histErr)
      }
    }

    return Response.json({ success: true, tender })
  } catch (error: any) {
    console.error("[v0] Error updating custom tender:", error)
    return Response.json({ error: "Failed to update tender" }, { status: 500 })
  }
}
