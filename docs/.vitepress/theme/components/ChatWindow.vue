<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { ChatMessage } from '@ai-chat-ui/core'
import { Message, AgentProcess } from '@ai-chat-ui/ui'
import Welcome from './Welcome.vue'
import Composer from './Composer.vue'

const props = defineProps<{ messages: ChatMessage[]; streaming: boolean }>()
const emit = defineEmits<{ (e: 'send', text: string): void; (e: 'stop'): void }>()

const listEl = ref<HTMLElement | null>(null)

// 新消息或流式增长时自动滚到底部
watch(
  () => [props.messages.length, props.messages[props.messages.length - 1]?.content.length],
  async () => {
    await nextTick()
    listEl.value?.scrollTo({ top: listEl.value.scrollHeight })
  },
)
</script>

<template>
  <section class="flex flex-1 flex-col overflow-hidden bg-white">
    <template v-if="!messages.length">
      <Welcome @pick="emit('send', $event)" />
    </template>
    <template v-else>
      <div ref="listEl" class="flex-1 overflow-y-auto px-4 py-6">
        <div class="mx-auto flex max-w-2xl flex-col gap-6">
          <div v-for="msg in messages" :key="msg.id">
            <!-- 用户消息：复用 Message 的 chatgpt 变体（右侧深色气泡） -->
            <Message
              v-if="msg.role === 'user'"
              :content="msg.content"
              role="user"
              :status="msg.status"
              variant="chatgpt"
            />
            <!-- AI 消息：左侧 logo + 过程可视化 + 正文（Message chatgpt 变体无背景） -->
            <div v-else class="flex gap-3">
              <div
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white"
              >
                AI
              </div>
              <div class="min-w-0 flex-1">
                <AgentProcess
                  :thinking="msg.thinking"
                  :tool-calls="msg.toolCalls"
                  :steps="msg.steps"
                />
                <Message
                  v-if="msg.content"
                  :content="msg.content"
                  :status="msg.status"
                  variant="chatgpt"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="shrink-0 px-4 pb-4 pt-2">
      <Composer :streaming="streaming" @send="emit('send', $event)" @stop="emit('stop')" />
    </div>
  </section>
</template>
