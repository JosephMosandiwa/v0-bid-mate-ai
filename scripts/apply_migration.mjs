#!/usr/bin/env node
// Apply SQL migration to the database using DATABASE_URL env var
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { Client } from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const migrationPath = path.join(__dirname, '..', 'scripts', '036_add_custom_tender_field_history_and_confidences.sql')
  if (!fs.existsSync(migrationPath)) {
    console.error('Migration file not found:', migrationPath)
    process.exit(1)
  }

  const sql = fs.readFileSync(migrationPath, 'utf8')
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  if (!dbUrl) {
    console.error('DATABASE_URL or SUPABASE_DB_URL must be set')
    process.exit(1)
  }

  const client = new Client({ connectionString: dbUrl })
  await client.connect()
  try {
    console.log('Applying migration...')
    await client.query(sql)
    console.log('Migration applied successfully')
  } catch (err) {
    console.error('Migration failed:', err)
  } finally {
    await client.end()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
