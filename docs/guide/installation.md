---
title: 安装
---

# 安装

按需安装，想用哪块装哪块。

## 安装包

```bash
# 基础：core（事件契约 + composables）
pnpm add @ai-chat-ui/core

# 渲染组件：ui（自动带上 core + reka-ui）
pnpm add @ai-chat-ui/ui

# 后端适配器：adapters（自动带上 core + ai + @ai-sdk/vue）
pnpm add @ai-chat-ui/adapters
```

## peer 依赖

三个包都以 `vue`（`^3.4.0`）为 peer 依赖，需由你自行安装：

```bash
pnpm add vue
```

其余依赖会随包自动安装：`@ai-chat-ui/ui` 自带 `reka-ui`，`@ai-chat-ui/adapters` 自带 `ai` 与 `@ai-sdk/vue`。

::: warning 早期阶段
项目当前处于 Phase 1，尚未发布到 npm。以上命令为最终目标形态，发布前请通过 monorepo 内的 workspace 引用各包。
:::
