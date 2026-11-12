<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  code: string
  title?: string
}>()

const showCode = ref(false)
const copied = ref(false)

function toggleCode() {
  showCode.value = !showCode.value
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // 非安全上下文下无 clipboard，静默失败不抛错
  }
}
</script>

<template>
  <div class="demo-block">
    <div class="demo-block__preview">
      <slot />
    </div>
    <div class="demo-block__meta">
      <span v-if="title" class="demo-block__title">{{ title }}</span>
      <div class="demo-block__actions">
        <button class="demo-block__btn" type="button" @click="toggleCode">
          {{ showCode ? '隐藏代码' : '显示代码' }}
        </button>
        <button class="demo-block__btn" type="button" @click="copy">
          {{ copied ? '已复制' : '复制' }}
        </button>
      </div>
    </div>
    <pre v-if="showCode" class="demo-block__code"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.demo-block {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.demo-block__preview {
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.demo-block__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.demo-block__title {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.demo-block__actions {
  display: flex;
  gap: 8px;
}

.demo-block__btn {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.demo-block__btn:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.demo-block__code {
  margin: 0;
  padding: 16px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-code-block-bg, var(--vp-c-bg-soft));
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}
</style>
