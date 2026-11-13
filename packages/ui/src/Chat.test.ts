import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Chat from './Chat.vue'
import type { ChatProvider, ChatEvent } from '@ai-chat-ui/core'

function providerFrom(events: ChatEvent[]): ChatProvider {
  return {
    subscribe({ onEvent }) {
      for (const e of events) onEvent(e)
      return { unsubscribe() {}, abort() {} }
    },
  }
}

describe('Chat', () => {
  it('发送消息后渲染用户消息、助手回复与工具调用', async () => {
    const wrapper = mount(Chat, {
      props: {
        provider: providerFrom([
          { type: 'tool-call-start', id: 't1', name: 'search_flights', args: '{}' },
          { type: 'tool-call-end', id: 't1', result: 'CA1234 ¥680', status: 'ok', latencyMs: 1200 },
          { type: 'text-delta', id: '1', delta: '你好，世界' },
          { type: 'done' },
        ]),
      },
    })

    await wrapper.get('textarea').setValue('查航班')
    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('查航班')
    expect(wrapper.text()).toContain('你好，世界')
    expect(wrapper.text()).toContain('search_flights')
  })
})
