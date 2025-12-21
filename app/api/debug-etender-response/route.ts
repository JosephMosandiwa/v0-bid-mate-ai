export async function GET() {
  try {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const dateFrom = thirtyDaysAgo.toISOString().split("T")[0]
    const dateTo = today.toISOString().split("T")[0]

    const url = `https://ocds-api.etenders.gov.za/api/OCDSReleases?PageNumber=1&PageSize=5&dateFrom=${dateFrom}&dateTo=${dateTo}`

    console.log("[v0] Fetching from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "BidMateAI/1.0",
      },
      signal: AbortSignal.timeout(30000),
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

    const text = await response.text()
    console.log("[v0] Raw response text (first 1000 chars):", text.substring(0, 1000))

    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      return Response.json({
        error: "Failed to parse JSON",
        rawText: text.substring(0, 500),
        status: response.status,
      })
    }

    return Response.json(
      {
        status: response.status,
        dataType: typeof data,
        isArray: Array.isArray(data),
        keys: typeof data === "object" && data !== null ? Object.keys(data) : null,
        sampleData: data,
        firstItemKeys: Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : null,
        count: Array.isArray(data) ? data.length : null,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("[v0] Error:", error)
    return Response.json(
      {
        error: error.message,
        name: error.name,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
