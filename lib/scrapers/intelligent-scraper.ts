/**
 * Intelligent Scraper
 * 
 * A smart scraper that uses source-specific configurations to extract
 * all available information from each tender source.
 */

import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"
import { type SourceConfig, type SourceFieldMapping, getSourceConfig } from "./source-configs"
import * as cheerio from "cheerio"

export class IntelligentScraper extends BaseScraper {
  private config: SourceConfig | undefined
  private scraperType: string

  constructor(
    sourceId: number, 
    sourceName: string, 
    sourceUrl: string, 
    scraperType: string = 'generic'
  ) {
    super(sourceId, sourceName, sourceUrl)
    this.scraperType = scraperType
    this.config = getSourceConfig(scraperType)
    
    if (this.config) {
      console.log(`[IntelligentScraper] Loaded config for ${this.config.name} (${this.config.type})`)
    } else {
      console.log(`[IntelligentScraper] No specific config for ${scraperType}, using generic scraping`)
    }
  }

  async scrape(): Promise<ScraperResult> {
    console.log(`[IntelligentScraper] Starting scrape for ${this.sourceName}`)
    console.log(`[IntelligentScraper] Scraper type: ${this.scraperType}`)
    console.log(`[IntelligentScraper] Has config: ${!!this.config}`)

    try {
      if (this.config) {
        // Use source-specific scraping
        if (this.config.type === 'api') {
          return await this.scrapeApi()
        } else if (this.config.type === 'html' || this.config.type === 'hybrid') {
          return await this.scrapeHtml()
        }
      }

      // Fall back to generic scraping
      return await this.scrapeGeneric()
    } catch (error) {
      console.error(`[IntelligentScraper] Error:`, error)
      return {
        success: false,
        tenders: [],
        scrapedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Scrape using API configuration
   */
  private async scrapeApi(): Promise<ScraperResult> {
    if (!this.config?.api) {
      throw new Error('API configuration missing')
    }

    const { api } = this.config
    const tenders: ScrapedTender[] = []

    // Build API URL with pagination
    const params = new URLSearchParams()
    params.set(api.pagination.pageParam, '1')
    params.set(api.pagination.sizeParam, api.pagination.defaultSize.toString())

    // Add date range for recent tenders (last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    params.set('dateFrom', startDate.toISOString().split('T')[0])
    params.set('dateTo', endDate.toISOString().split('T')[0])

    const url = `${api.baseUrl}${api.endpoints.list}?${params.toString()}`
    console.log(`[IntelligentScraper] Fetching API: ${url}`)

    const headers: Record<string, string> = {
      'Accept': api.responseFormat === 'json' ? 'application/json' : 'application/xml',
      'User-Agent': 'BidMateAI/1.0'
    }

    // Add authentication if required
    if (api.authentication?.type === 'apiKey' && api.authentication.headerName) {
      headers[api.authentication.headerName] = process.env.API_KEY || ''
    }

    let response: Response
    try {
      response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(30000)
      })
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : 'Network error'
      console.error(`[IntelligentScraper] API fetch failed: ${errorMsg}`)
      throw new Error(`Failed to connect to API: ${errorMsg}`)
    }

    if (!response.ok) {
      const statusMsg = `API returned ${response.status}: ${response.statusText}`
      console.error(`[IntelligentScraper] ${statusMsg}`)
      
      if (response.status === 404) {
        throw new Error(`API endpoint not found (404). The source URL may have changed.`)
      } else if (response.status === 403) {
        throw new Error(`API access forbidden (403). The source may require authentication.`)
      } else if (response.status >= 500) {
        throw new Error(`API server error (${response.status}). The source may be temporarily unavailable.`)
      }
      throw new Error(statusMsg)
    }

    const data = await response.json()
    
    // Extract tenders from response using configured path
    const tendersData = this.getNestedValue(data, api.tendersPath) || []
    console.log(`[IntelligentScraper] Found ${tendersData.length} tenders in API response`)

    for (const item of tendersData) {
      const tender = this.normalizeApiTender(item)
      if (tender) {
        tenders.push(tender)
      }
    }

    return {
      success: true,
      tenders,
      scrapedCount: tenders.length
    }
  }

  /**
   * Scrape using HTML configuration
   */
  private async scrapeHtml(): Promise<ScraperResult> {
    if (!this.config?.html) {
      throw new Error('HTML configuration missing')
    }

    const { html } = this.config
    const tenders: ScrapedTender[] = []

    // Fetch HTML (with optional proxy for anti-scraping)
    const scrapingApiKey = process.env.SCRAPING_API_KEY
    let url = html.listUrl

    if (scrapingApiKey && this.config.flags?.hasAntiScraping) {
      url = `http://api.scraperapi.com?api_key=${scrapingApiKey}&url=${encodeURIComponent(html.listUrl)}`
    }

    console.log(`[IntelligentScraper] Fetching HTML: ${html.listUrl}`)

    let response: Response
    try {
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(30000)
      })
    } catch (fetchError) {
      const errorMsg = fetchError instanceof Error ? fetchError.message : 'Network error'
      console.error(`[IntelligentScraper] HTML fetch failed: ${errorMsg}`)
      throw new Error(`Failed to fetch HTML: ${errorMsg}`)
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const htmlContent = await response.text()
    const $ = cheerio.load(htmlContent)

    console.log(`[IntelligentScraper] Loaded HTML, searching for tenders with: ${html.tenderSelector}`)

    // Find all tender elements
    const tenderElements = $(html.tenderSelector)
    console.log(`[IntelligentScraper] Found ${tenderElements.length} potential tender elements`)

    tenderElements.each((index, element) => {
      try {
        const tender = this.extractTenderFromHtml($, $(element), html.fields)
        
        // Extract detail link if configured
        if (html.detailLinkSelector) {
          const detailLink = $(element).find(html.detailLinkSelector).attr('href')
          if (detailLink) {
            tender.tender_url = this.makeAbsoluteUrl(detailLink, this.config!.website)
          }
        }

        // Extract documents
        const documents = this.extractDocuments($, $(element))
        if (documents.length > 0) {
          tender.document_urls = documents
        }

        // Validate tender has minimum required data
        if (tender.title && tender.title.length > 10) {
          tender.organization = tender.organization || this.config?.name
          tender.province = tender.province || this.config?.province
          tender.raw_data = {
            source: this.config?.name,
            source_id: this.config?.id,
            scraped_at: new Date().toISOString(),
            html_preview: $(element).html()?.substring(0, 500)
          }
          
          tenders.push(this.normalizeTenderData(tender))
          console.log(`[IntelligentScraper] Extracted tender: ${tender.title?.substring(0, 50)}...`)
        }
      } catch (err) {
        console.error(`[IntelligentScraper] Error extracting tender at index ${index}:`, err)
      }
    })

    // If we found tenders on list page, try to get more details from detail pages
    if (tenders.length > 0 && html.detailLinkSelector) {
      await this.enrichTendersFromDetailPages(tenders)
    }

    return {
      success: true,
      tenders,
      scrapedCount: tenders.length
    }
  }

