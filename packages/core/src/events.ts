// 后端无关的过程事件流契约（草案）
export type ToolCallStatus = 'ok' | 'error'
export type StepStatus = 'queued' | 'running' | 'done' | 'failed' | 'cancelled'

export type ChatEvent =
  | { type: 'text-delta'; id: string; delta: string }
  | { type: 'thinking'; text: string }
  | { type: 'tool-call-start'; id: string; name: string; args: string }
  | { type: 'tool-call-arg-delta'; id: string; delta: string }
  | { type: 'tool-call-end'; id: string; result: string; status: ToolCallStatus; latencyMs: number }
  | { type: 'step-status'; stepId: string; status: StepStatus }
  | { type: 'approval-request'; id: string; toolName: string; args: unknown; summary: string }
  | { type: 'error'; message: string }
  | { type: 'done' }
