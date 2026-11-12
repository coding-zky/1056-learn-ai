# VitePress 文档站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `ai-chat-ui` 搭一个 VitePress 开源组件文档站（首页 + 顶部导航「指南/组件/Playground/GitHub」+ 左侧边栏 + 本地搜索 + 暗黑模式 + 静态组件 Demo + 内嵌 Playground）。

**Architecture:** 新建 `docs/` 作为 pnpm workspace 私有包；VitePress 通过 vite alias 直连各包 `src/index.ts`（dev 免 build、HMR 生效）；库组件是 Tailwind 工具类，文档站用 Tailwind v4 `@source` 扫描 `packages/ui/src/**` 让 Demo 有样式；组件 Demo 用自建的 `DemoBlock` 组件（预览 + `?raw` 源码 + 复制）；Playground 用 `@vue/repl`。

**Tech Stack:** VitePress（最新稳定版）、Vue 3.5、Tailwind v4（`@tailwindcss/vite`）、`@vue/repl`（Playground）、`reka-ui`（ui 组件的 peer 依赖）、pnpm workspace。

**Spec:** `2026-11-12-vitepress-docs-design.md`（本仓库根目录）

## Global Constraints

- **core 不 import `ai`**：文档站/渲染层不得把 AI SDK 引到 `core` / `ui`。当前 mock provider 路径只 import `@ai-chat-ui/core`，不触 `ai`。
- **中文优先，v1 仅 zh-CN**：不建多语言目录，但内容按 `guide/`、`component/` 分组，为以后补 `en-US` 留结构。
- **库组件样式是 Tailwind 工具类**：文档站必须 `@source` 显式扫描 `packages/ui/src/**`，否则 Demo 渲染无样式。
- **`ui` 依赖 `reka-ui`（peer）**：`docs` 需把 `reka-ui@^2.11.0` 列为依赖，否则 `Chat.vue` 的 reka-ui import 解析失败。
- **测试配置在根 `vitest.config.ts`**：不在子包新建 vitest 配置；本 plan 需把 `docs/**/*.{test,spec}.ts` 加进根配置的 `include`。
- **包名 `@ai-chat-ui/*`**：文档站 alias 与 import 统一用这三个包名。
- 版本对齐：`vue@^3.5.45`、`tailwindcss@^4.3.5` + `@tailwindcss/vite@^4.3.5`、`reka-ui@^2.11.0`。

## Review Focus

以下是最可能「用户上手时踩到」而 spec 没明说、单测又不覆盖的失败点，每个都挂到对应任务里验证：

1. **Tailwind preflight 破坏 VitePress 默认主题**（导航/排版错乱）→ Task 1、Task 6：无头 Chrome 渲染首页，确认 VitePress 导航/侧边栏/正文排版正常、无明显样式崩塌。
2. **库组件在文档站里没样式**（`@source` 路径写错或引入顺序错）→ Task 1：首页内联 Button 必须渲染出蓝色（`bg-blue-600` 生效）。
3. **暗黑模式下图例/文本不可读**（`ui` 组件只做了 light 配色，`bg-white` 等在暗色下刺眼）→ Task 6：Demo 预览区给固定中性浅底容器，隔离暗黑主题；验证暗黑切换后 Demo 区仍可读。
4. **复制按钮在无 `navigator.clipboard` 时静默失败**（非 https / happy-dom）→ Task 2：DemoBlock 单测 mock clipboard，并断言 fallback 分支不抛错。
5. **Playground 接本地包 import map 失败**（`@vue/repl` 默认走 CDN）→ Task 5：spike 先行，失败则按设计文档授权降级为「预置示例编译预览 + 链接到现有 playground SPA」。

---

### Task 1: 脚手架 — docs 包 + VitePress + Tailwind + 完整导航配置 + 首页 hero

**Files:**

- Create: `docs/package.json`
- Create: `docs/.vitepress/config.mts`
- Create: `docs/.vitepress/theme/index.ts`
- Create: `docs/.vitepress/theme/style.css`
- Create: `docs/index.md`
- Modify: `pnpm-workspace.yaml`（`packages:` 列表加 `- docs`）
- Modify: `package.json`（根，加 `docs:dev` / `docs:build` 脚本）

**Interfaces:**

- Consumes: 现有三个 workspace 包（`@ai-chat-ui/core|ui|adapters`）、`reka-ui`。
- Produces: 可运行的 `pnpm docs:dev`（VitePress dev server）；`docs/.vitepress/theme/index.ts` 默认导出 DefaultTheme（后续任务往里加 DemoBlock 注册）；config 里的 alias 与 sidebar 结构（后续任务往 sidebar 里填的页面文件路径由此确定）。

