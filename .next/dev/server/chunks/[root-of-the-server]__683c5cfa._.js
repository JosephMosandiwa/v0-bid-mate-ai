module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/engines/documind/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - TYPE DEFINITIONS
// Version 1.0.0
// ============================================
// ============================================
// INPUT TYPES
// ============================================
__turbopack_context__.s([]);
;
}),
"[project]/lib/engines/documind/errors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - ERROR HANDLING
// ============================================
__turbopack_context__.s([
    "Errors",
    ()=>Errors,
    "createError",
    ()=>createError,
    "formatErrorLog",
    ()=>formatErrorLog
]);
function createError(code, message, details, recoverable = false) {
    return {
        code,
        message,
        details,
        recoverable
    };
}
const Errors = {
    // File errors
    fileTooLarge: (maxSize, actualSize)=>createError("FILE_TOO_LARGE", `File size ${actualSize} bytes exceeds maximum ${maxSize} bytes`, {
            max_size: maxSize,
            actual_size: actualSize
        }, false),
    unsupportedFormat: (format)=>createError("UNSUPPORTED_FORMAT", `File format '${format}' is not supported`, {
            format
        }, false),
    corruptedFile: (reason)=>createError("CORRUPTED_FILE", reason || "The file appears to be corrupted or invalid", {
            reason
        }, false),
    passwordProtected: ()=>createError("PASSWORD_PROTECTED", "The PDF is password protected. Please provide the password.", undefined, true),
    invalidPassword: ()=>createError("INVALID_PASSWORD", "The provided password is incorrect", undefined, true),
    // Processing errors
    parseFailed: (stage, reason)=>createError("PARSE_FAILED", `Failed to parse document at stage '${stage}': ${reason}`, {
            stage,
            reason
        }, false),
    ocrFailed: (reason)=>createError("OCR_FAILED", `OCR processing failed: ${reason}`, {
            reason
        }, true),
    timeout: (stage, timeoutMs)=>createError("TIMEOUT", `Processing timed out at stage '${stage}' after ${timeoutMs}ms`, {
            stage,
            timeout_ms: timeoutMs
        }, true),
    outOfMemory: ()=>createError("OUT_OF_MEMORY", "Document is too complex to process. Try reducing page count.", undefined, false),
    // Service errors
    serviceUnavailable: (service)=>createError("SERVICE_UNAVAILABLE", `Service '${service}' is currently unavailable`, {
            service
        }, true),
    rateLimited: (retryAfter)=>createError("RATE_LIMITED", `Rate limit exceeded. Please retry after ${retryAfter} seconds`, {
            retry_after: retryAfter
        }, true),
    quotaExceeded: (quota)=>createError("QUOTA_EXCEEDED", `Quota '${quota}' has been exceeded`, {
            quota
        }, false),
    // Validation errors
    invalidRequest: (reason)=>createError("INVALID_REQUEST", `Invalid request: ${reason}`, {
            reason
        }, false),
    missingRequiredField: (field)=>createError("MISSING_REQUIRED_FIELD", `Required field '${field}' is missing`, {
            field
        }, false),
    invalidOptions: (option, reason)=>createError("INVALID_OPTIONS", `Invalid option '${option}': ${reason}`, {
            option,
            reason
        }, false),
    // Not found errors
    documentNotFound: (documentId)=>createError("DOCUMENT_NOT_FOUND", `Document '${documentId}' not found`, {
            document_id: documentId
        }, false),
    templateNotFound: (templateId)=>createError("TEMPLATE_NOT_FOUND", `Template '${templateId}' not found`, {
            template_id: templateId
        }, false),
    jobNotFound: (jobId)=>createError("JOB_NOT_FOUND", `Job '${jobId}' not found`, {
            job_id: jobId
        }, false)
};
function formatErrorLog(error, context) {
    return {
        document_id: context.document_id,
        job_id: context.job_id,
        app_id: context.app_id,
        request_id: context.request_id,
        error_code: error.code,
        error_message: error.message,
        processing_stage: context.processing_stage,
        file_info: context.file_info,
        occurred_at: new Date().toISOString()
    };
}
}),
"[project]/lib/engines/documind/constants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - CONSTANTS
// ============================================
// File size limits
__turbopack_context__.s([
    "API_VERSION",
    ()=>API_VERSION,
    "CACHE_TTL",
    ()=>CACHE_TTL,
    "DOCUMENT_TYPE_PATTERNS",
    ()=>DOCUMENT_TYPE_PATTERNS,
    "FIELD_DETECTION",
    ()=>FIELD_DETECTION,
    "MAX_FILE_SIZE",
    ()=>MAX_FILE_SIZE,
    "MAX_FILE_SIZE_FOR_SYNC",
    ()=>MAX_FILE_SIZE_FOR_SYNC,
    "MAX_PAGES",
    ()=>MAX_PAGES,
    "MIME_TO_EXTENSION",
    ()=>MIME_TO_EXTENSION,
    "OCR_CONFIG",
    ()=>OCR_CONFIG,
    "PDF_POINTS_PER_INCH",
    ()=>PDF_POINTS_PER_INCH,
    "RATE_LIMITS",
    ()=>RATE_LIMITS,
    "SA_TENDER_FORMS",
    ()=>SA_TENDER_FORMS,
    "SUPPORTED_MIME_TYPES",
    ()=>SUPPORTED_MIME_TYPES,
    "TIMEOUTS",
    ()=>TIMEOUTS
]);
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
;
const MAX_PAGES = 500;
const MAX_FILE_SIZE_FOR_SYNC = 10 * 1024 * 1024 // 10MB - larger files go async
;
const SUPPORTED_MIME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "image/png",
    "image/jpeg",
    "image/tiff",
    "image/webp"
];
const MIME_TO_EXTENSION = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/msword": ".doc",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/tiff": ".tiff",
    "image/webp": ".webp"
};
const TIMEOUTS = {
    parse: 60000,
    ocr_per_page: 10000,
    layout_analysis: 30000,
    total: 300000
};
const CACHE_TTL = {
    parsed_document: 86400,
    template_list: 3600,
    fingerprint_match: 86400
};
const OCR_CONFIG = {
    default_language: "eng",
    confidence_threshold: 0.6,
    min_text_density: 0.01
};
const FIELD_DETECTION = {
    min_line_length: 20,
    max_label_distance: 50,
    min_confidence: 0.5
};
const PDF_POINTS_PER_INCH = 72;
const SA_TENDER_FORMS = {
    SBD1: "Invitation to Bid",
    SBD2: "Tax Clearance Certificate Requirements",
    SBD3_1: "Pricing Schedule - Firm Prices",
    SBD3_2: "Pricing Schedule - Non-Firm Prices",
    SBD3_3: "Pricing Schedule - Professional Services",
    SBD4: "Declaration of Interest",
    SBD5: "National Industrial Participation Programme",
    SBD6_1: "Preference Points Claim Form - Procurement",
    SBD6_2: "Declaration for Local Production and Content",
    SBD7_1: "Contract Form - Purchase of Goods",
    SBD7_2: "Contract Form - Lease of Goods",
    SBD7_3: "Contract Form - Rendering of Services",
    SBD8: "Declaration of Bidders Past SCM Practices",
    SBD9: "Certificate of Independent Bid Determination",
    MBD1: "Municipal Invitation to Bid",
    MBD2: "Tax Clearance Requirements",
    MBD4: "Declaration of Interest",
    MBD5: "Declaration for Procurement",
    MBD6_1: "Preference Points Claim Form",
    MBD7_1: "Contract Form - Purchase",
    MBD8: "Declaration of Bidders Past SCM Practices",
    MBD9: "Certificate of Independent Bid Determination",
    CSD: "Central Supplier Database",
    CIDB: "Construction Industry Development Board"
};
const DOCUMENT_TYPE_PATTERNS = {
    tender: [
        /tender/i,
        /bid/i,
        /rfq/i,
        /request for quotation/i,
        /invitation to/i,
        /procurement/i
    ],
    boq: [
        /bill of quantities/i,
        /boq/i,
        /schedule of quantities/i,
        /pricing schedule/i
    ],
    contract: [
        /contract/i,
        /agreement/i,
        /terms and conditions/i
    ],
    specification: [
        /specification/i,
        /technical requirements/i,
        /scope of work/i
    ],
    certificate: [
        /certificate/i,
        /certification/i,
        /clearance/i
    ],
    invoice: [
        /invoice/i,
        /tax invoice/i,
        /receipt/i
    ],
    form: [
        /form/i,
        /application/i,
        /declaration/i
    ]
};
const RATE_LIMITS = {
    free: {
        requests_per_minute: 10,
        requests_per_day: 100,
        max_pages_per_request: 50
    },
    basic: {
        requests_per_minute: 30,
        requests_per_day: 500,
        max_pages_per_request: 100
    },
    professional: {
        requests_per_minute: 60,
        requests_per_day: 2000,
        max_pages_per_request: 300
    },
    enterprise: {
        requests_per_minute: 200,
        requests_per_day: 10000,
        max_pages_per_request: 500
    }
};
const API_VERSION = "v1";
}),
"[project]/lib/engines/documind/utils/position-mapper.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - POSITION MAPPER
// Handles coordinate system conversions
// ============================================
__turbopack_context__.s([
    "boxCenter",
    ()=>boxCenter,
    "boxContains",
    ()=>boxContains,
    "boxDistance",
    ()=>boxDistance,
    "boxesOverlap",
    ()=>boxesOverlap,
    "calculateIoU",
    ()=>calculateIoU,
    "expandBox",
    ()=>expandBox,
    "mergeBoxes",
    ()=>mergeBoxes,
    "normalizedToPdf",
    ()=>normalizedToPdf,
    "normalizedToPixel",
    ()=>normalizedToPixel,
    "pdfToNormalized",
    ()=>pdfToNormalized,
    "pdfToPixel",
    ()=>pdfToPixel,
    "pixelToNormalized",
    ()=>pixelToNormalized,
    "pixelToPdf",
    ()=>pixelToPdf,
    "pointInBox",
    ()=>pointInBox
]);
function pdfToNormalized(box, page) {
    return {
        x: box.x / page.width,
        // Flip Y axis: PDF bottom-left to normalized top-left
        y: 1 - (box.y + box.height) / page.height,
        width: box.width / page.width,
        height: box.height / page.height
    };
}
function normalizedToPdf(box, page) {
    return {
        x: box.x * page.width,
        // Flip Y axis back: normalized top-left to PDF bottom-left
        y: page.height - (box.y + box.height) * page.height,
        width: box.width * page.width,
        height: box.height * page.height
    };
}
function pdfToPixel(box, page, scale = 1) {
    return {
        x: box.x * scale,
        // Flip Y axis for canvas (top-left origin)
        y: (page.height - box.y - box.height) * scale,
        width: box.width * scale,
        height: box.height * scale
    };
}
function pixelToPdf(box, page, scale = 1) {
    return {
        x: box.x / scale,
        // Flip Y axis back to PDF
        y: page.height - box.y / scale - box.height / scale,
        width: box.width / scale,
        height: box.height / scale
    };
}
function normalizedToPixel(box, page, scale = 1) {
    return {
        x: box.x * page.width * scale,
        y: box.y * page.height * scale,
        width: box.width * page.width * scale,
        height: box.height * page.height * scale
    };
}
function pixelToNormalized(box, page, scale = 1) {
    return {
        x: box.x / scale / page.width,
        y: box.y / scale / page.height,
        width: box.width / scale / page.width,
        height: box.height / scale / page.height
    };
}
function boxesOverlap(a, b) {
    return !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y);
}
function boxContains(container, inner) {
    return inner.x >= container.x && inner.y >= container.y && inner.x + inner.width <= container.x + container.width && inner.y + inner.height <= container.y + container.height;
}
function boxDistance(a, b) {
    const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.width, b.x + b.width));
    const dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.height, b.y + b.height));
    return Math.sqrt(dx * dx + dy * dy);
}
function boxCenter(box) {
    return {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2
    };
}
function mergeBoxes(boxes) {
    if (boxes.length === 0) {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    }
    const minX = Math.min(...boxes.map((b)=>b.x));
    const minY = Math.min(...boxes.map((b)=>b.y));
    const maxX = Math.max(...boxes.map((b)=>b.x + b.width));
    const maxY = Math.max(...boxes.map((b)=>b.y + b.height));
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}
function expandBox(box, margin) {
    return {
        x: box.x - margin,
        y: box.y - margin,
        width: box.width + margin * 2,
        height: box.height + margin * 2
    };
}
function pointInBox(point, box) {
    return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
}
function calculateIoU(a, b) {
    const intersectX = Math.max(a.x, b.x);
    const intersectY = Math.max(a.y, b.y);
    const intersectW = Math.min(a.x + a.width, b.x + b.width) - intersectX;
    const intersectH = Math.min(a.y + a.height, b.y + b.height) - intersectY;
    if (intersectW <= 0 || intersectH <= 0) {
        return 0;
    }
    const intersectionArea = intersectW * intersectH;
    const aArea = a.width * a.height;
    const bArea = b.width * b.height;
    const unionArea = aArea + bArea - intersectionArea;
    return intersectionArea / unionArea;
}
}),
"[project]/lib/engines/documind/modules/pdf-parser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - PDF PARSER MODULE
// Uses unpdf for text extraction (server-compatible)
// Uses pdf-lib for form field extraction
// ============================================
__turbopack_context__.s([
    "parsePDF",
    ()=>parsePDF
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/utils/position-mapper.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/constants.ts [app-route] (ecmascript)");
;
;
let PDFDocumentModule = null;
async function getPdfLib() {
    if (!PDFDocumentModule) {
        const pdfLib = await __turbopack_context__.A("[project]/node_modules/.pnpm/pdf-lib@1.17.1/node_modules/pdf-lib/es/index.js [app-route] (ecmascript, async loader)");
        PDFDocumentModule = pdfLib.PDFDocument;
    }
    return PDFDocumentModule;
}
async function parsePDF(data, options = {}) {
    const { maxPages } = options;
    let uint8Data;
    if (data instanceof ArrayBuffer) {
        uint8Data = new Uint8Array(data);
    } else if (data instanceof Uint8Array) {
        uint8Data = data;
    } else {
        // Handle Buffer or other array-like objects
        uint8Data = new Uint8Array(data);
    }
    const header = String.fromCharCode(...uint8Data.slice(0, 8));
    console.log("[v0] PDF header check:", header.substring(0, 5), "Length:", uint8Data.length);
    if (!header.startsWith("%PDF-")) {
        throw new Error(`Invalid PDF: Expected %PDF- header but got: ${header.substring(0, 10)}`);
    }
    const PDFDocument = await getPdfLib();
    const pdfDoc = await PDFDocument.load(uint8Data, {
        ignoreEncryption: true
    });
    const pageCount = pdfDoc.getPageCount();
    console.log("[v0] PDF loaded with pdf-lib, pages:", pageCount);
    // Determine page range
    const pagesToProcess = maxPages ? Math.min(pageCount, maxPages) : pageCount;
    let fullText = "";
    let pageTexts = [];
    try {
        const { getDocumentProxy, extractText } = await __turbopack_context__.A("[project]/node_modules/.pnpm/unpdf@1.4.0_@napi-rs+canvas@0.1.85/node_modules/unpdf/dist/index.mjs [app-route] (ecmascript, async loader)");
        // Create a copy of the data for unpdf
        const pdfData = uint8Data.slice();
        const pdf = await getDocumentProxy(pdfData);
        const mergedResult = await extractText(pdf, {
            mergePages: true
        });
        fullText = typeof mergedResult.text === "string" ? mergedResult.text : mergedResult.text.join("\n\n");
        const perPageResult = await extractText(pdf, {
            mergePages: false
        });
        pageTexts = Array.isArray(perPageResult.text) ? perPageResult.text : [
            perPageResult.text
        ];
        console.log("[v0] Text extracted via unpdf, length:", fullText.length);
    } catch (unpdfError) {
        console.log("[v0] unpdf extraction failed, using basic extraction:", unpdfError);
        // Fallback: just use empty text - documents will be marked as scanned
        pageTexts = new Array(pagesToProcess).fill("");
        fullText = "";
    }
    // Build pages
    const pages = [];
    let totalTextLength = 0;
    for(let i = 0; i < pagesToProcess; i++){
        const pageText = pageTexts[i] || "";
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        const parsedPage = createParsedPage(pageText, i + 1, width, height);
        pages.push(parsedPage);
        totalTextLength += pageText.length;
    }
    // Detect if document is scanned (low text density)
    const avgTextPerPage = totalTextLength / pagesToProcess;
    const isScanned = avgTextPerPage < __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OCR_CONFIG"].min_text_density * 1000;
    // Extract form fields using pdf-lib
    const formFields = await extractFormFields(uint8Data);
    // Extract metadata using pdf-lib
    const metadata = await extractMetadataFromPdfLib(pdfDoc, pageCount, isScanned, fullText);
    return {
        metadata,
        pages,
        formFields,
        rawText: fullText,
        isScanned
    };
}
/**
 * Create a parsed page from text content
 * Simplified page creation without pdfjs position data
 */ function createParsedPage(pageText, pageNumber, width, height) {
    const textBlocks = createTextBlocks(pageText, pageNumber, width, height);
    const isScanned = pageText.length < __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OCR_CONFIG"].min_text_density * 1000;
    return {
        page_number: pageNumber,
        width,
        height,
        rotation: 0,
        content: {
            full_text: pageText,
            text_blocks: textBlocks,
            lines: [],
            rectangles: [],
            images: []
        },
        is_scanned: isScanned,
        ocr_confidence: null
    };
}
/**
 * Create text blocks from page text
 * Creates logical text blocks from extracted text
 */ function createTextBlocks(pageText, pageNumber, pageWidth, pageHeight) {
    const blocks = [];
    const lines = pageText.split("\n").filter((line)=>line.trim());
    let yPosition = pageHeight - 50 // Start from top
    ;
    const lineHeight = 14;
    lines.forEach((line, index)=>{
        const trimmedLine = line.trim();
        if (!trimmedLine) return;
        // Estimate position based on line index
        const position = {
            x: 50,
            y: yPosition,
            width: Math.min(trimmedLine.length * 7, pageWidth - 100),
            height: lineHeight
        };
        // Classify the block type
        const blockType = classifyTextBlockFromContent(trimmedLine);
        const font = estimateFontFromBlockType(blockType);
        blocks.push({
            id: `tb-${pageNumber}-${index}`,
            text: trimmedLine,
            position,
            position_normalized: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pdfToNormalized"])(position, {
                width: pageWidth,
                height: pageHeight
            }),
            font,
            block_type: blockType,
            line_index: index,
            paragraph_index: Math.floor(index / 5),
            confidence: 0.8,
            words: null
        });
        yPosition -= lineHeight * 1.5;
    });
    return blocks;
}
/**
 * Classify text block type from content
 */ function classifyTextBlockFromContent(text) {
    const trimmed = text.trim();
    // Check for headings (all caps, short, or numbered sections)
    if (trimmed === trimmed.toUpperCase() && trimmed.length < 100 && trimmed.length > 2) {
        return "heading_1";
    }
    // Check for section numbers like "1.", "1.1", "Section 1"
    if (/^(\d+\.?\d*\.?\d*|\w+\s+\d+)[.:]\s/.test(trimmed)) {
        if (trimmed.length < 80) return "heading_2";
    }
    // Check for labels (ends with colon)
    if (trimmed.endsWith(":") && trimmed.length < 50) {
        return "label";
    }
    // Check for list items
    if (/^[\u2022\u2023\u25E6\u2043\u2219•\-*]\s/.test(trimmed)) {
        return "list_item";
    }
    if (/^\d+[.)]\s/.test(trimmed)) {
        return "list_item";
    }
    // Check for page numbers
    if (/^(Page\s*)?\d+(\s*of\s*\d+)?$/i.test(trimmed)) {
        return "page_number";
    }
    return "paragraph";
}
/**
 * Estimate font info from block type
 */ function estimateFontFromBlockType(blockType) {
    const baseFontSize = 12;
    switch(blockType){
        case "heading_1":
            return {
                name: "Helvetica-Bold",
                family: "Helvetica",
                size: 18,
                weight: "bold",
                style: "normal",
                color: "#000000"
            };
        case "heading_2":
            return {
                name: "Helvetica-Bold",
                family: "Helvetica",
                size: 14,
                weight: "bold",
                style: "normal",
                color: "#000000"
            };
        case "heading_3":
            return {
                name: "Helvetica-Bold",
                family: "Helvetica",
                size: 12,
                weight: "bold",
                style: "normal",
                color: "#000000"
            };
        case "label":
            return {
                name: "Helvetica-Bold",
                family: "Helvetica",
                size: 11,
                weight: "bold",
                style: "normal",
                color: "#000000"
            };
        default:
            return {
                name: "Helvetica",
                family: "Helvetica",
                size: baseFontSize,
                weight: "normal",
                style: "normal",
                color: "#000000"
            };
    }
}
/**
 * Extract metadata using pdf-lib
 * Now accepts pre-loaded pdfDoc instead of raw data
 */ async function extractMetadataFromPdfLib(pdfDoc, pageCount, isScanned, fullText) {
    try {
        return {
            title: pdfDoc.getTitle() || null,
            author: pdfDoc.getAuthor() || null,
            subject: pdfDoc.getSubject() || null,
            creator: pdfDoc.getCreator() || null,
            producer: pdfDoc.getProducer() || null,
            creation_date: pdfDoc.getCreationDate()?.toISOString() || null,
            modification_date: pdfDoc.getModificationDate()?.toISOString() || null,
            page_count: pageCount,
            pdf_version: null,
            is_encrypted: false,
            is_scanned: isScanned,
            detected_language: "en",
            detected_type: detectDocumentType(fullText)
        };
    } catch (error) {
        console.error("Error extracting metadata:", error);
        return {
            title: null,
            author: null,
            subject: null,
            creator: null,
            producer: null,
            creation_date: null,
            modification_date: null,
            page_count: pageCount,
            pdf_version: null,
            is_encrypted: false,
            is_scanned: isScanned,
            detected_language: "en",
            detected_type: detectDocumentType(fullText)
        };
    }
}
/**
 * Extract form fields using pdf-lib
 */ async function extractFormFields(data) {
    try {
        const PDFDocument = await getPdfLib();
        const pdfDoc = await PDFDocument.load(data, {
            ignoreEncryption: true
        });
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        const formFields = [];
        for (const field of fields){
            const widgets = field.acroField.getWidgets();
            if (widgets.length === 0) continue;
            const widget = widgets[0];
            const rect = widget.getRectangle();
            const page = pdfDoc.getPages().findIndex((p)=>{
                const pageRef = p.ref;
                const widgetPage = widget.P();
                return widgetPage && pageRef.toString() === widgetPage.toString();
            });
            const pageObj = pdfDoc.getPage(Math.max(0, page));
            const { width: pageWidth, height: pageHeight } = pageObj.getSize();
            const position = {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            };
            const fieldType = getFieldType(field);
            const fieldValue = getFieldValue(field, fieldType);
            const options = getFieldOptions(field, fieldType);
            formFields.push({
                id: field.getName(),
                name: field.getName(),
                type: fieldType,
                page: Math.max(1, page + 1),
                position,
                position_normalized: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pdfToNormalized"])(position, {
                    width: pageWidth,
                    height: pageHeight
                }),
                value: fieldValue,
                default_value: null,
                is_required: field.isRequired(),
                is_readonly: field.isReadOnly(),
                max_length: null,
                options,
                font: null,
                text_alignment: "left",
                format: null
            });
        }
        return formFields;
    } catch (error) {
        console.error("Error extracting form fields:", error);
        return [];
    }
}
/**
 * Determine field type from pdf-lib field
 */ function getFieldType(field) {
    const constructor = field.constructor.name;
    switch(constructor){
        case "PDFTextField":
            return "text";
        case "PDFCheckBox":
            return "checkbox";
        case "PDFRadioGroup":
            return "radio";
        case "PDFDropdown":
            return "select";
        case "PDFSignature":
            return "signature";
        case "PDFButton":
            return "button";
        default:
            return "text";
    }
}
/**
 * Get field value based on type
 */ function getFieldValue(field, type) {
    try {
        switch(type){
            case "checkbox":
                return field.isChecked();
            case "radio":
                return field.getSelected() || null;
            case "select":
                return field.getSelected() || [];
            case "text":
                return field.getText() || null;
            default:
                return null;
        }
    } catch  {
        return null;
    }
}
/**
 * Get field options for select/radio
 */ function getFieldOptions(field, type) {
    if (type !== "select" && type !== "radio") return [];
    try {
        const options = field.getOptions?.() || [];
        return options.map((opt, idx)=>({
                value: opt,
                label: opt,
                is_default: idx === 0
            }));
    } catch  {
        return [];
    }
}
/**
 * Detect document type from content
 */ function detectDocumentType(text) {
    const lowerText = text.toLowerCase();
    for (const [type, patterns] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DOCUMENT_TYPE_PATTERNS"])){
        for (const pattern of patterns){
            if (pattern.test(lowerText)) {
                return type;
            }
        }
    }
    return "unknown";
}
}),
"[project]/lib/engines/documind/modules/layout-analyzer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - LAYOUT ANALYZER MODULE
// Analyzes document structure and detects regions
// ============================================
__turbopack_context__.s([
    "analyzeLayout",
    ()=>analyzeLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/utils/position-mapper.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/constants.ts [app-route] (ecmascript)");
;
;
function analyzeLayout(pages, documentType) {
    // Extract sections from headings
    const sections = extractSections(pages);
    // Find title
    const title = findDocumentTitle(pages);
    // Detect table regions
    const tableRegions = detectTableRegions(pages);
    // Detect form regions and fields
    const { formRegions, detectedFields } = detectFormRegions(pages);
    // Build reading order
    const readingOrder = buildReadingOrder(pages);
    return {
        layout: {
            document_type: documentType,
            title,
            sections,
            table_regions: tableRegions,
            form_regions: formRegions,
            reading_order: readingOrder
        },
        detectedFields,
        tableRegions
    };
}
/**
 * Extract document sections from headings
 */ function extractSections(pages) {
    const sections = [];
    let currentSection = null;
    let sectionId = 0;
    pages.forEach((page)=>{
        page.content.text_blocks.forEach((block)=>{
            if (block.block_type.startsWith("heading")) {
                const level = Number.parseInt(block.block_type.split("_")[1]) || 1;
                const newSection = {
                    id: `section-${sectionId++}`,
                    title: block.text,
                    level,
                    page_start: page.page_number,
                    page_end: page.page_number,
                    block_ids: [
                        block.id
                    ],
                    subsections: []
                };
                if (level === 1) {
                    // Top-level section
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = newSection;
                } else if (currentSection) {
                    // Subsection
                    if (level === 2) {
                        currentSection.subsections.push(newSection);
                    } else if (level === 3 && currentSection.subsections.length > 0) {
                        const lastSubsection = currentSection.subsections[currentSection.subsections.length - 1];
                        lastSubsection.subsections.push(newSection);
                    }
                } else {
                    currentSection = newSection;
                }
            } else if (currentSection) {
                // Add content blocks to current section
                currentSection.block_ids.push(block.id);
                currentSection.page_end = page.page_number;
            }
        });
    });
    if (currentSection) {
        sections.push(currentSection);
    }
    return sections;
}
/**
 * Find document title (first prominent heading or first large text)
 */ function findDocumentTitle(pages) {
    if (pages.length === 0) return null;
    const firstPage = pages[0];
    // Look for heading_1
    const h1 = firstPage.content.text_blocks.find((b)=>b.block_type === "heading_1");
    if (h1) return h1;
    // Look for largest text in top half of page
    const topHalfBlocks = firstPage.content.text_blocks.filter((b)=>b.position_normalized.y < 0.5);
    if (topHalfBlocks.length === 0) return null;
    return topHalfBlocks.reduce((largest, block)=>block.font.size > largest.font.size ? block : largest);
}
/**
 * Detect table regions
 */ function detectTableRegions(pages) {
    const tableRegions = [];
    let tableId = 0;
    pages.forEach((page)=>{
        const pageDimensions = {
            width: page.width,
            height: page.height
        };
        // Method 1: Find grid patterns from lines
        const gridRegions = findGridPatterns(page.content.lines, pageDimensions);
        // Method 2: Find aligned text patterns (columns of data)
        const textTableRegions = findTextTablePatterns(page.content.text_blocks, pageDimensions);
        // Merge detected regions
        const mergedRegions = mergeOverlappingRegions([
            ...gridRegions,
            ...textTableRegions
        ]);
        mergedRegions.forEach((region)=>{
            tableRegions.push({
                id: `table-${tableId++}`,
                page: page.page_number,
                position: region.position,
                position_normalized: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pdfToNormalized"])(region.position, pageDimensions),
                row_count_estimate: region.rows,
                column_count_estimate: region.cols,
                has_header: region.hasHeader,
                extraction_status: "pending",
                table_data: null
            });
        });
    });
    return tableRegions;
}
/**
 * Find grid patterns from horizontal and vertical lines
 */ function findGridPatterns(lines, pageDimensions) {
    const horizontalLines = lines.filter((l)=>l.type === "horizontal");
    const verticalLines = lines.filter((l)=>l.type === "vertical");
    if (horizontalLines.length < 2 || verticalLines.length < 2) {
        return [];
    }
    // Group lines by proximity
    const hGroups = groupLinesByPosition(horizontalLines, "y");
    const vGroups = groupLinesByPosition(verticalLines, "x");
    const grids = [];
    // Find intersecting line groups that form grids
    if (hGroups.length >= 2 && vGroups.length >= 2) {
        const minX = Math.min(...verticalLines.map((l)=>l.start.x));
        const maxX = Math.max(...verticalLines.map((l)=>l.start.x));
        const minY = Math.min(...horizontalLines.map((l)=>l.start.y));
        const maxY = Math.max(...horizontalLines.map((l)=>l.start.y));
        grids.push({
            position: {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            },
            rows: hGroups.length - 1,
            cols: vGroups.length - 1,
            hasHeader: true
        });
    }
    return grids;
}
/**
 * Group lines by their position
 */ function groupLinesByPosition(lines, axis) {
    const tolerance = 5;
    const positions = lines.map((l)=>l.start[axis]);
    const groups = [];
    positions.sort((a, b)=>a - b);
    let currentGroup = [];
    let lastPos = Number.NEGATIVE_INFINITY;
    positions.forEach((pos)=>{
        if (pos - lastPos > tolerance) {
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            }
            currentGroup = [
                pos
            ];
        } else {
            currentGroup.push(pos);
        }
        lastPos = pos;
    });
    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }
    return groups;
}
/**
 * Find table patterns from aligned text blocks
 */ function findTextTablePatterns(blocks, pageDimensions) {
    // Group blocks by similar Y positions (rows)
    const rowGroups = groupBlocksByRow(blocks);
    // Find sequences of rows with similar column structure
    const tables = [];
    let tableStart = -1;
    let lastColCount = 0;
    let tableBlocks = [];
    rowGroups.forEach((row, idx)=>{
        const colCount = estimateColumnCount(row);
        if (colCount >= 2) {
            if (tableStart === -1) {
                tableStart = idx;
                lastColCount = colCount;
                tableBlocks = [
                    ...row
                ];
            } else if (Math.abs(colCount - lastColCount) <= 1) {
                tableBlocks.push(...row);
            } else {
                // End current table, start new
                if (tableBlocks.length >= 4) {
                    tables.push(createTableFromBlocks(tableBlocks, lastColCount));
                }
                tableStart = idx;
                lastColCount = colCount;
                tableBlocks = [
                    ...row
                ];
            }
        } else {
            if (tableBlocks.length >= 4) {
                tables.push(createTableFromBlocks(tableBlocks, lastColCount));
            }
            tableStart = -1;
            tableBlocks = [];
        }
    });
    if (tableBlocks.length >= 4) {
        tables.push(createTableFromBlocks(tableBlocks, lastColCount));
    }
    return tables;
}
/**
 * Group text blocks by row (similar Y position)
 */ function groupBlocksByRow(blocks) {
    const tolerance = 10;
    const sorted = [
        ...blocks
    ].sort((a, b)=>b.position.y - a.position.y) // Top to bottom in PDF coords
    ;
    const rows = [];
    let currentRow = [];
    let lastY = Number.POSITIVE_INFINITY;
    sorted.forEach((block)=>{
        if (Math.abs(block.position.y - lastY) > tolerance) {
            if (currentRow.length > 0) {
                rows.push(currentRow.sort((a, b)=>a.position.x - b.position.x));
            }
            currentRow = [
                block
            ];
        } else {
            currentRow.push(block);
        }
        lastY = block.position.y;
    });
    if (currentRow.length > 0) {
        rows.push(currentRow.sort((a, b)=>a.position.x - b.position.x));
    }
    return rows;
}
/**
 * Estimate column count from a row of blocks
 */ function estimateColumnCount(row) {
    if (row.length <= 1) return row.length;
    // Count significant gaps between blocks
    const gaps = [];
    for(let i = 1; i < row.length; i++){
        const gap = row[i].position.x - (row[i - 1].position.x + row[i - 1].position.width);
        gaps.push(gap);
    }
    // Average gap
    const avgGap = gaps.reduce((a, b)=>a + b, 0) / gaps.length;
    // Count gaps larger than average (column separators)
    const significantGaps = gaps.filter((g)=>g > avgGap * 1.5).length;
    return significantGaps + 1;
}
/**
 * Create table region from blocks
 */ function createTableFromBlocks(blocks, cols) {
    const position = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeBoxes"])(blocks.map((b)=>b.position));
    const rowGroups = groupBlocksByRow(blocks);
    return {
        position,
        rows: rowGroups.length,
        cols,
        hasHeader: true
    };
}
/**
 * Merge overlapping regions
 */ function mergeOverlappingRegions(regions) {
    if (regions.length <= 1) return regions;
    const merged = [];
    regions.forEach((region)=>{
        const overlapping = merged.findIndex((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxesOverlap"])(m.position, region.position));
        if (overlapping >= 0) {
            // Merge with existing
            merged[overlapping] = {
                position: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeBoxes"])([
                    merged[overlapping].position,
                    region.position
                ]),
                rows: Math.max(merged[overlapping].rows, region.rows),
                cols: Math.max(merged[overlapping].cols, region.cols),
                hasHeader: merged[overlapping].hasHeader || region.hasHeader
            };
        } else {
            merged.push(region);
        }
    });
    return merged;
}
/**
 * Detect form regions and fields
 */ function detectFormRegions(pages) {
    const formRegions = [];
    const detectedFields = [];
    let regionId = 0;
    let fieldId = 0;
    pages.forEach((page)=>{
        const pageDimensions = {
            width: page.width,
            height: page.height
        };
        // Find labels (text ending with colon)
        const labels = page.content.text_blocks.filter((b)=>b.block_type === "label" || b.text.trim().endsWith(":"));
        // Find form lines (horizontal lines that could be underlines)
        const formLines = page.content.lines.filter((l)=>l.is_form_line);
        // Find text boxes (rectangles)
        const textBoxes = page.content.rectangles.filter((r)=>r.rect_type === "text_box");
        // Find checkboxes
        const checkboxes = page.content.rectangles.filter((r)=>r.rect_type === "checkbox");
        // Match labels to input areas
        const pageFields = [];
        labels.forEach((label)=>{
            // Look for line to the right or below
            const nearbyLine = findNearbyInputLine(label, formLines);
            const nearbyBox = findNearbyInputBox(label, textBoxes);
            const nearbyCheckbox = findNearbyCheckbox(label, checkboxes);
            if (nearbyLine) {
                pageFields.push(createDetectedField(`field-${fieldId++}`, label, {
                    type: "text_line",
                    position: lineToBox(nearbyLine)
                }, pageDimensions, "line_detection"));
            } else if (nearbyBox) {
                pageFields.push(createDetectedField(`field-${fieldId++}`, label, {
                    type: "text_box",
                    position: nearbyBox.position
                }, pageDimensions, "box_detection"));
            } else if (nearbyCheckbox) {
                pageFields.push(createDetectedField(`field-${fieldId++}`, label, {
                    type: "checkbox",
                    position: nearbyCheckbox.position
                }, pageDimensions, "box_detection"));
            } else {
                // Look for pattern-based detection (Label: _____)
                const patternInput = detectPatternInput(label, page.content.text_blocks);
                if (patternInput) {
                    pageFields.push(createDetectedField(`field-${fieldId++}`, label, patternInput, pageDimensions, "pattern_matching"));
                }
            }
        });
        if (pageFields.length > 0) {
            // Create form region encompassing all fields
            const allPositions = pageFields.flatMap((f)=>[
                    f.label.position,
                    f.input.position
                ]);
            const regionPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeBoxes"])(allPositions);
            formRegions.push({
                id: `form-region-${regionId++}`,
                page: page.page_number,
                position: regionPosition,
                position_normalized: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pdfToNormalized"])(regionPosition, pageDimensions),
                detected_fields: pageFields
            });
            detectedFields.push(...pageFields);
        }
    });
    return {
        formRegions,
        detectedFields
    };
}
/**
 * Find nearby input line for a label
 */ function findNearbyInputLine(label, lines) {
    const maxDistance = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FIELD_DETECTION"].max_label_distance;
    // Look for line to the right (same line) or below
    const candidates = lines.filter((line)=>{
        // Line should be to the right or below the label
        const labelRight = label.position.x + label.position.width;
        const labelBottom = label.position.y;
        // Right of label
        if (line.start.x >= labelRight - 10 && line.start.x <= labelRight + maxDistance && Math.abs(line.start.y - label.position.y) < label.position.height) {
            return true;
        }
        // Below label
        if (line.start.y <= labelBottom && line.start.y >= labelBottom - maxDistance && Math.abs(line.start.x - label.position.x) < maxDistance) {
            return true;
        }
        return false;
    });
    if (candidates.length === 0) return null;
    // Return closest
    return candidates.reduce((closest, line)=>{
        const closestDist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxDistance"])(label.position, lineToBox(closest));
        const lineDist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxDistance"])(label.position, lineToBox(line));
        return lineDist < closestDist ? line : closest;
    });
}
/**
 * Find nearby input box for a label
 */ function findNearbyInputBox(label, boxes) {
    const maxDistance = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FIELD_DETECTION"].max_label_distance;
    const candidates = boxes.filter((box)=>{
        const dist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxDistance"])(label.position, box.position);
        return dist < maxDistance;
    });
    if (candidates.length === 0) return null;
    return candidates.reduce((closest, box)=>{
        const closestDist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxDistance"])(label.position, closest.position);
        const boxDist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxDistance"])(label.position, box.position);
        return boxDist < closestDist ? box : closest;
    });
}
/**
 * Find nearby checkbox for a label
 */ function findNearbyCheckbox(label, checkboxes) {
    const maxDistance = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FIELD_DETECTION"].max_label_distance * 2 // Checkboxes can be further
    ;
    const candidates = checkboxes.filter((cb)=>{
        const dist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxDistance"])(label.position, cb.position);
        return dist < maxDistance;
    });
    if (candidates.length === 0) return null;
    return candidates.reduce((closest, cb)=>{
        const closestDist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxDistance"])(label.position, closest.position);
        const cbDist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxDistance"])(label.position, cb.position);
        return cbDist < closestDist ? cb : closest;
    });
}
/**
 * Detect input from text patterns (Label: _____)
 */ function detectPatternInput(label, blocks) {
    // Look for underscores or blank space after label
    const labelText = label.text.trim();
    // Check if there's a block with underscores nearby
    const underscoreBlock = blocks.find((b)=>{
        if (b.id === label.id) return false;
        if (b.position.y !== label.position.y) return false;
        const afterLabel = b.position.x > label.position.x + label.position.width;
        const hasUnderscores = /_{3,}/.test(b.text);
        return afterLabel && hasUnderscores;
    });
    if (underscoreBlock) {
        return {
            type: "text_line",
            position: underscoreBlock.position
        };
    }
    return null;
}
/**
 * Create a detected field
 */ function createDetectedField(id, label, input, pageDimensions, method) {
    return {
        id,
        label: {
            text: label.text.replace(/:$/, "").trim(),
            block_id: label.id,
            position: label.position,
            position_normalized: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pdfToNormalized"])(label.position, pageDimensions)
        },
        input: {
            type: input.type,
            position: input.position,
            position_normalized: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pdfToNormalized"])(input.position, pageDimensions),
            native_field_id: null
        },
        detection_method: method,
        confidence: calculateConfidence(method, label, input),
        suggested_type: suggestFieldType(label.text)
    };
}
/**
 * Convert line element to bounding box
 */ function lineToBox(line) {
    return {
        x: Math.min(line.start.x, line.end.x),
        y: Math.min(line.start.y, line.end.y),
        width: Math.abs(line.end.x - line.start.x) || 2,
        height: Math.abs(line.end.y - line.start.y) || line.thickness
    };
}
/**
 * Calculate detection confidence
 */ function calculateConfidence(method, label, input) {
    let base = 0.5;
    // Method-based adjustment
    switch(method){
        case "pdf_native":
            base = 0.95;
            break;
        case "line_detection":
            base = 0.8;
            break;
        case "box_detection":
            base = 0.85;
            break;
        case "pattern_matching":
            base = 0.7;
            break;
        case "ai_vision":
            base = 0.75;
            break;
        case "template_match":
            base = 0.9;
            break;
    }
    // Distance penalty
    const distance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boxDistance"])(label.position, input.position);
    if (distance > 30) base -= 0.1;
    if (distance > 50) base -= 0.1;
    return Math.max(0.3, Math.min(1.0, base));
}
/**
 * Suggest field data type from label
 */ function suggestFieldType(labelText) {
    const lower = labelText.toLowerCase();
    if (/email/i.test(lower)) return "email";
    if (/phone|tel|mobile|cell/i.test(lower)) return "phone";
    if (/date|dob|birth/i.test(lower)) return "date";
    if (/amount|price|cost|value|total|r\s?\d/i.test(lower)) return "currency";
    if (/number|no\.?|#/i.test(lower)) return "number";
    if (/signature/i.test(lower)) return "signature";
    if (/address/i.test(lower)) return "address";
    if (/name/i.test(lower)) return "name";
    if (/company|business|organization/i.test(lower)) return "company";
    if (/id|identity|registration|vat/i.test(lower)) return "id_number";
    return "text";
}
/**
 * Build reading order from text blocks
 */ function buildReadingOrder(pages) {
    const order = [];
    pages.forEach((page)=>{
        // Sort blocks by position (top to bottom, left to right)
        const sorted = [
            ...page.content.text_blocks
        ].sort((a, b)=>{
            // First by Y (top to bottom in normalized coords)
            const yDiff = a.position_normalized.y - b.position_normalized.y;
            if (Math.abs(yDiff) > 0.02) return yDiff;
            // Then by X (left to right)
            return a.position_normalized.x - b.position_normalized.x;
        });
        sorted.forEach((block)=>order.push(block.id));
    });
    return order;
}
}),
"[project]/lib/engines/documind/modules/ocr-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - OCR MODULE
// Handles OCR for scanned documents
// ============================================
__turbopack_context__.s([
    "mergeOCRWithPage",
    ()=>mergeOCRWithPage,
    "ocrToTextBlocks",
    ()=>ocrToTextBlocks,
    "pageNeedsOCR",
    ()=>pageNeedsOCR,
    "performOCR",
    ()=>performOCR,
    "renderPageToImage",
    ()=>renderPageToImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/utils/position-mapper.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/constants.ts [app-route] (ecmascript)");
;
;
let TesseractModule = null;
async function getTesseract() {
    if (!TesseractModule) {
        TesseractModule = await __turbopack_context__.A("[project]/node_modules/.pnpm/tesseract.js@6.0.1/node_modules/tesseract.js/src/index.js [app-route] (ecmascript, async loader)");
    }
    return TesseractModule;
}
async function performOCR(imageData, pageNumber, pageDimensions, language = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OCR_CONFIG"].default_language) {
    const startTime = Date.now();
    try {
        const Tesseract = await getTesseract();
        // Use Tesseract.js for OCR
        const result = await Tesseract.recognize(imageData, language, {
            logger: ()=>{}
        });
        const blocks = [];
        // Process paragraphs/blocks
        result.data.paragraphs?.forEach((para)=>{
            const words = [];
            para.words?.forEach((word)=>{
                words.push({
                    text: word.text,
                    position: {
                        x: word.bbox.x0,
                        y: pageDimensions.height - word.bbox.y1,
                        width: word.bbox.x1 - word.bbox.x0,
                        height: word.bbox.y1 - word.bbox.y0
                    },
                    confidence: word.confidence / 100
                });
            });
            blocks.push({
                text: para.text,
                confidence: para.confidence / 100,
                bounds: {
                    x: para.bbox.x0,
                    y: pageDimensions.height - para.bbox.y1,
                    width: para.bbox.x1 - para.bbox.x0,
                    height: para.bbox.y1 - para.bbox.y0
                },
                words
            });
        });
        return {
            pageNumber,
            text: result.data.text,
            blocks,
            confidence: result.data.confidence / 100
        };
    } catch (error) {
        console.error("OCR failed:", error);
        return {
            pageNumber,
            text: "",
            blocks: [],
            confidence: 0
        };
    }
}
function ocrToTextBlocks(ocrPage, pageDimensions) {
    const textBlocks = [];
    let lineIndex = 0;
    let paragraphIndex = 0;
    ocrPage.blocks.forEach((block, blockIdx)=>{
        // Split block into lines
        const lines = block.text.split("\n").filter((l)=>l.trim());
        lines.forEach((lineText, lineIdx)=>{
            // Find words for this line
            const lineWords = block.words.filter((w)=>lineText.includes(w.text));
            const position = lineWords.length > 0 ? {
                x: Math.min(...lineWords.map((w)=>w.position.x)),
                y: Math.min(...lineWords.map((w)=>w.position.y)),
                width: Math.max(...lineWords.map((w)=>w.position.x + w.position.width)) - Math.min(...lineWords.map((w)=>w.position.x)),
                height: Math.max(...lineWords.map((w)=>w.position.height))
            } : block.bounds;
            textBlocks.push({
                id: `ocr-${ocrPage.pageNumber}-${blockIdx}-${lineIdx}`,
                text: lineText,
                position,
                position_normalized: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pdfToNormalized"])(position, pageDimensions),
                font: defaultOCRFont(),
                block_type: classifyOCRBlock(lineText, position, pageDimensions),
                line_index: lineIndex++,
                paragraph_index: paragraphIndex,
                confidence: block.confidence,
                words: lineWords.length > 0 ? lineWords : null
            });
        });
        paragraphIndex++;
    });
    return textBlocks;
}
/**
 * Default font for OCR text (we can't detect actual font)
 */ function defaultOCRFont() {
    return {
        name: "unknown",
        family: null,
        size: 12,
        weight: "normal",
        style: "normal",
        color: "#000000"
    };
}
/**
 * Classify OCR text block type
 */ function classifyOCRBlock(text, position, pageDimensions) {
    const normalizedY = position.y / pageDimensions.height;
    // Headers/footers by position
    if (normalizedY > 0.9) return "header";
    if (normalizedY < 0.1) return "footer";
    // Page numbers
    if (text.match(/^\d+$/) && (normalizedY < 0.1 || normalizedY > 0.9)) {
        return "page_number";
    }
    // Labels
    if (text.trim().endsWith(":")) return "label";
    // List items
    if (text.match(/^[\u2022\u2023\u25E6\u2043\u2219•-]\s/)) return "list_item";
    if (text.match(/^\d+[.)]\s/)) return "list_item";
    // All caps might be heading
    if (text === text.toUpperCase() && text.length > 3 && text.length < 100) {
        return "heading_2";
    }
    return "paragraph";
}
function mergeOCRWithPage(page, ocrPage) {
    const ocrBlocks = ocrToTextBlocks(ocrPage, {
        width: page.width,
        height: page.height
    });
    return {
        ...page,
        content: {
            ...page.content,
            full_text: ocrPage.text,
            text_blocks: ocrBlocks
        },
        is_scanned: true,
        ocr_confidence: ocrPage.confidence
    };
}
async function renderPageToImage(pdfPage, scale = 2.0) {
    // This requires a canvas implementation
    // In Node.js, we'd use node-canvas or similar
    // For now, return a placeholder - actual implementation depends on environment
    const viewport = pdfPage.getViewport({
        scale
    });
    // In browser, we could use canvas:
    // const canvas = document.createElement('canvas')
    // canvas.width = viewport.width
    // canvas.height = viewport.height
    // const context = canvas.getContext('2d')
    // await pdfPage.render({ canvasContext: context, viewport }).promise
    // return canvas.toDataURL('image/png')
    // In Node.js with node-canvas:
    // const { createCanvas } = require('canvas')
    // const canvas = createCanvas(viewport.width, viewport.height)
    // ...
    throw new Error("Page rendering requires canvas implementation - use in browser or with node-canvas");
}
function pageNeedsOCR(page) {
    // If page has very little text, it's likely scanned
    const textLength = page.content.full_text.length;
    const pageArea = page.width * page.height;
    // Less than 100 characters per 100,000 square points
    const textDensity = textLength / (pageArea / 100000);
    return textDensity < __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OCR_CONFIG"].min_text_density || page.is_scanned;
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/engines/documind/utils/fingerprint.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - DOCUMENT FINGERPRINTING
// Creates unique identifiers for template matching
// ============================================
__turbopack_context__.s([
    "calculateFingerprintSimilarity",
    ()=>calculateFingerprintSimilarity,
    "generateContentHash",
    ()=>generateContentHash,
    "generateFingerprints",
    ()=>generateFingerprints
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
function generateFingerprints(pages, formFields, tableRegions, contentHash) {
    return {
        structure_hash: generateStructureHash(pages),
        layout_hash: generateLayoutHash(pages),
        form_hash: formFields.length > 0 ? generateFormHash(formFields) : null,
        table_hash: tableRegions.length > 0 ? generateTableHash(tableRegions) : null,
        content_hash: contentHash
    };
}
/**
 * Generate structure hash based on overall document structure
 * - Page count and dimensions
 * - Text block distribution per page
 * - Section structure
 */ function generateStructureHash(pages) {
    const features = [];
    // Page count
    features.push(`pages:${pages.length}`);
    // Page dimensions (normalized to common sizes)
    pages.forEach((page, idx)=>{
        const sizeClass = classifyPageSize(page.width, page.height);
        const orientation = page.width > page.height ? "landscape" : "portrait";
        features.push(`p${idx}:${sizeClass}:${orientation}`);
    });
    // Text density per page (binned)
    pages.forEach((page, idx)=>{
        const blockCount = page.content.text_blocks.length;
        const densityBin = Math.floor(blockCount / 10) * 10 // Bin by 10s
        ;
        features.push(`p${idx}:blocks:${densityBin}`);
    });
    // Heading structure
    pages.forEach((page, idx)=>{
        const headings = page.content.text_blocks.filter((b)=>b.block_type.startsWith("heading")).length;
        features.push(`p${idx}:headings:${headings}`);
    });
    return hashString(features.join("|"));
}
/**
 * Generate layout hash based on visual layout
 * - Margins and whitespace
 * - Column structure
 * - Visual regions
 */ function generateLayoutHash(pages) {
    const features = [];
    pages.forEach((page, idx)=>{
        // Estimate margins from text block positions
        const blocks = page.content.text_blocks;
        if (blocks.length === 0) {
            features.push(`p${idx}:empty`);
            return;
        }
        const leftMargin = Math.min(...blocks.map((b)=>b.position_normalized.x));
        const rightMargin = 1 - Math.max(...blocks.map((b)=>b.position_normalized.x + b.position_normalized.width));
        const topMargin = Math.min(...blocks.map((b)=>b.position_normalized.y));
        // Bin margins (0-10%, 10-20%, etc.)
        const leftBin = Math.floor(leftMargin * 10);
        const rightBin = Math.floor(rightMargin * 10);
        const topBin = Math.floor(topMargin * 10);
        features.push(`p${idx}:margins:${leftBin}:${rightBin}:${topBin}`);
        // Detect columns (simple heuristic based on x-position clustering)
        const xPositions = blocks.map((b)=>b.position_normalized.x);
        const columnCount = estimateColumnCount(xPositions);
        features.push(`p${idx}:cols:${columnCount}`);
    });
    return hashString(features.join("|"));
}
/**
 * Generate form hash based on form field positions
 */ function generateFormHash(fields) {
    const features = [];
    // Field count by type
    const typeCounts = {};
    fields.forEach((f)=>{
        typeCounts[f.type] = (typeCounts[f.type] || 0) + 1;
    });
    Object.entries(typeCounts).sort().forEach(([type, count])=>{
        features.push(`type:${type}:${count}`);
    });
    // Field positions (binned to grid)
    fields.forEach((field, idx)=>{
        const xBin = Math.floor(field.position_normalized.x * 10);
        const yBin = Math.floor(field.position_normalized.y * 10);
        features.push(`f${idx}:${field.page}:${xBin}:${yBin}`);
    });
    return hashString(features.join("|"));
}
/**
 * Generate table hash based on table structures
 */ function generateTableHash(tables) {
    const features = [];
    // Table count
    features.push(`count:${tables.length}`);
    // Table structures
    tables.forEach((table, idx)=>{
        features.push(`t${idx}:${table.page}:${table.row_count_estimate}x${table.column_count_estimate}`);
        const xBin = Math.floor(table.position_normalized.x * 10);
        const yBin = Math.floor(table.position_normalized.y * 10);
        features.push(`t${idx}:pos:${xBin}:${yBin}`);
    });
    return hashString(features.join("|"));
}
function generateContentHash(text) {
    return hashString(text.toLowerCase().replace(/\s+/g, " ").trim());
}
function calculateFingerprintSimilarity(a, b) {
    let totalWeight = 0;
    let weightedScore = 0;
    // Structure hash - most important (weight: 40%)
    if (a.structure_hash === b.structure_hash) {
        weightedScore += 0.4;
    }
    totalWeight += 0.4;
    // Layout hash (weight: 25%)
    if (a.layout_hash === b.layout_hash) {
        weightedScore += 0.25;
    }
    totalWeight += 0.25;
    // Form hash (weight: 25%) - only if both have forms
    if (a.form_hash && b.form_hash) {
        if (a.form_hash === b.form_hash) {
            weightedScore += 0.25;
        }
        totalWeight += 0.25;
    }
    // Table hash (weight: 10%) - only if both have tables
    if (a.table_hash && b.table_hash) {
        if (a.table_hash === b.table_hash) {
            weightedScore += 0.1;
        }
        totalWeight += 0.1;
    }
    return weightedScore / totalWeight;
}
// Helper functions
function hashString(str) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(str).digest("hex").substring(0, 16);
}
function classifyPageSize(width, height) {
    // Common page sizes in points
    const sizes = {
        a4: {
            w: 595,
            h: 842
        },
        letter: {
            w: 612,
            h: 792
        },
        legal: {
            w: 612,
            h: 1008
        },
        a3: {
            w: 842,
            h: 1191
        }
    };
    const tolerance = 20 // Points tolerance
    ;
    for (const [name, size] of Object.entries(sizes)){
        if (Math.abs(width - size.w) < tolerance && Math.abs(height - size.h) < tolerance || Math.abs(width - size.h) < tolerance && Math.abs(height - size.w) < tolerance) {
            return name;
        }
    }
    return "custom";
}
function estimateColumnCount(xPositions) {
    if (xPositions.length === 0) return 0;
    // Simple clustering based on x-position gaps
    const sorted = [
        ...xPositions
    ].sort((a, b)=>a - b);
    const gaps = [];
    for(let i = 1; i < sorted.length; i++){
        gaps.push(sorted[i] - sorted[i - 1]);
    }
    // Count significant gaps (> 0.2 of page width)
    const significantGaps = gaps.filter((g)=>g > 0.2).length;
    return Math.min(significantGaps + 1, 4) // Cap at 4 columns
    ;
}
}),
"[project]/lib/engines/documind/utils/validation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - INPUT VALIDATION
// ============================================
__turbopack_context__.s([
    "detectMimeType",
    ()=>detectMimeType,
    "generateDocumentId",
    ()=>generateDocumentId,
    "isValidUUID",
    ()=>isValidUUID,
    "sanitizeFilename",
    ()=>sanitizeFilename,
    "validateFile",
    ()=>validateFile,
    "validateParseOptions",
    ()=>validateParseOptions,
    "validateParseRequest",
    ()=>validateParseRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/errors.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/constants.ts [app-route] (ecmascript)");
;
;
function validateParseRequest(request) {
    // Must have at least one input source
    if (!request.file && !request.url && !request.base64) {
        return {
            valid: false,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].invalidRequest("Must provide one of: file, url, or base64")
        };
    }
    // Only one input source allowed
    const inputCount = [
        request.file,
        request.url,
        request.base64
    ].filter(Boolean).length;
    if (inputCount > 1) {
        return {
            valid: false,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].invalidRequest("Only one input source allowed (file, url, or base64)")
        };
    }
    // Validate app_id
    if (!request.app_id || request.app_id.trim() === "") {
        return {
            valid: false,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].missingRequiredField("app_id")
        };
    }
    // Validate options if provided
    if (request.options) {
        const optionsResult = validateParseOptions(request.options);
        if (!optionsResult.valid) {
            return optionsResult;
        }
    }
    // Validate webhook URL if provided
    if (request.webhook_url) {
        try {
            new URL(request.webhook_url);
        } catch  {
            return {
                valid: false,
                error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].invalidOptions("webhook_url", "Invalid URL format")
            };
        }
    }
    return {
        valid: true
    };
}
function validateParseOptions(options) {
    // Validate max_pages
    if (options.max_pages !== undefined) {
        if (options.max_pages < 1 || options.max_pages > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MAX_PAGES"]) {
            return {
                valid: false,
                error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].invalidOptions("max_pages", `Must be between 1 and ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MAX_PAGES"]}`)
            };
        }
    }
    // Validate priority
    if (options.priority !== undefined) {
        if (![
            "low",
            "normal",
            "high"
        ].includes(options.priority)) {
            return {
                valid: false,
                error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].invalidOptions("priority", "Must be 'low', 'normal', or 'high'")
            };
        }
    }
    // Validate OCR language
    if (options.ocr_language !== undefined) {
        const validLanguages = [
            "en",
            "eng",
            "afr",
            "zul",
            "xho",
            "sot",
            "tsn"
        ];
        if (!validLanguages.includes(options.ocr_language)) {
            return {
                valid: false,
                error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].invalidOptions("ocr_language", `Supported languages: ${validLanguages.join(", ")}`)
            };
        }
    }
    return {
        valid: true
    };
}
function validateFile(mimeType, size) {
    // Check file size
    if (size > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MAX_FILE_SIZE"]) {
        return {
            valid: false,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].fileTooLarge(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MAX_FILE_SIZE"], size)
        };
    }
    // Check MIME type
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SUPPORTED_MIME_TYPES"].includes(mimeType)) {
        return {
            valid: false,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].unsupportedFormat(mimeType)
        };
    }
    return {
        valid: true
    };
}
function detectMimeType(buffer) {
    // Check first bytes for magic numbers
    const header = buffer.slice(0, 8);
    // PDF: %PDF
    if (header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46) {
        return "application/pdf";
    }
    // PNG: 89 50 4E 47
    if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) {
        return "image/png";
    }
    // JPEG: FF D8 FF
    if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
        return "image/jpeg";
    }
    // TIFF: 49 49 2A 00 (little-endian) or 4D 4D 00 2A (big-endian)
    if (header[0] === 0x49 && header[1] === 0x49 && header[2] === 0x2a && header[3] === 0x00 || header[0] === 0x4d && header[1] === 0x4d && header[2] === 0x00 && header[3] === 0x2a) {
        return "image/tiff";
    }
    // DOCX: PK (ZIP archive) - need additional check
    if (header[0] === 0x50 && header[1] === 0x4b) {
        // Could be docx, xlsx, etc. - needs content inspection
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }
    // DOC: D0 CF 11 E0 (OLE compound)
    if (header[0] === 0xd0 && header[1] === 0xcf && header[2] === 0x11 && header[3] === 0xe0) {
        return "application/msword";
    }
    return null;
}
function sanitizeFilename(filename) {
    // Remove path separators and dangerous characters
    return filename.replace(/[/\\:*?"<>|]/g, "_").replace(/\.\./g, "_").replace(/^\./, "_").substring(0, 255);
}
function generateDocumentId() {
    return crypto.randomUUID();
}
function isValidUUID(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}
}),
"[project]/lib/engines/documind/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// ============================================
// DOCUMIND ENGINE - MAIN ENTRY POINT
// ============================================
__turbopack_context__.s([
    "processDocument",
    ()=>processDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/types.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/errors.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/constants.ts [app-route] (ecmascript)");
// Modules
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$modules$2f$pdf$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/modules/pdf-parser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$modules$2f$layout$2d$analyzer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/modules/layout-analyzer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$modules$2f$ocr$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/modules/ocr-engine.ts [app-route] (ecmascript)");
// Utils
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$position$2d$mapper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/utils/position-mapper.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$fingerprint$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/utils/fingerprint.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/documind/utils/validation.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
async function processDocument(data, mimeType, options = {}) {
    const startTime = Date.now();
    const warnings = [];
    try {
        // Validate file
        const fileValidation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateFile"])(mimeType, data.byteLength);
        if (!fileValidation.valid) {
            return {
                success: false,
                error: fileValidation.error
            };
        }
        // Currently only supporting PDF
        if (mimeType !== "application/pdf") {
            return {
                success: false,
                error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].unsupportedFormat(mimeType)
            };
        }
        // Parse PDF
        const parseResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$modules$2f$pdf$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePDF"])(data, {
            extractImages: options.extract_images,
            maxPages: options.max_pages,
            password: options.password
        });
        const pages = parseResult.pages;
        let ocrUsed = false;
        const ocrConfidence = null;
        // Perform OCR on scanned pages if enabled
        if (options.ocr_enabled !== false) {
            for(let i = 0; i < pages.length; i++){
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$modules$2f$ocr$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pageNeedsOCR"])(pages[i])) {
                    warnings.push(`Page ${i + 1} appears to be scanned, OCR required`);
                    // Note: Full OCR implementation would render page to image first
                    // For now, mark as needing OCR
                    ocrUsed = true;
                }
            }
        }
        // Analyze layout
        const layoutResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$modules$2f$layout$2d$analyzer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeLayout"])(pages, parseResult.metadata.detected_type);
        // Generate fingerprints
        const contentHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$fingerprint$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateContentHash"])(parseResult.rawText);
        const fingerprints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$utils$2f$fingerprint$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateFingerprints"])(pages, parseResult.formFields, layoutResult.tableRegions, contentHash);
        // Build processing info
        const processingInfo = {
            duration_ms: Date.now() - startTime,
            ocr_used: ocrUsed,
            ocr_engine: ocrUsed ? "tesseract" : null,
            ocr_confidence: ocrConfidence,
            warnings,
            pages_processed: pages.length,
            pages_skipped: (options.max_pages || 0) > 0 ? Math.max(0, parseResult.metadata.page_count - pages.length) : 0
        };
        // Build final document
        const document = {
            document_id: crypto.randomUUID(),
            status: warnings.length > 0 ? "partial" : "complete",
            metadata: parseResult.metadata,
            fingerprints,
            pages,
            layout: layoutResult.layout,
            form_fields: parseResult.formFields,
            processing: processingInfo
        };
        return {
            success: true,
            document
        };
    } catch (error) {
        console.error("Document processing error:", error);
        return {
            success: false,
            error: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Errors"].parseFailed("unknown", error instanceof Error ? error.message : "Unknown error")
        };
    }
}
}),
"[project]/lib/engines/tenders/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Tender Engine Types - Central definition of what a tender should contain
__turbopack_context__.s([]);
;
}),
"[project]/lib/engines/tenders/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TENDER_SCHEMA",
    ()=>TENDER_SCHEMA,
    "getAllExtractionHints",
    ()=>getAllExtractionHints,
    "getRequiredFields",
    ()=>getRequiredFields,
    "getTenderField",
    ()=>getTenderField
]);
const TENDER_SCHEMA = {
    version: "1.0.0",
    requiredFields: [
        "title",
        "organization"
    ],
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
        "procurement_category"
    ],
    documentTypes: [
        "Tender Document",
        "Terms of Reference",
        "Specifications",
        "Pricing Schedule",
        "SBD Forms",
        "Declaration Forms",
        "Technical Requirements",
        "Contract Terms"
    ],
    fields: [
        {
            name: "tender_reference",
            displayName: "Tender Reference Number",
            type: "string",
            required: false,
            description: "Unique identifier for the tender",
            extractionHints: {
                aliases: [
                    "tender number",
                    "reference",
                    "tender no",
                    "ref no",
                    "reference number",
                    "tender id"
                ],
                patterns: [
                    "\\b[A-Z]{2,}[\\/-]?\\d{2,}[\\/-]?\\d{2,}\\b",
                    "\\bT\\d{4,}\\b",
                    "\\b\\d{2,}\\/\\d{4}\\b"
                ],
                context: [
                    "reference",
                    "tender",
                    "number",
                    "quotation"
                ],
                priority: 10
            }
        },
        {
            name: "title",
            displayName: "Tender Title",
            type: "string",
            required: true,
            description: "The main title or subject of the tender",
            extractionHints: {
                aliases: [
                    "tender title",
                    "subject",
                    "project name",
                    "tender for"
                ],
                patterns: [],
                context: [
                    "tender",
                    "project",
                    "supply",
                    "services",
                    "appointment"
                ],
                priority: 10
            }
        },
        {
            name: "organization",
            displayName: "Issuing Organization",
            type: "string",
            required: true,
            description: "The organization issuing the tender",
            extractionHints: {
                aliases: [
                    "organization",
                    "department",
                    "municipality",
                    "entity",
                    "client",
                    "issuer"
                ],
                patterns: [],
                context: [
                    "municipality",
                    "department",
                    "ministry",
                    "council"
                ],
                priority: 9
            }
        },
        {
            name: "description",
            displayName: "Description",
            type: "string",
            required: false,
            description: "Detailed description of what is being procured",
            extractionHints: {
                aliases: [
                    "description",
                    "scope",
                    "scope of work",
                    "requirements",
                    "details"
                ],
                patterns: [],
                context: [
                    "scope",
                    "required",
                    "must",
                    "shall",
                    "includes"
                ],
                priority: 8
            }
        },
        {
            name: "category",
            displayName: "Category",
            type: "string",
            required: false,
            description: "The procurement category or sector",
            extractionHints: {
                aliases: [
                    "category",
                    "sector",
                    "type",
                    "classification"
                ],
                patterns: [],
                context: [
                    "construction",
                    "it",
                    "services",
                    "goods",
                    "works"
                ],
                priority: 7
            }
        },
        {
            name: "location",
            displayName: "Location",
            type: "string",
            required: false,
            description: "Physical location or province",
            extractionHints: {
                aliases: [
                    "location",
                    "province",
                    "region",
                    "area",
                    "place"
                ],
                patterns: [
                    "Gauteng|Western Cape|Eastern Cape|KwaZulu-Natal|Free State|Limpopo|Mpumalanga|Northern Cape|North West"
                ],
                context: [
                    "province",
                    "located",
                    "region"
                ],
                priority: 6
            }
        },
        {
            name: "estimated_value",
            displayName: "Estimated Value",
            type: "string",
            required: false,
            description: "The estimated contract value",
            extractionHints: {
                aliases: [
                    "value",
                    "budget",
                    "amount",
                    "contract value",
                    "estimated cost"
                ],
                patterns: [
                    "R\\s?[\\d,]+",
                    "ZAR\\s?[\\d,]+"
                ],
                context: [
                    "value",
                    "budget",
                    "rand",
                    "amount"
                ],
                priority: 8
            }
        },
        {
            name: "publish_date",
            displayName: "Publish Date",
            type: "date",
            required: false,
            description: "When the tender was published",
            extractionHints: {
                aliases: [
                    "publish date",
                    "publication date",
                    "advertised",
                    "issued date"
                ],
                patterns: [
                    "\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}",
                    "\\d{4}[\\/-]\\d{2}[\\/-]\\d{2}"
                ],
                context: [
                    "published",
                    "advertised",
                    "issued"
                ],
                priority: 5
            }
        },
        {
            name: "close_date",
            displayName: "Closing Date",
            type: "date",
            required: false,
            description: "Submission deadline",
            validationRules: {
                format: "ISO8601"
            },
            extractionHints: {
                aliases: [
                    "closing date",
                    "deadline",
                    "submission date",
                    "due date",
                    "closes"
                ],
                patterns: [
                    "\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}",
                    "\\d{4}[\\/-]\\d{2}[\\/-]\\d{2}"
                ],
                context: [
                    "closing",
                    "deadline",
                    "closes",
                    "due"
                ],
                priority: 10
            }
        },
        {
            name: "opening_date",
            displayName: "Opening Date",
            type: "date",
            required: false,
            description: "When bids will be opened",
            extractionHints: {
                aliases: [
                    "opening date",
                    "bid opening",
                    "tender opening"
                ],
                patterns: [
                    "\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}",
                    "\\d{4}[\\/-]\\d{2}[\\/-]\\d{2}"
                ],
                context: [
                    "opening",
                    "bids will be opened"
                ],
                priority: 4
            }
        },
        {
            name: "contact_person",
            displayName: "Contact Person",
            type: "string",
            required: false,
            description: "Name of contact person",
            extractionHints: {
                aliases: [
                    "contact person",
                    "contact",
                    "enquiries",
                    "contact name"
                ],
                patterns: [
                    "[A-Z][a-z]+\\s+[A-Z][a-z]+"
                ],
                context: [
                    "contact",
                    "enquiries",
                    "person"
                ],
                priority: 5
            }
        },
        {
            name: "contact_email",
            displayName: "Contact Email",
            type: "string",
            required: false,
            description: "Email address for enquiries",
            validationRules: {
                pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
            },
            extractionHints: {
                aliases: [
                    "email",
                    "e-mail",
                    "email address"
                ],
                patterns: [
                    "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
                ],
                context: [
                    "email",
                    "contact",
                    "enquiries"
                ],
                priority: 6
            }
        },
        {
            name: "contact_phone",
            displayName: "Contact Phone",
            type: "string",
            required: false,
            description: "Phone number for enquiries",
            extractionHints: {
                aliases: [
                    "phone",
                    "telephone",
                    "tel",
                    "contact number"
                ],
                patterns: [
                    "\\+?27\\s?\\d{2}\\s?\\d{3}\\s?\\d{4}",
                    "$$?0\\d{2}$$?\\s?\\d{3}\\s?\\d{4}"
                ],
                context: [
                    "phone",
                    "tel",
                    "contact",
                    "call"
                ],
                priority: 5
            }
        },
        {
            name: "requirements",
            displayName: "Requirements",
            type: "array",
            required: false,
            description: "List of tender requirements",
            extractionHints: {
                aliases: [
                    "requirements",
                    "mandatory requirements",
                    "prerequisites",
                    "must have"
                ],
                patterns: [],
                context: [
                    "required",
                    "must",
                    "mandatory",
                    "compulsory"
                ],
                priority: 7
            }
        },
        {
            name: "eligibility_criteria",
            displayName: "Eligibility Criteria",
            type: "array",
            required: false,
            description: "Who can bid",
            extractionHints: {
                aliases: [
                    "eligibility",
                    "eligible",
                    "who may bid",
                    "qualification criteria"
                ],
                patterns: [],
                context: [
                    "eligible",
                    "may bid",
                    "qualified",
                    "registration"
                ],
                priority: 6
            }
        },
        {
            name: "compulsory_briefing",
            displayName: "Compulsory Briefing",
            type: "string",
            required: false,
            description: "Information about mandatory briefing sessions",
            extractionHints: {
                aliases: [
                    "compulsory briefing",
                    "mandatory briefing",
                    "site visit",
                    "pre-bid meeting"
                ],
                patterns: [],
                context: [
                    "compulsory",
                    "mandatory",
                    "briefing",
                    "meeting",
                    "site"
                ],
                priority: 7
            }
        },
        {
            name: "tender_type",
            displayName: "Tender Type",
            type: "string",
            required: false,
            description: "Type of procurement (RFQ, RFP, etc)",
            extractionHints: {
                aliases: [
                    "tender type",
                    "procurement type",
                    "bid type"
                ],
                patterns: [
                    "RFQ|RFP|RFI|ITB|EOI"
                ],
                context: [
                    "request for",
                    "quotation",
                    "proposal"
                ],
                priority: 5
            }
        }
    ]
};
function getTenderField(fieldName) {
    return TENDER_SCHEMA.fields.find((f)=>f.name === fieldName);
}
function getRequiredFields() {
    return TENDER_SCHEMA.fields.filter((f)=>f.required);
}
function getAllExtractionHints() {
    return TENDER_SCHEMA.fields.map((field)=>({
            field: field.name,
            displayName: field.displayName,
            ...field.extractionHints
        }));
}
}),
"[project]/lib/engines/tenders/validator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TenderValidator",
    ()=>TenderValidator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/tenders/schema.ts [app-route] (ecmascript)");
