(async()=>{
  try{
    const url = 'http://localhost:3000/api/custom-tenders/upload'
    const buffer = Buffer.from('%PDF-1.4\n%EOF')
    const form = new FormData()
    const blob = new Blob([buffer], { type: 'application/pdf' })
    form.append('file', blob, 'test.pdf')
    form.append('title', 'Test Tender')
    form.append('description', 'Uploaded from test script')

    const res = await fetch(url, { method: 'POST', body: form })
    const text = await res.text()
    console.log('STATUS:' + res.status)
    console.log(text)
  } catch (e) {
    console.error('ERROR:', e)
    process.exit(1)
  }
})()