- [ ] **Step 1: 建 `docs/package.json`**

`name: "docs"`、`private: true`、`type: "module"`；scripts：`dev: "vitepress dev"`、`build: "vitepress build"`、`preview: "vitepress preview"`；dependencies：`@ai-chat-ui/core|ui|adapters: "workspace:*"`、`reka-ui: "^2.11.0"`、`vue: "^3.5.45"`；devDependencies：`vitepress`（最新稳定版）、`@tailwindcss/vite: "^4.3.5"`、`tailwindcss: "^4.3.5"`。

- [ ] **Step 2: 加 workspace + 根脚本**

`pnpm-workspace.yaml` 的 `packages` 加 `- docs`。根 `package.json` 加 `"docs:dev": "pnpm --filter docs dev"`、`"docs:build": "pnpm --filter docs build"`。

- [ ] **Step 3: 写 `docs/.vitepress/config.mts`**

用 `defineConfig`，含：

- `title: 'AI Chat UI'`、`lang: 'zh-CN'`、`cleanUrls: true`。
- `themeConfig.nav`：`{ text: '指南', link: '/guide/' }`、`{ text: '组件', link: '/component/' }`、`{ text: 'Playground', link: '/playground' }`、`{ text: 'GitHub', link: 'https://github.com/coding-zky/1056-learn-ai' }`。
- `themeConfig.sidebar`：`'/guide/'` → 条目 `介绍(/guide/)`、`设计理念(design)`、`安装(installation)`、`快速上手(quickstart)`、`后端无关(provider)`、`Agent 过程可视化(agent-visualization)`；`'/component/'` → 分组「通用」`[Button(button)]`、「聊天」`[Chat(chat), Message(message)]`。
- `themeConfig.search.provider: 'local'`、`themeConfig.appearance: true`。
- `vite.resolve.alias`：`@ai-chat-ui/core|ui|adapters` → 各包 `src/index.ts`（`fileURLToPath(new URL('../packages/.../src/index.ts', import.meta.url))`）。
- `vite.plugins: [tailwindcss()]`。

- [ ] **Step 4: 写 `docs/.vitepress/theme/style.css`**

```css
@import 'tailwindcss';
@source "../../../packages/ui/src/**";
@theme {
  --color-brand: #4f46e5;
}
```

（`@source` 相对该 css 文件上溯三级到仓库根，再进 `packages/ui/src`。）

- [ ] **Step 5: 写 `docs/.vitepress/theme/index.ts`**

`import DefaultTheme from 'vitepress/theme'` → `import './style.css'` → `export default DefaultTheme`。引入顺序保证 VitePress 主题样式在前、Tailwind 在后。

- [ ] **Step 6: 写 `docs/index.md`（hero + 特性网格 + 一个内联 Button 验证链路）**

首页 hero：标题「AI Chat UI」、一句话定位「Agent 过程可视化 · 后端无关 · Headless 的 Vue 3 AI 聊天组件库」、按钮「快速上手」(`/guide/quickstart`) 与「GitHub」外链；下方特性网格列出「后端无关 / Agent 过程可视化 / Headless / 按需安装 / 流式优先」五项（各一句说明）。页面 `<script setup>` 里 `import { Button } from '@ai-chat-ui/ui'`，在正文放一个 `<Button>立即体验</Button>` 用作渲染链路冒烟。

- [ ] **Step 7: 安装依赖并跑通 dev**

Run: `pnpm install`（新增 docs 包依赖）
Run: `pnpm docs:dev`（后台）
Expected: VitePress dev server 起来，无编译错误。

- [ ] **Step 8: 无头 Chrome 冒烟（验证 Review Focus #1/#2）**

Run: 无头 Chrome `--dump-dom` 访问 docs dev server 首页。
Expected: DOM 含「AI Chat UI」标题与特性网格文案；内联 `<Button>` 计算出的 `class` 含 `bg-blue-600`（Tailwind 已扫描到 ui 源码）；VitePress 顶部导航链接存在、无样式崩塌迹象。

- [ ] **Step 9: 构建冒烟**

Run: `pnpm docs:build`
Expected: 构建成功退出码 0，`.vitepress/dist` 产物生成（config/alias/plugin 均无错）。

- [ ] **Step 10: Commit**

```bash
git add pnpm-workspace.yaml package.json docs/
git commit -m "docs: 搭建 VitePress 文档站脚手架与首页"
```

---

### Task 2: DemoBlock 组件（TDD）—— 静态 Demo 的通用容器

