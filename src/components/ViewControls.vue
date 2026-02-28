<script setup lang="ts">
import type { ViewOption } from '../types/card'

defineProps<{
  viewOptions: ViewOption[]
  activeIndex: number
}>()

const emit = defineEmits<{
  'update:activeIndex': [index: number]
}>()
</script>

<template>
  <div class="view-controls">
    <label>View by</label>
    <div class="button-group">
      <button
        v-for="(option, i) in viewOptions"
        :key="option.label"
        :class="['control-btn', { active: activeIndex === i }]"
        @click="emit('update:activeIndex', i)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.view-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 16px;
  background: #f8f6f0;
  border-radius: 12px;
  margin-bottom: 24px;
}

.view-controls label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #555;
  min-width: 60px;
}

.button-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 6px 14px;
  border: 1.5px solid #d4cfc4;
  background: white;
  border-radius: 20px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #555;
}

.control-btn:hover {
  border-color: #7bc67e;
  color: #333;
}

.control-btn.active {
  background: #7bc67e;
  border-color: #7bc67e;
  color: white;
  font-weight: 600;
}
</style>
