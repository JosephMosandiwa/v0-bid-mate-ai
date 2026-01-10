import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

async function readStore() {
  const filePath = path.join(process.cwd(), 'data', 'tenders.json')
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { tenders: [], documents: [], analysis: [], forms: {} }
  }
}

async function writeStore(store: any) {
  const filePath = path.join(process.cwd(), 'data', 'tenders.json')
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(store, null, 2), 'utf8')
}

export async function POST(request: Request, context: any) {
  try {
    const { params } = context
    const id = params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const body = await request.json()
    const form = body || {}

    const store = await readStore()
    store.forms = store.forms || {}
    store.forms[id] = store.forms[id] || []
    const entry = { id: cryptoRandomId(), created_at: new Date().toISOString(), data: form }
    store.forms[id].push(entry)
    await writeStore(store)

    return NextResponse.json({ success: true, form: entry })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}

function cryptoRandomId() {
  return 'f_' + Math.random().toString(36).slice(2, 10)
}
