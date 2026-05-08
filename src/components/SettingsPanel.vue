<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { isReleasePage } from "../utils/release-sorter";

const open = ref(false);
const onReleasePage = ref(isReleasePage());
const settingsRef = ref<HTMLElement>();

function checkPage() {
	onReleasePage.value = isReleasePage();
}

function onClickOutside(e: MouseEvent) {
	if (open.value && settingsRef.value && !settingsRef.value.contains(e.target as Node)) {
		open.value = false;
	}
}

onMounted(() => {
	document.addEventListener("turbo:load", checkPage);
	window.addEventListener("popstate", checkPage);
	document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("turbo:load", checkPage);
	window.removeEventListener("popstate", checkPage);
	document.removeEventListener("click", onClickOutside);
});
</script>

<template>
  <div v-if="onReleasePage" ref="settingsRef" class="sp-settings">
    <Transition name="sp-panel">
      <div v-if="open" class="sp-panel" @wheel.stop>
        <slot />
      </div>
    </Transition>

    <button
      class="sp-toggle"
      :class="{ 'sp-toggle--active': open }"
      aria-label="Settings"
      @click="open = !open"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.sp-settings {
  position: fixed;
  bottom: 88px;
  right: 32px;
  z-index: 9998;
}

.sp-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(31, 35, 40, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: background 0.2s, color 0.2s;
  color: #8b949e;
}

.sp-toggle:hover,
.sp-toggle--active {
  background: rgba(31, 35, 40, 1);
  color: #e6edf3;
}

.sp-panel {
  position: absolute;
  bottom: 56px;
  right: 0;
  width: 280px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.sp-panel-enter-active,
.sp-panel-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.sp-panel-enter-from,
.sp-panel-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.96);
}
</style>
