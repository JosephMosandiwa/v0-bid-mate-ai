"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadTenderDocument(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const file = formData.get("file") as File
  const userTenderId = formData.get("userTenderId") as string

  if (!file || !userTenderId) {
    return { success: false, error: "File and tender ID are required" }
  }

  // Upload file to Supabase Storage
  const fileExt = file.name.split(".").pop()
  const fileName = `${user.id}/${userTenderId}/${Date.now()}.${fileExt}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("tender-documents")
    .upload(fileName, file)

  if (uploadError) {
    console.error("[v0] Error uploading file:", uploadError)
    return { success: false, error: "Failed to upload file" }
  }

  // Save document metadata to database
  const { data, error } = await supabase
    .from("tender_documents")
    .insert({
      user_tender_id: userTenderId,
      user_id: user.id,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: uploadData.path,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error saving document metadata:", error)
    // Clean up uploaded file
    await supabase.storage.from("tender-documents").remove([fileName])
    return { success: false, error: "Failed to save document" }
  }

  revalidatePath(`/dashboard/tenders/${userTenderId}`)
  return { success: true, data }
}

export async function getTenderDocuments(userTenderId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated", documents: [] }

  const { data, error } = await supabase
    .from("tender_documents")
    .select("*")
    .eq("user_tender_id", userTenderId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching documents:", error)
    return { success: false, error: "Failed to fetch documents", documents: [] }
  }

  return { success: true, documents: data || [] }
}

export async function downloadTenderDocument(documentId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Get document metadata
  const { data: document, error: docError } = await supabase
    .from("tender_documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .single()

  if (docError || !document) {
    console.error("[v0] Error fetching document:", docError)
    return { success: false, error: "Document not found" }
  }

  const isExternalUrl = document.storage_path.startsWith("http://") || document.storage_path.startsWith("https://")

  if (isExternalUrl) {
    // For external documents (from eTenders API), return the URL directly
    console.log("[v0] Returning external document URL:", document.storage_path)
    return { success: true, url: document.storage_path, fileName: document.file_name }
  }

  // For documents stored in Supabase Storage, create a signed URL
  const { data: urlData, error: urlError } = await supabase.storage
    .from("tender-documents")
    .createSignedUrl(document.storage_path, 60) // 60 seconds expiry

  if (urlError) {
    console.error("[v0] Error creating signed URL:", urlError)
    return { success: false, error: "Failed to generate download link" }
  }

  return { success: true, url: urlData.signedUrl, fileName: document.file_name }
}

export async function deleteTenderDocument(documentId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Get document to delete from storage
  const { data: document, error: docError } = await supabase
    .from("tender_documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .single()

  if (docError || !document) {
    return { success: false, error: "Document not found" }
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage.from("tender-documents").remove([document.storage_path])

  if (storageError) {
    console.error("[v0] Error deleting from storage:", storageError)
  }

  // Delete from database
  const { error } = await supabase.from("tender_documents").delete().eq("id", documentId).eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error deleting document:", error)
    return { success: false, error: "Failed to delete document" }
  }

  revalidatePath(`/dashboard/tenders/${document.user_tender_id}`)
  return { success: true }
}

export async function analyzeDocument(documentId: string, analysis: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  try {
    console.log("[v0] Saving analysis for document:", documentId)

    // Save analysis to database
    const { error } = await supabase
      .from("tender_documents")
      .update({ ai_analysis: analysis })
      .eq("id", documentId)
      .eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error saving analysis:", error)
      return { success: false, error: "Failed to save analysis" }
    }

    console.log("[v0] Analysis saved successfully")
    revalidatePath(`/dashboard/tenders`)
    return { success: true, analysis }
  } catch (error) {
    console.error("[v0] Error in analyzeDocument:", error)
    return { success: false, error: "Failed to save analysis" }
  }
}
export async function uploadTemporaryDocument(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const file = formData.get("file") as File
  if (!file) {
    return { success: false, error: "File is required" }
  }

  // Upload file to Supabase Storage (temp folder)
  const fileExt = file.name.split(".").pop()
  const fileName = `temp/${user.id}/${Date.now()}.${fileExt}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("tender-documents")
    .upload(fileName, file)

  if (uploadError) {
    console.error("[v0] Error uploading file:", uploadError)
    return { success: false, error: "Failed to upload file" }
  }

  // Get signed URL for the analysis step (valid for 1 hour)
  const { data: urlData, error: urlError } = await supabase.storage
    .from("tender-documents")
    .createSignedUrl(fileName, 3600)

  if (urlError) {
    console.error("[v0] Error getting signed URL:", urlError)
    return { success: false, error: "Failed to get file URL" }
  }

  return { success: true, url: urlData.signedUrl, path: fileName }
}
