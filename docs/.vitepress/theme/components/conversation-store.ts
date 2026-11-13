import type { ChatMessage } from '@ai-chat-ui/core'

export interface StoredConversation {
  id: string
  title: string
  createdAt: number
  messages: ChatMessage[]
}

const STORAGE_KEY = 'ai-chat-ui:conversations'

// localStorage 在 SSR / 隐私模式下可能不可用，统一 try/catch 静默降级。
function read(): StoredConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredConversation[]) : []
  } catch {
    return []
  }
}

function write(list: StoredConversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // 配额满 / 不可用：忽略，不打断聊天主流程
  }
}

export function listConversations(): StoredConversation[] {
  return read().sort((a, b) => b.createdAt - a.createdAt)
}

export function getConversation(id: string): StoredConversation | undefined {
  return read().find((c) => c.id === id)
}

export function saveConversation(conv: StoredConversation) {
  const list = read()
  const existing = list.find((c) => c.id === conv.id)
  const next = existing ? { ...conv, createdAt: existing.createdAt } : conv
  write([next, ...list.filter((c) => c.id !== conv.id)])
}

export function removeConversation(id: string) {
  write(read().filter((c) => c.id !== id))
}

export function newId(): string {
  return `c${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function titleFrom(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === 'user')
  const text = first?.content.trim() || '新对话'
  return text.length > 20 ? `${text.slice(0, 20)}…` : text
}

export function cloneMessages(messages: ChatMessage[]): ChatMessage[] {
  return JSON.parse(JSON.stringify(messages)) as ChatMessage[]
}
