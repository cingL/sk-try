# Supabase 数据库设置指南

## T011: 运行 SQL 迁移

### 步骤 1: 登录 Supabase Dashboard

1. 访问 [supabase.com](https://supabase.com)
2. 登录您的账户
3. 选择您的项目（如果没有项目，先创建一个新项目）

### 步骤 2: 打开 SQL Editor

1. 在左侧导航栏中，点击 **SQL Editor**
2. 点击 **New query** 创建新查询

### 步骤 3: 执行迁移脚本

1. 打开 `supabase/migrations/001_initial_schema.sql` 文件
2. 复制整个 SQL 脚本内容
3. 粘贴到 Supabase SQL Editor 中
4. 点击 **Run** 或按 `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac) 执行

### 步骤 4: 验证执行结果

执行成功后，您应该看到：

- ✅ 三个表已创建：`events`, `providers`, `giveaways`
- ✅ 两个枚举类型已创建：`event_status`, `giveaway_status`
- ✅ 索引已创建
- ✅ Row Level Security (RLS) 已启用
- ✅ 安全策略已创建

### 验证查询

在 SQL Editor 中运行以下查询来验证表是否创建成功：

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('events', 'providers', 'giveaways');

-- 检查枚举类型
SELECT typname 
FROM pg_type 
WHERE typname IN ('event_status', 'giveaway_status');
```

### 常见问题

**Q: 执行时出现 "extension uuid-ossp does not exist" 错误**
- A: Supabase 默认已启用此扩展，可以忽略或删除该行

**Q: 执行时出现权限错误**
- A: 确保您使用的是项目所有者账户，或具有管理员权限

**Q: 如何回滚迁移？**
- A: 在 SQL Editor 中执行以下命令：
  ```sql
  DROP TABLE IF EXISTS giveaways CASCADE;
  DROP TABLE IF EXISTS providers CASCADE;
  DROP TABLE IF EXISTS events CASCADE;
  DROP TYPE IF EXISTS giveaway_status CASCADE;
  DROP TYPE IF EXISTS event_status CASCADE;
  ```

### 下一步

完成 SQL 迁移后，继续执行：
- **T012**: 创建 Supabase Storage bucket
- **T013**: 插入测试活动数据