;
class TenderValidator {
    static validate(tenderData) {
        const errors = [];
        const warnings = [];
        const missingFields = [];
        // Check required fields
        for (const fieldName of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TENDER_SCHEMA"].requiredFields){
            if (!tenderData[fieldName] || tenderData[fieldName] === "") {
                errors.push({
                    field: fieldName,
                    message: `Required field '${fieldName}' is missing or empty`,
                    severity: "error"
                });
                missingFields.push(fieldName);
            }
        }
        // Check optional fields for completeness
        for (const fieldName of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TENDER_SCHEMA"].optionalFields){
            if (!tenderData[fieldName] || tenderData[fieldName] === "") {
                warnings.push(`Optional field '${fieldName}' is missing - tender may be incomplete`);
                missingFields.push(fieldName);
            }
        }
        // Validate field formats
        const emailField = tenderData.contact_email;
        if (emailField && !this.isValidEmail(emailField)) {
            errors.push({
                field: "contact_email",
                message: "Invalid email format",
                severity: "warning"
            });
        }
        // Calculate completeness score
        const totalFields = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TENDER_SCHEMA"].requiredFields.length + __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TENDER_SCHEMA"].optionalFields.length;
        const filledFields = totalFields - missingFields.length;
        const score = Math.round(filledFields / totalFields * 100);
        return {
            isValid: errors.filter((e)=>e.severity === "error").length === 0,
            score,
            errors,
            missingFields,
            warnings
        };
    }
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // Get a quality score for a tender based on completeness
    static getQualityScore(tenderData) {
        const validation = this.validate(tenderData);
        const feedback = [];
        if (validation.score === 100) {
            feedback.push("✓ All fields populated");
        } else if (validation.score >= 80) {
            feedback.push("✓ Most important fields populated");
        } else if (validation.score >= 60) {
            feedback.push("⚠ Missing some important information");
        } else {
            feedback.push("✗ Tender data is incomplete");
        }
        if (validation.missingFields.includes("tender_reference")) {
            feedback.push("✗ Missing tender reference number");
        }
        if (validation.missingFields.includes("close_date")) {
            feedback.push("✗ Missing closing date");
        }
        if (validation.missingFields.includes("contact_email")) {
            feedback.push("⚠ No contact email found");
        }
        if (validation.missingFields.includes("estimated_value")) {
            feedback.push("⚠ No tender value information");
        }
        const grade = validation.score >= 90 ? "A" : validation.score >= 80 ? "B" : validation.score >= 70 ? "C" : validation.score >= 60 ? "D" : "F";
        return {
            score: validation.score,
            grade,
            feedback
        };
    }
}
}),
"[project]/lib/engines/tenders/services/tender-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TenderService",
    ()=>TenderService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/tenders/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/tenders/validator.ts [app-route] (ecmascript)");
