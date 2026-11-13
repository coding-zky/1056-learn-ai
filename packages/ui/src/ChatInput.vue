<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ (e: 'send', text: string): void }>()

const text = ref('')

function submit() {
  const value = text.value.trim()
  if (!value || props.disabled) return
  emit('send', value)
  text.value = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}
</script>

<template>
  <div class="flex flex-1 items-end gap-2">
    <textarea
      v-model="text"
      rows="1"
      :disabled="disabled"
      class="max-h-40 min-h-[40px] flex-1 resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 disabled:opacity-50"
      placeholder="输入消息，Enter 发送，Shift+Enter 换行"
      @keydown="onKeydown"
    />
    <button
      type="button"
      class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      :disabled="disabled || !text.trim()"
      @click="submit"
    >
      发送
    </button>
  </div>
</template>
