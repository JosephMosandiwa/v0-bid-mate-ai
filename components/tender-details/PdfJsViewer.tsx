"use client"

import React, { useEffect, useRef, useState } from "react"

interface Highlight {
  fieldKey: string
  page: number
  // bbox normalized to page (0..1)
  bbox?: { x: number; y: number; width: number; height: number }
  // optional text snippet to locate on the page when bbox is missing
  text?: string
  label?: string
}

interface Props {
  url: string
  highlights?: Highlight[]
  maxPages?: number
}

export default function PdfJsViewer({ url, highlights = [], maxPages = 10 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pages, setPages] = useState<number>(0)
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    let mounted = true

    async function loadPdf() {
      try {
        const pdfjs = await import("pdfjs-dist/build/pdf")
        // Use CDN worker when pdfjs-dist worker not available
        // You can change to your local worker path if hosting it.
        try {
          (pdfjs.GlobalWorkerOptions as any).workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.10.104/pdf.worker.min.js`
        } catch {}

        const loadingTask = (pdfjs as any).getDocument(url)
        const pdf = await loadingTask.promise
        if (!mounted) return

        const renderCount = Math.min(pdf.numPages, maxPages)
        setPages(renderCount)

        for (let i = 1; i <= renderCount; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 1.5 })

          const pageContainer = pageRefs.current[i]
          if (!pageContainer) continue

          // create canvas
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")!
          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)
          canvas.style.width = "100%"
          canvas.style.height = "auto"
          pageContainer.innerHTML = ""
          pageContainer.appendChild(canvas)

          const renderContext = {
            canvasContext: context,
            viewport,
          }

          await page.render(renderContext).promise

          // create overlay for highlights
          const overlay = document.createElement("div")
          overlay.style.position = "absolute"
          overlay.style.left = "0"
          overlay.style.top = "0"
          overlay.style.width = "100%"
          overlay.style.height = "100%"
          overlay.style.pointerEvents = "none"
          pageContainer.appendChild(overlay)

          const pageHighlights = highlights.filter((h) => h.page === i && h.bbox)
          for (const h of pageHighlights) {
            const el = document.createElement("div")
            el.style.position = "absolute"
            el.style.border = "2px solid rgba(250,180,0,0.9)"
            el.style.background = "rgba(250,180,0,0.12)"
            el.style.pointerEvents = "auto"
            el.style.cursor = "pointer"

            const { x, y, width, height } = h.bbox!
            // bbox are normalized; compute pixel coords relative to canvas
            el.style.left = `${x * 100}%`
            el.style.top = `${y * 100}%`
            el.style.width = `${width * 100}%`
            el.style.height = `${height * 100}%`

            el.title = h.label || h.fieldKey
            overlay.appendChild(el)
          }

          // If orchestrator didn't supply bbox, try to compute bbox using pdf textContent and a text snippet
          const missingBboxHighlights = highlights.filter((h) => h.page === i && !h.bbox && h.text)
          if (missingBboxHighlights.length > 0) {
            try {
              const textContent = await page.getTextContent({ normalizeWhitespace: true })
              // Build a flat string and map char ranges to items
              const items = (textContent.items || []) as any[]
              let cumulative = ""
              const map: { start: number; end: number; item: any }[] = []
              for (const it of items) {
                const s = String(it.str || "")
                const start = cumulative.length
                cumulative += s
                const end = cumulative.length
                map.push({ start, end, item: it })
              }

              for (const h of missingBboxHighlights) {
                const snippet = (h.text || "").trim()
                const idx = snippet ? cumulative.indexOf(snippet) : -1
                if (idx === -1) continue

                // find items that cover the match range
                const matchStart = idx
                const matchEnd = idx + snippet.length
                const matchedItems = map.filter((m) => !(m.end <= matchStart || m.start >= matchEnd))
                if (matchedItems.length === 0) continue

                // compute bounding box union of matched items in viewport coordinates
                const itemRects = matchedItems.map((m) => {
                  const it = m.item
                  const tf = it.transform || [1, 0, 0, 1, 0, 0]
                  const x = tf[4]
                  const y = tf[5]
                  const fontHeight = Math.abs(tf[3] || tf[0] || 10)
                  const width = (it.width || (it.str ? it.str.length * 6 : 10))
                  const rect = {
                    x: x,
                    y: y - fontHeight,
                    width: width,
                    height: fontHeight,
                  }
                  return rect
                })

                const minX = Math.min(...itemRects.map((r) => r.x))
                const minY = Math.min(...itemRects.map((r) => r.y))
                const maxX = Math.max(...itemRects.map((r) => r.x + r.width))
                const maxY = Math.max(...itemRects.map((r) => r.y + r.height))

                // convert to normalized coords relative to viewport
                const normX = minX / viewport.width
                const normY = 1 - (maxY / viewport.height)
                const normW = (maxX - minX) / viewport.width
                const normH = (maxY - minY) / viewport.height

                const el = document.createElement("div")
                el.style.position = "absolute"
                el.style.border = "2px solid rgba(100,160,255,0.9)"
                el.style.background = "rgba(100,160,255,0.12)"
                el.style.pointerEvents = "auto"
                el.style.cursor = "pointer"
                el.style.left = `${Math.max(0, normX) * 100}%`
                el.style.top = `${Math.max(0, normY) * 100}%`
                el.style.width = `${Math.min(1, normW) * 100}%`
                el.style.height = `${Math.min(1, normH) * 100}%`
                el.title = h.label || h.fieldKey
                overlay.appendChild(el)
              }
            } catch (err) {
              // best-effort: don't fail rendering if mapping fails
              console.warn("PdfJsViewer: text-layer bbox mapping failed", err)
            }
          }
        }
      } catch (err) {
        console.error("[v0] PdfJsViewer error:", err)
      }
    }

    loadPdf()

    return () => {
      mounted = false
    }
  }, [url, highlights, maxPages])

  return (
    <div ref={containerRef} className="space-y-4">
      {Array.from({ length: pages }).map((_, idx) => {
        const pageNum = idx + 1
        return (
          <div key={pageNum} className="relative w-full" style={{ minHeight: 200 }}>
            <div ref={(el) => (pageRefs.current[pageNum] = el)} className="w-full relative" />
          </div>
        )
      })}
    </div>
  )
}
