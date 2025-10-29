"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"

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

export async function saveScrapedTenderToUser(scrapedTender: {
  id: string
  title: string
  source_name: string
  description?: string
  publish_date?: string
  close_date?: string
  estimated_value?: string
  category?: string
  tender_url?: string
}) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "Not authenticated" }
  }

  // Check if tender already exists for this user
  const { data: existing } = await supabase
    .from("user_tenders")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("tender_id", scrapedTender.id)
    .single()

  if (existing) {
    // If already exists and is draft, update to in-progress
    if (existing.status === "draft") {
      const { error: updateError } = await supabase
        .from("user_tenders")
        .update({ status: "in-progress" })
        .eq("id", existing.id)

      if (updateError) {
        console.error("[v0] Error updating tender status:", updateError)
        return { success: false, error: "Failed to update tender status" }
      }

      revalidatePath("/dashboard/tenders")
      return { success: true, message: "Tender status updated to in-progress", isNew: false }
    }

    // Already exists and not draft, no need to update
    return { success: true, message: "Tender already in your list", isNew: false }
  }

  // Insert new tender with in-progress status
  const { data, error } = await supabase
    .from("user_tenders")
    .insert({
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
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error saving tender:", error)
    return { success: false, error: "Failed to save tender" }
  }

  revalidatePath("/dashboard/tenders")
  return { success: true, message: "Tender saved to My Tenders", isNew: true, data }
}

export async function createCustomTender(tenderData: {
  title: string
  organization: string
  deadline: string
  value: string
  description: string
  category?: string
  location?: string
  uploadedFile?: File
  analysis?: any
}) {
  console.log("[v0] createCustomTender called with data:", {
    title: tenderData.title,
    organization: tenderData.organization,
    deadline: tenderData.deadline,
    hasFile: !!tenderData.uploadedFile,
    hasAnalysis: !!tenderData.analysis,
  })

  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("[v0] Auth error:", userError)
    return { success: false, error: "Not authenticated" }
  }

  console.log("[v0] User authenticated:", user.id)

  try {
    console.log("[v0] Creating user tender record...")

    // Generate a unique tender ID for custom tenders
    const customTenderId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const { data: userTender, error: userTenderError } = await supabase
      .from("user_tenders")
      .insert({
        user_id: user.id,
        tender_id: customTenderId,
        title: tenderData.title,
        organization: tenderData.organization,
        close_date: tenderData.deadline,
        value: tenderData.value,
        category: tenderData.category || "Custom",
        description: tenderData.description,
        status: "in-progress",
      })
      .select()
      .single()

    if (userTenderError) {
      console.error("[v0] Error creating user tender:", userTenderError)
      return { success: false, error: "Failed to create tender: " + userTenderError.message }
    }

    console.log("[v0] User tender created successfully:", userTender.id)

    if (tenderData.uploadedFile) {
      console.log("[v0] Uploading file to blob storage...")
      try {
        const blob = await put(tenderData.uploadedFile.name, tenderData.uploadedFile, {
          access: "public",
        })

        console.log("[v0] File uploaded to blob:", blob.url)

        const { error: docError } = await supabase.from("tender_documents").insert({
          tender_id: customTenderId, // Use custom tender ID, not user_tender.id
          document_name: tenderData.uploadedFile.name,
          document_type: tenderData.uploadedFile.type,
          original_url: blob.url,
          blob_url: blob.url,
          file_size: tenderData.uploadedFile.size,
        })

        if (docError) {
          console.error("[v0] Error saving document reference:", docError)
        } else {
          console.log("[v0] Document reference saved successfully")
        }
      } catch (uploadError) {
        console.error("[v0] Error uploading file:", uploadError)
        // Don't fail the whole operation
      }
    }

    if (tenderData.analysis) {
      console.log("[v0] Saving analysis data...")
      const { error: analysisError } = await supabase.from("tender_analysis").insert({
        tender_id: customTenderId, // Use custom tender ID
        analysis_data: tenderData.analysis,
      })

      if (analysisError) {
        console.error("[v0] Error saving analysis:", analysisError)
      } else {
        console.log("[v0] Analysis saved successfully")
      }
    }

    console.log("[v0] Tender creation completed successfully")
    revalidatePath("/dashboard/tenders")
    return { success: true, data: userTender, tenderId: customTenderId }
  } catch (error) {
    console.error("[v0] Error in createCustomTender:", error)
    return { success: false, error: "Failed to create tender: " + (error as Error).message }
  }
}
