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

  // Fetch scraped tenders from user_tenders
  const { data: scrapedTenders, error: scrapedError } = await supabase
    .from("user_tenders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (scrapedError) {
    console.error("[v0] Error fetching scraped tenders:", scrapedError)
  }

  // Fetch custom tenders from user_custom_tenders
  const { data: customTenders, error: customError } = await supabase
    .from("user_custom_tenders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (customError) {
    console.error("[v0] Error fetching custom tenders:", customError)
  }

  // Combine and normalize both types of tenders
  const allTenders = [
    ...(scrapedTenders || []).map((tender) => ({
      id: tender.id,
      tender_id: tender.tender_id,
      title: tender.title,
      organization: tender.organization,
      status: tender.status,
      close_date: tender.close_date,
      value: tender.value,
      category: tender.category,
      is_pinned: tender.is_pinned || false,
      is_favourited: tender.is_favourited || false,
      is_wishlisted: tender.is_wishlisted || false,
      created_at: tender.created_at,
      tender_type: "scraped" as const,
    })),
    ...(customTenders || []).map((tender) => ({
      id: tender.id,
      tender_id: `custom-${tender.id}`,
      title: tender.title,
      organization: tender.organization,
      status: tender.status,
      close_date: tender.deadline,
      value: tender.value,
      category: tender.category,
      is_pinned: tender.is_pinned || false,
      is_favourited: tender.is_favourited || false,
      is_wishlisted: tender.is_wishlisted || false,
      created_at: tender.created_at,
      tender_type: "custom" as const,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return { success: true, tenders: allTenders }
}

export async function deleteTender(tenderId: string, tenderType?: "scraped" | "custom") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Try to determine tender type if not provided
  if (!tenderType) {
    // Check if it exists in custom tenders first
    const { data: customTender } = await supabase
      .from("user_custom_tenders")
      .select("id")
      .eq("id", tenderId)
      .eq("user_id", user.id)
      .single()

    if (customTender) {
      tenderType = "custom"
    } else {
      tenderType = "scraped"
    }
  }

  // Delete from the appropriate table
  const tableName = tenderType === "custom" ? "user_custom_tenders" : "user_tenders"

  const { error } = await supabase.from(tableName).delete().eq("id", tenderId).eq("user_id", user.id)

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
    console.log("[v0] Creating custom tender record...")

    const { data: customTender, error: customTenderError } = await supabase
      .from("user_custom_tenders")
      .insert({
        user_id: user.id,
        title: tenderData.title,
        organization: tenderData.organization,
        deadline: tenderData.deadline,
        value: tenderData.value,
        category: tenderData.category || "Custom",
        description: tenderData.description,
        location: tenderData.location,
        status: "in-progress",
      })
      .select()
      .single()

    if (customTenderError) {
      console.error("[v0] Error creating custom tender:", customTenderError)
      return { success: false, error: "Failed to create tender: " + customTenderError.message }
    }

    console.log("[v0] Custom tender created successfully:", customTender.id)

    let documentSaved = false
    let documentError: string | null = null

    if (tenderData.uploadedFile) {
      console.log("[v0] Uploading file to blob storage...")
      console.log("[v0] File details:", {
        name: tenderData.uploadedFile.name,
        type: tenderData.uploadedFile.type,
        size: tenderData.uploadedFile.size,
      })

      try {
        const blob = await put(
          `custom-tenders/${customTender.id}/${tenderData.uploadedFile.name}`,
          tenderData.uploadedFile,
          {
            access: "public",
          },
        )

        console.log("[v0] File uploaded to blob:", blob.url)

        const documentData = {
          tender_id: customTender.id,
          file_name: tenderData.uploadedFile.name,
          file_type: tenderData.uploadedFile.type,
          file_size: tenderData.uploadedFile.size,
          blob_url: blob.url,
          storage_path: blob.url,
        }

        console.log("[v0] Inserting document with data:", JSON.stringify(documentData, null, 2))

        const { data: insertedDoc, error: docError } = await supabase
          .from("user_custom_tender_documents")
          .insert(documentData)
          .select()
          .single()

        if (docError) {
          console.error("[v0] Error saving document reference:", docError)
          console.error("[v0] Error code:", docError.code)
          console.error("[v0] Error message:", docError.message)
          documentError = `Failed to save document: ${docError.message} (Code: ${docError.code})`
        } else {
          console.log("[v0] Document reference saved successfully:", insertedDoc.id)
          documentSaved = true
        }
      } catch (uploadError) {
        console.error("[v0] Error uploading file:", uploadError)
        documentError = `Failed to upload file: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`
      }
    } else {
      console.log("[v0] No file to upload")
    }

    let analysisSaved = false
    let analysisError: string | null = null

    if (tenderData.analysis) {
      console.log("[v0] Saving analysis data...")

      const analysisData = {
        tender_id: customTender.id,
        analysis_data: tenderData.analysis,
      }

      console.log("[v0] Inserting analysis with tender_id:", customTender.id)

      const { data: insertedAnalysis, error: analysisErr } = await supabase
        .from("user_custom_tender_analysis")
        .insert(analysisData)
        .select()
        .single()

      if (analysisErr) {
        console.error("[v0] Error saving analysis:", analysisErr)
        analysisError = `Failed to save analysis: ${analysisErr.message} (Code: ${analysisErr.code})`
      } else {
        console.log("[v0] Analysis saved successfully:", insertedAnalysis.id)
        analysisSaved = true
      }
    } else {
      console.log("[v0] No analysis to save")
    }

    console.log("[v0] Tender creation completed")
    revalidatePath("/dashboard/tenders")
    revalidatePath("/dashboard/custom-tenders")

    return {
      success: true,
      data: customTender,
      tenderId: customTender.id,
      documentSaved,
      documentError,
      analysisSaved,
      analysisError,
    }
  } catch (error) {
    console.error("[v0] Error in createCustomTender:", error)
    return { success: false, error: "Failed to create tender: " + (error as Error).message }
  }
}
