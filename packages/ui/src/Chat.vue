<script setup lang="ts">
import { useChat } from '@ai-chat-ui/core'
import type { ChatProvider } from '@ai-chat-ui/core'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
} from 'reka-ui'
import Message from './Message.vue'

const props = defineProps<{ provider: ChatProvider }>()

const { text, toolCalls, streaming, start, stop } = useChat({ provider: props.provider })

const statusText = (status: string) =>
  status === 'running' ? '运行中' : status === 'error' ? '失败' : '完成'
</script>

<template>
  <div class="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="min-h-[120px]">
      <TooltipProvider>
        <div v-if="toolCalls.length" class="mb-3 flex flex-wrap gap-2">
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
                {{ statusText(call.status) }}<template v-if="call.result"> · {{ call.result }}</template>
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </div>
      </TooltipProvider>

      <Message :content="text" />
    </div>

    <div class="mt-3 flex gap-2">
      <button
        class="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white transition-colors hover:bg-slate-700"
        @click="start"
      >
        发送
      </button>
      <button
        v-if="streaming"
        class="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
        @click="stop"
      >
        停止
      </button>
    </div>
  </div>
</template>
