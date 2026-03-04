<script setup lang="ts">
import { useFieldRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

defineOptions({
  name: 'CamelTask',
})
const camelContext = useFieldRef('camelContext')
</script>

<template>
  <el-collapse-item name="arg1" title="驼峰">
    <el-form-item label="驼峰内容">
      <el-input v-model="camelContext" placeholder="请输入驼峰内容" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
