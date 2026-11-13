import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Message from './Message.vue'

describe('Message', () => {
  it('渲染内容并保留换行', () => {
    const wrapper = mount(Message, { props: { content: '你好\n世界' } })
    expect(wrapper.text()).toContain('你好')
    expect(wrapper.text()).toContain('世界')
  })

  it('assistant 默认左对齐，user 右对齐', () => {
    const assistant = mount(Message, { props: { content: 'a' } })
    expect(assistant.classes()).toContain('justify-start')
    const user = mount(Message, { props: { content: 'a', role: 'user' } })
    expect(user.classes()).toContain('justify-end')
  })

  it('streaming 时显示光标', () => {
    const wrapper = mount(Message, { props: { content: 'abc', status: 'streaming' } })
    expect(wrapper.text()).toContain('▍')
  })

  it('variant=chatgpt 时 user 用深色气泡', () => {
    const wrapper = mount(Message, { props: { content: 'a', role: 'user', variant: 'chatgpt' } })
    const bubble = wrapper.findAll('div')[1]
    expect(bubble.classes()).toContain('bg-slate-900')
    expect(bubble.classes()).not.toContain('bg-blue-600')
  })

  it('variant=chatgpt 时 assistant 无背景气泡', () => {
    const wrapper = mount(Message, { props: { content: 'a', variant: 'chatgpt' } })
    const bubble = wrapper.findAll('div')[1]
    expect(bubble.classes()).not.toContain('bg-slate-100')
  })
})
