# GitHub Actions 未运行问题排查

## 快速检查清单

### 1. 确认工作流文件已推送 ✅
- 文件路径：`.github/workflows/deploy.yml`
- 已在本地提交并推送

### 2. 检查 GitHub Actions 是否启用

**步骤：**
1. 进入仓库：https://github.com/cingL/sk-try
2. 点击 **Settings** 标签页
3. 在左侧菜单中找到 **Actions** → **General**
4. 检查 **Actions permissions** 部分：
   - ✅ 应该选择 "Allow all actions and reusable workflows"
   - ✅ 或者至少选择 "Allow local actions and reusable workflows"

### 3. 检查工作流文件是否在 GitHub 上

**步骤：**
1. 访问：https://github.com/cingL/sk-try/tree/main/.github/workflows
2. 确认能看到 `deploy.yml` 文件
3. 点击文件查看内容是否正确

### 4. 手动触发工作流

**步骤：**
1. 进入仓库的 **Actions** 标签页
2. 在左侧工作流列表中找到 **"Deploy to GitHub Pages"**
3. 如果看不到，点击 **"All workflows"** 查看所有工作流
4. 点击工作流名称
5. 点击右侧的 **"Run workflow"** 按钮
6. 选择分支（main）
7. 点击绿色的 **"Run workflow"** 按钮

### 5. 检查工作流文件语法

工作流文件必须：
- ✅ 文件名以 `.yml` 或 `.yaml` 结尾
- ✅ 位于 `.github/workflows/` 目录下
- ✅ YAML 语法正确（缩进使用空格，不是 Tab）

### 6. 检查分支名称

确认：
- ✅ 工作流文件在 `main` 分支
- ✅ 触发条件中的分支名是 `main`（不是 `master`）

### 7. 检查仓库权限

如果这是组织仓库：
- ✅ 确认你有权限运行 Actions
- ✅ 检查组织级别的 Actions 设置

## 常见问题

### Q: Actions 标签页显示 "No workflows found"

**可能原因：**
1. 工作流文件还没有推送到 GitHub
2. 工作流文件路径不正确
3. GitHub Actions 被禁用

**解决方法：**
1. 确认 `.github/workflows/deploy.yml` 已推送
2. 检查 Settings → Actions → General 中的权限设置
3. 尝试推送一个小的更改来触发工作流

### Q: 工作流存在但不自动运行

**可能原因：**
1. 推送的分支不是 `main`
2. 工作流的触发条件配置错误

**解决方法：**
1. 确认当前分支是 `main`
2. 手动触发一次工作流（workflow_dispatch）

### Q: 工作流运行但失败

**检查：**
1. 查看 Actions 日志中的错误信息
2. 确认 GitHub Secrets 已配置
3. 检查构建步骤的错误

## 立即操作步骤

1. **推送测试工作流**（已创建 `test.yml`）
   ```powershell
   git add .github/workflows/test.yml
   git commit -m "添加测试工作流"
   git push origin main
   ```

2. **检查 Actions 标签页**
   - 等待几秒钟
   - 刷新页面
   - 查看是否有新的工作流运行

3. **如果测试工作流运行成功**
   - 说明 Actions 已启用
   - 可以手动触发 deploy.yml 工作流

4. **如果测试工作流也不运行**
   - 检查 Settings → Actions → General
   - 确认 Actions 权限设置正确

## 需要帮助？

如果以上步骤都无法解决问题，请提供：
1. Settings → Actions → General 页面的截图
2. Actions 标签页的截图
3. 任何错误信息
