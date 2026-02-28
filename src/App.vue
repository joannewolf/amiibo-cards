<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from './composables/useLanguage'
import { useCards } from './composables/useCards'
import CardGrid from './components/CardGrid.vue'
import ViewControls from './components/ViewControls.vue'
import LanguageToggle from './components/LanguageToggle.vue'

const { language, setLanguage } = useLanguage()
const {
  sortedCards,
  groups,
  viewOptions,
  activeViewIndex,
  setViewIndex,
} = useCards(language)

const showBackToTop = ref(false)

function onScroll() {
  showBackToTop.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">Animal Crossing Amiibo Cards</h1>
      <LanguageToggle :language="language" @update:language="setLanguage" />
    </header>

    <main class="app-main">
      <ViewControls
        :view-options="viewOptions"
        :active-index="activeViewIndex"
        @update:active-index="setViewIndex"
      />

      <CardGrid
        :cards="sortedCards"
        :groups="groups"
        :language="language"
      />
    </main>

    <Transition name="fade">
      <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop" aria-label="Back to top">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4L4 12h4v4h4v-4h4L10 4z" fill="currentColor"/>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #3a7d3e;
  margin: 0;
}

.app-main {
  min-height: 60vh;
}

.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #7bc67e;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.15s ease;
  z-index: 20;
}

.back-to-top:hover {
  background: #5aa85d;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
