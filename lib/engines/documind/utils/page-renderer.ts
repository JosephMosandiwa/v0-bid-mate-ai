// Server-side PDF page renderer helper
// Best-effort implementation using puppeteer. Falls back if puppeteer is unavailable.

export async function renderPdfPageToPng(pdfBytes: Uint8Array | ArrayBuffer, pageNumber: number, scale = 2): Promise<Buffer | null> {
  // Use a computed module name and dynamic import to avoid static analysis
  // by bundlers which would otherwise try to resolve `puppeteer` at build time.
  const moduleName = ['puppeteer'].join('')
  let puppeteer: any
  try {
    const imported = await import(moduleName)
    puppeteer = imported.default ?? imported
  } catch (e) {
    console.warn('page-renderer: puppeteer not installed; skipping server-side render', e)
    return null
  }

  try {
    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] })
    const page = await browser.newPage()

    const base64 = Buffer.from(pdfBytes).toString("base64")
    const dataUrl = `data:application/pdf;base64,${base64}`

    await page.goto(dataUrl, { waitUntil: "networkidle0" })

    try {
      await page.evaluate((p) => {
        // @ts-ignore
        const viewer = (window as any).PDFViewerApplication
        if (viewer && viewer.pdfViewer) {
          viewer.pdfViewer.currentPageNumber = p
        }
      }, pageNumber)
    } catch {}

    await page.waitForTimeout(500)

    const clip = await page.evaluate(() => {
      const el = document.querySelector('canvas') || document.body
      const rect = el.getBoundingClientRect()
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    })

    const screenshot = await page.screenshot({ clip, type: 'png' })
    await browser.close()
    return screenshot as Buffer
  } catch (err) {
    console.warn('page-renderer: rendering failed', err)
    return null
  }
}
