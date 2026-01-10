import analysisSchema, { compactSchemaDescription } from "@/lib/analysis/schema"
import { z } from "zod"

// Extract the first balanced JSON object from a text blob.
export function extractJsonFromText(text: string): string | null {
  if (!text) return null
  const start = text.indexOf("{")
  if (start === -1) return null
  let depth = 0
  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (ch === "{") depth++
    else if (ch === "}") depth--
    if (depth === 0) {
      const candidate = text.substring(start, i + 1)
      return candidate
    }
  }
  return null
}

export function stripCodeFences(text: string): string {
  let s = text.trim()
  if (s.startsWith("```json")) s = s.replace(/^```json\s*/i, "")
  if (s.startsWith("```")) s = s.replace(/^```\s*/i, "")
  if (s.endsWith("```")) s = s.replace(/```\s*$/i, "")
  return s.trim()
}

export function validateJsonAgainstSchema(obj: any) {
  const res = analysisSchema.safeParse(obj)
  if (res.success) return { valid: true, parsed: res.data }
  const errors = res.error.errors.map((e) => ({ path: e.path, message: e.message }))
  return { valid: false, errors }
}

export function compactSchemaForPrompt(): string {
  return compactSchemaDescription
}

export default {
  extractJsonFromText,
  stripCodeFences,
  validateJsonAgainstSchema,
  compactSchemaForPrompt,
}
