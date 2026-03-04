<script setup lang="ts">
import { useCustomRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import Codemirror from '@/components/CodemirrorEditor/index.vue'
import javascriptSupport from '@/components/CodemirrorEditor/language/javascript'
import { ref } from 'vue'
import juelSupport from '@/components/CodemirrorEditor/language/juel'
import groovySupport from '@/components/CodemirrorEditor/language/groovy'

defineOptions({
  name: 'ScriptTask',
})
const scriptFormat = useCustomRef('scriptFormat')
const script = useCustomRef<string | undefined>('script')
const resultVariable = useCustomRef<string | undefined>('resultVariable')
const autoStoreVariables = useCustomRef<boolean>('autoStoreVariables')
const extensions = ref<any[]>([javascriptSupport])
const changeScriptFormat = (val: string) => {
  if (val === 'javascript') {
    extensions.value = [javascriptSupport]
  } else if (val === 'juel') {
    extensions.value = [juelSupport()]
  } else if (val === 'groovy') {
    extensions.value = [groovySupport]
  } else {
    extensions.value = []
  }
  script.value = undefined
  resultVariable.value = undefined
  autoStoreVariables.value = false
}
</script>

<template>
  <el-collapse-item name="arg1" title="调用脚本">
    <el-form-item label="脚本格式">
      <el-radio-group v-model="scriptFormat" @change="changeScriptFormat">
        <el-radio-button label="JavaScript" value="javascript" />
        <el-radio-button label="Groovy" value="groovy" />
        <el-radio-button label="Juel" value="juel" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="脚本">
      <Codemirror
        :rows="4"
        :max-rows="10"
        autosize
        popup
        :placeholder="`请输入${scriptFormat}脚本`"
        :extensions="extensions"
        v-model="script"
      />
      <!--      <el-input v-model="script" type="textarea" :rows="4" placeholder="请输入脚本" />-->
    </el-form-item>
    <el-form-item prop="resultVariable" label="结果变量" v-if="scriptFormat === 'juel'">
      <el-input v-model="resultVariable" placeholder="请输入结果变量" />
    </el-form-item>
    <el-form-item prop="autoStoreVariables" label="自动存储变量" v-else>
      <el-switch v-model="autoStoreVariables" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
