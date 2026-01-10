# OCR Runtime Setup

This project uses server-side rendering + OCR for scanned PDFs. The codebase contains worker scaffolds that depend on `puppeteer` and `tesseract.js`.

Install steps (recommended):

1. Open a terminal in `v0-bid-mate-ai`.

2. Install the dependencies (example with npm):

```powershell
npm install puppeteer tesseract.js --save
```

Notes & Windows quirks:

- If your `~/.npmrc` contains an expired token, refresh it or temporarily move it aside before running `npm install`.
- `puppeteer` downloads a Chromium binary by default; you can set `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1` and provide a system Chromium if needed.

Running the OCR worker (example):

```powershell
node -e "(async()=>{ const start = (await import('./lib/workers/ocr_worker.mjs')).default; try{ const w = await start(); console.log('OCR worker ready'); } catch(e){ console.error(e.message)} })()"
```

If you prefer Docker, run a container with Chrome/Chromium and install `tesseract-ocr` system package, then run your Node worker inside it.
