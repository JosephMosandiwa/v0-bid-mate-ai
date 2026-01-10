import { z } from "zod"

// Minimal, strict schema for tender analysis (extendable)
export const formFieldSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  type: z.string().optional(),
  required: z.boolean().optional(),
  section: z.string().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  options: z.array(z.string()).optional(),
  pdfFieldName: z.string().optional(),
})

export const analysisSchema = z.object({
  tender_summary: z.object({
    tender_number: z.string().optional(),
    title: z.string().optional(),
    entity: z.string().optional(),
    description: z.string().optional(),
    contract_duration: z.string().optional(),
    closing_date: z.string().optional(),
    submission_method: z.string().optional(),
    compulsory_briefing: z.string().optional(),
    validity_period: z.string().optional(),
    contact_email: z.string().optional(),
  }).optional(),
  compliance_summary: z.object({
    requirements: z.array(z.string()).optional(),
    disqualifiers: z.array(z.string()).optional(),
    strengtheners: z.array(z.string()).optional(),
  }).optional(),
  evaluation: z.object({
    criteria: z.array(z.object({ criterion: z.string(), weight: z.number().nullable() })).optional(),
    threshold: z.string().optional(),
    pricing_system: z.string().optional(),
  }).optional(),
  action_plan: z.object({
    critical_dates: z.array(z.object({ date: z.string(), event: z.string(), time: z.string().optional(), location: z.string().optional() })).optional(),
    preparation_tasks: z.array(z.object({ task: z.string(), priority: z.string().optional(), deadline: z.string().optional(), category: z.string().optional() })).optional(),
  }).optional(),
  financial_requirements: z.record(z.any()).optional(),
  legal_registration: z.record(z.any()).optional(),
  labour_employment: z.record(z.any()).optional(),
  technical_specs: z.record(z.any()).optional(),
  submission_requirements: z.record(z.any()).optional(),
  penalties_payment: z.record(z.any()).optional(),
  formFields: z.array(formFieldSchema).optional(),
  pdfFormFieldsDetected: z.boolean().optional(),
  pdfFormFieldCount: z.number().optional(),
  diagnostics: z.record(z.any()).optional(),
  version: z.string().optional(),
})

export type Analysis = z.infer<typeof analysisSchema>

// Provide a compact schema description for prompts
export const compactSchemaDescription = `Top-level JSON object matching analysisSchema keys: tender_summary, compliance_summary, evaluation, action_plan, financial_requirements, legal_registration, labour_employment, technical_specs, submission_requirements, penalties_payment, formFields (array of {id,label,type,required,section,placeholder,description,options,pdfFieldName}), pdfFormFieldsDetected (bool), pdfFormFieldCount (number). Use ISO dates where possible. Respond with RAW JSON only.`

export default analysisSchema
