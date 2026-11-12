import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Message from './Message.vue'

describe('Message', () => {
  it('渲染内容并保留换行', () => {
    const wrapper = mount(Message, { props: { content: '你好\n世界' } })
    expect(wrapper.text()).toContain('你好')
    expect(wrapper.classes()).toContain('whitespace-pre-wrap')
  })
})
