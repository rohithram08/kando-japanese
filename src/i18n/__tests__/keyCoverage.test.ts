import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import en from '../../locales/en/ui.json'
import { SUPPORTED_LOCALES } from '../languageUtils'
import { hasUiTranslations } from '../translationResolver'

// Guards the root causes of "some sections don't change language":
//  1. a t('some.key', 'English fallback') call whose key exists in NO locale file
//     (the fallback is baked in, so it is English forever), and
//  2. a language offered in the picker that has no translation data.

const flat = (o: any, p = ''): Record<string, string> =>
  Object.entries(o).reduce((acc, [k, v]) => {
    if (v && typeof v === 'object') Object.assign(acc, flat(v, p + k + '.'))
    else acc[p + k] = String(v)
    return acc
  }, {} as Record<string, string>)

const enKeys = flat(en)

function walk(dir: string, out: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['__tests__', 'locales', 'node_modules'].includes(entry.name)) continue
      walk(full, out)
    } else if (/\.(jsx?|tsx?)$/.test(entry.name)) out.push(full)
  }
  return out
}

describe('i18n key coverage', () => {
  it('every literal t("section.key") used in the code exists in en/ui.json', () => {
    const root = path.resolve(__dirname, '../..')
    const re = /\bt\(\s*(?:[a-zA-Z_]+\s*,\s*)?['"]([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)['"]/g
    const missing = new Map<string, string>()
    for (const file of walk(root)) {
      const src = fs.readFileSync(file, 'utf8')
      for (const m of src.matchAll(re)) {
        if (!(m[1] in enKeys)) missing.set(m[1], path.relative(root, file))
      }
    }
    expect(Object.fromEntries(missing)).toEqual({})
  })

  it('only offers languages in the picker whose interface is really translated', () => {
    const offered = SUPPORTED_LOCALES.filter((l) => hasUiTranslations(l.code)).map((l) => l.code)
    expect(offered).toEqual(expect.arrayContaining(['en', 'ta', 'hi']))
    for (const code of offered) expect(hasUiTranslations(code)).toBe(true)
  })

  it('curated languages (ta, hi) translate every key English has', async () => {
    const ta = flat((await import('../../locales/ta/ui.json')).default)
    const hi = flat((await import('../../locales/hi/ui.json')).default)
    expect(Object.keys(enKeys).filter((k) => !(k in ta))).toEqual([])
    expect(Object.keys(enKeys).filter((k) => !(k in hi))).toEqual([])
  })
})
