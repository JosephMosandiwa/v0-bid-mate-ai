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

export async function POST(request: Request, context: any) {
  try {
    const { params } = context
    const id = params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // find document blob for tender
    let pdfBytes: ArrayBuffer | null = null

    try {
      const supabase = await createServerClient()
      const { data: docs, error: docErr } = await supabase.from('user_custom_tender_documents').select('blob_url').eq('tender_id', id).limit(1)
      if (!docErr && docs && docs.length > 0 && docs[0].blob_url) {
        const resp = await fetch(docs[0].blob_url)
        if (resp.ok) pdfBytes = await resp.arrayBuffer()
      }
    } catch (dbErr) {
      console.warn('[reprocess] Supabase fetch failed, falling back to local store:', dbErr?.message || dbErr)
    }

    if (!pdfBytes) {
      const store = await readStore()
      const doc = (store.documents || []).find((d: any) => String(d.tender_id) === String(id))
      if (doc && doc.blob_url) {
        const resp = await fetch(doc.blob_url)
        if (resp.ok) pdfBytes = await resp.arrayBuffer()
      }
    }

    if (!pdfBytes) return NextResponse.json({ error: 'Document not found for tender' }, { status: 404 })

    // run orchestrator and link to tender id
    const userId = null // server-run reprocess; orchestrator accepts userId but here we run as system
    const result = await engineOrchestrator.processUploadedDocument(pdfBytes as ArrayBuffer, 'application/pdf', userId as any)

    // If orchestrator returns orchestration info, return it
    return NextResponse.json({ success: true, result })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}
