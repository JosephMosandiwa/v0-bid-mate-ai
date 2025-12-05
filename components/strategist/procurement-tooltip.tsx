"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Procurement terminology dictionary
const PROCUREMENT_TERMS: Record<string, { title: string; definition: string; example?: string }> = {
  rfq: {
    title: "Request for Quotation (RFQ)",
    definition:
      "A procurement method where the buyer requests price quotes from multiple suppliers for specific goods or services.",
    example: "An RFQ might be used to get pricing for office supplies or standard equipment.",
  },
  rfp: {
    title: "Request for Proposal (RFP)",
    definition:
      "A formal solicitation that outlines requirements and invites suppliers to submit detailed proposals including methodology and pricing.",
    example: "Complex IT projects often use RFPs to evaluate both technical capability and cost.",
  },
  rfb: {
    title: "Request for Bid (RFB)",
    definition:
      "Similar to RFQ but typically used for larger contracts where the evaluation is primarily based on price.",
    example: "Construction projects often use RFBs where specifications are clearly defined.",
  },
  bbbee: {
    title: "Broad-Based Black Economic Empowerment (B-BBEE)",
    definition:
      "A South African policy to advance economic transformation and enhance the participation of black people in the economy.",
    example: "Your B-BBEE level affects preferential points in government tenders (typically 10-20 points).",
  },
  cidb: {
    title: "Construction Industry Development Board (CIDB)",
    definition:
      "A South African regulatory body that grades and registers contractors for public sector construction work.",
    example: "To bid on a R10 million construction tender, you might need a CIDB grading of 5 or higher.",
  },
  csd: {
    title: "Central Supplier Database (CSD)",
    definition:
      "A South African government database where all suppliers must register to do business with government entities.",
    example: "Your CSD registration must be complete and verified before you can submit government tender bids.",
  },
  scm: {
    title: "Supply Chain Management (SCM)",
    definition:
      "The management of the flow of goods and services, including all processes that transform raw materials into final products.",
    example: "Government SCM policies ensure fair, transparent, and cost-effective procurement.",
  },
  boq: {
    title: "Bill of Quantities (BOQ)",
    definition: "A detailed list of materials, parts, and labor with their costs, used to price a project.",
    example: "The BOQ breaks down a construction project into itemized costs for each component.",
  },
  functionality: {
    title: "Functionality Evaluation",
    definition:
      "Assessment of a bidder's technical ability to deliver on the tender requirements before price evaluation.",
    example: "You must score at least 60% on functionality to have your price evaluated.",
  },
  "90/10": {
    title: "90/10 Preference Point System",
    definition: "For tenders above R50 million, 90 points are allocated for price and 10 for B-BBEE status.",
    example: "A Level 1 B-BBEE contributor gets all 10 preference points under this system.",
  },
  "80/20": {
    title: "80/20 Preference Point System",
    definition: "For tenders up to R50 million, 80 points are allocated for price and 20 for B-BBEE status.",
    example: "A Level 1 B-BBEE contributor gets all 20 preference points under this system.",
  },
  coida: {
    title: "COIDA Letter of Good Standing",
    definition:
      "Certificate from the Compensation Fund showing compliance with the Compensation for Occupational Injuries and Diseases Act.",
    example: "Without a valid COIDA letter, your tender may be disqualified.",
  },
  sbd: {
    title: "Standard Bidding Documents (SBD)",
    definition: "Standardized forms used in South African government procurement (SBD1-SBD9).",
    example: "SBD4 is the Declaration of Interest form that must be completed for all government tenders.",
  },
  mbd: {
    title: "Municipal Bidding Documents (MBD)",
    definition: "Standardized forms used specifically in South African municipal procurement.",
    example: "MBD forms are similar to SBD but specifically designed for municipal tenders.",
  },
  gcc: {
    title: "General Conditions of Contract (GCC)",
    definition: "Standard contract terms that apply to all government procurement contracts.",
    example: "The GCC outlines payment terms, dispute resolution, and general obligations.",
  },
  scc: {
    title: "Special Conditions of Contract (SCC)",
    definition: "Project-specific terms that supplement or modify the General Conditions of Contract.",
    example: "The SCC might specify unique delivery requirements or penalties for this particular tender.",
  },
  jv: {
    title: "Joint Venture (JV)",
    definition:
      "A business arrangement where two or more parties agree to pool resources for a specific project while remaining independent.",
    example: "Smaller companies often form JVs with larger ones to meet CIDB grading requirements.",
  },
  tor: {
    title: "Terms of Reference (TOR)",
    definition: "Document that defines the scope, objectives, and deliverables for a project or tender.",
    example: "The TOR outlines exactly what the client expects you to deliver and how success will be measured.",
  },
}

interface ProcurementTooltipProps {
  term: string
  children?: React.ReactNode
  className?: string
  showIcon?: boolean
}

export function ProcurementTooltip({ term, children, className, showIcon = true }: ProcurementTooltipProps) {
  const termData = PROCUREMENT_TERMS[term.toLowerCase()]

  if (!termData) {
    return <span className={className}>{children || term}</span>
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "cursor-help border-b border-dashed border-muted-foreground/50 inline-flex items-center gap-1",
              className,
            )}
          >
            {children || term}
            {showIcon && <HelpCircle className="h-3 w-3 text-muted-foreground" />}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm p-4">
          <div className="space-y-2">
            <p className="font-medium text-foreground">{termData.title}</p>
            <p className="text-sm text-muted-foreground">{termData.definition}</p>
            {termData.example && <p className="text-xs text-primary italic">Example: {termData.example}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Auto-highlight terms in text
export function HighlightProcurementTerms({ text, className }: { text: string; className?: string }) {
  // Return empty span if text is undefined, null, or not a string
  if (!text || typeof text !== "string") {
    return <span className={className}></span>
  }

  const termPatterns = Object.keys(PROCUREMENT_TERMS).join("|")
  const regex = new RegExp(`\\b(${termPatterns})\\b`, "gi")

  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        // Skip undefined/null parts
        if (part === undefined || part === null) {
          return null
        }
        const termKey = part.toLowerCase()
        if (termKey && PROCUREMENT_TERMS[termKey]) {
          return (
            <ProcurementTooltip key={i} term={termKey} showIcon={false}>
              {part}
            </ProcurementTooltip>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}
