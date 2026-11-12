import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// 开发时直接指向各包的源码，免去先 build 库包再跑 dev 的负担。
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@ai-chat-ui/core': fileURLToPath(new URL('../packages/core/src/index.ts', import.meta.url)),
      '@ai-chat-ui/ui': fileURLToPath(new URL('../packages/ui/src/index.ts', import.meta.url)),
      '@ai-chat-ui/adapters': fileURLToPath(
        new URL('../packages/adapters/src/index.ts', import.meta.url),
      ),
    },
  },
})
