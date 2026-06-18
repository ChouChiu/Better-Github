# AGENTS.md

## Commands

```bash
bun dev         # Dev server with auto-inject via Tampermonkey/Violentmonkey
bun run build   # Type-check (vue-tsc -b) + vite build → dist/better-github.user.js
bun run lint    # Biome linter
bun run format  # Biome formatter (auto-fixes)
```

No test framework. Run `bun run lint` and `bun run build` (includes type-check) before considering work done.

## Key facts

- **Package manager**: bun (lockfile: `bun.lock`). There is also a `pnpm-lock.yaml` — ignore it.
- **Vue is external**: bundled via CDN (`vue.global.prod.js`), not in the output JS. Do not add Vue to the build bundle.
- **Userscript grants**: `GM_addStyle`, `GM_getValue`, `GM_setValue` — declared in `vite.config.ts`. These are the only GM APIs available.
- **Release sorter is DOM-based**: `initReleaseSorter()` in `src/utils/release-sorter.ts` runs before Vue mounts and operates on raw DOM. Vue components call `sortAndHighlight()` to trigger re-sorting after preference changes.
- **GitHub Turbo navigation**: The script listens to `turbo:load` events and uses a `MutationObserver` on `document.body` to re-run sorting on SPA navigation. Both use 100ms debounce.
- **Biome overrides for `.vue` files**: `noUnusedVariables` and `noUnusedImports` are disabled for Vue SFCs (Biome can't parse Vue templates properly).

## Code style

- Tabs for indent, double quotes (enforced by Biome)
- Vue SFCs: `<script setup lang="ts">` + `<style scoped>`
- TypeScript strict: `noUnusedLocals`, `noUnusedParameters` enforced
- No comments unless the "why" is non-obvious
- Conventional commits: `feat:`, `fix:`, `chore:`, `ci:`, etc.

## CI / Release

- **Build CI** (`build.yaml`): runs on every push and PR — `bun install` → `bun run build`. No lint step in CI.
- **Release** (`release.yml`): manual `workflow_dispatch` only. Bump `version` in `package.json` before triggering. Creates a git tag `v{version}` and GitHub release with `dist/*` artifacts.
