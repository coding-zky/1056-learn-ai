---
title: Button
---

# Button 按钮

常用的操作按钮。

## 基础用法

<script setup>
import BasicButton from '../examples/button/basic.vue'
import BasicButtonRaw from '../examples/button/basic.vue?raw'
import VariantsButton from '../examples/button/variants.vue'
import VariantsButtonRaw from '../examples/button/variants.vue?raw'
import SizesButton from '../examples/button/sizes.vue'
import SizesButtonRaw from '../examples/button/sizes.vue?raw'
import DisabledButton from '../examples/button/disabled.vue'
import DisabledButtonRaw from '../examples/button/disabled.vue?raw'
</script>

<DemoBlock :code="BasicButtonRaw" title="基础用法">
  <BasicButton />
</DemoBlock>

## 按钮类型

通过 `variant` 切换主要 / 次要 / 幽灵三种类型。

<DemoBlock :code="VariantsButtonRaw" title="variant 变体">
  <VariantsButton />
</DemoBlock>

## 尺寸

通过 `size` 切换小 / 中 / 大三种尺寸。

<DemoBlock :code="SizesButtonRaw" title="size 尺寸">
  <SizesButton />
</DemoBlock>

## 禁用状态

设置 `disabled` 后按钮不可点击。

<DemoBlock :code="DisabledButtonRaw" title="禁用">
  <DisabledButton />
</DemoBlock>

## API

### Props

| 名称       | 类型                                  | 默认值      | 说明     |
| ---------- | ------------------------------------- | ----------- | -------- |
| `variant`  | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | 按钮类型 |
| `size`     | `'sm' \| 'md' \| 'lg'`                | `'md'`      | 按钮尺寸 |
| `disabled` | `boolean`                             | `false`     | 是否禁用 |

### Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 按钮内容 |
