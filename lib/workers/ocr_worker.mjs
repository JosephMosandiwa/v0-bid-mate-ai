// OCR worker scaffold — requires `puppeteer` and `tesseract.js` to run.
// This file is safe to commit and will print a clear error if deps missing.
import fs from 'fs'
import path from 'path'

async function checkDeps() {
  try {
    await import('puppeteer')
    await import('tesseract.js')
    return true
  } catch (e) {
    return false
  }
}

export async function startOcrWorker(options = {}) {
  const ok = await checkDeps()
  if (!ok) {
    throw new Error('Missing dependencies: install "puppeteer" and "tesseract.js". See scripts/OCR_SETUP.md')
  }

  const { default: puppeteer } = await import('puppeteer')
  const { createWorker } = await import('tesseract.js')

  const worker = createWorker({ logger: m => {/* noop */} })

  // Minimal example flow: render page image -> OCR -> return text
  async function renderPageToPng(pdfPath, pageNumber = 0) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    const fileUrl = 'file://' + path.resolve(pdfPath)
    await page.goto(fileUrl, { waitUntil: 'networkidle0' })
    const png = await page.screenshot({ fullPage: true })
    await browser.close()
    return png
  }

  async function ocrBuffer(buf) {
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    const { data } = await worker.recognize(buf)
    await worker.terminate()
    return data.text
  }

  return {
    renderPageToPng,
    ocrBuffer,
  }
}

export default startOcrWorker
