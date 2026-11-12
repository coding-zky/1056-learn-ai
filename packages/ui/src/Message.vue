<script setup lang="ts">
defineProps<{ content: string }>()
</script>

<template>
  <div class="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{{ content }}</div>
</template>
