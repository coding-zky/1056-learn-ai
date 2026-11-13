<script setup lang="ts">
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
} from 'reka-ui'
import type { ToolCallState, StepState } from '@ai-chat-ui/core'

defineProps<{
  thinking?: string
  toolCalls?: ToolCallState[]
  steps?: StepState[]
}>()

const statusText = (status: string) =>
  status === 'running' ? '运行中' : status === 'error' ? '失败' : '完成'
</script>

<template>
  <div
    v-if="thinking || (toolCalls && toolCalls.length) || (steps && steps.length)"
    class="mb-2 space-y-2"
  >
    <div v-if="thinking" class="text-xs italic text-slate-400">💭 {{ thinking }}</div>

    <TooltipProvider>
      <div v-if="toolCalls && toolCalls.length" class="flex flex-wrap gap-2">
        <TooltipRoot v-for="call in toolCalls" :key="call.id">
          <TooltipTrigger as-child>
            <span
              class="inline-flex cursor-default items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="
                  call.status === 'running'
                    ? 'bg-amber-400'
                    : call.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-emerald-500'
                "
              />
              {{ call.name }}
            </span>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent
              class="z-50 max-w-xs rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow"
            >
              {{ statusText(call.status)
              }}<template v-if="call.result"> · {{ call.result }}</template>
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </div>
    </TooltipProvider>

    <div v-if="steps && steps.length" class="flex flex-wrap gap-1.5">
      <span
        v-for="step in steps"
        :key="step.stepId"
        class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500"
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="
            step.status === 'done'
              ? 'bg-emerald-500'
              : step.status === 'failed'
                ? 'bg-red-500'
                : step.status === 'running'
                  ? 'bg-amber-400'
                  : 'bg-slate-300'
          "
        />
        {{ step.stepId }}
      </span>
    </div>
  </div>
</template>
