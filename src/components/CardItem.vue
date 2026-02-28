<script setup lang="ts">
import type { Card, Language } from '../types/card'

const props = defineProps<{
  card: Card
  language: Language
}>()

function getImagePath(card: Card): string {
  return `${import.meta.env.BASE_URL}images/series-${card.series}/${card.image}`
}
</script>

<template>
  <div class="card-item">
    <div class="card-image-wrapper">
      <img
        :src="getImagePath(props.card)"
        :alt="props.card.name.en"
        class="card-image"
        loading="lazy"
      />
    </div>
    <div class="card-info">
      <span class="card-number">#{{ props.card.id }}</span>
      <span class="card-name">{{ props.card.name[props.language] }}</span>
    </div>
  </div>
</template>

<style scoped>
.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.card-item:hover {
  transform: translateY(-4px);
}

.card-image-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.2s ease;
}

.card-item:hover .card-image-wrapper {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.card-image {
  width: 100%;
  height: auto;
  display: block;
}

.card-info {
  margin-top: 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-number {
  font-size: 0.75rem;
  color: #888;
}

.card-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}
</style>
