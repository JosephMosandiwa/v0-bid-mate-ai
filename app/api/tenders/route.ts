import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const DATA_DIR = path.join(process.cwd(), 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

function saveFile(buffer: Buffer, filename: string) {
  const uploadsDir = path.join(DATA_DIR, 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  const filePath = path.join(uploadsDir, filename)
  fs.writeFileSync(filePath, buffer)
  return filePath
}

function readTendersStore() {
  const storePath = path.join(DATA_DIR, 'tenders.json')
  try {
    const raw = fs.readFileSync(storePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { tenders: {} }
  }
}

function writeTendersStore(store: any) {
  const storePath = path.join(DATA_DIR, 'tenders.json')
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2))
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'multipart/form-data required' }, { status: 400 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const metadata = formData.get('metadata') as string | null

    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = `${Date.now()}-${file.name}`
    const filePath = saveFile(buffer, filename)

    // create tender placeholder in simple JSON store
    const store = readTendersStore()
    const tenderId = 'tender_' + Date.now().toString(36)
    store.tenders[tenderId] = {
      id: tenderId,
      status: 'processing',
      storageRef: filePath,
      metadata: metadata ? JSON.parse(metadata) : null,
      createdAt: new Date().toISOString(),
    }
    writeTendersStore(store)

    // enqueue a background mock extraction (in-process)
    setTimeout(() => {
      const s = readTendersStore()
      if (!s.tenders[tenderId]) return
      s.tenders[tenderId].status = 'processed'
      s.tenders[tenderId].extraction = { title: 'Mock Tender Title', closingDate: null, rawText: '' }
      writeTendersStore(s)
    }, 1500)

    return NextResponse.json({ tenderId, status: 'processing' }, { status: 202 })
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const store = readTendersStore()
    if (id) {
      const t = store.tenders[id]
      if (!t) return NextResponse.json({ error: 'not found' }, { status: 404 })
      return NextResponse.json(t)
    }
    return NextResponse.json(Object.values(store.tenders || {}))
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 })
  }
}
