import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { xai } from "@ai-sdk/xai";
import { z } from "zod";
import { extractText, getDocumentProxy } from "unpdf";
import { PDFDocument } from "pdf-lib";
import { getAnalysisPrompt } from "@/lib/prompts";

// ──────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────
const MIN_CHARS_PER_PAGE = 100;
const MAX_SAFE_CHARS = 450_000; // Rough safe limit before chunking (Grok-3 can handle more, but we stay conservative)
const CHUNK_OVERLAP_CHARS = 10_000; // Overlap between chunks to keep context

// ──────────────────────────────────────────────
// HELPERS (unchanged except minor logging improvements)
// ──────────────────────────────────────────────

async function extractTextWithVision(pdfUrl: string, pageNumbers: number[]): Promise<string> {
  console.log("[v0] GEMINI 2.5 PRO OCR – full document or selected pages");
  console.log(`[v0] Pages: ${pageNumbers.length > 0 ? pageNumbers.join(", ") : "ALL"}`);

  try {
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) throw new Error(`PDF fetch failed: ${pdfResponse.status}`);

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    const { text: result } = await generateObject({
      model: google("gemini-2.5-pro"),
      schema: z.object({ extractedText: z.string() }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract ALL readable text from this PDF with maximum accuracy.
Include EVERY heading, paragraph, table (use | separators), form field, header/footer, footnote.
Preserve structure and page breaks ("--- Page X ---").
If text is partial or unclear, note it but extract everything possible.`,
            },
            { type: "file", data: pdfBase64, mimeType: "application/pdf" },
          ],
        },
      ],
    });

    console.log(`[v0] Gemini OCR returned ${result.extractedText.length} chars`);
    return result.extractedText || "";
  } catch (err) {
    console.error("[v0] GEMINI OCR ERROR:", err);
    return "";
  }
}

// analyzePdfTextDensity, extractPdfFormFields remain unchanged (you can copy them from previous version)
// ... paste them here if needed ...

// ──────────────────────────────────────────────
// MAIN SCHEMA (unchanged – enforces output structure)
// ──────────────────────────────────────────────
const TenderAnalysisSchema = z.object({
  tender_summary: z.object({
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
  }).default({}),

  // ... keep all other sections with .default({}) or .default([]) as in previous version ...
  // For brevity I'm not repeating the full 1000-line schema here – just extend from your previous one

  pdfFormFieldsDetected: z.boolean().default(false),
  pdfFormFieldCount: z.number().default(0),
  pdfFormFields: z.array(z.any()).default([]), // Adjust as needed
});

// ──────────────────────────────────────────────
// POST HANDLER – NOW WITH LESS LIMITING
// ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { documentText, documentUrl } = await request.json();

    if (!documentText && !documentUrl) {
      return NextResponse.json({ error: "documentText or documentUrl required" }, { status: 400 });
    }

    let textToAnalyze = documentText || "";

    // ── TEXT EXTRACTION ─────────────────────────────────────────────
    if (documentUrl && (!documentText || documentText.length < 100)) {
      const pdfRes = await fetch(documentUrl);
      if (!pdfRes.ok) throw new Error(`PDF fetch failed: ${pdfRes.status}`);

      const buffer = await pdfRes.arrayBuffer();
      const bytesCopy1 = new Uint8Array(buffer).slice().buffer;
      const bytesCopy2 = new Uint8Array(buffer).slice().buffer;

      const density = await analyzePdfTextDensity(bytesCopy1);

      if (density.isScanned || density.scannedPages.length > 0) {
        textToAnalyze = await extractTextWithVision(documentUrl, density.scannedPages);
      } else {
        const pdf = await getDocumentProxy(new Uint8Array(bytesCopy2));
        const { text } = await extractText(pdf, { mergePages: true });
        textToAnalyze = text;
      }

      // Last resort full vision
      if (!textToAnalyze || textToAnalyze.trim().length < 200) {
        textToAnalyze = await extractTextWithVision(documentUrl, []);
      }

      if (!textToAnalyze || textToAnalyze.trim().length < 200) {
        return NextResponse.json(
          { error: "Could not extract enough text from PDF", extractedLength: textToAnalyze?.length || 0 },
          { status: 422 }
        );
      }
    }

    console.log(`[v0] Raw extracted text length: ${textToAnalyze.length} chars (~${Math.round(textToAnalyze.length / 4)} tokens)`);

    // ── SMART CHUNKING IF NEEDED ───────────────────────────────────
    let finalAnalysis: any;

    if (textToAnalyze.length <= MAX_SAFE_CHARS) {
      // Single call – most cases
      finalAnalysis = await analyzeTextChunk(textToAnalyze);
    } else {
      console.log(`[v0] Document too large (${textToAnalyze.length} chars) → chunking`);
      finalAnalysis = await analyzeInChunks(textToAnalyze);
    }

    // Attach form fields if we extracted them
    // (assuming you still run extractPdfFormFields earlier if needed)

    console.log("[v0] FINAL ANALYSIS KEYS:", Object.keys(finalAnalysis));

    return NextResponse.json(finalAnalysis);
  } catch (err: any) {
    console.error("[v0] ANALYZE ERROR:", err);
    return NextResponse.json(
      { error: "Analysis failed", details: err.message },
      { status: 500 }
    );
  }
}

// ──────────────────────────────────────────────
// SINGLE CHUNK ANALYSIS
// ──────────────────────────────────────────────
async function analyzeTextChunk(chunk: string) {
  const { object } = await generateObject({
    model: xai("grok-3"),
    schema: TenderAnalysisSchema,
    prompt: `${getAnalysisPrompt()}

This is a South African tender document – possibly very long or complex.
Extract ALL relevant information without summarizing too aggressively.
Use "Not specified" only when truly absent.
Be as complete as possible.

FULL DOCUMENT TEXT (or chunk):
${chunk}

Return structured JSON matching the schema exactly.`,
    mode: "json",
  });

  return object;
}

// ──────────────────────────────────────────────
// CHUNKING + MERGING FOR VERY LARGE DOCS
// ──────────────────────────────────────────────
async function analyzeInChunks(fullText: string) {
  const chunks: string[] = [];
  let start = 0;

  while (start < fullText.length) {
    const end = Math.min(start + MAX_SAFE_CHARS, fullText.length);
    let chunk = fullText.substring(start, end);

    // Try to end on a paragraph break
    const lastBreak = chunk.lastIndexOf("\n\n");
    if (lastBreak > 0 && lastBreak < chunk.length - 500) {
      chunk = chunk.substring(0, lastBreak);
    }

    chunks.push(chunk);
    start += chunk.length - CHUNK_OVERLAP_CHARS;
    if (start >= fullText.length) break;
  }

  console.log(`[v0] Split into ${chunks.length} overlapping chunks`);

  const partialResults = await Promise.all(
    chunks.map(async (chunk, i) => {
      console.log(`[v0] Analyzing chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);
      return analyzeTextChunk(chunk);
    })
  );

  // Simple merge: take the most complete fields across chunks
  // In production you could use another AI call to combine intelligently
  const merged = partialResults.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      if (!acc[key] || (Array.isArray(acc[key]) && curr[key]?.length > acc[key].length)) {
        acc[key] = curr[key];
      }
    });
    return acc;
  }, {} as any);

  // Clean up / fill defaults
  return TenderAnalysisSchema.parse(merged); // enforce schema
}
