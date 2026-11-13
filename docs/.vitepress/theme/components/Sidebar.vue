<script setup lang="ts">
import { ref, computed } from 'vue'
import type { StoredConversation } from './conversation-store'

const props = defineProps<{
  conversations: StoredConversation[]
  activeId: string
}>()

const emit = defineEmits<{
  (e: 'new-chat'): void
  (e: 'select', id: string): void
  (e: 'remove', id: string): void
}>()

const keyword = ref('')

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return props.conversations
  return props.conversations.filter((c) => c.title.toLowerCase().includes(kw))
})
</script>

<template>
  <aside class="flex h-full w-64 shrink-0 flex-col bg-slate-50">
    <div class="p-2.5">
      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        @click="emit('new-chat')"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        新建对话
      </button>
    </div>

    <div class="px-2.5 pb-2">
      <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="shrink-0 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="keyword"
          class="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="搜索对话"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-2.5 pb-2">
      <div v-if="!keyword" class="px-2 py-1.5 text-xs font-medium text-slate-400">对话</div>
      <div
        v-for="conv in filtered"
        :key="conv.id"
        class="group relative mb-0.5 flex cursor-pointer items-center rounded-lg px-2.5 py-2 text-sm transition-colors"
        :class="conv.id === activeId ? 'bg-slate-200/70' : 'hover:bg-slate-200/50'"
        @click="emit('select', conv.id)"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mr-2 shrink-0 text-slate-400"
        >
          <path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" />
        </svg>
        <span class="flex-1 truncate text-slate-700">{{ conv.title }}</span>
        <button
          type="button"
          class="ml-1 shrink-0 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
          title="删除"
          @click.stop="emit('remove', conv.id)"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
      <div v-if="!filtered.length" class="px-3 py-6 text-center text-sm text-slate-400">
        {{ keyword ? '无匹配对话' : '暂无历史对话' }}
      </div>
    </div>

    <div class="border-t border-slate-200 p-2.5">
      <div
        class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-200/50"
      >
        <div
          class="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-xs text-white"
        >
          访
        </div>
        <div class="text-sm text-slate-700">访客用户</div>
      </div>
    </div>
  </aside>
</template>
