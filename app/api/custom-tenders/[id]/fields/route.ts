import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

async function readStore() {
  const filePath = path.join(process.cwd(), 'data', 'tenders.json')
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { tenders: [], documents: [], analysis: [], fields: {}, history: {} }
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

    // Try Supabase server-side first
    try {
      const supabase = await createServerClient()
      // Attempt to read from user_custom_tender_analysis for orchestrator results
      const { data: analysisRows, error: aerr } = await supabase
        .from('user_custom_tender_analysis')
        .select('analysis_data')
        .eq('tender_id', id)
        .limit(1)

      if (!aerr && analysisRows && analysisRows.length > 0) {
        const analysis = analysisRows[0].analysis_data || {}
        const extracted = analysis.extracted || {}
        // Try to read per-field extraction confidences from the tender record
        try {
          const { data: tenderRows } = await supabase.from('user_custom_tenders').select('extraction_confidences').eq('id', id).limit(1)
          const confidences = (tenderRows && tenderRows.length > 0 && tenderRows[0].extraction_confidences) || {}
          return NextResponse.json({ success: true, fields: extracted, confidences })
        } catch (confErr) {
          return NextResponse.json({ success: true, fields: extracted })
        }
      }
    } catch (dbErr) {
      // ignore and fallback to local store
      console.warn('[fields] Supabase read failed, falling back to local store:', dbErr?.message || dbErr)
    }

    const store = await readStore()
    const fields = (store.fields && store.fields[id]) || {}
    const confidences = (store.extraction_confidences && store.extraction_confidences[id]) || (store.confidences && store.confidences[id]) || {}
    return NextResponse.json({ success: true, fields, confidences })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: any) {
  try {
    const { params } = context
    const id = params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const body = await request.json()
    const updates = body || {}

    // Try to write history and updates to Supabase if available
    try {
      const supabase = await createServerClient()

      // Load existing analysis/extracted values so we can record old_value in history
      const { data: analysisRows } = await supabase
        .from('user_custom_tender_analysis')
        .select('id,analysis_data')
        .eq('tender_id', id)
        .limit(1)

      const existingExtracted = (analysisRows && analysisRows.length > 0 && analysisRows[0].analysis_data?.extracted) || {}

      // Insert history rows for each field changed (populate old_value when available)
      const now = new Date().toISOString()
      const userResp = await supabase.auth.getUser()
      const userId = userResp?.data?.user?.id || null

      const historyInserts = Object.entries(updates).map(([key, newVal]) => ({
        tender_id: id,
        user_id: userId,
        field_key: key,
        old_value: existingExtracted && key in existingExtracted ? (typeof existingExtracted[key] === 'string' ? existingExtracted[key] : JSON.stringify(existingExtracted[key])) : null,
        new_value: typeof newVal === 'string' ? newVal : JSON.stringify(newVal),
        created_at: now,
      }))

      if (historyInserts.length > 0) {
        const { error: insertErr } = await supabase.from('user_custom_tender_field_history').insert(historyInserts)
        if (insertErr) {
          console.warn('[fields] failed to insert history rows (RLS or other):', insertErr.message || insertErr)
          // Try service-role admin client when available to bypass RLS for server-side workflows
          try {
            const admin = createAdminClient()
            const { error: adminErr } = await admin.from('user_custom_tender_field_history').insert(historyInserts)
            if (adminErr) {
              console.warn('[fields] admin insert also failed:', adminErr.message || adminErr)
            }
          } catch (adminEx) {
            console.warn('[fields] no admin client available or admin insert failed:', adminEx?.message || adminEx)
          }
        }
      }

      // Best-effort: update analysis row if exists
      if (analysisRows && analysisRows.length > 0) {
        const row = analysisRows[0]
        const analysisData = row.analysis_data || {}
        analysisData.extracted = { ...(analysisData.extracted || {}), ...updates }
        await supabase.from('user_custom_tender_analysis').update({ analysis_data: analysisData }).eq('id', row.id)
      }

      return NextResponse.json({ success: true, fields: updates })
    } catch (dbErr) {
      console.warn('[fields] Supabase write failed, falling back to local store:', dbErr?.message || dbErr)
    }

    // Fallback to local store: preserve old values where possible
    const store = await readStore()
    store.fields = store.fields || {}
    store.fields[id] = { ...(store.fields[id] || {}), ...updates }
    store.history = store.history || {}
    const now = new Date().toISOString()
    store.history[id] = store.history[id] || []
    for (const [k, v] of Object.entries(updates)) {
      const oldVal = store.fields[id] && k in (store.fields[id] || {}) ? (store.fields[id][k] ?? null) : null
      store.history[id].push({ id: 'h_' + Math.random().toString(36).slice(2, 9), field_key: k, old_value: oldVal, new_value: v, created_at: now })
    }
    await writeStore(store)

    return NextResponse.json({ success: true, fields: store.fields[id] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}
