import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

// 文档站开发时直接 alias 到各包源码，免去先 build 库包再跑 docs 的负担。
// 注意：config.mts 位于 docs/.vitepress/ 下，需上溯两级才到仓库根。
export default defineConfig({
  lang: 'zh-CN',
  title: 'AI Chat UI',
  description: 'Agent 过程可视化 · 后端无关 · Headless 的 Vue 3 AI 聊天组件库',
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/component/' },
      { text: 'Playground', link: '/playground' },
      { text: 'GitHub', link: 'https://github.com/coding-zky/1056-learn-ai' },
    ],
    sidebar: {
      '/guide/': [
        { text: '介绍', link: '/guide/' },
        { text: '设计理念', link: '/guide/design' },
        { text: '安装', link: '/guide/installation' },
        { text: '快速上手', link: '/guide/quickstart' },
        { text: '后端无关', link: '/guide/provider' },
        { text: 'Agent 过程可视化', link: '/guide/agent-visualization' },
      ],
      '/component/': [
        {
          text: '通用',
          items: [{ text: 'Button 按钮', link: '/component/button' }],
        },
        {
          text: '聊天',
          items: [
            { text: 'Chat 聊天容器', link: '/component/chat' },
            { text: 'Message 消息', link: '/component/message' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
    appearance: true,
    socialLinks: [{ icon: 'github', link: 'https://github.com/coding-zky/1056-learn-ai' }],
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@ai-chat-ui/core': fileURLToPath(
          new URL('../../packages/core/src/index.ts', import.meta.url),
        ),
        '@ai-chat-ui/ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
        '@ai-chat-ui/adapters': fileURLToPath(
          new URL('../../packages/adapters/src/index.ts', import.meta.url),
        ),
      },
    },
  },
})
