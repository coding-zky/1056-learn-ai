---
layout: home

hero:
  name: AI Chat UI
  text: Agent 过程可视化 · 后端无关 · Headless
  tagline: 面向 Vue 3 的 AI 聊天界面组件库，让用户看到 Agent 每一步在做什么。
  actions:
    - theme: brand
      text: 快速上手
      link: /guide/quickstart
    - theme: alt
      text: 查看组件
      link: /component/
    - theme: alt
      text: GitHub
      link: https://github.com/coding-zky/1056-learn-ai

features:
  - icon: 🔌
    title: 后端无关
    details: 组件只认标准事件流，不绑定任何模型或后端，切换数据源不改组件代码。
  - icon: 👁️
    title: Agent 过程可视化
    details: 思考、工具调用、步骤状态、审批点全程可见、可干预，而不只是看到最终回复。
  - icon: 🧩
    title: Headless
    details: 逻辑（composable）与样式（UI 组件）分层，只拿 composable 也能自己写界面。
  - icon: 📦
    title: 按需安装
    details: 想用哪块装哪块，不打全家桶。
  - icon: ⚡
    title: 流式优先
    details: 所有生成类组件原生支持 token 流、停止、错误、重试。
---

<script setup>
import { Button } from '@ai-chat-ui/ui'
</script>

## 立即体验

<Button>立即体验</Button>
