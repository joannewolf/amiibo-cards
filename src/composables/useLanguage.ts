import { ref } from 'vue'
import type { Language } from '../types/card'

const language = ref<Language>('en')

const languageLabels: Record<Language, string> = {
  en: 'English',
  ja: '日本語',
  'zh-Hant': '繁體中文',
}

export function useLanguage() {
  function setLanguage(lang: Language) {
    language.value = lang
  }

  return {
    language,
    languageLabels,
    setLanguage,
  }
}
