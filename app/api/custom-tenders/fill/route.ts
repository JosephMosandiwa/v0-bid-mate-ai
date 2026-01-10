import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
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
    const tenderId = body.tenderId || body.tender_id
    const fields: Record<string, any> = body.fields || {}

    if (!tenderId) return Response.json({ error: 'Missing tenderId' }, { status: 400 })

    // Fetch the stored document for this tender
    const { data: docRow, error: docErr } = await supabase
      .from('user_custom_tender_documents')
      .select('*')
      .eq('tender_id', tenderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (docErr || !docRow) {
      return Response.json({ error: 'Document not found for tender' }, { status: 404 })
    }

    const blobUrl: string = docRow.blob_url
    const pdfResp = await fetch(blobUrl)
    if (!pdfResp.ok) return Response.json({ error: 'Failed to fetch PDF' }, { status: 502 })

    const arrayBuffer = await pdfResp.arrayBuffer()
    const pdfBytes = new Uint8Array(arrayBuffer)

    const { data: analysisRow } = await supabase
      .from('user_custom_tender_analysis')
      .select('analysis_data')
      .eq('tender_id', tenderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const analysis = (analysisRow as any)?.analysis_data || {}
    const fieldMappings: Record<string, any> = analysis.fieldMappings || {}

    const { PDFDocument, rgb } = await import('pdf-lib')

    const pdfDoc = await PDFDocument.load(pdfBytes, { updateMetadata: false })

    // First, try to fill AcroForm fields if present
    try {
      const form = pdfDoc.getForm()
      const fieldsInForm = form.getFields()
      const nameIndex = new Map<string, any>()
      for (const f of fieldsInForm) {
        try {
          const n = (f as any).getName()
          if (n) nameIndex.set(String(n).toLowerCase(), f)
        } catch {}
      }

      // Attempt to fill matching form fields
      for (const [fieldKey, value] of Object.entries(fields)) {
        const mapping = fieldMappings[fieldKey]
        // Try to locate by native name/label then by schema fieldKey
        const candidates = [mapping?.label, mapping?.field, fieldKey].filter(Boolean).map((s: any) => String(s).toLowerCase())
        let found: any = null
        for (const c of candidates) {
          if (nameIndex.has(c)) {
            found = nameIndex.get(c)
            break
          }
        }

        if (found) {
          try {
            // Text fields
            if ((found as any).setText) {
              ;(found as any).setText(String(value ?? ''))
              continue
            }

            // Checkboxes
            if ((found as any).check && (found as any).uncheck) {
              if (value) (found as any).check()
              else (found as any).uncheck()
              continue
            }

            // Radio/select
            if ((found as any).select) {
              (found as any).select(String(value))
              continue
            }
          } catch (fErr) {
            console.warn('Failed to fill form field', fErr)
          }
        }
      }
    } catch (formErr) {
      // No form present or filling failed — we'll fallback to overlay
      console.warn('PDF form filling not available or failed:', formErr)
    }

    // Overlay text for any remaining fields using fieldMappings positions
    const pages = pdfDoc.getPages()
    for (const [fieldKey, value] of Object.entries(fields)) {
      // skip if already written into form (we can't easily detect this), but we still overlay in case
      const mapping = fieldMappings[fieldKey]
      if (!mapping || !mapping.position_normalized) continue

      const norm = mapping.position_normalized
      const pageIndex = Math.max(0, (mapping.page || 1) - 1)
      const page = pages[pageIndex]
      if (!page) continue

      const { width: pw, height: ph } = page.getSize()
      const x = (norm.x || 0) * pw
      const h = (norm.height || 0.03) * ph
      // PDF coordinate origin is bottom-left; normalized y is top-to-bottom
      const y = ph - ((norm.y || 0) * ph) - h

      const text = String(value ?? '')
      page.drawText(text, {
        x,
        y,
        size: Math.min(14, Math.max(8, Math.floor(h * 0.8))),
        color: rgb(0, 0, 0),
      })
    }

    const outBytes = await pdfDoc.save()

    return new Response(outBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="filled-${tenderId}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('[v0] PDF fill error:', error)
    return Response.json({ error: error?.message || 'Failed to fill PDF' }, { status: 500 })
  }
}
