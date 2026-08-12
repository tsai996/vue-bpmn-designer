<script setup lang="ts">
import { useFieldRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

defineOptions({
  name: 'CcTask',
})
const assignee = useFieldRef('assignee')
</script>

<template>
  <el-collapse-item name="arg1" :title="$tu('抄送')">
    <el-form-item :label="$tu('抄送人')">
      <el-select
        v-model="assignee"
        multiple
        filterable
        allow-create
        clearable
        :placeholder="$tu('请选择抄送人')"
      >
        <el-option :label="$tu('张三')" value="zhangsan" />
        <el-option :label="$tu('李四')" value="lisi" />
        <el-option :label="$tu('王五')" value="wangwu" />
        <el-option :label="$tu('毛六')" value="maoliu" />
        <el-option :label="$tu('钱七')" value="qianqi" />
      </el-select>
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
