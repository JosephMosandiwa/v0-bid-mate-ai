import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { xai } from "@ai-sdk/xai";
import { z } from "zod";
import { extractText, getDocumentProxy } from "unpdf";
import { PDFDocument } from "pdf-lib";
import { getAnalysisPrompt } from "@/lib/prompts";

// Give Vercel more time — adjust based on your plan (Hobby max ~300–600s, Pro up to 800s)
export const maxDuration = 600; // 10 minutes
export const dynamic = 'force-dynamic';

// ──────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────
const MIN_CHARS_PER_PAGE = 80;              // lowered a bit
const MIN_TEXT_LENGTH = 150;                // lowered from 200
const MAX_SAFE_CHARS_SINGLE_CALL = 380_000; // safe for Grok-3 context
const CHUNK_OVERLAP = 15_000;               // overlap chars between chunks

// ──────────────────────────────────────────────
// HELPERS (mostly unchanged, minor perf tweaks)
// ──────────────────────────────────────────────

async function extractTextWithVision(pdfUrl: string, pageNumbers: number[] = []): Promise<string> {
  console.log("[v0] GEMINI OCR – pages:", pageNumbers.length || "all");
  try {
    const res = await fetch(pdfUrl);
    if (!res.ok) throw new Error(`fetch failed ${res.status}`);

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const { object } = await generateObject({
      model: google("gemini-2.5-pro"),
      schema: z.object({ extractedText: z.string() }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract ALL text from this PDF as completely as possible.
Include tables (use | separators), headings, forms, headers/footers.
Use "--- Page X ---" for page breaks.
If extraction is partial, still return everything readable.`,
            },
            { type: "file", data: base64, mimeType: "application/pdf" },
          ],
        },
      ],
    });

    return object.extractedText || "";
  } catch (err) {
    console.error("[v0] VISION OCR ERROR:", err);
    return "";
  }
}

// analyzePdfTextDensity and extractPdfFormFields remain the same
// (copy them from your current file or previous version)


// ──────────────────────────────────────────────
// OUTPUT SCHEMA (keep your full structure – abbreviated here)
// ──────────────────────────────────────────────
const TenderAnalysisSchema = z.object({
  tender_summary: z.object({
    tender_number: z.string().default("Not specified"),
    title: z.string().default("Not specified"),
    entity: z.string().default("Not specified"),
    description: z.string().default("Not specified"),
    contract_duration: z.string().default("Not specified"),
    closing_date: z.string().default("Not specified"),
    // ... add all other fields from your original schema ...
  }).default({}),
  // ... compliance_summary, evaluation, boq, project_plan, formFields, etc. ...
  pdfFormFieldsDetected: z.boolean().default(false),
  pdfFormFieldCount: z.number().default(0),
  pdfFormFields: z.array(z.any()).default([]),
});

// ──────────────────────────────────────────────
// MAIN POST HANDLER
// ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { documentText, documentUrl } = await request.json();

    if (!documentText && !documentUrl) {
      return NextResponse.json({ error: "documentText or documentUrl required" }, { status: 400 });
    }

    let fullText = documentText || "";

    // ── TEXT EXTRACTION ─────────────────────────────────────────────
    if (documentUrl && fullText.length < 200) {
      console.log("[v0] Extracting text from URL:", documentUrl);

      const pdfRes = await fetch(documentUrl);
      if (!pdfRes.ok) throw new Error(`PDF fetch failed: ${pdfRes.status}`);

      const buffer = await pdfRes.arrayBuffer();
      const copy1 = new Uint8Array(buffer).slice().buffer;
      const copy2 = new Uint8Array(buffer).slice().buffer;

      const density = await analyzePdfTextDensity(copy1);

      if (density.isScanned || density.scannedPages.length > 3) {
        console.log("[v0] Detected scanned content → using Gemini vision");
        fullText = await extractTextWithVision(documentUrl, density.scannedPages);
      } else {
        console.log("[v0] Text-based PDF → using unpdf");
        const pdf = await getDocumentProxy(new Uint8Array(copy2));
        const { text } = await extractText(pdf, { mergePages: true });
        fullText = text;
      }

      // Last resort: full vision if still very low
      if (fullText.trim().length < MIN_TEXT_LENGTH) {
        console.log("[v0] Low text after extraction → full vision fallback");
        fullText = await extractTextWithVision(documentUrl, []);
      }

      if (fullText.trim().length < MIN_TEXT_LENGTH) {
        return NextResponse.json(
          {
            error: "Could not extract sufficient text from the PDF",
            extractedChars: fullText.length,
            hint: "Document may be image-only, corrupted, or protected.",
          },
          { status: 422 }
        );
      }
    }

    console.log(`[v0] Final text length for analysis: ${fullText.length} chars`);

    // ── ANALYSIS (with chunking if needed) ──────────────────────────
    let analysisResult;

    if (fullText.length <= MAX_SAFE_CHARS_SINGLE_CALL) {
      analysisResult = await analyzeSingleChunk(fullText);
    } else {
      console.log(`[v0] Very large document (${fullText.length} chars) → chunking`);
      analysisResult = await analyzeLargeDocument(fullText);
    }

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error("[v0] ANALYZE-TENDER CRASH:", error);
    return NextResponse.json(
      {
        error: "Analysis failed",
        details: error.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}

// ──────────────────────────────────────────────
// SINGLE CHUNK (most documents)
// ──────────────────────────────────────────────
async function analyzeSingleChunk(text: string) {
  const { object } = await generateObject({
    model: xai("grok-3"),
    schema: TenderAnalysisSchema,
    prompt: `${getAnalysisPrompt()}

Analyze this South African tender document completely.
Extract all key information – do not omit details due to length.
Use "Not specified" only when information is truly absent.

DOCUMENT TEXT:
${text}

Return structured data matching the schema.`,
    mode: "json",
  });

  return object;
}

// ──────────────────────────────────────────────
// CHUNK + MERGE FOR VERY LARGE DOCS
// ──────────────────────────────────────────────
async function analyzeLargeDocument(fullText: string) {
  const chunks: string[] = [];
  let pos = 0;

  while (pos < fullText.length) {
    let end = Math.min(pos + MAX_SAFE_CHARS_SINGLE_CALL, fullText.length);
    // Try to break on paragraph
    const breakPos = fullText.lastIndexOf("\n\n", end);
    if (breakPos > pos + 20000) end = breakPos;

    chunks.push(fullText.substring(pos, end));
    pos = end - CHUNK_OVERLAP;
    if (pos >= fullText.length) break;
  }

  console.log(`[v0] Created ${chunks.length} chunks`);

  const partials = await Promise.all(
    chunks.map(async (chunk, idx) => {
      console.log(`[v0] Processing chunk ${idx + 1}/${chunks.length} (${chunk.length} chars)`);
      return analyzeSingleChunk(chunk);
    })
  );

  // Basic merge strategy: keep the most complete version of each field
  const merged = partials.reduce((acc, curr) => {
    Object.keys(curr).forEach(key => {
      const currVal = curr[key];
      if (!acc[key] || 
          (Array.isArray(currVal) && currVal.length > (acc[key]?.length || 0)) ||
          (typeof currVal === "object" && Object.keys(currVal).length > Object.keys(acc[key] || {}).length)) {
        acc[key] = currVal;
      }
    });
    return acc;
  }, {} as any);

  // Enforce schema & defaults
  return TenderAnalysisSchema.parse(merged);
}
