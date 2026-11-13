---
title: 后端无关
---

# 后端无关

组件与数据源解耦，是整个「后端无关」能力的落点。组件只认一份标准事件流，永远不知道背后是谁。

## ChatProvider 接口

```ts
interface ChatProvider {
  subscribe(handlers: { input: string; onEvent(e: ChatEvent): void }): {
    unsubscribe(): void
    abort(): void
  }
}
```

`subscribe` 传入本轮用户输入 `input` 与 `onEvent` 回调，返回 `unsubscribe`（解绑）与 `abort`（中止本轮）。

## ChatEvent 契约（9 种）

```ts
type ChatEvent =
  | { type: 'text-delta'; id: string; delta: string } // 正文增量
  | { type: 'thinking'; text: string } // 思考过程
  | { type: 'tool-call-start'; id: string; name: string; args: string } // 工具调用开始
  | { type: 'tool-call-arg-delta'; id: string; delta: string } // 参数增量
  | { type: 'tool-call-end'; id: string; result: string; status: 'ok' | 'error'; latencyMs: number } // 工具调用结束
  | {
      type: 'step-status'
      stepId: string
      status: 'queued' | 'running' | 'done' | 'failed' | 'cancelled'
    } // 步骤状态
  | { type: 'approval-request'; id: string; toolName: string; args: unknown; summary: string } // 请求审批
  | { type: 'error'; message: string } // 出错
  | { type: 'done' } // 本轮结束
```

## 三个一等 Adapter

- `AiSdkProvider` — 基于 Vercel AI SDK，覆盖 OpenAI / Anthropic / 本地模型等；
- `AgUiProvider` — AG-UI 协议，对接各类 agent 框架；
- `CustomProvider` — 裸流回调，自定义后端。

当前仓库只提供 [`createMockProvider`](https://github.com/coding-zky/1056-learn-ai)（演示用），三个一等 adapter 为后续规划。core 零依赖 AI SDK，只有 adapter 依赖它——「只装 core」不连带 AI SDK。
