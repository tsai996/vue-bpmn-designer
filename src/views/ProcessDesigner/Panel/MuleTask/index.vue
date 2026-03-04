<script setup lang="ts">
import { useFieldRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import Codemirror from '@/components/CodemirrorEditor/index.vue'
import { ref } from 'vue'
import juelSupport from '@/components/CodemirrorEditor/language/juel'
import groovySupport from '@/components/CodemirrorEditor/language/groovy'

defineOptions({
  name: 'MuleTask',
})

const endpointUrl = useFieldRef('endpointUrl')
const language = useFieldRef('language')
const payloadExpression = useFieldRef('payloadExpression')
const resultVariable = useFieldRef('resultVariable')
const extensions = ref<any[]>([juelSupport()])
const changeLanguage = (val: string) => {
  if (val === 'juel') {
    extensions.value = [juelSupport()]
  } else if (val === 'groovy') {
    extensions.value = [groovySupport]
  } else {
    extensions.value = []
  }
  payloadExpression.value = ''
}
</script>

<template>
  <el-collapse-item name="arg1" title="骡子">
    <el-form-item label="终端url">
      <el-input v-model="endpointUrl" placeholder="请输入终端url" />
    </el-form-item>
    <el-form-item label="表达式语言">
      <el-select v-model="language" placeholder="请选择表达式语言" @change="changeLanguage">
        <el-option label="juel" value="juel" />
        <el-option label="groovy" value="groovy" />
      </el-select>
    </el-form-item>
    <el-form-item label="有效载荷表达式">
      <Codemirror
        :rows="4"
        :max-rows="10"
        autosize
        popup
        :placeholder="`请输入有效载荷${language}表达式`"
        :extensions="extensions"
        v-model="payloadExpression"
      />
      <!--      <el-input
              v-model="payloadExpression"
              type="textarea"
              :rows="3"
              placeholder="请输入有效载荷表达式"
            />-->
    </el-form-item>
    <el-form-item label="返回变量">
      <el-input v-model="resultVariable" placeholder="请输入返回变量" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
