# 提示词

此文件展示了构建次项目时的部分提示词以供参考

## 返回最顶

为一个旨在提升GitHub浏览体验的用户脚本，添加一个滚动到顶部的按钮。要求：

- 仅当页面向下滚动时，按钮才显示，否则隐藏。
- 按钮形状为圆形。
- 按钮外围有一个圆环形的进度条，实时显示当前页面的滚动进度（从页面顶部到文档总高度）。
- 按钮点击后，页面平滑滚动到顶部。
- 使用TypeScript编写，使用的是vite-plugin-monkey的vue-ts模板：https://github.com/lisonge/vite-plugin-monkey/blob/main/packages/create-monkey/template-vue-ts

## Release Sort

添加增强Release页面的文件排序与高亮功能。具体需求如下：

1. **核心逻辑**：根据文件名中出现的系统、架构、后缀名关键词，计算每个文件匹配到的关键词数量（来自用户预设的组合）。将匹配数量最多的文件置于列表最顶部，并对其应用高亮样式（如背景色或字体加粗）。

2. **关键词分类**（每个系统单独一组，文件名匹配时不区分大小写）：
   - **Windows**：win, windows, x64, x86, exe, msi, msix, zip
   - **macOS**：mac, macos, x64, x86, arm, arm64, dmg, pkg, zip
   - **Linux**：linux, x64, x86, arm, arm64, deb, appimage, rpm, zip
   - **Android**：android, apk, universe, universal, arm64-v8a, armeabi-v7a
   - **iOS**：ios, ipa

3. **用户预设选择**：允许用户通过脚本界面或配置选择一个预设组合，预设包含三个维度：
   - **系统**（如Windows / macOS / Linux / Android / iOS）
   - **架构**（如x64 / x86 / arm64 / arm / universal）
   - **偏好的安装包类型**（如exe, dmg, deb, apk, ipa等）

   脚本根据所选预设，优先匹配对应系统的关键词，并将架构和后缀纳入匹配计数。若同一文件匹配多个预设关键词（例如文件名同时包含linux和x64），则累加匹配数量。

4. **排序规则**：匹配数量多的文件排前面；若数量相同，保持原有顺序不变。高亮仅应用于匹配到至少一个关键词的文件（根据预设），且高亮样式需醒目但不过度干扰（如浅色背景）。

5. **适用页面**：仅对GitHub仓库的Releases页面生效（URL匹配 `github.com/*/releases` 或具体Release详情页）。脚本应在页面加载完成后自动执行排序与高亮操作。

## 自述文件

使用中文修改 README