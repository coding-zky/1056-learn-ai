<script setup lang="ts">
import { Chat } from '@ai-chat-ui/ui'
import { createChatMockProvider } from '@ai-chat-ui/adapters'

// 输入感知的 Mock Provider：按用户输入生成 thinking → tool-call → text-delta → done 事件序列
const provider = createChatMockProvider()
</script>

<template>
  <Chat :provider="provider" />
</template>