  /**
   * Extract tender data from HTML element using field mappings
   */
  private extractTenderFromHtml(
    $: cheerio.CheerioAPI,
    $element: cheerio.Cheerio<any>,
    fields: NonNullable<SourceConfig['html']>['fields']
  ): ScrapedTender {
    const tender: ScrapedTender = {
      title: ''
    }

    // Extract each configured field
    for (const [fieldName, mapping] of Object.entries(fields)) {
      if (!mapping) continue
      
      const value = this.extractField($, $element, mapping)
      if (value) {
        (tender as any)[fieldName === 'closeDate' ? 'close_date' : 
                        fieldName === 'publishDate' ? 'publish_date' :
                        fieldName === 'contactPerson' ? 'contact_person' :
                        fieldName === 'contactEmail' ? 'contact_email' :
                        fieldName === 'contactPhone' ? 'contact_phone' :
                        fieldName] = value
      }
    }

    return tender
  }

  /**
   * Extract a single field using mapping configuration
   */
  private extractField(
    $: cheerio.CheerioAPI,
    $element: cheerio.Cheerio<any>,
    mapping: SourceFieldMapping
  ): string | undefined {
    // Try primary selector
    let value = this.extractWithSelector($, $element, mapping.selector, mapping.extractType, mapping.attribute)

    // Try fallback selectors if no value
    if (!value && mapping.fallbacks) {
      for (const fallback of mapping.fallbacks) {
        value = this.extractWithSelector($, $element, fallback, mapping.extractType, mapping.attribute)
        if (value) break
      }
    }

    // Apply transform
    if (value && mapping.transform) {
      value = this.applyTransform(value, mapping.transform)
    }

    return value
  }

