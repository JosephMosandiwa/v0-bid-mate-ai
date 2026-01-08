import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findBestMatch(
  pdfFieldName: string,
  responses: Record<string, any>,
  formFields: any[],
): { key: string; value: any; score: number } | null {
  const normalizedFieldName = pdfFieldName.toLowerCase().replace(/[_\-\s]+/g, "")
  let bestMatch: { key: string; value: any; score: number } | null = null

  // First, try to match against our analyzed formFields to find the corresponding response
  for (const formField of formFields) {
    const fieldId = formField.id
    const fieldLabel = formField.label || ""
    const pdfFieldId = formField.pdfFieldName || ""

    const normalizedId = fieldId.toLowerCase().replace(/[_\-\s]+/g, "")
    const normalizedLabel = fieldLabel.toLowerCase().replace(/[_\-\s]+/g, "")
    const normalizedPdfField = pdfFieldId.toLowerCase().replace(/[_\-\s]+/g, "")

    let score = 0

    // Exact match on PDF field name
    if (normalizedPdfField && normalizedFieldName === normalizedPdfField) {
      score = 100
    }
    // Exact match on field ID
    else if (normalizedFieldName === normalizedId) {
      score = 95
    }
    // Exact match on label
    else if (normalizedFieldName === normalizedLabel) {
      score = 90
    }
    // Contains match
    else if (
      normalizedFieldName.includes(normalizedId) ||
      normalizedId.includes(normalizedFieldName) ||
      normalizedFieldName.includes(normalizedLabel) ||
      normalizedLabel.includes(normalizedFieldName)
    ) {
      score = 70
    }
    // Word overlap
    else {
      const fieldWords = normalizedFieldName.split(/(?=[A-Z])/).map((w: string) => w.toLowerCase())
      const idWords = normalizedId.split(/(?=[A-Z])/).map((w: string) => w.toLowerCase())
      const labelWords = normalizedLabel.split(/[^a-z]/).filter(Boolean)

      const allTargetWords = [...idWords, ...labelWords]
      const overlap = fieldWords.filter((w) => allTargetWords.some((tw) => tw.includes(w) || w.includes(tw))).length

      score = overlap * 15
    }

    if (score > 0 && responses[fieldId] !== undefined) {
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { key: fieldId, value: responses[fieldId], score }
      }
    }
  }

  // If no match found via formFields, try direct response matching
  if (!bestMatch) {
    for (const [key, value] of Object.entries(responses)) {
      const normalizedKey = key.toLowerCase().replace(/[_\-\s]+/g, "")
      let score = 0

      if (normalizedFieldName === normalizedKey) {
        score = 100
      } else if (normalizedFieldName.includes(normalizedKey) || normalizedKey.includes(normalizedFieldName)) {
        score = 80
      } else {
        const fieldWords = normalizedFieldName.split(/(?=[A-Z])/).map((w: string) => w.toLowerCase())
        const keyWords = normalizedKey.split(/(?=[A-Z])/).map((w: string) => w.toLowerCase())
        const overlap = fieldWords.filter((w) => keyWords.some((kw) => kw.includes(w) || w.includes(kw))).length
        score = overlap * 20
      }

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { key, value, score }
      }
    }
  }

  return bestMatch && bestMatch.score >= 40 ? bestMatch : null
}
