<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = defineProps<{ streaming?: boolean }>()
const emit = defineEmits<{ (e: 'send', text: string): void; (e: 'stop'): void }>()

const text = ref('')
const taEl = ref<HTMLTextAreaElement | null>(null)

const canSend = computed(() => text.value.trim().length > 0 && !props.streaming)

function autoresize() {
  const el = taEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`
}

function submit() {
  const value = text.value.trim()
  if (!value || props.streaming) return
  emit('send', value)
  text.value = ''
  nextTick(autoresize)
}

function onKeydown(e: KeyboardEvent) {
  // isComposing：中文输入法选词回车不触发发送
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    submit()
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-2xl">
    <div
      class="rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow focus-within:border-slate-300 focus-within:shadow-md"
    >
      <textarea
        ref="taEl"
        v-model="text"
        rows="1"
        :disabled="streaming"
        class="block w-full resize-none bg-transparent px-4 pb-2 pt-3.5 text-sm leading-relaxed text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
        placeholder="给 AI Chat 发送消息"
        @input="autoresize"
        @keydown="onKeydown"
      />
      <div class="flex items-center justify-between px-2 pb-2">
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100"
            title="上传附件（演示）"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
              />
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="streaming" class="text-xs text-slate-400">生成中…</span>
          <button
            v-if="!streaming"
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white transition-colors disabled:bg-slate-200 disabled:text-slate-400"
            :disabled="!canSend"
            title="发送"
            @click="submit"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
          <button
            v-else
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700"
            title="停止"
            @click="emit('stop')"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <p class="mt-2 text-center text-xs text-slate-400">
      AI Chat UI 演示 · 回答由 Mock 生成，仅供参考
    </p>
  </div>
</template>
