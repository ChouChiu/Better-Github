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

- `src/main.ts` — Entry point. Creates a `<div>`, appends it to `document.body`, mounts the Vue app.
- `src/App.vue` — Root component, renders feature components.
- `src/components/` — Feature components (e.g., `ScrollToTopButton.vue`).
- `src/style.css` — Minimal global reset (`#app { all: unset }` to avoid GitHub style conflicts).
- `vite.config.ts` — Vite + Vue plugin + monkey plugin config. Vue is externalized via `cdn.jsdelivr`.

## Conventions

- Vue components use `<script setup lang="ts">` with `<style scoped>`.
- TypeScript strict mode is enabled (`noUnusedLocals`, `noUnusedParameters`).
- No comments unless the "why" is non-obvious.
- Commit messages follow conventional commits (`feat:`, `fix:`, `chore:`, `ci:`, etc.).
