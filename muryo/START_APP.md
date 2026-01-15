# 启动应用指南

## ✅ 当前状态

- ✅ Node.js 已升级到 v20.20.0
- ✅ 项目依赖已重新安装
- ✅ 环境变量已配置
- ✅ Supabase 数据库已设置

## 🚀 启动应用

### 步骤 1: 打开新的终端窗口

**重要**: 由于 Node.js 版本已更新，请打开**新的** PowerShell 或命令提示符窗口，以确保使用新的 Node.js 版本。

### 步骤 2: 进入项目目录

```powershell
cd H:\play-v-\speckit\muryo\muryo
```

### 步骤 3: 验证 Node.js 版本

```powershell
node --version
```

应该显示: `v20.20.0` 或更高

### 步骤 4: 启动开发服务器

```powershell
npm run dev
```

### 步骤 5: 访问应用

打开浏览器访问: **http://localhost:3000**

---

## 📋 预期结果

### 如果一切正常：

1. **终端显示**:
   ```
   VITE v7.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

2. **浏览器显示**:
   - 应用标题: "活动无料信息"
   - 如果已有测试数据: 显示无料卡片列表
   - 如果没有数据: 显示 "暂无无料信息"

### 如果遇到问题：

#### 问题 1: 仍然显示 Node.js 版本错误

**解决**:
- 关闭所有终端窗口
- 重新打开新的 PowerShell
- 运行 `node --version` 确认版本
- 如果还是旧版本，检查 nvm 设置: `nvm use 20`

#### 问题 2: 环境变量未加载

**解决**:
- 确保 `.env.local` 文件在 `muryo/` 目录下
- 重启开发服务器
- 检查文件内容是否正确

#### 问题 3: Supabase 连接错误

**解决**:
- 检查 `.env.local` 中的 Supabase URL 和 Key
- 确认 Supabase 项目正常运行
- 检查浏览器控制台的错误信息

#### 问题 4: 显示 "暂无无料信息"

**这是正常的！** 如果还没有创建测试数据：
- 可以运行 `supabase/complete_test_data.sql` 创建测试数据
- 或通过 Supabase Dashboard 手动添加数据

---

## 🧪 测试清单

启动应用后，检查：

- [ ] 开发服务器成功启动（无错误）
- [ ] 浏览器能访问 `http://localhost:3000`
- [ ] 页面显示 "活动无料信息" 标题
- [ ] 没有控制台错误（F12 打开开发者工具）
- [ ] 如果已有数据，能正常显示列表

---

## 📝 下一步

应用成功启动后，您可以：

1. **添加测试数据**:
   - 运行 `supabase/complete_test_data.sql` 创建完整测试数据
   - 或通过 Supabase Dashboard 的 Table Editor 手动添加

2. **继续开发**:
   - Phase 4: 搜索与筛选功能
   - Phase 5: 详情页和外部链接跳转

3. **测试功能**:
   - 测试列表加载
   - 测试卡片点击
   - 测试响应式设计

---

## 💡 提示

- 开发服务器支持热重载，修改代码后会自动刷新
- 按 `Ctrl+C` 停止开发服务器
- 查看浏览器控制台（F12）了解详细错误信息
