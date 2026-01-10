"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save } from "lucide-react"

interface Props {
  tenderId?: string
  fieldKey: string
  label: string
  value: string | number | null
  confidence?: number | null
  onSaved?: (fieldKey: string, value: any) => void
}

export default function ExtractionFieldCard({ tenderId, fieldKey, label, value, confidence, onSaved }: Props) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value ?? "")
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!tenderId) {
      setEditing(false)
      onSaved?.(fieldKey, val)
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/custom-tenders/${tenderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldKey, value: val }),
      })

      if (!res.ok) throw new Error("Failed to save field")

      setEditing(false)
      onSaved?.(fieldKey, val)
      // Submit feedback record for this correction
      try {
        await fetch(`/api/custom-tenders/${tenderId}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fieldKey, oldValue: value, newValue: val }),
        })
      } catch (fbErr) {
        console.warn('[v0] Failed to submit feedback:', fbErr)
      }
    } catch (err) {
      console.error("[v0] Save field error:", err)
      // keep editing so user can retry
    } finally {
      setSaving(false)
    }
  }

  return (
    <div id={`field-${fieldKey}`} className="p-3 rounded-lg border bg-background">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">{label}</div>
          {!editing && <div className="text-sm font-medium">{value ?? "—"}</div>}
          {editing && (
            <Input value={val as any} onChange={(e) => setVal(e.target.value)} className="mt-2" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {typeof confidence === "number" && (
            <Badge variant={confidence > 0.75 ? "default" : "outline"}>
              {Math.round((confidence ?? 0) * 100)}%
            </Badge>
          )}

          {!editing ? (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={save} disabled={saving}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
