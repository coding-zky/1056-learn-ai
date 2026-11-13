import type { ChatProvider, ChatEvent } from '@ai-chat-ui/core'

// 内存 mock provider：演示「后端无关」——组件只认事件流，不关心来源。
// script 可以是固定事件数组，也可以是 `(input) => ChatEvent[]` 按用户输入动态生成。
// 后续 AiSdkProvider / AgUiProvider 会在这里按同样接口接真实后端。
export type MockScript = ChatEvent[] | ((input: string) => ChatEvent[])

export function createMockProvider(script: MockScript, delayMs = 100): ChatProvider {
  return {
    subscribe({ input, onEvent }) {
      const events = typeof script === 'function' ? script(input) : script
      let cancelled = false
      const timers: ReturnType<typeof setTimeout>[] = []
      events.forEach((e, i) => {
        timers.push(
          setTimeout(
            () => {
              if (!cancelled) onEvent(e)
            },
            (i + 1) * delayMs,
          ),
        )
      })
      return {
        unsubscribe() {
          cancelled = true
          timers.forEach(clearTimeout)
        },
        abort() {
          cancelled = true
          timers.forEach(clearTimeout)
        },
      }
    },
  }
}

// 按用户输入生成一段「agent 过程」脚本：思考 → 步骤运行 → 工具调用 → 步骤完成 → 流式正文 → 结束。
// 用于在 Playground / 示例里演示 Agent 过程可视化。
export function createChatMockProvider(delayMs = 40): ChatProvider {
  return createMockProvider((input) => buildAgentScript(input), delayMs)
}

function buildAgentScript(input: string): ChatEvent[] {
  const reply = replyFor(input.trim())
  const chunks = chunkText(reply, 6)
  const events: ChatEvent[] = [
    { type: 'thinking', text: '正在分析问题…' },
    { type: 'step-status', stepId: 's1', status: 'running' },
    {
      type: 'tool-call-start',
      id: 't1',
      name: 'search_knowledge_base',
      args: JSON.stringify({ query: input.trim() }),
    },
    { type: 'tool-call-end', id: 't1', result: '命中 3 条相关文档', status: 'ok', latencyMs: 480 },
    { type: 'step-status', stepId: 's1', status: 'done' },
  ]
  for (const chunk of chunks) {
    events.push({ type: 'text-delta', id: '1', delta: chunk })
  }
  events.push({ type: 'done' })
  return events
}

function chunkText(text: string, size: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}

function replyFor(input: string): string {
  if (/机票|航班|飞/.test(input)) {
    return '已为你查到 CA1234 航班，¥680，含 20kg 托运行李。需要我帮你预订吗？'
  }
  if (/天气|气温/.test(input)) {
    return '今天北京晴，18~26℃，空气质量优，适合出行。'
  }
  if (/你好|hi|hello/i.test(input)) {
    return '你好！我是 AI 助手，可以帮你查资料、写代码、规划行程。有什么可以帮你的？'
  }
  return `我理解你的问题是：「${input.slice(0, 30)}」。已从知识库检索到相关信息并整理如下，如需深入可以继续追问。`
}