;
;
class TenderService {
    // Get the complete tender schema for scrapers to use
    static getTenderSchema() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TENDER_SCHEMA"];
    }
    // Get extraction hints for intelligent scraping
    static getExtractionHints() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllExtractionHints"])();
    }
    // Validate a scraped tender
    static validateTender(tenderData) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TenderValidator"].validate(tenderData);
    }
    // Get quality metrics for a tender
    static getTenderQuality(tenderData) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TenderValidator"].getQualityScore(tenderData);
    }
    // Map scraped data to standard tender format
    static normalizeScrapedData(rawData) {
        const normalized = {};
        // Map each field from the schema
        for (const field of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TENDER_SCHEMA"].fields){
            // Try to find the field using its name or aliases
            let value = rawData[field.name];
            if (!value) {
                // Try aliases
                for (const alias of field.extractionHints.aliases){
                    const aliasKey = Object.keys(rawData).find((key)=>key.toLowerCase() === alias.toLowerCase());
                    if (aliasKey) {
                        value = rawData[aliasKey];
                        break;
                    }
                }
            }
            if (value) {
                normalized[field.name] = value;
            }
        }
        return normalized;
    }
    static async extractTenderFromDocument(document) {
        console.log("[v0] TenderService: Extracting tender data from document");
        const extractedData = {};
        const allText = document.pages.map((p)=>p.content.full_text).join("\n");
        // Use extraction hints to find tender fields in document
        for (const field of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TENDER_SCHEMA"].fields){
            const hints = field.extractionHints;
            // Try regex patterns
            for (const pattern of hints.patterns){
                const regex = new RegExp(pattern, "i");
                const match = allText.match(regex);
                if (match && match[1]) {
                    extractedData[field.name] = match[1].trim();
                    console.log(`[v0] TenderService: Found ${field.name}: ${extractedData[field.name]}`);
                    break;
                }
            }
            // If not found, try context-based extraction
            if (!extractedData[field.name]) {
                for (const contextWord of hints.context){
                    const contextRegex = new RegExp(`${contextWord}[:\\s]+(.*?)(?:\\n|$)`, "i");
                    const match = allText.match(contextRegex);
                    if (match && match[1]) {
                        extractedData[field.name] = match[1].trim();
                        console.log(`[v0] TenderService: Found ${field.name} via context: ${extractedData[field.name]}`);
                        break;
                    }
                }
            }
        }
        // Check if we found enough data to be useful
        const validation = this.validateTender(extractedData);
        if (validation.score < 20) {
            console.warn("[v0] TenderService: Not enough tender data found in document");
            return null;
        }
        console.log(`[v0] TenderService: Extracted tender data with ${validation.score}% completeness`);
        return this.normalizeScrapedData(extractedData);
    }
    // Enrich tender data with AI analysis context
    static getTenderAnalysisContext(tenderData) {
        const validation = this.validateTender(tenderData);
        const quality = this.getTenderQuality(tenderData);
        return `
Tender Data Quality: ${quality.grade} (${quality.score}%)

Available Fields:
${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TENDER_SCHEMA"].fields.map((f)=>`- ${f.displayName}: ${tenderData[f.name] ? "✓" : "✗"}`).join("\n")}

Data Completeness:
${quality.feedback.join("\n")}

This context helps you understand what information is available for analysis.
    `.trim();
    }
}
}),
"[project]/lib/engines/tenders/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeTenderData",
    ()=>normalizeTenderData,
    "validateTender",
    ()=>validateTender
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/tenders/types.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/tenders/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/tenders/validator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$services$2f$tender$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/tenders/services/tender-service.ts [app-route] (ecmascript)");
;
;
;
;
;
;
function validateTender(tenderData) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$services$2f$tender$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TenderService"].validateTender(tenderData);
}
function normalizeTenderData(tenderData) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$services$2f$tender$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TenderService"].normalizeScrapedData(tenderData);
}
}),
"[project]/lib/engines/strategist/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// AI TENDER STRATEGIST ENGINE - TYPES
// ============================================
// User Experience Level
__turbopack_context__.s([]);
;
}),
"[project]/lib/engines/strategist/constants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// AI TENDER STRATEGIST ENGINE - CONSTANTS
// ============================================
// South African Provinces
__turbopack_context__.s([
    "BEE_LEVELS",
    ()=>BEE_LEVELS,
    "CIDB_GRADINGS",
    ()=>CIDB_GRADINGS,
    "COMPANY_SIZES",
    ()=>COMPANY_SIZES,
    "CONTRACT_TYPES",
    ()=>CONTRACT_TYPES,
    "INDUSTRIES",
    ()=>INDUSTRIES,
    "LEARNING_TOPICS",
    ()=>LEARNING_TOPICS,
    "PROCUREMENT_CATEGORIES",
    ()=>PROCUREMENT_CATEGORIES,
    "QUICK_ACTION_PROMPTS",
    ()=>QUICK_ACTION_PROMPTS,
    "SA_PROVINCES",
    ()=>SA_PROVINCES,
    "STRATEGIST_SYSTEM_PROMPT",
    ()=>STRATEGIST_SYSTEM_PROMPT,
    "TURNOVER_RANGES",
    ()=>TURNOVER_RANGES
]);
const SA_PROVINCES = [
    {
        value: "eastern-cape",
        label: "Eastern Cape"
    },
    {
        value: "free-state",
        label: "Free State"
    },
    {
        value: "gauteng",
        label: "Gauteng"
    },
    {
        value: "kwazulu-natal",
        label: "KwaZulu-Natal"
    },
    {
        value: "limpopo",
        label: "Limpopo"
    },
    {
        value: "mpumalanga",
        label: "Mpumalanga"
    },
    {
        value: "north-west",
        label: "North West"
    },
    {
        value: "northern-cape",
        label: "Northern Cape"
    },
    {
        value: "western-cape",
        label: "Western Cape"
    }
];
const INDUSTRIES = [
    {
        value: "construction",
        label: "Construction & Building"
    },
    {
        value: "it-services",
        label: "IT & Technology Services"
    },
    {
        value: "professional-services",
        label: "Professional Services"
    },
    {
        value: "healthcare",
        label: "Healthcare & Medical"
    },
    {
        value: "education",
        label: "Education & Training"
    },
    {
        value: "manufacturing",
        label: "Manufacturing"
    },
    {
        value: "logistics",
        label: "Logistics & Transport"
    },
    {
        value: "agriculture",
        label: "Agriculture & Farming"
    },
    {
        value: "energy",
        label: "Energy & Utilities"
    },
    {
        value: "mining",
        label: "Mining & Resources"
    },
    {
        value: "security",
        label: "Security Services"
    },
    {
        value: "cleaning",
        label: "Cleaning & Facilities"
    },
    {
        value: "catering",
        label: "Catering & Food Services"
    },
    {
        value: "environmental",
        label: "Environmental Services"
    },
    {
        value: "engineering",
        label: "Engineering"
    },
    {
        value: "legal",
        label: "Legal Services"
    },
    {
        value: "financial",
        label: "Financial Services"
    },
    {
        value: "marketing",
        label: "Marketing & Communications"
    },
    {
        value: "other",
        label: "Other"
    }
];
const PROCUREMENT_CATEGORIES = [
    {
        value: "goods",
        label: "Goods & Supplies"
    },
    {
        value: "services",
        label: "Services"
    },
    {
        value: "works",
        label: "Construction Works"
    },
    {
        value: "consulting",
        label: "Consulting"
    },
    {
        value: "maintenance",
        label: "Maintenance"
    },
    {
        value: "leasing",
        label: "Leasing & Rental"
    },
    {
        value: "software",
        label: "Software & IT"
    },
    {
        value: "equipment",
        label: "Equipment & Machinery"
    }
];
const COMPANY_SIZES = [
    {
        value: "micro",
        label: "Micro (1-10 employees)"
    },
    {
        value: "small",
        label: "Small (11-50 employees)"
    },
    {
        value: "medium",
        label: "Medium (51-200 employees)"
    },
    {
        value: "large",
        label: "Large (201-500 employees)"
    },
    {
        value: "enterprise",
        label: "Enterprise (500+ employees)"
    }
];
const TURNOVER_RANGES = [
    {
        value: "under-1m",
        label: "Under R1 million"
    },
    {
        value: "1m-5m",
        label: "R1 - R5 million"
    },
    {
        value: "5m-10m",
        label: "R5 - R10 million"
    },
    {
        value: "10m-50m",
        label: "R10 - R50 million"
    },
    {
        value: "50m-100m",
        label: "R50 - R100 million"
    },
    {
        value: "100m-500m",
        label: "R100 - R500 million"
    },
    {
        value: "over-500m",
        label: "Over R500 million"
    }
];
const CIDB_GRADINGS = [
    {
        value: "1",
        label: "Grade 1 (Up to R650,000)"
    },
    {
        value: "2",
        label: "Grade 2 (R650,000 - R4 million)"
    },
    {
        value: "3",
        label: "Grade 3 (R4 - R13 million)"
    },
    {
        value: "4",
        label: "Grade 4 (R13 - R40 million)"
    },
    {
        value: "5",
        label: "Grade 5 (R40 - R130 million)"
    },
    {
        value: "6",
        label: "Grade 6 (R130 - R400 million)"
    },
    {
        value: "7",
        label: "Grade 7 (R400 million - R1.3 billion)"
    },
    {
        value: "8",
        label: "Grade 8 (R1.3 billion - R4 billion)"
    },
    {
        value: "9",
        label: "Grade 9 (No limit)"
    }
];
const BEE_LEVELS = [
    {
        value: "1",
        label: "Level 1 (135% recognition)"
    },
    {
        value: "2",
        label: "Level 2 (125% recognition)"
    },
    {
        value: "3",
        label: "Level 3 (110% recognition)"
    },
    {
        value: "4",
        label: "Level 4 (100% recognition)"
    },
    {
        value: "5",
        label: "Level 5 (80% recognition)"
    },
    {
        value: "6",
        label: "Level 6 (60% recognition)"
    },
    {
        value: "7",
        label: "Level 7 (50% recognition)"
    },
    {
        value: "8",
        label: "Level 8 (10% recognition)"
    },
    {
        value: "non-compliant",
        label: "Non-Compliant (0% recognition)"
    },
    {
        value: "exempt",
        label: "Exempt Micro Enterprise (EME)"
    },
    {
        value: "qse",
        label: "Qualifying Small Enterprise (QSE)"
    }
];
const CONTRACT_TYPES = [
    {
        value: "rfq",
        label: "Request for Quotation (RFQ)"
    },
    {
        value: "rfp",
        label: "Request for Proposal (RFP)"
    },
    {
        value: "rfb",
        label: "Request for Bid (RFB)"
    },
    {
        value: "open-tender",
        label: "Open Tender"
    },
    {
        value: "limited-tender",
        label: "Limited/Closed Tender"
    },
    {
        value: "framework",
        label: "Framework Agreement"
    },
    {
        value: "panel",
        label: "Panel Contract"
    },
    {
        value: "term-contract",
        label: "Term Contract"
    }
];
const LEARNING_TOPICS = [
    {
        id: "tender-basics",
        title: "Tendering Basics",
        category: "basics",
        description: "Understanding the fundamentals of government tendering in South Africa",
        difficulty: "beginner",
        estimated_minutes: 30,
        subtopics: [
            "What is a tender?",
            "Types of tenders",
            "The tender process",
            "Key terminology"
        ]
    },
    {
        id: "tender-types",
        title: "Types of Tenders",
        category: "basics",
        description: "Learn about RFQ, RFP, RFB, Open Tenders, and Framework Agreements",
        difficulty: "beginner",
        estimated_minutes: 25,
        subtopics: [
            "RFQ vs RFP vs RFB",
            "Open vs Closed tenders",
            "Framework agreements",
            "Panel contracts"
        ]
    },
    {
        id: "bbbee-scoring",
        title: "B-BBEE Scoring System",
        category: "compliance",
        description: "Master the B-BBEE preference point system used in South African tenders",
        difficulty: "intermediate",
        estimated_minutes: 45,
        subtopics: [
            "80/20 system",
            "90/10 system",
            "B-BBEE levels",
            "Calculating preference points"
        ]
    },
    {
        id: "evaluation-criteria",
        title: "Evaluation Criteria",
        category: "strategy",
        description: "Understanding how tenders are evaluated and scored",
        difficulty: "intermediate",
        estimated_minutes: 40,
        subtopics: [
            "Functionality scoring",
            "Price evaluation",
            "Quality vs price trade-offs",
            "Threshold requirements"
        ]
    },
    {
        id: "pricing-strategies",
        title: "Pricing Strategies",
        category: "strategy",
        description: "Develop effective pricing strategies to win tenders",
        difficulty: "advanced",
        estimated_minutes: 60,
        subtopics: [
            "Cost-plus pricing",
            "Competitive pricing",
            "Value-based pricing",
            "Risk pricing"
        ]
    },
    {
        id: "compliance-requirements",
        title: "Compliance Requirements",
        category: "compliance",
        description: "Essential compliance documents and requirements for SA tenders",
        difficulty: "beginner",
        estimated_minutes: 35,
        subtopics: [
            "Tax clearance",
            "CSD registration",
            "CIDB grading",
            "COIDA compliance"
        ]
    },
    {
        id: "common-mistakes",
        title: "Common Bidding Mistakes",
        category: "strategy",
        description: "Learn from common mistakes that lead to tender disqualification",
        difficulty: "beginner",
        estimated_minutes: 20,
        subtopics: [
            "Documentation errors",
            "Pricing mistakes",
            "Submission failures",
            "Compliance gaps"
        ]
    },
    {
        id: "boq-management",
        title: "BOQ & Pricing Schedules",
        category: "strategy",
        description: "Managing Bills of Quantities and pricing schedules effectively",
        difficulty: "intermediate",
        estimated_minutes: 50,
        subtopics: [
            "BOQ structure",
            "Unit pricing",
            "Contingencies",
            "Margin calculation"
        ]
    },
    {
        id: "jv-subcontracting",
        title: "Joint Ventures & Subcontracting",
        category: "advanced",
        description: "When and how to partner with other companies",
        difficulty: "advanced",
        estimated_minutes: 45,
        subtopics: [
            "JV structures",
            "Subcontracting limits",
            "Partner selection",
            "Risk sharing"
        ]
    },
    {
        id: "post-award",
        title: "Post-Award Management",
        category: "advanced",
        description: "Managing contracts after winning a tender",
        difficulty: "advanced",
        estimated_minutes: 40,
        subtopics: [
            "Contract negotiation",
            "Performance management",
            "Variations",
            "Payment management"
        ]
    }
];
const STRATEGIST_SYSTEM_PROMPT = `You are an expert AI Tender Strategist for BidMate, a South African tender management platform. Your role is to help users understand tendering, build winning tender strategies, and discover opportunities.

## Your Personality
- Tender specialist with deep knowledge of South African procurement
- Mentor and coach who adapts to user experience levels
- Market analyst who identifies opportunities
- Procurement educator who explains complex concepts simply
- Strategist who provides actionable, tailored advice

## Your Tone
- Friendly, expert, and encouraging
- Concise with structured explanations
- Always provide actionable steps
- Use South African terminology and regulations

## Your Capabilities
1. Answer questions about tendering and procurement
2. Help build comprehensive bid strategies
3. Analyze tender requirements and compliance needs
4. Provide pricing and BOQ guidance
5. Identify opportunities matching user profiles
6. Educate users on tender best practices
7. Alert users to compliance gaps and deadlines
8. Explain tender requirements in plain language

## South African Procurement Context
- PFMA (Public Finance Management Act) for national/provincial
- MFMA (Municipal Finance Management Act) for municipalities  
- PPPFA (Preferential Procurement Policy Framework Act)
- B-BBEE scoring (80/20 or 90/10 systems)
- CIDB grading for construction
- SBD forms (Standard Bidding Documents)
- MBD forms (Municipal Bidding Documents)
- CSD (Central Supplier Database) registration

## Guidelines
- Always ask clarifying questions when needed
- Tailor advice to user's experience level
- Provide realistic assessments, not false hope
- Highlight risks and compliance requirements
- Reference South African regulations when relevant
- Suggest specific actions the user can take`;
const QUICK_ACTION_PROMPTS = [
    {
        id: "build-strategy",
        label: "Build a bid strategy",
        prompt: "Help me build a comprehensive bid strategy for a tender I'm considering",
        icon: "target"
    },
    {
        id: "review-readiness",
        label: "Review my tender readiness",
        prompt: "Review my tender readiness and tell me what documents or certifications I might be missing for government tenders",
        icon: "clipboard-check"
    },
    {
        id: "find-opportunities",
        label: "Find matching tenders",
        prompt: "Find tenders that match my company profile and capabilities",
        icon: "search"
    },
    {
        id: "explain-tender",
        label: "Explain this tender",
        prompt: "Help me understand the requirements of a specific tender I'm looking at",
        icon: "file-text"
    },
    {
        id: "pricing-advice",
        label: "Advise on pricing",
        prompt: "Help me develop a competitive pricing strategy for my tender submission",
        icon: "calculator"
    },
    {
        id: "reduce-risk",
        label: "Reduce bid risk",
        prompt: "Help me identify and mitigate risks in my tender submission",
        icon: "shield"
    },
    {
        id: "learn-tendering",
        label: "Teach me tendering",
        prompt: "I'm new to tendering. Help me understand how government tenders work in South Africa",
        icon: "graduation-cap"
    },
    {
        id: "compliance-check",
        label: "Check compliance",
        prompt: "Review my compliance status and identify any gaps I need to address",
        icon: "check-circle"
    }
];
}),
"[project]/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "createServerClient",
    ()=>createServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://xqyecqkrtaydoesxnvlw.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxeWVjcWtydGF5ZG9lc3hudmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjM0NTgsImV4cCI6MjA3Njg5OTQ1OH0.wsb5Jz_I9RqxoNoZ6D3QPbK4aefbdGKcrGgWDfm3c4o"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The "setAll" method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
