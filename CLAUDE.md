# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A GitHub userscript built with Vue 3 + TypeScript using [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey). The script runs on `https://github.com/*` and injects Vue components into the page. Vue is loaded as an external global via CDN.

## Commands

- `pnpm dev` — Start dev server (auto-injects userscript into browser via Tampermonkey/Violentmonkey)
- `pnpm build` — Type-check (`vue-tsc -b`) then build to `dist/better-github.user.js`
- `pnpm lint` — Biome linter
- `pnpm format` — Biome formatter (auto-fixes)
- `pnpm preview` — Preview built output

No test framework is configured.

## Code Style (Biome)

- Indent: tabs
- Quotes: double
- Linter: recommended rules enabled
- Import organization: enabled

## Architecture

```
src/
├── main.ts                          # Entry point. Calls initReleaseSorter(), creates <div>, mounts Vue.
├── App.vue                          # Root component. Renders ScrollToTopButton + SettingsPanel > ReleaseSorterSettings.
├── style.css                        # Global reset (#app { all: unset }) + .better-gh-matched highlight style.
├── components/
│   ├── ScrollToTopButton.vue        # Fixed bottom-right scroll-to-top button with progress ring.
│   ├── SettingsPanel.vue            # Reusable fixed bottom-left gear button + slide-up panel. Uses <slot> for content. Only visible on release pages.
│   └── ReleaseSorterSettings.vue    # Release sorter config UI: System / Architecture / Package Type radio groups + keyword preview.
└── utils/
    └── release-sorter.ts            # Core logic: keyword matching, storage (GM_getValue/setValue), DOM sorting/highlighting, platform detection.
```

### Key Design Decisions

- **SettingsPanel separation**: The gear button and panel container (`SettingsPanel.vue`) are decoupled from content (`ReleaseSorterSettings.vue`). To add a new settings section, just insert another component inside `<SettingsPanel>`.
- **Release sorter lives outside Vue**: `initReleaseSorter()` runs before `createApp().mount()` and operates on raw DOM via `sortAndHighlight()`. Vue components call `sortAndHighlight()` after user changes preferences. GitHub uses Turbo for SPA navigation, so `initReleaseSorter()` listens to both `turbo:load` events and a `MutationObserver` on `document.body` to re-run sorting when the page changes.
- **GM grants**: `GM_addStyle`, `GM_getValue`, `GM_setValue` — declared in `vite.config.ts` userscript config.

### Release Sorter Data Flow

1. User selects preferences via `ReleaseSorterSettings.vue` (radio buttons for OS / Arch / Package Type).
2. `setSelectedOs()` / `setSelectedArch()` / `setSelectedPkg()` persist to GM storage.
3. `sortAndHighlight()` rebuilds keyword set from stored preferences, queries `<a href*="/releases/download/">`, scores each `<li>`, reorders DOM, adds `.better-gh-matched` class to top-scoring items.
4. Keyword building merges: `SYSTEM_KEYWORDS[os]` ∪ `ARCH_KEYWORDS[arch]` ∪ `PKG_KEYWORDS[pkg][os]`. Package keywords are per-OS (e.g., `deb` only appears for Linux).

## Conventions

- Vue components use `<script setup lang="ts">` with `<style scoped>`.
- TypeScript strict mode is enabled (`noUnusedLocals`, `noUnusedParameters`).
- No comments unless the "why" is non-obvious.
- Commit messages follow conventional commits (`feat:`, `fix:`, `chore:`, `ci:`, etc.).
