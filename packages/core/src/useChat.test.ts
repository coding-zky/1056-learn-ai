import { describe, it, expect } from 'vitest'
import { effectScope } from 'vue'
import { useChat } from './useChat'
import type { ChatProvider } from './provider'
import type { ChatEvent } from './events'

function providerFrom(events: ChatEvent[]): ChatProvider {
  return {
    subscribe({ onEvent }) {
      for (const e of events) onEvent(e)
      return { unsubscribe() {}, abort() {} }
    },
  }
}

describe('useChat', () => {
  it('累积 text-delta 事件', () => {
    const scope = effectScope()
    const chat = scope.run(() =>
      useChat({
        provider: providerFrom([
          { type: 'text-delta', id: '1', delta: '你好' },
          { type: 'text-delta', id: '1', delta: '，世界' },
          { type: 'done' },
        ]),
      }),
    )!
    chat.start()
    expect(chat.text.value).toBe('你好，世界')
    expect(chat.streaming.value).toBe(false)
    scope.stop()
  })

  it('记录工具调用并标记状态', () => {
    const scope = effectScope()
    const chat = scope.run(() =>
      useChat({
        provider: providerFrom([
          { type: 'tool-call-start', id: 't1', name: 'search_flights', args: '{}' },
          { type: 'tool-call-end', id: 't1', result: 'CA1234 ¥680', status: 'ok', latencyMs: 1200 },
          { type: 'done' },
        ]),
      }),
    )!
    chat.start()
    expect(chat.toolCalls.value).toHaveLength(1)
    expect(chat.toolCalls.value[0]!.name).toBe('search_flights')
    expect(chat.toolCalls.value[0]!.status).toBe('done')
    scope.stop()
  })
})
