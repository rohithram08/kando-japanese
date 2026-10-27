import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

// Guard: real accounts/passwords must never be committed again (the repo is public).
const ROOTS = ['src', 'backend/src'].map((p) => path.resolve(__dirname, '../../', p))
const SKIP_DIRS = new Set(['node_modules', 'locales', 'data'])

function walk(dir: string, out: string[] = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(full, out) }
    else if (/\.(jsx?|tsx?|json|md)$/.test(e.name)) out.push(full)
  }
  return out
}

describe('no committed credentials', () => {
  const files = ROOTS.flatMap((r) => (fs.existsSync(r) ? walk(r) : []))

  it('has no real-looking personal email addresses in source or tests (use example.com)', () => {
    const offenders: string[] = []
    for (const f of files) {
      if (f.endsWith('noCommittedCredentials.test.ts')) continue
      const hits = fs.readFileSync(f, 'utf8').match(/[\w.+-]+@(gmail|yahoo|outlook|hotmail|icloud)\.com/gi)
      if (hits) offenders.push(`${path.relative(process.cwd(), f)}: ${hits.join(', ')}`)
    }
    expect(offenders).toEqual([])
  })

  it('has no hard-coded sign-in passwords', () => {
    const offenders: string[] = []
    for (const f of files) {
      if (/__tests__|\.test\./.test(f)) continue
      const text = fs.readFileSync(f, 'utf8')
      if (/signIn\(\s*\{[^}]*password:\s*['"`][^'"`]+['"`]/.test(text)) offenders.push(path.relative(process.cwd(), f))
    }
    expect(offenders).toEqual([])
  })
})
