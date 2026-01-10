#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const scriptsDir = path.resolve('.', 'scripts')
if (!fs.existsSync(scriptsDir)) {
  console.error('scripts directory not found:', scriptsDir)
  process.exit(1)
}

const files = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.sql')).sort()
const patterns = [
  /^\s*CREATE\s+TABLE\b/i,
  /^\s*ALTER\s+TABLE\b/i,
  /^\s*CREATE\s+INDEX\b/i,
  /^\s*CREATE\s+FUNCTION\b/i,
  /^\s*CREATE\s+SEQUENCE\b/i,
  /^\s*COMMENT\s+ON\b/i,
  /^\s*DROP\s+TABLE\b/i,
  /^\s*INSERT\s+INTO\b/i
]

const report = []
for (const file of files) {
  const p = path.join(scriptsDir, file)
  const content = fs.readFileSync(p, 'utf8')
  const lines = content.split(/\r?\n/)
  const statements = []

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trim()
    if (!line) continue
    for (const pat of patterns) {
      if (pat.test(line)) {
        let stmt = line
        let j = i + 1
        while (!stmt.trim().endsWith(';') && j < lines.length) {
          stmt += ' ' + lines[j].trim()
          j++
        }
        statements.push(stmt.replace(/\s+/g, ' ').trim())
        i = j - 1
        break
      }
    }
  }

  report.push({ file, statements })
}

console.log(JSON.stringify(report, null, 2))
