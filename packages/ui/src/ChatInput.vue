<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = withDefaults(defineProps<{ disabled?: boolean; variant?: 'default' | 'chatgpt' }>(), {
  variant: 'default',
})
const emit = defineEmits<{ (e: 'send', text: string): void }>()

const text = ref('')
const taEl = ref<HTMLTextAreaElement | null>(null)

const isChatGpt = computed(() => props.variant === 'chatgpt')

function autoresize() {
  const el = taEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`
}

function submit() {
  const value = text.value.trim()
  if (!value || props.disabled) return
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
  <div
    class="flex items-end gap-2"
    :class="isChatGpt ? 'rounded-3xl border border-slate-200 bg-white p-2 shadow-sm' : ''"
  >
    <textarea
      ref="taEl"
      v-model="text"
      rows="1"
      :disabled="disabled"
      class="max-h-40 min-h-10 flex-1 resize-none text-sm text-slate-800 outline-none disabled:opacity-50"
      :class="
        isChatGpt
          ? 'bg-transparent px-2 py-1.5'
          : 'rounded-lg border border-slate-200 bg-white px-3 py-2 focus:border-blue-500'
      "
      placeholder="输入消息，Enter 发送，Shift+Enter 换行"
      @input="autoresize"
      @keydown="onKeydown"
    />
    <button
      type="button"
      class="text-sm font-medium transition-colors disabled:opacity-50"
      :class="
        isChatGpt
          ? 'h-8 w-8 shrink-0 rounded-full bg-slate-900 text-white disabled:bg-slate-200 disabled:text-slate-400'
          : 'rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
      "
      :disabled="disabled || !text.trim()"
      @click="submit"
    >
      <svg
        v-if="isChatGpt"
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
      <template v-else>发送</template>
    </button>
  </div>
</template>
