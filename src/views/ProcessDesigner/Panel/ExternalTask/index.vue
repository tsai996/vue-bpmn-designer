<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

defineOptions({
  name: 'ExternalTask',
})
const topic = useCustomRef('topic')
</script>

<template>
  <el-collapse-item name="arg1" title="外部工作">
    <el-form-item label="工作主题">
      <el-input v-model="topic" placeholder="请输入工作主题" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
