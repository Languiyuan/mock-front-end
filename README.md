# mock-front-end

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### commit lint

```javascript
// { value: "feat", name: "特性:   🚀  新增功能", emoji: "🚀" },
// { value: "fix", name: "修复:   🧩  修复缺陷", emoji: "🧩" },
// { value: "docs", name: "文档:   📚  文档变更", emoji: "📚" },
// { value: "style", name: "格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）", emoji: "🎨" },
// { value: "refactor", name: "重构:   ♻️  代码重构（不包括 bug 修复、功能新增）", emoji: "♻️" },
// { value: "perf", name: "性能:    ⚡️  性能优化", emoji: "⚡️" },
// { value: "test", name: "测试:   ✅  添加疏漏测试或已有测试改动", emoji: "✅" },
// { value: "build", name: "构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）", emoji: "📦️" },
// { value: "ci", name: "集成:   🎡  修改 CI 配置、脚本", emoji: "🎡" },
// { value: "revert", name: "回退:   ⏪️  回滚 commit", emoji: "⏪️" },
// { value: "chore", name: "其他:   🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）", emoji: "🔨" },
// { value: "wip", name: "开发:   🕔  正在开发中", emoji: "🕔" },
// { value: "workflow", name: "工作流:   📋  工作流程改进", emoji: "📋" },
// { value: "types", name: "类型:   🔰  类型定义文件修改", emoji: "🔰" }
```
