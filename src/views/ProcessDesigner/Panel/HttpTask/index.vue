<script setup lang="ts">
import { useFieldRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { useFormItem } from 'element-plus'
import Codemirror from '@/components/CodemirrorEditor/index.vue'
import jsonSupport from '@/components/CodemirrorEditor/language/json'

defineOptions({
  name: 'HttpTask',
})
const { form } = useFormItem()
const requestMethod = useFieldRef('requestMethod')
const requestUrl = useFieldRef('requestUrl')
const requestHeaders = useFieldRef('requestHeaders')
const requestBody = useFieldRef('requestBody')
const ignoreException = useFieldRef('ignoreException')
const disallowRedirects = useFieldRef('disallowRedirects')
const saveResponseVariableAsJson = useFieldRef('saveResponseVariableAsJson')
const saveResponseParametersTransient = useFieldRef('saveResponseParametersTransient')
</script>

<template>
  <el-collapse-item name="arg1" title="请求">
    <el-form-item label="请求地址">
      <el-input v-model="requestUrl" placeholder="请输入请求地址">
        <template #prepend>
          <el-select
            v-model="requestMethod"
            placeholder="请求方法"
            :style="{ width: form?.size === 'small' ? '77px' : '95px' }"
          >
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
            <el-option label="DELETE" value="DELETE"></el-option>
          </el-select>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="请求头">
      <Codemirror
        :rows="4"
        :max-rows="6"
        autosize
        popup
        placeholder="请输入请求头"
        :extensions="[jsonSupport]"
        v-model="requestHeaders"
      />
      <!--      <el-input v-model="requestHeaders" type="textarea" :rows="3" placeholder="请输入请求头" />-->
    </el-form-item>
    <el-form-item label="请求体">
      <Codemirror
        :rows="4"
        :max-rows="6"
        autosize
        popup
        placeholder="请输入请求体"
        :extensions="[jsonSupport]"
        v-model="requestBody"
      />
      <!--      <el-input v-model="requestBody" type="textarea" :rows="3" placeholder="请输入请求体" />-->
    </el-form-item>
    <el-row :gutter="10">
      <el-col :span="form?.labelPosition === 'top' ? 12 : 24">
        <el-form-item label="忽略异常">
          <el-switch v-model="ignoreException" active-value="true" inactive-value="false" />
        </el-form-item>
      </el-col>
      <el-col :span="form?.labelPosition === 'top' ? 12 : 24">
        <el-form-item label="禁止重定向">
          <el-switch v-model="disallowRedirects" active-value="true" inactive-value="false" />
        </el-form-item>
      </el-col>
      <el-col :span="form?.labelPosition === 'top' ? 12 : 24">
        <el-form-item label="保存响应变量为JSON">
          <el-switch
            v-model="saveResponseVariableAsJson"
            active-value="true"
            inactive-value="false"
          />
        </el-form-item>
      </el-col>
      <el-col :span="form?.labelPosition === 'top' ? 12 : 24">
        <el-form-item label="保存响应参数为瞬时">
          <el-switch
            v-model="saveResponseParametersTransient"
            active-value="true"
            inactive-value="false"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
