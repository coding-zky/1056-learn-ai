import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AgentProcess from './AgentProcess.vue'

describe('AgentProcess', () => {
  it('渲染 thinking 文案', () => {
    const wrapper = mount(AgentProcess, { props: { thinking: '正在思考…' } })
    expect(wrapper.text()).toContain('正在思考…')
  })

  it('渲染工具调用 chip 与步骤状态', () => {
    const wrapper = mount(AgentProcess, {
      props: {
        toolCalls: [{ id: 't1', name: 'search_flights', status: 'done', result: 'CA1234' }],
        steps: [{ stepId: 's1', status: 'done' }],
      },
    })
    expect(wrapper.text()).toContain('search_flights')
    expect(wrapper.text()).toContain('s1')
  })

  it('无过程时不渲染任何内容', () => {
    const wrapper = mount(AgentProcess, {})
    expect(wrapper.text()).toBe('')
  })
})
