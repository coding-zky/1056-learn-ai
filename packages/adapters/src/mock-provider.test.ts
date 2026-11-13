import { describe, it, expect, vi, afterEach } from 'vitest'
import { createMockProvider, createChatMockProvider } from './mock-provider'
import type { ChatEvent } from '@ai-chat-ui/core'

afterEach(() => {
  vi.useRealTimers()
})

describe('createMockProvider', () => {
  it('按顺序、延迟发射数组脚本', () => {
    vi.useFakeTimers()
    const received: ChatEvent[] = []
    const provider = createMockProvider(
      [{ type: 'text-delta', id: '1', delta: 'A' }, { type: 'done' }],
      100,
    )

    provider.subscribe({ input: 'hi', onEvent: (e) => received.push(e) })

    expect(received).toHaveLength(0)
    vi.advanceTimersByTime(100)
    expect(received).toHaveLength(1)
    vi.advanceTimersByTime(100)
    expect(received).toHaveLength(2)
    expect(received[0]!.type).toBe('text-delta')
    expect(received[1]!.type).toBe('done')
  })

  it('函数脚本接收用户输入', () => {
    vi.useFakeTimers()
    let captured = ''
    const provider = createMockProvider((input) => {
      captured = input
      return [{ type: 'text-delta', id: '1', delta: '回复' }, { type: 'done' }]
    }, 100)

    provider.subscribe({ input: '查机票', onEvent: () => {} })

    expect(captured).toBe('查机票')
  })

  it('unsubscribe 后不再发射', () => {
    vi.useFakeTimers()
    const received: ChatEvent[] = []
    const provider = createMockProvider([{ type: 'done' }], 100)
    const sub = provider.subscribe({ input: 'x', onEvent: (e) => received.push(e) })

    sub.unsubscribe()
    vi.advanceTimersByTime(100)

    expect(received).toHaveLength(0)
  })
})

describe('createChatMockProvider', () => {
  it('发射完整 agent 过程（thinking → 工具调用 → 步骤 → 正文 → done）', () => {
    vi.useFakeTimers()
    const received: ChatEvent[] = []
    const provider = createChatMockProvider(10)

    provider.subscribe({ input: '帮我查机票', onEvent: (e) => received.push(e) })
    vi.runAllTimers()

    const types = received.map((e) => e.type)
    expect(types).toContain('thinking')
    expect(types).toContain('tool-call-start')
    expect(types).toContain('tool-call-end')
    expect(types).toContain('step-status')
    expect(types).toContain('text-delta')
    expect(types[types.length - 1]).toBe('done')
  })
})
