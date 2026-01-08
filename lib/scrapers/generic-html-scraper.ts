import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"
import * as cheerio from "cheerio"

// Generic HTML scraper for websites with standard HTML structure
export class GenericHtmlScraper extends BaseScraper {
  private config: {
    tenderListSelector?: string
    titleSelector?: string
    dateSelector?: string
    linkSelector?: string
    descriptionSelector?: string
  }

  constructor(sourceId: number, sourceName: string, sourceUrl: string, config?: any) {
    super(sourceId, sourceName, sourceUrl)
    this.config = config || {}
  }

  async scrape(): Promise<ScraperResult> {
    try {
      console.log(`[v0] GenericHtmlScraper: Starting scrape for ${this.sourceName}`)
      console.log(`[v0] GenericHtmlScraper: Using tenders engine with ${this.tenderSchema.length} field definitions`)
      console.log(`[v0] GenericHtmlScraper: Source URL: ${this.sourceUrl}`)

      const scrapingApiKey = process.env.SCRAPING_API_KEY
      let url = this.sourceUrl
      let usingScraperApi = false

      if (scrapingApiKey) {
        url = `http://api.scraperapi.com?api_key=${scrapingApiKey}&url=${encodeURIComponent(this.sourceUrl)}`
        usingScraperApi = true
        console.log(`[v0] GenericHtmlScraper: Using ScraperAPI service`)
      } else {
        console.log(`[v0] GenericHtmlScraper: No SCRAPING_API_KEY found, using direct fetch`)
      }

      console.log(`[v0] GenericHtmlScraper: Fetching URL...`)

      const response = await fetch(url, {
        headers: {
          "User-Agent": "BidMateAI-TenderBot/1.0 (Tender Aggregation Service)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.8,*/*;q=0.8",
        },
      })

      console.log(`[v0] GenericHtmlScraper: Response status: ${response.status}`)

      if (!response.ok) {
        if (response.status === 401) {
          if (usingScraperApi) {
            throw new Error(
              `ScraperAPI returned 401 Unauthorized. Please check your SCRAPING_API_KEY is valid and has sufficient credits. Visit https://www.scraperapi.com/dashboard to verify your account.`,
            )
          } else {
            throw new Error(
              `Website returned 401 Unauthorized. The website ${this.sourceName} requires authentication. Consider using a scraping API service by setting SCRAPING_API_KEY environment variable.`,
            )
          }
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      console.log(`[v0] GenericHtmlScraper: Received HTML (${html.length} chars)`)

      const $ = cheerio.load(html)
      const tenders: ScrapedTender[] = []

      // Look for common tender patterns
      const tenderElements = this.findTenderElements($)

      console.log(`[v0] GenericHtmlScraper: Found ${tenderElements.length} potential tender elements`)

      for (const element of tenderElements) {
        const tender = this.extractTenderData($, element)
        if (tender && tender.title) {
          const normalized = this.normalizeTenderData(tender)
          const validation = this.validateExtractedTender(normalized)

          // Only include tenders with at least 40% completeness
          if (validation.score >= 40) {
            tenders.push(normalized)
            console.log(
              `[v0] GenericHtmlScraper: ✓ Extracted tender: ${tender.title} (Quality: ${validation.quality}, Score: ${validation.score}%)`,
            )
          } else {
            console.log(
              `[v0] GenericHtmlScraper: ✗ Skipped low-quality tender: ${tender.title} (Score: ${validation.score}%)`,
            )
          }
        }
      }

      console.log(`[v0] GenericHtmlScraper: Successfully extracted ${tenders.length} quality tenders`)

      return {
        success: true,
        tenders,
        scrapedCount: tenders.length,
      }
    } catch (error) {
      console.error(`[v0] GenericHtmlScraper: Error scraping ${this.sourceName}:`, error)
      return {
        success: false,
        tenders: [],
        error: error instanceof Error ? error.message : "Unknown error",
        scrapedCount: 0,
      }
    }
  }

  private findTenderElements($: cheerio.CheerioAPI): cheerio.Cheerio<cheerio.Element>[] {
    console.log(`[v0] GenericHtmlScraper: Searching for tender elements...`)
    console.log(`[v0] GenericHtmlScraper: Page title: ${$("title").text()}`)
    console.log(`[v0] GenericHtmlScraper: Total links on page: ${$("a").length}`)
    console.log(`[v0] GenericHtmlScraper: Total tables on page: ${$("table").length}`)
    console.log(`[v0] GenericHtmlScraper: Total divs on page: ${$("div").length}`)

    const selectors = [
      "table.tenders tr",
      "div.tender-item",
      "div.tender",
      "article.tender",
      ".tender-list .item",
      "table tbody tr",
      "ul.tenders li",
      "table tr:has(a)",
      "div:has(a[href*='tender'])",
      "tr:has(td)",
    ]

    for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        console.log(`[v0] GenericHtmlScraper: Found ${elements.length} elements using selector: ${selector}`)
        return elements.toArray().map((el: any) => $(el))
      } else {
        console.log(`[v0] GenericHtmlScraper: No elements found with selector: ${selector}`)
      }
    }

    console.log(`[v0] GenericHtmlScraper: No tender elements found with any selector!`)
    console.log(`[v0] GenericHtmlScraper: Page body HTML (first 500 chars):`, $("body").html()?.substring(0, 500))

    return []
  }

