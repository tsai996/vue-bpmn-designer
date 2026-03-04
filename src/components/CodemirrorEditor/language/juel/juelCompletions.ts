import { type Completion, snippetCompletion } from '@codemirror/autocomplete'

export const JuelCompletions: Completion[] = [
  snippetCompletion('var:eq(${1:}, ${2:})', {
    label: 'var:eq',
    type: 'method',
    detail: '等于',
    boost: 99,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
          <p>流程变量等于比较。</p>
          <p><strong>函数签名</strong></p>
          <p><code class="language-js">var.eq(variableName: String, value: Object): Boolean</code></p>
          <p><strong>例子</strong></p>
          <p><code class="language-js">var.eq("age", 18) // 返回值：true</code></p>
        `
      return div
    },
  }),
  snippetCompletion('var:ne(${1:}, ${2:})', {
    label: 'var:ne',
    type: 'method',
    detail: '不等于',
    boost: 98,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>流程变量不等于比较。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">var.ne(variableName: String, value: Object): Boolean</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">var.ne("age", 18) // 返回值：true</code></p>
      `
      return div
    },
  }),
  snippetCompletion('var:lt(${1:}, ${2:})', {
    label: 'var:lt',
    type: 'method',
    detail: '小于',
    boost: 97,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>流程变量小于比较。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">var.lt(variableName: String, value: Object): Boolean</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">var.lt("age", 18) // 返回值：true</code></p>
      `
      return div
    },
  }),
  snippetCompletion('var:lte(${1:}, ${2:})', {
    label: 'var:lte',
    type: 'method',
    detail: '小于等于',
    boost: 96,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
          <p>流程变量小于等于比较。</p>
          <p><strong>函数签名</strong></p>
          <p><code class="language-js">var.lte(variableName: String, value: Object): Boolean</code></p>
          <p><strong>例子</strong></p>
          <p><code class="language-js">var.lte("age", 18) // 返回值：true</code></p>
        `
      return div
    },
  }),
  snippetCompletion('var:gt(${1:}, ${2:})', {
    label: 'var:gt',
    type: 'method',
    detail: '大于',
    boost: 95,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>流程变量大于比较。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">var.gt(variableName: String, value: Object): Boolean</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">var.gt("age", 18) // 返回值：true</code></p>
      `
      return div
    },
  }),
  snippetCompletion('var:gte(${1:}, ${2:})', {
    label: 'var:gte',
    type: 'method',
    detail: '大于等于',
    boost: 94,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
          <p>流程变量大于等于比较。</p>
          <p><strong>函数签名</strong></p>
          <p><code class="language-js">var.gte(variableName: String, value: Object): Boolean</code></p>
          <p><strong>例子</strong></p>
          <p><code class="language-js">var.gte("age", 18) // 返回值：true</code></p>
        `
      return div
    },
  }),
  snippetCompletion('var:get(${})', {
    label: 'var:get',
    type: 'method',
    detail: '获取流程变量',
    boost: 93,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>返回流程变量值。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">var.get(variableName: string): any</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">var.get("age") // 返回值：18</code></p>
      `
      return div
    },
  }),
  snippetCompletion('var:getOrDefault(${1:}, ${2:})', {
    label: 'var:getOrDefault',
    type: 'method',
    detail: '获取流程变量或默认值',
    boost: 92,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>返回流程变量值，如果不存在则返回默认值。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">var.getOrDefault(variableName: String, defaultValue: Object): Object</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">var.getOrDefault("age", 18) // 返回值：18</code></p>
      `
      return div
    },
  }),
  snippetCompletion('var:exist(${})', {
    label: 'var:exist',
    type: 'method',
    detail: '判断流程变量是否存在',
    boost: 91,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
            <p>判断流程变量是否存在。</p>
            <p><strong>函数签名</strong></p>
            <p><code class="language-js">var.exist(variableName: String): Boolean</code></p>
            <p><strong>例子</strong></p>
            <p><code class="language-js">var.exist("age") // 返回值：true</code></p>
          `
      return div
    },
  }),
  snippetCompletion('var:contains(${1:}, ${2:})', {
    label: 'var:contains',
    type: 'method',
    detail: '判断流程变量是否包含',
    boost: 90,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
              <p>判断流程变量是否包含指定值。</p>
              <p><strong>函数签名</strong></p>
              <p><code class="language-js">var.contains(variableName: String, value: Object): Boolean</code></p>
              <p><strong>例子</strong></p>
              <p><code class="language-js">var.contains("tags", "important") // 返回值：true</code></p>
            `
      return div
    },
  }),
  snippetCompletion('var:containsAny(${1:}, ${2:})', {
    label: 'var:containsAny',
    type: 'method',
    detail: '判断流程变量是否包含任意一个值',
    boost: 89,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
              <p>判断流程变量是否包含任意一个值。</p>
              <p><strong>函数签名</strong></p>
              <p><code class="language-js">var.containsAny(variableName: String, values: Array&lt;Object&gt;): Boolean</code></p>
              <p><strong>例子</strong></p>
              <p><code class="language-js">var.containsAny("tags", ["important", "urgent"]) // 返回值：true</code></p>
            `
      return div
    },
  }),
  snippetCompletion('var:base64("encode", ${})', {
    label: 'var:base64',
    type: 'method',
    detail: 'base64编码/解码',
    boost: 88,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
              <p>base64编码/解码</p>
              <p><strong>函数签名</strong></p>
              <p><code class="language-js">var.base64(operation: String, value: String): String</code></p>
              <p><strong>例子</strong></p>
              <p><code class="language-js">var.base64("encode", "Hello World") // 返回值：SGVsbG8gV29ybGQ=</code></p>
              <p><code class="language-js">var.base64("decode", "SGVsbG8gV29ybGQ=") // 返回值：Hello World</code></p>
              `
      return div
    },
  }),
  snippetCompletion('var:isEmpty(${})', {
    label: 'var:isEmpty',
    type: 'method',
    detail: '判断流程变量是否为空',
    boost: 87,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
            <p>判断流程变量是否为空。</p>
            <p><strong>函数签名</strong></p>
            <p><code class="language-js">var.isEmpty(variableName: String): Boolean</code></p>
            <p><strong>例子</strong></p>
            <p><code class="language-js">var.isEmpty("age") // 返回值：true</code></p>
          `
      return div
    },
  }),
  snippetCompletion('var:notEmpty(${})', {
    label: 'var:notEmpty',
    type: 'method',
    detail: '判断流程变量是否为空',
    boost: 86,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
         <p>判断流程变量是否为空。</p>
         <p><strong>函数签名</strong></p>
         <p><code class="language-js">var.notEmpty(variableName: String): Boolean</code></p>
         <p><strong>例子</strong></p>
         <p><code class="language-js">var.notEmpty("age") // 返回值：true</code></p>
       `
      return div
    },
  }),
  snippetCompletion('bpmn:getAssignee()', {
    label: 'bpmn:getAssignee',
    type: 'method',
    detail: '获取任务分配人',
    boost: 85,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
         <p>获取任务分配人。</p>
         <p><strong>函数签名</strong></p>
         <p><code class="language-js">bpmn:getAssignee(): String</code></p>
         <p><strong>例子</strong></p>
          <p><code class="language-js">bpmn:getAssignee() // 返回值："zhangsan"</code></p>
      `
      return div
    },
  }),
  snippetCompletion('bpmn:removeAssignee()', {
    label: 'bpmn:removeAssignee',
    type: 'method',
    detail: '移除任务分配人',
    boost: 84,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
          <p>移除任务分配人。</p>
          <p><strong>函数签名</strong></p>
          <p><code class="language-js">bpmn:removeAssignee(): Void</code></p>
          <p><strong>例子</strong></p>
          <p><code class="language-js">bpmn:removeAssignee()</code></p>
        `
      return div
    },
  }),
  snippetCompletion('bpmn:getOwner()', {
    label: 'bpmn:getOwner',
    type: 'method',
    detail: '获取任务拥有者',
    boost: 83,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
          <p>获取任务拥有者。</p>
          <p><strong>函数签名</strong></p>
          <p><code class="language-js">bpmn:getOwner(): String</code></p>
          <p><strong>例子</strong></p>
          <p><code class="language-js">bpmn:getOwner() // 返回值："zhangsan"</code></p>
        `
      return div
    },
  }),
  snippetCompletion('bpmn:removeOwner()', {
    label: 'bpmn:removeOwner',
    type: 'method',
    detail: '移除任务拥有者',
    boost: 82,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
          <p>移除任务拥有者。</p>
          <p><strong>函数签名</strong></p>
          <p><code class="language-js">bpmn:removeOwner(): Void</code></p>
          <p><strong>例子</strong></p>
          <p><code class="language-js">bpmn:removeOwner()</code></p>
        `
      return div
    },
  }),
  snippetCompletion('bpmn:copyLocalVariable(${1:}, ${2:})', {
    label: 'bpmn:copyLocalVariable',
    type: 'method',
    detail: '复制本地变量',
    boost: 81,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
              <p>复制本地变量。</p>
              <p><strong>函数签名</strong></p>
              <p><code class="language-js">bpmn:copyLocalVariable(sourceVariableName: String, targetVariableName: String): Void</code></p>
              <p><strong>例子</strong></p>
              <p><code class="language-js">bpmn:copyLocalVariable("source", "target")</code></p>
            `
      return div
    },
  }),
  snippetCompletion('bpmn:copyLocalVariableToParent(${1:}, ${2:})', {
    label: 'bpmn:copyLocalVariableToParent',
    type: 'method',
    detail: '复制本地变量到父级',
    boost: 80,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
              <p>复制本地变量到父级。</p>
              <p><strong>函数签名</strong></p>
              <p><code class="language-js">bpmn:copyLocalVariableToParent(sourceVariableName: String, targetVariableName: String): Void</code></p>
              <p><strong>例子</strong></p>
              <p><code class="language-js">bpmn:copyLocalVariableToParent("source", "target")</code></p>
            `
      return div
    },
  }),
  snippetCompletion('bpmn:getTask(${})', {
    label: 'bpmn:getTask',
    type: 'method',
    detail: '获取任务',
    boost: 79,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
            <p>获取任务。</p>
            <p><strong>函数签名</strong></p>
            <p><code class="language-js">bpmn:getTask(taskId: String): Task</code></p>
            <p><strong>例子</strong></p>
            <p><code class="language-js">bpmn:getTask("taskId")</code></p>
          `
      return div
    },
  }),
  snippetCompletion('bpmn:replaceVariableInList(${1:}, ${2:}, ${3:})', {
    label: 'bpmn:replaceVariableInList',
    type: 'method',
    detail: '替换变量列表',
    boost: 78,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
            <p>替换变量列表。</p>
            <p><strong>函数签名</strong></p>
            <p><code class="language-js">bpmn:replaceVariableInList(variableName: String, index: Integer, listVariableName: List<Object>): Void</code></p>
            <p><strong>例子</strong></p>
            <p><code class="language-js">bpmn:replaceVariableInList("variableName", 0, "listVariableName")</code></p>
          `
      return div
    },
  }),
  snippetCompletion('bpmn:setBusinessStatus(${})', {
    label: 'bpmn:setBusinessStatus',
    type: 'method',
    detail: '设置业务状态',
    boost: 77,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
            <p>设置业务状态。</p>
            <p><strong>函数签名</strong></p>
            <p><code class="language-js">bpmn:setBusinessStatus(status: String): Void</code></p>
            <p><strong>例子</strong></p>
            <p><code class="language-js">bpmn:setBusinessStatus("status")</code></p>
          `
      return div
    },
  }),
  snippetCompletion('bpmn:triggerCaseEvaluation()', {
    label: 'bpmn:triggerCaseEvaluation',
    type: 'method',
    detail: '触发案例评估',
    boost: 76,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
            <p>触发案例评估。</p>
            <p><strong>函数签名</strong></p>
            <p><code class="language-js">bpmn:triggerCaseEvaluation(): Void</code></p>
            <p><strong>例子</strong></p>
            <p><code class="language-js">bpmn:triggerCaseEvaluation()</code></p>
          `
      return div
    },
  }),
]
export default JuelCompletions
