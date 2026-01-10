#!/usr/bin/env node
// Check which SQL migration-created objects exist in the database.
// Usage: DATABASE_URL="postgres://..." node scripts/check_migrations.mjs

import fs from 'fs'
import path from 'path'
import { Client } from 'pg'

const MIGRATION_DIRS = [path.join(process.cwd(), 'scripts'), path.join(process.cwd(), 'v0-admin-os-ui', 'scripts')]

function extractObjects(sql) {
  const tables = new Set()
  const columns = []
  const functions = new Set()

  // crude regexes for CREATE TABLE, ALTER TABLE ADD COLUMN, CREATE FUNCTION
  const createTableRe = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:"?([\w\.]+)"?)/ig
  const alterAddColumnRe = /alter\s+table\s+(?:if\s+exists\s+)?(?:"?([\w\.]+)"?)\s+add\s+column\s+(?:if\s+not\s+exists\s+)?(?:"?([\w]+)"?)/ig
  const createFunctionRe = /create\s+function\s+([\w\.]+)\s*\(/ig

  let m
  while ((m = createTableRe.exec(sql))) {
    tables.add(m[1])
  }
  while ((m = alterAddColumnRe.exec(sql))) {
    const tbl = m[1]
    const col = m[2]
    tables.add(tbl)
    columns.push({ table: tbl, column: col })
  }
  while ((m = createFunctionRe.exec(sql))) {
    functions.add(m[1])
  }

  return { tables: Array.from(tables), columns, functions: Array.from(functions) }
}

async function main() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
  if (!dbUrl) {
    console.error('Set DATABASE_URL (or SUPABASE_DB_URL) to run checks')
    process.exit(2)
  }

  const client = new Client({ connectionString: dbUrl })
  await client.connect()

  const aggregated = { tables: new Set(), columns: [], functions: new Set(), byScript: {} }

  for (const dir of MIGRATION_DIRS) {
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql'))
    for (const file of files) {
      const full = path.join(dir, file)
      const sql = fs.readFileSync(full, 'utf8')
      const objs = extractObjects(sql)
      aggregated.byScript[full.replace(process.cwd() + path.sep, '')] = objs
      objs.tables.forEach((t) => aggregated.tables.add(t))
      objs.columns.forEach((c) => aggregated.columns.push(c))
      objs.functions.forEach((fn) => aggregated.functions.add(fn))
    }
  }

  // Check tables
  const tableResults = {}
  for (const t of aggregated.tables) {
    // handle schema.table or table
    const tid = t.includes('.') ? t : `public.${t}`
    const [schema, name] = tid.split('.')
    const res = await client.query(
      `SELECT to_regclass($1) as exists`,
      [ `${schema}.${name}` ]
    )
    tableResults[t] = !!(res.rows[0] && res.rows[0].exists)
  }

  // Check columns
  const columnResults = {}
  for (const c of aggregated.columns) {
    const tbl = c.table.includes('.') ? c.table.split('.') : ['public', c.table]
    const schema = tbl[0]
    const table = tbl[1] || tbl[0]
    const res = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 AND column_name=$3`,
      [schema, table, c.column]
    )
    columnResults[`${c.table}.${c.column}`] = res.rowCount > 0
  }

  // Check functions
  const functionResults = {}
  for (const fn of aggregated.functions) {
    const short = fn.includes('.') ? fn.split('.')[1] : fn
    const res = await client.query(`SELECT proname FROM pg_proc WHERE proname = $1 LIMIT 1`, [short])
    functionResults[fn] = res.rowCount > 0
  }

  await client.end()

  const report = { tables: tableResults, columns: columnResults, functions: functionResults, byScript: aggregated.byScript }
  console.log(JSON.stringify(report, null, 2))
}

main().catch((e) => { console.error(e); process.exit(1) })
