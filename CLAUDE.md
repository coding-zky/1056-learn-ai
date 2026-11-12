# CLAUDE.md

本文件是 Claude Code 在此仓库工作时的指引。

## 项目是什么

AI 聊天界面组件库（Vue 3 + TypeScript，pnpm monorepo）。差异化卖点：**Agent 过程可视化** + **后端无关**（Provider 抽象层）+ **Headless**。完整设计见上层目录的 `AI聊天界面组件库技术方案.md`。

当前处于 **Phase 0 已完成**：骨架、Provider 抽象、最小 `Chat` 已跑通。下一步是 Phase 1（基础聊天 + 文档）。

## 常用命令

```bash
pnpm dev        # 启动 playground（Vite SPA）
pnpm build      # 拓扑顺序构建 core → ui → adapters → playground
pnpm test       # Vitest run（单一根配置 vitest.config.ts）
pnpm test:watch
pnpm lint       # ESLint（flat config，eslint.config.mjs）
pnpm lint:fix
```

## 目录与包

- `packages/core` — `ChatProvider` / `ChatEvent` / `useChat`。**零依赖 AI SDK**。
- `packages/ui` — 渲染组件（`Chat` / `Message`），依赖 core + reka-ui，Tailwind 样式。
- `packages/adapters` — 后端适配器，当前只有 `createMockProvider`；后续 AiSdk / AgUi / Custom。
- `playground` — 开发调试，alias 直接指向各包 `src/index.ts`，dev 无需先 build。

## 架构约定（改代码前先看）

- **事件契约优先**：`ChatEvent` 在 `packages/core/src/events.ts`，是组件与 provider 之间唯一契约。新增事件类型要同步 `useChat`（core）和所有 provider（adapters）。
- **Headless 分层**：每个能力 = `useXxx()` composable（状态/逻辑）+ `<Xxx />` 组件（纯渲染）。UI 不写业务逻辑。
- **copyable-first**：UI 组件自包含、少内部 import，为后期 registry/CLI 铺路。
- **core 不 import `ai`**：只有 `adapters` 依赖 `ai` / `@ai-sdk/vue`。别把 AI SDK 引到 core / ui。
- 包名统一 `@ai-chat-ui/*`；技术方案里写的 `@lib/*` 是占位，实际以 `@ai-chat-ui/*` 为准。

## 易踩的坑（务必遵守）

- **registry**：项目 `.npmrc` 已固定 `https://registry.npmjs.org/`（npmmirror 慢约 18 倍 + 偶发 ECONNRESET），不要改回镜像。
- **typescript 用 6.x（`<6.1.0`，受 typescript-eslint 8 peer 约束）**：`latest` 是 7.x（原生 Go 编译器）不兼容，用 6.x 最新（当前 6.0.3），别升 7.x。vite/vitest 实际走 esbuild，TS 只做类型检查。
- **测试配置在根**：`vitest.config.ts`（含 workspace alias）+ `vitest.setup.ts`（ResizeObserver / IntersectionObserver / matchMedia 的 happy-dom polyfill）。不要在子包再建 vitest.config。
- **Tailwind v4**：playground 的 `style.css` 用 `@source "../../packages/ui/src/**"` 显式扫描 ui 包源码；新增组件若类名不被扫描到，构建产物会缺样式。
- **构建是 lib mode（ESM only）**：各包 `vite.config.ts` 里 external 了 peer 依赖（core external `vue`；ui external `vue`/`@ai-chat-ui/core`/`reka-ui`；adapters external `vue`/`@ai-chat-ui/core`）。

## 测试

- 单元测试用 Vitest, 放在对应模块的 ‘.test.ts’文件旁
- 组件测试用 ‘@vue/test-utils’
- 'pnpm test' 从根目录跑所有包的测试

## 代码修改规范

- 不要删除你不确定是否使用的代码，先标记 TODO
- 不要重构你没有被要求重构的代码
- 不要修改你不直接相关的文件
- 每次改动只做被要求的事，不多不少
- 修改前先阅读相关文件，理解上下文

## Git 提交规范

- 使用 Conventional Commits 格式
- commit message 使用中文 subject
- subject 不超过 59字
- body 说明“为什么改”而非“改了什么”
- scope 使用模块名（button、input、theme、 docs)
- 当用户要求提交代码的时候，尽可能只提交当前会话中相关的功能代码或文件

## Git 分支与 PR 工作流

采用 **GitHub Flow**：`main` 主干 + 短生命周期功能分支，一切改动经 PR 进入 `main`。

### 分支命名

从最新 `main` 切分支，格式 `<type>/<issue>-<短描述>`：

- `feat/12-prompt-input`
- `fix/15-streaming-perf`
- `docs/setup-guide`
- `chore/ci-setup`

`type` 与 Conventional Commits 一致：`feat` / `fix` / `docs` / `chore` / `refactor` / `perf` / `test` / `build` / `ci` / `revert`。有对应 issue 时带上 issue 号，便于回溯。

### 流程

1. `git switch main && git pull` 拉到最新。
2. 按上方规范切分支。
3. 开发 + 提交（遵循「Git 提交规范」）。
4. 推分支：`git push -u origin <分支名>`。
5. 创建 PR 到 `main`（见下「对 Claude 的约定」）。
6. review 通过后 **squash merge** 回 `main`，删除源分支。

### 规则

- **禁止直接 push 到 `main`**，一切改动走 PR。
- 每个 PR 对应一个 issue；描述里用 `Closes #<号>` / `Refs #<号>` 关联。

### 对 Claude 的约定（开发完成后的自动化）

用户完成某 issue 的功能开发并提交后，Claude 需要：

1. 检查 GitHub 最新 issues，定位本次改动对应的 issue；
2. 在远端创建「当前功能分支 → `main`」的 PR；
3. 编写 PR：
   - **标题**：Conventional Commits 格式（与提交一致，如 `feat: 新增 PromptInput 组件`）；
   - **描述**：变更概述 + 关联 issue（`Closes #<号>`）+ 测试/验证情况。

## 版本基线

Vue 3.5 · Vite 8 · TypeScript 6.0 · Vitest 5 · ESLint 10（flat）· reka-ui 2.11 · Tailwind 4.3 · pnpm 10 · Node ≥ 18。
