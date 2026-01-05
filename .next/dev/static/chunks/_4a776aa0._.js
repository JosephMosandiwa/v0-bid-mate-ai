(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center px-6 [.border-t]:pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/tabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tabs$40$1$2e$1$2e$2_$5f$aecb9a04e8952838299b9569584c9283$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-tabs@1.1.2__aecb9a04e8952838299b9569584c9283/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Tabs({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tabs$40$1$2e$1$2e$2_$5f$aecb9a04e8952838299b9569584c9283$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "tabs",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-2', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Tabs;
function TabsList({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tabs$40$1$2e$1$2e$2_$5f$aecb9a04e8952838299b9569584c9283$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"], {
        "data-slot": "tabs-list",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c1 = TabsList;
function TabsTrigger({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tabs$40$1$2e$1$2e$2_$5f$aecb9a04e8952838299b9569584c9283$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "tabs-trigger",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c2 = TabsTrigger;
function TabsContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tabs$40$1$2e$1$2e$2_$5f$aecb9a04e8952838299b9569584c9283$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        "data-slot": "tabs-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex-1 outline-none', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tabs.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c3 = TabsContent;
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Tabs");
__turbopack_context__.k.register(_c1, "TabsList");
__turbopack_context__.k.register(_c2, "TabsTrigger");
__turbopack_context__.k.register(_c3, "TabsContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alert",
    ()=>Alert,
    "AlertDescription",
    ()=>AlertDescription,
    "AlertTitle",
    ()=>AlertTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const alertVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current', {
    variants: {
        variant: {
            default: 'bg-card text-card-foreground',
            destructive: 'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
function Alert({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert",
        role: "alert",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(alertVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c = Alert;
function AlertTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c1 = AlertTitle;
function AlertDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "alert-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_c2 = AlertDescription;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Alert");
__turbopack_context__.k.register(_c1, "AlertTitle");
__turbopack_context__.k.register(_c2, "AlertDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:eb3dbc [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40ef9db1733294d72c0e09cb151c53a191e03e0228":"uploadTenderDocument"},"app/actions/document-actions.ts",""] */ __turbopack_context__.s([
    "uploadTenderDocument",
    ()=>uploadTenderDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var uploadTenderDocument = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40ef9db1733294d72c0e09cb151c53a191e03e0228", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "uploadTenderDocument"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZG9jdW1lbnQtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIlxyXG5cclxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSBcIkAvbGliL3N1cGFiYXNlL3NlcnZlclwiXHJcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoIH0gZnJvbSBcIm5leHQvY2FjaGVcIlxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwbG9hZFRlbmRlckRvY3VtZW50KGZvcm1EYXRhOiBGb3JtRGF0YSkge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZGF0YTogeyB1c2VyIH0sXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcbiAgaWYgKCF1c2VyKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB9XHJcblxyXG4gIGNvbnN0IGZpbGUgPSBmb3JtRGF0YS5nZXQoXCJmaWxlXCIpIGFzIEZpbGVcclxuICBjb25zdCB1c2VyVGVuZGVySWQgPSBmb3JtRGF0YS5nZXQoXCJ1c2VyVGVuZGVySWRcIikgYXMgc3RyaW5nXHJcblxyXG4gIGlmICghZmlsZSB8fCAhdXNlclRlbmRlcklkKSB7XHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmlsZSBhbmQgdGVuZGVyIElEIGFyZSByZXF1aXJlZFwiIH1cclxuICB9XHJcblxyXG4gIC8vIFVwbG9hZCBmaWxlIHRvIFN1cGFiYXNlIFN0b3JhZ2VcclxuICBjb25zdCBmaWxlRXh0ID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKS5wb3AoKVxyXG4gIGNvbnN0IGZpbGVOYW1lID0gYCR7dXNlci5pZH0vJHt1c2VyVGVuZGVySWR9LyR7RGF0ZS5ub3coKX0uJHtmaWxlRXh0fWBcclxuXHJcbiAgY29uc3QgeyBkYXRhOiB1cGxvYWREYXRhLCBlcnJvcjogdXBsb2FkRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcclxuICAgIC5mcm9tKFwidGVuZGVyLWRvY3VtZW50c1wiKVxyXG4gICAgLnVwbG9hZChmaWxlTmFtZSwgZmlsZSlcclxuXHJcbiAgaWYgKHVwbG9hZEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciB1cGxvYWRpbmcgZmlsZTpcIiwgdXBsb2FkRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHVwbG9hZCBmaWxlXCIgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2F2ZSBkb2N1bWVudCBtZXRhZGF0YSB0byBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5pbnNlcnQoe1xyXG4gICAgICB1c2VyX3RlbmRlcl9pZDogdXNlclRlbmRlcklkLFxyXG4gICAgICB1c2VyX2lkOiB1c2VyLmlkLFxyXG4gICAgICBmaWxlX25hbWU6IGZpbGUubmFtZSxcclxuICAgICAgZmlsZV9zaXplOiBmaWxlLnNpemUsXHJcbiAgICAgIGZpbGVfdHlwZTogZmlsZS50eXBlLFxyXG4gICAgICBzdG9yYWdlX3BhdGg6IHVwbG9hZERhdGEucGF0aCxcclxuICAgIH0pXHJcbiAgICAuc2VsZWN0KClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIHNhdmluZyBkb2N1bWVudCBtZXRhZGF0YTpcIiwgZXJyb3IpXHJcbiAgICAvLyBDbGVhbiB1cCB1cGxvYWRlZCBmaWxlXHJcbiAgICBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZmlsZU5hbWVdKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBzYXZlIGRvY3VtZW50XCIgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVycy8ke3VzZXJUZW5kZXJJZH1gKVxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGEgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VGVuZGVyRG9jdW1lbnRzKHVzZXJUZW5kZXJJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiLCBkb2N1bWVudHM6IFtdIH1cclxuXHJcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidGVuZGVyX2RvY3VtZW50c1wiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5lcShcInVzZXJfdGVuZGVyX2lkXCIsIHVzZXJUZW5kZXJJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZmV0Y2hpbmcgZG9jdW1lbnRzOlwiLCBlcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggZG9jdW1lbnRzXCIsIGRvY3VtZW50czogW10gfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZG9jdW1lbnRzOiBkYXRhIHx8IFtdIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IG1ldGFkYXRhXHJcbiAgY29uc3QgeyBkYXRhOiBkb2N1bWVudCwgZXJyb3I6IGRvY0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZG9jRXJyb3IgfHwgIWRvY3VtZW50KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBmZXRjaGluZyBkb2N1bWVudDpcIiwgZG9jRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRG9jdW1lbnQgbm90IGZvdW5kXCIgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaXNFeHRlcm5hbFVybCA9IGRvY3VtZW50LnN0b3JhZ2VfcGF0aC5zdGFydHNXaXRoKFwiaHR0cDovL1wiKSB8fCBkb2N1bWVudC5zdG9yYWdlX3BhdGguc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpXHJcblxyXG4gIGlmIChpc0V4dGVybmFsVXJsKSB7XHJcbiAgICAvLyBGb3IgZXh0ZXJuYWwgZG9jdW1lbnRzIChmcm9tIGVUZW5kZXJzIEFQSSksIHJldHVybiB0aGUgVVJMIGRpcmVjdGx5XHJcbiAgICBjb25zb2xlLmxvZyhcIlt2MF0gUmV0dXJuaW5nIGV4dGVybmFsIGRvY3VtZW50IFVSTDpcIiwgZG9jdW1lbnQuc3RvcmFnZV9wYXRoKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgdXJsOiBkb2N1bWVudC5zdG9yYWdlX3BhdGgsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG4gIH1cclxuXHJcbiAgLy8gRm9yIGRvY3VtZW50cyBzdG9yZWQgaW4gU3VwYWJhc2UgU3RvcmFnZSwgY3JlYXRlIGEgc2lnbmVkIFVSTFxyXG4gIGNvbnN0IHsgZGF0YTogdXJsRGF0YSwgZXJyb3I6IHVybEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlXHJcbiAgICAuZnJvbShcInRlbmRlci1kb2N1bWVudHNcIilcclxuICAgIC5jcmVhdGVTaWduZWRVcmwoZG9jdW1lbnQuc3RvcmFnZV9wYXRoLCA2MCkgLy8gNjAgc2Vjb25kcyBleHBpcnlcclxuXHJcbiAgaWYgKHVybEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBjcmVhdGluZyBzaWduZWQgVVJMOlwiLCB1cmxFcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZ2VuZXJhdGUgZG93bmxvYWQgbGlua1wiIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHVybDogdXJsRGF0YS5zaWduZWRVcmwsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IHRvIGRlbGV0ZSBmcm9tIHN0b3JhZ2VcclxuICBjb25zdCB7IGRhdGE6IGRvY3VtZW50LCBlcnJvcjogZG9jRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5zZWxlY3QoXCIqXCIpXHJcbiAgICAuZXEoXCJpZFwiLCBkb2N1bWVudElkKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmIChkb2NFcnJvciB8fCAhZG9jdW1lbnQpIHtcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJEb2N1bWVudCBub3QgZm91bmRcIiB9XHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBzdG9yYWdlXHJcbiAgY29uc3QgeyBlcnJvcjogc3RvcmFnZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZG9jdW1lbnQuc3RvcmFnZV9wYXRoXSlcclxuXHJcbiAgaWYgKHN0b3JhZ2VFcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZnJvbSBzdG9yYWdlOlwiLCBzdG9yYWdlRXJyb3IpXHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpLmRlbGV0ZSgpLmVxKFwiaWRcIiwgZG9jdW1lbnRJZCkuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZG9jdW1lbnQ6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBkZWxldGUgZG9jdW1lbnRcIiB9XHJcbiAgfVxyXG5cclxuICByZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC90ZW5kZXJzLyR7ZG9jdW1lbnQudXNlcl90ZW5kZXJfaWR9YClcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFuYWx5emVEb2N1bWVudChkb2N1bWVudElkOiBzdHJpbmcsIGFuYWx5c2lzOiBhbnkpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIFNhdmluZyBhbmFseXNpcyBmb3IgZG9jdW1lbnQ6XCIsIGRvY3VtZW50SWQpXHJcblxyXG4gICAgLy8gU2F2ZSBhbmFseXNpcyB0byBkYXRhYmFzZVxyXG4gICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAgIC51cGRhdGUoeyBhaV9hbmFseXNpczogYW5hbHlzaXMgfSlcclxuICAgICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG5cclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBzYXZpbmcgYW5hbHlzaXM6XCIsIGVycm9yKVxyXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIEFuYWx5c2lzIHNhdmVkIHN1Y2Nlc3NmdWxseVwiKVxyXG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVyc2ApXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBhbmFseXNpcyB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIGluIGFuYWx5emVEb2N1bWVudDpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiNlNBS3NCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:dbf0b3 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40e730bd9e7b9dcaf380994d707fbdbdd248707c70":"getTenderDocuments"},"app/actions/document-actions.ts",""] */ __turbopack_context__.s([
    "getTenderDocuments",
    ()=>getTenderDocuments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getTenderDocuments = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40e730bd9e7b9dcaf380994d707fbdbdd248707c70", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getTenderDocuments"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZG9jdW1lbnQtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIlxyXG5cclxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSBcIkAvbGliL3N1cGFiYXNlL3NlcnZlclwiXHJcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoIH0gZnJvbSBcIm5leHQvY2FjaGVcIlxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwbG9hZFRlbmRlckRvY3VtZW50KGZvcm1EYXRhOiBGb3JtRGF0YSkge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZGF0YTogeyB1c2VyIH0sXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcbiAgaWYgKCF1c2VyKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB9XHJcblxyXG4gIGNvbnN0IGZpbGUgPSBmb3JtRGF0YS5nZXQoXCJmaWxlXCIpIGFzIEZpbGVcclxuICBjb25zdCB1c2VyVGVuZGVySWQgPSBmb3JtRGF0YS5nZXQoXCJ1c2VyVGVuZGVySWRcIikgYXMgc3RyaW5nXHJcblxyXG4gIGlmICghZmlsZSB8fCAhdXNlclRlbmRlcklkKSB7XHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmlsZSBhbmQgdGVuZGVyIElEIGFyZSByZXF1aXJlZFwiIH1cclxuICB9XHJcblxyXG4gIC8vIFVwbG9hZCBmaWxlIHRvIFN1cGFiYXNlIFN0b3JhZ2VcclxuICBjb25zdCBmaWxlRXh0ID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKS5wb3AoKVxyXG4gIGNvbnN0IGZpbGVOYW1lID0gYCR7dXNlci5pZH0vJHt1c2VyVGVuZGVySWR9LyR7RGF0ZS5ub3coKX0uJHtmaWxlRXh0fWBcclxuXHJcbiAgY29uc3QgeyBkYXRhOiB1cGxvYWREYXRhLCBlcnJvcjogdXBsb2FkRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcclxuICAgIC5mcm9tKFwidGVuZGVyLWRvY3VtZW50c1wiKVxyXG4gICAgLnVwbG9hZChmaWxlTmFtZSwgZmlsZSlcclxuXHJcbiAgaWYgKHVwbG9hZEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciB1cGxvYWRpbmcgZmlsZTpcIiwgdXBsb2FkRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHVwbG9hZCBmaWxlXCIgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2F2ZSBkb2N1bWVudCBtZXRhZGF0YSB0byBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5pbnNlcnQoe1xyXG4gICAgICB1c2VyX3RlbmRlcl9pZDogdXNlclRlbmRlcklkLFxyXG4gICAgICB1c2VyX2lkOiB1c2VyLmlkLFxyXG4gICAgICBmaWxlX25hbWU6IGZpbGUubmFtZSxcclxuICAgICAgZmlsZV9zaXplOiBmaWxlLnNpemUsXHJcbiAgICAgIGZpbGVfdHlwZTogZmlsZS50eXBlLFxyXG4gICAgICBzdG9yYWdlX3BhdGg6IHVwbG9hZERhdGEucGF0aCxcclxuICAgIH0pXHJcbiAgICAuc2VsZWN0KClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIHNhdmluZyBkb2N1bWVudCBtZXRhZGF0YTpcIiwgZXJyb3IpXHJcbiAgICAvLyBDbGVhbiB1cCB1cGxvYWRlZCBmaWxlXHJcbiAgICBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZmlsZU5hbWVdKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBzYXZlIGRvY3VtZW50XCIgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVycy8ke3VzZXJUZW5kZXJJZH1gKVxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGEgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VGVuZGVyRG9jdW1lbnRzKHVzZXJUZW5kZXJJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiLCBkb2N1bWVudHM6IFtdIH1cclxuXHJcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidGVuZGVyX2RvY3VtZW50c1wiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5lcShcInVzZXJfdGVuZGVyX2lkXCIsIHVzZXJUZW5kZXJJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZmV0Y2hpbmcgZG9jdW1lbnRzOlwiLCBlcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggZG9jdW1lbnRzXCIsIGRvY3VtZW50czogW10gfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZG9jdW1lbnRzOiBkYXRhIHx8IFtdIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IG1ldGFkYXRhXHJcbiAgY29uc3QgeyBkYXRhOiBkb2N1bWVudCwgZXJyb3I6IGRvY0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZG9jRXJyb3IgfHwgIWRvY3VtZW50KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBmZXRjaGluZyBkb2N1bWVudDpcIiwgZG9jRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRG9jdW1lbnQgbm90IGZvdW5kXCIgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaXNFeHRlcm5hbFVybCA9IGRvY3VtZW50LnN0b3JhZ2VfcGF0aC5zdGFydHNXaXRoKFwiaHR0cDovL1wiKSB8fCBkb2N1bWVudC5zdG9yYWdlX3BhdGguc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpXHJcblxyXG4gIGlmIChpc0V4dGVybmFsVXJsKSB7XHJcbiAgICAvLyBGb3IgZXh0ZXJuYWwgZG9jdW1lbnRzIChmcm9tIGVUZW5kZXJzIEFQSSksIHJldHVybiB0aGUgVVJMIGRpcmVjdGx5XHJcbiAgICBjb25zb2xlLmxvZyhcIlt2MF0gUmV0dXJuaW5nIGV4dGVybmFsIGRvY3VtZW50IFVSTDpcIiwgZG9jdW1lbnQuc3RvcmFnZV9wYXRoKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgdXJsOiBkb2N1bWVudC5zdG9yYWdlX3BhdGgsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG4gIH1cclxuXHJcbiAgLy8gRm9yIGRvY3VtZW50cyBzdG9yZWQgaW4gU3VwYWJhc2UgU3RvcmFnZSwgY3JlYXRlIGEgc2lnbmVkIFVSTFxyXG4gIGNvbnN0IHsgZGF0YTogdXJsRGF0YSwgZXJyb3I6IHVybEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlXHJcbiAgICAuZnJvbShcInRlbmRlci1kb2N1bWVudHNcIilcclxuICAgIC5jcmVhdGVTaWduZWRVcmwoZG9jdW1lbnQuc3RvcmFnZV9wYXRoLCA2MCkgLy8gNjAgc2Vjb25kcyBleHBpcnlcclxuXHJcbiAgaWYgKHVybEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBjcmVhdGluZyBzaWduZWQgVVJMOlwiLCB1cmxFcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZ2VuZXJhdGUgZG93bmxvYWQgbGlua1wiIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHVybDogdXJsRGF0YS5zaWduZWRVcmwsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IHRvIGRlbGV0ZSBmcm9tIHN0b3JhZ2VcclxuICBjb25zdCB7IGRhdGE6IGRvY3VtZW50LCBlcnJvcjogZG9jRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5zZWxlY3QoXCIqXCIpXHJcbiAgICAuZXEoXCJpZFwiLCBkb2N1bWVudElkKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmIChkb2NFcnJvciB8fCAhZG9jdW1lbnQpIHtcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJEb2N1bWVudCBub3QgZm91bmRcIiB9XHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBzdG9yYWdlXHJcbiAgY29uc3QgeyBlcnJvcjogc3RvcmFnZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZG9jdW1lbnQuc3RvcmFnZV9wYXRoXSlcclxuXHJcbiAgaWYgKHN0b3JhZ2VFcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZnJvbSBzdG9yYWdlOlwiLCBzdG9yYWdlRXJyb3IpXHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpLmRlbGV0ZSgpLmVxKFwiaWRcIiwgZG9jdW1lbnRJZCkuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZG9jdW1lbnQ6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBkZWxldGUgZG9jdW1lbnRcIiB9XHJcbiAgfVxyXG5cclxuICByZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC90ZW5kZXJzLyR7ZG9jdW1lbnQudXNlcl90ZW5kZXJfaWR9YClcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFuYWx5emVEb2N1bWVudChkb2N1bWVudElkOiBzdHJpbmcsIGFuYWx5c2lzOiBhbnkpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIFNhdmluZyBhbmFseXNpcyBmb3IgZG9jdW1lbnQ6XCIsIGRvY3VtZW50SWQpXHJcblxyXG4gICAgLy8gU2F2ZSBhbmFseXNpcyB0byBkYXRhYmFzZVxyXG4gICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAgIC51cGRhdGUoeyBhaV9hbmFseXNpczogYW5hbHlzaXMgfSlcclxuICAgICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG5cclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBzYXZpbmcgYW5hbHlzaXM6XCIsIGVycm9yKVxyXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIEFuYWx5c2lzIHNhdmVkIHN1Y2Nlc3NmdWxseVwiKVxyXG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVyc2ApXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBhbmFseXNpcyB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIGluIGFuYWx5emVEb2N1bWVudDpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiMlNBMERzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:922a82 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40bd4349e69bf94346d5748771c6f820ca4b7a614b":"downloadTenderDocument"},"app/actions/document-actions.ts",""] */ __turbopack_context__.s([
    "downloadTenderDocument",
    ()=>downloadTenderDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var downloadTenderDocument = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40bd4349e69bf94346d5748771c6f820ca4b7a614b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "downloadTenderDocument"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZG9jdW1lbnQtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIlxyXG5cclxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSBcIkAvbGliL3N1cGFiYXNlL3NlcnZlclwiXHJcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoIH0gZnJvbSBcIm5leHQvY2FjaGVcIlxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwbG9hZFRlbmRlckRvY3VtZW50KGZvcm1EYXRhOiBGb3JtRGF0YSkge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZGF0YTogeyB1c2VyIH0sXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcbiAgaWYgKCF1c2VyKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB9XHJcblxyXG4gIGNvbnN0IGZpbGUgPSBmb3JtRGF0YS5nZXQoXCJmaWxlXCIpIGFzIEZpbGVcclxuICBjb25zdCB1c2VyVGVuZGVySWQgPSBmb3JtRGF0YS5nZXQoXCJ1c2VyVGVuZGVySWRcIikgYXMgc3RyaW5nXHJcblxyXG4gIGlmICghZmlsZSB8fCAhdXNlclRlbmRlcklkKSB7XHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmlsZSBhbmQgdGVuZGVyIElEIGFyZSByZXF1aXJlZFwiIH1cclxuICB9XHJcblxyXG4gIC8vIFVwbG9hZCBmaWxlIHRvIFN1cGFiYXNlIFN0b3JhZ2VcclxuICBjb25zdCBmaWxlRXh0ID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKS5wb3AoKVxyXG4gIGNvbnN0IGZpbGVOYW1lID0gYCR7dXNlci5pZH0vJHt1c2VyVGVuZGVySWR9LyR7RGF0ZS5ub3coKX0uJHtmaWxlRXh0fWBcclxuXHJcbiAgY29uc3QgeyBkYXRhOiB1cGxvYWREYXRhLCBlcnJvcjogdXBsb2FkRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcclxuICAgIC5mcm9tKFwidGVuZGVyLWRvY3VtZW50c1wiKVxyXG4gICAgLnVwbG9hZChmaWxlTmFtZSwgZmlsZSlcclxuXHJcbiAgaWYgKHVwbG9hZEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciB1cGxvYWRpbmcgZmlsZTpcIiwgdXBsb2FkRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHVwbG9hZCBmaWxlXCIgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2F2ZSBkb2N1bWVudCBtZXRhZGF0YSB0byBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5pbnNlcnQoe1xyXG4gICAgICB1c2VyX3RlbmRlcl9pZDogdXNlclRlbmRlcklkLFxyXG4gICAgICB1c2VyX2lkOiB1c2VyLmlkLFxyXG4gICAgICBmaWxlX25hbWU6IGZpbGUubmFtZSxcclxuICAgICAgZmlsZV9zaXplOiBmaWxlLnNpemUsXHJcbiAgICAgIGZpbGVfdHlwZTogZmlsZS50eXBlLFxyXG4gICAgICBzdG9yYWdlX3BhdGg6IHVwbG9hZERhdGEucGF0aCxcclxuICAgIH0pXHJcbiAgICAuc2VsZWN0KClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIHNhdmluZyBkb2N1bWVudCBtZXRhZGF0YTpcIiwgZXJyb3IpXHJcbiAgICAvLyBDbGVhbiB1cCB1cGxvYWRlZCBmaWxlXHJcbiAgICBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZmlsZU5hbWVdKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBzYXZlIGRvY3VtZW50XCIgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVycy8ke3VzZXJUZW5kZXJJZH1gKVxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGEgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VGVuZGVyRG9jdW1lbnRzKHVzZXJUZW5kZXJJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiLCBkb2N1bWVudHM6IFtdIH1cclxuXHJcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidGVuZGVyX2RvY3VtZW50c1wiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5lcShcInVzZXJfdGVuZGVyX2lkXCIsIHVzZXJUZW5kZXJJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZmV0Y2hpbmcgZG9jdW1lbnRzOlwiLCBlcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggZG9jdW1lbnRzXCIsIGRvY3VtZW50czogW10gfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZG9jdW1lbnRzOiBkYXRhIHx8IFtdIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IG1ldGFkYXRhXHJcbiAgY29uc3QgeyBkYXRhOiBkb2N1bWVudCwgZXJyb3I6IGRvY0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZG9jRXJyb3IgfHwgIWRvY3VtZW50KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBmZXRjaGluZyBkb2N1bWVudDpcIiwgZG9jRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRG9jdW1lbnQgbm90IGZvdW5kXCIgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaXNFeHRlcm5hbFVybCA9IGRvY3VtZW50LnN0b3JhZ2VfcGF0aC5zdGFydHNXaXRoKFwiaHR0cDovL1wiKSB8fCBkb2N1bWVudC5zdG9yYWdlX3BhdGguc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpXHJcblxyXG4gIGlmIChpc0V4dGVybmFsVXJsKSB7XHJcbiAgICAvLyBGb3IgZXh0ZXJuYWwgZG9jdW1lbnRzIChmcm9tIGVUZW5kZXJzIEFQSSksIHJldHVybiB0aGUgVVJMIGRpcmVjdGx5XHJcbiAgICBjb25zb2xlLmxvZyhcIlt2MF0gUmV0dXJuaW5nIGV4dGVybmFsIGRvY3VtZW50IFVSTDpcIiwgZG9jdW1lbnQuc3RvcmFnZV9wYXRoKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgdXJsOiBkb2N1bWVudC5zdG9yYWdlX3BhdGgsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG4gIH1cclxuXHJcbiAgLy8gRm9yIGRvY3VtZW50cyBzdG9yZWQgaW4gU3VwYWJhc2UgU3RvcmFnZSwgY3JlYXRlIGEgc2lnbmVkIFVSTFxyXG4gIGNvbnN0IHsgZGF0YTogdXJsRGF0YSwgZXJyb3I6IHVybEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlXHJcbiAgICAuZnJvbShcInRlbmRlci1kb2N1bWVudHNcIilcclxuICAgIC5jcmVhdGVTaWduZWRVcmwoZG9jdW1lbnQuc3RvcmFnZV9wYXRoLCA2MCkgLy8gNjAgc2Vjb25kcyBleHBpcnlcclxuXHJcbiAgaWYgKHVybEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBjcmVhdGluZyBzaWduZWQgVVJMOlwiLCB1cmxFcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZ2VuZXJhdGUgZG93bmxvYWQgbGlua1wiIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHVybDogdXJsRGF0YS5zaWduZWRVcmwsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IHRvIGRlbGV0ZSBmcm9tIHN0b3JhZ2VcclxuICBjb25zdCB7IGRhdGE6IGRvY3VtZW50LCBlcnJvcjogZG9jRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5zZWxlY3QoXCIqXCIpXHJcbiAgICAuZXEoXCJpZFwiLCBkb2N1bWVudElkKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmIChkb2NFcnJvciB8fCAhZG9jdW1lbnQpIHtcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJEb2N1bWVudCBub3QgZm91bmRcIiB9XHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBzdG9yYWdlXHJcbiAgY29uc3QgeyBlcnJvcjogc3RvcmFnZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZG9jdW1lbnQuc3RvcmFnZV9wYXRoXSlcclxuXHJcbiAgaWYgKHN0b3JhZ2VFcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZnJvbSBzdG9yYWdlOlwiLCBzdG9yYWdlRXJyb3IpXHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpLmRlbGV0ZSgpLmVxKFwiaWRcIiwgZG9jdW1lbnRJZCkuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZG9jdW1lbnQ6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBkZWxldGUgZG9jdW1lbnRcIiB9XHJcbiAgfVxyXG5cclxuICByZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC90ZW5kZXJzLyR7ZG9jdW1lbnQudXNlcl90ZW5kZXJfaWR9YClcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFuYWx5emVEb2N1bWVudChkb2N1bWVudElkOiBzdHJpbmcsIGFuYWx5c2lzOiBhbnkpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIFNhdmluZyBhbmFseXNpcyBmb3IgZG9jdW1lbnQ6XCIsIGRvY3VtZW50SWQpXHJcblxyXG4gICAgLy8gU2F2ZSBhbmFseXNpcyB0byBkYXRhYmFzZVxyXG4gICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAgIC51cGRhdGUoeyBhaV9hbmFseXNpczogYW5hbHlzaXMgfSlcclxuICAgICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG5cclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBzYXZpbmcgYW5hbHlzaXM6XCIsIGVycm9yKVxyXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIEFuYWx5c2lzIHNhdmVkIHN1Y2Nlc3NmdWxseVwiKVxyXG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVyc2ApXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBhbmFseXNpcyB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIGluIGFuYWx5emVEb2N1bWVudDpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiK1NBaUZzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:9c0c72 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"407f88633cdf843df2a278a67732dc7d45cca80b1a":"deleteTenderDocument"},"app/actions/document-actions.ts",""] */ __turbopack_context__.s([
    "deleteTenderDocument",
    ()=>deleteTenderDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var deleteTenderDocument = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("407f88633cdf843df2a278a67732dc7d45cca80b1a", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteTenderDocument"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZG9jdW1lbnQtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIlxyXG5cclxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSBcIkAvbGliL3N1cGFiYXNlL3NlcnZlclwiXHJcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoIH0gZnJvbSBcIm5leHQvY2FjaGVcIlxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwbG9hZFRlbmRlckRvY3VtZW50KGZvcm1EYXRhOiBGb3JtRGF0YSkge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZGF0YTogeyB1c2VyIH0sXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcbiAgaWYgKCF1c2VyKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB9XHJcblxyXG4gIGNvbnN0IGZpbGUgPSBmb3JtRGF0YS5nZXQoXCJmaWxlXCIpIGFzIEZpbGVcclxuICBjb25zdCB1c2VyVGVuZGVySWQgPSBmb3JtRGF0YS5nZXQoXCJ1c2VyVGVuZGVySWRcIikgYXMgc3RyaW5nXHJcblxyXG4gIGlmICghZmlsZSB8fCAhdXNlclRlbmRlcklkKSB7XHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmlsZSBhbmQgdGVuZGVyIElEIGFyZSByZXF1aXJlZFwiIH1cclxuICB9XHJcblxyXG4gIC8vIFVwbG9hZCBmaWxlIHRvIFN1cGFiYXNlIFN0b3JhZ2VcclxuICBjb25zdCBmaWxlRXh0ID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKS5wb3AoKVxyXG4gIGNvbnN0IGZpbGVOYW1lID0gYCR7dXNlci5pZH0vJHt1c2VyVGVuZGVySWR9LyR7RGF0ZS5ub3coKX0uJHtmaWxlRXh0fWBcclxuXHJcbiAgY29uc3QgeyBkYXRhOiB1cGxvYWREYXRhLCBlcnJvcjogdXBsb2FkRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcclxuICAgIC5mcm9tKFwidGVuZGVyLWRvY3VtZW50c1wiKVxyXG4gICAgLnVwbG9hZChmaWxlTmFtZSwgZmlsZSlcclxuXHJcbiAgaWYgKHVwbG9hZEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciB1cGxvYWRpbmcgZmlsZTpcIiwgdXBsb2FkRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHVwbG9hZCBmaWxlXCIgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2F2ZSBkb2N1bWVudCBtZXRhZGF0YSB0byBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5pbnNlcnQoe1xyXG4gICAgICB1c2VyX3RlbmRlcl9pZDogdXNlclRlbmRlcklkLFxyXG4gICAgICB1c2VyX2lkOiB1c2VyLmlkLFxyXG4gICAgICBmaWxlX25hbWU6IGZpbGUubmFtZSxcclxuICAgICAgZmlsZV9zaXplOiBmaWxlLnNpemUsXHJcbiAgICAgIGZpbGVfdHlwZTogZmlsZS50eXBlLFxyXG4gICAgICBzdG9yYWdlX3BhdGg6IHVwbG9hZERhdGEucGF0aCxcclxuICAgIH0pXHJcbiAgICAuc2VsZWN0KClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIHNhdmluZyBkb2N1bWVudCBtZXRhZGF0YTpcIiwgZXJyb3IpXHJcbiAgICAvLyBDbGVhbiB1cCB1cGxvYWRlZCBmaWxlXHJcbiAgICBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZmlsZU5hbWVdKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBzYXZlIGRvY3VtZW50XCIgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVycy8ke3VzZXJUZW5kZXJJZH1gKVxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGEgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VGVuZGVyRG9jdW1lbnRzKHVzZXJUZW5kZXJJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiLCBkb2N1bWVudHM6IFtdIH1cclxuXHJcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidGVuZGVyX2RvY3VtZW50c1wiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5lcShcInVzZXJfdGVuZGVyX2lkXCIsIHVzZXJUZW5kZXJJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZmV0Y2hpbmcgZG9jdW1lbnRzOlwiLCBlcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggZG9jdW1lbnRzXCIsIGRvY3VtZW50czogW10gfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZG9jdW1lbnRzOiBkYXRhIHx8IFtdIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IG1ldGFkYXRhXHJcbiAgY29uc3QgeyBkYXRhOiBkb2N1bWVudCwgZXJyb3I6IGRvY0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZG9jRXJyb3IgfHwgIWRvY3VtZW50KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBmZXRjaGluZyBkb2N1bWVudDpcIiwgZG9jRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRG9jdW1lbnQgbm90IGZvdW5kXCIgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaXNFeHRlcm5hbFVybCA9IGRvY3VtZW50LnN0b3JhZ2VfcGF0aC5zdGFydHNXaXRoKFwiaHR0cDovL1wiKSB8fCBkb2N1bWVudC5zdG9yYWdlX3BhdGguc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpXHJcblxyXG4gIGlmIChpc0V4dGVybmFsVXJsKSB7XHJcbiAgICAvLyBGb3IgZXh0ZXJuYWwgZG9jdW1lbnRzIChmcm9tIGVUZW5kZXJzIEFQSSksIHJldHVybiB0aGUgVVJMIGRpcmVjdGx5XHJcbiAgICBjb25zb2xlLmxvZyhcIlt2MF0gUmV0dXJuaW5nIGV4dGVybmFsIGRvY3VtZW50IFVSTDpcIiwgZG9jdW1lbnQuc3RvcmFnZV9wYXRoKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgdXJsOiBkb2N1bWVudC5zdG9yYWdlX3BhdGgsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG4gIH1cclxuXHJcbiAgLy8gRm9yIGRvY3VtZW50cyBzdG9yZWQgaW4gU3VwYWJhc2UgU3RvcmFnZSwgY3JlYXRlIGEgc2lnbmVkIFVSTFxyXG4gIGNvbnN0IHsgZGF0YTogdXJsRGF0YSwgZXJyb3I6IHVybEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlXHJcbiAgICAuZnJvbShcInRlbmRlci1kb2N1bWVudHNcIilcclxuICAgIC5jcmVhdGVTaWduZWRVcmwoZG9jdW1lbnQuc3RvcmFnZV9wYXRoLCA2MCkgLy8gNjAgc2Vjb25kcyBleHBpcnlcclxuXHJcbiAgaWYgKHVybEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBjcmVhdGluZyBzaWduZWQgVVJMOlwiLCB1cmxFcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZ2VuZXJhdGUgZG93bmxvYWQgbGlua1wiIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHVybDogdXJsRGF0YS5zaWduZWRVcmwsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IHRvIGRlbGV0ZSBmcm9tIHN0b3JhZ2VcclxuICBjb25zdCB7IGRhdGE6IGRvY3VtZW50LCBlcnJvcjogZG9jRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5zZWxlY3QoXCIqXCIpXHJcbiAgICAuZXEoXCJpZFwiLCBkb2N1bWVudElkKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmIChkb2NFcnJvciB8fCAhZG9jdW1lbnQpIHtcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJEb2N1bWVudCBub3QgZm91bmRcIiB9XHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBzdG9yYWdlXHJcbiAgY29uc3QgeyBlcnJvcjogc3RvcmFnZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZG9jdW1lbnQuc3RvcmFnZV9wYXRoXSlcclxuXHJcbiAgaWYgKHN0b3JhZ2VFcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZnJvbSBzdG9yYWdlOlwiLCBzdG9yYWdlRXJyb3IpXHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpLmRlbGV0ZSgpLmVxKFwiaWRcIiwgZG9jdW1lbnRJZCkuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZG9jdW1lbnQ6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBkZWxldGUgZG9jdW1lbnRcIiB9XHJcbiAgfVxyXG5cclxuICByZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC90ZW5kZXJzLyR7ZG9jdW1lbnQudXNlcl90ZW5kZXJfaWR9YClcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFuYWx5emVEb2N1bWVudChkb2N1bWVudElkOiBzdHJpbmcsIGFuYWx5c2lzOiBhbnkpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIFNhdmluZyBhbmFseXNpcyBmb3IgZG9jdW1lbnQ6XCIsIGRvY3VtZW50SWQpXHJcblxyXG4gICAgLy8gU2F2ZSBhbmFseXNpcyB0byBkYXRhYmFzZVxyXG4gICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAgIC51cGRhdGUoeyBhaV9hbmFseXNpczogYW5hbHlzaXMgfSlcclxuICAgICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG5cclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBzYXZpbmcgYW5hbHlzaXM6XCIsIGVycm9yKVxyXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIEFuYWx5c2lzIHNhdmVkIHN1Y2Nlc3NmdWxseVwiKVxyXG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVyc2ApXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBhbmFseXNpcyB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIGluIGFuYWx5emVEb2N1bWVudDpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiNlNBMkhzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:d54cb4 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"6075536310bb9f61beb19224fe5c0ce35d37626c2b":"analyzeDocument"},"app/actions/document-actions.ts",""] */ __turbopack_context__.s([
    "analyzeDocument",
    ()=>analyzeDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var analyzeDocument = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("6075536310bb9f61beb19224fe5c0ce35d37626c2b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "analyzeDocument"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZG9jdW1lbnQtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIlxyXG5cclxuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSBcIkAvbGliL3N1cGFiYXNlL3NlcnZlclwiXHJcbmltcG9ydCB7IHJldmFsaWRhdGVQYXRoIH0gZnJvbSBcIm5leHQvY2FjaGVcIlxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwbG9hZFRlbmRlckRvY3VtZW50KGZvcm1EYXRhOiBGb3JtRGF0YSkge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZGF0YTogeyB1c2VyIH0sXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcbiAgaWYgKCF1c2VyKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB9XHJcblxyXG4gIGNvbnN0IGZpbGUgPSBmb3JtRGF0YS5nZXQoXCJmaWxlXCIpIGFzIEZpbGVcclxuICBjb25zdCB1c2VyVGVuZGVySWQgPSBmb3JtRGF0YS5nZXQoXCJ1c2VyVGVuZGVySWRcIikgYXMgc3RyaW5nXHJcblxyXG4gIGlmICghZmlsZSB8fCAhdXNlclRlbmRlcklkKSB7XHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmlsZSBhbmQgdGVuZGVyIElEIGFyZSByZXF1aXJlZFwiIH1cclxuICB9XHJcblxyXG4gIC8vIFVwbG9hZCBmaWxlIHRvIFN1cGFiYXNlIFN0b3JhZ2VcclxuICBjb25zdCBmaWxlRXh0ID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKS5wb3AoKVxyXG4gIGNvbnN0IGZpbGVOYW1lID0gYCR7dXNlci5pZH0vJHt1c2VyVGVuZGVySWR9LyR7RGF0ZS5ub3coKX0uJHtmaWxlRXh0fWBcclxuXHJcbiAgY29uc3QgeyBkYXRhOiB1cGxvYWREYXRhLCBlcnJvcjogdXBsb2FkRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLnN0b3JhZ2VcclxuICAgIC5mcm9tKFwidGVuZGVyLWRvY3VtZW50c1wiKVxyXG4gICAgLnVwbG9hZChmaWxlTmFtZSwgZmlsZSlcclxuXHJcbiAgaWYgKHVwbG9hZEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciB1cGxvYWRpbmcgZmlsZTpcIiwgdXBsb2FkRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHVwbG9hZCBmaWxlXCIgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2F2ZSBkb2N1bWVudCBtZXRhZGF0YSB0byBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5pbnNlcnQoe1xyXG4gICAgICB1c2VyX3RlbmRlcl9pZDogdXNlclRlbmRlcklkLFxyXG4gICAgICB1c2VyX2lkOiB1c2VyLmlkLFxyXG4gICAgICBmaWxlX25hbWU6IGZpbGUubmFtZSxcclxuICAgICAgZmlsZV9zaXplOiBmaWxlLnNpemUsXHJcbiAgICAgIGZpbGVfdHlwZTogZmlsZS50eXBlLFxyXG4gICAgICBzdG9yYWdlX3BhdGg6IHVwbG9hZERhdGEucGF0aCxcclxuICAgIH0pXHJcbiAgICAuc2VsZWN0KClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIHNhdmluZyBkb2N1bWVudCBtZXRhZGF0YTpcIiwgZXJyb3IpXHJcbiAgICAvLyBDbGVhbiB1cCB1cGxvYWRlZCBmaWxlXHJcbiAgICBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZmlsZU5hbWVdKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBzYXZlIGRvY3VtZW50XCIgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVycy8ke3VzZXJUZW5kZXJJZH1gKVxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGEgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VGVuZGVyRG9jdW1lbnRzKHVzZXJUZW5kZXJJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiLCBkb2N1bWVudHM6IFtdIH1cclxuXHJcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidGVuZGVyX2RvY3VtZW50c1wiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5lcShcInVzZXJfdGVuZGVyX2lkXCIsIHVzZXJUZW5kZXJJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZmV0Y2hpbmcgZG9jdW1lbnRzOlwiLCBlcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggZG9jdW1lbnRzXCIsIGRvY3VtZW50czogW10gfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZG9jdW1lbnRzOiBkYXRhIHx8IFtdIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IG1ldGFkYXRhXHJcbiAgY29uc3QgeyBkYXRhOiBkb2N1bWVudCwgZXJyb3I6IGRvY0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZG9jRXJyb3IgfHwgIWRvY3VtZW50KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBmZXRjaGluZyBkb2N1bWVudDpcIiwgZG9jRXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRG9jdW1lbnQgbm90IGZvdW5kXCIgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaXNFeHRlcm5hbFVybCA9IGRvY3VtZW50LnN0b3JhZ2VfcGF0aC5zdGFydHNXaXRoKFwiaHR0cDovL1wiKSB8fCBkb2N1bWVudC5zdG9yYWdlX3BhdGguc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpXHJcblxyXG4gIGlmIChpc0V4dGVybmFsVXJsKSB7XHJcbiAgICAvLyBGb3IgZXh0ZXJuYWwgZG9jdW1lbnRzIChmcm9tIGVUZW5kZXJzIEFQSSksIHJldHVybiB0aGUgVVJMIGRpcmVjdGx5XHJcbiAgICBjb25zb2xlLmxvZyhcIlt2MF0gUmV0dXJuaW5nIGV4dGVybmFsIGRvY3VtZW50IFVSTDpcIiwgZG9jdW1lbnQuc3RvcmFnZV9wYXRoKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgdXJsOiBkb2N1bWVudC5zdG9yYWdlX3BhdGgsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG4gIH1cclxuXHJcbiAgLy8gRm9yIGRvY3VtZW50cyBzdG9yZWQgaW4gU3VwYWJhc2UgU3RvcmFnZSwgY3JlYXRlIGEgc2lnbmVkIFVSTFxyXG4gIGNvbnN0IHsgZGF0YTogdXJsRGF0YSwgZXJyb3I6IHVybEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlXHJcbiAgICAuZnJvbShcInRlbmRlci1kb2N1bWVudHNcIilcclxuICAgIC5jcmVhdGVTaWduZWRVcmwoZG9jdW1lbnQuc3RvcmFnZV9wYXRoLCA2MCkgLy8gNjAgc2Vjb25kcyBleHBpcnlcclxuXHJcbiAgaWYgKHVybEVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBjcmVhdGluZyBzaWduZWQgVVJMOlwiLCB1cmxFcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZ2VuZXJhdGUgZG93bmxvYWQgbGlua1wiIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHVybDogdXJsRGF0YS5zaWduZWRVcmwsIGZpbGVOYW1lOiBkb2N1bWVudC5maWxlX25hbWUgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlVGVuZGVyRG9jdW1lbnQoZG9jdW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgLy8gR2V0IGRvY3VtZW50IHRvIGRlbGV0ZSBmcm9tIHN0b3JhZ2VcclxuICBjb25zdCB7IGRhdGE6IGRvY3VtZW50LCBlcnJvcjogZG9jRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInRlbmRlcl9kb2N1bWVudHNcIilcclxuICAgIC5zZWxlY3QoXCIqXCIpXHJcbiAgICAuZXEoXCJpZFwiLCBkb2N1bWVudElkKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmIChkb2NFcnJvciB8fCAhZG9jdW1lbnQpIHtcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJEb2N1bWVudCBub3QgZm91bmRcIiB9XHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBzdG9yYWdlXHJcbiAgY29uc3QgeyBlcnJvcjogc3RvcmFnZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5zdG9yYWdlLmZyb20oXCJ0ZW5kZXItZG9jdW1lbnRzXCIpLnJlbW92ZShbZG9jdW1lbnQuc3RvcmFnZV9wYXRoXSlcclxuXHJcbiAgaWYgKHN0b3JhZ2VFcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZnJvbSBzdG9yYWdlOlwiLCBzdG9yYWdlRXJyb3IpXHJcbiAgfVxyXG5cclxuICAvLyBEZWxldGUgZnJvbSBkYXRhYmFzZVxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpLmRlbGV0ZSgpLmVxKFwiaWRcIiwgZG9jdW1lbnRJZCkuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgZG9jdW1lbnQ6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBkZWxldGUgZG9jdW1lbnRcIiB9XHJcbiAgfVxyXG5cclxuICByZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC90ZW5kZXJzLyR7ZG9jdW1lbnQudXNlcl90ZW5kZXJfaWR9YClcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFuYWx5emVEb2N1bWVudChkb2N1bWVudElkOiBzdHJpbmcsIGFuYWx5c2lzOiBhbnkpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIFNhdmluZyBhbmFseXNpcyBmb3IgZG9jdW1lbnQ6XCIsIGRvY3VtZW50SWQpXHJcblxyXG4gICAgLy8gU2F2ZSBhbmFseXNpcyB0byBkYXRhYmFzZVxyXG4gICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJ0ZW5kZXJfZG9jdW1lbnRzXCIpXHJcbiAgICAgIC51cGRhdGUoeyBhaV9hbmFseXNpczogYW5hbHlzaXMgfSlcclxuICAgICAgLmVxKFwiaWRcIiwgZG9jdW1lbnRJZClcclxuICAgICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG5cclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBzYXZpbmcgYW5hbHlzaXM6XCIsIGVycm9yKVxyXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJbdjBdIEFuYWx5c2lzIHNhdmVkIHN1Y2Nlc3NmdWxseVwiKVxyXG4gICAgcmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvdGVuZGVyc2ApXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBhbmFseXNpcyB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIGluIGFuYWx5emVEb2N1bWVudDpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHNhdmUgYW5hbHlzaXNcIiB9XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoid1NBa0tzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Textarea;
;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$label$40$2$2e$1$2e$1_ac84efbbe8c0933b0bacc20ede1bf649$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-label@2.1.1_ac84efbbe8c0933b0bacc20ede1bf649/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$label$40$2$2e$1$2e$1_ac84efbbe8c0933b0bacc20ede1bf649$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Label;
;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-select@2.1._36ba2cbe27c4b7dd24654770c77788a3/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function Select({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "select",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Select;
function SelectGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        "data-slot": "select-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = SelectGroup;
function SelectValue({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"], {
        "data-slot": "select-value",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = SelectValue;
function SelectTrigger({ className, size = 'default', children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "select-trigger",
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                    className: "size-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c3 = SelectTrigger;
function SelectContent({ className, children, position = 'popper', ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "select-content",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md', position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1', className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_c4 = SelectContent;
function SelectLabel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        "data-slot": "select-label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground px-2 py-1.5 text-xs', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_c5 = SelectLabel;
function SelectItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "select-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute right-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/select.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_c6 = SelectItem;
function SelectSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "select-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-border pointer-events-none -mx-1 my-1 h-px', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_c7 = SelectSeparator;
function SelectScrollUpButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        "data-slot": "select-scroll-up-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex cursor-default items-center justify-center py-1', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 151,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
_c8 = SelectScrollUpButton;
function SelectScrollDownButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$1$2e$_36ba2cbe27c4b7dd24654770c77788a3$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        "data-slot": "select-scroll-down-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex cursor-default items-center justify-center py-1', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
_c9 = SelectScrollDownButton;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Select");
__turbopack_context__.k.register(_c1, "SelectGroup");
__turbopack_context__.k.register(_c2, "SelectValue");
__turbopack_context__.k.register(_c3, "SelectTrigger");
__turbopack_context__.k.register(_c4, "SelectContent");
__turbopack_context__.k.register(_c5, "SelectLabel");
__turbopack_context__.k.register(_c6, "SelectItem");
__turbopack_context__.k.register(_c7, "SelectSeparator");
__turbopack_context__.k.register(_c8, "SelectScrollUpButton");
__turbopack_context__.k.register(_c9, "SelectScrollDownButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$checkbox$40$1$2e$_3ac39a507e77d1fa2325a66bc462244e$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-checkbox@1._3ac39a507e77d1fa2325a66bc462244e/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function Checkbox({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$checkbox$40$1$2e$_3ac39a507e77d1fa2325a66bc462244e$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "checkbox",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$checkbox$40$1$2e$_3ac39a507e77d1fa2325a66bc462244e$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "checkbox-indicator",
            className: "flex items-center justify-center text-current transition-none",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                className: "size-3.5"
            }, void 0, false, {
                fileName: "[project]/components/ui/checkbox.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/checkbox.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/checkbox.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Checkbox;
;
var _c;
__turbopack_context__.k.register(_c, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/radio-group.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RadioGroup",
    ()=>RadioGroup,
    "RadioGroupItem",
    ()=>RadioGroupItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$radio$2d$group_ea77c853653b93d1467c3ae5fd777b55$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$radio$2d$group$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-radio-group_ea77c853653b93d1467c3ae5fd777b55/node_modules/@radix-ui/react-radio-group/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as CircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function RadioGroup({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$radio$2d$group_ea77c853653b93d1467c3ae5fd777b55$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$radio$2d$group$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "radio-group",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('grid gap-3', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/radio-group.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = RadioGroup;
function RadioGroupItem({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$radio$2d$group_ea77c853653b93d1467c3ae5fd777b55$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$radio$2d$group$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "radio-group-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$radio$2d$group_ea77c853653b93d1467c3ae5fd777b55$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$radio$2d$group$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "radio-group-indicator",
            className: "relative flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleIcon$3e$__["CircleIcon"], {
                className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2"
            }, void 0, false, {
                fileName: "[project]/components/ui/radio-group.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/radio-group.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/radio-group.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c1 = RadioGroupItem;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "RadioGroup");
__turbopack_context__.k.register(_c1, "RadioGroupItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils/currency.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Format a number as South African Rand (ZAR) currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string (e.g., "R 1,234,567.00")
 */ __turbopack_context__.s([
    "formatZAR",
    ()=>formatZAR,
    "parseZAR",
    ()=>parseZAR
]);
function formatZAR(amount, options) {
    const numAmount = typeof amount === "string" ? Number.parseFloat(amount.replace(/[^0-9.-]/g, "")) : amount;
    if (isNaN(numAmount)) {
        return "R 0";
    }
    const formatted = new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        minimumFractionDigits: options?.minimumFractionDigits ?? 0,
        maximumFractionDigits: options?.maximumFractionDigits ?? 2
    }).format(numAmount);
    // Intl.NumberFormat returns "ZAR 1,234" or "R1,234" depending on locale
    // We want consistent "R 1,234" format
    return formatted.replace(/ZAR\s?/, "R ").replace(/R(\d)/, "R $1");
}
function parseZAR(value) {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    return Number.parseFloat(cleaned) || 0;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:cf3a95 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4060312bd46fc40ec5491a64b4d4a1575650502b8b":"saveScrapedTenderToUser"},"app/actions/tender-actions.ts",""] */ __turbopack_context__.s([
    "saveScrapedTenderToUser",
    ()=>saveScrapedTenderToUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var saveScrapedTenderToUser = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4060312bd46fc40ec5491a64b4d4a1575650502b8b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "saveScrapedTenderToUser"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdGVuZGVyLWFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc2VydmVyXCJcclxuXHJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJAL2xpYi9zdXBhYmFzZS9zZXJ2ZXJcIlxyXG5pbXBvcnQgeyByZXZhbGlkYXRlUGF0aCB9IGZyb20gXCJuZXh0L2NhY2hlXCJcclxuaW1wb3J0IHsgcHV0IH0gZnJvbSBcIkB2ZXJjZWwvYmxvYlwiXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRlbmRlckRvY3VtZW50IHtcclxuICBpZD86IHN0cmluZ1xyXG4gIHRpdGxlOiBzdHJpbmdcclxuICB1cmw6IHN0cmluZ1xyXG4gIGRvY3VtZW50VHlwZT86IHN0cmluZ1xyXG4gIGZvcm1hdD86IHN0cmluZ1xyXG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGVuZGVyRGF0YSB7XHJcbiAgdGVuZGVySWQ6IHN0cmluZ1xyXG4gIHRpdGxlOiBzdHJpbmdcclxuICBvcmdhbml6YXRpb246IHN0cmluZ1xyXG4gIHB1Ymxpc2hEYXRlPzogc3RyaW5nXHJcbiAgY2xvc2VEYXRlPzogc3RyaW5nXHJcbiAgdmFsdWU/OiBzdHJpbmdcclxuICBjYXRlZ29yeT86IHN0cmluZ1xyXG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nXHJcbiAgdXJsPzogc3RyaW5nXHJcbiAgZG9jdW1lbnRzPzogVGVuZGVyRG9jdW1lbnRbXSAvLyBBZGQgZG9jdW1lbnRzIGFycmF5XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRUZW5kZXJUb1VzZXIodGVuZGVyRGF0YTogVGVuZGVyRGF0YSkge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgLy8gR2V0IGN1cnJlbnQgdXNlclxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gICAgZXJyb3I6IHVzZXJFcnJvcixcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuXHJcbiAgaWYgKHVzZXJFcnJvciB8fCAhdXNlcikge1xyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfVxyXG4gIH1cclxuXHJcbiAgLy8gSW5zZXJ0IHRlbmRlclxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInVzZXJfdGVuZGVyc1wiKVxyXG4gICAgLmluc2VydCh7XHJcbiAgICAgIHVzZXJfaWQ6IHVzZXIuaWQsXHJcbiAgICAgIHRlbmRlcl9pZDogdGVuZGVyRGF0YS50ZW5kZXJJZCxcclxuICAgICAgdGl0bGU6IHRlbmRlckRhdGEudGl0bGUsXHJcbiAgICAgIG9yZ2FuaXphdGlvbjogdGVuZGVyRGF0YS5vcmdhbml6YXRpb24sXHJcbiAgICAgIHB1Ymxpc2hfZGF0ZTogdGVuZGVyRGF0YS5wdWJsaXNoRGF0ZSxcclxuICAgICAgY2xvc2VfZGF0ZTogdGVuZGVyRGF0YS5jbG9zZURhdGUsXHJcbiAgICAgIHZhbHVlOiB0ZW5kZXJEYXRhLnZhbHVlLFxyXG4gICAgICBjYXRlZ29yeTogdGVuZGVyRGF0YS5jYXRlZ29yeSxcclxuICAgICAgZGVzY3JpcHRpb246IHRlbmRlckRhdGEuZGVzY3JpcHRpb24sXHJcbiAgICAgIHVybDogdGVuZGVyRGF0YS51cmwsXHJcbiAgICAgIHN0YXR1czogXCJkcmFmdFwiLFxyXG4gICAgfSlcclxuICAgIC5zZWxlY3QoKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgLy8gQ2hlY2sgaWYgaXQncyBhIGR1cGxpY2F0ZVxyXG4gICAgaWYgKGVycm9yLmNvZGUgPT09IFwiMjM1MDVcIikge1xyXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiVGVuZGVyIGFscmVhZHkgYWRkZWRcIiB9XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBhZGRpbmcgdGVuZGVyOlwiLCBlcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gYWRkIHRlbmRlclwiIH1cclxuICB9XHJcblxyXG4gIGlmICh0ZW5kZXJEYXRhLmRvY3VtZW50cyAmJiB0ZW5kZXJEYXRhLmRvY3VtZW50cy5sZW5ndGggPiAwICYmIGRhdGEpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiW3YwXSBBZGRpbmdcIiwgdGVuZGVyRGF0YS5kb2N1bWVudHMubGVuZ3RoLCBcImRvY3VtZW50cyB0byB0ZW5kZXJcIiwgZGF0YS5pZClcclxuICAgIGNvbnNvbGUubG9nKFwiW3YwXSBEb2N1bWVudCBkYXRhOlwiLCBKU09OLnN0cmluZ2lmeSh0ZW5kZXJEYXRhLmRvY3VtZW50cywgbnVsbCwgMikpXHJcblxyXG4gICAgY29uc3QgZG9jdW1lbnRzVG9JbnNlcnQgPSB0ZW5kZXJEYXRhLmRvY3VtZW50cy5tYXAoKGRvYykgPT4gKHtcclxuICAgICAgdXNlcl90ZW5kZXJfaWQ6IGRhdGEuaWQsIC8vIENoYW5nZWQgZnJvbSB0ZW5kZXJfaWRcclxuICAgICAgdXNlcl9pZDogdXNlci5pZCxcclxuICAgICAgZmlsZV9uYW1lOiBkb2MudGl0bGUsIC8vIENoYW5nZWQgZnJvbSBuYW1lXHJcbiAgICAgIHN0b3JhZ2VfcGF0aDogZG9jLnVybCwgLy8gQ2hhbmdlZCBmcm9tIGZpbGVfdXJsIC0gZXh0ZXJuYWwgVVJMcyBzdG9yZWQgYXMgc3RvcmFnZV9wYXRoXHJcbiAgICAgIGZpbGVfdHlwZTogZG9jLmZvcm1hdCB8fCBcImFwcGxpY2F0aW9uL3BkZlwiLFxyXG4gICAgICBmaWxlX3NpemU6IDAsIC8vIFVua25vd24gc2l6ZSBmb3IgZXh0ZXJuYWwgZG9jdW1lbnRzXHJcbiAgICAgIC8vIFJlbW92ZWQgZG9jdW1lbnRfdHlwZSBhbmQgZGVzY3JpcHRpb24gYXMgdGhleSBkb24ndCBleGlzdCBpbiBzY2hlbWFcclxuICAgIH0pKVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiW3YwXSBJbnNlcnRpbmcgZG9jdW1lbnRzOlwiLCBKU09OLnN0cmluZ2lmeShkb2N1bWVudHNUb0luc2VydCwgbnVsbCwgMikpXHJcblxyXG4gICAgY29uc3QgeyBkYXRhOiBpbnNlcnRlZERvY3MsIGVycm9yOiBkb2NzRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgIC5mcm9tKFwidGVuZGVyX2RvY3VtZW50c1wiKVxyXG4gICAgICAuaW5zZXJ0KGRvY3VtZW50c1RvSW5zZXJ0KVxyXG4gICAgICAuc2VsZWN0KClcclxuXHJcbiAgICBpZiAoZG9jc0Vycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIGFkZGluZyBkb2N1bWVudHM6XCIsIGRvY3NFcnJvcilcclxuICAgICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGV0YWlsczpcIiwgSlNPTi5zdHJpbmdpZnkoZG9jc0Vycm9yLCBudWxsLCAyKSlcclxuICAgICAgLy8gRG9uJ3QgZmFpbCB0aGUgd2hvbGUgb3BlcmF0aW9uIGlmIGRvY3VtZW50cyBmYWlsLCBqdXN0IGxvZyBpdFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coXCJbdjBdIFN1Y2Nlc3NmdWxseSBhZGRlZFwiLCBpbnNlcnRlZERvY3M/Lmxlbmd0aCB8fCAwLCBcImRvY3VtZW50c1wiKVxyXG4gICAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICBcIlt2MF0gSW5zZXJ0ZWQgZG9jdW1lbnQgSURzOlwiLFxyXG4gICAgICAgIGluc2VydGVkRG9jcz8ubWFwKChkKSA9PiBkLmlkKSxcclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIlt2MF0gTm8gZG9jdW1lbnRzIHRvIGFkZCBmb3IgdGhpcyB0ZW5kZXJcIilcclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC90ZW5kZXJzXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0b2dnbGVUZW5kZXJQaW4odGVuZGVySWQ6IHN0cmluZywgaXNQaW5uZWQ6IGJvb2xlYW4pIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfVxyXG5cclxuICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJ1c2VyX3RlbmRlcnNcIilcclxuICAgIC51cGRhdGUoeyBpc19waW5uZWQ6IGlzUGlubmVkIH0pXHJcbiAgICAuZXEoXCJpZFwiLCB0ZW5kZXJJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciB0b2dnbGluZyBwaW46XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byB1cGRhdGUgdGVuZGVyXCIgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL3RlbmRlcnNcIilcclxuICByZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvc2VhcmNoXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0b2dnbGVUZW5kZXJGYXZvdXJpdGUodGVuZGVySWQ6IHN0cmluZywgaXNGYXZvdXJpdGVkOiBib29sZWFuKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidXNlcl90ZW5kZXJzXCIpXHJcbiAgICAudXBkYXRlKHsgaXNfZmF2b3VyaXRlZDogaXNGYXZvdXJpdGVkIH0pXHJcbiAgICAuZXEoXCJpZFwiLCB0ZW5kZXJJZClcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciB0b2dnbGluZyBmYXZvdXJpdGU6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byB1cGRhdGUgdGVuZGVyXCIgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL3RlbmRlcnNcIilcclxuICByZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvc2VhcmNoXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0b2dnbGVUZW5kZXJXaXNobGlzdCh0ZW5kZXJJZDogc3RyaW5nLCBpc1dpc2hsaXN0ZWQ6IGJvb2xlYW4pIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfVxyXG5cclxuICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJ1c2VyX3RlbmRlcnNcIilcclxuICAgIC51cGRhdGUoeyBpc193aXNobGlzdGVkOiBpc1dpc2hsaXN0ZWQgfSlcclxuICAgIC5lcShcImlkXCIsIHRlbmRlcklkKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIHRvZ2dsaW5nIHdpc2hsaXN0OlwiLCBlcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gdXBkYXRlIHRlbmRlclwiIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC90ZW5kZXJzXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRVc2VyVGVuZGVycygpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIsIHRlbmRlcnM6IFtdIH1cclxuXHJcbiAgLy8gRmV0Y2ggc2NyYXBlZCB0ZW5kZXJzIGZyb20gdXNlcl90ZW5kZXJzXHJcbiAgY29uc3QgeyBkYXRhOiBzY3JhcGVkVGVuZGVycywgZXJyb3I6IHNjcmFwZWRFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidXNlcl90ZW5kZXJzXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLm9yZGVyKFwiY3JlYXRlZF9hdFwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcclxuXHJcbiAgaWYgKHNjcmFwZWRFcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZmV0Y2hpbmcgc2NyYXBlZCB0ZW5kZXJzOlwiLCBzY3JhcGVkRXJyb3IpXHJcbiAgfVxyXG5cclxuICAvLyBGZXRjaCBjdXN0b20gdGVuZGVycyBmcm9tIHVzZXJfY3VzdG9tX3RlbmRlcnNcclxuICBjb25zdCB7IGRhdGE6IGN1c3RvbVRlbmRlcnMsIGVycm9yOiBjdXN0b21FcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidXNlcl9jdXN0b21fdGVuZGVyc1wiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcblxyXG4gIGlmIChjdXN0b21FcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZmV0Y2hpbmcgY3VzdG9tIHRlbmRlcnM6XCIsIGN1c3RvbUVycm9yKVxyXG4gIH1cclxuXHJcbiAgLy8gQ29tYmluZSBhbmQgbm9ybWFsaXplIGJvdGggdHlwZXMgb2YgdGVuZGVyc1xyXG4gIGNvbnN0IGFsbFRlbmRlcnMgPSBbXHJcbiAgICAuLi4oc2NyYXBlZFRlbmRlcnMgfHwgW10pLm1hcCgodGVuZGVyKSA9PiAoe1xyXG4gICAgICBpZDogdGVuZGVyLmlkLFxyXG4gICAgICB0ZW5kZXJfaWQ6IHRlbmRlci50ZW5kZXJfaWQsXHJcbiAgICAgIHRpdGxlOiB0ZW5kZXIudGl0bGUsXHJcbiAgICAgIG9yZ2FuaXphdGlvbjogdGVuZGVyLm9yZ2FuaXphdGlvbixcclxuICAgICAgc3RhdHVzOiB0ZW5kZXIuc3RhdHVzLFxyXG4gICAgICBjbG9zZV9kYXRlOiB0ZW5kZXIuY2xvc2VfZGF0ZSxcclxuICAgICAgdmFsdWU6IHRlbmRlci52YWx1ZSxcclxuICAgICAgY2F0ZWdvcnk6IHRlbmRlci5jYXRlZ29yeSxcclxuICAgICAgaXNfcGlubmVkOiB0ZW5kZXIuaXNfcGlubmVkIHx8IGZhbHNlLFxyXG4gICAgICBpc19mYXZvdXJpdGVkOiB0ZW5kZXIuaXNfZmF2b3VyaXRlZCB8fCBmYWxzZSxcclxuICAgICAgaXNfd2lzaGxpc3RlZDogdGVuZGVyLmlzX3dpc2hsaXN0ZWQgfHwgZmFsc2UsXHJcbiAgICAgIGNyZWF0ZWRfYXQ6IHRlbmRlci5jcmVhdGVkX2F0LFxyXG4gICAgICB0ZW5kZXJfdHlwZTogXCJzY3JhcGVkXCIgYXMgY29uc3QsXHJcbiAgICB9KSksXHJcbiAgICAuLi4oY3VzdG9tVGVuZGVycyB8fCBbXSkubWFwKCh0ZW5kZXIpID0+ICh7XHJcbiAgICAgIGlkOiB0ZW5kZXIuaWQsXHJcbiAgICAgIHRlbmRlcl9pZDogYGN1c3RvbS0ke3RlbmRlci5pZH1gLFxyXG4gICAgICB0aXRsZTogdGVuZGVyLnRpdGxlLFxyXG4gICAgICBvcmdhbml6YXRpb246IHRlbmRlci5vcmdhbml6YXRpb24sXHJcbiAgICAgIHN0YXR1czogdGVuZGVyLnN0YXR1cyxcclxuICAgICAgY2xvc2VfZGF0ZTogdGVuZGVyLmRlYWRsaW5lLFxyXG4gICAgICB2YWx1ZTogdGVuZGVyLnZhbHVlLFxyXG4gICAgICBjYXRlZ29yeTogdGVuZGVyLmNhdGVnb3J5LFxyXG4gICAgICBpc19waW5uZWQ6IHRlbmRlci5pc19waW5uZWQgfHwgZmFsc2UsXHJcbiAgICAgIGlzX2Zhdm91cml0ZWQ6IHRlbmRlci5pc19mYXZvdXJpdGVkIHx8IGZhbHNlLFxyXG4gICAgICBpc193aXNobGlzdGVkOiB0ZW5kZXIuaXNfd2lzaGxpc3RlZCB8fCBmYWxzZSxcclxuICAgICAgY3JlYXRlZF9hdDogdGVuZGVyLmNyZWF0ZWRfYXQsXHJcbiAgICAgIHRlbmRlcl90eXBlOiBcImN1c3RvbVwiIGFzIGNvbnN0LFxyXG4gICAgfSkpLFxyXG4gIF0uc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYi5jcmVhdGVkX2F0KS5nZXRUaW1lKCkgLSBuZXcgRGF0ZShhLmNyZWF0ZWRfYXQpLmdldFRpbWUoKSlcclxuXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgdGVuZGVyczogYWxsVGVuZGVycyB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUZW5kZXIodGVuZGVySWQ6IHN0cmluZywgdGVuZGVyVHlwZT86IFwic2NyYXBlZFwiIHwgXCJjdXN0b21cIikge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZGF0YTogeyB1c2VyIH0sXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcbiAgaWYgKCF1c2VyKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB9XHJcblxyXG4gIC8vIFRyeSB0byBkZXRlcm1pbmUgdGVuZGVyIHR5cGUgaWYgbm90IHByb3ZpZGVkXHJcbiAgaWYgKCF0ZW5kZXJUeXBlKSB7XHJcbiAgICAvLyBDaGVjayBpZiBpdCBleGlzdHMgaW4gY3VzdG9tIHRlbmRlcnMgZmlyc3RcclxuICAgIGNvbnN0IHsgZGF0YTogY3VzdG9tVGVuZGVyIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcInVzZXJfY3VzdG9tX3RlbmRlcnNcIilcclxuICAgICAgLnNlbGVjdChcImlkXCIpXHJcbiAgICAgIC5lcShcImlkXCIsIHRlbmRlcklkKVxyXG4gICAgICAuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcbiAgICAgIC5zaW5nbGUoKVxyXG5cclxuICAgIGlmIChjdXN0b21UZW5kZXIpIHtcclxuICAgICAgdGVuZGVyVHlwZSA9IFwiY3VzdG9tXCJcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbmRlclR5cGUgPSBcInNjcmFwZWRcIlxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRGVsZXRlIGZyb20gdGhlIGFwcHJvcHJpYXRlIHRhYmxlXHJcbiAgY29uc3QgdGFibGVOYW1lID0gdGVuZGVyVHlwZSA9PT0gXCJjdXN0b21cIiA/IFwidXNlcl9jdXN0b21fdGVuZGVyc1wiIDogXCJ1c2VyX3RlbmRlcnNcIlxyXG5cclxuICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5mcm9tKHRhYmxlTmFtZSkuZGVsZXRlKCkuZXEoXCJpZFwiLCB0ZW5kZXJJZCkuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gRXJyb3IgZGVsZXRpbmcgdGVuZGVyOlwiLCBlcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gZGVsZXRlIHRlbmRlclwiIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC90ZW5kZXJzXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlU2NyYXBlZFRlbmRlclRvVXNlcihzY3JhcGVkVGVuZGVyOiB7XHJcbiAgaWQ6IHN0cmluZ1xyXG4gIHRpdGxlOiBzdHJpbmdcclxuICBzb3VyY2VfbmFtZTogc3RyaW5nXHJcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmdcclxuICBwdWJsaXNoX2RhdGU/OiBzdHJpbmdcclxuICBjbG9zZV9kYXRlPzogc3RyaW5nXHJcbiAgZXN0aW1hdGVkX3ZhbHVlPzogc3RyaW5nXHJcbiAgY2F0ZWdvcnk/OiBzdHJpbmdcclxuICB0ZW5kZXJfdXJsPzogc3RyaW5nXHJcbn0pIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIC8vIEdldCBjdXJyZW50IHVzZXJcclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICAgIGVycm9yOiB1c2VyRXJyb3IsXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcblxyXG4gIGlmICh1c2VyRXJyb3IgfHwgIXVzZXIpIHtcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuICB9XHJcblxyXG4gIC8vIENoZWNrIGlmIHRlbmRlciBhbHJlYWR5IGV4aXN0cyBmb3IgdGhpcyB1c2VyXHJcbiAgY29uc3QgeyBkYXRhOiBleGlzdGluZyB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidXNlcl90ZW5kZXJzXCIpXHJcbiAgICAuc2VsZWN0KFwiaWQsIHN0YXR1c1wiKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLmVxKFwidGVuZGVyX2lkXCIsIHNjcmFwZWRUZW5kZXIuaWQpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKGV4aXN0aW5nKSB7XHJcbiAgICAvLyBJZiBhbHJlYWR5IGV4aXN0cyBhbmQgaXMgZHJhZnQsIHVwZGF0ZSB0byBpbi1wcm9ncmVzc1xyXG4gICAgaWYgKGV4aXN0aW5nLnN0YXR1cyA9PT0gXCJkcmFmdFwiKSB7XHJcbiAgICAgIGNvbnN0IHsgZXJyb3I6IHVwZGF0ZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAgIC5mcm9tKFwidXNlcl90ZW5kZXJzXCIpXHJcbiAgICAgICAgLnVwZGF0ZSh7IHN0YXR1czogXCJpbi1wcm9ncmVzc1wiIH0pXHJcbiAgICAgICAgLmVxKFwiaWRcIiwgZXhpc3RpbmcuaWQpXHJcblxyXG4gICAgICBpZiAodXBkYXRlRXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciB1cGRhdGluZyB0ZW5kZXIgc3RhdHVzOlwiLCB1cGRhdGVFcnJvcilcclxuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIHVwZGF0ZSB0ZW5kZXIgc3RhdHVzXCIgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvdGVuZGVyc1wiKVxyXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiBcIlRlbmRlciBzdGF0dXMgdXBkYXRlZCB0byBpbi1wcm9ncmVzc1wiLCBpc05ldzogZmFsc2UgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEFscmVhZHkgZXhpc3RzIGFuZCBub3QgZHJhZnQsIG5vIG5lZWQgdG8gdXBkYXRlXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiBcIlRlbmRlciBhbHJlYWR5IGluIHlvdXIgbGlzdFwiLCBpc05ldzogZmFsc2UgfVxyXG4gIH1cclxuXHJcbiAgLy8gSW5zZXJ0IG5ldyB0ZW5kZXIgd2l0aCBpbi1wcm9ncmVzcyBzdGF0dXNcclxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJ1c2VyX3RlbmRlcnNcIilcclxuICAgIC5pbnNlcnQoe1xyXG4gICAgICB1c2VyX2lkOiB1c2VyLmlkLFxyXG4gICAgICB0ZW5kZXJfaWQ6IHNjcmFwZWRUZW5kZXIuaWQsXHJcbiAgICAgIHRpdGxlOiBzY3JhcGVkVGVuZGVyLnRpdGxlLFxyXG4gICAgICBvcmdhbml6YXRpb246IHNjcmFwZWRUZW5kZXIuc291cmNlX25hbWUsXHJcbiAgICAgIHB1Ymxpc2hfZGF0ZTogc2NyYXBlZFRlbmRlci5wdWJsaXNoX2RhdGUsXHJcbiAgICAgIGNsb3NlX2RhdGU6IHNjcmFwZWRUZW5kZXIuY2xvc2VfZGF0ZSxcclxuICAgICAgdmFsdWU6IHNjcmFwZWRUZW5kZXIuZXN0aW1hdGVkX3ZhbHVlLFxyXG4gICAgICBjYXRlZ29yeTogc2NyYXBlZFRlbmRlci5jYXRlZ29yeSxcclxuICAgICAgZGVzY3JpcHRpb246IHNjcmFwZWRUZW5kZXIuZGVzY3JpcHRpb24sXHJcbiAgICAgIHVybDogc2NyYXBlZFRlbmRlci50ZW5kZXJfdXJsLFxyXG4gICAgICBzdGF0dXM6IFwiaW4tcHJvZ3Jlc3NcIixcclxuICAgIH0pXHJcbiAgICAuc2VsZWN0KClcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIHNhdmluZyB0ZW5kZXI6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBzYXZlIHRlbmRlclwiIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC90ZW5kZXJzXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogXCJUZW5kZXIgc2F2ZWQgdG8gTXkgVGVuZGVyc1wiLCBpc05ldzogdHJ1ZSwgZGF0YSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVDdXN0b21UZW5kZXIodGVuZGVyRGF0YToge1xyXG4gIHRpdGxlOiBzdHJpbmdcclxuICBvcmdhbml6YXRpb246IHN0cmluZ1xyXG4gIGRlYWRsaW5lOiBzdHJpbmdcclxuICB2YWx1ZTogc3RyaW5nXHJcbiAgZGVzY3JpcHRpb246IHN0cmluZ1xyXG4gIGNhdGVnb3J5Pzogc3RyaW5nXHJcbiAgbG9jYXRpb24/OiBzdHJpbmdcclxuICB1cGxvYWRlZEZpbGU/OiBGaWxlXHJcbiAgYW5hbHlzaXM/OiBhbnlcclxufSkge1xyXG4gIGNvbnNvbGUubG9nKFwiW3YwXSBjcmVhdGVDdXN0b21UZW5kZXIgY2FsbGVkIHdpdGggZGF0YTpcIiwge1xyXG4gICAgdGl0bGU6IHRlbmRlckRhdGEudGl0bGUsXHJcbiAgICBvcmdhbml6YXRpb246IHRlbmRlckRhdGEub3JnYW5pemF0aW9uLFxyXG4gICAgZGVhZGxpbmU6IHRlbmRlckRhdGEuZGVhZGxpbmUsXHJcbiAgICBoYXNGaWxlOiAhIXRlbmRlckRhdGEudXBsb2FkZWRGaWxlLFxyXG4gICAgaGFzQW5hbHlzaXM6ICEhdGVuZGVyRGF0YS5hbmFseXNpcyxcclxuICB9KVxyXG5cclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gICAgZXJyb3I6IHVzZXJFcnJvcixcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuXHJcbiAgaWYgKHVzZXJFcnJvciB8fCAhdXNlcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlt2MF0gQXV0aCBlcnJvcjpcIiwgdXNlckVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfVxyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2coXCJbdjBdIFVzZXIgYXV0aGVudGljYXRlZDpcIiwgdXNlci5pZClcclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnNvbGUubG9nKFwiW3YwXSBDcmVhdGluZyBjdXN0b20gdGVuZGVyIHJlY29yZC4uLlwiKVxyXG5cclxuICAgIGNvbnN0IHsgZGF0YTogY3VzdG9tVGVuZGVyLCBlcnJvcjogY3VzdG9tVGVuZGVyRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgIC5mcm9tKFwidXNlcl9jdXN0b21fdGVuZGVyc1wiKVxyXG4gICAgICAuaW5zZXJ0KHtcclxuICAgICAgICB1c2VyX2lkOiB1c2VyLmlkLFxyXG4gICAgICAgIHRpdGxlOiB0ZW5kZXJEYXRhLnRpdGxlLFxyXG4gICAgICAgIG9yZ2FuaXphdGlvbjogdGVuZGVyRGF0YS5vcmdhbml6YXRpb24sXHJcbiAgICAgICAgZGVhZGxpbmU6IHRlbmRlckRhdGEuZGVhZGxpbmUsXHJcbiAgICAgICAgdmFsdWU6IHRlbmRlckRhdGEudmFsdWUsXHJcbiAgICAgICAgY2F0ZWdvcnk6IHRlbmRlckRhdGEuY2F0ZWdvcnkgfHwgXCJDdXN0b21cIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogdGVuZGVyRGF0YS5kZXNjcmlwdGlvbixcclxuICAgICAgICBsb2NhdGlvbjogdGVuZGVyRGF0YS5sb2NhdGlvbixcclxuICAgICAgICBzdGF0dXM6IFwiaW4tcHJvZ3Jlc3NcIixcclxuICAgICAgfSlcclxuICAgICAgLnNlbGVjdCgpXHJcbiAgICAgIC5zaW5nbGUoKVxyXG5cclxuICAgIGlmIChjdXN0b21UZW5kZXJFcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBjcmVhdGluZyBjdXN0b20gdGVuZGVyOlwiLCBjdXN0b21UZW5kZXJFcnJvcilcclxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBjcmVhdGUgdGVuZGVyOiBcIiArIGN1c3RvbVRlbmRlckVycm9yLm1lc3NhZ2UgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiW3YwXSBDdXN0b20gdGVuZGVyIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5OlwiLCBjdXN0b21UZW5kZXIuaWQpXHJcblxyXG4gICAgbGV0IGRvY3VtZW50U2F2ZWQgPSBmYWxzZVxyXG4gICAgbGV0IGRvY3VtZW50RXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsXHJcblxyXG4gICAgaWYgKHRlbmRlckRhdGEudXBsb2FkZWRGaWxlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiW3YwXSBVcGxvYWRpbmcgZmlsZSB0byBibG9iIHN0b3JhZ2UuLi5cIilcclxuICAgICAgY29uc29sZS5sb2coXCJbdjBdIEZpbGUgZGV0YWlsczpcIiwge1xyXG4gICAgICAgIG5hbWU6IHRlbmRlckRhdGEudXBsb2FkZWRGaWxlLm5hbWUsXHJcbiAgICAgICAgdHlwZTogdGVuZGVyRGF0YS51cGxvYWRlZEZpbGUudHlwZSxcclxuICAgICAgICBzaXplOiB0ZW5kZXJEYXRhLnVwbG9hZGVkRmlsZS5zaXplLFxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBibG9iID0gYXdhaXQgcHV0KFxyXG4gICAgICAgICAgYGN1c3RvbS10ZW5kZXJzLyR7Y3VzdG9tVGVuZGVyLmlkfS8ke3RlbmRlckRhdGEudXBsb2FkZWRGaWxlLm5hbWV9YCxcclxuICAgICAgICAgIHRlbmRlckRhdGEudXBsb2FkZWRGaWxlLFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBhY2Nlc3M6IFwicHVibGljXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJbdjBdIEZpbGUgdXBsb2FkZWQgdG8gYmxvYjpcIiwgYmxvYi51cmwpXHJcblxyXG4gICAgICAgIGNvbnN0IGRvY3VtZW50RGF0YSA9IHtcclxuICAgICAgICAgIHRlbmRlcl9pZDogY3VzdG9tVGVuZGVyLmlkLFxyXG4gICAgICAgICAgZmlsZV9uYW1lOiB0ZW5kZXJEYXRhLnVwbG9hZGVkRmlsZS5uYW1lLFxyXG4gICAgICAgICAgZmlsZV90eXBlOiB0ZW5kZXJEYXRhLnVwbG9hZGVkRmlsZS50eXBlLFxyXG4gICAgICAgICAgZmlsZV9zaXplOiB0ZW5kZXJEYXRhLnVwbG9hZGVkRmlsZS5zaXplLFxyXG4gICAgICAgICAgYmxvYl91cmw6IGJsb2IudXJsLFxyXG4gICAgICAgICAgc3RvcmFnZV9wYXRoOiBibG9iLnVybCxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiW3YwXSBJbnNlcnRpbmcgZG9jdW1lbnQgd2l0aCBkYXRhOlwiLCBKU09OLnN0cmluZ2lmeShkb2N1bWVudERhdGEsIG51bGwsIDIpKVxyXG5cclxuICAgICAgICBjb25zdCB7IGRhdGE6IGluc2VydGVkRG9jLCBlcnJvcjogZG9jRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgICAuZnJvbShcInVzZXJfY3VzdG9tX3RlbmRlcl9kb2N1bWVudHNcIilcclxuICAgICAgICAgIC5pbnNlcnQoZG9jdW1lbnREYXRhKVxyXG4gICAgICAgICAgLnNlbGVjdCgpXHJcbiAgICAgICAgICAuc2luZ2xlKClcclxuXHJcbiAgICAgICAgaWYgKGRvY0Vycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBzYXZpbmcgZG9jdW1lbnQgcmVmZXJlbmNlOlwiLCBkb2NFcnJvcilcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIGNvZGU6XCIsIGRvY0Vycm9yLmNvZGUpXHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBtZXNzYWdlOlwiLCBkb2NFcnJvci5tZXNzYWdlKVxyXG4gICAgICAgICAgZG9jdW1lbnRFcnJvciA9IGBGYWlsZWQgdG8gc2F2ZSBkb2N1bWVudDogJHtkb2NFcnJvci5tZXNzYWdlfSAoQ29kZTogJHtkb2NFcnJvci5jb2RlfSlgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiW3YwXSBEb2N1bWVudCByZWZlcmVuY2Ugc2F2ZWQgc3VjY2Vzc2Z1bGx5OlwiLCBpbnNlcnRlZERvYy5pZClcclxuICAgICAgICAgIGRvY3VtZW50U2F2ZWQgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoICh1cGxvYWRFcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIHVwbG9hZGluZyBmaWxlOlwiLCB1cGxvYWRFcnJvcilcclxuICAgICAgICBkb2N1bWVudEVycm9yID0gYEZhaWxlZCB0byB1cGxvYWQgZmlsZTogJHt1cGxvYWRFcnJvciBpbnN0YW5jZW9mIEVycm9yID8gdXBsb2FkRXJyb3IubWVzc2FnZSA6IFwiVW5rbm93biBlcnJvclwifWBcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coXCJbdjBdIE5vIGZpbGUgdG8gdXBsb2FkXCIpXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGFuYWx5c2lzU2F2ZWQgPSBmYWxzZVxyXG4gICAgbGV0IGFuYWx5c2lzRXJyb3I6IHN0cmluZyB8IG51bGwgPSBudWxsXHJcblxyXG4gICAgaWYgKHRlbmRlckRhdGEuYW5hbHlzaXMpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJbdjBdIFNhdmluZyBhbmFseXNpcyBkYXRhLi4uXCIpXHJcblxyXG4gICAgICBjb25zdCBhbmFseXNpc0RhdGEgPSB7XHJcbiAgICAgICAgdGVuZGVyX2lkOiBjdXN0b21UZW5kZXIuaWQsXHJcbiAgICAgICAgYW5hbHlzaXNfZGF0YTogdGVuZGVyRGF0YS5hbmFseXNpcyxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc29sZS5sb2coXCJbdjBdIEluc2VydGluZyBhbmFseXNpcyB3aXRoIHRlbmRlcl9pZDpcIiwgY3VzdG9tVGVuZGVyLmlkKVxyXG5cclxuICAgICAgY29uc3QgeyBkYXRhOiBpbnNlcnRlZEFuYWx5c2lzLCBlcnJvcjogYW5hbHlzaXNFcnIgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgICAgLmZyb20oXCJ1c2VyX2N1c3RvbV90ZW5kZXJfYW5hbHlzaXNcIilcclxuICAgICAgICAuaW5zZXJ0KGFuYWx5c2lzRGF0YSlcclxuICAgICAgICAuc2VsZWN0KClcclxuICAgICAgICAuc2luZ2xlKClcclxuXHJcbiAgICAgIGlmIChhbmFseXNpc0Vycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIHNhdmluZyBhbmFseXNpczpcIiwgYW5hbHlzaXNFcnIpXHJcbiAgICAgICAgYW5hbHlzaXNFcnJvciA9IGBGYWlsZWQgdG8gc2F2ZSBhbmFseXNpczogJHthbmFseXNpc0Vyci5tZXNzYWdlfSAoQ29kZTogJHthbmFseXNpc0Vyci5jb2RlfSlgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJbdjBdIEFuYWx5c2lzIHNhdmVkIHN1Y2Nlc3NmdWxseTpcIiwgaW5zZXJ0ZWRBbmFseXNpcy5pZClcclxuICAgICAgICBhbmFseXNpc1NhdmVkID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlt2MF0gTm8gYW5hbHlzaXMgdG8gc2F2ZVwiKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiW3YwXSBUZW5kZXIgY3JlYXRpb24gY29tcGxldGVkXCIpXHJcbiAgICByZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvdGVuZGVyc1wiKVxyXG4gICAgcmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2N1c3RvbS10ZW5kZXJzXCIpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgZGF0YTogY3VzdG9tVGVuZGVyLFxyXG4gICAgICB0ZW5kZXJJZDogY3VzdG9tVGVuZGVyLmlkLFxyXG4gICAgICBkb2N1bWVudFNhdmVkLFxyXG4gICAgICBkb2N1bWVudEVycm9yLFxyXG4gICAgICBhbmFseXNpc1NhdmVkLFxyXG4gICAgICBhbmFseXNpc0Vycm9yLFxyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiW3YwXSBFcnJvciBpbiBjcmVhdGVDdXN0b21UZW5kZXI6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkZhaWxlZCB0byBjcmVhdGUgdGVuZGVyOiBcIiArIChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGFzaGJvYXJkU3RhdHMoKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIC8vIEdldCBzY3JhcGVkIHRlbmRlcnMgY291bnRcclxuICAgIGNvbnN0IHsgY291bnQ6IHNjcmFwZWRDb3VudCB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJ1c2VyX3RlbmRlcnNcIilcclxuICAgICAgLnNlbGVjdChcIipcIiwgeyBjb3VudDogXCJleGFjdFwiLCBoZWFkOiB0cnVlIH0pXHJcbiAgICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuXHJcbiAgICAvLyBHZXQgY3VzdG9tIHRlbmRlcnMgY291bnRcclxuICAgIGNvbnN0IHsgY291bnQ6IGN1c3RvbUNvdW50IH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcInVzZXJfY3VzdG9tX3RlbmRlcnNcIilcclxuICAgICAgLnNlbGVjdChcIipcIiwgeyBjb3VudDogXCJleGFjdFwiLCBoZWFkOiB0cnVlIH0pXHJcbiAgICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuXHJcbiAgICBjb25zdCB0b3RhbFRlbmRlcnMgPSAoc2NyYXBlZENvdW50IHx8IDApICsgKGN1c3RvbUNvdW50IHx8IDApXHJcblxyXG4gICAgLy8gR2V0IGFuYWx5emVkIHRlbmRlcnMgKGN1c3RvbSB0ZW5kZXJzIHdpdGggYW5hbHlzaXMpXHJcbiAgICBjb25zdCB7IGNvdW50OiBhbmFseXplZENvdW50IH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcInVzZXJfY3VzdG9tX3RlbmRlcl9hbmFseXNpc1wiKVxyXG4gICAgICAuc2VsZWN0KFwidGVuZGVyX2lkXCIsIHsgY291bnQ6IFwiZXhhY3RcIiwgaGVhZDogdHJ1ZSB9KVxyXG4gICAgICAuaW4oXHJcbiAgICAgICAgXCJ0ZW5kZXJfaWRcIixcclxuICAgICAgICBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAgICAgLmZyb20oXCJ1c2VyX2N1c3RvbV90ZW5kZXJzXCIpXHJcbiAgICAgICAgICAuc2VsZWN0KFwiaWRcIilcclxuICAgICAgICAgIC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcclxuICAgICAgICAgIC50aGVuKChyZXMpID0+IHJlcy5kYXRhPy5tYXAoKHQpID0+IHQuaWQpIHx8IFtdKSxcclxuICAgICAgKVxyXG5cclxuICAgIC8vIEdldCByZWNlbnQgYWN0aXZpdHkgKGxhc3QgNSBjdXN0b20gdGVuZGVycylcclxuICAgIGNvbnN0IHsgZGF0YTogcmVjZW50Q3VzdG9tIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcInVzZXJfY3VzdG9tX3RlbmRlcnNcIilcclxuICAgICAgLnNlbGVjdChcIipcIilcclxuICAgICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgICAub3JkZXIoXCJjcmVhdGVkX2F0XCIsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KVxyXG4gICAgICAubGltaXQoMylcclxuXHJcbiAgICAvLyBHZXQgcmVjZW50IHNjcmFwZWQgdGVuZGVyc1xyXG4gICAgY29uc3QgeyBkYXRhOiByZWNlbnRTY3JhcGVkIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcInVzZXJfdGVuZGVyc1wiKVxyXG4gICAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgICAuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcbiAgICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAgIC5saW1pdCgyKVxyXG5cclxuICAgIGNvbnN0IHJlY2VudEFjdGl2aXR5ID0gW1xyXG4gICAgICAuLi4ocmVjZW50Q3VzdG9tIHx8IFtdKS5tYXAoKHRlbmRlcikgPT4gKHtcclxuICAgICAgICBpZDogdGVuZGVyLmlkLFxyXG4gICAgICAgIHRpdGxlOiB0ZW5kZXIudGl0bGUsXHJcbiAgICAgICAgb3JnYW5pemF0aW9uOiB0ZW5kZXIub3JnYW5pemF0aW9uLFxyXG4gICAgICAgIHR5cGU6IFwiYW5hbHl6ZWRcIiBhcyBjb25zdCxcclxuICAgICAgICBjcmVhdGVkX2F0OiB0ZW5kZXIuY3JlYXRlZF9hdCxcclxuICAgICAgfSkpLFxyXG4gICAgICAuLi4ocmVjZW50U2NyYXBlZCB8fCBbXSkubWFwKCh0ZW5kZXIpID0+ICh7XHJcbiAgICAgICAgaWQ6IHRlbmRlci5pZCxcclxuICAgICAgICB0aXRsZTogdGVuZGVyLnRpdGxlLFxyXG4gICAgICAgIG9yZ2FuaXphdGlvbjogdGVuZGVyLm9yZ2FuaXphdGlvbixcclxuICAgICAgICB0eXBlOiBcInNhdmVkXCIgYXMgY29uc3QsXHJcbiAgICAgICAgY3JlYXRlZF9hdDogdGVuZGVyLmNyZWF0ZWRfYXQsXHJcbiAgICAgIH0pKSxcclxuICAgIF1cclxuICAgICAgLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGIuY3JlYXRlZF9hdCkuZ2V0VGltZSgpIC0gbmV3IERhdGUoYS5jcmVhdGVkX2F0KS5nZXRUaW1lKCkpXHJcbiAgICAgIC5zbGljZSgwLCA1KVxyXG5cclxuICAgIC8vIEdldCB0ZW5kZXJzIGNsb3Npbmcgc29vbiAobmV4dCA3IGRheXMpXHJcbiAgICBjb25zdCBzZXZlbkRheXNGcm9tTm93ID0gbmV3IERhdGUoKVxyXG4gICAgc2V2ZW5EYXlzRnJvbU5vdy5zZXREYXRlKHNldmVuRGF5c0Zyb21Ob3cuZ2V0RGF0ZSgpICsgNylcclxuXHJcbiAgICBjb25zdCB7IGRhdGE6IGNsb3NpbmdTb29uIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcInVzZXJfdGVuZGVyc1wiKVxyXG4gICAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgICAuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcbiAgICAgIC5ub3QoXCJjbG9zZV9kYXRlXCIsIFwiaXNcIiwgbnVsbClcclxuICAgICAgLmd0ZShcImNsb3NlX2RhdGVcIiwgbmV3IERhdGUoKS50b0lTT1N0cmluZygpKVxyXG4gICAgICAubHRlKFwiY2xvc2VfZGF0ZVwiLCBzZXZlbkRheXNGcm9tTm93LnRvSVNPU3RyaW5nKCkpXHJcbiAgICAgIC5vcmRlcihcImNsb3NlX2RhdGVcIiwgeyBhc2NlbmRpbmc6IHRydWUgfSlcclxuICAgICAgLmxpbWl0KDUpXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICAgc3RhdHM6IHtcclxuICAgICAgICB0b3RhbFRlbmRlcnMsXHJcbiAgICAgICAgYW5hbHl6ZWRUZW5kZXJzOiBhbmFseXplZENvdW50IHx8IDAsXHJcbiAgICAgICAgY2xvc2luZ1Nvb246IGNsb3NpbmdTb29uPy5sZW5ndGggfHwgMCxcclxuICAgICAgICByZWNlbnRBY3Rpdml0eSxcclxuICAgICAgICB1cGNvbWluZ0RlYWRsaW5lczogY2xvc2luZ1Nvb24gfHwgW10sXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJbdjBdIEVycm9yIGZldGNoaW5nIGRhc2hib2FyZCBzdGF0czpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiRmFpbGVkIHRvIGZldGNoIGRhc2hib2FyZCBzdGF0aXN0aWNzXCIgfVxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjhTQThSc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-toast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST'
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case 'DISMISS_TOAST':
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: 'UPDATE_TOAST',
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: 'DISMISS_TOAST',
            toastId: id
        });
    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    _s();
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: 'DISMISS_TOAST',
                toastId
            })
    };
}
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/progress.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Progress",
    ()=>Progress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$progress$40$1$2e$_7b7d7236cf792a9e42fb0c07b21077df$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-progress@1._7b7d7236cf792a9e42fb0c07b21077df/node_modules/@radix-ui/react-progress/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Progress({ className, value, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$progress$40$1$2e$_7b7d7236cf792a9e42fb0c07b21077df$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "progress",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$progress$40$1$2e$_7b7d7236cf792a9e42fb0c07b21077df$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "progress-indicator",
            className: "bg-primary h-full w-full flex-1 transition-all",
            style: {
                transform: `translateX(-${100 - (value || 0)}%)`
            }
        }, void 0, false, {
            fileName: "[project]/components/ui/progress.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/progress.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Progress;
;
var _c;
__turbopack_context__.k.register(_c, "Progress");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dynamic-tender-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DynamicTenderForm",
    ()=>DynamicTenderForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/radio-group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$percent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Percent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/percent.js [app-client] (ecmascript) <export default as Percent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/currency.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$cf3a95__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:cf3a95 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/progress.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
;
;
;
function DynamicTenderForm({ tenderId, formFields, googleMapsApiKey, documents = [], tenderData, onProgressChange }) {
    _s();
    console.log("[v0] 🔵 DynamicTenderForm COMPONENT RENDERING");
    console.log("[v0] Tender ID:", tenderId);
    console.log("[v0] FormFields received:", formFields?.length || 0, "fields");
    console.log("[v0] FormFields:", formFields);
    console.log("[v0] Documents:", documents?.length || 0);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [fillingPdf, setFillingPdf] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasAutoSaved, setHasAutoSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [collapsedSections, setCollapsedSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [lastSaveTime, setLastSaveTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formCompletionPercent, setFormCompletionPercent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const isCustomTender = tenderId.length === 36 && tenderId.includes("-");
    const apiBasePath = isCustomTender ? `/api/custom-tenders/${tenderId}` : `/api/tenders/scraped/${tenderId}`;
    const availableDocuments = documents.filter((doc)=>doc.document_type === "application/pdf" || doc.file_type === "application/pdf");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DynamicTenderForm.useEffect": ()=>{
            loadSavedResponses();
        }
    }["DynamicTenderForm.useEffect"], [
        tenderId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DynamicTenderForm.useEffect": ()=>{
            calculateFormCompletion();
        }
    }["DynamicTenderForm.useEffect"], [
        formData,
        formFields
    ]);
    const calculateFormCompletion = ()=>{
        if (formFields.length === 0) {
            setFormCompletionPercent(0);
            return;
        }
        const requiredFields = formFields.filter((f)=>f.required);
        const totalFields = requiredFields.length > 0 ? requiredFields.length : formFields.length;
        const filledFields = requiredFields.length > 0 ? requiredFields.filter((f)=>formData[f.id] && formData[f.id] !== "").length : Object.keys(formData).filter((key)=>formData[key] && formData[key] !== "").length;
        const percent = Math.round(filledFields / totalFields * 100);
        setFormCompletionPercent(percent);
        // Update tender progress status based on form completion
        let status = "reviewing";
        if (percent >= 100) {
            status = "ready";
        } else if (percent >= 75) {
            status = "preparing";
        } else if (percent >= 50) {
            status = "planning";
        } else if (percent >= 25) {
            status = "analyzing";
        }
        if (onProgressChange && percent > 0) {
            onProgressChange(Math.min(percent, 95), status); // Cap at 95% until submitted
        }
    };
    const loadSavedResponses = async ()=>{
        try {
            const response = await fetch(`${apiBasePath}/responses`);
            if (response.ok) {
                const { responses } = await response.json();
                if (responses) {
                    setFormData(responses);
                    setLastSaveTime(new Date());
                }
            }
        } catch (error) {
            console.error("[v0] Error loading saved responses:", error);
        } finally{
            setLoading(false);
        }
    };
    const handleAutoSave = async ()=>{
        if (!tenderData || hasAutoSaved) return;
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$cf3a95__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["saveScrapedTenderToUser"])(tenderData);
            if (result.success) {
                setHasAutoSaved(true);
                if (result.isNew) {
                    toast({
                        title: "Tender Saved",
                        description: "This tender has been added to 'My Tenders' with status 'In Progress'"
                    });
                }
            }
        } catch (error) {
            console.error("[v0] Error auto-saving tender:", error);
        }
    };
    const handleChange = (fieldId, value)=>{
        setFormData((prev)=>({
                ...prev,
                [fieldId]: value
            }));
        setErrors((prev)=>({
                ...prev,
                [fieldId]: ""
            }));
        setSaved(false);
        if (Object.keys(formData).length === 0 && !hasAutoSaved) {
            handleAutoSave();
        }
    };
    const validateField = (field, value)=>{
        if (field.required && (!value || value === "")) {
            return "This field is required";
        }
        if (field.validation && value) {
            if (field.type === "number") {
                const num = Number(value);
                if (field.validation.min !== undefined && num < field.validation.min) {
                    return `Minimum value is ${field.validation.min}`;
                }
                if (field.validation.max !== undefined && num > field.validation.max) {
                    return `Maximum value is ${field.validation.max}`;
                }
            }
            if (field.type === "text" || field.type === "textarea") {
                if (field.validation.maxLength && value.length > field.validation.maxLength) {
                    return `Maximum length is ${field.validation.maxLength} characters`;
                }
                if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
                    return `Invalid format`;
                }
            }
        }
        return null;
    };
    const handleSave = async ()=>{
        const newErrors = {};
        // Validate all required fields
        formFields.forEach((field)=>{
            const error = validateField(field, formData[field.id]);
            if (error) {
                newErrors[field.id] = error;
            }
        });
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast({
                title: "Validation Error",
                description: `Please fix ${Object.keys(newErrors).length} error(s) before saving`,
                variant: "destructive"
            });
            return;
        }
        setSaving(true);
        try {
            const response = await fetch(`${apiBasePath}/responses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    responses: formData
                })
            });
            if (response.ok) {
                setSaved(true);
                setLastSaveTime(new Date());
                setTimeout(()=>setSaved(false), 3000);
                toast({
                    title: "Saved",
                    description: "Your responses have been saved successfully"
                });
                // Update progress log
                if (isCustomTender) {
                    await fetch(`/api/strategist/progress`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            tenderId,
                            tenderType: "custom",
                            status: formCompletionPercent >= 100 ? "ready" : "preparing",
                            progressPercent: Math.min(formCompletionPercent, 95),
                            milestone: `Form ${formCompletionPercent}% complete`,
                            notes: `User saved form responses - ${Object.keys(formData).length} fields filled`
                        })
                    });
                }
            }
        } catch (error) {
            console.error("[v0] Error saving responses:", error);
            toast({
                title: "Error",
                description: "Failed to save responses",
                variant: "destructive"
            });
        } finally{
            setSaving(false);
        }
    };
    const handlePreviewFilledPdf = async (documentId)=>{
        console.log("[v0] 🔵 PREVIEW BUTTON CLICKED - Function starting...");
        console.log("[v0] Current timestamp:", new Date().toISOString());
        setFillingPdf(true);
        try {
            console.log("[v0] ========================================");
            console.log("[v0] PREVIEW FILLED PDF REQUEST");
            console.log("[v0] ========================================");
            console.log("[v0] Document ID:", documentId);
            console.log("[v0] Form data being sent:", formData);
            console.log("[v0] Number of filled fields:", Object.keys(formData).length);
            console.log("[v0] Field IDs:", Object.keys(formData));
            if (Object.keys(formData).length === 0) {
                console.log("[v0] ⚠⚠⚠ WARNING: No form data to fill! ⚠⚠⚠");
                console.log("[v0] You haven't filled any fields yet. The PDF will open but will be empty.");
            }
            console.log("[v0] Making fetch request to:", `${apiBasePath}/fill-pdf`);
            const response = await fetch(`${apiBasePath}/fill-pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    documentId
                })
            });
            console.log("[v0] ✓ Fetch completed");
            console.log("[v0] Response status:", response.status);
            console.log("[v0] Response OK:", response.ok);
            console.log("[v0] Response headers:");
            console.log("[v0]   - PDF Fields Total:", response.headers.get("X-PDF-Fields-Total"));
            console.log("[v0]   - Fields Filled:", response.headers.get("X-Fields-Filled"));
            console.log("[v0]   - Responses Total:", response.headers.get("X-Responses-Total"));
            console.log("[v0]   - Fill Success Rate:", response.headers.get("X-Fill-Success-Rate") + "%");
            const pdfFieldsTotal = Number.parseInt(response.headers.get("X-PDF-Fields-Total") || "0");
            const fieldsFilled = Number.parseInt(response.headers.get("X-Fields-Filled") || "0");
            const responsesTotal = Number.parseInt(response.headers.get("X-Responses-Total") || "0");
            const successRate = Number.parseFloat(response.headers.get("X-Fill-Success-Rate") || "0");
            console.log("[v0] ========================================");
            console.log("[v0] FILL RESULTS:");
            console.log("[v0] ========================================");
            console.log("[v0] PDF has", pdfFieldsTotal, "interactive form fields");
            console.log("[v0] You filled", responsesTotal, "form fields");
            console.log("[v0] Successfully matched and filled", fieldsFilled, "fields");
            console.log("[v0] Success rate:", successRate.toFixed(1) + "%");
            console.log("[v0] ========================================");
            if (pdfFieldsTotal === 0) {
                console.log("[v0] ⚠⚠⚠ WARNING: This PDF has NO interactive form fields! ⚠⚠⚠");
                console.log("[v0] This is a static PDF document. The fields cannot be filled automatically.");
                console.log("[v0] You may need to manually fill this PDF or use a different document.");
                toast({
                    title: "Static PDF Detected",
                    description: "This PDF has no fillable fields. Click 'Generate Response PDF' below to create a new document with your responses.",
                    variant: "destructive"
                });
            } else if (fieldsFilled === 0 && responsesTotal > 0) {
                console.log("[v0] ⚠⚠⚠ WARNING: No fields were filled! ⚠⚠⚠");
                console.log("[v0] The form field names don't match the PDF field names.");
                console.log("[v0] Check the server logs for detailed field matching information.");
                toast({
                    title: "No Fields Matched",
                    description: "The form field names don't match the PDF field names. The document will open, but your responses couldn't be filled in automatically.",
                    variant: "destructive"
                });
            } else if (successRate < 50) {
                console.log("[v0] ⚠ Low success rate - many fields didn't match");
                toast({
                    title: "Partial Fill",
                    description: `Only ${fieldsFilled} out of ${responsesTotal} fields were filled (${successRate.toFixed(1)}%). Some field names may not match.`
                });
            } else if (fieldsFilled > 0) {
                toast({
                    title: "PDF Filled Successfully",
                    description: `${fieldsFilled} field${fieldsFilled === 1 ? "" : "s"} filled in the PDF`
                });
            }
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fill PDF");
            }
            console.log("[v0] Converting response to blob...");
            const blob = await response.blob();
            console.log("[v0] Blob size:", blob.size, "bytes");
            console.log("[v0] Blob type:", blob.type);
            const url = window.URL.createObjectURL(blob);
            console.log("[v0] Opening PDF in new window...");
            window.open(url, "_blank");
            setTimeout(()=>window.URL.revokeObjectURL(url), 1000);
            console.log("[v0] ✓ Preview completed successfully");
        } catch (error) {
            console.error("[v0] ❌ ERROR in handlePreviewFilledPdf:");
            console.error("[v0] Error type:", error?.constructor?.name);
            console.error("[v0] Error message:", error?.message);
            console.error("[v0] Full error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to preview filled PDF",
                variant: "destructive"
            });
        } finally{
            console.log("[v0] 🔵 PREVIEW FUNCTION ENDING");
            setFillingPdf(false);
        }
    };
    const handleDownloadFilledPdf = async (documentId)=>{
        setFillingPdf(true);
        try {
            console.log("[v0] ========================================");
            console.log("[v0] DOWNLOAD FILLED PDF REQUEST");
            console.log("[v0] ========================================");
            console.log("[v0] Document ID:", documentId);
            console.log("[v0] Form data being sent:", formData);
            console.log("[v0] Number of filled fields:", Object.keys(formData).length);
            const response = await fetch(`${apiBasePath}/fill-pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    documentId
                })
            });
            const pdfFieldsTotal = Number.parseInt(response.headers.get("X-PDF-Fields-Total") || "0");
            const fieldsFilled = Number.parseInt(response.headers.get("X-Fields-Filled") || "0");
            const responsesTotal = Number.parseInt(response.headers.get("X-Responses-Total") || "0");
            const successRate = Number.parseFloat(response.headers.get("X-Fill-Success-Rate") || "0");
            console.log("[v0] ========================================");
            console.log("[v0] FILL RESULTS:");
            console.log("[v0] ========================================");
            console.log("[v0] PDF Fields:", pdfFieldsTotal);
            console.log("[v0] Responses:", responsesTotal);
            console.log("[v0] Filled:", fieldsFilled);
            console.log("[v0] Success Rate:", successRate.toFixed(1) + "%");
            console.log("[v0] ========================================");
            if (pdfFieldsTotal === 0) {
                toast({
                    title: "PDF Has No Form Fields",
                    description: "This PDF doesn't have interactive form fields. The document will download, but your responses cannot be automatically filled in.",
                    variant: "destructive"
                });
            } else if (fieldsFilled === 0 && responsesTotal > 0) {
                toast({
                    title: "No Fields Matched",
                    description: "The form field names don't match the PDF field names. Check the console for details.",
                    variant: "destructive"
                });
            } else if (fieldsFilled > 0) {
                toast({
                    title: "Success",
                    description: `Filled PDF downloaded with ${fieldsFilled} field${fieldsFilled === 1 ? "" : "s"} filled`
                });
            }
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fill PDF");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `filled_tender_${tenderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("[v0] Error downloading filled PDF:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to download filled PDF",
                variant: "destructive"
            });
        } finally{
            setFillingPdf(false);
        }
    };
    const handleGenerateResponsePdf = async ()=>{
        if (Object.keys(formData).length === 0) {
            toast({
                title: "No Responses",
                description: "Please fill in some form fields before generating a response PDF.",
                variant: "destructive"
            });
            return;
        }
        setFillingPdf(true);
        try {
            const response = await fetch(`${apiBasePath}/generate-response-pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate PDF");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(()=>window.URL.revokeObjectURL(url), 1000);
            toast({
                title: "Success",
                description: "Response PDF generated successfully"
            });
        } catch (error) {
            console.error("[v0] Error generating response PDF:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to generate response PDF",
                variant: "destructive"
            });
        } finally{
            setFillingPdf(false);
        }
    };
    const handleDownloadResponsePdf = async ()=>{
        if (Object.keys(formData).length === 0) {
            toast({
                title: "No Responses",
                description: "Please fill in some form fields before downloading a response PDF.",
                variant: "destructive"
            });
            return;
        }
        setFillingPdf(true);
        try {
            const response = await fetch(`${apiBasePath}/generate-response-pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate PDF");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `tender_response_${tenderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast({
                title: "Success",
                description: "Response PDF downloaded successfully"
            });
        } catch (error) {
            console.error("[v0] Error downloading response PDF:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to download response PDF",
                variant: "destructive"
            });
        } finally{
            setFillingPdf(false);
        }
    };
    const handleMakePdfEditable = async ()=>{
        if (availableDocuments.length === 0) {
            toast({
                title: "No Document",
                description: "Please upload a PDF document first.",
                variant: "destructive"
            });
            return;
        }
        if (Object.keys(formData).length === 0) {
            toast({
                title: "No Responses",
                description: "Please fill in some form fields first.",
                variant: "destructive"
            });
            return;
        }
        setFillingPdf(true);
        try {
            console.log("[v0] ========================================");
            console.log("[v0] MAKE PDF EDITABLE - URL CONSTRUCTION");
            console.log("[v0] ========================================");
            console.log("[v0] tenderId:", tenderId);
            console.log("[v0] isCustomTender:", isCustomTender);
            console.log("[v0] apiBasePath:", apiBasePath);
            const fullUrl = `${apiBasePath}/make-pdf-editable`;
            console.log("[v0] Full URL being fetched:", fullUrl);
            console.log("[v0] URL length:", fullUrl.length);
            console.log("[v0] URL contains duplicate?:", fullUrl.includes("/make-pdf-editable/"));
            console.log("[v0] Document ID:", availableDocuments[0].id);
            console.log("[v0] ========================================");
            const response = await fetch(fullUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    documentId: availableDocuments[0].id
                })
            });
            console.log("[v0] Response status:", response.status);
            console.log("[v0] Response OK:", response.ok);
            if (!response.ok) {
                const error = await response.json();
                console.error("[v0] API error response:", error);
                throw new Error(error.error || "Failed to make PDF editable");
            }
            const fieldsAdded = response.headers.get("X-Fields-Added");
            const fieldsFilled = response.headers.get("X-Fields-Filled");
            console.log("[v0] Fields added:", fieldsAdded);
            console.log("[v0] Fields filled:", fieldsFilled);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(()=>window.URL.revokeObjectURL(url), 1000);
            toast({
                title: "Success",
                description: `Created editable PDF with ${fieldsAdded} form fields (${fieldsFilled} filled)`
            });
        } catch (error) {
            console.error("[v0] Error making PDF editable:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to make PDF editable",
                variant: "destructive"
            });
        } finally{
            setFillingPdf(false);
        }
    };
    const handleDownloadEditablePdf = async ()=>{
        if (availableDocuments.length === 0) {
            toast({
                title: "No Document",
                description: "Please upload a PDF document first.",
                variant: "destructive"
            });
            return;
        }
        if (Object.keys(formData).length === 0) {
            toast({
                title: "No Responses",
                description: "Please fill in some form fields first.",
                variant: "destructive"
            });
            return;
        }
        setFillingPdf(true);
        try {
            console.log("[v0] ========================================");
            console.log("[v0] DOWNLOAD EDITABLE PDF - URL CONSTRUCTION");
            console.log("[v0] ========================================");
            console.log("[v0] tenderId:", tenderId);
            console.log("[v0] isCustomTender:", isCustomTender);
            console.log("[v0] apiBasePath:", apiBasePath);
            const fullUrl = `${apiBasePath}/make-pdf-editable`;
            console.log("[v0] Full URL being fetched:", fullUrl);
            console.log("[v0] Document ID:", availableDocuments[0].id);
            console.log("[v0] ========================================");
            const response = await fetch(fullUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    documentId: availableDocuments[0].id
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to make PDF editable");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `editable_tender_${tenderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast({
                title: "Success",
                description: "Editable PDF downloaded successfully"
            });
        } catch (error) {
            console.error("[v0] Error downloading editable PDF:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to download editable PDF",
                variant: "destructive"
            });
        } finally{
            setFillingPdf(false);
        }
    };
    const handleGenerateFilledEditable = async ()=>{
        if (availableDocuments.length === 0) {
            toast({
                title: "No Document",
                description: "Please upload a PDF document first.",
                variant: "destructive"
            });
            return;
        }
        if (Object.keys(formData).length === 0) {
            toast({
                title: "No Responses",
                description: "Please fill in some form fields first.",
                variant: "destructive"
            });
            return;
        }
        setFillingPdf(true);
        try {
            console.log("[v0] ========================================");
            console.log("[v0] GENERATE FILLED EDITABLE PDF");
            console.log("[v0] ========================================");
            console.log("[v0] Tender ID:", tenderId);
            console.log("[v0] Document ID:", availableDocuments[0].id);
            console.log("[v0] Form responses:", Object.keys(formData).length);
            const response = await fetch(`${apiBasePath}/generate-filled-editable`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    documentId: availableDocuments[0].id,
                    saveToBlob: true
                })
            });
            console.log("[v0] Response status:", response.status);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate filled editable PDF");
            }
            const fieldsCreated = response.headers.get("X-Fields-Created");
            const fieldsFilled = response.headers.get("X-Fields-Filled");
            const totalPages = response.headers.get("X-Total-Pages");
            const isReadOnly = response.headers.get("X-Is-Read-Only");
            const savedBlobUrl = response.headers.get("X-Saved-Blob-Url");
            console.log("[v0] Fields created:", fieldsCreated);
            console.log("[v0] Fields filled:", fieldsFilled);
            console.log("[v0] Total pages:", totalPages);
            console.log("[v0] Was read-only:", isReadOnly);
            console.log("[v0] Saved to blob:", savedBlobUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            // Download the file
            const a = document.createElement("a");
            a.href = url;
            a.download = `filled_tender_${tenderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast({
                title: "Success!",
                description: `Generated editable PDF with ${fieldsFilled} fields filled. ${savedBlobUrl ? "Saved to your documents." : ""}`
            });
        } catch (error) {
            console.error("[v0] Error generating filled editable PDF:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to generate filled editable PDF",
                variant: "destructive"
            });
        } finally{
            setFillingPdf(false);
        }
    };
    const isAddressField = (field)=>{
        const addressKeywords = [
            "address",
            "street",
            "location",
            "physical address",
            "postal address"
        ];
        const label = field.label.toLowerCase();
        return addressKeywords.some((keyword)=>label.includes(keyword));
    };
    const isCurrencyField = (field)=>{
        const currencyKeywords = [
            "price",
            "cost",
            "amount",
            "value",
            "budget",
            "fee",
            "payment",
            "tender value"
        ];
        const label = field.label.toLowerCase();
        return currencyKeywords.some((keyword)=>label.includes(keyword)) || field.type === "currency";
    };
    const renderField = (field)=>{
        const value = formData[field.id] || "";
        const error = errors[field.id];
        // Address fields now use regular text input
        if (isAddressField(field) && field.type === "text") {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                type: "text",
                id: field.id,
                value: value,
                onChange: (e)=>handleChange(field.id, e.target.value),
                placeholder: field.placeholder || "Enter address...",
                required: field.required,
                className: error ? "border-destructive" : ""
            }, void 0, false, {
                fileName: "[project]/components/dynamic-tender-form.tsx",
                lineNumber: 813,
                columnNumber: 9
            }, this);
        }
        if (isCurrencyField(field) && (field.type === "text" || field.type === "number")) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        id: field.id,
                        type: "text",
                        value: value,
                        onChange: (e)=>handleChange(field.id, e.target.value),
                        placeholder: field.placeholder || "e.g., R 1,000,000 or 1000000",
                        className: error ? "border-destructive" : ""
                    }, void 0, false, {
                        fileName: "[project]/components/dynamic-tender-form.tsx",
                        lineNumber: 828,
                        columnNumber: 11
                    }, this),
                    value && !isNaN(Number(value.toString().replace(/[^0-9.-]/g, ""))) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground mt-1",
                        children: [
                            "Formatted: ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatZAR"])(value.toString().replace(/[^0-9.-]/g, ""))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dynamic-tender-form.tsx",
                        lineNumber: 837,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dynamic-tender-form.tsx",
                lineNumber: 827,
                columnNumber: 9
            }, this);
        }
        switch(field.type){
            case "textarea":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                    id: field.id,
                    value: value,
                    onChange: (e)=>handleChange(field.id, e.target.value),
                    placeholder: field.placeholder,
                    className: error ? "border-destructive" : "",
                    rows: 4
                }, void 0, false, {
                    fileName: "[project]/components/dynamic-tender-form.tsx",
                    lineNumber: 848,
                    columnNumber: 11
                }, this);
            case "select":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                    value: value,
                    onValueChange: (val)=>handleChange(field.id, val),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                            className: error ? "border-destructive" : "",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                placeholder: field.placeholder || "Select an option"
                            }, void 0, false, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 862,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dynamic-tender-form.tsx",
                            lineNumber: 861,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                            children: field.options?.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                    value: option,
                                    children: option
                                }, option, false, {
                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                    lineNumber: 866,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/dynamic-tender-form.tsx",
                            lineNumber: 864,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dynamic-tender-form.tsx",
                    lineNumber: 860,
                    columnNumber: 11
                }, this);
            case "checkbox":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: field.options?.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                    id: `${field.id}-${option}`,
                                    checked: Array.isArray(value) && value.includes(option),
                                    onCheckedChange: (checked)=>{
                                        const currentValues = Array.isArray(value) ? value : [];
                                        const newValues = checked ? [
                                            ...currentValues,
                                            option
                                        ] : currentValues.filter((v)=>v !== option);
                                        handleChange(field.id, newValues);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                    lineNumber: 879,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: `${field.id}-${option}`,
                                    className: "text-sm",
                                    children: option
                                }, void 0, false, {
                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                    lineNumber: 888,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, option, true, {
                            fileName: "[project]/components/dynamic-tender-form.tsx",
                            lineNumber: 878,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/dynamic-tender-form.tsx",
                    lineNumber: 876,
                    columnNumber: 11
                }, this);
            case "radio":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroup"], {
                    value: value,
                    onValueChange: (val)=>handleChange(field.id, val),
                    children: field.options?.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$radio$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RadioGroupItem"], {
                                    value: option,
                                    id: `${field.id}-${option}`
                                }, void 0, false, {
                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                    lineNumber: 901,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: `${field.id}-${option}`,
                                    className: "text-sm",
                                    children: option
                                }, void 0, false, {
                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                    lineNumber: 902,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, option, true, {
                            fileName: "[project]/components/dynamic-tender-form.tsx",
                            lineNumber: 900,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/dynamic-tender-form.tsx",
                    lineNumber: 898,
                    columnNumber: 11
                }, this);
            case "file":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    id: field.id,
                    type: "file",
                    onChange: (e)=>handleChange(field.id, e.target.files?.[0]?.name || ""),
                    className: error ? "border-destructive" : ""
                }, void 0, false, {
                    fileName: "[project]/components/dynamic-tender-form.tsx",
                    lineNumber: 912,
                    columnNumber: 11
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    id: field.id,
                    type: field.type,
                    value: value,
                    onChange: (e)=>handleChange(field.id, e.target.value),
                    placeholder: field.placeholder,
                    className: error ? "border-destructive" : "",
                    min: field.validation?.min,
                    max: field.validation?.max,
                    maxLength: field.validation?.maxLength
                }, void 0, false, {
                    fileName: "[project]/components/dynamic-tender-form.tsx",
                    lineNumber: 922,
                    columnNumber: 11
                }, this);
        }
    };
    if (loading) {
        console.log("[v0] 🟡 Form is in LOADING state");
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-12 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "h-8 w-8 animate-spin text-primary mx-auto"
                }, void 0, false, {
                    fileName: "[project]/components/dynamic-tender-form.tsx",
                    lineNumber: 942,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dynamic-tender-form.tsx",
                lineNumber: 941,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/dynamic-tender-form.tsx",
            lineNumber: 940,
            columnNumber: 7
        }, this);
    }
    const sections = Array.from(new Set(formFields.map((f)=>f.section || "General Information")));
    console.log("[v0] 🟢 Form LOADED - Rendering sections:", sections);
    console.log("[v0] Total sections:", sections.length);
    const toggleSection = (section)=>{
        const newCollapsed = new Set(collapsedSections);
        if (newCollapsed.has(section)) {
            newCollapsed.delete(section);
        } else {
            newCollapsed.add(section);
        }
        setCollapsedSections(newCollapsed);
    };
    const getSectionCompletion = (section)=>{
        const sectionFields = formFields.filter((f)=>(f.section || "General Information") === section);
        const requiredFields = sectionFields.filter((f)=>f.required);
        const fieldsToCheck = requiredFields.length > 0 ? requiredFields : sectionFields;
        const filled = fieldsToCheck.filter((f)=>formData[f.id] && formData[f.id] !== "").length;
        const total = fieldsToCheck.length;
        const percent = total > 0 ? Math.round(filled / total * 100) : 0;
        return {
            filled,
            total,
            percent
        };
    };
    const requiredFieldsCount = formFields.filter((f)=>f.required).length;
    const totalFilledCount = Object.keys(formData).filter((key)=>formData[key] && formData[key] !== "").length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            console.log("[v0] 🟢 DynamicTenderForm JSX RENDERING"),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        className: "pb-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "text-lg",
                                            children: "Response Form Progress"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dynamic-tender-form.tsx",
                                            lineNumber: 986,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                            className: "mt-1",
                                            children: requiredFieldsCount > 0 ? `${requiredFieldsCount} required fields • ${totalFilledCount} of ${formFields.length} total fields filled` : `${totalFilledCount} of ${formFields.length} fields filled`
                                        }, void 0, false, {
                                            fileName: "[project]/components/dynamic-tender-form.tsx",
                                            lineNumber: 987,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                    lineNumber: 985,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-3xl font-bold text-primary",
                                            children: [
                                                formCompletionPercent,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dynamic-tender-form.tsx",
                                            lineNumber: 994,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Complete"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dynamic-tender-form.tsx",
                                            lineNumber: 995,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                    lineNumber: 993,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dynamic-tender-form.tsx",
                            lineNumber: 984,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dynamic-tender-form.tsx",
                        lineNumber: 983,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Progress"], {
                                value: formCompletionPercent,
                                className: "h-3"
                            }, void 0, false, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1000,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-xs text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                                lineNumber: 1003,
                                                columnNumber: 15
                                            }, this),
                                            lastSaveTime ? `Last saved ${lastSaveTime.toLocaleTimeString()}` : "Not saved yet"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1002,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: formCompletionPercent >= 100 ? "default" : "secondary",
                                        className: "gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$percent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Percent$3e$__["Percent"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                                lineNumber: 1007,
                                                columnNumber: 15
                                            }, this),
                                            formCompletionPercent >= 100 ? "Ready to Submit" : "In Progress"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1006,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1001,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dynamic-tender-form.tsx",
                        lineNumber: 999,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dynamic-tender-form.tsx",
                lineNumber: 982,
                columnNumber: 7
            }, this),
            availableDocuments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "mt-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1019,
                                        columnNumber: 15
                                    }, this),
                                    "Generate Filled Document"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1018,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "Download an editable copy of your tender document with all form fields filled in. Your responses will be overlaid directly onto the original document pages."
                            }, void 0, false, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1022,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dynamic-tender-form.tsx",
                        lineNumber: 1017,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            Object.keys(formData).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1030,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertTitle"], {
                                        children: "Fill in the form first"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1031,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                        children: "Complete the form fields above before generating your filled document."
                                    }, void 0, false, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1032,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1029,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                                className: "bg-green-50 border-green-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        className: "h-4 w-4 text-green-600"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1038,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertTitle"], {
                                        className: "text-green-800",
                                        children: "Ready to generate"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1039,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                        className: "text-green-700",
                                        children: [
                                            "You have filled ",
                                            Object.keys(formData).length,
                                            " field(s). Click below to generate your filled document."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1040,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1037,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleGenerateFilledEditable,
                                    disabled: fillingPdf || Object.keys(formData).length === 0,
                                    size: "lg",
                                    className: "bg-primary",
                                    children: fillingPdf ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "h-4 w-4 mr-2 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                                lineNumber: 1055,
                                                columnNumber: 21
                                            }, this),
                                            "Generating Filled Document..."
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                                lineNumber: 1060,
                                                columnNumber: 21
                                            }, this),
                                            "Generate & Download Filled PDF"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                    lineNumber: 1047,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1046,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: "The filled PDF will be saved to your documents. Your responses are overlaid directly on the original tender document."
                            }, void 0, false, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1067,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dynamic-tender-form.tsx",
                        lineNumber: 1027,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dynamic-tender-form.tsx",
                lineNumber: 1016,
                columnNumber: 9
            }, this),
            sections.map((section)=>{
                const sectionFields = formFields.filter((f)=>(f.section || "General Information") === section);
                const completion = getSectionCompletion(section);
                const isCollapsed = collapsedSections.has(section);
                const requiredFieldsInSection = sectionFields.filter((f)=>f.required).length;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("transition-all", completion.percent === 100 && "border-green-500/50 bg-green-50/50"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                            className: "cursor-pointer hover:bg-muted/50 transition-colors",
                            onClick: ()=>toggleSection(section),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        className: "text-base",
                                                        children: section
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                                        lineNumber: 1093,
                                                        columnNumber: 21
                                                    }, this),
                                                    requiredFieldsInSection > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "secondary",
                                                        className: "text-xs",
                                                        children: [
                                                            requiredFieldsInSection,
                                                            " Required"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                                        lineNumber: 1095,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                                lineNumber: 1092,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                className: "mt-1",
                                                children: [
                                                    completion.filled,
                                                    " of ",
                                                    completion.total,
                                                    " fields completed"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                                lineNumber: 1100,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1091,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Progress"], {
                                                        value: completion.percent,
                                                        className: "h-2 w-20"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                                        lineNumber: 1106,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium w-12 text-right", completion.percent === 100 ? "text-green-600" : "text-muted-foreground"),
                                                        children: [
                                                            completion.percent,
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                                        lineNumber: 1107,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                                lineNumber: 1105,
                                                columnNumber: 19
                                            }, this),
                                            isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "h-5 w-5 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                                lineNumber: 1117,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                className: "h-5 w-5 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                                lineNumber: 1119,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1104,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1090,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dynamic-tender-form.tsx",
                            lineNumber: 1086,
                            columnNumber: 13
                        }, this),
                        !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "space-y-4 pt-0",
                            children: sectionFields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: field.id,
                                            className: "flex items-center gap-2",
                                            children: [
                                                field.label,
                                                field.required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "destructive",
                                                    className: "text-xs px-1.5 py-0",
                                                    children: "Required"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                                    lineNumber: 1131,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dynamic-tender-form.tsx",
                                            lineNumber: 1128,
                                            columnNumber: 21
                                        }, this),
                                        field.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground",
                                            children: field.description
                                        }, void 0, false, {
                                            fileName: "[project]/components/dynamic-tender-form.tsx",
                                            lineNumber: 1136,
                                            columnNumber: 43
                                        }, this),
                                        renderField(field),
                                        errors[field.id] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-destructive flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                                    lineNumber: 1140,
                                                    columnNumber: 25
                                                }, this),
                                                errors[field.id]
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dynamic-tender-form.tsx",
                                            lineNumber: 1139,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, field.id, true, {
                                    fileName: "[project]/components/dynamic-tender-form.tsx",
                                    lineNumber: 1127,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/dynamic-tender-form.tsx",
                            lineNumber: 1125,
                            columnNumber: 15
                        }, this)
                    ]
                }, section, true, {
                    fileName: "[project]/components/dynamic-tender-form.tsx",
                    lineNumber: 1082,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "sticky bottom-4 shadow-lg border-primary/20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleSave,
                                disabled: saving,
                                size: "lg",
                                className: "flex-1 min-w-[200px]",
                                children: saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "h-4 w-4 mr-2 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dynamic-tender-form.tsx",
                                            lineNumber: 1158,
                                            columnNumber: 19
                                        }, this),
                                        "Saving..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                            className: "h-4 w-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dynamic-tender-form.tsx",
                                            lineNumber: 1163,
                                            columnNumber: 19
                                        }, this),
                                        "Save Progress (",
                                        formCompletionPercent,
                                        "% Complete)"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1155,
                                columnNumber: 13
                            }, this),
                            saved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                                className: "flex-1 bg-green-500/10 border-green-500/20 py-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        className: "h-4 w-4 text-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1171,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                        className: "text-green-500",
                                        children: "Saved successfully!"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1172,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1170,
                                columnNumber: 15
                            }, this),
                            Object.keys(errors).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                                variant: "destructive",
                                className: "flex-1 py-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1178,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                        children: [
                                            Object.keys(errors).length,
                                            " validation error(s) - check required fields"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dynamic-tender-form.tsx",
                                        lineNumber: 1179,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dynamic-tender-form.tsx",
                                lineNumber: 1177,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dynamic-tender-form.tsx",
                        lineNumber: 1154,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/dynamic-tender-form.tsx",
                    lineNumber: 1153,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dynamic-tender-form.tsx",
                lineNumber: 1152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dynamic-tender-form.tsx",
        lineNumber: 979,
        columnNumber: 5
    }, this);
}
_s(DynamicTenderForm, "DwpfWjRN+eK9j/o8buETraet1JU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = DynamicTenderForm;
var _c;
__turbopack_context__.k.register(_c, "DynamicTenderForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/scroll-area.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollArea",
    ()=>ScrollArea,
    "ScrollBar",
    ()=>ScrollBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$scroll$2d$area_eeab15114fc22b86c960c5b5cb02bcb8$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-scroll-area_eeab15114fc22b86c960c5b5cb02bcb8/node_modules/@radix-ui/react-scroll-area/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function ScrollArea({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$scroll$2d$area_eeab15114fc22b86c960c5b5cb02bcb8$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "scroll-area",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative', className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$scroll$2d$area_eeab15114fc22b86c960c5b5cb02bcb8$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                "data-slot": "scroll-area-viewport",
                className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/scroll-area.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBar, {}, void 0, false, {
                fileName: "[project]/components/ui/scroll-area.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$scroll$2d$area_eeab15114fc22b86c960c5b5cb02bcb8$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Corner"], {}, void 0, false, {
                fileName: "[project]/components/ui/scroll-area.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/scroll-area.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = ScrollArea;
function ScrollBar({ className, orientation = 'vertical', ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$scroll$2d$area_eeab15114fc22b86c960c5b5cb02bcb8$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaScrollbar"], {
        "data-slot": "scroll-area-scrollbar",
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex touch-none p-px transition-colors select-none', orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent', orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$scroll$2d$area_eeab15114fc22b86c960c5b5cb02bcb8$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaThumb"], {
            "data-slot": "scroll-area-thumb",
            className: "bg-border relative flex-1 rounded-full"
        }, void 0, false, {
            fileName: "[project]/components/ui/scroll-area.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/scroll-area.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_c1 = ScrollBar;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "ScrollArea");
__turbopack_context__.k.register(_c1, "ScrollBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/strategist/tender-context-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TenderContextPanel",
    ()=>TenderContextStrategistPanel,
    "TenderContextStrategistPanel",
    ()=>TenderContextStrategistPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$1$2e$7$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@1.7.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function TenderContextStrategistPanel({ tender, className, onPlanGenerated, onBoqGenerated, onReadinessGenerated }) {
    _s();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [readiness, setReadiness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingReadiness, setLoadingReadiness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [generatingPlan, setGeneratingPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [projectPlan, setProjectPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TenderContextStrategistPanel.useEffect": ()=>{
            if (tender.id) {
                loadReadiness();
                loadProjectPlan();
            }
        }
    }["TenderContextStrategistPanel.useEffect"], [
        tender.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TenderContextStrategistPanel.useEffect": ()=>{
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }["TenderContextStrategistPanel.useEffect"], [
        messages
    ]);
    const loadReadiness = async ()=>{
        setLoadingReadiness(true);
        try {
            const response = await fetch(`/api/strategist/readiness?tenderId=${tender.id}`);
            if (response.ok) {
                const data = await response.json();
                setReadiness(data);
                if (onReadinessGenerated) {
                    onReadinessGenerated(data);
                }
            }
        } catch (error) {
            console.error("[v0] Error loading readiness:", error);
        } finally{
            setLoadingReadiness(false);
        }
    };
    const handleSend = async ()=>{
        if (!input.trim() || loading) return;
        const userMessage = input.trim();
        setInput("");
        setMessages((prev)=>[
                ...prev,
                {
                    role: "user",
                    content: userMessage
                }
            ]);
        setLoading(true);
        try {
            const response = await fetch("/api/strategist/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: userMessage,
                    tender_id: tender.id,
                    context_type: "tender",
                    include_context: true,
                    tenderContext: {
                        id: tender.id,
                        title: tender.title,
                        organization: tender.organization,
                        description: tender.description,
                        deadline: tender.deadline,
                        value: tender.value,
                        requirements: tender.requirements,
                        analysis: tender.analysis
                    }
                })
            });
            if (response.ok) {
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let assistantMessage = "";
                setMessages((prev)=>[
                        ...prev,
                        {
                            role: "assistant",
                            content: ""
                        }
                    ]);
                if (reader) {
                    while(true){
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        const lines = chunk.split("\n");
                        for (const line of lines){
                            if (line.startsWith("0:")) {
                                try {
                                    const text = JSON.parse(line.slice(2));
                                    assistantMessage += text;
                                    setMessages((prev)=>{
                                        const newMessages = [
                                            ...prev
                                        ];
                                        newMessages[newMessages.length - 1] = {
                                            role: "assistant",
                                            content: assistantMessage
                                        };
                                        return newMessages;
                                    });
                                } catch (e) {
                                // Skip parse errors
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("[v0] Error sending message:", error);
            setMessages((prev)=>[
                    ...prev,
                    {
                        role: "assistant",
                        content: "Sorry, I encountered an error. Please try again."
                    }
                ]);
        } finally{
            setLoading(false);
        }
    };
    const handleQuickAction = (action)=>{
        let question = "";
        switch(action){
            case "strategy":
                question = `Create a winning bid strategy for "${tender.title}". What are the key success factors?`;
                break;
            case "risks":
                question = `What are the potential risks and compliance gaps I should be aware of for this tender?`;
                break;
            case "pricing":
                question = `Help me develop a competitive pricing strategy for this bid.`;
                break;
            case "strengths":
                question = `Analyze my strengths and weaknesses for this specific tender based on typical requirements.`;
                break;
        }
        setInput(question);
    };
    const loadProjectPlan = async ()=>{
        try {
            const response = await fetch(`/api/strategist/plan?tenderId=${tender.id}&tenderType=custom`);
            if (response.ok) {
                const data = await response.json();
                if (data.plan) {
                    setProjectPlan(data.plan);
                    if (onPlanGenerated) {
                        onPlanGenerated(data.plan);
                    }
                }
            }
        } catch (error) {
            console.error("[v0] Error loading project plan:", error);
        }
    };
    const generateProjectPlan = async ()=>{
        if (generatingPlan) return;
        try {
            setGeneratingPlan(true);
            console.log("[v0] Generating project plan for tender:", tender.id);
            const response = await fetch("/api/strategist/plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tenderId: tender.id,
                    tenderType: "custom",
                    tenderTitle: tender.title,
                    tenderDescription: tender.description,
                    analysisData: tender.analysis
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.details || error.error || "Failed to generate project plan");
            }
            const { plan } = await response.json();
            console.log("[v0] Project plan generated successfully");
            if (onPlanGenerated) {
                onPlanGenerated(plan);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$1$2e$7$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Project Plan Generated", {
                description: "Your comprehensive project plan is now available in the Planning section"
            });
        } catch (error) {
            console.error("[v0] Plan generation error:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$1$2e$7$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Error", {
                description: error instanceof Error ? error.message : "Failed to generate project plan"
            });
        } finally{
            setGeneratingPlan(false);
        }
    };
    const generateBoq = async ()=>{
        try {
            console.log("[v0] Generating BOQ for tender:", tender.id);
            const response = await fetch("/api/strategist/boq", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tenderId: tender.id,
                    tenderType: "custom",
                    tenderTitle: tender.title,
                    tenderDescription: tender.description,
                    analysisData: tender.analysis
                })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.details || error.error || "Failed to generate BOQ");
            }
            const { boq } = await response.json();
            console.log("[v0] BOQ generated successfully");
            if (onBoqGenerated) {
                onBoqGenerated(boq);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$1$2e$7$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("BOQ Generated", {
                description: "Your Bill of Quantities is now available in the Financial section"
            });
        } catch (error) {
            console.error("[v0] BOQ generation error:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$1$2e$7$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Error", {
                description: error instanceof Error ? error.message : "Failed to generate BOQ"
            });
        }
    };
    const checkReadiness = async ()=>{
        try {
            console.log("[v0] Checking readiness for tender:", tender.id);
            const response = await fetch(`/api/strategist/readiness?tender_id=${tender.id}&tender_type=custom`);
            if (!response.ok) {
                throw new Error("Failed to check readiness");
            }
            const readiness = await response.json();
            console.log("[v0] Readiness check complete");
            if (onReadinessGenerated) {
                onReadinessGenerated(readiness);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$1$2e$7$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Readiness Check Complete", {
                description: "Your bid readiness assessment is now available in the Overview section"
            });
        } catch (error) {
            console.error("[v0] Readiness check error:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$1$2e$7$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Error", {
                description: "Failed to check readiness"
            });
        }
    };
    const getScoreColor = (score)=>{
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };
    const getScoreBg = (score)=>{
        if (score >= 80) return "bg-green-500/10";
        if (score >= 60) return "bg-yellow-500/10";
        return "bg-red-500/10";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b bg-muted/30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        className: "h-4 w-4 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    "AI Strategist"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                lineNumber: 340,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: "outline",
                                className: "text-xs",
                                children: "Tender-Specific"
                            }, void 0, false, {
                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                lineNumber: 344,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                        lineNumber: 339,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: "Generate strategic plans and analysis"
                            }, void 0, false, {
                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                lineNumber: 350,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: generateProjectPlan,
                                        disabled: generatingPlan,
                                        variant: "default",
                                        size: "sm",
                                        className: "w-full justify-start h-auto py-3",
                                        children: [
                                            generatingPlan ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "mr-2 h-4 w-4 animate-spin flex-shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                lineNumber: 360,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                className: "mr-2 h-4 w-4 flex-shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                lineNumber: 362,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-left flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-medium",
                                                        children: "Generate Project Plan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                        lineNumber: 365,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs opacity-80 font-normal",
                                                        children: "Opens in Planning section"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                lineNumber: 364,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 352,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: generateBoq,
                                        variant: "outline",
                                        size: "sm",
                                        className: "w-full justify-start h-auto py-3 bg-transparent",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                                className: "mr-2 h-4 w-4 flex-shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                lineNumber: 376,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-left flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-medium",
                                                        children: "Generate BOQ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs opacity-80 font-normal",
                                                        children: "Opens in Financial section"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                lineNumber: 377,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 370,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: checkReadiness,
                                        variant: "outline",
                                        size: "sm",
                                        className: "w-full justify-start h-auto py-3 bg-transparent",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "mr-2 h-4 w-4 flex-shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                lineNumber: 389,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-left flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-medium",
                                                        children: "Check Readiness"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                        lineNumber: 391,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs opacity-80 font-normal",
                                                        children: "Score your bid readiness"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                        lineNumber: 392,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                                lineNumber: 390,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 383,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                lineNumber: 338,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 border-b bg-muted/20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-medium mb-2 text-muted-foreground",
                        children: "Conversation Starters"
                    }, void 0, false, {
                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                        lineNumber: 400,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "text-xs h-auto py-2 justify-start bg-transparent",
                                onClick: ()=>handleQuickAction("strategy"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                        className: "h-3 w-3 mr-2 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 408,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: "Bid Strategy"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 409,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                lineNumber: 402,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "text-xs h-auto py-2 justify-start bg-transparent",
                                onClick: ()=>handleQuickAction("risks"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        className: "h-3 w-3 mr-2 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 417,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: "Risk Analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 418,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                lineNumber: 411,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "text-xs h-auto py-2 justify-start bg-transparent",
                                onClick: ()=>handleQuickAction("pricing"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                        className: "h-3 w-3 mr-2 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 426,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: "Pricing Help"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 427,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "text-xs h-auto py-2 justify-start bg-transparent",
                                onClick: ()=>handleQuickAction("strengths"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                        className: "h-3 w-3 mr-2 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 435,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: "SWOT Analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 436,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                lineNumber: 429,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                        lineNumber: 401,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                lineNumber: 399,
                columnNumber: 7
            }, this),
            messages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                className: "h-48 rounded-lg border p-3",
                ref: scrollRef,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: messages.map((message, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-3 rounded-lg text-sm whitespace-pre-wrap", message.role === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8"),
                            children: message.content || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "h-4 w-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                        lineNumber: 455,
                                        columnNumber: 21
                                    }, this),
                                    "Thinking..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                                lineNumber: 454,
                                columnNumber: 19
                            }, this)
                        }, i, false, {
                            fileName: "[project]/components/strategist/tender-context-panel.tsx",
                            lineNumber: 446,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/strategist/tender-context-panel.tsx",
                    lineNumber: 444,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                lineNumber: 443,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        placeholder: "Ask about this tender...",
                        value: input,
                        onChange: (e)=>setInput(e.target.value),
                        onKeyDown: (e)=>e.key === "Enter" && !e.shiftKey && handleSend(),
                        disabled: loading,
                        className: "text-sm"
                    }, void 0, false, {
                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                        lineNumber: 467,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        size: "icon",
                        onClick: handleSend,
                        disabled: loading || !input.trim(),
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "h-4 w-4 animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/components/strategist/tender-context-panel.tsx",
                            lineNumber: 476,
                            columnNumber: 22
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/components/strategist/tender-context-panel.tsx",
                            lineNumber: 476,
                            columnNumber: 69
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/strategist/tender-context-panel.tsx",
                        lineNumber: 475,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                lineNumber: 466,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                variant: "ghost",
                size: "sm",
                className: "w-full text-xs",
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/dashboard/strategist?tenderId=${tender.id}`,
                    children: [
                        "Open Full Strategist",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                            className: "h-3 w-3 ml-2"
                        }, void 0, false, {
                            fileName: "[project]/components/strategist/tender-context-panel.tsx",
                            lineNumber: 484,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/strategist/tender-context-panel.tsx",
                    lineNumber: 482,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/strategist/tender-context-panel.tsx",
                lineNumber: 481,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/strategist/tender-context-panel.tsx",
        lineNumber: 336,
        columnNumber: 5
    }, this);
}
_s(TenderContextStrategistPanel, "NLnAEGiqwxVBPo2jcTZqizDotMo=");
_c = TenderContextStrategistPanel;
;
var _c;
__turbopack_context__.k.register(_c, "TenderContextStrategistPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/tenders/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TenderDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@opentelemetry_0d106b891cc3169ef6f583aee116eb12/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$eb3dbc__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:eb3dbc [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$dbf0b3__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:dbf0b3 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$922a82__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:922a82 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$9c0c72__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:9c0c72 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$d54cb4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:d54cb4 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dynamic$2d$tender$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dynamic-tender-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$react$40$2$2e$0$2e$118_react$40$19$2e$1$2e$0_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$ai$2d$sdk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+react@2.0.118_react@19.1.0_zod@3.25.76/node_modules/@ai-sdk/react/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$116_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/ai@5.0.116_zod@3.25.76/node_modules/ai/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$strategist$2f$tender$2d$context$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/strategist/tender-context-panel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
;
// Mock data - will be replaced with database queries
const mockTender = {
    id: "1",
    title: "Medical Supplies Procurement",
    organization: "Department of Health",
    status: "in-progress",
    deadline: "2025-02-15",
    value: "R 2,500,000",
    analyzed: true,
    createdAt: "2025-01-05",
    description: "Procurement of medical supplies including surgical equipment, pharmaceuticals, and protective gear for provincial hospitals.",
    requirements: [
        "Valid tax clearance certificate",
        "BEE Level 2 or higher",
        "Minimum 5 years experience in medical supply",
        "ISO 9001 certification"
    ],
    documents: [
        {
            id: "1",
            file_name: "Tender Document.pdf",
            file_size: 2500000,
            file_type: "application/pdf",
            created_at: "2025-01-05",
            ai_analysis: {
                summary: "AI Analysis Summary",
                keyRequirements: [
                    "Key Requirement 1",
                    "Key Requirement 2"
                ],
                recommendations: [
                    "Recommendation 1",
                    "Recommendation 2"
                ],
                actionableTasks: [
                    {
                        task: "Task 1",
                        priority: "high",
                        category: "Category 1",
                        deadline: "2025-01-10"
                    },
                    {
                        task: "Task 2",
                        priority: "medium",
                        category: "Category 2",
                        deadline: "2025-01-15"
                    }
                ],
                deadlines: [
                    "Deadline 1",
                    "Deadline 2"
                ],
                complianceChecklist: [
                    "Item 1",
                    "Item 2"
                ]
            }
        },
        {
            id: "2",
            file_name: "Company Profile.pdf",
            file_size: 1200000,
            file_type: "application/pdf",
            created_at: "2025-01-06",
            ai_analysis: null
        },
        {
            id: "3",
            file_name: "Tax Clearance.pdf",
            file_size: 800000,
            file_type: "application/pdf",
            created_at: "2025-01-06",
            ai_analysis: null
        }
    ]
};
function TenderDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const id = params.id;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [tender, setTender] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [documents, setDocuments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [analysis, setAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [analyzing, setAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [chatInput, setChatInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedFile, setSelectedFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null) // Declare setSelectedFile variable
    ;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TenderDetailPage.useEffect": ()=>{
            loadTenderData();
            loadDocuments();
        }
    }["TenderDetailPage.useEffect"], [
        id
    ]);
    const loadTenderData = async ()=>{
        try {
            // Fetch tender and analysis from database
            const response = await fetch(`/api/tenders/scraped/${id}`);
            if (response.ok) {
                const data = await response.json();
                setTender(data.tender);
                setAnalysis(data.analysis);
            }
        } catch (error) {
            console.error("[v0] Error loading tender:", error);
        } finally{
            setLoading(false);
        }
    };
    const loadDocuments = async ()=>{
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$dbf0b3__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getTenderDocuments"])(id);
        if (result.success) {
            setDocuments(result.documents || []);
        }
    };
    const handleFileUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userTenderId", id);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$eb3dbc__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["uploadTenderDocument"])(formData);
        if (result.success) {
            await loadDocuments();
            setSelectedFile(null);
            e.target.value = "";
            // Auto-analyze PDF documents
            if (file.type === "application/pdf") {
                await handleAnalyzeDocument(result.data.id, file);
            }
        } else {
            alert(result.error || "Failed to upload document");
        }
        setUploading(false);
    };
    const handleDownload = async (documentId)=>{
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$922a82__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["downloadTenderDocument"])(documentId);
        if (result.success && result.url) {
            window.open(result.url, "_blank");
        } else {
            alert(result.error || "Failed to download document");
        }
    };
    const handleDelete = async (documentId)=>{
        if (!confirm("Are you sure you want to delete this document?")) return;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$9c0c72__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteTenderDocument"])(documentId);
        if (result.success) {
            await loadDocuments();
        } else {
            alert(result.error || "Failed to delete document");
        }
    };
    const handleAnalyzeDocument = async (documentId, file)=>{
        setAnalyzing(documentId);
        try {
            console.log("[v0] Starting document analysis for:", file.name, "Type:", file.type, "Size:", file.size);
            // Extract text from PDF using the API
            const formData = new FormData();
            formData.append("file", file);
            console.log("[v0] Sending PDF to extraction API...");
            const extractResponse = await fetch("/api/extract-pdf", {
                method: "POST",
                body: formData
            });
            console.log("[v0] Extract API response status:", extractResponse.status);
            if (!extractResponse.ok) {
                let errorData;
                try {
                    errorData = await extractResponse.json();
                } catch  {
                    errorData = {
                        error: `HTTP ${extractResponse.status}: ${extractResponse.statusText}`
                    };
                }
                console.error("[v0] PDF extraction failed:", errorData);
                throw new Error(errorData.error || "Failed to extract text from PDF");
            }
            const { text } = await extractResponse.json();
            console.log("[v0] Extracted text length:", text.length);
            console.log("[v0] Text preview:", text.substring(0, 200));
            if (!text || text.length < 50) {
                throw new Error("Could not extract sufficient text from PDF. Please ensure the PDF contains searchable text.");
            }
            console.log("[v0] Sending text to analysis API...");
            const analyzeResponse = await fetch("/api/analyze-tender", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    documentText: text
                })
            });
            console.log("[v0] Analyze API response status:", analyzeResponse.status);
            console.log("[v0] Analyze API response headers:", Object.fromEntries(analyzeResponse.headers.entries()));
            const responseClone = analyzeResponse.clone();
            if (!analyzeResponse.ok) {
                let errorData;
                try {
                    errorData = await analyzeResponse.json();
                } catch (jsonError) {
                    console.error("[v0] Failed to parse error response as JSON:", jsonError);
                    const responseText = await responseClone.text();
                    console.error("[v0] Error response body:", responseText);
                    errorData = {
                        error: `HTTP ${analyzeResponse.status}: ${analyzeResponse.statusText}`
                    };
                }
                console.error("[v0] Analysis API failed:", errorData);
                throw new Error(errorData.error || "Failed to analyze document");
            }
            let analysis;
            try {
                const contentType = analyzeResponse.headers.get("content-type");
                console.log("[v0] Response content-type:", contentType);
                if (!contentType || !contentType.includes("application/json")) {
                    const responseText = await responseClone.text();
                    console.error("[v0] Response is not JSON. Content-Type:", contentType);
                    console.error("[v0] Response body:", responseText);
                    throw new Error("Server returned non-JSON response. Expected JSON but got: " + contentType);
                }
                analysis = await analyzeResponse.json();
                console.log("[v0] Analysis received:", analysis);
            } catch (jsonError) {
                console.error("[v0] Failed to parse analysis response as JSON:", jsonError);
                try {
                    const responseText = await responseClone.text();
                    console.error("[v0] Response body was:", responseText);
                } catch (textError) {
                    console.error("[v0] Could not read response body:", textError);
                }
                throw new Error("Failed to parse analysis response. The server returned invalid JSON.");
            }
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$d54cb4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["analyzeDocument"])(documentId, analysis);
            console.log("[v0] Save result:", result);
            if (result.success) {
                await loadDocuments();
                alert("Document analyzed successfully!");
            } else {
                console.error("[v0] Failed to save analysis:", result.error);
                throw new Error(result.error || "Failed to save analysis");
            }
        } catch (error) {
            console.error("[v0] Error analyzing document:", error);
            alert(error.message || "Failed to analyze document");
        } finally{
            setAnalyzing(null);
        }
    };
    const handleAnalyzeFromInsights = async (doc)=>{
        setAnalyzing(doc.id);
        try {
            console.log("[v0] Analyzing document from insights:", doc.file_name);
            console.log("[v0] Storage path:", doc.storage_path);
            console.log("[v0] File type:", doc.file_type);
            // Check if it's an external document or uploaded document
            const isExternalUrl = doc.storage_path.startsWith("http://") || doc.storage_path.startsWith("https://");
            if (isExternalUrl) {
                console.log("[v0] Fetching external document via proxy:", doc.storage_path);
                const proxyResponse = await fetch("/api/proxy-document", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        url: doc.storage_path
                    })
                });
                console.log("[v0] Proxy response status:", proxyResponse.status);
                if (!proxyResponse.ok) {
                    const error = await proxyResponse.json();
                    console.error("[v0] Proxy failed:", error);
                    throw new Error(error.error || "Failed to fetch external document");
                }
                const { data, type } = await proxyResponse.json();
                console.log("[v0] Received document from proxy, type:", type, "data length:", data.length);
                // Convert base64 back to blob
                const binaryString = atob(data);
                const bytes = new Uint8Array(binaryString.length);
                for(let i = 0; i < binaryString.length; i++){
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([
                    bytes
                ], {
                    type
                });
                const file = new File([
                    blob
                ], doc.file_name, {
                    type
                });
                console.log("[v0] Created file from blob:", file.name, file.size, file.type);
                await handleAnalyzeDocument(doc.id, file);
            } else {
                // For uploaded documents, download from Supabase Storage
                console.log("[v0] Downloading uploaded document from Supabase");
                const downloadResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$922a82__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["downloadTenderDocument"])(doc.id);
                if (!downloadResult.success || !downloadResult.url) {
                    console.error("[v0] Download failed:", downloadResult.error);
                    throw new Error(downloadResult.error || "Failed to download document");
                }
                console.log("[v0] Download URL obtained, fetching file...");
                const fileResponse = await fetch(downloadResult.url);
                if (!fileResponse.ok) {
                    throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
                }
                const blob = await fileResponse.blob();
                const file = new File([
                    blob
                ], doc.file_name, {
                    type: doc.file_type
                });
                console.log("[v0] File downloaded:", file.name, file.size, file.type);
                await handleAnalyzeDocument(doc.id, file);
            }
        } catch (error) {
            console.error("[v0] Error in handleAnalyzeFromInsights:", error);
            alert(error.message || "Failed to analyze document");
            setAnalyzing(null);
        }
    };
    const getStatusColor = (status)=>{
        switch(status){
            case "draft":
                return "bg-muted text-muted-foreground";
            case "in-progress":
                return "bg-accent/10 text-accent";
            case "submitted":
                return "bg-secondary/10 text-secondary";
            default:
                return "bg-muted text-muted-foreground";
        }
    };
    const getPriorityColor = (priority)=>{
        switch(priority){
            case "high":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            case "medium":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "low":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            default:
                return "bg-muted text-muted-foreground";
        }
    };
    const getPriorityIcon = (priority)=>{
        switch(priority){
            case "high":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                    lineNumber: 398,
                    columnNumber: 16
                }, this);
            case "medium":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                    lineNumber: 400,
                    columnNumber: 16
                }, this);
            case "low":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                    lineNumber: 402,
                    columnNumber: 16
                }, this);
            default:
                return null;
        }
    };
    const { messages, sendMessage, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$react$40$2$2e$0$2e$118_react$40$19$2e$1$2e$0_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$ai$2d$sdk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChat"])({
        transport: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ai$40$5$2e$0$2e$116_zod$40$3$2e$25$2e$76$2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DefaultChatTransport"]({
            api: "/api/ai-assistant",
            body: {
                tenderContext: {
                    title: tender?.title || "Tender",
                    organization: tender?.source_name,
                    description: tender?.description
                }
            }
        })
    });
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "h-8 w-8 animate-spin text-primary"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                lineNumber: 424,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
            lineNumber: 423,
            columnNumber: 7
        }, this);
    }
    if (!tender) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 md:p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                variant: "destructive",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                        lineNumber: 433,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                        children: "Tender not found"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                        lineNumber: 434,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                lineNumber: 432,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
            lineNumber: 431,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col lg:flex-row gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 space-y-4 md:space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/dashboard/tenders",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                lineNumber: 448,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 447,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-2xl md:text-3xl font-bold text-foreground",
                                            children: analysis?.tender_summary?.title || tender.title || "Tender"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 452,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 446,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            className: "bg-primary/10 text-primary",
                                            children: "Scraped"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 457,
                                            columnNumber: 15
                                        }, this),
                                        tender.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: "outline",
                                            children: tender.category
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 458,
                                            columnNumber: 35
                                        }, this),
                                        analysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: "secondary",
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 19
                                                }, this),
                                                "AI Analyzed"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 460,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 456,
                                    columnNumber: 13
                                }, this),
                                (analysis?.tender_summary?.description || tender.description) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground mb-4",
                                    children: analysis?.tender_summary?.description || tender.description
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 467,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-4 text-sm text-muted-foreground",
                                    children: [
                                        (analysis?.tender_summary?.entity || tender.source_name) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 474,
                                                    columnNumber: 19
                                                }, this),
                                                analysis?.tender_summary?.entity || tender.source_name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 473,
                                            columnNumber: 17
                                        }, this),
                                        (analysis?.tender_summary?.closing_date || tender.close_date) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 480,
                                                    columnNumber: 19
                                                }, this),
                                                "Closes: ",
                                                new Date(analysis?.tender_summary?.closing_date || tender.close_date).toLocaleDateString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 479,
                                            columnNumber: 17
                                        }, this),
                                        tender.estimated_value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Value: ",
                                                    tender.estimated_value
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                lineNumber: 486,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 485,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 471,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                            lineNumber: 445,
                            columnNumber: 11
                        }, this),
                        analyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Alert"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "h-4 w-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 494,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDescription"], {
                                    children: "Analyzing tender documents with AI... This may take a minute."
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 495,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                            lineNumber: 493,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
                            defaultValue: "overview",
                            className: "space-y-4 md:space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsList"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "overview",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 502,
                                                    columnNumber: 17
                                                }, this),
                                                "Overview"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 501,
                                            columnNumber: 15
                                        }, this),
                                        analysis?.action_plan && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "action-plan",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 19
                                                }, this),
                                                "Action Plan"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 506,
                                            columnNumber: 17
                                        }, this),
                                        analysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "analysis",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 19
                                                }, this),
                                                "AI Insights"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 512,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "documents",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 17
                                                }, this),
                                                "Documents (",
                                                documents.length,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 517,
                                            columnNumber: 15
                                        }, this),
                                        analysis?.formFields && analysis.formFields.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                            value: "form",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 19
                                                }, this),
                                                "Response Form"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 522,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 500,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                    value: "overview",
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                            children: "Tender Information"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 532,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                            children: analysis ? "Information extracted from tender document" : "Basic tender information"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 533,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 531,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    className: "space-y-4",
                                                    children: [
                                                        analysis?.tender_summary?.tender_number && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-[140px_1fr] gap-2 items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium text-muted-foreground",
                                                                    children: "Tender Number:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-mono bg-muted px-2 py-1 rounded",
                                                                    children: analysis.tender_summary.tender_number
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 541,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 539,
                                                            columnNumber: 21
                                                        }, this),
                                                        (analysis?.tender_summary?.title || tender.title) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-[140px_1fr] gap-2 items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium text-muted-foreground",
                                                                    children: "Title:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 548,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm",
                                                                    children: analysis?.tender_summary?.title || tender.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 549,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 547,
                                                            columnNumber: 21
                                                        }, this),
                                                        (analysis?.tender_summary?.entity || tender.source_name) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-[140px_1fr] gap-2 items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium text-muted-foreground",
                                                                    children: "Organization:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 554,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm",
                                                                    children: analysis?.tender_summary?.entity || tender.source_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 555,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 553,
                                                            columnNumber: 21
                                                        }, this),
                                                        (analysis?.tender_summary?.closing_date || tender.close_date) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-[140px_1fr] gap-2 items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium text-muted-foreground",
                                                                    children: "Closing Date:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 560,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-semibold text-orange-600 dark:text-orange-400",
                                                                    children: new Date(analysis?.tender_summary?.closing_date || tender.close_date).toLocaleDateString()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 561,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 559,
                                                            columnNumber: 21
                                                        }, this),
                                                        analysis?.tender_summary?.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-[140px_1fr] gap-2 items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium text-muted-foreground",
                                                                    children: "Category:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 568,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "outline",
                                                                    children: analysis.tender_summary.category
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 569,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 567,
                                                            columnNumber: 21
                                                        }, this),
                                                        tender.source_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-[140px_1fr] gap-2 items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium text-muted-foreground",
                                                                    children: "Source:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 574,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: tender.source_url,
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    className: "text-sm text-primary hover:underline truncate",
                                                                    children: tender.source_url
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 575,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 573,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 537,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 530,
                                            columnNumber: 15
                                        }, this),
                                        analysis?.eligibility_requirements && analysis.eligibility_requirements.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "h-5 w-5 text-primary"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 592,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Eligibility Requirements"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 591,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                            children: "Requirements you must meet to qualify"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 595,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 590,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "space-y-2",
                                                        children: analysis.eligibility_requirements.map((req, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-start gap-2 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        className: "h-4 w-4 text-green-500 mt-0.5 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 601,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: req
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 602,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                lineNumber: 600,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 598,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 597,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 589,
                                            columnNumber: 17
                                        }, this),
                                        analysis?.required_documents && analysis.required_documents.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                    className: "h-5 w-5 text-primary"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 614,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Required Documents"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 613,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                            children: "Documents you need to submit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 617,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 612,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "grid gap-2 sm:grid-cols-2",
                                                        children: analysis.required_documents.map((doc, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-start gap-2 text-sm p-2 rounded-lg bg-muted/50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                        className: "h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 623,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: doc
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 624,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                lineNumber: 622,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 620,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 619,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 611,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 529,
                                    columnNumber: 13
                                }, this),
                                analysis?.action_plan && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                    value: "action-plan",
                                    className: "space-y-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        children: "AI-Generated Action Plan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 637,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                        children: "Step-by-step tasks to complete your bid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 638,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                lineNumber: 636,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: analysis.action_plan.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-3 p-3 rounded-lg border",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `p-1 rounded ${getPriorityColor(item.priority)}`,
                                                                    children: getPriorityIcon(item.priority)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 644,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-medium text-sm",
                                                                            children: item.task
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                            lineNumber: 648,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 mt-1 text-xs text-muted-foreground",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                    variant: "outline",
                                                                                    className: "text-xs",
                                                                                    children: item.category
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                    lineNumber: 650,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                item.deadline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "flex items-center gap-1",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                                            className: "h-3 w-3"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                            lineNumber: 655,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        item.deadline
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                    lineNumber: 654,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                            lineNumber: 649,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                    lineNumber: 647,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                            lineNumber: 643,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 641,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                lineNumber: 640,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                        lineNumber: 635,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 634,
                                    columnNumber: 15
                                }, this),
                                analysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                    value: "analysis",
                                    className: "space-y-4",
                                    children: [
                                        analysis.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        children: "AI Summary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 674,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 673,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground",
                                                        children: analysis.summary
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 677,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 676,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 672,
                                            columnNumber: 19
                                        }, this),
                                        analysis.recommendations && analysis.recommendations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        children: "Recommendations"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 684,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 683,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "space-y-2",
                                                        children: analysis.recommendations.map((rec, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-start gap-2 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                        className: "h-4 w-4 text-primary mt-0.5 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 690,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: rec
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 691,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                lineNumber: 689,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 687,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                    lineNumber: 686,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                            lineNumber: 682,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 670,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                    value: "documents",
                                    className: "space-y-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        children: "Tender Documents"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 704,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                        children: "Upload and manage your tender documents"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 705,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                lineNumber: 703,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border-2 border-dashed rounded-lg p-6 text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                type: "file",
                                                                accept: ".pdf,.doc,.docx,.xls,.xlsx",
                                                                onChange: handleFileUpload,
                                                                disabled: uploading,
                                                                className: "hidden",
                                                                id: "file-upload"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                lineNumber: 709,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                htmlFor: "file-upload",
                                                                className: "cursor-pointer",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                        className: "h-8 w-8 text-muted-foreground mx-auto mb-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 718,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-muted-foreground mb-1",
                                                                        children: uploading ? "Uploading..." : "Click to upload or drag and drop"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 719,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: "PDF, DOC, DOCX, XLS, XLSX"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 722,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                lineNumber: 717,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 708,
                                                        columnNumber: 19
                                                    }, this),
                                                    documents.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: documents.map((doc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between p-3 rounded-lg border",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                                className: "h-5 w-5 text-muted-foreground"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                lineNumber: 731,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm font-medium",
                                                                                        children: doc.file_name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                        lineNumber: 733,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-xs text-muted-foreground",
                                                                                        children: [
                                                                                            (doc.file_size / 1024 / 1024).toFixed(2),
                                                                                            " MB"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                        lineNumber: 734,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                lineNumber: 732,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 730,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            doc.ai_analysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "secondary",
                                                                                className: "text-xs",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                                        className: "h-3 w-3 mr-1"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                        lineNumber: 742,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    "Analyzed"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                lineNumber: 741,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            !doc.ai_analysis && doc.file_type === "application/pdf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "outline",
                                                                                onClick: ()=>handleAnalyzeFromInsights(doc),
                                                                                disabled: analyzing === doc.id,
                                                                                children: analyzing === doc.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                    className: "h-4 w-4 animate-spin"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                    lineNumber: 754,
                                                                                    columnNumber: 35
                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                                            className: "h-4 w-4 mr-1"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                            lineNumber: 757,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        "Analyze"
                                                                                    ]
                                                                                }, void 0, true)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                lineNumber: 747,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "icon",
                                                                                variant: "ghost",
                                                                                onClick: ()=>handleDownload(doc.id),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                                    className: "h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                    lineNumber: 764,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                lineNumber: 763,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "icon",
                                                                                variant: "ghost",
                                                                                onClick: ()=>handleDelete(doc.id),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$1$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                                    className: "h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                    lineNumber: 767,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                                lineNumber: 766,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                        lineNumber: 739,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, doc.id, true, {
                                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                                lineNumber: 729,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                        lineNumber: 727,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                                lineNumber: 707,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                        lineNumber: 702,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 701,
                                    columnNumber: 13
                                }, this),
                                analysis?.formFields && analysis.formFields.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                    value: "form",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dynamic$2d$tender$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicTenderForm"], {
                                        formFields: analysis.formFields,
                                        tenderId: id
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                        lineNumber: 780,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                                    lineNumber: 779,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                            lineNumber: 499,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                    lineNumber: 444,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lg:w-80 xl:w-96 flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:sticky lg:top-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$strategist$2f$tender$2d$context$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TenderContextStrategistPanel"], {
                            tender: {
                                id: id,
                                title: analysis?.tender_summary?.title || tender.title || "Tender",
                                organization: analysis?.tender_summary?.entity || tender.source_name,
                                description: analysis?.tender_summary?.description || tender.description,
                                deadline: analysis?.tender_summary?.closing_date || tender.close_date,
                                value: tender.estimated_value,
                                requirements: analysis?.eligibility_requirements || [],
                                analysis: analysis
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                            lineNumber: 788,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                        lineNumber: 787,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
                    lineNumber: 786,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
            lineNumber: 442,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/tenders/[id]/page.tsx",
        lineNumber: 441,
        columnNumber: 5
    }, this);
}
_s(TenderDetailPage, "dZ8gZLH5L6Att4O5LAuag2FVYtU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$opentelemetry_0d106b891cc3169ef6f583aee116eb12$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$react$40$2$2e$0$2e$118_react$40$19$2e$1$2e$0_zod$40$3$2e$25$2e$76$2f$node_modules$2f40$ai$2d$sdk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChat"]
    ];
});
_c = TenderDetailPage;
var _c;
__turbopack_context__.k.register(_c, "TenderDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_4a776aa0._.js.map