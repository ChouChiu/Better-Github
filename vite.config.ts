import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import monkey, { cdn } from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		monkey({
			entry: "src/main.ts",
			userscript: {
				name: "Better Github",
				description: "一个提升 GitHub 浏览体验的用户脚本",
				icon: "https://github.com/favicon.ico",
				namespace: "npm/vite-plugin-monkey",
				match: ["https://github.com/*"],
				grant: ["GM_addStyle", "GM_getValue", "GM_setValue"],
				license: "GPL-3.0-or-later",
				homepageURL: "https://github.com/ChouChiu/Better-Github",
				supportURL: "https://github.com/ChouChiu/Better-Github/issues",
				downloadURL:
					"https://github.com/ChouChiu/Better-Github/releases/latest/download/better-github.user.js",
				updateURL:
					"https://github.com/ChouChiu/Better-Github/releases/latest/download/better-github.user.js",
			},
			build: {
				externalGlobals: {
					vue: cdn.jsdelivr("Vue", "dist/vue.global.prod.js"),
				},
			},
		}),
	],
});
