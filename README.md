# AI Chat UI

一个基于 **Vue 3 + TypeScript** 的 AI 聊天界面组件库。核心差异化是 **Agent 过程可视化** —— 让用户看到 Agent 每一步在干什么、调了什么工具、走到哪、哪里可以插手，而不只是看到最终回复。

> 仓库：https://github.com/coding-zky/1056-learn-ai · 走「前期开源、后期商业化」路径。

---

## 技术栈与技术特点

### 技术栈

| 层       | 选型                                          | 版本基线                       |
| -------- | --------------------------------------------- | ------------------------------ |
| 语言     | TypeScript（strict）                          | 6.0                            |
| UI 框架  | Vue 3（Composition API，`<script setup>`）    | 3.5                            |
| AI 底座  | Vercel AI SDK（`ai` + `@ai-sdk/vue`）         | 经 Provider 抽象层隔离，可替换 |
| 无头基座 | reka-ui（Radix 的 Vue 移植，无障碍 + 行为）   | 2.11                           |
| 样式     | Tailwind CSS v4 + CSS Variables               | 4.3                            |
| 构建     | Vite（库包走 lib mode，ESM only）             | 8                              |
| 文档     | VitePress（中文优先）                         | 1.6                            |
| 仓库     | pnpm Monorepo（workspace）                    | 10                             |
| 测试     | Vitest + Vue Test Utils + happy-dom           | 5                              |
| 代码质量 | ESLint（flat config）+ Prettier               | ESLint 10                      |
| Git 质量 | husky + commitlint + lint-staged              | —                              |
| 运行环境 | Node ≥ 18，现代 evergreen 浏览器，client-only | —                              |

### 五个技术特点

1. **后端无关** —— 组件只认一份标准事件流 `ChatEvent`，不绑定任何模型 / 后端；切换数据源不改组件代码。
2. **Agent 过程可视化** —— 思考、工具调用、步骤状态、审批点全程可见、可干预（差异化尖刀，Vue 侧几乎空白）。
3. **Headless** —— 逻辑（composable）与样式（UI 组件）分层；只拿 `useChat` 自己写界面也行，整体换主题也行。
4. **按需安装** —— `core` / `ui` / `adapters` 独立子包，想用哪块装哪块，不打全家桶。
5. **流式优先** —— 生成类能力原生支持 token 流、停止（abort）、错误、重试。

---

## 当前状态与已完成功能

- ✅ **Phase 0 完成**：Monorepo 骨架 + Provider 抽象层 + 最小 `Chat` 跑通一条流。
- ✅ **核心契约与状态层**：`ChatEvent`（9 种事件）+ `ChatProvider` 接口 + `useChat` composable。
- ✅ **基础组件**：`Chat`（聊天容器）、`Message`（消息）、`Button`（通用按钮，`variant`/`size`/`disabled`）。
- ✅ **演示 Adapter**：`createMockProvider`（内存事件流，演示「后端无关」）。
- ✅ **VitePress 文档站**：指南 6 篇、组件文档 3 篇、组件总览、全屏在线 Playground、`DemoBlock` 静态示例容器。
- ✅ **工程化**：ESLint flat + Prettier + husky + commitlint + lint-staged。
- ✅ **测试**：Vitest + Vue Test Utils，`core` / `adapters` / `ui` / 文档组件均有用例。
- ✅ **容器化部署**：Docker 多阶段构建 + nginx 托管静态产物。

> 尚未完成（规划中）：`PromptInput`、`StreamingMarkdown`、多轮会话；三个一等 Adapter（`AiSdkProvider` / `AgUiProvider` / `CustomProvider`）；Agent 可视化组件（Phase 2）。

---

## 架构

```
UI 组件（纯渲染：Chat / Message / Button）
        ↓ 消费
ChatProvider 接口（标准化事件流 ChatEvent）
        ↑ 实现
Adapter：MockProvider（已有）｜ AiSdkProvider ｜ AgUiProvider ｜ CustomProvider（规划）
        ↑ 对接
后端：内存脚本 ｜ Vercel AI SDK 流 ｜ AG-UI 协议 ｜ 自定义 SSE / 回调
```

