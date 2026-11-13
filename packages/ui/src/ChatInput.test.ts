import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatInput from './ChatInput.vue'

describe('ChatInput', () => {
  it('点击发送 emit 内容并清空输入框', async () => {
    const wrapper = mount(ChatInput)
    await wrapper.get('textarea').setValue('你好')
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('send')![0]).toEqual(['你好'])
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('')
  })

  it('空白内容不发送', async () => {
    const wrapper = mount(ChatInput)
    await wrapper.get('textarea').setValue('   ')
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('send')).toBeUndefined()
  })

  it('Enter 发送、Shift+Enter 不发送', async () => {
    const wrapper = mount(ChatInput)
    await wrapper.get('textarea').setValue('hi')
    await wrapper.get('textarea').trigger('keydown', { key: 'Enter', shiftKey: false })
    expect(wrapper.emitted('send')![0]).toEqual(['hi'])

    const w2 = mount(ChatInput)
    await w2.get('textarea').setValue('hi')
    await w2.get('textarea').trigger('keydown', { key: 'Enter', shiftKey: true })
    expect(w2.emitted('send')).toBeUndefined()
  })

  it('variant=chatgpt 时发送按钮为圆形图标', () => {
    const wrapper = mount(ChatInput, { props: { variant: 'chatgpt' } })
    const btn = wrapper.get('button')
    expect(btn.classes()).toContain('rounded-full')
    expect(btn.text()).not.toContain('发送')
  })

  it('variant=chatgpt 仍能发送并清空', async () => {
    const wrapper = mount(ChatInput, { props: { variant: 'chatgpt' } })
    await wrapper.get('textarea').setValue('你好')
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('send')![0]).toEqual(['你好'])
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('')
  })
})
