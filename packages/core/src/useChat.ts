import { ref, onScopeDispose } from 'vue'
import type { ChatEvent } from './events'
import type { ChatProvider, ChatSubscription } from './provider'

export interface ToolCallState {
  id: string
  name: string
  status: 'running' | 'done' | 'error'
  result?: string
}

export function useChat({ provider }: { provider: ChatProvider }) {
  const text = ref('')
  const toolCalls = ref<ToolCallState[]>([])
  const streaming = ref(false)
  const error = ref<string | null>(null)

  let subscription: ChatSubscription | null = null

  function onEvent(e: ChatEvent) {
    switch (e.type) {
      case 'text-delta':
        text.value += e.delta
        break
      case 'tool-call-start':
        streaming.value = true
        toolCalls.value.push({ id: e.id, name: e.name, status: 'running' })
        break
      case 'tool-call-end': {
        streaming.value = false
        const call = toolCalls.value.find((c) => c.id === e.id)
        if (call) {
          call.status = e.status === 'ok' ? 'done' : 'error'
          call.result = e.result
        }
        break
      }
      case 'error':
        error.value = e.message
        streaming.value = false
        break
      case 'done':
        streaming.value = false
        break
    }
  }

  function start() {
    error.value = null
    text.value = ''
    toolCalls.value = []
    streaming.value = true
    subscription = provider.subscribe({ onEvent })
  }

  function stop() {
    subscription?.abort()
    streaming.value = false
  }

  onScopeDispose(() => subscription?.unsubscribe())

  return { text, toolCalls, streaming, error, start, stop }
}
