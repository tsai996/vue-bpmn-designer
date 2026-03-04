<script setup lang="ts">
import { useFieldRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

defineOptions({
  name: 'CcTask',
})
const assignee = useFieldRef('assignee')
</script>

<template>
  <el-collapse-item name="arg1" title="抄送">
    <el-form-item label="抄送人">
      <el-select
        v-model="assignee"
        multiple
        filterable
        allow-create
        clearable
        placeholder="请选择抄送人"
      >
        <el-option label="张三" value="zhangsan" />
        <el-option label="李四" value="lisi" />
        <el-option label="王五" value="wangwu" />
        <el-option label="毛六" value="maoliu" />
        <el-option label="钱七" value="qianqi" />
      </el-select>
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
