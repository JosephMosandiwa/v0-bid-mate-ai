import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

async function readStore() {
  const filePath = path.join(process.cwd(), 'data', 'tenders.json')
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { history: {} }
  }
}

export async function GET(request: Request, context: any) {
  try {
    const { params } = context
    const id = params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Try Supabase first
    try {
      const supabase = await createServerClient()
      const { data, error } = await supabase
        .from('user_custom_tender_field_history')
        .select('id, tender_id, user_id, field_key, old_value, new_value, created_at')
        .eq('tender_id', id)
        .order('created_at', { ascending: true })

      if (!error && data) {
        return NextResponse.json({ success: true, history: data })
      }
    } catch (dbErr) {
      console.warn('[history] Supabase read failed, falling back to local store:', dbErr?.message || dbErr)
    }

    const store = await readStore()
    const history = (store.history && store.history[id]) || []
    return NextResponse.json({ success: true, history })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}
