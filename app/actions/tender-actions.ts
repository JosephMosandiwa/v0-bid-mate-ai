"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface TenderDocument {
  id?: string
  title: string
  url: string
  documentType?: string
  format?: string
  description?: string
}

export interface TenderData {
  tenderId: string
  title: string
  organization: string
  publishDate?: string
  closeDate?: string
  value?: string
  category?: string
  description?: string
  url?: string
  documents?: TenderDocument[] // Add documents array
}

export async function addTenderToUser(tenderData: TenderData) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "Not authenticated" }
  }

  // Insert tender
  const { data, error } = await supabase
    .from("user_tenders")
    .insert({
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
      status: "draft",
    })
    .select()
    .single()

  if (error) {
    // Check if it's a duplicate
    if (error.code === "23505") {
      return { success: false, error: "Tender already added" }
    }
    console.error("[v0] Error adding tender:", error)
    return { success: false, error: "Failed to add tender" }
  }

  if (tenderData.documents && tenderData.documents.length > 0 && data) {
    console.log("[v0] Adding", tenderData.documents.length, "documents to tender", data.id)
    console.log("[v0] Document data:", JSON.stringify(tenderData.documents, null, 2))

    const documentsToInsert = tenderData.documents.map((doc) => ({
      user_tender_id: data.id, // Changed from tender_id
      user_id: user.id,
      file_name: doc.title, // Changed from name
      storage_path: doc.url, // Changed from file_url - external URLs stored as storage_path
      file_type: doc.format || "application/pdf",
      file_size: 0, // Unknown size for external documents
      // Removed document_type and description as they don't exist in schema
    }))

    console.log("[v0] Inserting documents:", JSON.stringify(documentsToInsert, null, 2))

    const { data: insertedDocs, error: docsError } = await supabase
      .from("tender_documents")
      .insert(documentsToInsert)
      .select()

    if (docsError) {
      console.error("[v0] Error adding documents:", docsError)
      console.error("[v0] Error details:", JSON.stringify(docsError, null, 2))
      // Don't fail the whole operation if documents fail, just log it
    } else {
      console.log("[v0] Successfully added", insertedDocs?.length || 0, "documents")
      console.log(
        "[v0] Inserted document IDs:",
        insertedDocs?.map((d) => d.id),
      )
    }
  } else {
    console.log("[v0] No documents to add for this tender")
  }

  revalidatePath("/dashboard/tenders")
  return { success: true, data }
}

export async function toggleTenderPin(tenderId: string, isPinned: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase
    .from("user_tenders")
    .update({ is_pinned: isPinned })
    .eq("id", tenderId)
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error toggling pin:", error)
    return { success: false, error: "Failed to update tender" }
  }

  revalidatePath("/dashboard/tenders")
  revalidatePath("/dashboard/search")
  return { success: true }
}

export async function toggleTenderFavourite(tenderId: string, isFavourited: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase
    .from("user_tenders")
    .update({ is_favourited: isFavourited })
    .eq("id", tenderId)
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error toggling favourite:", error)
    return { success: false, error: "Failed to update tender" }
  }

  revalidatePath("/dashboard/tenders")
  revalidatePath("/dashboard/search")
  return { success: true }
}

export async function toggleTenderWishlist(tenderId: string, isWishlisted: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase
    .from("user_tenders")
    .update({ is_wishlisted: isWishlisted })
    .eq("id", tenderId)
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error toggling wishlist:", error)
    return { success: false, error: "Failed to update tender" }
  }

  revalidatePath("/dashboard/tenders")
  revalidatePath("/dashboard/search")
  return { success: true }
}

export async function getUserTenders() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated", tenders: [] }

  const { data, error } = await supabase
    .from("user_tenders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching tenders:", error)
    return { success: false, error: "Failed to fetch tenders", tenders: [] }
  }

  return { success: true, tenders: data || [] }
}

export async function deleteTender(tenderId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase.from("user_tenders").delete().eq("id", tenderId).eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error deleting tender:", error)
    return { success: false, error: "Failed to delete tender" }
  }

  revalidatePath("/dashboard/tenders")
  return { success: true }
}
