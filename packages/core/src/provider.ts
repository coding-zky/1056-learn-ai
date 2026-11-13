import type { ChatEvent } from './events'

export interface ChatSubscription {
  unsubscribe(): void
  abort(): void
}

export interface ChatProvider {
  subscribe(handlers: { input: string; onEvent: (e: ChatEvent) => void }): ChatSubscription
}