  private extractTenderData($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): ScrapedTender | null {
    try {
      const tenderReferenceHints = this.getFieldExtractionHints("tender_reference")
      const titleHints = this.getFieldExtractionHints("title")
      const closeDateHints = this.getFieldExtractionHints("close_date")

      const title = this.extractTitle($, element)
      if (!title) return null

      const link = this.extractLink($, element)
      const dates = this.extractDates($, element)
      const description = this.extractDescription($, element)
      const reference = this.extractReferenceIntelligent($, element, tenderReferenceHints)
      const documentUrls = this.extractDocumentUrls($, element)

      const organization = this.extractOrganization($, element)
      const location = this.extractLocation($, element)
      const value = this.extractValue($, element)
      const category = this.extractCategory($, element)
      const contactInfo = this.extractContactInfo($, element)

      const tenderData: ScrapedTender = {
        title: this.cleanText(title),
        description: description ? this.cleanText(description) : title, // Use title as fallback
        tender_reference: reference ? this.cleanText(reference) : `AUTO-${Date.now()}`, // Generate reference
        organization: organization || this.sourceName, // Use source name as fallback
        tender_url: link ? this.makeAbsoluteUrl(link, this.sourceUrl) : this.sourceUrl,
        publish_date: dates.publishDate || new Date().toISOString(), // Use current date if missing
        close_date: dates.closeDate,
        opening_date: dates.openingDate,
        document_urls: documentUrls.length > 0 ? documentUrls : undefined,
        location,
        estimated_value: value,
        category,
        contact_email: contactInfo.email,
        contact_phone: contactInfo.phone,
        contact_person: contactInfo.person,
        raw_data: {
          html: element.html()?.substring(0, 1000),
          extracted_at: new Date().toISOString(),
        },
      }

      console.log(`[v0] GenericHtmlScraper: Extracted tender data for: ${tenderData.title}`)
      console.log(`[v0] GenericHtmlScraper:   - Reference: ${tenderData.tender_reference}`)
      console.log(`[v0] GenericHtmlScraper:   - Organization: ${tenderData.organization}`)
      console.log(`[v0] GenericHtmlScraper:   - Close Date: ${tenderData.close_date || "MISSING"}`)
      console.log(`[v0] GenericHtmlScraper:   - Description: ${tenderData.description?.substring(0, 50)}...`)

      return tenderData
    } catch (error) {
      console.error("[Scraper] Error extracting tender data:", error)
      return null
    }
  }

