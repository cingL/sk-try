# GitHub Pages 部署问题排查指南

## 404 错误排查步骤

### 1. 确认正确的访问地址

GitHub Pages 的 URL 格式：`https://<用户名>.github.io/<仓库名>/`

**你的仓库信息：**
- 用户名：`cingL`
- 仓库名：`speckit-try`
- **正确的访问地址**：`https://cingl.github.io/speckit-try/`

⚠️ **注意**：你访问的 `https://cingl.github.io/sk-try` 是错误的 URL！

### 2. 检查 GitHub Actions 部署状态

1. 进入 GitHub 仓库：https://github.com/cingL/speckit-try
2. 点击 **Actions** 标签页
3. 查看最新的 "Deploy to GitHub Pages" 工作流运行状态

**检查点：**
- ✅ 工作流是否成功运行？
- ✅ Build 步骤是否成功？
- ✅ Deploy 步骤是否成功？
- ❌ 如果有错误，查看错误日志

### 3. 检查 GitHub Pages 设置

1. 进入仓库的 **Settings** → **Pages**
2. 确认：
   - **Source** 设置为 **GitHub Actions**（不是分支）
   - 如果有 "Your site is live at" 提示，确认 URL 是否正确

### 4. 检查 GitHub Secrets 配置

确保已配置以下 Secrets（Settings → Secrets and variables → Actions）：

- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`
- ✅ `VITE_EVENT_ID`（如果应用需要）
- ✅ `VITE_BASE_PATH`（可选，默认已设置为 `/speckit-try/`）

**如果没有配置 Secrets，构建会失败！**

### 5. 常见问题

#### 问题 1：工作流没有运行

**原因**：可能没有推送到 main 分支，或者工作流文件路径不正确

**解决**：
- 确认 `.github/workflows/deploy.yml` 已提交
- 手动触发：Actions → Deploy to GitHub Pages → Run workflow

#### 问题 2：构建失败 - 缺少环境变量

**错误信息**：`Missing Supabase environment variables`

**解决**：
- 检查 GitHub Secrets 是否已配置
- 确认 Secret 名称拼写正确（区分大小写）

#### 问题 3：页面空白或资源加载失败

**原因**：base path 配置不正确

**解决**：
- 确认 `VITE_BASE_PATH` 设置为 `/speckit-try/`
- 检查浏览器控制台，查看资源加载错误

#### 问题 4：部署成功但页面 404

**可能原因**：
1. URL 不正确（仓库名拼写错误）
2. GitHub Pages 还在部署中（等待几分钟）
3. 浏览器缓存（尝试强制刷新 Ctrl+F5）

### 6. 验证部署

部署成功后，检查以下内容：

1. **访问正确的 URL**：`https://cingl.github.io/speckit-try/`
2. **检查页面元素**：打开浏览器开发者工具（F12）
   - Console 标签：查看是否有 JavaScript 错误
   - Network 标签：查看资源是否正常加载
   - 确认 Supabase 连接是否正常

3. **测试功能**：确认应用功能是否正常工作

### 7. 重新部署

如果需要重新部署：

1. **自动触发**：推送代码到 main 分支
2. **手动触发**：
   - 进入 Actions 标签页
   - 选择 "Deploy to GitHub Pages" 工作流
   - 点击 "Run workflow"

### 8. 获取帮助

如果问题仍然存在：

1. 查看 GitHub Actions 日志中的详细错误信息
2. 检查浏览器控制台的错误信息
3. 确认 Supabase 项目是否正常运行

## 快速检查清单

- [ ] 访问正确的 URL：`https://cingl.github.io/speckit-try/`
- [ ] GitHub Actions 工作流运行成功
- [ ] GitHub Pages 设置正确（Source = GitHub Actions）
- [ ] GitHub Secrets 已配置（至少 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY）
- [ ] 等待部署完成（可能需要几分钟）
- [ ] 清除浏览器缓存后重试
