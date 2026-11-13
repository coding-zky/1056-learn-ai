---
title: Playground
---

# Playground

在浏览器里编辑并运行 Vue 单文件组件。

<script setup>
import { defineAsyncComponent } from 'vue'

// @vue/repl 顶层会 import css，SSR 下 Node 无法加载 .css，故懒加载 + ClientOnly 只在浏览器求值
const Playground = defineAsyncComponent(
  () => import('./.vitepress/theme/components/Playground.vue'),
)
</script>

<ClientOnly>
  <Playground />
</ClientOnly>

::: tip 轻量版说明
当前内嵌 Playground 为轻量版，支持编辑**纯 Vue** 单文件组件（运行时依赖 CDN 的 `vue`）。真实的 `@ai-chat-ui/*` 组件交互请查看[组件](/component/)文档页；如需在本地跑真实组件，可执行 `pnpm dev` 打开 playground SPA。
:::
