<script setup lang="ts">
import { useFieldRef } from '@/views/ProcessDesigner/utils/ElementUtil.ts'
import { useFormItem } from 'element-plus'

defineOptions({
  name: 'EmailTask',
})
const { form } = useFormItem()
const to = useFieldRef('to')
const cc = useFieldRef('cc')
const bcc = useFieldRef('bcc')
const subject = useFieldRef('subject')
const text = useFieldRef('text')
</script>

<template>
  <el-collapse-item name="arg1" :title="$tu('邮件')">
    <el-form-item :label="$tu('收件人')">
      <el-select
        v-model="to"
        multiple
        filterable
        allow-create
        clearable
        :placeholder="$tu('请选择收件人')"
      >
        <el-option :label="$tu('张三')" value="zhangsan@qq.com" />
        <el-option :label="$tu('李四')" value="lisi@qq.com" />
        <el-option :label="$tu('王五')" value="wangwu@qq.com" />
        <el-option :label="$tu('毛六')" value="maoliu@qq.com" />
        <el-option :label="$tu('钱七')" value="qianqi@qq.com" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$tu('主题')">
      <el-input v-model="subject" :placeholder="$tu('请输入主题')" />
    </el-form-item>
    <el-form-item :label="$tu('内容')">
      <el-input v-model="text" type="textarea" :rows="4" :placeholder="$tu('请输入内容')" />
    </el-form-item>
    <el-row :gutter="10">
      <el-col :span="form?.labelPosition === 'top' ? 12 : 24">
        <el-form-item :label="$tu('抄送')">
          <el-select
            v-model="cc"
            collapse-tags
            collapse-tags-tooltip
            multiple
            filterable
            allow-create
            clearable
            :placeholder="$tu('请选择抄送人')"
          >
            <el-option :label="$tu('张三')" value="zhangsan@qq.com" />
            <el-option :label="$tu('李四')" value="lisi@qq.com" />
            <el-option :label="$tu('王五')" value="wangwu@qq.com" />
            <el-option :label="$tu('毛六')" value="maoliu@qq.com" />
            <el-option :label="$tu('钱七')" value="qianqi@qq.com" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="form?.labelPosition === 'top' ? 12 : 24">
        <el-form-item :label="$tu('密送')">
          <el-select
            v-model="bcc"
            collapse-tags
            collapse-tags-tooltip
            multiple
            filterable
            allow-create
            clearable
            :placeholder="$tu('请选择密送人')"
          >
            <el-option :label="$tu('张三')" value="zhangsan@qq.com" />
            <el-option :label="$tu('李四')" value="lisi@qq.com" />
            <el-option :label="$tu('王五')" value="wangwu@qq.com" />
            <el-option :label="$tu('毛六')" value="maoliu@qq.com" />
            <el-option :label="$tu('钱七')" value="qianqi@qq.com" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-collapse-item>
</template>

<style scoped lang="scss"></style>
