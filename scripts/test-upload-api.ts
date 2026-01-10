import fs from 'fs'
import path from 'path'

async function run() {
  const url = 'http://localhost:3000/api/custom-tenders/upload'

  // small fake PDF content
  const pdfBuffer = Buffer.from('%PDF-1.4\n%EOF')

  const form = new FormData()
  form.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'test.pdf')
  form.append('title', 'Test Tender')
  form.append('description', 'Uploaded from test script')

  const res = await fetch(url, { method: 'POST', body: form as any })
  const txt = await res.text()
  console.log('status', res.status)
  console.log(txt)
}

run().catch((e) => { console.error(e); process.exit(1) })
