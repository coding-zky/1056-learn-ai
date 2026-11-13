import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// 单一根配置，统一管理所有包的测试环境。
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@ai-chat-ui/core': fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
      '@ai-chat-ui/ui': fileURLToPath(new URL('./packages/ui/src/index.ts', import.meta.url)),
      '@ai-chat-ui/adapters': fileURLToPath(
        new URL('./packages/adapters/src/index.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['packages/**/*.{test,spec}.ts', 'docs/**/*.{test,spec}.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
})
