import { ref, onScopeDispose } from 'vue'
import type { ChatEvent, StepStatus } from './events'
import type { ChatProvider, ChatSubscription } from './provider'

export interface ToolCallState {
  id: string
  name: string
  args?: string
  status: 'running' | 'done' | 'error'
  result?: string
  latencyMs?: number
}

export interface StepState {
  stepId: string
  status: StepStatus
}

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  status: 'streaming' | 'done' | 'error'
  thinking?: string
  toolCalls?: ToolCallState[]
  steps?: StepState[]
  error?: string
}

let uid = 0
function nextId(): string {
  return `m${++uid}`
}

export function useChat({ provider }: { provider: ChatProvider }) {
  const messages = ref<ChatMessage[]>([])
  const streaming = ref(false)
  const error = ref<string | null>(null)

  let subscription: ChatSubscription | null = null

  // 正在流式接收的 assistant 消息（send 后必定是最后一条）
  function current(): ChatMessage {
    return messages.value[messages.value.length - 1]!
  }

  function onEvent(e: ChatEvent) {
    const msg = current()
    switch (e.type) {
      case 'text-delta':
        msg.content += e.delta
        break
      case 'thinking':
        msg.thinking = e.text
        break
      case 'tool-call-start':
        msg.toolCalls = msg.toolCalls ?? []
        msg.toolCalls.push({ id: e.id, name: e.name, args: e.args, status: 'running' })
        break
      case 'tool-call-arg-delta': {
        const call = msg.toolCalls?.find((c) => c.id === e.id)
        if (call) call.args = (call.args ?? '') + e.delta
        break
      }
      case 'tool-call-end': {
        const call = msg.toolCalls?.find((c) => c.id === e.id)
        if (call) {
          call.status = e.status === 'ok' ? 'done' : 'error'
          call.result = e.result
          call.latencyMs = e.latencyMs
        }
        break
      }
      case 'step-status': {
        msg.steps = msg.steps ?? []
        const step = msg.steps.find((s) => s.stepId === e.stepId)
        if (step) step.status = e.status
        else msg.steps.push({ stepId: e.stepId, status: e.status })
        break
      }
      case 'error':
        msg.status = 'error'
        msg.error = e.message
        streaming.value = false
        break
      case 'done':
        msg.status = 'done'
        streaming.value = false
        break
      // approval-request 暂不消费，留待 ApprovalGate 组件处理
      default:
        break
    }
  }

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || streaming.value) return
    error.value = null
    messages.value.push({ id: nextId(), role: 'user', content: trimmed, status: 'done' })
    messages.value.push({ id: nextId(), role: 'assistant', content: '', status: 'streaming' })
    streaming.value = true
    subscription = provider.subscribe({ input: trimmed, onEvent })
  }

  function stop() {
    subscription?.abort()
    streaming.value = false
    const msg = messages.value[messages.value.length - 1]
    if (msg && msg.status === 'streaming') msg.status = 'done'
  }

  function clear() {
    subscription?.unsubscribe()
    messages.value = []
    streaming.value = false
    error.value = null
  }

  onScopeDispose(() => subscription?.unsubscribe())

  return { messages, streaming, error, send, stop, clear }
}
