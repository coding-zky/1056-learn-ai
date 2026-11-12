import { describe, it, expect, vi, afterEach } from 'vitest'
import { createMockProvider } from './mock-provider'
import type { ChatEvent } from '@ai-chat-ui/core'

afterEach(() => {
  vi.useRealTimers()
})

describe('createMockProvider', () => {
  it('按顺序、延迟发射事件', () => {
    vi.useFakeTimers()
    const received: ChatEvent[] = []
    const provider = createMockProvider(
      [{ type: 'text-delta', id: '1', delta: 'A' }, { type: 'done' }],
      100,
    )

    provider.subscribe({ onEvent: (e) => received.push(e) })

    expect(received).toHaveLength(0)
    vi.advanceTimersByTime(100)
    expect(received).toHaveLength(1)
    vi.advanceTimersByTime(100)
    expect(received).toHaveLength(2)
    expect(received[0]!.type).toBe('text-delta')
    expect(received[1]!.type).toBe('done')
  })

  it('unsubscribe 后不再发射', () => {
    vi.useFakeTimers()
    const received: ChatEvent[] = []
    const provider = createMockProvider([{ type: 'done' }], 100)
    const sub = provider.subscribe({ onEvent: (e) => received.push(e) })

    sub.unsubscribe()
    vi.advanceTimersByTime(100)

    expect(received).toHaveLength(0)
  })
})