- **`ChatProvider` + `ChatEvent`** 是库内定义的唯一契约，组件只认它，永远不知道背后是谁。
- **core 零依赖 AI SDK**：`@ai-chat-ui/core` 不 import `ai`，只有 adapter 依赖它——「只装 core」不连带 AI SDK。
- **Headless 分层**：每个能力 = `useXxx()` composable（状态 / 逻辑）+ `<Xxx />` 组件（纯渲染）。UI 不写业务逻辑。

---

## 目录结构

采用 pnpm workspace 组织的 Monorepo，遵循「库包 / 应用 / 文档」分离的业界惯例。

```
vue3+vite/
├── packages/                        # 发布到 npm 的公共包（@ai-chat-ui/*）
│   ├── core/                        # @ai-chat-ui/core —— Provider 抽象 + 事件契约 + composables
│   │   └── src/
│   │       ├── events.ts            #   ChatEvent 事件契约（9 种）
│   │       ├── provider.ts          #   ChatProvider 接口
│   │       ├── useChat.ts           #   核心 composable
│   │       └── index.ts             #   包出口
│   ├── ui/                          # @ai-chat-ui/ui —— 渲染组件（依赖 core + reka-ui）
│   │   └── src/
│   │       ├── Button.vue           #   通用按钮
│   │       ├── Chat.vue             #   聊天容器
│   │       ├── Message.vue          #   单条消息
│   │       └── index.ts             #   包出口
│   └── adapters/                    # @ai-chat-ui/adapters —— 后端适配器（依赖 core + ai）
│       └── src/
│           ├── mock-provider.ts     #   createMockProvider（演示用）
│           └── index.ts             #   包出口
├── playground/                      # 开发调试 SPA（Vite，alias 直指各包源码）
│   └── src/
│       ├── App.vue                  #   最小演示：mock 事件流 → <Chat>
│       ├── main.ts
│       └── style.css                #   Tailwind v4 入口（@source 扫描 ui 包源码）
├── docs/                            # VitePress 文档站（pnpm docs:dev 启动）
│   ├── .vitepress/
│   │   ├── config.mts               #   站点配置 + alias 直指各包源码
│   │   └── theme/
│   │       ├── index.ts             #   主题入口（注册 DemoBlock）
│   │       └── components/          #   DemoBlock.vue / PlaygroundApp.vue 等
│   ├── guide/                       #   指南（介绍 / 设计 / 安装 / 快速上手 / provider / 可视化）
│   ├── component/                   #   组件文档（button / chat / message / index）
│   └── examples/                    #   文档内示例源码（.vue，供 DemoBlock 引用）
├── package.json                     # 根 package：scripts + devDependencies
├── pnpm-workspace.yaml              # workspace 声明（packages/* + playground + docs）
├── tsconfig.base.json               # 共享 TS 编译配置
├── vitest.config.ts                 # 单一测试根配置（workspace alias）
├── vitest.setup.ts                  # 测试环境 polyfill（ResizeObserver 等）
├── eslint.config.mjs                # ESLint flat config
├── commitlint.config.mjs            # Conventional Commits 校验
├── .prettierrc.json                 # Prettier 配置
├── Dockerfile                       # 多阶段构建（base → build → serve）
├── nginx.conf                       # 生产 nginx 配置（SPA 回退 + 静态缓存 + 健康检查）
└── .dockerignore                    # 构建上下文排除清单
```

### 目录组织约定（后续扩展）

- **新增组件** → 放入 `packages/ui/src/`，并在 `index.ts` 导出；同目录旁挂 `Xxx.test.ts`，文档写到 `docs/component/`、示例放到 `docs/examples/`。组件类名需被 `playground/src/style.css` 的 `@source` 扫描到。
- **新增 composable** → 放入 `packages/core/src/`，保持「零依赖 AI SDK」。
- **新增 Adapter** → 放入 `packages/adapters/src/`，实现 `ChatProvider` 接口；这是唯一允许 import `ai` / `@ai-sdk/vue` 的包。
- **新增事件类型** → 改 `packages/core/src/events.ts`，并同步 `useChat`（core）与所有 provider（adapters）。
- **未来 registry / CLI** → 独立顶层目录（如 `packages/registry`、`packages/cli`），不混入现有三个库包。

