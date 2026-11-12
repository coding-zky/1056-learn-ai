import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('渲染默认插槽内容', () => {
    const wrapper = mount(Button, { slots: { default: '点击我' } })
    expect(wrapper.text()).toBe('点击我')
  })

  it('应用 variant 与 size 的样式类', () => {
    const wrapper = mount(Button, { props: { variant: 'secondary', size: 'lg' } })
    expect(wrapper.classes()).toContain('bg-slate-100')
    expect(wrapper.classes()).toContain('h-12')
  })

  it('disabled 时渲染 disabled 属性', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
