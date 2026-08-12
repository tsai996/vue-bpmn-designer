<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { useBpmnContextService } from '@/hooks/useService.ts'
import type EventBus from 'diagram-js/lib/core/EventBus'
import { onMounted } from 'vue'

defineOptions({
  name: 'UserTaskPanel',
})
const { getService } = useBpmnContextService()
const eventBus = getService<EventBus>('eventBus')
const assignee = useCustomRef('assignee')
const candidateUsers = useCustomRef<string[]>('candidateUsers')
const candidateGroups = useCustomRef<string[]>('candidateGroups')
const dueDate = useCustomRef('dueDate')
const priority = useCustomRef<number>('priority')
onMounted(() => {
  eventBus?.on('elementVariableChanged', (event: any) => {
    assignee.value = `\${${event.elementVariable}}`
  })
})
</script>

<template>
  <el-collapse-item name="arg1" :title="$tu('处理人')">
    <el-form-item prop="assignee" :label="$tu('受让人')">
      <el-select
        v-model="assignee"
        filterable
        allow-create
        clearable
        :placeholder="$tu('请选择受让人')"
      >
        <el-option :label="$tu('张三')" value="zhangsan" />
        <el-option :label="$tu('李四')" value="lisi" />
        <el-option :label="$tu('王五')" value="wangwu" />
        <el-option :label="$tu('毛六')" value="maoliu" />
        <el-option :label="$tu('钱七')" value="qianqi" />
      </el-select>
    </el-form-item>
    <el-form-item prop="candidateUsers" :label="$tu('候选人')">
      <el-select v-model="candidateUsers" multiple clearable :placeholder="$tu('请选择候选人')">
        <el-option :label="$tu('张三')" value="zhangsan" />
        <el-option :label="$tu('李四')" value="lisi" />
        <el-option :label="$tu('王五')" value="wangwu" />
        <el-option :label="$tu('毛六')" value="maoliu" />
        <el-option :label="$tu('钱七')" value="qianqi" />
      </el-select>
    </el-form-item>
    <el-form-item prop="candidateGroups" :label="$tu('候选组')">
      <el-select v-model="candidateGroups" multiple clearable :placeholder="$tu('请选择候选组')">
        <el-option :label="$tu('部门A')" value="deptA" />
        <el-option :label="$tu('部门B')" value="deptB" />
        <el-option :label="$tu('部门C')" value="deptC" />
        <el-option :label="$tu('部门D')" value="deptD" />
        <el-option :label="$tu('部门E')" value="deptE" />
      </el-select>
    </el-form-item>
    <el-form-item prop="priority" :label="$tu('优先级')">
      <el-input-number v-model="priority" :placeholder="$tu('优先级')" :min="0" :max="10" />
    </el-form-item>
    <el-form-item prop="dueDate" :label="$tu('到期时间')">
      <el-input v-model="dueDate" :placeholder="$tu('请输入到期时间')" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss">
:deep(.el-collapse-item__header) {
  padding-left: 10px;
  box-sizing: border-box;
  position: relative;
  gap: 8px;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    width: 3px;
    height: 15px;
    background-color: var(--el-color-primary);
  }
}
</style>
