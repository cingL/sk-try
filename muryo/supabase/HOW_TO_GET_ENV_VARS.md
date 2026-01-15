# 如何获取 Supabase 环境变量

## 步骤 1: 登录 Supabase Dashboard

1. 访问 [https://supabase.com](https://supabase.com)
2. 登录您的账户
3. 选择您的项目（如果没有项目，先创建一个）

## 步骤 2: 打开 API 设置页面

1. 在左侧导航栏中，点击 **Settings**（设置）
2. 在设置菜单中，点击 **API**

## 步骤 3: 找到所需的值

在 API 设置页面中，您会看到以下信息：

### Project URL
- **位置**: 页面顶部的 "Project URL" 部分
- **格式**: `https://xxxxxxxxxxxxx.supabase.co`
- **用途**: 复制这个值到 `.env.local` 作为 `VITE_SUPABASE_URL`

### API Keys
在 "Project API keys" 部分，您会看到多个密钥：

#### anon public (推荐用于前端)
- **位置**: "Project API keys" → "anon" → "public" 列
- **格式**: 一个很长的字符串，类似 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **用途**: 复制这个值到 `.env.local` 作为 `VITE_SUPABASE_ANON_KEY`
- **注意**: 这个密钥是公开的，可以安全地用于前端代码

#### service_role (仅用于后端，不要用于前端)
- **警告**: ⚠️ 不要在前端使用 `service_role` 密钥！
- 这个密钥有完整权限，只能在后端服务器使用

## 步骤 4: 复制值到环境变量文件

1. 在项目根目录创建 `.env.local` 文件（如果还没有）
2. 复制以下模板并填入实际值：

```env
# 从 Supabase Dashboard -> Settings -> API 获取

# Project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# anon public key
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2MjM5MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Event ID (从 seed_test_data.sql 执行结果获取)
VITE_EVENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## 可视化指南

```
Supabase Dashboard
├── Settings (左侧导航栏)
│   └── API (点击这里)
│       ├── Project URL
│       │   └── https://xxxxx.supabase.co  ← 复制这个
│       └── Project API keys
│           ├── anon
│           │   └── public: eyJhbGc...  ← 复制这个
│           └── service_role (不要使用)
```

## 快速检查清单

- [ ] 已登录 Supabase Dashboard
- [ ] 已选择正确的项目
- [ ] 已打开 Settings → API 页面
- [ ] 已复制 Project URL
- [ ] 已复制 anon public key
- [ ] 已创建 `.env.local` 文件
- [ ] 已将值填入 `.env.local`

## 常见问题

**Q: 找不到 API 设置页面？**
- A: 确保您有项目的管理员权限

**Q: anon key 和 service_role key 有什么区别？**
- A: 
  - `anon` key: 公开密钥，受 Row Level Security (RLS) 策略限制，安全用于前端
  - `service_role` key: 私有密钥，绕过 RLS，只能在后端使用

**Q: 可以分享这些密钥吗？**
- A: 
  - `anon` key: 可以，它是设计为公开的
  - `service_role` key: **绝对不要**分享或提交到代码仓库

**Q: 如何重置密钥？**
- A: 在 API 设置页面，点击密钥旁边的 "Reset" 按钮

## 安全提示

✅ **安全做法**:
- 使用 `anon` key 在前端代码中
- 将 `.env.local` 添加到 `.gitignore`（已完成）
- 使用 RLS 策略保护数据

❌ **不安全做法**:
- 在前端使用 `service_role` key
- 将密钥提交到 Git 仓库
- 在客户端代码中硬编码密钥
