<script setup lang="ts">
import type { Language } from '../types/card'

defineProps<{
  language: Language
}>()

const emit = defineEmits<{
  'update:language': [lang: Language]
}>()

const languages: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'ja', label: '日本語' },
  { value: 'zh-Hant', label: '繁中' },
]
</script>

<template>
  <div class="language-toggle">
    <button
      v-for="lang in languages"
      :key="lang.value"
      :class="['lang-btn', { active: language === lang.value }]"
      @click="emit('update:language', lang.value)"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<style scoped>
.language-toggle {
  display: flex;
  gap: 4px;
  background: #eee;
  border-radius: 8px;
  padding: 3px;
}

.lang-btn {
  padding: 4px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #666;
}

.lang-btn:hover {
  color: #333;
}

.lang-btn.active {
  background: white;
  color: #333;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