  /**
   * Extract value using a specific selector
   */
  private extractWithSelector(
    $: cheerio.CheerioAPI,
    $element: cheerio.Cheerio<any>,
    selector: string,
    extractType: SourceFieldMapping['extractType'],
    attribute?: string
  ): string | undefined {
    const $target = $element.find(selector)
    if ($target.length === 0) return undefined

    switch (extractType) {
      case 'text':
        return $target.first().text().trim()
      case 'attr':
        return attribute ? $target.first().attr(attribute) : undefined
      case 'html':
        return $target.first().html() || undefined
      default:
        return $target.first().text().trim()
    }
  }

  /**
   * Apply transformation to extracted value
   */
  private applyTransform(value: string, transform: SourceFieldMapping['transform']): string {
    switch (transform) {
      case 'trim':
        return value.trim().replace(/\s+/g, ' ')
      
      case 'date':
        return this.parseDate(value) || value
      
      case 'currency':
        // Extract numeric value and format
        const numericValue = value.replace(/[^\d.,]/g, '')
        if (numericValue) {
          return `R ${parseFloat(numericValue.replace(/,/g, '')).toLocaleString()}`
        }
        return value
      
      case 'email':
        // Extract email from mailto: links or text
        const emailMatch = value.match(/[\w.-]+@[\w.-]+\.\w+/)
        return emailMatch ? emailMatch[0] : value
      
      case 'phone':
        // Clean phone number
        return value.replace(/[^\d+\-() ]/g, '').trim()
      
      case 'url':
        return value.startsWith('http') ? value : this.makeAbsoluteUrl(value, this.config!.website)
      
      default:
        return value
    }
  }

  /**
   * Extract documents from tender element
   */
  private extractDocuments(
    $: cheerio.CheerioAPI,
    $element: cheerio.Cheerio<any>
  ): Array<{ title: string; url: string; type?: string; format?: string }> {
    if (!this.config?.documents) return []

    const { documents } = this.config
    const result: Array<{ title: string; url: string; type?: string; format?: string }> = []

    $element.find(documents.listSelector).each((_, docElement) => {
      const $doc = $(docElement)
      const url = $doc.attr('href') || $doc.find('a').attr('href')
      const title = $doc.text().trim() || $doc.attr('title') || 'Document'

      if (url) {
        // Check if URL matches expected document pattern
        const isDocument = documents.urlPattern 
          ? documents.urlPattern.test(url)
          : documents.expectedFormats.some(ext => url.toLowerCase().includes(`.${ext}`))

        if (isDocument || !documents.urlPattern) {
          const absoluteUrl = this.makeAbsoluteUrl(url, documents.baseUrl)
          const format = this.detectDocumentFormat(url)
          
          result.push({
            title: title.substring(0, 200),
            url: absoluteUrl,
            type: 'tender_document',
            format
          })
        }
      }
    })

    return result
  }

