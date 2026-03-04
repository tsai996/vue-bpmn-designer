import { type Completion, snippetCompletion } from '@codemirror/autocomplete'

export const javascriptCompletions: Completion[] = [
  snippetCompletion('execution.setVariable(${1:}, ${2:})', {
    label: 'execution.setVariable',
    type: 'method',
    detail: '设置流程变量',
    boost: 99,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>设置流程变量值。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">execution.setVariable(variableName: string, value: any): void</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">execution.setVariable("age", 18)</code></p>
      `
      return div
    },
  }),
  snippetCompletion('execution.setVariableLocal(${1:}, ${2:})', {
    label: 'execution.setVariableLocal',
    type: 'method',
    detail: '设置本地变量',
    boost: 98,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>设置本地变量值。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">execution.setVariableLocal(variableName: string, value: any): void</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">execution.setVariableLocal("age", 18)</code></p>
      `
      return div
    },
  }),
  snippetCompletion('execution.getVariable(${})', {
    label: 'execution.getVariable',
    type: 'method',
    detail: '获取流程变量',
    boost: 97,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>返回流程变量值。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">execution.getVariable(variableName: string): any</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">execution.getVariable("age") // 返回值：18</code></p>
      `
      return div
    },
  }),
  snippetCompletion('execution.getVariableLocal(${})', {
    label: 'execution.getVariableLocal',
    type: 'method',
    detail: '获取本地变量',
    boost: 96,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>返回本地变量值。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">execution.getVariableLocal(variableName: string): any</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">execution.getVariableLocal("age") // 返回值：18</code></p>
      `
      return div
    },
  }),
  snippetCompletion('execution.removeVariable(${})', {
    label: 'execution.removeVariable',
    type: 'method',
    detail: '删除流程变量',
    boost: 95,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>删除流程变量。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">execution.removeVariable(variableName: string): void</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">execution.removeVariable("age")</code></p>
      `
      return div
    },
  }),
  snippetCompletion('execution.removeVariables(${})', {
    label: 'execution.removeVariables',
    type: 'method',
    detail: '删除流程变量',
    boost: 94,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>删除流程变量。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">execution.removeVariables(variableNames?: string[]): void</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">execution.removeVariables() // 删除所有流程变量</code></p>
        <p><code class="language-js">execution.removeVariables(["age","name"]) // 删除指定流程变量</code></p>
      `
      return div
    },
  }),
  snippetCompletion('execution.hasVariable(${})', {
    label: 'execution.hasVariable',
    type: 'method',
    detail: '存在流程变量',
    boost: 93,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>是否存在流程变量。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">execution.hasVariable(variableName: string): boolean</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">execution.hasVariable("name") // 返回值：true</code></p>
      `
      return div
    },
  }),
  snippetCompletion('execution.hasVariableLocal(${})', {
    label: 'execution.hasVariableLocal',
    type: 'method',
    detail: '存在流程变量',
    boost: 92,
    info: () => {
      const div = document.createElement('div')
      div.classList.add('description')
      div.innerHTML = `
        <p>是否存在本地变量。</p>
        <p><strong>函数签名</strong></p>
        <p><code class="language-js">execution.hasVariableLocal(variableName: string): boolean</code></p>
        <p><strong>例子</strong></p>
        <p><code class="language-js">execution.hasVariableLocal("name") // 返回值：true</code></p>
      `
      return div
    },
  }),
]
export default javascriptCompletions