---

## 快速开始

环境要求：**Node ≥ 18，pnpm ≥ 9**（仓库已固定 `packageManager: pnpm@10.34.4`）。

```bash
pnpm install      # 安装依赖（.npmrc 已固定 registry.npmjs.org，勿改回镜像）
pnpm dev          # 启动 playground（Vite SPA，alias 直指各包源码，改库包免先 build）
pnpm docs:dev     # 启动 VitePress 文档站
pnpm build        # 按拓扑顺序构建 core → ui → adapters → playground
pnpm docs:build   # 构建文档站
pnpm preview      # 预览 playground 构建产物
```

```bash
pnpm test         # Vitest run（跑全部包用例）
pnpm test:watch   # Vitest watch 模式
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm format       # Prettier 全量格式化
pnpm format:check # Prettier 格式校验
```

> `pnpm dev` 打开的是 playground SPA（开发调试核心组件）；`pnpm docs:dev` 打开的是 VitePress 文档站（完整指南 + 组件示例 + 内嵌 Playground）。两者均通过 Vite `alias` 直指各包 `src/index.ts`，改库包源码无需先 build。

---

## 文档站（VitePress）

```bash
pnpm docs:dev     # 本地开发文档站
pnpm docs:build   # 构建产物（含本地搜索索引）
```

- **指南**：介绍、设计理念、安装、快速上手、后端无关、Agent 过程可视化
- **组件**：`Button` / `Chat` / `Message` 的用法、示例与 API
- **Playground**：全屏在线 Playground（ChatGPT 风格聊天页，会话本地持久化）

---

## 使用示例

### 组件用法

`<Chat>` 只认 `ChatProvider`，与后端解耦：

```ts
import { Chat } from '@ai-chat-ui/ui'
import { createMockProvider } from '@ai-chat-ui/adapters'

const provider = createMockProvider([
  { type: 'thinking', text: '正在思考…' },
  { type: 'tool-call-start', id: 't1', name: 'search_flights', args: '{}' },
  { type: 'tool-call-end', id: 't1', result: 'CA1234 ¥680', status: 'ok', latencyMs: 1200 },
  { type: 'text-delta', id: '1', delta: '已为你找到最便宜的航班。' },
  { type: 'done' },
])
```

```vue
<Chat :provider="provider" />
```

### Headless 用法

只拿逻辑，自己写界面：

```ts
import { useChat } from '@ai-chat-ui/core'

const { text, toolCalls, streaming, error, start, stop } = useChat({ provider })
```

---

## 事件契约（ChatEvent）

后端无关的过程事件流，是组件与 provider 之间唯一的契约（`packages/core/src/events.ts`）：

```ts
type ToolCallStatus = 'ok' | 'error'
type StepStatus = 'queued' | 'running' | 'done' | 'failed' | 'cancelled'

type ChatEvent =
  | { type: 'text-delta'; id: string; delta: string } // 正文增量
  | { type: 'thinking'; text: string } // 思考过程
  | { type: 'tool-call-start'; id: string; name: string; args: string } // 工具调用开始
  | { type: 'tool-call-arg-delta'; id: string; delta: string } // 参数增量
  | { type: 'tool-call-end'; id: string; result: string; status: ToolCallStatus; latencyMs: number } // 工具调用结束
  | { type: 'step-status'; stepId: string; status: StepStatus } // 步骤状态
  | { type: 'approval-request'; id: string; toolName: string; args: unknown; summary: string } // 请求审批
  | { type: 'error'; message: string } // 出错
  | { type: 'done' } // 本轮结束
```

```ts
interface ChatSubscription {
  unsubscribe(): void // 解绑
  abort(): void // 中止本轮
}

interface ChatProvider {
  subscribe(handlers: { onEvent: (e: ChatEvent) => void }): ChatSubscription
}
```

---

## 组件

