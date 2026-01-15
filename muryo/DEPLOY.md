# GitHub Pages 部署指南

## 项目架构说明

这个项目采用前后端分离架构：

- **后端服务**：使用 Supabase（Backend as a Service）
  - 数据库和 API 已经在 Supabase 云上运行
  - 不需要单独部署后端代码
  - 后端配置通过环境变量连接

- **前端应用**：React + Vite 单页应用
  - 可以部署到 GitHub Pages（静态站点托管）
  - 通过 GitHub Actions 自动构建和部署

## 部署步骤

### 1. 准备 GitHub 仓库

确保你的代码已经推送到 GitHub 仓库。

### 2. 配置 GitHub Secrets

在 GitHub 仓库中设置以下 Secrets（Settings → Secrets and variables → Actions）：

1. **VITE_SUPABASE_URL**
   - 值：你的 Supabase 项目 URL
   - 格式：`https://xxxxx.supabase.co`
   - 获取方式：Supabase Dashboard → Settings → API → Project URL

2. **VITE_SUPABASE_ANON_KEY**
   - 值：你的 Supabase anon public key
   - 格式：JWT token（以 `eyJ` 开头）
   - 获取方式：Supabase Dashboard → Settings → API → anon public key

3. **VITE_EVENT_ID**（可选）
   - 值：你的活动 ID（UUID 格式）
   - 如果应用需要特定活动 ID，请设置此值

4. **VITE_BASE_PATH**（可选）
   - 值：GitHub Pages 的基础路径
   - 如果仓库不在根目录，设置为 `/仓库名/`（例如：`/sk-try/`）
   - 如果部署到自定义域名或根目录，可以设置为 `/` 或不设置
   - 默认值：`/sk-try/`（已根据仓库名自动配置）

### 3. 启用 GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 在左侧菜单中找到 **Pages**
3. 在 **Source** 部分：
   - 选择 **GitHub Actions** 作为部署源
   - 不要选择分支部署（因为我们使用 Actions 部署）

### 4. 触发部署

部署会在以下情况自动触发：

- ✅ 推送到 `main` 分支时
- ✅ 手动触发（Actions → Deploy to GitHub Pages → Run workflow）

### 5. 查看部署状态

1. 进入仓库的 **Actions** 标签页
2. 查看最新的工作流运行状态
3. 部署成功后，在 **Settings → Pages** 中可以看到你的网站 URL

## 部署后的访问地址

部署成功后，你的应用可以通过以下地址访问：

```
https://<你的用户名>.github.io/<仓库名>/
```

或者如果你使用了自定义域名：

```
https://<你的自定义域名>/
```

## 环境变量说明

### 开发环境（本地）

在 `muryo/.env.local` 文件中配置：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_EVENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 生产环境（GitHub Pages）

通过 GitHub Secrets 配置（见步骤 2）。

## 常见问题

### Q: 部署后页面显示空白？

**A:** 检查以下几点：
1. 确认 GitHub Secrets 已正确配置
2. 检查构建日志中是否有错误
3. 确认 `vite.config.ts` 中的 `base` 配置是否正确（如果仓库不在根目录）
4. 打开浏览器开发者工具，查看控制台错误

### Q: 如何更新部署？

**A:** 
- 推送代码到 `main` 分支会自动触发部署
- 或者手动在 Actions 页面触发工作流

### Q: 可以部署到其他分支吗？

**A:** 可以，修改 `.github/workflows/deploy.yml` 中的 `branches` 配置：

```yaml
push:
  branches:
    - main
    - develop  # 添加其他分支
```

### Q: Supabase 后端需要单独部署吗？

**A:** 不需要。Supabase 是云服务，你的数据库和 API 已经在 Supabase 云上运行。只需要确保：
- Supabase 项目正常运行
- RLS（Row Level Security）策略已正确配置
- 环境变量中的 Supabase URL 和 Key 正确

## 安全提示

✅ **安全做法**：
- 使用 GitHub Secrets 存储敏感信息
- Supabase anon key 是公开的，可以安全地用于前端
- 使用 RLS 策略保护数据库

❌ **不安全做法**：
- 不要将 `.env.local` 提交到 Git
- 不要在前端使用 Supabase service_role key
- 不要在代码中硬编码密钥

## 相关文档

- [Supabase 环境变量获取指南](./supabase/HOW_TO_GET_ENV_VARS.md)
- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
