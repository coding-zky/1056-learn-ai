---
title: Playground
layout: false
---

<script setup>
import { defineAsyncComponent } from 'vue'

// 会话数据走 localStorage、聊天走 useChat，均只能在浏览器求值，故懒加载 + ClientOnly
const PlaygroundApp = defineAsyncComponent(
  () => import('./.vitepress/theme/components/PlaygroundApp.vue'),
)
</script>

<ClientOnly>
  <PlaygroundApp />
</ClientOnly>