**Files:**

- Create: `docs/.vitepress/theme/components/DemoBlock.vue`
- Create: `docs/.vitepress/theme/components/DemoBlock.test.ts`
- Modify: `vitest.config.ts`（`include` 加 `'docs/**/*.{test,spec}.ts'`）
- Modify: `docs/.vitepress/theme/index.ts`（注册 DemoBlock 为全局组件 `app.component('DemoBlock', DemoBlock)`，需改写为接收 `app` 的主题对象）

**Interfaces:**

- Consumes: `@ai-chat-ui/ui` 组件（作为 slot 内容传入）。
- Produces: 全局组件 `<DemoBlock :code="string" title?="string" />`，默认 slot 渲染在预览区；组件页（Task 3/4）靠它展示「实时渲染 + 可折叠源码 + 复制」。

- [ ] **Step 1: 写失败测试 `DemoBlock.test.ts`**

用 `mount`（@vue/test-utils）。三条断言：

1. 渲染默认 slot 到预览区（`wrapper.text()` 含 slot 文案）。
2. 源码默认隐藏，触发「显示代码」按钮后出现 `<pre>` 且其文本含传入的 `code`。
3. 触发「复制」按钮时调用 `navigator.clipboard.writeText(code)`（`vi.stubGlobal` 或 `vi.spyOn` mock clipboard；无 clipboard 时不抛错）。

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm test docs/.vitepress/theme/components/DemoBlock.test.ts`
Expected: FAIL（组件不存在 / 断言不通过）。

- [ ] **Step 3: 实现 `DemoBlock.vue`**

Props `{ code: string; title?: string }`。结构：预览区（浅底容器渲染 `<slot/>`）→ 操作条（`title` + 「显示代码/隐藏代码」切换 + 「复制」按钮）→ 折叠的 `<pre><code>{{ code }}</code></pre>`。复制逻辑：`try { await navigator.clipboard.writeText(props.code) } catch { /* fallback 不抛错 */ }`，成功后短暂显示「已复制」。

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm test docs/.vitepress/theme/components/DemoBlock.test.ts`
Expected: PASS。

- [ ] **Step 5: 在 `theme/index.ts` 全局注册 DemoBlock**

主题对象改为 `{ extends: DefaultTheme, enhanceApp({ app }) { app.component('DemoBlock', DemoBlock) } }`。

- [ ] **Step 6: Commit**

```bash
git add docs/.vitepress/theme/components/DemoBlock.vue docs/.vitepress/theme/components/DemoBlock.test.ts docs/.vitepress/theme/index.ts vitest.config.ts
git commit -m "docs: 新增 DemoBlock 静态示例容器组件"
```

---

### Task 3: 组件页（Button / Message / Chat）+ 示例文件

**Files:**

- Create: `docs/examples/button/basic.vue`、`variants.vue`、`sizes.vue`、`disabled.vue`
- Create: `docs/examples/message/basic.vue`
- Create: `docs/examples/chat/mock-provider.vue`
- Create: `docs/component/button.md`、`docs/component/message.md`、`docs/component/chat.md`

**Interfaces:**

- Consumes: `<DemoBlock>`（Task 2）、`@ai-chat-ui/ui` 的 `Button`/`Message`/`Chat`、`@ai-chat-ui/adapters` 的 `createMockProvider`。
- Produces: 三个可访问的组件文档页，API 表格与真实 props 一一对应。

- [ ] **Step 1: 写 Button 示例 `.vue`（4 个）**

`basic.vue`（默认 primary）、`variants.vue`（primary/secondary/ghost 三枚）、`sizes.vue`（sm/md/lg）、`disabled.vue`（disabled=true）。每个只 import `Button` 并渲染，自包含。

- [ ] **Step 2: 写 Message 示例**

`basic.vue`：`<Message content="这是一条消息" />`。

- [ ] **Step 3: 写 Chat 示例**

`mock-provider.vue`：import `Chat` + `createMockProvider`，用与 playground 相同的事件序列（thinking / tool-call-start / tool-call-end / text-delta / done）构造 provider，传给 `<Chat :provider="provider" />`。

- [ ] **Step 4: 写 `docs/component/button.md`**

frontmatter `title: Button`；简介一句话；每段用 `<script setup>` import 对应示例组件 + `?raw` 源码，以 `<DemoBlock :code="src" title="...">` 包裹；文末 API 表格（markdown）——Props 表列 `variant`（`primary\|secondary\|ghost`，默认 `primary`）、`size`（`sm\|md\|lg`，默认 `md`）、`disabled`（`boolean`，默认 `false`）；Slots 表列 `default`（按钮内容）。

