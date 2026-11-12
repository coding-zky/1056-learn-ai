# VitePress 文档站 · 设计文档

> 版本：v1 · 日期：2026-11-12 · 状态：待评审

## 一、意图（为什么做）

`ai-chat-ui` 是一个开源 AI 聊天界面组件库，差异化卖点是 **Agent 过程可视化** + **后端无关** + **Headless**。目前只有一个内部 `playground`（Vite SPA）用于开发调试，没有一个面向外部开发者的文档站。

目标：搭一个 **VitePress 文档站**，作为开源组件库的对外门面，让一个第一次来的 Vue 开发者能快速看懂这个库是什么、怎么装、组件怎么用、API 是什么。参照 Element Plus 的站点形态（首页 + 顶部导航 + 左侧边栏 + 搜索框 + 组件文档页）。

## 二、目标 / 非目标 / 反目标

**目标（v1 交付）**

1. 首页：hero（名称 + 一句话定位 + 快速上手 / GitHub 按钮）+ 特性网格（后端无关 / Agent 过程可视化 / Headless / 按需安装 / 流式优先）。
2. 顶部导航：指南 / 组件 / Playground / GitHub 外链。
3. 左侧边栏：指南分组 + 组件分组（按类别），结构可随组件增长扩展。
4. 指南页：设计理念、安装、快速上手、后端无关（Provider 抽象）、Agent 过程可视化——对齐库的真实概念。
5. 组件页：Button / Chat / Message，各含「标题 + 简介 + 静态 Demo + API 表格」。
6. Playground 页：文档内嵌在线 Playground（编辑器 + 实时编译运行）。
7. 搜索框：VitePress 内置本地搜索（免费，无 Algolia）。
8. 暗黑模式：VitePress 默认外观切换（开启）。

**非目标（v1 不做）**

- 组件页的可编辑实时 Demo（用户已确认「先静态，二期再加可编辑」）。
- 英文站点 / 多语言切换（技术方案定「中文优先，英文后补」）。
- Algolia DocSearch（需申请 + 爬虫配置，v1 用本地搜索）。
- 自动从 TypeScript 类型生成 API 表格（v1 手写 markdown 表格，后续再做自动化）。
- 文档站自身的部署 / CI 发布（本次只搭站点 + 本地可跑；部署是另一个任务）。

**反目标（做了就算失败）**

- 引入 AI SDK 到 `core` / `ui` / 文档站渲染层（违反「core 不 import `ai`」架构约定）。
- 把文档站的样式和库组件样式耦合，导致换主题 / 暗黑模式互相污染。
- 文档内容与组件真实 API 脱节（写错了 props 名 = 误导开发者）。

## 三、约束（必须遵守）

- 仓库是 pnpm monorepo，`docs` 作为新 workspace 包加入（`pnpm-workspace.yaml` 加 `docs`）。
- 文档站要**渲染真实的库组件**做 Demo / Playground，因此 `docs` 依赖 `@ai-chat-ui/core` / `@ai-chat-ui/ui` / `@ai-chat-ui/adapters`（workspace 依赖）。
- **库组件样式是 Tailwind 工具类**：`ui` 组件的类名（`bg-blue-600` 等）必须在文档站的构建里被 Tailwind v4 扫到，否则 Demo 渲染出来没样式。处理方式沿用 playground 的 `@source` 显式扫描（见下）。
- `ui` 依赖 `reka-ui`（peer），文档站需把 `reka-ui` 列为依赖。
- 中文优先，v1 单语言 zh-CN。
- 不违反现有架构约定：core 零依赖 AI SDK、Headless 分层、事件契约优先。

## 四、已定的「怎么做」（来自用户 / 技术方案 / 本次对齐）

| 决策             | 结论                                                                                                                                       | 来源                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| 文档工具         | VitePress                                                                                                                                  | 技术方案 + 用户                     |
| 位置             | 仓库根 `docs/` 目录，作为新 workspace 包                                                                                                   | 技术方案                            |
| 组件页 Demo 形态 | v1 静态（渲染真实组件 + 可展开源码 + 复制），二期再加可编辑                                                                                | 用户                                |
| Playground 形态  | 文档内嵌在线 Playground（编辑器 + 实时编译）                                                                                               | 用户                                |
| 语言             | 中文优先，v1 仅 zh-CN                                                                                                                      | 技术方案                            |
| 搜索             | 本地搜索（免费）                                                                                                                           | 本次（我的判断）                    |
| 暗黑模式         | 开启 VitePress 默认外观切换                                                                                                                | 本次（我的判断，Element Plus 也有） |
| 组件文档范围     | v1 只写已有组件 Button / Chat / Message；侧边栏按技术方案的组件体系（基础聊天 / 富文本 / 多模态 / Agent 交互）预留分组，未实现组件不建空页 | 本次（我的判断）                    |

## 五、站点结构

