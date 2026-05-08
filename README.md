# Better GitHub
<p>
    <a href="https://github.com/ChouChiu/Better-Github/releases/latest/download/better-github.user.js">
        <img src="https://img.shields.io/badge/GithubRaw-安装-black" alt="从 Github 安装"></a>
    <a href="https://greasyfork.org/zh-CN/scripts/577175">
        <img src="https://img.shields.io/badge/GreasyFork-安装-red" alt="从 GreasyFork 安装"></a>
</p>

一个提升 GitHub 浏览体验的用户脚本，基于 [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey) + Vue 3 + TypeScript 构建。

## 功能

- **返回顶部** — 右下角圆形按钮，外围带有圆环形进度条，实时显示滚动进度，点击后平滑滚动到顶部。
- **Release 文件排序与高亮** — 在 Release 页面根据用户偏好（系统、架构、安装包类型）智能排序下载文件，匹配度最高的文件高亮置顶。左下角齿轮按钮打开设置面板，可随时切换偏好。

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器（自动注入用户脚本到浏览器）
pnpm dev

# 构建生产版本
pnpm build

# 代码检查 & 格式化
pnpm lint
pnpm format
```

## 项目结构

```
src/
├── main.ts                          # 入口，初始化 release sorter 并挂载 Vue
├── App.vue                          # 根组件
├── style.css                        # 全局样式 + 高亮样式
├── components/
│   ├── ScrollToTopButton.vue        # 返回顶部按钮
│   ├── SettingsPanel.vue            # 通用设置面板（齿轮按钮 + 弹出面板容器）
│   └── ReleaseSorterSettings.vue    # Release 排序设置内容
└── utils/
    └── release-sorter.ts            # 排序/高亮核心逻辑与存储
```