  /**
   * Detect document format from URL
   */
  private detectDocumentFormat(url: string): string {
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes('.pdf')) return 'pdf'
    if (lowerUrl.includes('.doc')) return 'doc'
    if (lowerUrl.includes('.docx')) return 'docx'
    if (lowerUrl.includes('.xls')) return 'xls'
    if (lowerUrl.includes('.xlsx')) return 'xlsx'
    if (lowerUrl.includes('.zip')) return 'zip'
    return 'unknown'
  }

  /**
   * Enrich tenders with data from detail pages
   */
  private async enrichTendersFromDetailPages(tenders: ScrapedTender[]): Promise<void> {
    // Limit concurrent requests
    const batchSize = 5
    
    for (let i = 0; i < tenders.length; i += batchSize) {
      const batch = tenders.slice(i, i + batchSize)
      
      await Promise.all(
        batch.map(async (tender) => {
          if (!tender.tender_url) return

          try {
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const scrapingApiKey = process.env.SCRAPING_API_KEY
            let url = tender.tender_url

            if (scrapingApiKey) {
              url = `http://api.scraperapi.com?api_key=${scrapingApiKey}&url=${encodeURIComponent(tender.tender_url)}`
            }

            const response = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html',
              },
              signal: AbortSignal.timeout(15000)
            })

            if (!response.ok) return

            const html = await response.text()
            const $ = cheerio.load(html)

            // Try to extract additional documents from detail page
            const additionalDocs = this.extractDocumentsFromDetailPage($)
            if (additionalDocs.length > 0) {
              tender.document_urls = [
                ...(tender.document_urls || []),
                ...additionalDocs
              ]
            }

            // Try to extract missing fields from detail page
            if (!tender.description) {
              const description = $('div.description, .tender-description, article p, .content p').text().trim()
              if (description && description.length > 50) {
                tender.description = description.substring(0, 2000)
              }
            }

            if (!tender.contact_email) {
              const email = $('a[href^="mailto:"]').attr('href')?.replace('mailto:', '')
              if (email) {
                tender.contact_email = email
              }
            }

            if (!tender.contact_phone) {
              const phone = $('a[href^="tel:"]').attr('href')?.replace('tel:', '')
              if (phone) {
                tender.contact_phone = phone
              }
            }

            console.log(`[IntelligentScraper] Enriched tender: ${tender.title?.substring(0, 40)}... (${tender.document_urls?.length || 0} docs)`)
          } catch (err) {
            // Ignore errors on detail page fetch
          }
        })
      )
    }
  }

  /**
   * Extract documents from detail page
   */
  private extractDocumentsFromDetailPage($: cheerio.CheerioAPI): Array<{ title: string; url: string; type?: string; format?: string }> {
    const documents: Array<{ title: string; url: string; type?: string; format?: string }> = []
    
    // Common document link selectors
    const selectors = [
      'a[href$=".pdf"]',
      'a[href$=".doc"]',
      'a[href$=".docx"]',
      'a[href$=".xls"]',
      'a[href$=".xlsx"]',
      'a[href$=".zip"]',
      '.documents a',
      '.attachments a',
      '.tender-documents a',
      '.downloads a',
      'a.document-link',
      'a.download-link'
    ]

    selectors.forEach(selector => {
      $(selector).each((_, el) => {
        const $el = $(el)
        const url = $el.attr('href')
        const title = $el.text().trim() || $el.attr('title') || 'Document'

        if (url && !documents.some(d => d.url === url)) {
          const absoluteUrl = this.makeAbsoluteUrl(url, this.config?.website || this.sourceUrl)
          documents.push({
            title: title.substring(0, 200),
            url: absoluteUrl,
            type: 'tender_document',
            format: this.detectDocumentFormat(url)
          })
        }
      })
    })

    return documents
  }

  /**
   * Normalize API response to ScrapedTender
   */
  private normalizeApiTender(data: any): ScrapedTender | null {
    // Handle OCDS format (eTender API)
    if (data.tender || data.ocid) {
      return this.normalizeOcdsTender(data)
    }

    // Handle generic JSON format
    return {
      title: data.title || data.name || data.description,
      tender_reference: data.reference || data.tender_number || data.id,
      description: data.description || data.summary,
      organization: data.organization || data.buyer || data.procuringEntity?.name,
      category: data.category || data.type,
      publish_date: data.publishDate || data.date,
      close_date: data.closeDate || data.closingDate || data.deadline,
      estimated_value: data.value?.amount ? `R ${data.value.amount.toLocaleString()}` : data.estimatedValue,
      contact_person: data.contactPerson || data.contact?.name,
      contact_email: data.contactEmail || data.contact?.email,
      contact_phone: data.contactPhone || data.contact?.telephoneNumber,
      tender_url: data.url || data.link,
      document_urls: data.documents?.map((d: any) => ({
        title: d.title || d.name,
        url: d.url,
        type: d.type,
        format: d.format
      })),
      raw_data: data
    }
  }

  /**
   * Normalize OCDS format tender
   */
  private normalizeOcdsTender(ocds: any): ScrapedTender | null {
    const tender = ocds.tender
    if (!tender?.title) return null

    const contactPerson = tender.contactPerson || {}
    const documents = tender.documents || []

    return {
      tender_reference: tender.id,
      title: tender.title,
      description: tender.description || tender.title,
      organization: tender.procuringEntity?.name || ocds.buyer?.name,
      category: tender.category || tender.mainProcurementCategory,
      province: tender.province,
      location: tender.deliveryLocation || tender.province,
      publish_date: tender.tenderPeriod?.startDate || ocds.date,
      close_date: tender.tenderPeriod?.endDate,
      estimated_value: tender.value?.amount 
        ? `R ${tender.value.amount.toLocaleString()} ${tender.value.currency || 'ZAR'}` 
        : undefined,
      contact_person: contactPerson.name,
      contact_email: contactPerson.email,
      contact_phone: contactPerson.telephoneNumber,
      tender_url: `https://etenders.gov.za/tender/${tender.id}`,
      tender_type: tender.procurementMethodDetails || tender.procurementMethod,
      procurement_method: tender.procurementMethod,
      status: tender.status,
      special_conditions: tender.specialConditions !== 'N/A' ? tender.specialConditions : undefined,
      document_urls: documents.map((doc: any) => ({
        title: doc.title,
        url: doc.url,
        type: doc.documentType,
        format: doc.format
      })),
      raw_data: {
        ocid: ocds.ocid,
        release_date: ocds.date,
        source: 'eTender API (OCDS)'
      }
    }
  }

  /**
   * Generic scraping fallback when no config is available
   */
  private async scrapeGeneric(): Promise<ScraperResult> {
    console.log(`[IntelligentScraper] Using generic scraping for ${this.sourceUrl}`)

    const scrapingApiKey = process.env.SCRAPING_API_KEY
    let url = this.sourceUrl

    if (scrapingApiKey) {
      url = `http://api.scraperapi.com?api_key=${scrapingApiKey}&url=${encodeURIComponent(this.sourceUrl)}`
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(30000)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const tenders: ScrapedTender[] = []

    // Generic selectors to try
    const containerSelectors = [
      'table tbody tr',
      'div.tender',
      'div.tender-item',
      'article.tender',
      'li.tender',
      'div.notice',
      'div.bid',
      '.listing-item',
      '.card.tender'
    ]

    for (const selector of containerSelectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        console.log(`[IntelligentScraper] Found ${elements.length} elements with selector: ${selector}`)
        
        elements.each((_, element) => {
          const $el = $(element)
          const tender = this.extractGenericTender($, $el)
          
          if (tender.title && tender.title.length > 10) {
            tenders.push(this.normalizeTenderData(tender))
          }
        })

        if (tenders.length > 0) break
      }
    }

    return {
      success: true,
      tenders,
      scrapedCount: tenders.length
    }
  }

  /**
   * Extract tender using generic patterns
   */
  private extractGenericTender($: cheerio.CheerioAPI, $el: cheerio.Cheerio<any>): ScrapedTender {
    // Try to find title
    const title = $el.find('h3, h4, .title, .tender-title, td:first-child a, td:nth-child(2)').first().text().trim() ||
                  $el.find('a').first().text().trim()

    // Try to find reference
    const reference = $el.find('.reference, .tender-ref, .ref, td:first-child').first().text().trim()

    // Try to find link
    const link = $el.find('a').first().attr('href')

    // Try to find date
    const dateText = $el.find('.date, .closing-date, .deadline, td:last-child').first().text().trim()

    return {
      title,
      tender_reference: reference !== title ? reference : undefined,
      tender_url: link ? this.makeAbsoluteUrl(link, this.sourceUrl) : undefined,
      close_date: dateText ? this.parseDate(dateText) : undefined,
      raw_data: {
        source: this.sourceName,
        html_preview: $el.html()?.substring(0, 500)
      }
    }
  }

  /**
   * Helper to get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  /**
   * Helper to parse date strings
   */
  private parseDate(dateStr: string): string | undefined {
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? undefined : date.toISOString()
  }

  /**
   * Helper to make URLs absolute
   */
  private makeAbsoluteUrl(url: string, baseUrl: string): string {
    return new URL(url, baseUrl).href
  }

  /**
   * Helper to normalize tender data
   */
  private normalizeTenderData(tender: ScrapedTender): ScrapedTender {
    return tender
  }
}
