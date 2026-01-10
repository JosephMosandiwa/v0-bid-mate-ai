import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { fieldKey, oldValue, newValue, note } = await request.json()

    if (!fieldKey || typeof newValue === 'undefined') {
      return new Response(JSON.stringify({ error: 'fieldKey and newValue are required' }), { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 })

    const feedback = {
      tender_id: params.id,
      user_id: user.id,
      field_key: fieldKey,
      old_value: typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue || null),
      new_value: typeof newValue === 'string' ? newValue : JSON.stringify(newValue),
      note: note || null,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from('analysis_feedback').insert(feedback).select().single()

    if (error) {
      console.error('[v0] Error saving analysis feedback:', error)
      return new Response(JSON.stringify({ error: 'Failed to save feedback' }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 })
  } catch (err: any) {
    console.error('[v0] Feedback API error:', err)
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), { status: 500 })
  }
}
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (c) => c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    })

    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const tenderId = params.id
    const edits: Array<{ field: string; oldValue: any; newValue: any }> = body.edits || []

    if (!tenderId) return Response.json({ error: 'Missing tender id' }, { status: 400 })
    if (!Array.isArray(edits) || edits.length === 0) return Response.json({ error: 'No edits provided' }, { status: 400 })

    // Insert edit history rows
    const rows = edits.map((e) => ({
      tender_id: tenderId,
      user_id: user.id,
      field_key: e.field,
      old_value: e.oldValue,
      new_value: e.newValue,
      created_at: new Date().toISOString(),
    }))

    const { error } = await supabase.from('user_custom_tender_field_history').insert(rows)
    if (error) {
      console.error('Failed to store field history', error)
      return Response.json({ error: 'Failed to store field history' }, { status: 500 })
    }

    // Optionally, flag this tender for template retraining (simple marker in analysis)
    try {
      await supabase.from('user_custom_tender_analysis').update({ processing_hint: 'retrain' }).match({ tender_id: tenderId })
    } catch (hintErr) {
      console.warn('Could not flag analysis for retrain', hintErr)
    }

    return Response.json({ success: true, inserted: rows.length })
  } catch (err: any) {
    console.error('feedback route error', err)
    return Response.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
