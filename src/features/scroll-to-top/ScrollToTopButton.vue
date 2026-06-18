<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const CIRCUMFERENCE = 2 * Math.PI * 18;

const scrollTop = ref(0);
const scrollHeight = ref(0);
const clientHeight = ref(0);

const visible = computed(() => scrollTop.value > 100);

const progress = computed(() => {
	if (scrollHeight.value <= clientHeight.value) return 0;
	return (scrollTop.value / (scrollHeight.value - clientHeight.value)) * 100;
});

const strokeDashoffset = computed(() => {
	return CIRCUMFERENCE - (progress.value / 100) * CIRCUMFERENCE;
});

let ticking = false;

function onScroll() {
	if (ticking) return;
	ticking = true;
	requestAnimationFrame(() => {
		scrollTop.value = document.documentElement.scrollTop;
		scrollHeight.value = document.documentElement.scrollHeight;
		clientHeight.value = document.documentElement.clientHeight;
		ticking = false;
	});
}

function scrollToTop() {
	window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <Transition name="fade">
    <button
      v-show="visible"
      class="scroll-to-top"
      aria-label="Scroll to top"
      @click="scrollToTop"
    >
      <svg class="progress-ring" width="44" height="44">
        <circle
          class="progress-ring__bg"
          stroke-width="2.5"
          fill="transparent"
          r="18"
          cx="22"
          cy="22"
        />
        <circle
          class="progress-ring__circle"
          stroke-width="2.5"
          fill="transparent"
          r="18"
          cx="22"
          cy="22"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="strokeDashoffset"
        />
      </svg>
      <svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
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
  transition: background 0.2s;
  z-index: 9999;
  color: #e6edf3;
}

.scroll-to-top:hover {
  background: rgba(31, 35, 40, 1);
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
}

.progress-ring__bg {
  stroke: rgba(110, 118, 129, 0.25);
}

.progress-ring__circle {
  stroke: #58a6ff;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 22px 22px;
  transition: stroke-dashoffset 0.08s linear;
}

.arrow {
  position: relative;
  z-index: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
