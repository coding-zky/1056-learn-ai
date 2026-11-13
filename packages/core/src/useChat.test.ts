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
  it('send 产生 user 与 assistant 两条消息，并累积 text-delta', () => {
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
    chat.send('帮我查航班')

    expect(chat.messages.value).toHaveLength(2)
    expect(chat.messages.value[0]!.role).toBe('user')
    expect(chat.messages.value[0]!.content).toBe('帮我查航班')
    expect(chat.messages.value[1]!.role).toBe('assistant')
    expect(chat.messages.value[1]!.content).toBe('你好，世界')
    expect(chat.messages.value[1]!.status).toBe('done')
    expect(chat.streaming.value).toBe(false)
    scope.stop()
  })

  it('把用户输入传给 provider', () => {
    let received = ''
    const provider: ChatProvider = {
      subscribe({ input, onEvent }) {
        received = input
        onEvent({ type: 'done' })
        return { unsubscribe() {}, abort() {} }
      },
    }
    const scope = effectScope()
    const chat = scope.run(() => useChat({ provider }))!
    chat.send('你好')
    expect(received).toBe('你好')
    scope.stop()
  })

  it('thinking / 工具调用 / 步骤状态记录到 assistant 消息上', () => {
    const scope = effectScope()
    const chat = scope.run(() =>
      useChat({
        provider: providerFrom([
          { type: 'thinking', text: '正在思考…' },
          { type: 'tool-call-start', id: 't1', name: 'search_flights', args: '{}' },
          { type: 'tool-call-arg-delta', id: 't1', delta: 'x' },
          { type: 'tool-call-end', id: 't1', result: 'CA1234 ¥680', status: 'ok', latencyMs: 1200 },
          { type: 'step-status', stepId: 's1', status: 'done' },
          { type: 'done' },
        ]),
      }),
    )!
    chat.send('查询')

    const msg = chat.messages.value[1]!
    expect(msg.thinking).toBe('正在思考…')
    expect(msg.toolCalls).toHaveLength(1)
    expect(msg.toolCalls![0]!.name).toBe('search_flights')
    expect(msg.toolCalls![0]!.status).toBe('done')
    expect(msg.toolCalls![0]!.args).toBe('{}x')
    expect(msg.toolCalls![0]!.result).toBe('CA1234 ¥680')
    expect(msg.steps).toHaveLength(1)
    expect(msg.steps![0]!.status).toBe('done')
    scope.stop()
  })

  it('clear 清空消息', () => {
    const scope = effectScope()
    const chat = scope.run(() => useChat({ provider: providerFrom([{ type: 'done' }]) }))!
    chat.send('hi')
    expect(chat.messages.value).toHaveLength(2)
    chat.clear()
    expect(chat.messages.value).toHaveLength(0)
    scope.stop()
  })
})
