import type { ChatProvider, ChatEvent } from '@ai-chat-ui/core'

// 内存 mock provider：演示「后端无关」——组件只认事件流，不关心来源。
// 后续 AiSdkProvider / AgUiProvider 会在这里按同样接口接真实后端。
export function createMockProvider(script: ChatEvent[], delayMs = 100): ChatProvider {
  return {
    subscribe({ onEvent }) {
      let cancelled = false
      const timers: ReturnType<typeof setTimeout>[] = []
      script.forEach((e, i) => {
        timers.push(
          setTimeout(() => {
            if (!cancelled) onEvent(e)
          }, (i + 1) * delayMs),
        )
      })
      return {
        unsubscribe() {
          cancelled = true
          timers.forEach(clearTimeout)
        },
        abort() {
          cancelled = true
          timers.forEach(clearTimeout)
        },
      }
    },
  }
}
