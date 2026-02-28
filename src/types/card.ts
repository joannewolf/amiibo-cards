export interface CardName {
  en: string
  ja: string
  'zh-Hant': string
}

export type HandSign = 'rock' | 'paper' | 'scissors'

export type Personality =
  | 'Cranky'
  | 'Jock'
  | 'Lazy'
  | 'Normal'
  | 'Peppy'
  | 'Smug'
  | 'Snooty'
  | 'Sisterly'
  | null // for special/NPC characters

export interface I18nString {
  en: string
  ja: string
  'zh-Hant': string
}

export interface Card {
  id: string
  series: number
  type: 'special' | 'normal'
  name: CardName
  species: I18nString
  gender: 'Male' | 'Female' | null
  birthday: string | null // "MM/DD" format
  diceValue: number | null
  handSign: HandSign | null
  backgroundColor: string | null
  image: string
}

export interface ViewOption {
  label: string
  groupBy: string | null
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export type Language = 'en' | 'ja' | 'zh-Hant'