- [ ] **Step 5: 写 `docs/component/message.md`**

frontmatter `title: Message`；`basic` Demo；API Props 表列 `content`（`string`，必填）；Slots/Events 注明「无」。

- [ ] **Step 6: 写 `docs/component/chat.md`**

frontmatter `title: Chat`；`mock-provider` Demo；API Props 表列 `provider`（`ChatProvider`，必填）；说明内部基于 `useChat` 提供 `text/toolCalls/streaming/error/start/stop`，并链到 `/guide/provider` 讲解契约。

- [ ] **Step 7: 构建 + 无头 Chrome 验证**

Run: `pnpm docs:build`；再访问 `/component/button`、`/component/chat`。
Expected: 构建成功；Button 页预览区渲染出蓝色按钮、源码可折叠；Chat 页预览区点「发送」后出现 `search_flights` chip 与航班文案（复用 Task 1 的 CDP 驱动法）。

- [ ] **Step 8: Commit**

```bash
git add docs/examples docs/component/
git commit -m "docs: 新增 Button/Message/Chat 组件文档页与示例"
```

---

### Task 4: 指南页 + 入口页 + 首页特性网格收尾

**Files:**

- Create: `docs/guide/index.md`、`design.md`、`installation.md`、`quickstart.md`、`provider.md`、`agent-visualization.md`
- Create: `docs/component/index.md`
- Modify: `docs/index.md`（补齐特性网格与文案，若 Task 1 已写好则只微调）

**Interfaces:**

- Consumes: 真实 API 事实（`ChatEvent` 9 种、`ChatProvider` 接口、`createMockProvider`、`useChat`），来自 `packages/core/src/*`、`packages/adapters/src/mock-provider.ts`。
- Produces: 侧边栏「指南」「组件」两个分组的全部落地页，无 404。

- [ ] **Step 1: 写 `guide/design.md`（设计理念）**

讲定位与差异化：Agent 过程可视化、后端无关、Headless、按需安装、流式优先，对照 spec 1.1/1.2/1.4。

- [ ] **Step 2: 写 `guide/installation.md`（安装）**

按包分装：`pnpm add @ai-chat-ui/core @ai-chat-ui/ui @ai-chat-ui/adapters`；说明 `reka-ui` 为 `ui` 的 peer；注明当前仍处早期、未发 npm（Phase 4 才发布）。

- [ ] **Step 3: 写 `guide/quickstart.md`（快速上手）**

最小可运行示例：`createMockProvider([...])` + `<Chat :provider="..." />`（与 playground 同款），并放一个 `<DemoBlock>` 内联演示。

- [ ] **Step 4: 写 `guide/provider.md`（后端无关）**

讲 `ChatProvider` 接口与 `ChatEvent` 契约：给出 9 种事件的 TS 联合类型原文、`subscribe({ onEvent })` → `{ unsubscribe(); abort() }` 的签名、以及「组件只认事件流、不关心来源」的含义；点明三个一等 adapter（AiSdk / AgUi / Custom）为后续规划。

- [ ] **Step 5: 写 `guide/agent-visualization.md`（Agent 过程可视化）**

讲尖刀能力：`tool-call-start/end`、`thinking`、`step-status`、`approval-request` 如何构成「思考→工具调用→步骤→审批」的可见链路；对齐 spec §六 的「时间线默认折叠 + 审批点永远展开」。

- [ ] **Step 6: 写 `guide/index.md`、`component/index.md` 入口页 + 首页收尾**

`guide/index.md` = 指南导读；`component/index.md` = 组件总览（列出 Button/Chat/Message 及状态）。`index.md` 特性网格最终文案核对。

- [ ] **Step 7: 验证链接完整性 + 提交**

Run: `pnpm docs:build` 后，遍历 `/guide/*`、`/component/*` 无 404（无头 Chrome 逐页 `--dump-dom` 或构建产物目录核对）。
Run: `git add docs/guide docs/component docs/index.md && git commit -m "docs: 新增指南页与组件总览"`

---

### Task 5: 内嵌 Playground（@vue/repl）

**Files:**

- Create: `docs/.vitepress/theme/components/Playground.vue`
- Create: `docs/playground.md`
- Modify: `docs/package.json`（加 `@vue/repl` 依赖）

**Interfaces:**

- Consumes: `@vue/repl`（`Repl`、`useStore`）、`@vue/repl/monaco-editor`；本地三包（经 import map）。
- Produces: `/playground` 页，用户在浏览器里写/改 Vue SFC 并实时运行。

