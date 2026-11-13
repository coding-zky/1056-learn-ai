---
title: Chat
---

# Chat 聊天容器

聊天容器，接入 `ChatProvider` 事件流，内部基于 `useChat` 提供文本、工具调用、流式状态与开始 / 停止控制。事件契约详见[后端无关](/guide/provider)。

## 基础用法

点击「发送」后，Mock Provider 按时间顺序推送 `thinking → tool-call → text-delta → done` 事件。

<script setup>
import MockProviderChat from '../examples/chat/mock-provider.vue'
import MockProviderChatRaw from '../examples/chat/mock-provider.vue?raw'
</script>

<DemoBlock :code="MockProviderChatRaw" title="Mock Provider">
  <MockProviderChat />
</DemoBlock>

## API

### Props

| 名称       | 类型           | 默认值 | 说明                 |
| ---------- | -------------- | ------ | -------------------- |
| `provider` | `ChatProvider` | —      | 事件流提供者（必填） |
