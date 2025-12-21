// ============================================
// ENGINE ORCHESTRATOR - CENTRAL INTEGRATION
// ============================================

import { processDocument } from "../documind"
import { TenderService, validateTender, normalizeTenderData } from "../tenders"
import { OpportunityService, CompetitivenessService, StrategistService } from "../strategist"
import type { ScrapedTender } from "../../scrapers/base-scraper"
import type { ParsedDocument } from "../documind/types"
import type { TenderData, ValidationResult } from "../tenders/types"

export interface EngineOrchestrator {
  processScrapedTender(tender: ScrapedTender): Promise<ProcessedTenderResult>
  processUploadedDocument(file: ArrayBuffer, mimeType: string, userId: string): Promise<ProcessedDocumentResult>
  enrichTenderWithStrategy(
    tenderId: string,
    tenderType: "custom" | "scraped",
    userId: string,
  ): Promise<StrategyEnrichmentResult>
}

export interface ProcessedTenderResult {
  success: boolean
  tender?: TenderData
  validation?: ValidationResult
  documents?: ParsedDocument[]
  opportunities?: any[]
  error?: string
}

export interface ProcessedDocumentResult {
  success: boolean
  document?: ParsedDocument
  extractedTenderData?: TenderData
  validation?: ValidationResult
  error?: string
}

export interface StrategyEnrichmentResult {
  success: boolean
  competitiveness?: any
  opportunities?: any[]
  recommendations?: string[]
  error?: string
}

/**
 * Orchestrates all engines to work together seamlessly
 */
export class EngineOrchestrator {
  private tenderService: TenderService
  private opportunityService: OpportunityService
  private competitivenessService: CompetitivenessService
  private strategistService: StrategistService

  constructor() {
    this.tenderService = new TenderService()
    this.opportunityService = new OpportunityService()
    this.competitivenessService = new CompetitivenessService()
    this.strategistService = new StrategistService()
  }