  private extractReferenceIntelligent(
    $: cheerio.CheerioAPI,
    element: cheerio.Cheerio<cheerio.Element>,
    hints: any,
  ): string | null {
    if (!hints) return this.extractReference($, element)

    const text = element.text()

    // Try patterns from tenders engine
    if (hints.extractionHints?.patterns) {
      for (const patternStr of hints.extractionHints.patterns) {
        try {
          const pattern = new RegExp(patternStr, "i")
          const match = text.match(pattern)
          if (match) {
            console.log(`[v0] Found tender reference using pattern: ${patternStr}`)
            return match[0]
          }
        } catch (e) {
          // Invalid regex, skip
        }
      }
    }

    // Fall back to original method
    return this.extractReference($, element)
  }

  private extractTitle($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    const selectors = [
      "td.title",
      "td:first-child",
      ".tender-title",
      ".title",
      "h3",
      "h4",
      "h5",
      "a[href*='tender']",
      "a[href*='bid']",
      "a",
      "strong",
      "b",
      "td:nth-child(1)",
      "td:nth-child(2)",
    ]

    for (const selector of selectors) {
      const text = element.find(selector).first().text()
      if (text && text.trim().length > 10) {
        return text
      }
    }

    const linkText = element.find("a").first().text()
    if (linkText && linkText.trim().length > 10) {
      return linkText
    }

    return null
  }

  private extractLink($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    const link = element.find("a").first().attr("href")
    return link || null
  }

  private extractDates(
    $: cheerio.CheerioAPI,
    element: cheerio.Cheerio<cheerio.Element>,
  ): {
    publishDate?: string
    closeDate?: string
    openingDate?: string
  } {
    const datePatterns = [
      /(\d{4}[-/]\d{2}[-/]\d{2})/g,
      /(\d{2}[-/]\d{2}[-/]\d{4})/g,
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/gi,
    ]

    const text = element.text()
    const dates: string[] = []

    for (const pattern of datePatterns) {
      const matches = text.match(pattern)
      if (matches) {
        dates.push(...matches)
      }
    }

    return {
      publishDate: dates[0] ? this.parseDate(dates[0]) : undefined,
      closeDate: dates[1] ? this.parseDate(dates[1]) : undefined,
      openingDate: dates[2] ? this.parseDate(dates[2]) : undefined,
    }
  }

  private extractDescription($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    const selectors = [".description", "td:nth-child(2)", "p"]

    for (const selector of selectors) {
      const text = element.find(selector).first().text()
      if (text && text.trim().length > 20) {
        return text
      }
    }

    return null
  }

