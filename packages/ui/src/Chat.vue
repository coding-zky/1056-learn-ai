<script setup lang="ts">
import { useChat } from '@ai-chat-ui/core'
import type { ChatProvider } from '@ai-chat-ui/core'
import Message from './Message.vue'
import AgentProcess from './AgentProcess.vue'
import ChatInput from './ChatInput.vue'

const props = defineProps<{ provider: ChatProvider }>()

const { messages, streaming, send, stop } = useChat({ provider: props.provider })
</script>

<template>
  <div
    class="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
  >
    <div class="flex flex-col gap-4">
      <div v-for="msg in messages" :key="msg.id">
        <AgentProcess
          v-if="msg.role === 'assistant'"
          :thinking="msg.thinking"
          :tool-calls="msg.toolCalls"
          :steps="msg.steps"
        />
        <Message :content="msg.content" :role="msg.role" :status="msg.status" />
      </div>
    </div>

    <div class="flex gap-2">
      <ChatInput :disabled="streaming" @send="send" />
      <button
        v-if="streaming"
        class="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
        @click="stop"
      >
        停止
      </button>
    </div>
  </div>
</template>
