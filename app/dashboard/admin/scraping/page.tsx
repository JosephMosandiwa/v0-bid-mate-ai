"use client"
import { toast } from "react-toastify"
import { setScraping, setScrapingProgress, pollProgress, loadData } from "./utils" // Hypothetical imports

const AdminScrapingPage = () => {
  const handleScrapeAll = async () => {
    (setScraping as any)(-1)
    (setScrapingProgress as any)({ currentSource: "Initializing...", completedSources: 0, totalSources: 0, totalTenders: 0 })

    const gConsole: any = (globalThis as any).console
    try {
      globalThis.console.log("[v0] Starting scrape for all sources")

      const response: Response = await (fetch as any)("/api/scraping/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scrapeAll: true }),
      })
      const responseAny: any = response

      globalThis.console.log("[v0] Scrape all response status:", responseAny.status)


      if (!responseAny.ok) {
        const errorText: string = await responseAny.text()
        globalThis.console.error("[v0] Scrape all error response:", errorText)
        throw new Error(`Server returned ${responseAny.status}: ${errorText}`)
      }

      const result: any = await responseAny.json()
      globalThis.console.log("[v0] Scrape all response data:", result)

      if (result.progressId) {
        gConsole.log("[v0] Starting progress polling for ID:", result.progressId)
        (pollProgress as any)(result.progressId)
        return // Don't show completion toast yet, wait for polling to finish
      }

      const successCount = Number(result.successfulSources || 0)
      const totalCount = Number(result.sourcesScraped || 0)
      const tendersFound = Number(result.totalScraped || 0)

      globalThis.console.log(`[v0] Scraping completed: success=${successCount} total=${totalCount} tenders=${tendersFound}`)

      const message: string =
        tendersFound > 0
          ? `Found ${tendersFound} tender${tendersFound !== 1 ? "s" : ""} from ${successCount}/${totalCount} sources`
          : `Scraped ${totalCount} sources but found no tenders`

      if (tendersFound > 0) {
        (toast as any)("Scraping Complete: " + message)
      } else {
        (toast as any)("No Tenders Found: " + message)
      }

      (setScrapingProgress as any)(null)
      (setScraping as any)(null)
      loadData()
    } catch (error) {
      gConsole.error("[v0] Scraping all error:", error)
      (toast as any)("Scraping Error: " + (error instanceof Error ? error.message : "Failed to scrape all sources"))
      (setScrapingProgress as any)(null)
      (setScraping as any)(null)
    }
  }

  return (
    <div>
      {/* ... existing JSX code ... */}
      <button onClick={handleScrapeAll}>Scrape All</button>
      {/* ... existing JSX code ... */}
    </div>
  )
}

export default AdminScrapingPage
