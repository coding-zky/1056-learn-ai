<script setup lang="ts">
import { Chat } from '@ai-chat-ui/ui'
import { createChatMockProvider } from '@ai-chat-ui/adapters'

const provider = createChatMockProvider()
</script>

<template>
  <main class="min-h-screen bg-slate-50 p-6">
    <div class="mx-auto max-w-xl">
      <h1 class="mb-4 text-2xl font-semibold text-brand">AI Chat UI · Playground</h1>
      <Chat :provider="provider" />
    </div>
  </main>
</template>
