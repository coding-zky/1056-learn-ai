import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DemoBlock from './DemoBlock.vue'

describe('DemoBlock', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('在预览区渲染默认 slot', () => {
    const wrapper = mount(DemoBlock, {
      props: { code: '<Button>hi</Button>' },
      slots: { default: '<button>点我</button>' },
    })

    expect(wrapper.text()).toContain('点我')
  })

  it('源码默认隐藏，点击「显示代码」后出现且包含传入的 code', async () => {
    const wrapper = mount(DemoBlock, {
      props: { code: '<Button>hi</Button>' },
    })

    expect(wrapper.find('pre').exists()).toBe(false)

    const toggleBtn = wrapper.findAll('button').find((b) => b.text() === '显示代码')!
    await toggleBtn.trigger('click')

    expect(wrapper.find('pre').exists()).toBe(true)
    expect(wrapper.find('pre').text()).toContain('<Button>hi</Button>')
  })

  it('点击「复制」调用 navigator.clipboard.writeText(code)', async () => {
    const writeText = vi.fn()
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const wrapper = mount(DemoBlock, { props: { code: 'const x = 1' } })
    const copyBtn = wrapper.findAll('button').find((b) => b.text() === '复制')!

    await copyBtn.trigger('click')

    expect(writeText).toHaveBeenCalledWith('const x = 1')
  })
})
