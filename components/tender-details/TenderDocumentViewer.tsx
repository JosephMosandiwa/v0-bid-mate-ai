"use client"

import React from "react"

interface Doc {
  id?: string
  file_name?: string
  blob_url?: string
  file_type?: string
}

interface Highlight {
  fieldKey: string
  label?: string
  page?: number | null
  snippet?: string
}

interface Props {
  documents: Doc[]
  highlights?: Highlight[]
  onHighlightClick?: (fieldKey: string) => void
}

export default function TenderDocumentViewer({ documents, highlights = [], onHighlightClick }: Props) {
  if (!documents || documents.length === 0) {
    return <div className="p-4 rounded-lg border text-sm text-muted-foreground">No documents yet</div>
  }

  const primary = documents[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="text-sm font-medium mb-2">Document Preview</div>
          {primary.blob_url ? (
            <PdfJsViewer
              url={primary.blob_url}
              highlights={
                highlights.map((h) => ({
                  fieldKey: h.fieldKey,
                  page: h.page || 1,
                  bbox: h.bbox,
                  label: h.label,
                }))
              }
              maxPages={10}
            />
          ) : (
            <div className="p-4 rounded-lg border text-sm text-muted-foreground">Document preview not available</div>
          )}
      </div>

      <div className="lg:col-span-1 space-y-2">
        <div className="text-sm font-medium">Highlights</div>
        {highlights.length === 0 && <div className="text-sm text-muted-foreground">No highlights available</div>}
        <div className="space-y-2">
          {highlights.map((h) => (
            <button
              key={h.fieldKey}
              onClick={() => onHighlightClick?.(h.fieldKey)}
              className="w-full text-left p-2 rounded hover:bg-muted/50 border"
            >
              <div className="text-sm font-medium">{h.label || h.fieldKey}</div>
              {h.snippet && <div className="text-xs text-muted-foreground truncate">{h.snippet}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
