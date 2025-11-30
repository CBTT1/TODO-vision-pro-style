# 部署指南

本指南将帮助您将 Vision Pro TODO 应用部署到生产环境。

## 📦 构建生产版本

首先，确保所有依赖已安装：

```bash
npm install
```

然后构建生产版本：

```bash
npm run build
```

构建完成后，会在 `dist` 目录生成优化后的生产文件。

## 🚀 部署选项

### 方式一：Vercel（推荐）

Vercel 是最简单的部署方式，特别适合 Vite + React 项目。

#### 步骤：

1. **安装 Vercel CLI**（如果还没有）：
```bash
npm i -g vercel
```

2. **登录 Vercel**：
```bash
vercel login
```

3. **部署**：
```bash
vercel
```

4. **或者通过 GitHub 自动部署**：
   - 将代码推送到 GitHub
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入您的 GitHub 仓库
   - Vercel 会自动检测 Vite 配置并部署

#### Vercel 配置（可选）

创建 `vercel.json` 文件以自定义配置：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

### 方式二：Netlify

Netlify 也提供了简单的部署流程。

#### 步骤：

1. **安装 Netlify CLI**：
```bash
npm i -g netlify-cli
```

2. **登录 Netlify**：
```bash
netlify login
```

3. **初始化并部署**：
```bash
npm run build
netlify deploy --prod --dir=dist
```

4. **或者通过拖拽部署**：
   - 访问 [app.netlify.com](https://app.netlify.com)
   - 将 `dist` 文件夹拖拽到部署区域

#### Netlify 配置

创建 `netlify.toml` 文件：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 方式三：GitHub Pages

适合免费托管静态网站。

#### 步骤：

1. **安装 gh-pages**：
```bash
npm install --save-dev gh-pages
```

2. **在 `package.json` 中添加脚本**：
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **修改 `vite.config.ts`**：
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // 替换为您的仓库名称
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

4. **部署**：
```bash
npm run deploy
```

---

### 方式四：Cloudflare Pages

Cloudflare Pages 提供快速且免费的部署。

#### 步骤：

1. **将代码推送到 GitHub/GitLab**

2. **访问 [dash.cloudflare.com](https://dash.cloudflare.com)**

3. **选择 Pages → Create a project**

4. **连接您的 Git 仓库**

5. **配置构建设置**：
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Framework preset: `Vite`

---

### 方式五：传统服务器部署

如果您有自己的服务器，可以这样部署：

#### 步骤：

1. **构建项目**：
```bash
npm run build
```

2. **将 `dist` 目录上传到服务器**

3. **配置 Web 服务器**（Nginx 示例）：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔧 环境变量（如果需要）

如果将来需要添加环境变量，创建 `.env.production` 文件：

```env
VITE_API_URL=https://api.example.com
```

然后在代码中使用：
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

**注意**：Vite 要求环境变量以 `VITE_` 开头才能在客户端使用。

---

## 📝 部署前检查清单

- [ ] 运行 `npm run build` 确保构建成功
- [ ] 运行 `npm run preview` 本地预览生产版本
- [ ] 检查所有功能是否正常工作
- [ ] 确保没有控制台错误
- [ ] 测试在不同设备上的响应式设计
- [ ] 检查 3D 场景性能

---

## 🐛 常见问题

### 问题：路由 404 错误

**解决方案**：确保服务器配置了将所有路由重定向到 `index.html`（单页应用需要）。

### 问题：资源加载失败

**解决方案**：检查 `vite.config.ts` 中的 `base` 配置是否正确。

### 问题：3D 场景性能问题

**解决方案**：在生产环境中，可以考虑：
- 减少星星数量
- 降低网格分辨率
- 优化动画性能

---

## 🎉 部署完成

部署成功后，您就可以通过 URL 访问您的应用了！

如果需要更新应用，只需：
1. 修改代码
2. 提交到 Git
3. 重新部署（或等待自动部署）

