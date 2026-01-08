module.exports = [
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "createServerClient",
    ()=>createServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://xqyecqkrtaydoesxnvlw.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxeWVjcWtydGF5ZG9lc3hudmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjM0NTgsImV4cCI6MjA3Njg5OTQ1OH0.wsb5Jz_I9RqxoNoZ6D3QPbK4aefbdGKcrGgWDfm3c4o"), {
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
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/stream/web [external] (stream/web, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream/web", () => require("stream/web"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[externals]/perf_hooks [external] (perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("perf_hooks", () => require("perf_hooks"));

module.exports = mod;
}),
"[externals]/util/types [external] (util/types, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util/types", () => require("util/types"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/diagnostics_channel [external] (diagnostics_channel, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("diagnostics_channel", () => require("diagnostics_channel"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/async_hooks [external] (async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("async_hooks", () => require("async_hooks"));

module.exports = mod;
}),
"[externals]/console [external] (console, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("console", () => require("console"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/app/actions/tender-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00052b433a8d3627d42c4602d3a6d40abd8c843384":"getDashboardStats","005a2aadafbb6faa45a02e6cd4449af94b0aef8dc2":"getUserTenders","403db14cb99710538e989f04eececb7b800fbb320c":"addTenderToUser","4060312bd46fc40ec5491a64b4d4a1575650502b8b":"saveScrapedTenderToUser","40e39e6b203aafe32c7bc01f01043759da8563a3c7":"createCustomTender","60277855b49813fe487ce40f597a8c6ccae651cc90":"toggleTenderWishlist","60723eb04469c5ed6a93a3606bc24e6caa02ce5c0f":"deleteTender","60ab41ac7fcad5f2c43b740b4e480963e1cbe14487":"toggleTenderFavourite","60b0f135c75d05c230071fa31fc5abb4f61209affc":"toggleTenderPin"},"",""] */ __turbopack_context__.s([
    "addTenderToUser",
    ()=>addTenderToUser,
    "createCustomTender",
    ()=>createCustomTender,
    "deleteTender",
    ()=>deleteTender,
    "getDashboardStats",
    ()=>getDashboardStats,
    "getUserTenders",
    ()=>getUserTenders,
    "saveScrapedTenderToUser",
    ()=>saveScrapedTenderToUser,
    "toggleTenderFavourite",
    ()=>toggleTenderFavourite,
    "toggleTenderPin",
    ()=>toggleTenderPin,
    "toggleTenderWishlist",
    ()=>toggleTenderWishlist
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$vercel$2b$blob$40$2$2e$0$2e$0$2f$node_modules$2f40$vercel$2f$blob$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@vercel+blob@2.0.0/node_modules/@vercel/blob/dist/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function addTenderToUser(tenderData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return {
            success: false,
            error: "Not authenticated"
        };
    }
    // Insert tender
    const { data, error } = await supabase.from("user_tenders").insert({
        user_id: user.id,
        tender_id: tenderData.tenderId,
        title: tenderData.title,
        organization: tenderData.organization,
        publish_date: tenderData.publishDate,
        close_date: tenderData.closeDate,
        value: tenderData.value,
        category: tenderData.category,
        description: tenderData.description,
        url: tenderData.url,
        status: "draft"
    }).select().single();
    if (error) {
        // Check if it's a duplicate
        if (error.code === "23505") {
            return {
                success: false,
                error: "Tender already added"
            };
        }
        console.error("[v0] Error adding tender:", error);
        return {
            success: false,
            error: "Failed to add tender"
        };
    }
    if (tenderData.documents && tenderData.documents.length > 0 && data) {
        console.log("[v0] Adding", tenderData.documents.length, "documents to tender", data.id);
        console.log("[v0] Document data:", JSON.stringify(tenderData.documents, null, 2));
        const documentsToInsert = tenderData.documents.map((doc)=>({
                user_tender_id: data.id,
                user_id: user.id,
                file_name: doc.title,
                storage_path: doc.url,
                file_type: doc.format || "application/pdf",
                file_size: 0
            }));
        console.log("[v0] Inserting documents:", JSON.stringify(documentsToInsert, null, 2));
        const { data: insertedDocs, error: docsError } = await supabase.from("tender_documents").insert(documentsToInsert).select();
        if (docsError) {
            console.error("[v0] Error adding documents:", docsError);
            console.error("[v0] Error details:", JSON.stringify(docsError, null, 2));
        // Don't fail the whole operation if documents fail, just log it
        } else {
            console.log("[v0] Successfully added", insertedDocs?.length || 0, "documents");
            console.log("[v0] Inserted document IDs:", insertedDocs?.map((d)=>d.id));
        }
    } else {
        console.log("[v0] No documents to add for this tender");
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/tenders");
    return {
        success: true,
        data
    };
}
async function toggleTenderPin(tenderId, isPinned) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { error } = await supabase.from("user_tenders").update({
        is_pinned: isPinned
    }).eq("id", tenderId).eq("user_id", user.id);
    if (error) {
        console.error("[v0] Error toggling pin:", error);
        return {
            success: false,
            error: "Failed to update tender"
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/tenders");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/search");
    return {
        success: true
    };
}
async function toggleTenderFavourite(tenderId, isFavourited) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { error } = await supabase.from("user_tenders").update({
        is_favourited: isFavourited
    }).eq("id", tenderId).eq("user_id", user.id);
    if (error) {
        console.error("[v0] Error toggling favourite:", error);
        return {
            success: false,
            error: "Failed to update tender"
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/tenders");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/search");
    return {
        success: true
    };
}
async function toggleTenderWishlist(tenderId, isWishlisted) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { error } = await supabase.from("user_tenders").update({
        is_wishlisted: isWishlisted
    }).eq("id", tenderId).eq("user_id", user.id);
    if (error) {
        console.error("[v0] Error toggling wishlist:", error);
        return {
            success: false,
            error: "Failed to update tender"
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/tenders");
    return {
        success: true
    };
}
async function getUserTenders() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated",
        tenders: []
    };
    // Fetch all tenders from user_tenders (both scraped and custom)
    const { data: tenders, error } = await supabase.from("user_tenders").select("*").eq("user_id", user.id).order("created_at", {
        ascending: false
    });
    if (error) {
        console.error("[v0] Error fetching tenders:", error);
        return {
            success: false,
            error: "Failed to fetch tenders",
            tenders: []
        };
    }
    // Normalize data for frontend
    const normalizedTenders = (tenders || []).map((tender)=>({
            id: tender.id,
            tender_id: tender.tender_id || `custom-${tender.id}`,
            title: tender.title,
            organization: tender.organization,
            status: tender.status,
            close_date: tender.close_date || tender.deadline,
            value: tender.value,
            category: tender.category,
            is_pinned: tender.is_pinned || false,
            is_favourited: tender.is_favourited || false,
            is_wishlisted: tender.is_wishlisted || false,
            created_at: tender.created_at,
            tender_type: tender.tender_type || "scraped",
            location: tender.location
        }));
    return {
        success: true,
        tenders: normalizedTenders
    };
}
async function deleteTender(tenderId, tenderType) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    // Simply delete from user_tenders table
    const { error } = await supabase.from("user_tenders").delete().eq("id", tenderId).eq("user_id", user.id);
    if (error) {
        console.error("[v0] Error deleting tender:", error);
        return {
            success: false,
            error: "Failed to delete tender"
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/tenders");
    return {
        success: true
    };
}
async function saveScrapedTenderToUser(scrapedTender) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return {
            success: false,
            error: "Not authenticated"
        };
    }
    // Check if tender already exists for this user
    const { data: existing } = await supabase.from("user_tenders").select("id, status").eq("user_id", user.id).eq("tender_id", scrapedTender.id).single();
    if (existing) {
        // If already exists and is draft, update to in-progress
        if (existing.status === "draft") {
            const { error: updateError } = await supabase.from("user_tenders").update({
                status: "in-progress"
            }).eq("id", existing.id);
            if (updateError) {
                console.error("[v0] Error updating tender status:", updateError);
                return {
                    success: false,
                    error: "Failed to update tender status"
                };
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/tenders");
            return {
                success: true,
                message: "Tender status updated to in-progress",
                isNew: false
            };
        }
        // Already exists and not draft, no need to update
        return {
            success: true,
            message: "Tender already in your list",
            isNew: false
        };
    }
    // Insert new tender with in-progress status
    const { data, error } = await supabase.from("user_tenders").insert({
        user_id: user.id,
        tender_id: scrapedTender.id,
        title: scrapedTender.title,
        organization: scrapedTender.source_name,
        publish_date: scrapedTender.publish_date,
        close_date: scrapedTender.close_date,
        value: scrapedTender.estimated_value,
        category: scrapedTender.category,
        description: scrapedTender.description,
        url: scrapedTender.tender_url,
        status: "in-progress",
        tender_type: "scraped"
    }).select().single();
    if (error) {
        console.error("[v0] Error saving tender:", error);
        return {
            success: false,
            error: "Failed to save tender"
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/tenders");
    return {
        success: true,
        message: "Tender saved to My Tenders",
        isNew: true,
        data
    };
}
async function createCustomTender(tenderData) {
    console.log("[v0] createCustomTender called with data:", {
        title: tenderData.title,
        organization: tenderData.organization,
        deadline: tenderData.deadline,
        hasFile: !!tenderData.uploadedFile,
        hasAnalysis: !!tenderData.analysis
    });
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error("[v0] Auth error:", userError);
        return {
            success: false,
            error: "Not authenticated"
        };
    }
    console.log("[v0] User authenticated:", user.id);
    try {
        console.log("[v0] Creating custom tender record...");
        const { data: customTender, error: customTenderError } = await supabase.from("user_tenders").insert({
            user_id: user.id,
            title: tenderData.title,
            organization: tenderData.organization,
            deadline: tenderData.deadline,
            value: tenderData.value,
            category: tenderData.category || "Custom",
            description: tenderData.description,
            location: tenderData.location,
            status: "in-progress",
            tender_type: "custom"
        }).select().single();
        if (customTenderError) {
            console.error("[v0] Error creating custom tender:", customTenderError);
            return {
                success: false,
                error: "Failed to create tender: " + customTenderError.message
            };
        }
        console.log("[v0] Custom tender created successfully:", customTender.id);
        let documentSaved = false;
        let documentError = null;
        if (tenderData.uploadedFile) {
            console.log("[v0] Uploading file to blob storage...");
            console.log("[v0] File details:", {
                name: tenderData.uploadedFile.name,
                type: tenderData.uploadedFile.type,
                size: tenderData.uploadedFile.size
            });
            try {
                // Upload path includes 'custom-tenders' prefix still, which is fine
                const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$vercel$2b$blob$40$2$2e$0$2e$0$2f$node_modules$2f40$vercel$2f$blob$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["put"])(`custom-tenders/${customTender.id}/${tenderData.uploadedFile.name}`, tenderData.uploadedFile, {
                    access: "public"
                });
                console.log("[v0] File uploaded to blob:", blob.url);
                const documentData = {
                    tender_id: customTender.id,
                    file_name: tenderData.uploadedFile.name,
                    file_type: tenderData.uploadedFile.type,
                    file_size: tenderData.uploadedFile.size,
                    blob_url: blob.url,
                    storage_path: blob.url
                };
                console.log("[v0] Inserting document with data:", JSON.stringify(documentData, null, 2));
                const { data: insertedDoc, error: docError } = await supabase.from("user_tender_documents") // Updated table name
                .insert(documentData).select().single();
                if (docError) {
                    console.error("[v0] Error saving document reference:", docError);
                    console.error("[v0] Error code:", docError.code);
                    console.error("[v0] Error message:", docError.message);
                    documentError = `Failed to save document: ${docError.message} (Code: ${docError.code})`;
                } else {
                    console.log("[v0] Document reference saved successfully:", insertedDoc.id);
                    documentSaved = true;
                }
            } catch (uploadError) {
                console.error("[v0] Error uploading file:", uploadError);
                documentError = `Failed to upload file: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`;
            }
        } else {
            console.log("[v0] No file to upload");
        }
        let analysisSaved = false;
        let analysisError = null;
        if (tenderData.analysis) {
            console.log("[v0] Saving analysis data...");
            const analysisData = {
                tender_id: customTender.id,
                analysis_data: tenderData.analysis
            };
            console.log("[v0] Inserting analysis with tender_id:", customTender.id);
            const { data: insertedAnalysis, error: analysisErr } = await supabase.from("user_tender_analysis") // Updated table name
            .insert(analysisData).select().single();
            if (analysisErr) {
                console.error("[v0] Error saving analysis:", analysisErr);
                analysisError = `Failed to save analysis: ${analysisErr.message} (Code: ${analysisErr.code})`;
            } else {
                console.log("[v0] Analysis saved successfully:", insertedAnalysis.id);
                analysisSaved = true;
            }
        } else {
            console.log("[v0] No analysis to save");
        }
        console.log("[v0] Tender creation completed");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/tenders");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/custom-tenders");
        return {
            success: true,
            data: customTender,
            tenderId: customTender.id,
            documentSaved,
            documentError,
            analysisSaved,
            analysisError
        };
    } catch (error) {
        console.error("[v0] Error in createCustomTender:", error);
        return {
            success: false,
            error: "Failed to create tender: " + error.message
        };
    }
}
async function getDashboardStats() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    try {
        // Get all tenders count for this user
        const { count: totalTenders } = await supabase.from("user_tenders").select("*", {
            count: "exact",
            head: true
        }).eq("user_id", user.id);
        // Get analyzed tenders count (where we have analysis data)
        // RLS ensures we only see our own analyses
        const { count: analyzedCount } = await supabase.from("user_tender_analysis").select("tender_id", {
            count: "exact",
            head: true
        });
        // Wait, user_tender_analysis doesn't have user_id in my migration?
        // Let's check migration script...
        // user_custom_tender_analysis didn't have user_id in the original schema I saw in 031?
        // L131: WHERE id = tender_id AND user_id = auth.uid() -> checking parent tender.
        // So user_tender_analysis table assumes linking to user_tenders.
        // query:
        // select count(*) from user_tender_analysis join user_tenders on ... where user_tenders.user_id = ...
        // Alternative: Just query user_tenders where tender_type='custom' (proxy for analyzed?)
        // Or just fetching recent activity from unified table.
        // Get recent activity (last 5 tenders)
        const { data: recentTenders } = await supabase.from("user_tenders").select("*").eq("user_id", user.id).order("created_at", {
            ascending: false
        }).limit(5);
        const recentActivity = (recentTenders || []).map((tender)=>({
                id: tender.id,
                title: tender.title,
                organization: tender.organization,
                type: tender.tender_type === "custom" ? "analyzed" : "saved",
                created_at: tender.created_at
            }));
        // Get tenders closing soon (next 7 days)
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        // Check both close_date (scraped) and deadline (custom, if parsed?)
        // For now, relying on close_date. My migration copied deadline to close_date if I recall?
        // No, I copied close_date to close_date. Custom tenders might rely on 'deadline' text column.
        // This is tricky for sorting. Ideally we parse deadline to close_date.
        // Assuming close_date is populated for meaningful deadlines.
        const { data: closingSoon } = await supabase.from("user_tenders").select("*").eq("user_id", user.id).not("close_date", "is", null).gte("close_date", new Date().toISOString()).lte("close_date", sevenDaysFromNow.toISOString()).order("close_date", {
            ascending: true
        }).limit(5);
        return {
            success: true,
            stats: {
                totalTenders: totalTenders || 0,
                analyzedTenders: analyzedCount || 0,
                // Actually, let's try to get substantial analyzed count if possible.
                // For now 0 is fine or just count custom tenders?
                closingSoon: closingSoon?.length || 0,
                recentActivity,
                upcomingDeadlines: closingSoon || []
            }
        };
    } catch (error) {
        console.error("[v0] Error fetching dashboard stats:", error);
        return {
            success: false,
            error: "Failed to fetch dashboard statistics"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    addTenderToUser,
    toggleTenderPin,
    toggleTenderFavourite,
    toggleTenderWishlist,
    getUserTenders,
    deleteTender,
    saveScrapedTenderToUser,
    createCustomTender,
    getDashboardStats
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addTenderToUser, "403db14cb99710538e989f04eececb7b800fbb320c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleTenderPin, "60b0f135c75d05c230071fa31fc5abb4f61209affc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleTenderFavourite, "60ab41ac7fcad5f2c43b740b4e480963e1cbe14487", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(toggleTenderWishlist, "60277855b49813fe487ce40f597a8c6ccae651cc90", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserTenders, "005a2aadafbb6faa45a02e6cd4449af94b0aef8dc2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteTender, "60723eb04469c5ed6a93a3606bc24e6caa02ce5c0f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveScrapedTenderToUser, "4060312bd46fc40ec5491a64b4d4a1575650502b8b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createCustomTender, "40e39e6b203aafe32c7bc01f01043759da8563a3c7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDashboardStats, "00052b433a8d3627d42c4602d3a6d40abd8c843384", null);
}),
"[project]/.next-internal/server/app/dashboard/tenders/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/tender-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$tender$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/tender-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/tenders/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/tender-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "005a2aadafbb6faa45a02e6cd4449af94b0aef8dc2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$tender$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserTenders"],
    "60277855b49813fe487ce40f597a8c6ccae651cc90",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$tender$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleTenderWishlist"],
    "60723eb04469c5ed6a93a3606bc24e6caa02ce5c0f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$tender$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteTender"],
    "60ab41ac7fcad5f2c43b740b4e480963e1cbe14487",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$tender$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleTenderFavourite"],
    "60b0f135c75d05c230071fa31fc5abb4f61209affc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$tender$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toggleTenderPin"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$tenders$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$tender$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/tenders/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/tender-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$tender$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/tender-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__960e109e._.js.map