# Vision Pro TODO - 空间计算待办事项应用

一个具有 Vision Pro 风格的暗黑空间计算 TODO 应用，采用 React Three Fiber、Tailwind CSS 和 shadcn/ui 构建。

## 特性

- 🎨 **Vision Pro 风格设计** - 毛玻璃悬浮卡片、3D 深度效果
- 🌌 **3D 空间场景** - 使用 React Three Fiber 创建的沉浸式 3D 背景
- 🎯 **手势拖拽排序** - 使用 @dnd-kit 实现流畅的拖拽排序
- 🤖 **AI 智能建议** - 基于待办事项的智能建议功能
- 💾 **本地存储** - 自动保存到 localStorage
- ⚡ **流畅动画** - 使用 Framer Motion 实现丝滑的动画效果

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **React Three Fiber** - 3D 渲染
- **@react-three/drei** - Three.js 辅助库
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库
- **Framer Motion** - 动画库
- **@dnd-kit** - 拖拽功能
- **Lucide React** - 图标库

## 安装

```bash
npm install
```

## 运行

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

## 构建

```bash
npm run build
```

## 项目结构

```
src/
├── components/
│   ├── ui/           # shadcn/ui 组件
│   ├── Scene3D.tsx   # 3D 场景组件
│   ├── DepthGrid.tsx # 3D 深度网格
│   ├── TodoCard.tsx  # 待办卡片组件
│   ├── TodoList.tsx  # 待办列表组件
│   ├── SortableTodoCard.tsx # 可排序卡片
│   └── AISuggestions.tsx    # AI 建议组件
├── types/
│   └── todo.ts       # TypeScript 类型定义
├── lib/
│   └── utils.ts      # 工具函数
├── App.tsx           # 主应用组件
└── main.tsx          # 入口文件
```

## 功能说明

### 添加待办事项
点击"添加待办"按钮，输入内容并选择优先级（高/中/低）。

### 拖拽排序
长按卡片并拖拽即可重新排序待办事项。

### AI 智能建议
点击"AI 智能建议"按钮，系统会基于当前待办事项生成个性化建议。

### 完成任务
点击卡片左侧的圆圈即可标记任务为完成状态。

### 删除任务
点击卡片右侧的删除按钮即可删除任务。

## 自定义

### 修改 3D 场景
编辑 `src/components/Scene3D.tsx` 和 `src/components/DepthGrid.tsx` 来自定义 3D 效果。

### 修改样式
编辑 `src/index.css` 和 `tailwind.config.js` 来自定义主题和样式。

### 集成真实 AI API
在 `src/components/AISuggestions.tsx` 中替换模拟的 AI 建议为真实的 API 调用。

## 部署

详细的部署指南请查看 [DEPLOY.md](./DEPLOY.md)

### 快速部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel
```

或者直接访问 [vercel.com](https://vercel.com) 通过 GitHub 导入项目自动部署。

## 许可证

MIT

