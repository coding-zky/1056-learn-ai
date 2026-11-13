<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    content: string
    role?: 'user' | 'assistant'
    status?: 'streaming' | 'done' | 'error'
  }>(),
  { role: 'assistant', status: 'done' },
)

const isUser = computed(() => props.role === 'user')
</script>

<template>
  <div class="flex w-full" :class="isUser ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed"
      :class="isUser ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'"
    >
      {{ content }}<span v-if="status === 'streaming'" class="animate-pulse">▍</span>
    </div>
  </div>
</template>
