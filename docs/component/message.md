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

| 名称      | 类型     | 默认值 | 说明                 |
| --------- | -------- | ------ | -------------------- |
| `content` | `string` | —      | 消息文本内容（必填） |

### Slots / Events

无。
