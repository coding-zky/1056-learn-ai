<script setup lang="ts">
const emit = defineEmits<{ (e: 'pick', text: string): void }>()

// 推荐问题覆盖 Mock 的关键词模板（机票/天气），并引导体验 Agent 过程可视化
const suggestions = [
  { icon: '✈️', label: '帮我查一下北京到上海的机票' },
  { icon: '🌤️', label: '今天杭州天气怎么样' },
  { icon: '🧠', label: '展示一下你的推理过程' },
  { icon: '✍️', label: '写一首关于秋天的诗' },
]
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center px-6 py-8">
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-semibold text-white shadow-sm"
      >
        AI
      </div>
      <h1 class="text-2xl font-semibold text-slate-800">有什么可以帮你的？</h1>
    </div>

    <div class="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        v-for="s in suggestions"
        :key="s.label"
        type="button"
        class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
        @click="emit('pick', s.label)"
      >
        <span class="text-lg leading-none">{{ s.icon }}</span>
        <span class="min-w-0 truncate">{{ s.label }}</span>
      </button>
    </div>
  </div>
</template>
