/**
 * Build cards.json from data/cards.tsv + i18n lookup files.
 *
 * Usage: npx tsx scripts/build-card-data.ts
 *
 * Edit data/cards.tsv to add/modify card data, then re-run this script.
 * Edit data/species-i18n.json or data/personality-i18n.json for translations.
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

type I18nString = { en: string; ja: string; 'zh-Hant': string }
type I18nLookup = Record<string, { ja: string; 'zh-Hant': string }>

interface Card {
  id: string
  series: number
  type: 'special' | 'normal'
  name: I18nString
  species: I18nString
  gender: 'Male' | 'Female' | null
  birthday: string | null
  diceValue: number | null
  handSign: 'rock' | 'paper' | 'scissors' | null
  backgroundColor: string | null
  image: string
}

function parseSeries(num: number): number {
  if (num <= 100) return 1
  if (num <= 200) return 2
  if (num <= 300) return 3
  if (num <= 400) return 4
  return 5
}

function isSpecial(num: number): boolean {
  const series = parseSeries(num)
  if (series <= 4) return (num - 1) % 100 < 17
  // Series 5: 401-424 are special
  return num <= 424
}

function toI18n(en: string, lookup: I18nLookup): I18nString {
  const trans = lookup[en]
  return {
    en,
    ja: trans?.ja ?? en,
    'zh-Hant': trans?.['zh-Hant'] ?? en,
  }
}

const root = join(import.meta.dirname, '..')
const tsvPath = join(root, 'data', 'cards.tsv')
const outPath = join(root, 'src', 'data', 'cards.json')

const speciesI18n: I18nLookup = JSON.parse(readFileSync(join(root, 'data', 'species-i18n.json'), 'utf8'))

const tsv = readFileSync(tsvPath, 'utf8')
const lines = tsv.trim().split('\n')
const header = lines[0].split('\t')

const cards: Card[] = lines.slice(1).map(line => {
  const cols = line.split('\t')
  const row: Record<string, string> = {}
  header.forEach((key, i) => { row[key] = cols[i] ?? '' })

  const num = parseInt(row.id)
  return {
    id: row.id,
    series: parseSeries(num),
    type: isSpecial(num) ? 'special' as const : 'normal' as const,
    name: {
      en: row.en,
      ja: row.ja,
      'zh-Hant': row['zh-Hant'],
    },
    species: toI18n(row.species, speciesI18n),
    gender: (row.gender as 'Male' | 'Female') || null,
    birthday: row.birthday || null,
    diceValue: row.diceValue ? parseInt(row.diceValue) : null,
    handSign: row.handSign ? row.handSign as 'rock' | 'paper' | 'scissors' : null,
    backgroundColor: row.backgroundColor || null,
    image: `${row.id}.png`,
  }
})

writeFileSync(outPath, JSON.stringify(cards, null, 2))
console.log(`Wrote ${cards.length} cards to ${outPath}`)
