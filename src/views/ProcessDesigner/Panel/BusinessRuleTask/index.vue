<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'

defineOptions({
  name: 'BusinessRuleTask',
})
const rules = useCustomRef('rules')
const ruleVariablesInput = useCustomRef('ruleVariablesInput')
const resultVariable = useCustomRef('resultVariable')
const exclude = useCustomRef('exclude')
const javaClass = useCustomRef('class')
</script>

<template>
  <el-collapse-item name="arg1" :title="$tu('业务规则')">
    <el-form-item :label="$tu('规则')">
      <el-select
        v-model="rules"
        filterable
        allow-create
        clearable
        multiple
        :placeholder="$tu('请选择规则')"
      >
        <el-option :label="$tu('规则1')" value="rule1"></el-option>
        <el-option :label="$tu('规则2')" value="rule2"></el-option>
        <el-option :label="$tu('规则3')" value="rule3"></el-option>
        <el-option :label="$tu('规则4')" value="rule4"></el-option>
        <el-option :label="$tu('规则5')" value="rule5"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$tu('排除')">
      <el-switch v-model="exclude" />
    </el-form-item>
    <el-form-item :label="$tu('输入变量')">
      <el-input v-model="ruleVariablesInput" :placeholder="$tu('请输入输入变量')"></el-input>
    </el-form-item>
    <el-form-item :label="$tu('输出变量')">
      <el-input v-model="resultVariable" :placeholder="$tu('请输入输出变量')"></el-input>
    </el-form-item>
    <el-form-item :label="$tu('自定义实现')">
      <el-input v-model="javaClass" :placeholder="$tu('请输入java类路径/委托表达式')"></el-input>
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
