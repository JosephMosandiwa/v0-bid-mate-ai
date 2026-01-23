"use client"
import { toast } from "react-toastify"
import { setScraping, setScrapingProgress, pollProgress, loadData } from "./utils" // Hypothetical imports

const AdminScrapingPage = () => {
  const handleScrapeAll = async () => {
    setScraping(-1)
    setScrapingProgress({ currentSource: "Initializing...", completedSources: 0, totalSources: 0, totalTenders: 0 })

    try {
      console.log("[v0] Starting scrape for all sources")

      const response = await fetch("/api/scraping/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scrapeAll: true }),
      })

      console.log("[v0] Scrape all response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Scrape all error response:", errorText)
        throw new Error(`Server returned ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("[v0] Scrape all response data:", result)

      if (result.progressId) {
        console.log("[v0] Starting progress polling for ID:", result.progressId)
        pollProgress(result.progressId)
        return // Don't show completion toast yet, wait for polling to finish
      }

      const successCount = result.successfulSources || 0
      const totalCount = result.sourcesScraped || 0
      const tendersFound = result.totalScraped || 0

      console.log("[v0] Scraping completed:", { successCount, totalCount, tendersFound })

      const message =
        tendersFound > 0
          ? `Found ${tendersFound} tender${tendersFound !== 1 ? "s" : ""} from ${successCount}/${totalCount} sources`
          : `Scraped ${totalCount} sources but found no tenders`

      toast({
        title: tendersFound > 0 ? "Scraping Complete" : "No Tenders Found",
        description: message,
        variant: tendersFound > 0 ? "default" : "destructive",
      })

      setScrapingProgress(null)
      setScraping(null)
      loadData()
    } catch (error) {
      console.error("[v0] Scraping all error:", error)
      toast({
        title: "Scraping Error",
        description: error instanceof Error ? error.message : "Failed to scrape all sources",
        variant: "destructive",
      })
      setScrapingProgress(null)
      setScraping(null)
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
