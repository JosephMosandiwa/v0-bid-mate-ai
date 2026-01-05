import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Quick DB check: try to read a small row from `profiles` (non-destructive)
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
    if (profileError) {
      return NextResponse.json({ ok: false, db: false, error: profileError.message }, { status: 500 })
    }

    // Quick storage check: attempt to list objects from two known buckets (if present)
    const storageChecks: Record<string, any> = {}
    try {
      // Attempt to list in `documents` bucket
      const { data: docsList, error: docsErr } = await supabase.storage.from("documents").list("", { limit: 1 })
      storageChecks.documents = { ok: !docsErr, error: docsErr?.message || null, sample: Array.isArray(docsList) ? docsList.length : null }
    } catch (e: any) {
      storageChecks.documents = { ok: false, error: e.message }
    }

    try {
      const { data: tenderList, error: tenderErr } = await supabase.storage.from("tender-documents").list("", { limit: 1 })
      storageChecks["tender-documents"] = { ok: !tenderErr, error: tenderErr?.message || null, sample: Array.isArray(tenderList) ? tenderList.length : null }
    } catch (e: any) {
      storageChecks["tender-documents"] = { ok: false, error: e.message }
    }

    return NextResponse.json({ ok: true, db: true, storage: storageChecks })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || String(error) }, { status: 500 })
  }
}
