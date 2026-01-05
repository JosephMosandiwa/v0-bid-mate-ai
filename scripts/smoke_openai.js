const fs = require('fs')
const path = require('path')

function loadEnv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  const lines = text.split(/\r?\n/)
  const env = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx)
    const val = trimmed.slice(idx + 1)
    env[key] = val
  }
  return env
}

async function main() {
  try {
    const repoRoot = path.resolve(__dirname, '..')
    const envPath = path.join(repoRoot, '.env.local')
    if (!fs.existsSync(envPath)) {
      console.error('.env.local not found at', envPath)
      process.exit(2)
    }

    const env = loadEnv(envPath)
    const key = env.OPENAI_API_KEY
    if (!key) {
      console.error('OPENAI_API_KEY not found in .env.local')
      process.exit(2)
    }

    console.log('Using OPENAI_API_KEY from .env.local (masked):', key ? (key.slice(0,6) + '...' ) : 'NONE')

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say hello and return a short JSON: {"ok": true}' }],
        max_tokens: 200,
        temperature: 0.0,
      }),
    })

    const text = await res.text()
    console.log('Status:', res.status)
    try {
      const json = JSON.parse(text)
      console.log('Response JSON:', JSON.stringify(json, null, 2))
    } catch (e) {
      console.log('Response text:', text.substring(0, 1000))
    }
  } catch (err) {
    console.error('Smoke test failed:', err)
    process.exit(1)
  }
}

main()
