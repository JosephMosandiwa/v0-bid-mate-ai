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
"[project]/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient,
    "createClient",
    ()=>createClient,
    "createServerClient",
    ()=>createServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+supabase-js@2.89.0/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
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
function createAdminClient() {
    const url = ("TURBOPACK compile-time value", "https://xqyecqkrtaydoesxnvlw.supabase.co");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
    if (!url || !key) {
        throw new Error('SUPABASE service role key not configured');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, key);
}
}),
"[project]/app/api/tenders/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
function isValidUUID(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
}
async function GET(request, { params }) {
    try {
        const { id } = await params;
        if (!isValidUUID(id)) {
            console.log("[v0] Invalid UUID format:", id);
            return Response.json({
                error: "Invalid tender ID format"
            }, {
                status: 400
            });
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // 1. Try to fetch from user_tenders (Unified entry point for saved tenders)
        const { data: userTender, error: userError } = await supabase.from("user_tenders").select("*").eq("id", id).single();
        if (userTender && !userError) {
            // It is a saved tender (Custom or Scraped)
            if (userTender.tender_type === 'custom') {
                // Fetch custom analysis and docs
                const { data: analysis } = await supabase.from('user_tender_analysis').select('analysis_data').eq('tender_id', id).single();
                const { data: documents } = await supabase.from('user_tender_documents').select('*').eq('tender_id', id);
                return Response.json({
                    tender: userTender,
                    analysis: analysis?.analysis_data || null,
                    documents: documents || []
                });
            } else {
                // It is a saved scraped tender
                // Fetch original scraped data for extra details
                // userTender.tender_id points to scraped_tenders.id
                const { data: scrapedTender } = await supabase.from('scraped_tenders').select('*').eq('id', userTender.tender_id).single();
                // Fetch original documents
                const { data: documents } = await supabase.from('tender_documents').select('*').eq('tender_id', userTender.tender_id);
                // Fetch user-uploaded documents for this tender
                const { data: userDocuments } = await supabase.from('user_tender_documents').select('*').eq('tender_id', id) // id is the user_tenders(id)
                ;
                // Fetch original analysis
                const { data: analysis } = await supabase.from('tender_analysis').select('analysis_data').eq('tender_id', userTender.tender_id).single();
                // Fetch user analysis overrides?
                const { data: userAnalysis } = await supabase.from('user_tender_analysis').select('analysis_data').eq('tender_id', id).single();
                // Merge data: userTender takes precedence for status/metadata, scrapedTender for content
                const mergedTender = {
                    ...scrapedTender,
                    ...userTender
                };
                return Response.json({
                    tender: mergedTender,
                    analysis: userAnalysis?.analysis_data || analysis?.analysis_data || null,
                    documents: [
                        ...documents || [],
                        ...userDocuments || []
                    ]
                });
            }
        }
        // 2. Fallback: Check scraped_tenders directly
        // This supports viewing details of a tender that hasn't been saved to "My Tenders" yet
        const { data: scrapedTenderRaw, error: scrapedError } = await supabase.from("scraped_tenders").select("*").eq("id", id).single();
        if (scrapedTenderRaw && !scrapedError) {
            const { data: documents } = await supabase.from('tender_documents').select('*').eq('tender_id', id);
            const { data: analysis } = await supabase.from('tender_analysis').select('analysis_data').eq('tender_id', id).single();
            return Response.json({
                tender: scrapedTenderRaw,
                analysis: analysis?.analysis_data || null,
                documents: documents || []
            });
        }
        return Response.json({
            error: "Tender not found"
        }, {
            status: 404
        });
    } catch (error) {
        console.error("[API] Error fetching tender:", error);
        return Response.json({
            error: "Failed to fetch tender"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7b59cd99._.js.map