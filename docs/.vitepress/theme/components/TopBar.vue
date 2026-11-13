<script setup lang="ts">
defineProps<{ collapsed: boolean; title: string }>()
const emit = defineEmits<{ (e: 'toggle'): void }>()
</script>

<template>
  <header
    class="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3"
  >
    <div class="flex min-w-0 items-center gap-1">
      <button
        type="button"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
        :title="collapsed ? '展开侧栏' : '收起侧栏'"
        @click="emit('toggle')"
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
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="9" y1="4" x2="9" y2="20" />
        </svg>
      </button>
      <span class="truncate text-sm font-semibold text-slate-800">{{ title }}</span>
    </div>

    <div class="flex items-center gap-1">
      <!-- mock 模型选择器 -->
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-100"
        title="模型选择（演示）"
      >
        <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span class="font-medium">GPT-4o</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
        title="分享（演示）"
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
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        </svg>
      </button>
    </div>
  </header>
</template>
