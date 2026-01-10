import parser from '../lib/analysis/parser'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
}

async function run() {
  console.log('Running parser tests...')

  // Test stripCodeFences
  const fenced = '```json\n{"a":1}\n```'
  const stripped = parser.stripCodeFences(fenced)
  assert(stripped.includes('{"a":1}'), 'stripCodeFences should remove fences')

  // Test extractJsonFromText
  const text = 'Some preamble {"k": "v"} trailing text'
  const extracted = parser.extractJsonFromText(text)
  assert(extracted === '{"k": "v"}', 'extractJsonFromText should return JSON substring')

  // Test validation (valid)
  const valid = { tender_summary: { title: 'X' }, formFields: [] }
  const vres = parser.validateJsonAgainstSchema(valid)
  assert(vres.valid === true, 'validateJsonAgainstSchema should accept minimal valid object')

  // Test validation (invalid)
  const invalid = { some: 'thing' }
  const inv = parser.validateJsonAgainstSchema(invalid)
  assert(inv.valid === false, 'validateJsonAgainstSchema should reject invalid object')

  console.log('All parser tests passed')
}

run().catch((e) => { console.error(e); process.exit(1) })
