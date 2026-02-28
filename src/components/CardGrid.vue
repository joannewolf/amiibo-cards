<script setup lang="ts">
import { computed } from 'vue'
import type { Card, Language } from '../types/card'
import CardItem from './CardItem.vue'

const props = defineProps<{
  cards: Card[]
  groups: Map<string, Card[]> | null
  language: Language
}>()

const groupEntries = computed(() => {
  if (!props.groups) return []
  return [...props.groups.entries()].map(([name, cards], i) => ({ name, cards, index: i }))
})

function scrollToGroup(index: number) {
  const el = document.getElementById(`group-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <!-- Grouped view -->
  <div v-if="groups" class="grouped-view">
    <nav class="group-nav">
      <button
        v-for="entry in groupEntries"
        :key="entry.index"
        class="group-nav-btn"
        @click="scrollToGroup(entry.index)"
      >
        {{ entry.name }}
        <span class="group-nav-count">{{ entry.cards.length }}</span>
      </button>
    </nav>

    <div v-for="entry in groupEntries" :key="entry.index" :id="`group-${entry.index}`" class="card-group">
      <h2 class="group-header">{{ entry.name }}</h2>
      <TransitionGroup name="card-list" tag="div" class="card-grid">
        <CardItem
          v-for="card in entry.cards"
          :key="card.id"
          :card="card"
          :language="language"
        />
      </TransitionGroup>
    </div>
  </div>

  <!-- Flat view -->
  <TransitionGroup v-else name="card-list" tag="div" class="card-grid">
    <CardItem
      v-for="card in cards"
      :key="card.id"
      :card="card"
      :language="language"
    />
  </TransitionGroup>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  padding: 0;
}

.grouped-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.group-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 16px;
  background: #f0ede4;
  border-radius: 10px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.group-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid #d4cfc4;
  background: white;
  border-radius: 14px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #555;
}

.group-nav-btn:hover {
  border-color: #7bc67e;
  color: #3a7d3e;
  background: #edf7ee;
}

.group-nav-count {
  font-size: 0.6875rem;
  color: #999;
  font-weight: 600;
}

.group-header {
  font-size: 1.25rem;
  font-weight: 700;
  color: #5a8f5c;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #d4e8d5;
}

.card-group {
  scroll-margin-top: 60px;
}

/* FLIP animation for card movement */
.card-list-move,
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.5s ease;
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.card-list-leave-active {
  position: absolute;
}

@media (max-width: 600px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
  }
}
</style>
