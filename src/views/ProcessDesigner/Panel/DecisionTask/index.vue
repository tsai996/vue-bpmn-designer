<script setup lang="ts">
import { useFieldRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

defineOptions({
  name: 'DecisionTask',
})
const decisionTableReferenceKey = useFieldRef('decisionTableReferenceKey')
const decisionTaskThrowErrorOnNoHits = useFieldRef('decisionTaskThrowErrorOnNoHits')
const sameDeployment = useFieldRef('sameDeployment')
</script>

<template>
  <el-collapse-item name="arg1" title="决策">
    <el-form-item label="决策引用">
      <el-input v-model="decisionTableReferenceKey" placeholder="请输入决策key" />
    </el-form-item>
    <el-form-item label="决策任务在未命中时抛出错误">
      <el-switch
        v-model="decisionTaskThrowErrorOnNoHits"
        active-value="true"
        inactive-value="false"
      />
    </el-form-item>
    <el-form-item label="同部署">
      <el-switch v-model="sameDeployment" active-value="true" inactive-value="false" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
