import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monkey, { cdn } from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		monkey({
			entry: "src/main.ts",
			userscript: {
				icon: "https://vitejs.dev/logo.svg",
				namespace: "npm/vite-plugin-monkey",
				match: ["https://github.com/*"],
				grant: ["GM_addStyle", "GM_getValue", "GM_setValue"],
				license: "GPL-3.0-or-later",
				homepageURL: "https://github.com/ChouChiu/Better-Github",
				supportURL: "https://github.com/ChouChiu/Better-Github/issues",
			},
			build: {
				externalGlobals: {
					vue: cdn.jsdelivr("Vue", "dist/vue.global.prod.js"),
				},
			},
		}),
	],
});
