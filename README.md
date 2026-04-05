# 🔗 QuickLink - 静态短链服务

一个开箱即用的短链服务，基于 Cloudflare Pages 构建，纯静态方案，无需 Worker。

## 📦 快速开始

### 1. Fork 或复制此项目

```bash
# 克隆到本地
git clone https://github.com/yourusername/shortlink.git
cd shortlink
```

### 2. 配置你的短链

编辑 `links.json` 文件：

```json
{
  "/": "https://yourblog.example.com",
  "/github": "https://github.com/yourusername",
  "/blog": "https://yourblog.example.com"
}
```

**配置说明：**

- **普通跳转**：`"短链路径": "目标URL"`
- **选择页面**：使用对象配置（参见下方示例）

### 3. 部署到 Cloudflare Pages

#### 方法一：GitHub 自动部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
4. 选择你的仓库
5. 构建配置：
   - **Framework preset**: `None`
   - **Build command**: `node build.js`
   - **Build output directory**: `dist`
6. 点击 **Save and Deploy**

#### 方法二：手动上传

```bash
# 本地构建
node build.js

# 上传 dist 文件夹到 Cloudflare Pages
```

### 4. 绑定自定义域名

部署完成后：

1. 进入你的 Pages 项目 → **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名（如 `go.yourdomain.com`）
4. 按提示配置 DNS（Cloudflare 托管的域名会自动配置）

## 📖 配置详解

### 普通重定向

```json
{
  "/github": "https://github.com/yourusername",
  "/blog": "https://blog.yourdomain.com"
}
```

访问 `go.yourdomain.com/github` 会立即跳转到 GitHub。

### 选择页面

当需要让用户选择不同目标时，使用选择页面配置：

```json
{
  "/umami": {
    "type": "choice",
    "title": "选择 Umami 统计平台",
    "options": [
      {
        "label": "官方 Umami",
        "description": "cloud.umami.is",
        "url": "https://cloud.umami.is/share/xxx"
      },
      {
        "label": "自建 Umami",
        "description": "umami.yourdomain.com",
        "url": "https://umami.yourdomain.com/share/xxx"
      }
    ]
  }
}
```

访问 `go.yourdomain.com/umami` 会显示一个美观的选择界面。

## 🎨 自定义样式

### 修改跳转页面样式

编辑 `build.js` 中的 `generateRedirectPage()` 函数，修改 CSS 部分。

### 修改选择页面样式

编辑 `build.js` 中的 `generateChoicePage()` 函数，修改 CSS 部分。

### 修改 404 页面样式

编辑 `build.js` 中的 `generate404Page()` 函数，修改 CSS 部分。

## 🛠️ 本地开发

```bash
# 修改 links.json 后重新构建
node build.js

# 本地预览（需要任意 HTTP 服务器）
npx serve dist

# 或使用 Python
python -m http.server 8080 --directory dist
```

## 📁 项目结构

```
shortlink/
├── example/                ← 示例项目（本目录）
│   ├── links.json         ← 短链配置示例
│   └── README.md          ← 本文档
├── dist/                  ← 构建输出（自动生成）
│   ├── github/
│   │   └── index.html    ← /github 短链页面
│   ├── blog/
│   │   └── index.html    ← /blog 短链页面
│   ├── 404.html          ← 自定义404页面
│   └── index.html        ← 根域跳转页面
├── build.js              ← 构建脚本
├── links.json            ← 你的短链配置
└── README.md             ← 主文档
```

## ✨ 特性

- ✅ **纯静态**：无需后端，生成独立 HTML 文件
- ✅ **零 Worker 消耗**：不占用 Cloudflare Worker 请求数
- ✅ **全球 CDN**：Cloudflare 全球节点加速
- ✅ **极速响应**：直接返回静态文件，比 Function 快 10-50ms
- ✅ **选择页面**：支持一个短链提供多个选项
- ✅ **易于维护**：只需修改一个 JSON 文件
- ✅ **SEO 友好**：使用 meta refresh 和 JS 双重跳转

## 🔧 高级用法

### 嵌套路径

支持任意深度的路径：

```json
{
  "/social/github": "https://github.com/yourusername",
  "/social/twitter": "https://twitter.com/yourhandle"
}
```

### 批量管理

可以在 `links.json` 中使用注释（构建前用 JSON5 或手动管理）来分组管理不同用途的短链。

## 📝 更新短链

每次修改 `links.json` 后：

1. 推送代码到 Git（触发自动部署）
2. 或手动运行 `node build.js` 并上传 `dist` 文件夹

Cloudflare Pages 会在几分钟内部署完成。

## 🆘 常见问题

### Q: 为什么不用 301 重定向？

A: 纯静态页面使用 `<meta http-equiv="refresh">` + JavaScript 实现跳转，虽然比 HTTP 301 稍慢，但无需 Worker 即可工作，且对 SEO 影响很小。

### Q: 如何查看访问统计？

A: 可以使用 Cloudflare Pages 自带的访问分析，或在目标网站添加 Umami 等统计工具。

### Q: 支持动态参数吗？

A: 不支持。这是纯静态方案，所有短链必须预先在 `links.json` 中配置。

## 📄 许可证

MIT
