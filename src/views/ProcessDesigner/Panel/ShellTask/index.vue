<script setup lang="ts">
import {
  getExtensionElementsList,
  removeExtensionElements,
} from '@/views/ProcessDesigner/utils/ExtensionElementsUtil.ts'
import { onMounted, ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { useFieldRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { useBpmnContextService } from '@/hooks/useService.ts'
import { useFormItem } from 'element-plus'
import Codemirror from '@/components/CodemirrorEditor/index.vue'
import shellSupport from '@/components/CodemirrorEditor/language/shell'

defineOptions({
  name: 'ShellTask',
})
const { form } = useFormItem()
const { selectedElement } = useBpmnContextService()
const command = useFieldRef('command')
const outputVariable = useFieldRef('outputVariable')
const wait = useFieldRef('wait')
const redirectError = useFieldRef('redirectError')
const cleanEnv = useFieldRef('cleanEnv')
const directory = useFieldRef('directory')
const errorCodeVariable = useFieldRef('errorCodeVariable')
const args = ref<string[]>([])
const updateModelValue = (val: string, index: number) => {
  args.value.splice(index, 1, val)
  const arg = useFieldRef(`arg${index}`)
  arg.value = val
  loadArgs()
}
const delArg = (index: number) => {
  args.value.splice(index, 1)
  const fields = getExtensionElementsList(selectedElement, 'flowable:Field')
  const arg = fields.find((field) => field.get('name') === `arg${index}`)
  if (arg) {
    removeExtensionElements(selectedElement, arg)
    loadArgs()
  }
}
const loadArgs = () => {
  const fields = getExtensionElementsList(selectedElement, 'flowable:Field')
  const argElements = fields.filter((field) => field.get('name').startsWith('arg'))
  args.value = argElements.map((arg) => arg.get('string'))
}
onMounted(() => {
  loadArgs()
})
</script>

<template>
  <el-collapse-item name="arg1" title="命令">
    <el-form-item label="命令">
      <Codemirror
        :rows="4"
        :max-rows="10"
        autosize
        popup
        placeholder="请输入命令"
        :extensions="[shellSupport]"
        v-model="command"
      />
      <!--      <el-input v-model="command" type="textarea" :rows="3" placeholder="请输入命令" />-->
    </el-form-item>
    <el-form-item label="参数">
      <template #label>
        <div class="flex-center">
          参数
          <el-button
            :icon="Plus"
            type="primary"
            link
            @click="args.push('')"
            :disabled="args.length > 4"
            >添加
          </el-button>
        </div>
      </template>
      <el-row :gutter="10" v-for="(_, index) in args" :key="index" class="w-full mb7px">
        <el-col :span="21">
          <el-input
            :model-value="args[index]"
            @update:model-value="updateModelValue($event, index)"
            clearable
            placeholder="请输入参数"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-button :icon="Delete" type="danger" circle text bg @click="delArg(index)" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="输出变量">
      <el-input v-model="outputVariable" placeholder="请输入输出变量" />
    </el-form-item>
    <el-row :gutter="10">
      <el-col :span="form?.labelPosition === 'top' ? 8 : 24">
        <el-form-item label="等待">
          <el-switch v-model="wait" active-value="true" inactive-value="false" />
        </el-form-item>
      </el-col>
      <el-col :span="form?.labelPosition === 'top' ? 8 : 24">
        <el-form-item label="重定向错误">
          <el-switch v-model="redirectError" active-value="true" inactive-value="false" />
        </el-form-item>
      </el-col>
      <el-col :span="form?.labelPosition === 'top' ? 8 : 24">
        <el-form-item label="清除环境变量">
          <el-switch v-model="cleanEnv" active-value="true" inactive-value="false" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="执行目录">
      <el-input v-model="directory" placeholder="请输入执行目录，默认当前目录" />
    </el-form-item>
    <el-form-item label="错误代码变量">
      <el-input v-model="errorCodeVariable" placeholder="请输入错误代码存储变量" />
    </el-form-item>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