  private extractReference($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    const text = element.text()
    const patterns = [/(?:Ref|Reference|Tender|No)[:\s]+([A-Z0-9\-/]+)/i, /([A-Z]{2,}\d{4}[-/]\d+)/]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1] || match[0]
      }
    }

    return null
  }

  // Use helper methods from BaseScraper: `cleanText`, `makeAbsoluteUrl`, `parseDate`

  private extractDocumentUrls(
    $: cheerio.CheerioAPI,
    element: cheerio.Cheerio<cheerio.Element>,
  ): Array<{ title: string; url: string }> {
    const documentUrls: Array<{ title: string; url: string }> = []

    const docExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".zip",
      ".rar",
      ".ppt",
      ".pptx",
      ".txt",
      ".csv",
      ".odt",
      ".ods",
      ".7z",
    ]

    element.find("a").each((_: any, linkEl: any) => {
      const href = $(linkEl).attr("href")
      if (!href) return

      const isDocument = docExtensions.some((ext) => href.toLowerCase().includes(ext))

      const linkText = $(linkEl).text().toLowerCase()
      const hasDocKeyword =
        linkText.includes("download") ||
        linkText.includes("document") ||
        linkText.includes("attachment") ||
        linkText.includes("file") ||
        linkText.includes("tender") ||
        linkText.includes("rfp") ||
        linkText.includes("specification") ||
        href.toLowerCase().includes("document") ||
        href.toLowerCase().includes("attachment") ||
        href.toLowerCase().includes("download")

      if (isDocument || hasDocKeyword) {
        const absoluteUrl = this.makeAbsoluteUrl(href, this.sourceUrl)
        const title = $(linkEl).text().trim() || "Document"

        if (!documentUrls.some((doc) => doc.url === absoluteUrl)) {
          documentUrls.push({ title, url: absoluteUrl })
          console.log(`[v0] GenericHtmlScraper: Found document: ${title} - ${absoluteUrl}`)
        }
      }
    })

    return documentUrls
  }

  private extractOrganization($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | undefined {
    const selectors = [".organization", ".entity", ".client", "td:contains('Organization')", ".issuing-authority"]

    for (const selector of selectors) {
      const text = element.find(selector).first().text()
      if (text && text.trim().length > 3) {
        return this.cleanText(text)
      }
    }

    // Try to find organization patterns in text
    const fullText = element.text()
    const orgPatterns = [/(?:Organization|Entity|Client|Authority)[:\s]+([^,\n]+)/i, /issued by[:\s]+([^,\n]+)/i]

    for (const pattern of orgPatterns) {
      const match = fullText.match(pattern)
      if (match) return this.cleanText(match[1])
    }

    return undefined
  }

  private extractLocation($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | undefined {
    const selectors = [".location", ".province", ".region", "td:contains('Location')", ".venue"]

    for (const selector of selectors) {
      const text = element.find(selector).first().text()
      if (text && text.trim().length > 2) {
        return this.cleanText(text)
      }
    }

    // Try to find location patterns
    const fullText = element.text()
    const locationPatterns = [
      /(Gauteng|Western Cape|Eastern Cape|KwaZulu-Natal|Limpopo|Mpumalanga|Northern Cape|North West|Free State)/i,
      /(?:Location|Province|Region)[:\s]+([^,\n]+)/i,
    ]

    for (const pattern of locationPatterns) {
      const match = fullText.match(pattern)
      if (match) return this.cleanText(match[1])
    }

    return undefined
  }

  private extractValue($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | undefined {
    const selectors = [".value", ".amount", ".price", "td:contains('Value')", ".estimated-value"]

    for (const selector of selectors) {
      const text = element.find(selector).first().text()
      if (text && (text.includes("R") || text.includes("ZAR") || /\d+/.test(text))) {
        return this.cleanText(text)
      }
    }

    // Try to find value patterns
    const fullText = element.text()
    const valuePatterns = [/R\s*[\d\s,]+/i, /ZAR\s*[\d\s,]+/i, /(?:Value|Amount|Price)[:\s]+(R?\s*[\d\s,]+)/i]

    for (const pattern of valuePatterns) {
      const match = fullText.match(pattern)
      if (match) return this.cleanText(match[0])
    }

    return undefined
  }

  private extractCategory($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | undefined {
    const selectors = [".category", ".type", ".classification", "td:contains('Category')"]

    for (const selector of selectors) {
      const text = element.find(selector).first().text()
      if (text && text.trim().length > 2) {
        return this.cleanText(text)
      }
    }

    return undefined
  }

  private extractContactInfo(
    $: cheerio.CheerioAPI,
    element: cheerio.Cheerio<cheerio.Element>,
  ): {
    email?: string
    phone?: string
    person?: string
  } {
    const fullText = element.text()

    // Extract email
    const emailMatch = fullText.match(/[\w.-]+@[\w.-]+\.\w+/)
    const email = emailMatch ? emailMatch[0] : undefined

    // Extract phone
    const phoneMatch = fullText.match(/(?:\+27|0)\s*\d{2}\s*\d{3}\s*\d{4}/)
    const phone = phoneMatch ? phoneMatch[0] : undefined

    // Extract contact person
    let person: string | undefined
    const personSelectors = [".contact-person", ".contact-name", "td:contains('Contact Person')"]
    for (const selector of personSelectors) {
      const text = element.find(selector).first().text()
      if (text && text.trim().length > 3) {
        person = this.cleanText(text)
        break
      }
    }

    return { email, phone, person }
  }
}
