/**
 * Format a number as South African Rand (ZAR) currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string (e.g., "R 1,234,567.00")
 */
export function formatZAR(
  amount: number | string,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    showSymbol?: boolean
  },
): string {
  const numAmount = typeof amount === "string" ? Number.parseFloat(amount.replace(/[^0-9.-]/g, "")) : amount

  if (isNaN(numAmount)) {
    return "R 0"
  }

  const formatted = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(numAmount)

  // Intl.NumberFormat returns "ZAR 1,234" or "R1,234" depending on locale
  // We want consistent "R 1,234" format
  return formatted.replace(/ZAR\s?/, "R ").replace(/R(\d)/, "R $1")
}

/**
 * Parse a ZAR currency string to a number
 * @param value - Currency string (e.g., "R 1,234.56" or "1234.56")
 * @returns Parsed number
 */
export function parseZAR(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, "")
  return Number.parseFloat(cleaned) || 0
}
