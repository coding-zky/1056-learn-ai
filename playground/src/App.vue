<script setup lang="ts">
import { Chat } from '@ai-chat-ui/ui'
import { createMockProvider } from '@ai-chat-ui/adapters'

const provider = createMockProvider([
  { type: 'thinking', text: '正在思考…' },
  { type: 'tool-call-start', id: 't1', name: 'search_flights', args: '{}' },
  { type: 'tool-call-end', id: 't1', result: 'CA1234 ¥680', status: 'ok', latencyMs: 1200 },
  { type: 'text-delta', id: '1', delta: '已为你找到最便宜的航班 CA1234，¥680。' },
  { type: 'done' },
])
</script>

<template>
  <main class="min-h-screen bg-slate-50 p-6">
    <div class="mx-auto max-w-xl">
      <h1 class="mb-4 text-2xl font-semibold text-brand">AI Chat UI · Playground</h1>
      <Chat :provider="provider" />
    </div>
  </main>
</template>
