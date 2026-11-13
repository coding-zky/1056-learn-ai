---
title: Message
---

# Message 消息

展示一条文本消息。

## 基础用法

<script setup>
import BasicMessage from '../examples/message/basic.vue'
import BasicMessageRaw from '../examples/message/basic.vue?raw'
</script>

<DemoBlock :code="BasicMessageRaw" title="基础用法">
  <BasicMessage />
</DemoBlock>

## API

### Props

| 名称      | 类型                               | 默认值      | 说明                                           |
| --------- | ---------------------------------- | ----------- | ---------------------------------------------- |
| `content` | `string`                           | —           | 消息文本内容（必填）                           |
| `role`    | `'user' \| 'assistant'`            | `assistant` | 消息角色，决定对齐与配色                       |
| `status`  | `'streaming' \| 'done' \| 'error'` | `done`      | 状态；`streaming` 显示输入光标                 |
| `variant` | `'default' \| 'chatgpt'`           | `default`   | 外观变体；`chatgpt` 为深色用户气泡 + AI 无背景 |

### Slots / Events

无。
