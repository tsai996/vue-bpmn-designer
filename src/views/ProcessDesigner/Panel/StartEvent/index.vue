<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

defineOptions({
  name: 'StartEvent',
})
const initiator = useCustomRef('initiator')
</script>

<template>
  <el-form-item label="发起人">
    <el-input v-model="initiator" placeholder="请输入发起人" />
  </el-form-item>
</template>

<style scoped lang="scss"></style>