  /**
   * Process a scraped tender through all engines
   * Flow: Tenders Engine (validate/normalize) -> Documind (process docs) -> Strategist (analyze)
   */
  async processScrapedTender(tender: ScrapedTender, userId?: string): Promise<ProcessedTenderResult> {
    try {
      console.log("[v0] Orchestrator: Processing scraped tender:", tender.title)

      // Step 1: Tenders Engine - Validate and normalize
      console.log("[v0] Orchestrator: Step 1 - Validating tender data...")
      const validation = validateTender(tender)

      const DEBUG_MODE = true // Set to false to re-enable validation

      if (!DEBUG_MODE && validation.completeness < 0.15) {
        console.warn(`[v0] Orchestrator: Tender quality too low (${validation.completeness * 100}%)`)
        return {
          success: false,
          validation,
          error: `Tender quality too low: ${validation.grade} (${validation.completeness * 100}% complete)`,
        }
      }

      if (DEBUG_MODE && validation.completeness < 0.15) {
        console.log(
          `[v0] Orchestrator: DEBUG MODE - Accepting low-quality tender (${validation.completeness * 100}%) to diagnose issues`,
        )
      }

      const normalizedTender = normalizeTenderData(tender)
      console.log(
        `[v0] Orchestrator: Tender validated - Grade: ${validation.grade}, Completeness: ${validation.completeness * 100}%`,
      )

      // Step 2: Documind Engine - Process documents if available
      const processedDocuments: ParsedDocument[] = []
      if (tender.document_urls && tender.document_urls.length > 0) {
        console.log(`[v0] Orchestrator: Step 2 - Processing ${tender.document_urls.length} documents...`)

        for (const docUrl of tender.document_urls.slice(0, 3)) {
          // Limit to 3 docs for performance
          try {
            const url = typeof docUrl === "string" ? docUrl : docUrl.url
            const response = await fetch(url)
            const buffer = await response.arrayBuffer()

            const result = await processDocument(buffer, "application/pdf", {
              extract_images: false,
              ocr_enabled: true,
            })

            if (result.success && result.document) {
              processedDocuments.push(result.document)
              console.log(`[v0] Orchestrator: Document processed successfully: ${url}`)
            }
          } catch (docError) {
            console.error("[v0] Orchestrator: Document processing failed:", docError)
          }
        }
      }

      // Step 3: Strategist Engine - Create opportunities if user provided
      const opportunities: any[] = []
      if (userId) {
        console.log("[v0] Orchestrator: Step 3 - Analyzing opportunities for user...")

        try {
          const opportunity = await this.opportunityService.createOpportunity({
            userId,
            tenderId: tender.id || "",
            tenderType: "scraped",
            tenderTitle: normalizedTender.title,
            tenderData: normalizedTender,
          })

          if (opportunity) {
            opportunities.push(opportunity)
            console.log(`[v0] Orchestrator: Opportunity created with score: ${opportunity.match_score}`)
          }
        } catch (oppError) {
          console.error("[v0] Orchestrator: Opportunity creation failed:", oppError)
        }
      }

      return {
        success: true,
        tender: normalizedTender,
        validation,
        documents: processedDocuments,
        opportunities,
      }
    } catch (error) {
      console.error("[v0] Orchestrator: Error processing scraped tender:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Process an uploaded document through all engines
   * Flow: Documind (extract) -> Tenders Engine (validate/normalize) -> Strategist (analyze)
   */
  async processUploadedDocument(file: ArrayBuffer, mimeType: string, userId: string): Promise<ProcessedDocumentResult> {
    try {
      console.log("[v0] Orchestrator: Processing uploaded document")

      // Step 1: Documind Engine - Extract content and fields
      console.log("[v0] Orchestrator: Step 1 - Extracting document content...")
      const docResult = await processDocument(file, mimeType, {
        extract_images: false,
        ocr_enabled: true,
      })

      if (!docResult.success || !docResult.document) {
        return {
          success: false,
          error: docResult.error?.message || "Document processing failed",
        }
      }

      const document = docResult.document
      console.log(
        `[v0] Orchestrator: Document processed - ${document.pages.length} pages, ${document.form_fields?.length || 0} form fields`,
      )

      // Step 2: Tenders Engine - Extract tender data from document
      console.log("[v0] Orchestrator: Step 2 - Extracting tender data from document...")
      const extractedTender = await this.tenderService.extractTenderFromDocument(document)

      if (!extractedTender) {
        console.warn("[v0] Orchestrator: Could not extract tender data from document")
        return {
          success: true,
          document,
          error: "Could not identify tender fields in document",
        }
      }

      // Step 3: Tenders Engine - Validate extracted data
      console.log("[v0] Orchestrator: Step 3 - Validating extracted tender data...")
      const validation = validateTender(extractedTender)
      const normalizedTender = normalizeTenderData(extractedTender)

      console.log(
        `[v0] Orchestrator: Tender extracted - Grade: ${validation.grade}, Completeness: ${validation.completeness * 100}%`,
      )

      return {
        success: true,
        document,
        extractedTenderData: normalizedTender,
        validation,
      }
    } catch (error) {
      console.error("[v0] Orchestrator: Error processing uploaded document:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Enrich a tender with strategic analysis
   * Flow: Strategist Engine (competitiveness + recommendations)
   */
  async enrichTenderWithStrategy(
    tenderId: string,
    tenderType: "custom" | "scraped",
    userId: string,
  ): Promise<StrategyEnrichmentResult> {
    try {
      console.log(`[v0] Orchestrator: Enriching tender ${tenderId} with strategy for user ${userId}`)

      // Step 1: Calculate competitiveness score
      console.log("[v0] Orchestrator: Step 1 - Calculating competitiveness...")
      const competitiveness = await this.competitivenessService.calculateScore({
        userId,
        tenderId,
        tenderType,
      })

      // Step 2: Generate recommendations
      console.log("[v0] Orchestrator: Step 2 - Generating strategic recommendations...")
      const recommendations = await this.strategistService.generateRecommendations({
        userId,
        tenderId,
        tenderType,
        competitiveness,
      })

      // Step 3: Find related opportunities
      console.log("[v0] Orchestrator: Step 3 - Finding related opportunities...")
      const opportunities = await this.opportunityService.findSimilar({
        userId,
        tenderId,
        tenderType,
      })

      return {
        success: true,
        competitiveness,
        opportunities,
        recommendations,
      }
    } catch (error) {
      console.error("[v0] Orchestrator: Error enriching tender with strategy:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Export singleton instance
export const engineOrchestrator = new EngineOrchestrator()
