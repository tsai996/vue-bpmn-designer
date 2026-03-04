<div align="center">
    <h1>vue-bpmn-designer</h1>
    <p>bpmn-js流程设计器 (Flowable版)</p>
</div>

---
## 在线预览

- 预览地址：http://182.61.39.195:4080/


基于 **Vue 3** + **Vite 6** + **TypeScript** 构建的现代化流程设计器组件。本项目深度集成了 `bpmn-js`，并针对 Flowable 规范进行了深度定制，提供了开箱即用的流程绘制、属性编辑和 BPMN lint 校验等能力。
如果对仿钉钉流程设计器感兴趣可查看：[lowflow-design](https://gitee.com/cai_xiao_feng/lowflow-design)。

## ✨ 特性 (Features)

- **⚡️ 最新技术栈**: Vue 3 (Composition API), Vite 6, TypeScript
- **🎨 全新 UI 体系**: 基于 Element Plus 和 SCSS
- **⚙️ 深度集成 Bpmn-js**:
  - 内置 `bpmn-js` (Flowable 语法支持)
  - `bpmn-js-bpmnlint` 实时语法校验
  - `bpmn-js-token-simulation` 模拟执行
  - 内置网格背景、迷你小地图 (`diagram-js-minimap`) 等增强插件
- **💻 强大的代码编辑器**: 内置 CodeMirror 6，用于高级脚本或配置编辑
- **🧩 极致的开发体验**:
  - 配置了 `unplugin-auto-import` 和 `unplugin-vue-components` 实现组件和 API 自动引入
  - 集成 ESLint、Prettier 进行代码规范检查

## 🖼️ 示例图

<p>
  <img alt="示例图1" src="public/sl1.png" width="480" style="display:inline-block" />
  <img alt="示例图2" src="public/sl2.png" width="480" style="display:inline-block" />
</p>

## 📦 安装 (Installation)

本项目推荐使用 `pnpm` 进行依赖管理。

```bash
# 克隆项目
git clone [repository-url]

# 进入项目目录
cd bpmnjs

# 安装依赖
pnpm install
```

## 🚀 运行与构建 (Scripts)

```bash
# 启动本地开发服务器 (默认端口等配置在 vite.config.ts)
pnpm dev

# 开发环境构建
pnpm build:dev

# 测试环境构建
pnpm build:test

# 生产环境构建 (包含类型检查)
pnpm build:prod
# 或者
pnpm build

# 预览构建后的本地产物
pnpm preview

# 代码类型检查
pnpm type-check

# 运行 ESLint 修复和 Prettier 格式化
pnpm lint
pnpm format
```

## 🛠️ 核心目录结构 (Structure)

```text
├── public/                 # 静态资源
├── src/                    # 源码核心目录
│   ├── assets/             # 静态资源 (icons, styles)
│   ├── components/         # 基础及公共业务组件
│   ├── typings/            # TS 类型定义及自动生成声明文件 (auto-imports.d.ts 等)
│   ├── App.vue             # 根组件
│   └── main.ts             # 挂载入口
├── .env.*                  # 多环境变量配置文件
├── AGENTS.md               # ⚠️ AI 开发规则与约束 (必须遵循)
├── eslint.config.ts        # ESLint 9 配置
├── vite.config.ts          # Vite 配置 (分包策略、插件配置等)
└── package.json            # 依赖管理和脚本定义
```

## ⚠️ 开发前必读 (Important)

1.  **自动引入**: 项目大量使用了基于 `unplugin` 的自动导入插件。开发时**切勿**手动导入 `vue` 核心 API (如 `ref`, `computed`) 以及 `element-plus` 组件。
2.  **Bpmn-js 引擎**: 操作底层 BPMN 模型数据时，**必须**通过 `modeling.updateProperties` 等内部 Command API 修改，**严禁**直接修改 DOM 或业务对象，否则会破坏撤销重做 (Undo/Redo) 功能。
3.  **AI 规则约束**: 请查阅根目录的 `AGENTS.md` 了解本项目给 AI / Copilot 定义的特殊规则。

## 社群交流

> 添加微信好友后（备注：bpmn）可邀请入群。

<p>
  <img alt="微信" src="public/wx.jpg" width="240" height="400" style="display:inline-block" />
  <img alt="QQ群" src="public/qq_qun.jpg" width="240" height="400" style="display:inline-block" />
</p>

## 赞助支持

如果项目对你有帮助，欢迎赞助支持持续维护。

<p>
  <img alt="微信支付" src="public/wxpay.png" width="240" height="240" style="display:inline-block" />
  <img alt="支付宝" src="public/alipay.png" width="240" height="240" style="display:inline-block" />
</p>

## 📄 协议 (License)

[Apache-2.0 License](./LICENSE)
