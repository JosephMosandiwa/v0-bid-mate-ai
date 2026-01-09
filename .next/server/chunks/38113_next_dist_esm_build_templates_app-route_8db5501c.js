module.exports=[589360,e=>{"use strict";var t=e.i(248749),r=e.i(219650),n=e.i(508677),i=e.i(615159),a=e.i(548938),o=e.i(273073),s=e.i(129714),l=e.i(403736),c=e.i(817889),d=e.i(428765),p=e.i(762198),u=e.i(117109),g=e.i(590702),_=e.i(462216),m=e.i(539401),f=e.i(222695),y=e.i(193695);e.i(31514);var v=e.i(267074),h=e.i(303826),R=e.i(89660);e.i(754105);var S=e.i(161513);async function E(e){try{let t=await (0,R.createClient)(),{data:{user:r}}=await t.auth.getUser();if(!r)return Response.json({error:"Unauthorized"},{status:401});let{tender_id:n,tenderId:i,tenderType:a,tenderTitle:o,tenderDescription:s,analysisData:l,projectPlan:c,boq_items:d,question:p}=await e.json(),u=n||i,g=a||"custom";if(!u)return Response.json({error:"Tender ID required"},{status:400});if(console.log("[v0] BOQ generation request for tender:",u,"Type:",g),console.log("[v0] Tender title:",o),o){let e,n;console.log("[Strategist] Generating comprehensive BOQ for THIS SPECIFIC TENDER:",o);let i=`You are generating a Bill of Quantities specifically for THIS tender:

**🎯 THIS TENDER: "${o}"**
Organization: ${l?.organization||"Not specified"}
Deadline: ${l?.deadline||"Not specified"}
Estimated Value: ${l?.value||"Not specified"}

**Description:**
${s||"Not provided"}

**THIS TENDER'S Specific Requirements:**
${l?.requirements?JSON.stringify(l.requirements,null,2):"Standard requirements"}

**Analysis of THIS TENDER:**
${l?JSON.stringify(l,null,2):"Not available"}

**Project Plan for THIS TENDER:**
${c?JSON.stringify(c,null,2):"Not available"}

🚨 CRITICAL: Every line item MUST be directly relevant to delivering THIS SPECIFIC tender ("${o}").
Do NOT provide generic BOQ templates - tailor EVERYTHING to what THIS tender actually requires.

Generate a detailed, realistic BOQ specifically for "${o}" with the following structure.

YOU MUST RETURN ONLY VALID JSON - NO MARKDOWN, NO EXPLANATIONS, JUST THE JSON OBJECT.

{
  "boq_items": [
    {
      "item_number": "1.1",
      "description": "Detailed description of work/material",
      "category": "Labor|Materials|Equipment|Subcontractors|Professional Services",
      "unit": "m\xb2|hours|kg|each|lot",
      "quantity": 100,
      "unit_rate": 500,
      "amount": 50000,
      "notes": "Special considerations"
    }
  ],
  "pricing_strategy": {
    "strategy_type": "competitive|value_based|cost_plus|strategic_loss_leader",
    "competitive_analysis": "Analysis text",
    "risk_premium_percent": 5,
    "discount_offered_percent": 2,
    "payment_terms": "30/60/90 days",
    "pricing_rationale": "Why this approach"
  },
  "direct_costs": {
    "labor": 100000,
    "materials": 50000,
    "equipment": 20000,
    "subcontractors": 30000
  },
  "indirect_costs": {
    "overhead": 20000,
    "admin": 8000,
    "transport": 5000,
    "insurance": 3000,
    "certifications": 2000,
    "compliance": 2000
  },
  "contingency_percent": 10,
  "profit_margin_percent": 15,
  "vat_percent": 15,
  "break_even_analysis": {
    "break_even_value": 180000,
    "break_even_timeline": "4 months",
    "profitability_threshold": "Description"
  },
  "cash_flow_projection": {
    "months": [
      {
        "month": 1,
        "inflow": 50000,
        "outflow": 40000,
        "net_cash_flow": 10000,
        "cumulative_cash_flow": 10000
      }
    ]
  },
  "profitability_analysis": {
    "gross_profit_margin": 25,
    "net_profit_margin": 15,
    "return_on_investment": 20,
    "payback_period_months": 6
  }
}

REMEMBER: Return ONLY the JSON object, no markdown code blocks, no explanations.`;console.log("[v0] Calling AI to generate BOQ...");let{text:a}=await (0,h.default)({model:"openai/gpt-4o",prompt:i,temperature:.7,maxTokens:4e3});console.log("[v0] AI response received, length:",a.length),console.log("[v0] First 500 chars:",a.substring(0,500));try{let t=a.match(/```json\s*([\s\S]*?)\s*```/)||a.match(/```\s*([\s\S]*?)\s*```/),r=t?t[1]:a.trim();console.log("[v0] Attempting to parse JSON, first 200 chars:",r.substring(0,200)),e=JSON.parse(r),console.log("[v0] JSON parsed successfully")}catch(e){return console.error("[v0] Failed to parse BOQ JSON:",e.message),console.error("[v0] Raw text that failed to parse:",a),Response.json({error:"Failed to generate valid BOQ",details:`JSON parse error: ${e.message}`,raw_response:a.substring(0,500)},{status:500})}if(!e.boq_items||!Array.isArray(e.boq_items)||0===e.boq_items.length)return console.error("[v0] BOQ data missing required boq_items array"),Response.json({error:"Invalid BOQ structure",details:"Missing or empty boq_items array"},{status:500});console.log("[v0] BOQ has",e.boq_items.length,"items");let d=e.boq_items.reduce((e,t)=>e+(t.amount||0),0),p=d*((e.contingency_percent||10)/100),_=d+p,m=_*((e.profit_margin_percent||15)/100),f=_+m,y=f*((e.vat_percent||15)/100),v=f+y;console.log("[v0] Calculated totals - Subtotal:",d,"Total:",v);let{data:R}=await t.from("tender_boq").select("id").eq("tender_id",u).eq("tender_type",g).eq("user_id",r.id).maybeSingle();if(R){console.log("[v0] Updating existing BOQ:",R.id);let{data:r,error:i}=await t.from("tender_boq").update({boq_items:e.boq_items,subtotal:d,contingency_percent:e.contingency_percent||10,contingency_amount:p,profit_margin_percent:e.profit_margin_percent||15,profit_amount:m,vat_percent:e.vat_percent||15,vat_amount:y,total_amount:v,pricing_strategy:e.pricing_strategy||{},direct_costs:e.direct_costs||{},indirect_costs:e.indirect_costs||{},break_even_analysis:e.break_even_analysis||{},cash_flow_projection:e.cash_flow_projection||{},profitability_analysis:e.profitability_analysis||{},updated_at:new Date().toISOString()}).eq("id",R.id).select().single();if(i)return console.error("[v0] Error updating BOQ:",i),Response.json({error:"Failed to update BOQ",details:i.message},{status:500});n=r}else{console.log("[v0] Inserting new BOQ");let{data:i,error:a}=await t.from("tender_boq").insert({tender_id:u,tender_type:g,user_id:r.id,boq_items:e.boq_items,subtotal:d,contingency_percent:e.contingency_percent||10,contingency_amount:p,profit_margin_percent:e.profit_margin_percent||15,profit_amount:m,vat_percent:e.vat_percent||15,vat_amount:y,total_amount:v,pricing_strategy:e.pricing_strategy||{},direct_costs:e.direct_costs||{},indirect_costs:e.indirect_costs||{},break_even_analysis:e.break_even_analysis||{},cash_flow_projection:e.cash_flow_projection||{},profitability_analysis:e.profitability_analysis||{}}).select().single();if(a)return console.error("[v0] Error inserting BOQ:",a),Response.json({error:"Failed to create BOQ",details:a.message},{status:500});n=i}return console.log("[v0] BOQ saved successfully, id:",n.id),Response.json({boq:n})}let _=await S.StrategistService.buildContext(r.id,u,"boq"),{data:m}=await t.from("user_custom_tender_analysis").select("analysis_data").eq("tender_id",u).single(),{data:f}=await t.from("user_tenders").select("*").eq("id",u).single(),y=`You are an expert pricing strategist focused EXCLUSIVELY on helping the user win THIS SPECIFIC tender.

🎯 **YOU ARE WORKING ON THIS TENDER:**
Title: "${f?.title||"Tender"}"
Organization: ${f?.organization||"Not specified"}
Deadline: ${f?.deadline||"Not specified"}
Value: ${f?.value||"Not specified"}
Description: ${f?.description||"No description"}

🚨 **CRITICAL**: Every piece of advice MUST be specific to THIS tender. Do NOT give generic pricing advice.

## Your Role FOR THIS TENDER
- Analyze BOQ (Bill of Quantities) structures FOR THIS SPECIFIC tender
- Provide pricing guidance and margin recommendations FOR THIS tender
- Identify pricing risks and opportunities SPECIFIC TO THIS tender
- Suggest competitive positioning strategies FOR THIS tender

## User Context
${_.company_profile?.company_name?`Company: ${_.company_profile.company_name}`:""}
${_.company_profile?.industry?`Industry: ${_.company_profile.industry}`:""}
${_.user_preferences?.experience_level?`Experience: ${_.user_preferences.experience_level}`:""}

## THIS TENDER's Analysis
${m?.analysis_data?JSON.stringify(m.analysis_data,null,2):"Not available"}

## Guidelines FOR THIS TENDER
- Reference "${f?.title}" in your responses
- Be specific with percentage ranges and ZAR amounts FOR THIS tender
- Consider South African market conditions relevant TO THIS tender
- Factor in B-BBEE requirements and local content FOR THIS tender
- Warn about underpricing risks SPECIFIC TO THIS tender
- Suggest areas for cost optimization IN THIS tender`,v=p||`Analyze this BOQ for "${f?.title||"this tender"}" and provide pricing strategy recommendations specifically tailored to winning this tender:

${d?JSON.stringify(d,null,2):"No BOQ items provided - provide general pricing guidance for THIS specific tender based on the tender details above."}`;console.log("[Strategist] BOQ analysis for THIS SPECIFIC tender:",u,f?.title);let{text:E}=await (0,h.default)({model:"openai/gpt-4-turbo",system:y,prompt:v,temperature:.6,maxTokens:2e3});return Response.json({advice:E,tender_id:u})}catch(e){return console.error("[Strategist] BOQ error:",e),Response.json({error:"Failed to analyze BOQ",details:e.message},{status:500})}}async function T(e){try{let t=await (0,R.createClient)(),{data:{user:r}}=await t.auth.getUser();if(!r)return Response.json({error:"Unauthorized"},{status:401});let{searchParams:n}=new URL(e.url),i=n.get("tenderId"),a=n.get("tenderType")||"custom";if(!i)return Response.json({error:"Tender ID required"},{status:400});let{data:o,error:s}=await t.from("tender_boq").select("*").eq("tender_id",i).eq("tender_type",a).eq("user_id",r.id).single();if(s&&"PGRST116"!==s.code)throw console.error("[Strategist] Error fetching BOQ:",s),s;return Response.json({boq:o||null})}catch(e){return console.error("[Strategist] BOQ GET error:",e),Response.json({error:"Failed to fetch BOQ",details:e.message},{status:500})}}e.s(["GET",()=>T,"POST",()=>E,"maxDuration",0,60],316612);var O=e.i(316612);let b=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/strategist/boq/route",pathname:"/api/strategist/boq",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/strategist/boq/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:I,workUnitAsyncStorage:w,serverHooks:N}=b;function C(){return(0,n.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:w})}async function q(e,t,n){b.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let h="/api/strategist/boq/route";h=h.replace(/\/index$/,"")||"/";let R=await b.prepare(e,t,{srcPage:h,multiZoneDraftMode:!1});if(!R)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:S,params:E,nextConfig:T,parsedUrl:O,isDraftMode:I,prerenderManifest:w,routerServerContext:N,isOnDemandRevalidate:C,revalidateOnlyGenerated:q,resolvedPathname:A,clientReferenceManifest:x,serverActionsManifest:H}=R,B=(0,l.normalizeAppPath)(h),P=!!(w.dynamicRoutes[B]||w.routes[A]),D=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,O,!1):t.end("This page could not be found"),null);if(P&&!I){let e=!!w.routes[A],t=w.dynamicRoutes[B];if(t&&!1===t.fallback&&!e){if(T.experimental.adapterPath)return await D();throw new y.NoFallbackError}}let $=null;!P||b.isDev||I||($="/index"===($=A)?"/":$);let k=!0===b.isDev||!P,U=P&&!k;H&&x&&(0,o.setReferenceManifestsSingleton)({page:h,clientReferenceManifest:x,serverActionsManifest:H,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:H})});let F=e.method||"GET",j=(0,a.getTracer)(),Q=j.getActiveScopeSpan(),M={params:E,prerenderManifest:w,renderOpts:{experimental:{authInterrupts:!!T.experimental.authInterrupts},cacheComponents:!!T.cacheComponents,supportsDynamicResponse:k,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:T.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n)=>b.onRequestError(e,t,n,N)},sharedContext:{buildId:S}},J=new c.NodeNextRequest(e),L=new c.NodeNextResponse(t),z=d.NextRequestAdapter.fromNodeNextRequest(J,(0,d.signalFromNodeResponse)(t));try{let o=async e=>b.handle(z,M).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${F} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${F} ${h}`)}),s=!!(0,i.getRequestMeta)(e,"minimalMode"),l=async i=>{var a,l;let c=async({previousCacheEntry:r})=>{try{if(!s&&C&&q&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await o(i);e.fetchMetrics=M.renderOpts.fetchMetrics;let l=M.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let c=M.renderOpts.collectedTags;if(!P)return await (0,g.sendResponse)(J,L,a,M.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(a.headers);c&&(t[f.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,n=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:h,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:C})},N),t}},d=await b.handleResponse({req:e,nextConfig:T,cacheKey:$,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:w,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:q,responseGenerator:c,waitUntil:n.waitUntil,isMinimalMode:s});if(!P)return null;if((null==d||null==(a=d.value)?void 0:a.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",C?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,_.fromNodeOutgoingHttpHeaders)(d.value.headers);return s&&P||p.delete(f.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,m.getCacheControlHeader)(d.cacheControl)),await (0,g.sendResponse)(J,L,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};Q?await l(Q):await j.withPropagatedContext(e.headers,()=>j.trace(p.BaseServerSpan.handleRequest,{spanName:`${F} ${h}`,kind:a.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},l))}catch(t){if(t instanceof y.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:B,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:C})}),P)throw t;return await (0,g.sendResponse)(J,L,new Response(null,{status:500})),null}}e.s(["handler",()=>q,"patchFetch",()=>C,"routeModule",()=>b,"serverHooks",()=>N,"workAsyncStorage",()=>I,"workUnitAsyncStorage",()=>w],589360)}];

//# sourceMappingURL=38113_next_dist_esm_build_templates_app-route_8db5501c.js.map