- [ ] **Step 1: spike —— 最小 @vue/repl 跑通（不接本地包）**

`docs/playground.md` 用 `<ClientOnly>` 包 `<Playground />`；`Playground.vue` 里 `import { Repl } from '@vue/repl'` + `import '@vue/repl/monaco-editor'`，store 里塞一个只 import `vue` 的硬编码 SFC 示例，渲染 `<Repl />`。
Run: `pnpm docs:dev` 后无头 Chrome 打开 `/playground`。
Expected: 编辑器 + 预览区出现，示例能编译渲染。（若此步都跑不通，记录报错，转 Step 4 降级。）

- [ ] **Step 2: 接本地三包**

写一个小型 vite 构建（`docs/playground-lib/` 下配置），把 `@ai-chat-ui/core|ui|adapters` 各自打成单文件 ESM（`vue`/`reka-ui` external），产物放进 `docs/public/playground-lib/`；store 的 `setImportMap` 把 `@ai-chat-ui/*` 映射到 `/playground-lib/<name>.js`，`reka-ui` 映射到 CDN esm.sh。预置 2-3 个可编辑示例（Button 变体、Chat + mock provider）。
Run: `pnpm docs:dev` 后无头 Chrome 打开 `/playground`，加载 Chat 示例并触发运行。
Expected: 本地包示例能编译渲染出 Chat / Button。

- [ ] **Step 3: 成功则收尾**

若 Step 2 通：完善示例、加使用说明文案，进入 Step 5 提交。

- [ ] **Step 4: 降级路径（Step 1/2 卡住时）**

按设计文档授权降级为「预置示例编译预览 + 链接到现有 playground SPA」：Playground 页只展示若干只依赖 CDN `vue` 的可编辑示例，并放「完整 Playground 请访问 <现有 playground>」外链；本地包接线记为后续 TODO（`// TODO: 二期把 @ai-chat-ui/* 接进 import map`）。

- [ ] **Step 5: Commit**

```bash
git add docs/package.json docs/playground.md docs/.vitepress/theme/components/Playground.vue docs/playground-lib docs/public/playground-lib
git commit -m "docs: 新增内嵌在线 Playground"
```

---

### Task 6: 收尾 —— 全站验证（导航/暗黑/搜索/样式）+ 提交

**Files:**

- Modify: `docs/.vitepress/theme/style.css` 或 `DemoBlock.vue`（仅在 Review Focus 验证发现暗黑/样式问题时微调）

**Interfaces:**

- Consumes: Task 1–5 的全部产物。
- Produces: 通过完整验证的可交付文档站。

- [ ] **Step 1: 全量构建 + lint**

Run: `pnpm docs:build`（Exit 0）；`pnpm lint`（无新增 error）。
Expected: 两者通过。

- [ ] **Step 2: 暗黑模式验证（Review Focus #3）**

无头 Chrome 切 `html.dark` 后打开 `/component/button`、首页，确认 Demo 预览区因浅底容器仍可读、文本对比度正常；若 `bg-white` 等刺眼，给 DemoBlock 预览区加固定浅底并隔离暗黑变量。

- [ ] **Step 3: 搜索验证**

Run: `pnpm docs:dev` 后无头 Chrome 触发本地搜索（键入「provider」），确认能命中 `/guide/provider` 等页。中文分词若不准，属已知局限，不阻塞。

- [ ] **Step 4: 链接完整性 + 首页最终冒烟**

遍历顶部导航四个入口与侧边栏全部条目，无 404；首页 hero/特性网格渲染正常。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: 文档站收尾验证与样式微调"
```

---

## Self-Review 记录

- **Spec 覆盖**：spec §五站点结构 → Task 1（脚手架/导航）+ Task 3/4（落地页）+ Task 5（playground）；§六实现要点（alias/Tailwind/DemoBlock/@vue/repl）→ 依次对应 Task 1/2/5；§二目标（首页/导航/边栏/指南/组件/playground/搜索/暗黑）→ 全部有任务覆盖。spec 里的「可编辑 Demo」为 v1 非目标，已不纳入。
- **类型/命名一致**：`DemoBlock` props `{ code, title }` 在 Task 2 定义、Task 3/4 使用处一致；三包名与 alias 全程 `@ai-chat-ui/*`；`createMockProvider` 签名沿用 adapters 现有实现。
- **Review Focus**：5 条均已挂到 Task 1/2/5/6 的验证步骤。
- **比例**：plan 描述结构与决策，不转写页面正文与示例代码（正文由 Task 步骤点明「写什么」，具体文案留实现者）。