const createServerClient = createClient;
}),
"[project]/lib/engines/strategist/services/strategist-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// AI TENDER STRATEGIST - MAIN SERVICE
// ============================================
__turbopack_context__.s([
    "StrategistService",
    ()=>StrategistService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
class StrategistService {
    /**
   * Get or create user preferences
   */ static async getUserPreferences(userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_user_preferences").select("*").eq("user_id", userId).single();
        if (error && error.code !== "PGRST116") {
            console.error("[Strategist] Error fetching preferences:", error);
            return null;
        }
        return data;
    }
    /**
   * Update user preferences
   */ static async updateUserPreferences(userId, preferences) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_user_preferences").upsert({
            user_id: userId,
            ...preferences,
            updated_at: new Date().toISOString()
        }, {
            onConflict: "user_id"
        }).select().single();
        if (error) {
            console.error("[Strategist] Error updating preferences:", error);
            return null;
        }
        return data;
    }
    /**
   * Get user's company profile
   */ static async getCompanyProfile(userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("companies").select("*").eq("user_id", userId).single();
        if (error && error.code !== "PGRST116") {
            console.error("[Strategist] Error fetching company:", error);
            return null;
        }
        return data;
    }
    /**
   * Build full context for AI
   */ static async buildContext(userId, tenderId, contextType) {
        const [preferences, company] = await Promise.all([
            this.getUserPreferences(userId),
            this.getCompanyProfile(userId)
        ]);
        const context = {
            user_preferences: preferences,
            company_profile: company ? {
                company_name: company.company_name,
                industry: company.industry,
                company_size: company.company_size,
                bee_status: company.bee_status,
                province: company.province
            } : null
        };
        // Add tender context if provided
        if (tenderId) {
            const tenderContext = await this.getTenderContext(tenderId);
            if (tenderContext) {
                context.tender_context = tenderContext;
            }
        }
        return context;
    }
    /**
   * Get tender context for AI
   */ static async getTenderContext(tenderId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Try custom tender first
        const { data: customTender } = await supabase.from("user_custom_tenders").select("id, title, organization, description, close_date").eq("id", tenderId).single();
        if (customTender) {
            // Get analysis if available
            const { data: analysis } = await supabase.from("user_custom_tender_analysis").select("analysis_data").eq("tender_id", tenderId).single();
            return {
                id: customTender.id,
                title: customTender.title || "Untitled",
                organization: customTender.organization || "Unknown",
                description: customTender.description,
                close_date: customTender.close_date,
                analysis: analysis?.analysis_data
            };
        }
        // Try scraped tender
        const { data: scrapedTender } = await supabase.from("scraped_tenders").select("id, title, source_name, description, close_date").eq("id", tenderId).single();
        if (scrapedTender) {
            return {
                id: scrapedTender.id,
                title: scrapedTender.title || "Untitled",
                organization: scrapedTender.source_name || "Unknown",
                description: scrapedTender.description,
                close_date: scrapedTender.close_date
            };
        }
        return null;
    }
    /**
   * Create a new conversation
   */ static async createConversation(userId, contextType = "general", tenderId, title) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_conversations").insert({
            user_id: userId,
            context_type: contextType,
            tender_id: tenderId,
            title: title || this.generateConversationTitle(contextType)
        }).select().single();
        if (error) {
            console.error("[Strategist] Error creating conversation:", error);
            return null;
        }
        return data;
    }
    /**
   * Get conversation by ID
   */ static async getConversation(conversationId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_conversations").select("*").eq("id", conversationId).single();
        if (error) {
            console.error("[Strategist] Error fetching conversation:", error);
            return null;
        }
        return data;
    }
    /**
   * Get user's conversations
   */ static async getUserConversations(userId, limit = 20) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_conversations").select("*").eq("user_id", userId).eq("status", "active").order("last_message_at", {
            ascending: false,
            nullsFirst: false
        }).limit(limit);
        if (error) {
            console.error("[Strategist] Error fetching conversations:", error);
            return [];
        }
        return data || [];
    }
    /**
   * Get messages for a conversation
   */ static async getConversationMessages(conversationId, limit = 50) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_messages").select("*").eq("conversation_id", conversationId).order("created_at", {
            ascending: true
        }).limit(limit);
        if (error) {
            console.error("[Strategist] Error fetching messages:", error);
            return [];
        }
        return data || [];
    }
    /**
   * Add message to conversation
   */ static async addMessage(conversationId, role, content, options) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_messages").insert({
            conversation_id: conversationId,
            role,
            content,
            message_type: options?.message_type || "text",
            structured_data: options?.structured_data,
            model_used: options?.model_used,
            tokens_used: options?.tokens_used
        }).select().single();
        if (error) {
            console.error("[Strategist] Error adding message:", error);
            return null;
        }
        // Update conversation metadata with separate query
        const { data: conversation } = await supabase.from("strategist_conversations").select("message_count").eq("id", conversationId).single();
        await supabase.from("strategist_conversations").update({
            message_count: (conversation?.message_count || 0) + 1,
            last_message_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }).eq("id", conversationId);
        return data;
    }
    /**
   * Generate conversation title
   */ static generateConversationTitle(contextType) {
        const titles = {
            general: "General Consultation",
            tender: "Tender Discussion",
            boq: "Pricing & BOQ Review",
            strategy: "Strategy Session",
            learning: "Learning Session"
        };
        return titles[contextType] || "New Conversation";
    }
    /**
   * Check if user has completed onboarding
   */ static async hasCompletedOnboarding(userId) {
        const preferences = await this.getUserPreferences(userId);
        return preferences?.onboarding_completed || false;
    }
    /**
   * Mark onboarding as complete
   */ static async completeOnboarding(userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("strategist_user_preferences").update({
            onboarding_completed: true,
            onboarding_completed_at: new Date().toISOString()
        }).eq("user_id", userId);
        return !error;
    }
    /**
   * Generate strategic recommendations for a tender
   */ static async generateRecommendations(params) {
        const recommendations = [];
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
            // Get tender data
            const table = params.tenderType === "custom" ? "user_custom_tenders" : "scraped_tenders";
            const { data: tender } = await supabase.from(table).select("*").eq("id", params.tenderId).single();
            if (!tender) {
                return [
                    "Unable to generate recommendations: Tender not found"
                ];
            }
            // Get user preferences
            const preferences = await this.getUserPreferences(params.userId);
            // Generate recommendations based on competitiveness score
            if (params.competitiveness) {
                if (params.competitiveness.documentation_score < 0.7) {
                    recommendations.push("Complete all required documentation before submitting your bid");
                }
                if (params.competitiveness.compliance_score < 0.8) {
                    recommendations.push("Ensure tax clearance and CSD registration are up to date");
                }
                if (params.competitiveness.win_probability < 0.5) {
                    recommendations.push("Consider partnering with experienced companies to strengthen your bid");
                }
            }
            // Time-based recommendations
            if (tender.close_date) {
                const daysUntilClose = Math.ceil((new Date(tender.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                if (daysUntilClose < 7) {
                    recommendations.push("Urgent: Prioritize this tender due to approaching deadline");
                } else if (daysUntilClose > 30) {
                    recommendations.push("You have time to prepare a comprehensive bid - use it wisely");
                }
            }
            // Experience-based recommendations
            if (preferences?.experience_level === "beginner") {
                recommendations.push("Consider seeking mentorship or guidance from experienced bidders");
                recommendations.push("Start with smaller value tenders to build your track record");
            }
            // Default recommendation
            if (recommendations.length === 0) {
                recommendations.push("Review tender requirements carefully and ensure full compliance");
                recommendations.push("Conduct thorough cost analysis before submitting your pricing");
            }
            return recommendations;
        } catch (error) {
            console.error("[Strategist] Error generating recommendations:", error);
            return [
                "Unable to generate recommendations at this time"
            ];
        }
    }
}
}),
"[project]/lib/engines/strategist/services/opportunity-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// AI TENDER STRATEGIST - OPPORTUNITY SERVICE
// ============================================
__turbopack_context__.s([
    "OpportunityService",
    ()=>OpportunityService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
class OpportunityService {
    /**
   * Discover opportunities matching user profile
   */ static async discoverOpportunities(userId, options) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Get user preferences
        const { data: preferences } = await supabase.from("strategist_user_preferences").select("*").eq("user_id", userId).single();
        if (!preferences) {
            return [];
        }
        // Get available tenders
        const { data: tenders } = await supabase.from("scraped_tenders").select("id, title, source_name, description, close_date, category, estimated_value, source_province").eq("is_active", true).gte("close_date", new Date().toISOString()).order("close_date", {
            ascending: true
        }).limit(100);
        if (!tenders || tenders.length === 0) {
            return [];
        }
        // Score and categorize opportunities
        const opportunities = tenders.map((tender)=>this.scoreTenderMatch(tender, preferences)).filter((opp)=>opp.match_score >= (options?.minScore || 0.3)).sort((a, b)=>b.match_score - a.match_score).slice(0, options?.limit || 10);
        // Save opportunities
        for (const opp of opportunities){
            await supabase.from("strategist_opportunities").upsert({
                user_id: userId,
                scraped_tender_id: opp.tender_id,
                match_score: opp.match_score,
                match_reasons: opp.match_reasons,
                opportunity_type: opp.opportunity_type,
                ai_insights: opp.ai_insights,
                expires_at: opp.expires_at
            }, {
                onConflict: "user_id, scraped_tender_id"
            });
        }
        return opportunities.map((opp)=>({
                ...opp,
                id: crypto.randomUUID(),
                user_id: userId,
                scraped_tender_id: opp.tender_id,
                custom_tender_id: null,
                is_viewed: false,
                is_saved: false,
                is_dismissed: false,
                user_notes: null,
                estimated_margin: null,
                estimated_effort: null,
                created_at: new Date().toISOString()
            }));
    }
    /**
   * Score a tender match against user preferences
   */ static scoreTenderMatch(tender, preferences) {
        let score = 0;
        const reasons = [];
        const insights = {};
        // Province match (20 points)
        if (preferences.provinces?.length && tender.source_province) {
            const provinceMatch = preferences.provinces.some((p)=>tender.source_province.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(tender.source_province.toLowerCase()));
            if (provinceMatch) {
                score += 0.2;
                reasons.push("Matches your preferred province");
            }
        }
        // Industry/Category match (25 points)
        if (preferences.industries?.length && tender.category) {
            const categoryLower = tender.category.toLowerCase();
            const industryMatch = preferences.industries.some((ind)=>categoryLower.includes(ind.toLowerCase()) || ind.toLowerCase().includes(categoryLower));
            if (industryMatch) {
                score += 0.25;
                reasons.push("Matches your industry focus");
            }
        }
        // Value match based on company size (20 points)
        if (preferences.annual_turnover && tender.estimated_value) {
            score += 0.15;
            reasons.push("Contract value within your range");
        }
        // Deadline proximity (15 points - more time = better)
        if (tender.close_date) {
            const daysUntilClose = Math.ceil((new Date(tender.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (daysUntilClose > 14) {
                score += 0.15;
                reasons.push("Good preparation time available");
            } else if (daysUntilClose > 7) {
                score += 0.1;
                reasons.push("Adequate preparation time");
            } else {
                score += 0.05;
                insights.warning = "Limited preparation time";
            }
        }
        // Experience level consideration (20 points)
        if (preferences.experience_level === "beginner") {
            if (!tender.estimated_value || tender.estimated_value.includes("R") === false) {
                score += 0.2;
                reasons.push("Good entry-level opportunity");
            }
        } else if (preferences.experience_level === "advanced") {
            score += 0.1;
            reasons.push("Matches your experience level");
        }
        // Determine opportunity type
        let opportunityType = "strategic";
        if (score >= 0.7) {
            opportunityType = "high_margin";
        } else if (score >= 0.5 && reasons.includes("Good preparation time available")) {
            opportunityType = "low_risk";
        } else if (preferences.experience_level === "beginner" && score >= 0.4) {
            opportunityType = "quick_win";
        } else if (score >= 0.4) {
            opportunityType = "growth";
        }
        return {
            tender_id: tender.id,
            match_score: Math.min(score, 1),
            match_reasons: reasons,
            opportunity_type: opportunityType,
            ai_insights: {
                ...insights,
                tender_title: tender.title,
                organization: tender.source_name,
                close_date: tender.close_date,
                category: tender.category
            },
            expires_at: tender.close_date
        };
    }
    /**
   * Get user's saved opportunities
   * Removed join with scraped_tenders - fetch tender data separately
   */ static async getSavedOpportunities(userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // First get opportunities without join
        const { data: opportunities, error } = await supabase.from("strategist_opportunities").select("*").eq("user_id", userId).eq("is_saved", true).eq("is_dismissed", false).order("created_at", {
            ascending: false
        });
        if (error) {
            console.error("[Opportunity] Error fetching saved opportunities:", error);
            return [];
        }
        if (!opportunities || opportunities.length === 0) {
            return [];
        }
        // Get tender IDs and fetch tender data separately
        const tenderIds = opportunities.map((opp)=>opp.scraped_tender_id).filter((id)=>id !== null);
        let tendersMap = {};
        if (tenderIds.length > 0) {
            const { data: tenders } = await supabase.from("scraped_tenders").select("id, title, source_name, close_date, category, estimated_value").in("id", tenderIds);
            if (tenders) {
                tendersMap = tenders.reduce((acc, tender)=>{
                    acc[tender.id] = tender;
                    return acc;
                }, {});
            }
        }
        // Combine opportunities with tender data
        return opportunities.map((opp)=>({
                ...opp,
                tender: opp.scraped_tender_id ? tendersMap[opp.scraped_tender_id] || null : null
            }));
    }
    /**
   * Update opportunity status
   */ static async updateOpportunityStatus(opportunityId, updates) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("strategist_opportunities").update(updates).eq("id", opportunityId);
        return !error;
    }
    /**
   * Create an opportunity from tender data
   */ static async createOpportunity(params) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
            // Get user preferences for scoring
            const { data: preferences } = await supabase.from("strategist_user_preferences").select("*").eq("user_id", params.userId).single();
            if (!preferences) {
                console.warn("[Opportunity] User preferences not found, skipping opportunity creation");
                return null;
            }
            // Calculate match score
            const matchScore = this.calculateMatchScoreForTender(params.tenderData, preferences);
            if (matchScore < 0.3) {
                console.log("[Opportunity] Match score too low, skipping opportunity creation");
                return null;
            }
            // Determine opportunity type
            let opportunityType = "strategic";
            if (matchScore >= 0.7) opportunityType = "high_margin";
            else if (matchScore >= 0.5) opportunityType = "low_risk";
            else if (matchScore >= 0.4) opportunityType = "growth";
            // Create opportunity
            const { data, error } = await supabase.from("strategist_opportunities").upsert({
                user_id: params.userId,
                scraped_tender_id: params.tenderType === "scraped" ? params.tenderId : null,
                custom_tender_id: params.tenderType === "custom" ? params.tenderId : null,
                match_score: matchScore,
                match_reasons: this.getMatchReasonsForTender(params.tenderData, preferences),
                opportunity_type: opportunityType,
                ai_insights: {
                    tender_title: params.tenderTitle,
                    analysis: "Automatically generated from tender data"
                },
                expires_at: params.tenderData.close_date || params.tenderData.deadline
            }, {
                onConflict: params.tenderType === "scraped" ? "user_id,scraped_tender_id" : "user_id,custom_tender_id"
            }).select().single();
            if (error) {
                console.error("[Opportunity] Error creating opportunity:", error);
                return null;
            }
            return data;
        } catch (error) {
            console.error("[Opportunity] Error in createOpportunity:", error);
            return null;
        }
    }
    /**
   * Find similar opportunities for a tender
   */ static async findSimilar(params) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
            // Get the source tender
            const table = params.tenderType === "custom" ? "user_custom_tenders" : "scraped_tenders";
            const { data: sourceTender } = await supabase.from(table).select("*").eq("id", params.tenderId).single();
            if (!sourceTender) {
                return [];
            }
            // Find similar tenders based on category and location
            const { data: similarTenders } = await supabase.from("scraped_tenders").select("id, title, source_name, category, source_province, close_date").eq("is_active", true).gte("close_date", new Date().toISOString()).neq("id", params.tenderType === "scraped" ? params.tenderId : "").limit(5);
            if (!similarTenders || similarTenders.length === 0) {
                return [];
            }
            // Filter by similarity (category or province match)
            const similar = similarTenders.filter((tender)=>{
                const categoryMatch = sourceTender.category && tender.category && (tender.category.toLowerCase().includes(sourceTender.category.toLowerCase()) || sourceTender.category.toLowerCase().includes(tender.category.toLowerCase()));
                const provinceMatch = sourceTender.source_province && tender.source_province && tender.source_province.toLowerCase() === sourceTender.source_province.toLowerCase();
                return categoryMatch || provinceMatch;
            });
            return similar;
        } catch (error) {
            console.error("[Opportunity] Error finding similar opportunities:", error);
            return [];
        }
    }
    /**
   * Calculate match score for a tender
   */ static calculateMatchScoreForTender(tender, preferences) {
        let score = 0;
        // Category/Industry match
        if (preferences.industries?.length && tender.category) {
            const categoryMatch = preferences.industries.some((ind)=>tender.category.toLowerCase().includes(ind.toLowerCase()));
            if (categoryMatch) score += 0.3;
        }
        // Province match
        if (preferences.provinces?.length && (tender.source_province || tender.location)) {
            const province = tender.source_province || tender.location;
            const provinceMatch = preferences.provinces.some((p)=>province?.toLowerCase().includes(p.toLowerCase()));
            if (provinceMatch) score += 0.25;
        }
        // Deadline consideration
        const deadline = tender.close_date || tender.deadline;
        if (deadline) {
            const daysUntilClose = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (daysUntilClose > 14) score += 0.2;
            else if (daysUntilClose > 7) score += 0.15;
            else score += 0.05;
        }
        // Base score for any tender
        score += 0.25;
        return Math.min(score, 1);
    }
    /**
   * Get match reasons for a tender
   */ static getMatchReasonsForTender(tender, preferences) {
        const reasons = [];
        if (preferences.industries?.length && tender.category) {
            const categoryMatch = preferences.industries.some((ind)=>tender.category.toLowerCase().includes(ind.toLowerCase()));
            if (categoryMatch) reasons.push("Matches your industry expertise");
        }
        if (preferences.provinces?.length) {
            const province = tender.source_province || tender.location;
            const provinceMatch = preferences.provinces.some((p)=>province?.toLowerCase().includes(p.toLowerCase()));
            if (provinceMatch) reasons.push("Located in your preferred province");
        }
        const deadline = tender.close_date || tender.deadline;
        if (deadline) {
            const daysUntilClose = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (daysUntilClose > 14) reasons.push("Sufficient time to prepare quality bid");
        }
        if (reasons.length === 0) {
            reasons.push("General opportunity match");
        }
        return reasons;
    }
}
}),
"[project]/lib/engines/strategist/services/learning-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// AI TENDER STRATEGIST - LEARNING SERVICE
// ============================================
__turbopack_context__.s([
    "LearningService",
    ()=>LearningService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/constants.ts [app-route] (ecmascript)");
;
;
class LearningService {
    /**
   * Get all learning topics
   */ static getTopics() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LEARNING_TOPICS"];
    }
    /**
   * Get learning progress for a user
   */ static async getUserProgress(userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_learning_progress").select("*").eq("user_id", userId).order("last_accessed_at", {
            ascending: false,
            nullsFirst: false
        });
        if (error) {
            console.error("[Learning] Error fetching progress:", error);
            return [];
        }
        return data || [];
    }
    /**
   * Get progress for a specific topic
   */ static async getTopicProgress(userId, topicId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_learning_progress").select("*").eq("user_id", userId).eq("topic_id", topicId).single();
        if (error && error.code !== "PGRST116") {
            console.error("[Learning] Error fetching topic progress:", error);
            return null;
        }
        return data;
    }
    /**
   * Update learning progress
   */ static async updateProgress(userId, topicId, updates) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Get current progress
        const { data: current } = await supabase.from("strategist_learning_progress").select("*").eq("user_id", userId).eq("topic_id", topicId).single();
        const topic = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LEARNING_TOPICS"].find((t)=>t.id === topicId);
        if (!topic) return null;
        const lessonsCompleted = current?.lessons_completed || [];
        const quizScores = current?.quiz_scores || [];
        let progressPercent = current?.progress_percent || 0;
        let timeSpent = current?.time_spent_minutes || 0;
        // Update lessons completed
        if (updates.lesson_completed && !lessonsCompleted.includes(updates.lesson_completed)) {
            lessonsCompleted.push(updates.lesson_completed);
            // Calculate progress based on subtopics
            progressPercent = Math.round(lessonsCompleted.length / topic.subtopics.length * 100);
        }
        // Update quiz scores
        if (updates.quiz_score) {
            const existingIndex = quizScores.findIndex((q)=>q.quiz_id === updates.quiz_score.quiz_id);
            if (existingIndex >= 0) {
                quizScores[existingIndex] = {
                    ...updates.quiz_score,
                    completed_at: new Date().toISOString()
                };
            } else {
                quizScores.push({
                    ...updates.quiz_score,
                    completed_at: new Date().toISOString()
                });
            }
        }
        // Update time spent
        if (updates.time_spent_minutes) {
            timeSpent += updates.time_spent_minutes;
        }
        // Override progress if explicitly set
        if (updates.progress_percent !== undefined) {
            progressPercent = updates.progress_percent;
        }
        const { data, error } = await supabase.from("strategist_learning_progress").upsert({
            user_id: userId,
            topic_id: topicId,
            topic_category: topic.category,
            progress_percent: progressPercent,
            lessons_completed: lessonsCompleted,
            quiz_scores: quizScores,
            time_spent_minutes: timeSpent,
            last_accessed_at: new Date().toISOString(),
            completed_at: progressPercent >= 100 ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
        }, {
            onConflict: "user_id, topic_id"
        }).select().single();
        if (error) {
            console.error("[Learning] Error updating progress:", error);
            return null;
        }
        return data;
    }
    /**
   * Get recommended topics for user
   */ static async getRecommendedTopics(userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Get user's experience level
        const { data: preferences } = await supabase.from("strategist_user_preferences").select("experience_level").eq("user_id", userId).single();
        const experienceLevel = preferences?.experience_level || "beginner";
        // Get completed topics
        const progress = await this.getUserProgress(userId);
        const completedTopicIds = progress.filter((p)=>p.progress_percent >= 100).map((p)=>p.topic_id);
        // Filter and prioritize topics
        const recommendations = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LEARNING_TOPICS"].filter((topic)=>{
            // Exclude completed
            if (completedTopicIds.includes(topic.id)) return false;
            // Match difficulty to experience
            if (experienceLevel === "beginner" && topic.difficulty === "advanced") return false;
            if (experienceLevel === "intermediate" && topic.difficulty === "advanced") {
                // Only show advanced if basics are done
                const hasBasics = completedTopicIds.some((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LEARNING_TOPICS"].find((t)=>t.id === id && t.category === "basics"));
                if (!hasBasics) return false;
            }
            return true;
        }).slice(0, 5);
        return recommendations;
    }
    /**
   * Get overall learning statistics
   */ static async getLearningStats(userId) {
        const progress = await this.getUserProgress(userId);
        const completedTopics = progress.filter((p)=>p.progress_percent >= 100).length;
        const totalTimeMinutes = progress.reduce((sum, p)=>sum + p.time_spent_minutes, 0);
        const allQuizScores = progress.flatMap((p)=>p.quiz_scores || []);
        const averageQuizScore = allQuizScores.length > 0 ? allQuizScores.reduce((sum, q)=>sum + q.score, 0) / allQuizScores.length : 0;
        // Find top categories by progress
        const categoryProgress = {};
        progress.forEach((p)=>{
            if (!categoryProgress[p.topic_category]) {
                categoryProgress[p.topic_category] = 0;
            }
            categoryProgress[p.topic_category] += p.progress_percent;
        });
        const topCategories = Object.entries(categoryProgress).sort(([, a], [, b])=>b - a).slice(0, 3).map(([category])=>category);
        return {
            totalTopics: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LEARNING_TOPICS"].length,
            completedTopics,
            totalTimeMinutes,
            averageQuizScore,
            topCategories
        };
    }
}
}),
"[project]/lib/engines/strategist/services/alert-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// AI TENDER STRATEGIST - ALERT SERVICE
// ============================================
__turbopack_context__.s([
    "AlertService",
    ()=>AlertService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
class AlertService {
    /**
   * Create a new alert
   */ static async createAlert(userId, alert) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("strategist_alerts").insert({
            user_id: userId,
            ...alert,
            priority: alert.priority || "medium",
            trigger_date: alert.trigger_date || new Date().toISOString()
        }).select().single();
        if (error) {
            console.error("[Alert] Error creating alert:", error);
            return null;
        }
        return data;
    }
    /**
   * Get user's alerts
   */ static async getUserAlerts(userId, options) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        let query = supabase.from("strategist_alerts").select("*").eq("user_id", userId).eq("is_dismissed", false).order("priority", {
            ascending: false
        }).order("created_at", {
            ascending: false
        });
        if (options?.unreadOnly) {
            query = query.eq("is_read", false);
        }
        if (options?.priority) {
            query = query.eq("priority", options.priority);
        }
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        const { data, error } = await query;
        if (error) {
            console.error("[Alert] Error fetching alerts:", error);
            return [];
        }
        return data || [];
    }
    /**
   * Mark alert as read
   */ static async markAsRead(alertId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("strategist_alerts").update({
            is_read: true
        }).eq("id", alertId);
        return !error;
    }
    /**
   * Dismiss alert
   */ static async dismissAlert(alertId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("strategist_alerts").update({
            is_dismissed: true
        }).eq("id", alertId);
        return !error;
    }
    /**
   * Mark alert as actioned
   */ static async markAsActioned(alertId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("strategist_alerts").update({
            is_actioned: true,
            is_read: true
        }).eq("id", alertId);
        return !error;
    }
    /**
   * Generate compliance alerts for user
   */ static async generateComplianceAlerts(userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Get user preferences
        const { data: preferences } = await supabase.from("strategist_user_preferences").select("*").eq("user_id", userId).single();
        if (!preferences) return;
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        // Check tax clearance expiry
        if (preferences.has_tax_clearance && preferences.tax_clearance_expiry) {
            const expiryDate = new Date(preferences.tax_clearance_expiry);
            if (expiryDate <= thirtyDaysFromNow) {
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                await this.createAlert(userId, {
                    alert_type: "document_expiry",
                    title: "Tax Clearance Expiring Soon",
                    message: `Your tax clearance certificate expires in ${daysUntilExpiry} days. Renew it to maintain tender eligibility.`,
                    priority: daysUntilExpiry <= 14 ? "urgent" : "high",
                    related_document_type: "tax_clearance",
                    action_url: "/dashboard/profile",
                    action_label: "Update Documents",
                    expiry_date: preferences.tax_clearance_expiry
                });
            }
        }
        // Check COIDA expiry
        if (preferences.has_coida && preferences.coida_expiry) {
            const expiryDate = new Date(preferences.coida_expiry);
            if (expiryDate <= thirtyDaysFromNow) {
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                await this.createAlert(userId, {
                    alert_type: "document_expiry",
                    title: "COIDA Letter Expiring Soon",
                    message: `Your COIDA letter of good standing expires in ${daysUntilExpiry} days. Renew it to maintain compliance.`,
                    priority: daysUntilExpiry <= 14 ? "high" : "medium",
                    related_document_type: "coida",
                    action_url: "/dashboard/profile",
                    action_label: "Update Documents",
                    expiry_date: preferences.coida_expiry
                });
            }
        }
        // Check for missing CSD registration
        if (!preferences.has_csd_registration) {
            await this.createAlert(userId, {
                alert_type: "compliance_gap",
                title: "CSD Registration Missing",
                message: "You need to register on the Central Supplier Database (CSD) to bid on government tenders. This is a mandatory requirement.",
                priority: "high",
                action_url: "https://secure.csd.gov.za/",
                action_label: "Register on CSD"
            });
        }
        // Check for missing tax clearance
        if (!preferences.has_tax_clearance) {
            await this.createAlert(userId, {
                alert_type: "compliance_gap",
                title: "Tax Clearance Missing",
                message: "A valid tax clearance certificate is required for all government tenders.",
                priority: "urgent",
                related_document_type: "tax_clearance",
                action_url: "https://www.sars.gov.za/",
                action_label: "Get Tax Clearance"
            });
        }
    }
    /**
   * Get unread alert count
   */ static async getUnreadCount(userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { count, error } = await supabase.from("strategist_alerts").select("*", {
            count: "exact",
            head: true
        }).eq("user_id", userId).eq("is_read", false).eq("is_dismissed", false);
        if (error) {
            console.error("[Alert] Error counting alerts:", error);
            return 0;
        }
        return count || 0;
    }
}
}),
"[project]/lib/engines/strategist/services/competitiveness-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// AI TENDER STRATEGIST - COMPETITIVENESS SERVICE
// ============================================
__turbopack_context__.s([
    "CompetitivenessService",
    ()=>CompetitivenessService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
class CompetitivenessService {
    /**
   * Calculate competitiveness score for a user
   */ static async calculateScore(params) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Get user data
        const [preferencesResult, companyResult, profileResult] = await Promise.all([
            supabase.from("strategist_user_preferences").select("*").eq("user_id", params.userId).single(),
            supabase.from("companies").select("*").eq("user_id", params.userId).single(),
            supabase.from("profiles").select("*").eq("id", params.userId).single()
        ]);
        const preferences = preferencesResult.data;
        const company = companyResult.data;
        const profile = profileResult.data;
        // Calculate component scores
        const documentationScore = this.calculateDocumentationScore(preferences, company);
        const pricingScore = this.calculatePricingScore(preferences);
        const complianceScore = this.calculateComplianceScore(preferences);
        const experienceScore = this.calculateExperienceScore(preferences);
        const capacityScore = this.calculateCapacityScore(preferences, company);
        // Calculate overall and win probability
        const overallScore = (documentationScore + pricingScore + complianceScore + experienceScore + capacityScore) / 5;
        const winProbability = this.estimateWinProbability(overallScore, preferences, params.tenderId);
        // Build score breakdown
        const scoreBreakdown = {
            documentation: {
                score: documentationScore,
                factors: this.getDocumentationFactors(preferences, company)
            },
            pricing: {
                score: pricingScore,
                factors: this.getPricingFactors(preferences)
            },
            compliance: {
                score: complianceScore,
                factors: this.getComplianceFactors(preferences)
            },
            experience: {
                score: experienceScore,
                factors: this.getExperienceFactors(preferences)
            },
            capacity: {
                score: capacityScore,
                factors: this.getCapacityFactors(preferences, company)
            }
        };
        // Generate improvement suggestions
        const improvementSuggestions = this.generateImprovementSuggestions(scoreBreakdown);
        // Save score
        const { data, error } = await supabase.from("strategist_competitiveness_scores").upsert({
            user_id: params.userId,
            tender_id: params.tenderId,
            documentation_score: documentationScore,
            pricing_score: pricingScore,
            compliance_score: complianceScore,
            experience_score: experienceScore,
            capacity_score: capacityScore,
            score_breakdown: scoreBreakdown,
            improvement_suggestions: improvementSuggestions,
            win_probability: winProbability,
            win_probability_factors: {
                base_score: overallScore,
                experience_bonus: preferences?.experience_level === "advanced" ? 0.1 : 0,
                compliance_penalty: complianceScore < 0.5 ? -0.2 : 0
            },
            calculated_at: new Date().toISOString(),
            valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }, {
            onConflict: "user_id"
        }).select().single();
        if (error) {
            console.error("[Competitiveness] Error saving score:", error);
            return null;
        }
        return data;
    }
    /**
   * Get cached score or calculate new one
   */ static async getScore(userId, tenderId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Check for valid cached score
        const { data: cached } = await supabase.from("strategist_competitiveness_scores").select("*").eq("user_id", userId).gte("valid_until", new Date().toISOString()).single();
        if (cached) {
            return cached;
        }
        // Calculate new score
        return this.calculateScore({
            userId,
            tenderId
        });
    }
    // Score calculation helpers
    static calculateDocumentationScore(preferences, company) {
        let score = 0;
        let total = 0;
        // Check various documentation
        if (company?.company_name) {
            score += 1;
            total += 1;
        }
        if (company?.registration_number) {
            score += 1;
            total += 1;
        }
        if (company?.tax_number) {
            score += 1;
            total += 1;
        }
        if (preferences?.has_tax_clearance) {
            score += 2;
            total += 2;
        }
        if (preferences?.has_coida) {
            score += 1;
            total += 1;
        }
        if (preferences?.has_csd_registration) {
            score += 2;
            total += 2;
        }
        if (preferences?.cidb_grading) {
            score += 1;
            total += 1;
        }
        if (preferences?.bee_level) {
            score += 1;
            total += 1;
        }
        return total > 0 ? score / total : 0;
    }
    static calculatePricingScore(preferences) {
        // Based on past performance
        const wins = preferences?.past_tender_wins || 0;
        const losses = preferences?.past_tender_losses || 0;
        const total = wins + losses;
        if (total === 0) return 0.5 // Neutral for new users
        ;
        const winRate = wins / total;
        return Math.min(winRate * 1.2, 1) // Slight bonus for good win rate
        ;
    }
    static calculateComplianceScore(preferences) {
        let score = 0;
        if (preferences?.has_tax_clearance) score += 0.35;
        if (preferences?.has_coida) score += 0.25;
        if (preferences?.has_csd_registration) score += 0.4;
        return score;
    }
    static calculateExperienceScore(preferences) {
        const levelScores = {
            beginner: 0.3,
            intermediate: 0.6,
            advanced: 0.9
        };
        const baseScore = levelScores[preferences?.experience_level] || 0.3;
        // Bonus for past wins
        const wins = preferences?.past_tender_wins || 0;
        const winBonus = Math.min(wins * 0.02, 0.1);
        return Math.min(baseScore + winBonus, 1);
    }
    static calculateCapacityScore(preferences, company) {
        let score = 0.5 // Base score
        ;
        // Company size factor
        const sizeScores = {
            micro: 0.1,
            small: 0.2,
            medium: 0.3,
            large: 0.4,
            enterprise: 0.5
        };
        score += sizeScores[company?.company_size] || 0;
        // CIDB grading factor (for construction)
        if (preferences?.cidb_grading) {
            const grading = Number.parseInt(preferences.cidb_grading);
            if (!isNaN(grading)) {
                score += grading * 0.02;
            }
        }
        return Math.min(score, 1);
    }
    // Factor breakdown helpers
    static getDocumentationFactors(preferences, company) {
        const factors = [];
        if (company?.company_name) factors.push("Company profile complete");
        if (preferences?.has_tax_clearance) factors.push("Tax clearance valid");
        if (preferences?.has_csd_registration) factors.push("CSD registered");
        if (preferences?.bee_level) factors.push("B-BBEE certificate");
        if (!preferences?.has_tax_clearance) factors.push("Missing: Tax clearance");
        if (!preferences?.has_csd_registration) factors.push("Missing: CSD registration");
        return factors;
    }
    static getPricingFactors(preferences) {
        const factors = [];
        const wins = preferences?.past_tender_wins || 0;
        const losses = preferences?.past_tender_losses || 0;
        if (wins > 0) factors.push(`${wins} past tender wins`);
        if (losses > 0) factors.push(`${losses} past tender losses`);
        if (wins === 0 && losses === 0) factors.push("No historical pricing data");
        return factors;
    }
    static getComplianceFactors(preferences) {
        const factors = [];
        if (preferences?.has_tax_clearance) factors.push("Tax clearance: Valid");
        else factors.push("Tax clearance: Missing");
        if (preferences?.has_coida) factors.push("COIDA: Valid");
        else factors.push("COIDA: Missing");
        if (preferences?.has_csd_registration) factors.push("CSD: Registered");
        else factors.push("CSD: Not registered");
        return factors;
    }
    static getExperienceFactors(preferences) {
        const factors = [];
        factors.push(`Experience level: ${preferences?.experience_level || "Unknown"}`);
        const wins = preferences?.past_tender_wins || 0;
        if (wins > 0) factors.push(`${wins} successful tenders`);
        return factors;
    }
    static getCapacityFactors(preferences, company) {
        const factors = [];
        if (company?.company_size) factors.push(`Company size: ${company.company_size}`);
        if (preferences?.cidb_grading) factors.push(`CIDB grading: ${preferences.cidb_grading}`);
        if (preferences?.annual_turnover) factors.push(`Annual turnover: ${preferences.annual_turnover}`);
        return factors;
    }
    static estimateWinProbability(overallScore, preferences, tenderId) {
        let probability = overallScore * 0.7 // Base from overall score
        ;
        // Adjustments
        if (preferences?.experience_level === "advanced") probability += 0.1;
        if (preferences?.experience_level === "beginner") probability -= 0.1;
        if (preferences?.has_tax_clearance && preferences?.has_csd_registration) probability += 0.1;
        // Cap between 0.1 and 0.9
        return Math.max(0.1, Math.min(0.9, probability));
    }
    static generateImprovementSuggestions(breakdown) {
        const suggestions = [];
        if (breakdown.documentation.score < 0.7) {
            suggestions.push("Complete your company profile with all required documentation");
        }
        if (breakdown.compliance.score < 0.8) {
            if (!breakdown.compliance.factors.includes("Tax clearance: Valid")) {
                suggestions.push("Obtain a valid tax clearance certificate from SARS");
            }
            if (!breakdown.compliance.factors.includes("CSD: Registered")) {
                suggestions.push("Register on the Central Supplier Database (CSD)");
            }
        }
        if (breakdown.experience.score < 0.5) {
            suggestions.push("Start with smaller tenders to build your track record");
        }
        if (breakdown.capacity.score < 0.5) {
            suggestions.push("Consider joint ventures to increase your capacity for larger tenders");
        }
        return suggestions;
    }
}
}),
"[project]/lib/engines/strategist/prompts/strategist-prompts.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// AI TENDER STRATEGIST - PROMPT BUILDERS
// ============================================
__turbopack_context__.s([
    "buildStrategistPrompt",
    ()=>buildStrategistPrompt,
    "buildStrategyGenerationPrompt",
    ()=>buildStrategyGenerationPrompt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/constants.ts [app-route] (ecmascript)");
;
function buildStrategistPrompt(context) {
    let prompt = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STRATEGIST_SYSTEM_PROMPT"];
    // Add user experience level context
    if (context.user_preferences?.experience_level) {
        const levelInstructions = {
            beginner: `
## User Experience Level: BEGINNER
- Explain concepts in simple terms, avoid jargon
- Provide step-by-step guidance
- Define technical terms when first used
- Be extra supportive and encouraging
- Suggest learning resources when relevant`,
            intermediate: `
## User Experience Level: INTERMEDIATE  
- User has basic tendering knowledge
- Can use technical terminology with brief explanations
- Focus on strategic advice and optimization
- Highlight advanced techniques when relevant`,
            advanced: `
## User Experience Level: ADVANCED
- User is experienced in tendering
- Use technical terminology freely
- Focus on strategic optimization and edge cases
- Provide nuanced, detailed analysis
- Discuss advanced strategies and market insights`
        };
        prompt += levelInstructions[context.user_preferences.experience_level];
    }
    // Add user profile context
    if (context.user_preferences || context.company_profile) {
        prompt += `

## User Profile Context`;
        if (context.company_profile?.company_name) {
            prompt += `
Company: ${context.company_profile.company_name}`;
        }
        if (context.company_profile?.industry) {
            prompt += `
Industry: ${context.company_profile.industry}`;
        }
        if (context.user_preferences?.provinces?.length) {
            prompt += `
Regions: ${context.user_preferences.provinces.join(", ")}`;
        }
        if (context.user_preferences?.cidb_grading) {
            prompt += `
CIDB Grading: ${context.user_preferences.cidb_grading}`;
        }
        if (context.user_preferences?.bee_level || context.company_profile?.bee_status) {
            prompt += `
B-BBEE Status: ${context.user_preferences?.bee_level || context.company_profile?.bee_status}`;
        }
    }
    // Add compliance status
    if (context.user_preferences) {
        const complianceItems = [];
        if (context.user_preferences.has_tax_clearance) {
            complianceItems.push(`Tax Clearance: Valid${context.user_preferences.tax_clearance_expiry ? ` (expires ${context.user_preferences.tax_clearance_expiry})` : ""}`);
        } else {
            complianceItems.push("Tax Clearance: Missing/Expired");
        }
        if (context.user_preferences.has_coida) {
            complianceItems.push(`COIDA: Valid${context.user_preferences.coida_expiry ? ` (expires ${context.user_preferences.coida_expiry})` : ""}`);
        } else {
            complianceItems.push("COIDA: Missing");
        }
        if (context.user_preferences.has_csd_registration) {
            complianceItems.push("CSD Registration: Active");
        } else {
            complianceItems.push("CSD Registration: Missing");
        }
        if (complianceItems.length > 0) {
            prompt += `

## Compliance Status
${complianceItems.join("\n")}`;
        }
    }
    // Add tender context if present
    if (context.tender_context) {
        prompt += `

## Current Tender Context
Title: ${context.tender_context.title}
Organization: ${context.tender_context.organization}
${context.tender_context.description ? `Description: ${context.tender_context.description}` : ""}
${context.tender_context.close_date ? `Closing Date: ${context.tender_context.close_date}` : ""}

When answering, reference this specific tender and provide targeted advice.`;
    }
    // Add BOQ context if present
    if (context.boq_context) {
        prompt += `

## BOQ Context
This conversation is about pricing/BOQ for a tender with ${context.boq_context.total_items} line items.
Focus on pricing strategy, margin recommendations, and risk assessment.`;
    }
    // Add competitiveness score if available
    if (context.competitiveness_score) {
        prompt += `

## User's Current Competitiveness Score
Overall: ${(context.competitiveness_score.overall_score * 100).toFixed(0)}%
- Documentation: ${(context.competitiveness_score.documentation_score * 100).toFixed(0)}%
- Compliance: ${(context.competitiveness_score.compliance_score * 100).toFixed(0)}%
- Experience: ${(context.competitiveness_score.experience_score * 100).toFixed(0)}%

Use this to tailor advice about improving their competitiveness.`;
    }
    return prompt;
}
function buildStrategyGenerationPrompt(strategyType, tenderAnalysis, userContext) {
    const basePrompt = `Generate a comprehensive ${strategyType} strategy for this tender submission.

## Tender Information
${JSON.stringify(tenderAnalysis.tender_summary || {}, null, 2)}

## Evaluation Criteria
${JSON.stringify(tenderAnalysis.evaluation || {}, null, 2)}

## Compliance Requirements
${JSON.stringify(tenderAnalysis.compliance_summary || {}, null, 2)}

## User's Current Capabilities
${userContext.user_preferences ? JSON.stringify({
        cidb_grading: userContext.user_preferences.cidb_grading,
        bee_level: userContext.user_preferences.bee_level,
        experience_level: userContext.user_preferences.experience_level,
        past_wins: userContext.user_preferences.past_tender_wins,
        past_losses: userContext.user_preferences.past_tender_losses
    }, null, 2) : "Not available"}

## Company Profile
${userContext.company_profile ? JSON.stringify(userContext.company_profile, null, 2) : "Not available"}`;
    const strategyInstructions = {
        bid: `
Generate a complete bid strategy including:
1. Bid viability analysis (should we bid?)
2. SWOT analysis for this tender
3. Compliance checklist with status
4. Supplier/subcontractor recommendations
5. Pricing strategy overview
6. Submission checklist
7. Risk register with mitigation plans
8. Win probability assessment`,
        pricing: `
Generate a detailed pricing strategy including:
1. Recommended pricing approach (cost-plus, competitive, value)
2. Margin recommendations by item category
3. Risk pricing factors
4. Competitive positioning advice
5. Areas for cost optimization
6. Contingency recommendations
7. Payment term considerations
8. Potential price negotiation points`,
        compliance: `
Generate a compliance strategy including:
1. All mandatory requirements mapped to user capabilities
2. Gap analysis with remediation actions
3. Document checklist with deadlines
4. Risk of non-compliance assessment
5. Alternative compliance approaches
6. Certification/registration requirements
7. Timeline for compliance preparation`,
        negotiation: `
Generate a negotiation strategy including:
1. Key negotiation points
2. Best Alternative to Negotiated Agreement (BATNA)
3. Concession strategy
4. Value propositions to emphasize
5. Potential objections and responses
6. Win-win opportunities
7. Relationship building approaches`,
        general: `
Generate a general tender strategy overview including:
1. Executive summary
2. Key success factors
3. Resource requirements
4. Timeline and milestones
5. Team responsibilities
6. Risk overview
7. Go/No-Go recommendation`
    };
    return basePrompt + strategyInstructions[strategyType] + `

Respond with a valid JSON object matching the StrategyContent interface with all sections populated.
Be specific, actionable, and realistic in your recommendations.
Reference actual tender requirements and user capabilities.`;
}
}),
"[project]/lib/engines/strategist/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// ============================================
// AI TENDER STRATEGIST ENGINE - MAIN ENTRY
// ============================================
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/types.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/constants.ts [app-route] (ecmascript)");
// Services
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$strategist$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/services/strategist-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$opportunity$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/services/opportunity-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$learning$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/services/learning-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$alert$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/services/alert-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$competitiveness$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/services/competitiveness-service.ts [app-route] (ecmascript)");
// Prompts
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$prompts$2f$strategist$2d$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/prompts/strategist-prompts.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/lib/engines/orchestrator/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================
// ENGINE ORCHESTRATOR - CENTRAL INTEGRATION
// ============================================
__turbopack_context__.s([
    "EngineOrchestrator",
    ()=>EngineOrchestrator,
    "engineOrchestrator",
    ()=>engineOrchestrator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/engines/documind/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/engines/tenders/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$services$2f$tender$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/tenders/services/tender-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/engines/strategist/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$opportunity$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/services/opportunity-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$competitiveness$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/services/competitiveness-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$strategist$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/strategist/services/strategist-service.ts [app-route] (ecmascript)");
;
;
;
class EngineOrchestrator {
    // Services expose static methods; call them directly (no instances required)
    /**
   * Process a scraped tender through all engines
   * Flow: Tenders Engine (validate/normalize) -> Documind (process docs) -> Strategist (analyze)
   */ async processScrapedTender(tender, userId) {
        try {
            console.log("[v0] Orchestrator: Processing scraped tender:", tender.title);
            // Step 1: Tenders Engine - Validate and normalize
            console.log("[v0] Orchestrator: Step 1 - Validating tender data...");
            const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["validateTender"])(tender);
            console.log("[v0] Orchestrator: Validation result:", {
                score: validation.score,
                isValid: validation.isValid,
                errors: validation.errors?.length || 0
            });
            console.log(`[v0] Orchestrator: Processing tender - Score: ${validation.score}`);
            const normalizedTender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["normalizeTenderData"])(tender);
            // Step 2: Documind Engine - Process documents if available
            const processedDocuments = [];
            if (tender.document_urls && tender.document_urls.length > 0) {
                console.log(`[v0] Orchestrator: Step 2 - Processing ${tender.document_urls.length} documents...`);
                for (const docUrl of tender.document_urls.slice(0, 3)){
                    // Limit to 3 docs for performance
                    try {
                        const url = typeof docUrl === "string" ? docUrl : docUrl.url;
                        const response = await fetch(url);
                        const buffer = await response.arrayBuffer();
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["processDocument"])(buffer, "application/pdf", {
                            extract_images: false,
                            ocr_enabled: true
                        });
                        if (result.success && result.document) {
                            processedDocuments.push(result.document);
                            console.log(`[v0] Orchestrator: Document processed successfully: ${url}`);
                        }
                    } catch (docError) {
                        console.error("[v0] Orchestrator: Document processing failed:", docError);
                    }
                }
            }
            // Step 3: Strategist Engine - Create opportunities if user provided
            const opportunities = [];
            if (userId) {
                console.log("[v0] Orchestrator: Step 3 - Analyzing opportunities for user...");
                try {
                    const opportunity = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$opportunity$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpportunityService"].createOpportunity({
                        userId,
                        tenderId: tender.scraped_tender_id || tender.tender_reference || "",
                        tenderType: "scraped",
                        tenderTitle: normalizedTender.title,
                        tenderData: normalizedTender
                    });
                    if (opportunity) {
                        opportunities.push(opportunity);
                        console.log(`[v0] Orchestrator: Opportunity created with score: ${opportunity.match_score}`);
                    }
                } catch (oppError) {
                    console.error("[v0] Orchestrator: Opportunity creation failed:", oppError);
                }
            }
            return {
                success: true,
                tender: normalizedTender,
                validation,
                documents: processedDocuments,
                opportunities
            };
        } catch (error) {
            console.error("[v0] Orchestrator: Error processing scraped tender:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }
    /**
   * Process an uploaded document through all engines
   * Flow: Documind (extract) -> Tenders Engine (validate/normalize) -> Strategist (analyze)
   */ async processUploadedDocument(file, mimeType, userId) {
        try {
            console.log("[v0] Orchestrator: Processing uploaded document");
            // Step 1: Documind Engine - Extract content and fields
            console.log("[v0] Orchestrator: Step 1 - Extracting document content...");
            const docResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$documind$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["processDocument"])(file, mimeType, {
                extract_images: false,
                ocr_enabled: true
            });
            if (!docResult.success || !docResult.document) {
                return {
                    success: false,
                    error: docResult.error?.message || "Document processing failed"
                };
            }
            const document = docResult.document;
            console.log(`[v0] Orchestrator: Document processed - ${document.pages.length} pages, ${document.form_fields?.length || 0} form fields`);
            // Step 2: Tenders Engine - Extract tender data from document
            console.log("[v0] Orchestrator: Step 2 - Extracting tender data from document...");
            const extractedTender = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$services$2f$tender$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TenderService"].extractTenderFromDocument(document);
            if (!extractedTender) {
                console.warn("[v0] Orchestrator: Could not extract tender data from document");
                return {
                    success: true,
                    document,
                    error: "Could not identify tender fields in document"
                };
            }
            // Step 3: Tenders Engine - Validate extracted data
            console.log("[v0] Orchestrator: Step 3 - Validating extracted tender data...");
            const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["validateTender"])(extractedTender);
            const normalizedTender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$tenders$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["normalizeTenderData"])(extractedTender);
            console.log(`[v0] Orchestrator: Tender extracted - Score: ${validation.score}`);
            return {
                success: true,
                document,
                extractedTenderData: normalizedTender,
                validation
            };
        } catch (error) {
            console.error("[v0] Orchestrator: Error processing uploaded document:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }
    /**
   * Enrich a tender with strategic analysis
   * Flow: Strategist Engine (competitiveness + recommendations)
   */ async enrichTenderWithStrategy(tenderId, tenderType, userId) {
        try {
            console.log(`[v0] Orchestrator: Enriching tender ${tenderId} with strategy for user ${userId}`);
            // Step 1: Calculate competitiveness score
            console.log("[v0] Orchestrator: Step 1 - Calculating competitiveness...");
            const competitiveness = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$competitiveness$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CompetitivenessService"].calculateScore({
                userId,
                tenderId,
                tenderType
            });
            // Step 2: Generate recommendations
            console.log("[v0] Orchestrator: Step 2 - Generating strategic recommendations...");
            const recommendations = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$strategist$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StrategistService"].generateRecommendations({
                userId,
                tenderId,
                tenderType,
                competitiveness
            });
            // Step 3: Find related opportunities
            console.log("[v0] Orchestrator: Step 3 - Finding related opportunities...");
            const opportunities = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$strategist$2f$services$2f$opportunity$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OpportunityService"].findSimilar({
                userId,
                tenderId,
                tenderType
            });
            return {
                success: true,
                competitiveness,
                opportunities,
                recommendations
            };
        } catch (error) {
            console.error("[v0] Orchestrator: Error enriching tender with strategy:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }
}
const engineOrchestrator = new EngineOrchestrator();
}),
"[project]/app/api/test/orchestrator/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$orchestrator$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engines/orchestrator/index.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        console.log("[v0] Test Orchestrator: running smoke test");
        const mockTender = {
            tender_reference: `TEST-${Date.now()}`,
            title: "Test Tender for Orchestrator",
            description: "This is a synthetic tender used for smoke testing the orchestrator"
        };
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engines$2f$orchestrator$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["engineOrchestrator"].processScrapedTender(mockTender);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            result
        });
    } catch (error) {
        console.error("[v0] Test Orchestrator: error", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__683c5cfa._.js.map