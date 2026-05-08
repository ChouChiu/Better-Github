<script setup lang="ts">
import { ref, computed } from "vue";
import {
	OS_OPTIONS,
	OS_LABELS,
	ARCH_OPTIONS,
	ARCH_LABELS,
	PKG_OPTIONS,
	PKG_LABELS,
	type OsOption,
	type ArchOption,
	type PkgOption,
	getSelectedOs,
	setSelectedOs,
	getSelectedArch,
	setSelectedArch,
	getSelectedPkg,
	setSelectedPkg,
	detectPlatform,
	detectArch,
	sortAndHighlight,
	getKeywordsPreview,
} from "../utils/release-sorter";

const selectedOs = ref<OsOption>(getSelectedOs());
const selectedArch = ref<ArchOption>(getSelectedArch());
const selectedPkg = ref<PkgOption>(getSelectedPkg());

const resolvedPlatform = computed(() => {
	return selectedOs.value === "auto" ? detectPlatform() : selectedOs.value;
});

const resolvedArch = computed(() => {
	return selectedArch.value === "auto" ? detectArch() : selectedArch.value;
});

const keywords = computed(() => {
	return getKeywordsPreview(
		selectedOs.value,
		selectedArch.value,
		selectedPkg.value,
	);
});

function selectOs(os: OsOption) {
	selectedOs.value = os;
	setSelectedOs(os);
	sortAndHighlight();
}

function selectArch(arch: ArchOption) {
	selectedArch.value = arch;
	setSelectedArch(arch);
	sortAndHighlight();
}

function selectPkg(pkg: PkgOption) {
	selectedPkg.value = pkg;
	setSelectedPkg(pkg);
	sortAndHighlight();
}
</script>

<template>
  <div class="rss-header">Release Sorter</div>

  <div class="rss-section">
    <div class="rss-label">System</div>
    <div class="rss-options">
      <label
        v-for="os in OS_OPTIONS"
        :key="os"
        class="rss-option"
        :class="{ 'rss-option--active': selectedOs === os }"
      >
        <input
          type="radio"
          :value="os"
          :checked="selectedOs === os"
          @change="selectOs(os)"
        />
        <span class="rss-option__label">{{ OS_LABELS[os] }}</span>
        <span
          v-if="os === 'auto'"
          class="rss-option__hint"
        >({{ OS_LABELS[detectPlatform()] }})</span>
      </label>
    </div>
  </div>

  <div class="rss-section">
    <div class="rss-label">Architecture</div>
    <div class="rss-options">
      <label
        v-for="arch in ARCH_OPTIONS"
        :key="arch"
        class="rss-option"
        :class="{ 'rss-option--active': selectedArch === arch }"
      >
        <input
          type="radio"
          :value="arch"
          :checked="selectedArch === arch"
          @change="selectArch(arch)"
        />
        <span class="rss-option__label">{{ ARCH_LABELS[arch] }}</span>
        <span
          v-if="arch === 'auto'"
          class="rss-option__hint"
        >({{ ARCH_LABELS[detectArch()] }})</span>
      </label>
    </div>
  </div>

  <div class="rss-section">
    <div class="rss-label">Package Type</div>
    <div class="rss-options">
      <label
        v-for="pkg in PKG_OPTIONS"
        :key="pkg"
        class="rss-option"
        :class="{ 'rss-option--active': selectedPkg === pkg }"
      >
        <input
          type="radio"
          :value="pkg"
          :checked="selectedPkg === pkg"
          @change="selectPkg(pkg)"
        />
        <span class="rss-option__label">{{ PKG_LABELS[pkg] }}</span>
      </label>
    </div>
  </div>

  <div class="rss-section">
    <div class="rss-label">
      Keywords ({{ OS_LABELS[resolvedPlatform] }} · {{ ARCH_LABELS[resolvedArch] }} · {{ PKG_LABELS[selectedPkg] }})
    </div>
    <div class="rss-keywords">
      <span
        v-for="kw in keywords"
        :key="kw"
        class="rss-keyword"
      >{{ kw }}</span>
    </div>
  </div>
</template>

<style scoped>
.rss-header {
  font-size: 14px;
  font-weight: 600;
  color: #e6edf3;
  margin-bottom: 10px;
}

.rss-section {
  margin-bottom: 8px;
}

.rss-section:last-child {
  margin-bottom: 0;
}

.rss-label {
  font-size: 11px;
  font-weight: 500;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.rss-options {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.rss-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 13px;
  color: #c9d1d9;
}

.rss-option:hover {
  background: rgba(177, 186, 196, 0.08);
}

.rss-option--active {
  background: rgba(88, 166, 255, 0.12);
  color: #58a6ff;
}

.rss-option input {
  accent-color: #58a6ff;
  margin: 0;
}

.rss-option__label {
  flex: 1;
}

.rss-option__hint {
  font-size: 11px;
  color: #8b949e;
}

.rss-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.rss-keyword {
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(110, 118, 129, 0.15);
  color: #8b949e;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
}
</style>