```
docs/
├── package.json              # 私有包，name: docs，脚本 dev/build/preview
├── .vitepress/
│   ├── config.mts            # 站点配置：标题、导航、侧边栏、搜索(local)、vite 别名 + tailwind 插件
│   └── theme/
│       ├── index.ts          # 主题扩展：注册 DemoBlock、引入 tailwind 入口 css
│       ├── style.css         # @import 'tailwindcss' + @source 扫 packages/ui/src + @theme(--color-brand)
│       └── components/
│           └── DemoBlock.vue # 通用 Demo 容器：预览 + 折叠源码 + 复制按钮
├── index.md                  # 首页（hero + 特性网格）
├── guide/
│   ├── index.md              # 指南入口
│   ├── design.md             # 设计理念（定位 + 差异化）
│   ├── installation.md       # 安装（各包分别安装）
│   ├── quickstart.md         # 快速上手（最小 Chat 示例）
│   ├── provider.md           # 后端无关：ChatProvider / ChatEvent 契约
│   └── agent-visualization.md# Agent 过程可视化（尖刀能力）
├── component/
│   ├── index.md              # 组件总览
│   ├── button.md             # Button
│   ├── chat.md               # Chat
│   └── message.md            # Message
├── playground.md             # 在线 Playground（@vue/repl，ClientOnly）
└── examples/                 # 组件 Demo 源码（.vue 文件，与组件名对应）
    ├── button/               #   basic.vue / sizes.vue / variants.vue / disabled.vue
    ├── chat/                 #   mock-provider.vue
    └── message/              #   basic.vue
```

## 六、关键实现要点

### 6.1 库组件如何被文档站引用（alias 到 src）

沿用 playground 的做法：文档站的 Vite 配置里把 `@ai-chat-ui/*` alias 到各包 `src/index.ts`，dev 无需先 build 库包、HMR 直接生效：

```ts
// docs/.vitepress/config.mts 内
vite: {
  resolve: { alias: {
    '@ai-chat-ui/core':     '../packages/core/src/index.ts',
    '@ai-chat-ui/ui':       '../packages/ui/src/index.ts',
    '@ai-chat-ui/adapters': '../packages/adapters/src/index.ts',
  } },
}
```

### 6.2 库组件样式（Tailwind）如何进文档站

`ui` 组件是 Tailwind 工具类。文档站 `.vitepress/theme/style.css`：

```css
@import 'tailwindcss';
@source "../../packages/ui/src/**"; /* 显式扫描 ui 源码的工具类 */
@theme {
  --color-brand: #4f46e5;
}
```

并在 Vite 配置挂 `@tailwindcss/vite` 插件。注意：VitePress 自带主题 CSS，Tailwind 的 preflight 可能影响 VitePress 默认样式，需在主题里控制引入顺序（VitePress 主题样式先、tailwind 后，或关掉 preflight 冲突部分）。这是已知需验证点，列进 plan。

### 6.3 静态 Demo（DemoBlock）

每个 Demo 写成一个独立 `.vue` 文件放 `docs/examples/<component>/<name>.vue`，`DemoBlock` 组件：

- `import` 该 `.vue` 文件 → 渲染进预览区（真实组件）；
- `import source from './xxx.vue?raw'` → 显示源码；
- 折叠/展开源码 + 复制按钮。

API 表格直接手写在组件页 markdown 里（Props / Events / Slots 三张表），v1 不自动生成。

### 6.4 Playground（@vue/repl）

用 `@vue/repl`（Vue 官方 SFC Playground，vuejs.org / Element Plus 同款）做内嵌在线 Playground：编辑器 + 实时编译 + 预览开箱即用。页面用 `<ClientOnly>` 包裹（@vue/repl 依赖浏览器 API）。预置 2-3 个可编辑示例（Button 变体、Chat + mock provider）。

**主要风险**：@vue/repl 默认走 CDN import map，把**本地 monorepo 包**（`@ai-chat-ui/*` 源码）接进它的 import map 需要文档站把各包 `dist/` 产物作为 ESM 静态资源 serve 出去再映射。fallback：Playground 先对「预先打包好的 ESM」跑，或 v1 只提供「对着已发布的 npm 包名写代码」的编辑体验（本地 dev 用 import map 指向本地 dist）。具体接线方案在 plan 里敲定，属 v1 最大不确定点，若卡住可降级为「CodeMirror 编辑 + 预置示例编译预览」的最小可用版。

## 七、现有组件 API（文档要用到的真实数据，写表依据）

### Button（`packages/ui/src/Button.vue`）

- Props：`variant`（`primary | secondary | ghost`，默认 `primary`）、`size`（`sm | md | lg`，默认 `md`）、`disabled`（`boolean`，默认 `false`）。
- Slots：`default`（按钮文案/内容）。

### Message（`packages/ui/src/Message.vue`）

- Props：`content`（`string`，必填）。
- 无 Slots / Events。

### Chat（`packages/ui/src/Chat.vue`）

- Props：`provider`（`ChatProvider`，必填）。
- 内部用 `useChat` 暴露 `text / toolCalls / streaming / error / start / stop`，渲染工具调用 chip + `<Message>` + 「发送 / 停止」按钮。

### core（`packages/core/src/`）

- `ChatProvider` 接口（`subscribe({ onEvent })` → `{ unsubscribe(); abort() }`）。
- `ChatEvent` 联合类型（9 种：`text-delta` / `thinking` / `tool-call-start` / `tool-call-arg-delta` / `tool-call-end` / `step-status` / `approval-request` / `error` / `done`）。
- `useChat` composable。

### adapters（`packages/adapters/src/`）

- 当前仅 `createMockProvider(events)`。

## 八、留给 builder（plan 阶段敲定）

- 具体依赖清单与版本（vitepress、@vue/repl、@tailwindcss/vite、reka-ui 等）。
- Tailwind preflight 与 VitePress 主题样式的冲突处理细节。
- @vue/repl 接本地包的 import map 具体方案（或降级方案）。
- 每个指南页 / 组件页的具体正文内容与示例代码。
- 首页 hero 文案与特性网格的最终视觉。
