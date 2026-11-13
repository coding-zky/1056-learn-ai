---
title: 快速上手
---

# 快速上手

<script setup>
import QuickStartChat from '../examples/chat/mock-provider.vue'
import QuickStartChatRaw from '../examples/chat/mock-provider.vue?raw'
</script>

用 `createMockProvider` 造一条事件流，塞给 `<Chat>` 即可跑通：

<DemoBlock :code="QuickStartChatRaw" title="最小可运行示例">
  <QuickStartChat />
</DemoBlock>

点击「发送」，Mock Provider 按时间顺序推送 `thinking → tool-call → text-delta → done`，`<Chat>` 内部用 `useChat` 消费这些事件，渲染出工具调用状态与文本。

## 换成真实后端

`createMockProvider(script, delayMs = 100)` 只是演示。接入真实后端，只需实现同一个 [`ChatProvider`](/guide/provider) 接口——组件只认事件流，不关心事件来自哪里。
