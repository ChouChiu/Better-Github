<script setup lang="ts">
import ReleaseSorterSettings from "./features/release-sorter/ReleaseSorterSettings.vue";
import ScrollToTopButton from "./features/scroll-to-top/ScrollToTopButton.vue";
import SettingsPanel from "./shared/components/SettingsPanel.vue";
</script>

<template>
  <ScrollToTopButton />
  <SettingsPanel>
    <ReleaseSorterSettings />
  </SettingsPanel>
</template>
