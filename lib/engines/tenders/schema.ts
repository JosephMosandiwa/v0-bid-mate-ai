import type { TenderField, TenderSchema } from "./types"

// Central tender schema - this is what scrapers should aim to extract
export const TENDER_SCHEMA: TenderSchema = {
  version: "1.0.0",
  requiredFields: ["title", "organization"],
  optionalFields: [
    "tender_reference",
    "close_date",
    "description",
    "category",
    "location",
    "estimated_value",
    "publish_date",
    "opening_date",
    "contact_person",
    "contact_email",
    "contact_phone",
    "submission_method",
    "requirements",
    "eligibility_criteria",
    "payment_terms",
    "contract_duration",
    "compulsory_briefing",
    "tender_type",
    "procurement_category",
  ],
  documentTypes: [
    "Tender Document",
    "Terms of Reference",
    "Specifications",
    "Pricing Schedule",
    "SBD Forms",
    "Declaration Forms",
    "Technical Requirements",
    "Contract Terms",
  ],
  fields: [
    {
      name: "tender_reference",
      displayName: "Tender Reference Number",
      type: "string",
      required: false,
      description: "Unique identifier for the tender",
      extractionHints: {
        aliases: ["tender number", "reference", "tender no", "ref no", "reference number", "tender id"],
        patterns: ["\\b[A-Z]{2,}[\\/-]?\\d{2,}[\\/-]?\\d{2,}\\b", "\\bT\\d{4,}\\b", "\\b\\d{2,}\\/\\d{4}\\b"],
        context: ["reference", "tender", "number", "quotation"],
        priority: 10,
      },
    },
    {
      name: "title",
      displayName: "Tender Title",
      type: "string",
      required: true,
      description: "The main title or subject of the tender",
      extractionHints: {
        aliases: ["tender title", "subject", "project name", "tender for"],
        patterns: [],
        context: ["tender", "project", "supply", "services", "appointment"],
        priority: 10,
      },
    },
    {
      name: "organization",
      displayName: "Issuing Organization",
      type: "string",
      required: true,
      description: "The organization issuing the tender",
      extractionHints: {
        aliases: ["organization", "department", "municipality", "entity", "client", "issuer"],
        patterns: [],
        context: ["municipality", "department", "ministry", "council"],
        priority: 9,
      },
    },
    {
      name: "description",
      displayName: "Description",
      type: "string",
      required: false,
      description: "Detailed description of what is being procured",
      extractionHints: {
        aliases: ["description", "scope", "scope of work", "requirements", "details"],
        patterns: [],
        context: ["scope", "required", "must", "shall", "includes"],
        priority: 8,
      },
    },
    {
      name: "category",
      displayName: "Category",
      type: "string",
      required: false,
      description: "The procurement category or sector",
      extractionHints: {
        aliases: ["category", "sector", "type", "classification"],
        patterns: [],
        context: ["construction", "it", "services", "goods", "works"],
        priority: 7,
      },
    },
    {
      name: "location",
      displayName: "Location",
      type: "string",
      required: false,
      description: "Physical location or province",
      extractionHints: {
        aliases: ["location", "province", "region", "area", "place"],
        patterns: [
          "Gauteng|Western Cape|Eastern Cape|KwaZulu-Natal|Free State|Limpopo|Mpumalanga|Northern Cape|North West",
        ],
        context: ["province", "located", "region"],
        priority: 6,
      },
    },
    {
      name: "estimated_value",
      displayName: "Estimated Value",
      type: "string",
      required: false,
      description: "The estimated contract value",
      extractionHints: {
        aliases: ["value", "budget", "amount", "contract value", "estimated cost"],
        patterns: ["R\\s?[\\d,]+", "ZAR\\s?[\\d,]+"],
        context: ["value", "budget", "rand", "amount"],
        priority: 8,
      },
    },
    {
      name: "publish_date",
      displayName: "Publish Date",
      type: "date",
      required: false,
      description: "When the tender was published",
      extractionHints: {
        aliases: ["publish date", "publication date", "advertised", "issued date"],
        patterns: ["\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}", "\\d{4}[\\/-]\\d{2}[\\/-]\\d{2}"],
        context: ["published", "advertised", "issued"],
        priority: 5,
      },
    },
    {
      name: "close_date",
      displayName: "Closing Date",
      type: "date",
      required: false,
      description: "Submission deadline",
      validationRules: {
        format: "ISO8601",
      },
      extractionHints: {
        aliases: ["closing date", "deadline", "submission date", "due date", "closes"],
        patterns: ["\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}", "\\d{4}[\\/-]\\d{2}[\\/-]\\d{2}"],
        context: ["closing", "deadline", "closes", "due"],
        priority: 10,
      },
    },
    {
      name: "opening_date",
      displayName: "Opening Date",
      type: "date",
      required: false,
      description: "When bids will be opened",
      extractionHints: {
        aliases: ["opening date", "bid opening", "tender opening"],
        patterns: ["\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}", "\\d{4}[\\/-]\\d{2}[\\/-]\\d{2}"],
        context: ["opening", "bids will be opened"],
        priority: 4,
      },
    },
    {
      name: "contact_person",
      displayName: "Contact Person",
      type: "string",
      required: false,
      description: "Name of contact person",
      extractionHints: {
        aliases: ["contact person", "contact", "enquiries", "contact name"],
        patterns: ["[A-Z][a-z]+\\s+[A-Z][a-z]+"],
        context: ["contact", "enquiries", "person"],
        priority: 5,
      },
    },
    {
      name: "contact_email",
      displayName: "Contact Email",
      type: "string",
      required: false,
      description: "Email address for enquiries",
      validationRules: {
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      },
      extractionHints: {
        aliases: ["email", "e-mail", "email address"],
        patterns: ["[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"],
        context: ["email", "contact", "enquiries"],
        priority: 6,
      },
    },
    {
      name: "contact_phone",
      displayName: "Contact Phone",
      type: "string",
      required: false,
      description: "Phone number for enquiries",
      extractionHints: {
        aliases: ["phone", "telephone", "tel", "contact number"],
        patterns: ["\\+?27\\s?\\d{2}\\s?\\d{3}\\s?\\d{4}", "$$?0\\d{2}$$?\\s?\\d{3}\\s?\\d{4}"],
        context: ["phone", "tel", "contact", "call"],
        priority: 5,
      },
    },
    {
      name: "requirements",
      displayName: "Requirements",
      type: "array",
      required: false,
      description: "List of tender requirements",
      extractionHints: {
        aliases: ["requirements", "mandatory requirements", "prerequisites", "must have"],
        patterns: [],
        context: ["required", "must", "mandatory", "compulsory"],
        priority: 7,
      },
    },
    {
      name: "eligibility_criteria",
      displayName: "Eligibility Criteria",
      type: "array",
      required: false,
      description: "Who can bid",
      extractionHints: {
        aliases: ["eligibility", "eligible", "who may bid", "qualification criteria"],
        patterns: [],
        context: ["eligible", "may bid", "qualified", "registration"],
        priority: 6,
      },
    },
    {
      name: "compulsory_briefing",
      displayName: "Compulsory Briefing",
      type: "string",
      required: false,
      description: "Information about mandatory briefing sessions",
      extractionHints: {
        aliases: ["compulsory briefing", "mandatory briefing", "site visit", "pre-bid meeting"],
        patterns: [],
        context: ["compulsory", "mandatory", "briefing", "meeting", "site"],
        priority: 7,
      },
    },
    {
      name: "tender_type",
      displayName: "Tender Type",
      type: "string",
      required: false,
      description: "Type of procurement (RFQ, RFP, etc)",
      extractionHints: {
        aliases: ["tender type", "procurement type", "bid type"],
        patterns: ["RFQ|RFP|RFI|ITB|EOI"],
        context: ["request for", "quotation", "proposal"],
        priority: 5,
      },
    },
  ],
}

// Function to get field by name
export function getTenderField(fieldName: string): TenderField | undefined {
  return TENDER_SCHEMA.fields.find((f) => f.name === fieldName)
}

// Function to get required fields
export function getRequiredFields(): TenderField[] {
  return TENDER_SCHEMA.fields.filter((f) => f.required)
}

// Function to get all field extraction hints for scraping
export function getAllExtractionHints() {
  return TENDER_SCHEMA.fields.map((field) => ({
    field: field.name,
    displayName: field.displayName,
    ...field.extractionHints,
  }))
}
