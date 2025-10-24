import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 })
    }

    console.log("[v0] Proxying document from:", url)

    // Fetch the document from the external URL (server-side, no CORS issues)
    const response = await fetch(url, {
      headers: {
        "User-Agent": "BidMate/1.0",
      },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch document:", response.status, response.statusText)
      return Response.json({ error: `Failed to fetch document: ${response.statusText}` }, { status: response.status })
    }

    // Get the blob data
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()

    // Convert to base64 for transmission
    const base64 = Buffer.from(arrayBuffer).toString("base64")

    console.log("[v0] Document fetched successfully, size:", blob.size)

    return Response.json({
      data: base64,
      type: blob.type || "application/pdf",
      size: blob.size,
    })
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to proxy document" },
      { status: 500 },
    )
  }
}