当前已实现的组件（详见[文档站](https://github.com/coding-zky/1056-learn-ai)）：

| 组件      | 包               | 说明                                                                                              |
| --------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `Button`  | `@ai-chat-ui/ui` | 通用按钮，`variant`（primary/secondary/ghost）、`size`（sm/md/lg）、`disabled`                    |
| `Chat`    | `@ai-chat-ui/ui` | 聊天容器，props `provider: ChatProvider`，内部消费 `useChat`，渲染文本 + 工具调用状态 + 开始/停止 |
| `Message` | `@ai-chat-ui/ui` | 单条文本消息，props `content: string`                                                             |

---

## 开发与部署

### 本地开发

1. `pnpm install` 安装依赖。
2. 开发库包时用 `pnpm dev`（playground 与文档站均通过 Vite `alias` 直指各包 `src/index.ts`，**改库包源码无需先 build**）。
3. 改动提交前会经 husky 钩子自动跑 lint-staged（`prettier --write` + `eslint --fix`）；commit message 需符合 Conventional Commits（commitlint 校验，中文 subject）。

### 构建

```bash
pnpm build   # 拓扑顺序：core → ui → adapters → playground
```

- 库包走 Vite **lib mode（ESM only）**，输出到各自 `dist/`，并 external 掉 peer 依赖（core external `vue`；ui external `vue`/`@ai-chat-ui/core`/`reka-ui`；adapters external `vue`/`@ai-chat-ui/core`）。
- 文档站单独构建：`pnpm docs:build`。

### 容器化部署（Docker + nginx）

仓库提供了多阶段 Dockerfile，产出只含静态产物的最小运行时镜像：

```bash
# 构建镜像（国内网络可加 --build-arg NPM_REGISTRY=https://registry.npmmirror.com）
docker build -t ai-chat-ui-playground .

# 运行（本机 8888 映射到容器 80）
docker run --rm -p 8888:80 ai-chat-ui-playground
```

构建流程分三阶段：

1. **base** —— `node:22-alpine` + 固定版本 pnpm，安装 `libc6-compat`。
2. **build** —— 先只 COPY 各包 `package.json` + lockfile 再 `pnpm install --frozen-lockfile`（依赖层可独立缓存），随后 COPY 源码 `pnpm build`；容器内设 `HUSKY=0` 跳过 prepare 钩子、`npm_config_package_import_method=copy` 规避 Docker Desktop gRPC-FUSE 的 SIGBUS。
3. **serve** —— `nginx:alpine` 托管 `playground/dist`，带 `HEALTHCHECK`（`/healthz`）。

`nginx.conf` 要点：SPA 路由回退（`try_files ... /index.html`）、带 hash 的静态资源 `immutable` 长缓存、`/healthz` 健康检查端点。

---

## 开发规范

- **提交**：Conventional Commits，subject 用中文、不超过 59 字，body 说明「为什么改」而非「改了什么」，scope 用模块名。
- **分支**：GitHub Flow —— 从最新 `main` 切 `feat/2-button` 式功能分支，改动经 PR 进入 `main`，squash merge 后删源分支，不直接 push `main`。
- **质量**：husky + lint-staged 在提交前自动跑 Prettier 与 ESLint；commitlint 校验提交信息。

---

## 路线图

- [x] **Phase 0**：Monorepo 骨架 + Provider 抽象层 + 最小 `Chat` 跑通一条流
- [x] **基础组件**：`Button` / `Chat` / `Message` + **VitePress 文档站**（指南 / 组件 / Playground）
- [ ] **Phase 1**：基础聊天（多轮会话 / `PromptInput` / `StreamingMarkdown`）
- [ ] **Phase 2**：Agent 可视化组件（`ThinkingState` / `ToolCallCard` / `AgentRunTimeline` / `ApprovalGate` / `AgentPanel`）
- [ ] **Phase 3**：多模态 + 主题系统 + 示例 app
- [ ] **Phase 4**：发布 npm（core / adapters）+ registry / CLI

---

## 更多

- 完整设计见 [技术方案文档](../AI聊天界面组件库技术方案.md)。
- 文档站（VitePress）：`pnpm docs:dev`，含指南、组件文档与全屏在线 Playground。

## License

开源期 MIT；商业化能力（高级 Agent 可视化、企业 provider 等）另行授权。
