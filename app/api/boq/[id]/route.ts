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
    return { boq: {} }
  }
}

async function writeStore(store: any) {
  const filePath = path.join(process.cwd(), 'data', 'tenders.json')
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(store, null, 2), 'utf8')
}

export async function GET(request: Request, context: any) {
  try {
    const { params } = context
    const id = params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const store = await readStore()
    const boq = (store.boq && store.boq[id]) || { rows: [] }
    return NextResponse.json({ success: true, boq })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request, context: any) {
  try {
    const { params } = context
    const id = params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const body = await request.json()

    const store = await readStore()
    store.boq = store.boq || {}
    store.boq[id] = body || { rows: [] }
    await writeStore(store)

    return NextResponse.json({ success: true, boq: store.boq[id] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}
