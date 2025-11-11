import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] upload-to-blob: Starting file upload...")

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] upload-to-blob: Auth error:", authError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("[v0] upload-to-blob: User authenticated:", user.id)

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] upload-to-blob: File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    const blob = await put(`tender-uploads/${user.id}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    console.log("[v0] upload-to-blob: File uploaded successfully:", blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (error: any) {
    console.error("[v0] upload-to-blob: Error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
