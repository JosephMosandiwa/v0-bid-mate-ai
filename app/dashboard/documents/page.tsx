import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { DocumentsPageClient } from "./documents-page-client"

export const metadata: Metadata = {
  title: "Documents | BidMate AI",
  description: "Manage your company documents and compliance certificates",
}

export default async function DocumentsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user's documents
  const { data: documents } = await supabase
    .from("user_documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Get profile for document status
  const { data: profile } = await supabase
    .from("profiles")
    .select("has_tax_clearance, has_coida, has_csd, bbbee_level, cidb_grade")
    .eq("id", user.id)
    .single()

  return <DocumentsPageClient initialDocuments={documents || []} profile={profile} userId={user.id} />
}
