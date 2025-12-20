export * from "./types"
export * from "./schema"
export * from "./validator"
export * from "./services/tender-service"

// Import TenderService to use it in the exported functions
import { TenderService } from "./services/tender-service"

export { TenderValidator } from "./validator"

// Export commonly used functions as standalone exports
export function validateTender(tenderData: any) {
  return TenderService.validateTender(tenderData)
}

export function normalizeTenderData(tenderData: any) {
  return TenderService.normalizeScrapedData(tenderData)
}
