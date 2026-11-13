<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    content: string
    role?: 'user' | 'assistant'
    status?: 'streaming' | 'done' | 'error'
    variant?: 'default' | 'chatgpt'
  }>(),
  { role: 'assistant', status: 'done', variant: 'default' },
)

const isUser = computed(() => props.role === 'user')
const isChatGpt = computed(() => props.variant === 'chatgpt')

// chatgpt 变体：user 深色气泡、assistant 无背景（气泡类不含背景与内边距）
const bubbleClass = computed(() => {
  if (!isChatGpt.value) {
    return isUser.value
      ? 'bg-blue-600 text-white px-3 py-2 rounded-lg'
      : 'bg-slate-100 text-slate-800 px-3 py-2 rounded-lg'
  }
  return isUser.value ? 'bg-slate-900 text-white px-4 py-2.5 rounded-2xl' : 'text-slate-800'
})
</script>

<template>
  <div class="flex w-full" :class="isUser ? 'justify-end' : 'justify-start'">
    <div class="max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed" :class="bubbleClass">
      {{ content }}<span v-if="status === 'streaming'" class="animate-pulse">▍</span>
    </div>
  </div>
</template>
