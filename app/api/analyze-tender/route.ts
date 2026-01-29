import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { xai } from "@ai-sdk/xai";
import { z } from "zod";
import { extractText, getDocumentProxy } from "unpdf";
import { PDFDocument } from "pdf-lib";
import { getAnalysisPrompt } from "@/lib/prompts";

// Minimum characters per page to consider it "text-based" vs "scanned/image"
const MIN_CHARS_PER_PAGE = 100;

async function extractTextWithVision(pdfUrl: string, pageNumbers: number[]): Promise<string> {
  console.log("[v0] ========== GEMINI 2.5 PRO OCR PROCESSING ==========");
  console.log(`[v0] PDF URL: ${pdfUrl}`);
  console.log(`[v0] Pages flagged for OCR: ${pageNumbers.length > 0 ? pageNumbers.join(", ") : "ALL pages"}`);
  console.log(`[v0] Model: google/gemini-2.5-pro`);

  try {
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
    }
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
    console.log(`[v0] PDF size: ${(pdfBuffer.byteLength / 1024).toFixed(2)} KB`);

    console.log("[v0] Calling Gemini 2.5 Pro for maximum OCR accuracy...");
    const startTime = Date.now();

    const { text: extractedText } = await generateObject({
      model: google("gemini-2.5-pro"),
      schema: z.object({ extractedText: z.string() }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert document OCR assistant specializing in South African tender documents. Extract ALL text from this PDF document with perfect accuracy.
CRITICAL INSTRUCTIONS:
1. Extract EVERY piece of text, including headings, tables, form fields, headers/footers, footnotes.
2. For tables and BOQ: preserve structure with | separators.
3. Output Format: Pure text only, preserve paragraph breaks, use | for table columns, indicate page breaks with "--- Page X ---"`,
            },
            {
              type: "file",
              data: pdfBase64,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[v0] Gemini OCR completed in ${duration}s`);
    console.log(`[v0] Extracted text length: ${extractedText.extractedText?.length || 0} characters`);

    return extractedText.extractedText || "";
  } catch (error: any) {
    console.error("[v0] GEMINI OCR ERROR:", error?.message || error);
    return "";
  }
}

async function analyzePdfTextDensity(pdfBytes: ArrayBuffer): Promise<{
  isScanned: boolean;
  totalPages: number;
  scannedPages: number[];
  textPerPage: number[];
  pageTexts: string[];
}> {
  try {
    console.log("[v0] ========== PDF TEXT DENSITY ANALYSIS ==========");
    const pdf = await getDocumentProxy(new Uint8Array(pdfBytes));
    const result = await extractText(pdf, { mergePages: false });
    const pageTexts = Array.isArray(result.text) ? result.text : [result.text];

    const textPerPage = pageTexts.map((t) => (t || "").length);
    const scannedPages: number[] = [];

    textPerPage.forEach((charCount, index) => {
      const pageNum = index + 1;
      if (charCount < MIN_CHARS_PER_PAGE) {
        scannedPages.push(pageNum);
      }
    });

    const avgCharsPerPage = textPerPage.reduce((a, b) => a + b, 0) / textPerPage.length;
    const isScanned = avgCharsPerPage < MIN_CHARS_PER_PAGE || scannedPages.length > textPerPage.length / 2;

    console.log(`[v0] SUMMARY: ${textPerPage.length} pages | Avg chars/page: ${Math.round(avgCharsPerPage)}`);
    console.log(`[v0] Scanned/image pages: ${scannedPages.length} (pages: ${scannedPages.join(", ") || "none"})`);
    console.log(`[v0] Document classification: ${isScanned ? "SCANNED/IMAGE-BASED" : "TEXT-BASED"}`);

    return {
      isScanned,
      totalPages: textPerPage.length,
      scannedPages,
      textPerPage,
      pageTexts,
    };
  } catch (error) {
    console.error("[v0] PDF density analysis failed:", error);
    return { isScanned: true, totalPages: 0, scannedPages: [], textPerPage: [], pageTexts: [] };
  }
}

async function extractPdfFormFields(pdfUrl: string): Promise<{
  fields: Array<{
    name: string;
    type: string;
    options?: string[];
    position?: { x: number; y: number; width: number; height: number; page: number };
  }>;
  hasFormFields: boolean;
}> {
  try {
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
    const pdfBytes = await pdfResponse.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    const pages = pdfDoc.getPages();

    const extractedFields = fields.map((field) => {
      const name = field.getName();
      const typeName = field.constructor.name;
      let type = "text";
      let options: string[] | undefined;
      let position: { x: number; y: number; width: number; height: number; page: number } | undefined;

      if (typeName === "PDFTextField") type = "text";
      else if (typeName === "PDFCheckBox") type = "checkbox";
      else if (typeName === "PDFRadioGroup") {
        type = "radio";
        options = (field as any).getOptions?.() || [];
      } else if (typeName === "PDFDropdown") {
        type = "select";
        options = (field as any).getOptions?.() || [];
      }

      try {
        const widgets = field.acroField.getWidgets();
        if (widgets.length > 0) {
          const widget = widgets[0];
          const rect = widget.getRectangle();
          let pageIndex = 0;
          for (let i = 0; i < pages.length; i++) {
            if (pages[i].ref.toString() === widget.P()?.toString()) {
              pageIndex = i;
              break;
            }
          }
          position = { x: rect.x, y: rect.y, width: rect.width, height: rect.height, page: pageIndex + 1 };
        }
      } catch {}

      return { name, type, options, position };
    });

    return {
      fields: extractedFields,
      hasFormFields: extractedFields.length > 0,
    };
  } catch (error: any) {
    console.log("[v0] Could not extract PDF form fields:", error.message);
    return { fields: [], hasFormFields: false };
  }
}

// ──────────────────────────────────────────────
// MAIN SCHEMA – this enforces consistent output structure
// ──────────────────────────────────────────────
const TenderAnalysisSchema = z.object({
  tender_summary: z
    .object({
      tender_number: z.string().default("Not specified"),
      title: z.string().default("Not specified"),
      entity: z.string().default("Not specified"),
      description: z.string().default("Not specified"),
      contract_duration: z.string().default("Not specified"),
      closing_date: z.string().default("Not specified"),
      submission_method: z.string().default("Not specified"),
      compulsory_briefing: z.string().default("Not specified"),
      validity_period: z.string().default("Not specified"),
      contact_email: z.string().default("Not specified"),
    })
    .default({}),

  compliance_summary: z
    .object({
      requirements: z.array(z.string()).default([]),
      disqualifiers: z.array(z.string()).default([]),
      strengtheners: z.array(z.string()).default([]),
    })
    .default({}),

  evaluation: z
    .object({
      criteria: z.array(z.object({ criterion: z.string(), weight: z.number() })).default([]),
      threshold: z.string().default("Not specified"),
      pricing_system: z.string().default("Not specified"),
    })
    .default({}),

  action_plan: z
    .object({
      critical_dates: z
        .array(z.object({ date: z.string(), event: z.string(), time: z.string().optional(), location: z.string().optional() }))
        .default([]),
      preparation_tasks: z
        .array(z.object({ task: z.string(), priority: z.enum(["High", "Medium", "Low"]), deadline: z.string(), category: z.string() }))
        .default([]),
    })
    .default({}),

  // Add the remaining sections with .default() as needed
  // financial_requirements, legal_registration, labour_employment, technical_specs,
  // submission_requirements, penalties_payment, documents_identified, boq, project_plan,
  // fillable_fields, forms_summary, formFields

  pdfFormFieldsDetected: z.boolean().default(false),
  pdfFormFieldCount: z.number().default(0),
  pdfFormFields: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        options: z.array(z.string()).optional(),
        position: z.object({ x: z.number(), y: z.number(), width: z.number(), height: z.number(), page: z.number() }).optional(),
      })
    )
    .default([]),
});

