# AI Chat UI

一个基于 **Vue 3 + TypeScript** 的 AI 聊天界面组件库。核心差异化是 **Agent 过程可视化** —— 让用户看到 Agent 每一步在干什么、调了什么工具、走到哪、哪里可以插手，而不只是看到最终回复。

> 状态：**Phase 0 完成**（Monorepo 骨架 + Provider 抽象层 + 最小 `Chat` 跑通一条流）。走「前期开源、后期商业化」路径。

## 定位

- **后端无关**：组件不绑定任何模型 / 后端，切换数据源不改组件代码。
- **Agent 过程可视化**：思考、工具调用、步骤状态、审批点全程可见、可干预。
- **Headless**：逻辑（composable）与样式（UI 组件）分层，可只拿逻辑自己写界面，也可整体换主题。
- **按需安装**：`core` / `ui` / `adapters` 独立子包，想用哪块装哪块。
- **流式优先**：原生支持 token 流、停止、错误、重试。

## 架构

```
UI 组件（纯渲染）
      ↓ 消费
ChatProvider 接口（标准化事件流 ChatEvent）
      ↑ 实现
Adapter：AiSdkProvider | AgUiProvider | CustomProvider
      ↑ 对接
后端：Vercel AI SDK 流 | AG-UI 协议 | 自定义 SSE / 回调
```

- **`ChatProvider` + `ChatEvent`** 是库内定义的契约，组件只认它，永远不知道背后是谁。
- **core 零依赖 AI SDK**：`@ai-chat-ui/core` 不 import `ai`，只有 adapter 依赖它——「只装 core」不连带 AI SDK。

## 包结构（Monorepo）

| 包 | 说明 |
|---|---|
| `@ai-chat-ui/core` | Provider 抽象 + 事件规范 + `useChat` 等 composables（零依赖 AI SDK） |
| `@ai-chat-ui/ui` | UI 组件（`Chat` / `Message`），依赖 core + reka-ui |
| `@ai-chat-ui/adapters` | 后端适配器（当前 `createMockProvider`，后续 AiSdk / AgUi / Custom） |
| `playground` | 开发调试用 Vite SPA |

## 快速开始

环境：Node ≥ 18，pnpm ≥ 9。

```bash
pnpm install      # 安装依赖
pnpm dev          # 启动 playground（Vite SPA）
pnpm build        # 按拓扑顺序构建 core → ui → adapters → playground
pnpm test         # Vitest 跑全部单测
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
```

## 使用示例

组件用法（`Chat` 只认 `ChatProvider`，与后端解耦）：

```ts
import { Chat } from '@ai-chat-ui/ui'
import { createMockProvider } from '@ai-chat-ui/adapters'

const provider = createMockProvider([
  { type: 'thinking', text: '正在思考…' },
  { type: 'tool-call-start', id: 't1', name: 'search_flights', args: '{}' },
  { type: 'tool-call-end', id: 't1', result: 'CA1234 ¥680', status: 'ok', latencyMs: 1200 },
  { type: 'text-delta', id: '1', delta: '已为你找到最便宜的航班。' },
  { type: 'done' },
])
```

```vue
<Chat :provider="provider" />
```

Headless 用法（只拿逻辑自己写界面）：

```ts
import { useChat } from '@ai-chat-ui/core'

const { text, toolCalls, streaming, error, start, stop } = useChat({ provider })
```

## 事件规范（ChatEvent）

后端无关的过程事件流，组件与 provider 之间唯一的契约：

```ts
type ChatEvent =
  | { type: 'text-delta'; id: string; delta: string }                        // 正文增量
  | { type: 'thinking'; text: string }                                       // 思考过程
  | { type: 'tool-call-start'; id: string; name: string; args: string }      // 工具调用开始
  | { type: 'tool-call-arg-delta'; id: string; delta: string }               // 参数增量
  | { type: 'tool-call-end'; id: string; result: string;
      status: 'ok' | 'error'; latencyMs: number }                            // 工具调用结束
  | { type: 'step-status'; stepId: string;
      status: 'queued' | 'running' | 'done' | 'failed' | 'cancelled' }       // 步骤状态
  | { type: 'approval-request'; id: string; toolName: string;
      args: unknown; summary: string }                                       // 请求审批
  | { type: 'error'; message: string }
  | { type: 'done' }                                                         // 本轮结束

interface ChatProvider {
  subscribe(handlers: { onEvent(e: ChatEvent): void }): {
    unsubscribe(): void
    abort(): void
  }
}
```

## 路线图

- [x] **Phase 0**：Monorepo 骨架 + Provider 抽象层 + 最小 `Chat` 跑通一条流
- [ ] **Phase 1**：基础聊天（PromptInput / StreamingMarkdown）+ 文档
- [ ] **Phase 2**：Agent 可视化组件（Timeline / ToolCallCard / ApprovalGate / AgentPanel）
- [ ] **Phase 3**：多模态 + 主题系统 + 示例 app
- [ ] **Phase 4**：发布 npm（core / adapters）+ registry / CLI

## 技术栈

| 层 | 选型 |
|---|---|
| 语言 | TypeScript（strict） |
| UI | Vue 3（Composition API） |
| AI 底座 | Vercel AI SDK（`ai` + `@ai-sdk/vue`，经 Provider 层隔离） |
| 无头基座 | reka-ui |
| 样式 | Tailwind CSS v4 + CSS Variables |
| 构建 | Vite lib mode |
| 仓库 | pnpm Monorepo |
| 测试 | Vitest + Vue Test Utils |

## 更多

完整设计见 [技术方案文档](../AI聊天界面组件库技术方案.md)。

## License

开源期 MIT；商业化能力（高级 Agent 可视化、企业 provider 等）另行授权。
