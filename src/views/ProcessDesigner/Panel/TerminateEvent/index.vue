<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

const terminateAll = useCustomRef('terminateAll')
</script>

<template>
  <el-collapse-item name="arg1" title="结束">
    <el-form-item label="终止所有">
      <el-switch v-model="terminateAll"></el-switch>
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
