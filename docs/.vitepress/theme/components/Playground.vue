<script setup lang="ts">
import { Repl, useStore, useVueImportMap } from '@vue/repl'
import CodeMirror from '@vue/repl/codemirror-editor'

// TODO: 二期把 @ai-chat-ui/core|ui|adapters 打成单文件 ESM 接进 import map，
// 并把 ui 的 Tailwind 编译产物注入预览 iframe，让用户在 REPL 里直接编辑 Button/Chat 等组件。
// 当前为轻量版：示例只依赖 CDN 的 vue，真实组件交互见组件文档页或 playground SPA。

const { importMap, vueVersion } = useVueImportMap()
const store = useStore({ builtinImportMap: importMap, vueVersion })

store.setFiles(
  {
    'App.vue': `<script setup>
import { ref } from 'vue'

const count = ref(0)
<\/script>

<template>
  <button @click="count++">count is {{ count }}</button>
</template>`,
  },
  'App.vue',
)
</script>

<template>
  <Repl :store="store" :editor="CodeMirror" />
</template>
