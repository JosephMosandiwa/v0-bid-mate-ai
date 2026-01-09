module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},89660,e=>{"use strict";e.i(929961);var t=e.i(771884),r=e.i(875216);async function a(){let e=await (0,r.cookies)();return(0,t.createServerClient)("https://xqyecqkrtaydoesxnvlw.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxeWVjcWtydGF5ZG9lc3hudmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjM0NTgsImV4cCI6MjA3Njg5OTQ1OH0.wsb5Jz_I9RqxoNoZ6D3QPbK4aefbdGKcrGgWDfm3c4o",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:r,options:a})=>e.set(t,r,a))}catch{}}}})}e.s(["createClient",()=>a,"createServerClient",0,a])},773939,(e,t,r)=>{"use strict";var a=Object.defineProperty,n=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,s=Object.prototype.hasOwnProperty,o={},l={VercelOidcTokenError:()=>u};for(var c in l)a(o,c,{get:l[c],enumerable:!0});t.exports=((e,t,r,o)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let r of i(t))s.call(e,r)||void 0===r||a(e,r,{get:()=>t[r],enumerable:!(o=n(t,r))||o.enumerable});return e})(a({},"__esModule",{value:!0}),o);class u extends Error{constructor(e,t){super(e),this.name="VercelOidcTokenError",this.cause=t}toString(){return this.cause?`${this.name}: ${this.message}: ${this.cause}`:`${this.name}: ${this.message}`}}},917063,e=>{"use strict";var t=e.i(248749),r=e.i(219650),a=e.i(508677),n=e.i(615159),i=e.i(548938),s=e.i(273073),o=e.i(129714),l=e.i(403736),c=e.i(817889),u=e.i(428765),d=e.i(762198),p=e.i(117109),g=e.i(590702),m=e.i(462216),h=e.i(539401),f=e.i(222695),v=e.i(193695);e.i(31514);var y=e.i(267074),R=e.i(303826),E=e.i(89660);e.i(754105);var C=e.i(161513),S=e.i(274506);async function x(e){try{let t,r=await (0,E.createClient)(),{data:{user:a}}=await r.auth.getUser();if(!a)return Response.json({error:"Unauthorized"},{status:401});let n=await e.json();if(n.messages&&Array.isArray(n.messages)){let e=n.messages.filter(e=>"user"===e.role).pop();t=e?.content||""}else t=n.message||"";let{conversation_id:i,context_type:s="general",tender_id:o,include_context:l=!0,tenderContext:c}=n;if(!t||"string"!=typeof t)return Response.json({error:"Message is required"},{status:400});console.log("[Strategist] Chat request from user:",a.id),console.log("[Strategist] Context type:",s),console.log("[Strategist] Tender ID:",o||"none");let u=i;if(!u){let e=await C.StrategistService.createConversation(a.id,s,o);if(!e)return Response.json({error:"Failed to create conversation"},{status:500});u=e.id}await C.StrategistService.addMessage(u,"user",t);let d=await C.StrategistService.getConversationMessages(u),p="";if(l){let e=await C.StrategistService.buildContext(a.id,o,s);c&&(e.tender_context=c),p=(0,S.buildStrategistPrompt)(e),c&&(p=`# 🎯 CURRENT TENDER FOCUS

You are currently advising on THIS SPECIFIC TENDER:

**Title:** ${c.title||"Unknown"}
**Organization:** ${c.organization||"Not specified"}
**Deadline:** ${c.deadline||"Not specified"}
**Value:** ${c.value||"Not specified"}
**Description:** ${c.description||"Not provided"}

${c.requirements?.length>0?`**Key Requirements:**
${c.requirements.map(e=>`- ${e}`).join("\n")}`:""}

${c.analysis?`**Analysis Summary:**
${JSON.stringify(c.analysis.tender_summary||{},null,2)}`:""}

⚠️ CRITICAL INSTRUCTION: Every response MUST be specific to THIS tender. Always reference:
- The tender title ("${c.title}")
- The organization ("${c.organization}")  
- The specific requirements and context provided above
- The deadline and value when giving advice

Never give generic advice. Always tailor your guidance to THIS specific tender opportunity.

---

${p}

# TENDER STRATEGIST - COMPREHENSIVE PLANNING EXPERT

You are an expert South African tender strategist and project planner. When discussing this tender, you provide actionable, practical guidance on:

## 🎯 STRATEGIC PLANNING
- Win strategy and competitive positioning
- Risk assessment and mitigation plans
- Resource allocation and capacity planning
- Timeline and milestone planning
- Bid/no-bid decision support

## 💼 PROJECT PLANNING
- Budget estimation with detailed breakdowns
- Work breakdown structure (WBS)
- Resource requirements (personnel, equipment, materials)
- Project timeline with phases and tasks
- Risk management strategies
- Quality assurance plans
- Success criteria and KPIs

## 📋 CERTIFICATIONS & LICENSES
Help users identify and obtain all required certifications:
- CIDB grading (for construction)
- Professional registrations (engineers, architects, etc.)
- ISO certifications (9001, 14001, 45001)
- Industry-specific licenses
- B-BBEE certificate
- Tax clearance certificate
- Company registration documents
**For each:** name, issuing authority, validity period, estimated cost, processing time, priority level

## 🛡️ INSURANCE REQUIREMENTS
Specify all insurance policies needed:
- Professional indemnity insurance
- Public liability insurance
- Employer's liability (COIDA)
- All-risk insurance
- Performance bonds
- Plant and equipment insurance
**For each:** type, minimum coverage amount, provider suggestions, estimated annual cost, priority

## ✅ COMPLIANCE & REGULATORY
South African regulatory requirements:
- B-BBEE compliance and verification
- PFMA/MFMA compliance (government procurement)
- Tax compliance (SARS)
- Labour law compliance (BCEA, LRA, EEA)
- Health & Safety (OHS Act, Construction Regulations)
- Environmental regulations (NEMA, EIA)
- Municipal by-laws
- Industry-specific regulations
**For each:** requirement, authority, deadline, evidence needed, penalties for non-compliance

## 💰 FINANCIAL READINESS
- Bank guarantee requirements
- Cash flow projections (monthly)
- Working capital needs
- Credit facilities recommendations
- Payment terms analysis
- Profit margin optimization

## 🏗️ CAPACITY DEMONSTRATION
Help users prove their capacity:
- Past project experience requirements
- Reference letters needed (number and type)
- Equipment that must be owned vs rented
- Personnel qualifications required
- Subcontracting strategies
- Joint venture considerations

## 📊 EXECUTION PLANNING
- Delivery methodology
- Quality control procedures
- Progress reporting requirements
- Stakeholder management
- Change management processes
- Contract administration

## 🇿🇦 SOUTH AFRICAN CONTEXT
Deep expertise in:
- PFMA (Public Finance Management Act)
- MFMA (Municipal Finance Management Act)
- PPPFA (Preferential Procurement Policy Framework Act)
- Construction Regulations (2014)
- B-BBEE Codes and Verification
- Local content requirements
- Subcontracting regulations
- Provincial and municipal variations

When asked about planning, budgets, certifications, insurance, compliance, or any tender requirement, provide:
1. Detailed, actionable checklists
2. Realistic cost estimates
3. Timelines with key milestones
4. Practical implementation steps
5. Common pitfalls to avoid
6. South African-specific considerations

Your goal is to ensure the user is fully prepared with all requirements, certifications, insurance, and compliance before submitting their bid.`)}else p=(0,S.buildStrategistPrompt)({user_preferences:null,company_profile:null});let g=[{role:"system",content:p},...d.map(e=>({role:e.role,content:e.content}))];console.log("[Strategist] Calling AI with",g.length,"messages");let m=(0,R.streamTextViaProvider)({model:"openai/gpt-4o-mini",messages:g,temperature:.7,maxTokens:2e3,abortSignal:e.signal,onFinish:async({text:e})=>{await C.StrategistService.addMessage(u,"assistant",e,{model_used:"gpt-4o-mini"})}}).toUIMessageStreamResponse();return m.headers.set("X-Conversation-Id",u),m}catch(e){if(console.error("[Strategist] Chat error:",e),e?.message?.includes("API key"))return Response.json({error:"AI service configuration error"},{status:503});return Response.json({error:"Failed to process chat message"},{status:500})}}async function A(e){try{let t=await (0,E.createClient)(),{data:{user:r}}=await t.auth.getUser();if(!r)return Response.json({error:"Unauthorized"},{status:401});let{searchParams:a}=new URL(e.url),n=a.get("conversation_id");if(n){let e=await C.StrategistService.getConversationMessages(n);return Response.json({messages:e})}{let e=await C.StrategistService.getUserConversations(r.id);return Response.json({conversations:e})}}catch(e){return console.error("[Strategist] GET error:",e),Response.json({error:"Failed to fetch data"},{status:500})}}e.s(["GET",()=>A,"POST",()=>x,"maxDuration",0,60],965915);var w=e.i(965915);let I=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/strategist/message/route",pathname:"/api/strategist/message",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/strategist/message/route.ts",nextConfigOutput:"",userland:w}),{workAsyncStorage:b,workUnitAsyncStorage:T,serverHooks:N}=I;function P(){return(0,a.patchFetch)({workAsyncStorage:b,workUnitAsyncStorage:T})}async function O(e,t,a){I.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/strategist/message/route";R=R.replace(/\/index$/,"")||"/";let E=await I.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!E)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,params:S,nextConfig:x,parsedUrl:A,isDraftMode:w,prerenderManifest:b,routerServerContext:T,isOnDemandRevalidate:N,revalidateOnlyGenerated:P,resolvedPathname:O,clientReferenceManifest:k,serverActionsManifest:j}=E,q=(0,l.normalizeAppPath)(R),M=!!(b.dynamicRoutes[q]||b.routes[O]),_=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,A,!1):t.end("This page could not be found"),null);if(M&&!w){let e=!!b.routes[O],t=b.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(x.experimental.adapterPath)return await _();throw new v.NoFallbackError}}let U=null;!M||I.isDev||w||(U="/index"===(U=O)?"/":U);let F=!0===I.isDev||!M,D=M&&!F;j&&k&&(0,s.setReferenceManifestsSingleton)({page:R,clientReferenceManifest:k,serverActionsManifest:j,serverModuleMap:(0,o.createServerModuleMap)({serverActionsManifest:j})});let H=e.method||"GET",$=(0,i.getTracer)(),B=$.getActiveScopeSpan(),L={params:S,prerenderManifest:b,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:x.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>I.onRequestError(e,t,a,T)},sharedContext:{buildId:C}},G=new c.NodeNextRequest(e),z=new c.NodeNextResponse(t),K=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let s=async e=>I.handle(K,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=$.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${H} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${R}`)}),o=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var i,l;let c=async({previousCacheEntry:r})=>{try{if(!o&&N&&P&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(n);e.fetchMetrics=L.renderOpts.fetchMetrics;let l=L.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let c=L.renderOpts.collectedTags;if(!M)return await (0,g.sendResponse)(G,z,i,L.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(i.headers);c&&(t[f.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,a=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:N})},T),t}},u=await I.handleResponse({req:e,nextConfig:x,cacheKey:U,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:b,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:P,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:o});if(!M)return null;if((null==u||null==(i=u.value)?void 0:i.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",N?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,m.fromNodeOutgoingHttpHeaders)(u.value.headers);return o&&M||d.delete(f.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,h.getCacheControlHeader)(u.cacheControl)),await (0,g.sendResponse)(G,z,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};B?await l(B):await $.withPropagatedContext(e.headers,()=>$.trace(d.BaseServerSpan.handleRequest,{spanName:`${H} ${R}`,kind:i.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l))}catch(t){if(t instanceof v.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:N})}),M)throw t;return await (0,g.sendResponse)(G,z,new Response(null,{status:500})),null}}e.s(["handler",()=>O,"patchFetch",()=>P,"routeModule",()=>I,"serverHooks",()=>N,"workAsyncStorage",()=>b,"workUnitAsyncStorage",()=>T],917063)},216653,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__a6a8820c._.js"].map(t=>e.l(t))).then(()=>t(439609)))},792892,e=>{e.v(t=>Promise.all(["server/chunks/[root-of-the-server]__8bbeb9a7._.js"].map(t=>e.l(t))).then(()=>t(927791)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__13c5d518._.js.map