export async function POST(request: NextRequest) {
  try {
    const { documentText, documentUrl, pdfFields } = await request.json();

    console.log("[v0] TENDER ANALYSIS REQUEST");
    console.log("[v0] Document text length:", documentText?.length || 0);
    console.log("[v0] Document URL:", documentUrl ? "YES" : "NO");

    if (!documentText && !documentUrl) {
      return NextResponse.json({ error: "Either document text or URL required" }, { status: 400 });
    }

    let pdfFormFields: Awaited<ReturnType<typeof extractPdfFormFields>>["fields"] = [];
    let hasPdfFormFields = false;

    if (documentUrl) {
      const pdfFieldsResult = await extractPdfFormFields(documentUrl);
      pdfFormFields = pdfFieldsResult.fields;
      hasPdfFormFields = pdfFieldsResult.hasFormFields;
    }

    let textToAnalyze = documentText || "";

    if (documentUrl && (!documentText || documentText === "")) {
      const pdfResponse = await fetch(documentUrl);
      if (!pdfResponse.ok) throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);

      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBytesForDensity = new Uint8Array(pdfArrayBuffer).slice().buffer;
      const pdfBytesForExtract = new Uint8Array(pdfArrayBuffer).slice().buffer;

      const densityAnalysis = await analyzePdfTextDensity(pdfBytesForDensity);

      if (densityAnalysis.isScanned || densityAnalysis.scannedPages.length > 0) {
        textToAnalyze = await extractTextWithVision(documentUrl, densityAnalysis.scannedPages);
      } else {
        const pdf = await getDocumentProxy(new Uint8Array(pdfBytesForExtract));
        const { text } = await extractText(pdf, { mergePages: true });
        textToAnalyze = text;
      }

      if (!textToAnalyze || textToAnalyze.trim().length < 50) {
        // Last resort full vision
        textToAnalyze = await extractTextWithVision(documentUrl, []);
      }

      if (!textToAnalyze || textToAnalyze.trim().length < 50) {
        return NextResponse.json(
          { error: "Insufficient text extracted from PDF", errorType: "insufficient_content" },
          { status: 400 }
        );
      }
    }

    const truncatedText = textToAnalyze.substring(0, 100_000);

    const basePrompt = getAnalysisPrompt();
    let pdfFieldsInstruction = "";

    if (hasPdfFormFields && pdfFormFields.length > 0) {
      pdfFieldsInstruction = `PDF FORM FIELDS DETECTED (${pdfFormFields.length} fields):\n${pdfFormFields
        .map((f) => `- "${f.name}" (type: ${f.type})${f.options ? ` [options: ${f.options.join(", ")}]` : ""}`)
        .join("\n")}\nUse EXACT field names as "id" in formFields output.`;
    } else {
      pdfFieldsInstruction = "No interactive PDF form fields detected. Generate formFields based on document content.";
    }

    const { object: analysis } = await generateObject({
      model: xai("grok-3"),
      schema: TenderAnalysisSchema,
      prompt: `${basePrompt}
${pdfFieldsInstruction}

Analyze this South African tender document text. Adapt to any format, wording, or layout.
Use "Not specified" for missing information.
Be accurate – extract only what is present.

TENDER DOCUMENT TEXT:
${truncatedText}

END OF DOCUMENT

Return structured data matching the schema exactly.`,
      mode: "json",
    });

    // Attach form field info
    analysis.pdfFormFieldsDetected = hasPdfFormFields;
    analysis.pdfFormFieldCount = pdfFormFields.length;
    analysis.pdfFormFields = pdfFormFields;

    console.log("[v0] ANALYSIS COMPLETE");
    console.log("[v0] Tender title:", analysis.tender_summary?.title);
    console.log("[v0] BOQ found:", analysis.boq?.found ?? false);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("[v0] TENDER ANALYSIS ERROR:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze tender",
        details: error?.message || "Unknown error",
        errorType: error?.name || "server_error",
      },
      { status: 500 }
    );
  }
}
