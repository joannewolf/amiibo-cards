import { ref, computed } from 'vue'
import type { Card, ViewOption, Language } from '../types/card'
import cardsData from '../data/cards.json'
import viewOptionsData from '../../data/view-options.json'

const cards = ref<Card[]>(cardsData as Card[])
const viewOptions = viewOptionsData as ViewOption[]
const activeViewIndex = ref(0)

const activeView = computed(() => viewOptions[activeViewIndex.value])

function getCardField(card: Card, field: string, lang: Language): string | number | null {
  switch (field) {
    case 'id': return card.id
    case 'name': return card.name[lang]
    case 'species': return card.species[lang]
    case 'birthday': return card.birthday
    case 'diceValue': return card.diceValue
    case 'series': return card.series
    case 'gender': return card.gender
    case 'handSign': return card.handSign
    case 'backgroundColor': return card.backgroundColor
    default: return (card as Record<string, unknown>)[field] as string | number | null
  }
}

function compareCards(a: Card, b: Card, field: string, order: 'asc' | 'desc', lang: Language): number {
  const av = getCardField(a, field, lang)
  const bv = getCardField(b, field, lang)

  let result: number
  if (av == null && bv == null) result = 0
  else if (av == null) result = 1
  else if (bv == null) result = -1
  else if (typeof av === 'number' && typeof bv === 'number') result = av - bv
  else result = String(av).localeCompare(String(bv), lang)

  return order === 'asc' ? result : -result
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getBirthdayMonth(card: Card): number | null {
  if (!card.birthday) return null
  return parseInt(card.birthday.split('/')[0])
}

function getGroupLabel(card: Card, field: string, lang: Language): string {
  switch (field) {
    case 'series': return `Series ${card.series}`
    case 'diceValue': return card.diceValue != null ? `Dice: ${card.diceValue}` : 'None'
    case 'birthdayMonth': {
      const month = getBirthdayMonth(card)
      return month != null ? MONTH_NAMES[month - 1] : 'None'
    }
    case 'species': return card.species[lang]
    default: {
      const val = getCardField(card, field, lang)
      return val != null ? String(val) : 'None'
    }
  }
}

function getGroupSortKey(card: Card, field: string): string | number {
  switch (field) {
    case 'birthdayMonth': return getBirthdayMonth(card) ?? 99
    case 'diceValue': return card.diceValue ?? 99
    case 'series': return card.series
    // Sort groups by English key for stable ordering across language switches
    case 'species': return card.species.en
    default: return getGroupLabel(card, field, 'en')
  }
}

export function useCards(language: { value: Language }) {
  const sortedCards = computed(() => {
    const view = activeView.value
    const sorted = [...cards.value]

    if (view.groupBy) {
      sorted.sort((a, b) => {
        const ga = getGroupSortKey(a, view.groupBy!)
        const gb = getGroupSortKey(b, view.groupBy!)
        if (ga !== gb) {
          if (typeof ga === 'number' && typeof gb === 'number') return ga - gb
          return String(ga).localeCompare(String(gb))
        }
        return compareCards(a, b, view.sortBy, view.sortOrder, language.value)
      })
    } else {
      sorted.sort((a, b) => compareCards(a, b, view.sortBy, view.sortOrder, language.value))
    }

    return sorted
  })

  const groups = computed(() => {
    const view = activeView.value
    if (!view.groupBy) return null

    const map = new Map<string, Card[]>()
    for (const card of sortedCards.value) {
      const key = getGroupLabel(card, view.groupBy, language.value)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(card)
    }
    return map
  })

  function setViewIndex(index: number) {
    activeViewIndex.value = index
  }

  return {
    cards,
    sortedCards,
    groups,
    viewOptions,
    activeViewIndex,
    activeView,
    setViewIndex,
  }
}
