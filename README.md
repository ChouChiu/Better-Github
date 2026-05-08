# Better GitHub

一个提升 GitHub 浏览体验的用户脚本，基于 [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey) + Vue 3 + TypeScript 构建。

## 功能

- **返回顶部** — 圆形按钮，外围带有圆环形进度条，实时显示滚动进度，点击后平滑滚动到顶部。

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（自动注入用户脚本到浏览器）
pnpm dev

# 构建生产版本
pnpm build
```

## 安装

1. 安装用户脚本管理器，如 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)。
2. 构建脚本（`pnpm build`），然后在管理器中安装 `dist/better-github.user.js`。
