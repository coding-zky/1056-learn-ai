import type { ChatEvent } from './events'

export interface ChatSubscription {
  unsubscribe(): void
  abort(): void
}

export interface ChatProvider {
  subscribe(handlers: { onEvent: (e: ChatEvent) => void }): ChatSubscription
}
