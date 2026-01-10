// Template train worker scaffold — consumes field history to rebuild templates.
// This is a scaffold; implement model training or heuristic updates here.
import fs from 'fs'
import path from 'path'

export async function trainTemplates({ dbClient, batchSize = 100 } = {}) {
  if (!dbClient) {
    throw new Error('dbClient required. Provide a pg Client/Pool connected to your DB.')
  }

  // Example: read recent corrections and produce a summary JSON for retrain
  const res = await dbClient.query(`SELECT tender_id, field_key, old_value, new_value, created_at FROM public.user_custom_tender_field_history ORDER BY created_at DESC LIMIT $1`, [batchSize])
  const rows = res.rows || []

  // Aggregate by field_key
  const agg = {}
  for (const r of rows) {
    if (!agg[r.field_key]) agg[r.field_key] = []
    agg[r.field_key].push({ tender_id: r.tender_id, old: r.old_value, new: r.new_value })
  }

  // Write a local artifact that can be used by offline training processes
  const out = path.join(process.cwd(), 'tmp', `template-retrain-${Date.now()}.json`)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, JSON.stringify({ summary: agg, sampleCount: rows.length }, null, 2))

  return { artifact: out, sampleCount: rows.length }
}

export default trainTemplates
