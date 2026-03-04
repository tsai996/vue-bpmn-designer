# Bpmn-js (Flowable版) 规则 (AGENTS.md)

## 1. 技术栈

Vue3(SFC `<script setup lang="ts">`), Vite6, TS, Pinia, Vue Router, Element Plus, bpmn-js(含diagram-js等), SCSS.
**工具**: pnpm(禁用npm/yarn), unplugin-auto-import, unplugin-vue-components.

## 2. 核心约束

- **自动引入**: **严禁**手动import Vue核心API(ref/computed等)及Element Plus组件, 已全局配置自动引入。
- **状态管理**: 必须使用Pinia组合式(Setup Store)。
- **Bpmn-js(Flowable)**: 遵循Flowable XML前缀(`flowable:`). 操作DOM/业务对象**必须走**`modeling.updateProperties`等核心API记录撤销栈，**严禁**直接赋业务对象数据或改DOM。

## 3. 强制规范 (⚠️)

- **语言语用**: 文档、项目说明、代码注释**必须纯简体中文**。代码标识符(变量/函数/类等)**纯英文**(禁拼音). 日志报错可留英文。
- **注释**: 必须解释「**为什么(Why)**」及业务上下文/边界条件。重度bpmn-js操作**必加注释**。**绝不写**复述代码字面意思的废话注释。
- **类型**: 严抓TS类型定义(Props/接口)，少用`any`。
