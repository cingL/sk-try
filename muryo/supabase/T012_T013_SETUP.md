# T012 & T013 完成指南

## T012: 创建 Supabase Storage Bucket

### 步骤 1: 打开 Storage 管理界面

1. 在 Supabase Dashboard 中，点击左侧导航栏的 **Storage**
2. 点击 **New bucket** 按钮

### 步骤 2: 创建 Bucket

填写以下信息：

- **Name**: `giveaway-images`
- **Public bucket**: ✅ **勾选**（允许公开读取图片）
- **File size limit**: `5242880` (5MB，可选)
- **Allowed MIME types**: `image/jpeg,image/png,image/webp` (可选)

点击 **Create bucket**

### 步骤 3: 配置 Storage Policies（可选，但推荐）

如果 bucket 创建后需要更细粒度的控制，可以在 SQL Editor 中运行：

```sql
-- 允许所有人读取图片
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'giveaway-images');

-- 允许认证用户上传图片
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'giveaway-images' 
  AND auth.role() = 'authenticated'
);

-- 允许用户删除自己上传的图片
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'giveaway-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 验证

在 Storage 界面中，您应该能看到 `giveaway-images` bucket，状态为 **Public**。

---

## T013: 插入测试活动数据

### 步骤 1: 执行测试数据脚本

1. 打开 Supabase SQL Editor
2. 打开 `supabase/seed_test_data.sql` 文件
3. 复制内容并粘贴到 SQL Editor
4. 点击 **Run** 执行

### 步骤 2: 获取 Event ID

执行后，SQL Editor 会显示返回的 event ID（UUID 格式），类似：
```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**重要**: 复制这个 ID！

### 步骤 3: 更新环境变量

1. 打开 `muryo/.env.local` 文件
2. 将 `VITE_EVENT_ID` 更新为刚才复制的 ID：

```env
VITE_EVENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 步骤 4: 验证数据

在 SQL Editor 中运行：

```sql
-- 查看创建的活动
SELECT id, name, status, start_time, end_time 
FROM events 
ORDER BY created_at DESC 
LIMIT 1;
```

应该能看到刚才创建的测试活动。

---

## 完整测试数据（可选）

如果需要更完整的测试数据（包括 providers 和 giveaways），可以使用以下脚本：

**注意**: 这个脚本需要先有认证用户。如果您还没有测试用户，可以先跳过，或者通过 Supabase Dashboard 的 Authentication 创建测试用户。

```sql
-- 完整测试数据脚本
-- 前提：需要先有一个认证用户（通过 Supabase Auth 创建）

-- 1. 获取或创建测试活动（如果还没有）
DO $$
DECLARE
  test_event_id UUID;
BEGIN
  -- 检查是否已有测试活动
  SELECT id INTO test_event_id 
  FROM events 
  WHERE name = '示例同人展 2026' 
  LIMIT 1;
  
  -- 如果没有，创建一个
  IF test_event_id IS NULL THEN
    INSERT INTO events (name, start_time, end_time, location, status)
    VALUES (
      '示例同人展 2026',
      '2026-02-01 09:00:00+08',
      '2026-02-01 17:00:00+08',
      '东京国际展示场',
      'upcoming'
    )
    RETURNING id INTO test_event_id;
  END IF;
  
  RAISE NOTICE 'Event ID: %', test_event_id;
END $$;

-- 2. 创建测试 Provider（需要替换 YOUR_USER_ID）
-- 注意：YOUR_USER_ID 需要替换为实际的 auth.users.id
-- 可以通过以下查询获取：
-- SELECT id FROM auth.users LIMIT 1;

-- INSERT INTO providers (user_id, name, booth_area, booth_number, external_links)
-- VALUES (
--   'YOUR_USER_ID',  -- 替换为实际用户 ID
--   '测试社团',
--   'A',
--   '01',
--   '[{"platform": "weibo", "username": "test_user", "url": "https://weibo.com/test_user"}]'::jsonb
-- );

-- 3. 创建测试 Giveaway（需要先有 provider）
-- INSERT INTO giveaways (
--   event_id,
--   provider_id,
--   title,
--   description,
--   images,
--   category,
--   status
-- )
-- SELECT 
--   (SELECT id FROM events WHERE name = '示例同人展 2026' LIMIT 1),
--   (SELECT id FROM providers LIMIT 1),
--   '测试无料物品',
--   '这是一个测试用的无料物品描述',
--   ARRAY['https://via.placeholder.com/300'],
--   'goods',
--   'available';
```

---

## 快速验证清单

完成 T012 和 T013 后，验证以下项目：

- [ ] Storage bucket `giveaway-images` 已创建且为 Public
- [ ] 测试活动已插入到 `events` 表
- [ ] `.env.local` 中的 `VITE_EVENT_ID` 已更新
- [ ] 可以通过 SQL 查询看到活动数据

---

## 下一步

完成 T012 和 T013 后，您可以：

1. **测试应用**:
   ```bash
   cd muryo
   npm run dev
   ```

2. **验证数据加载**: 打开浏览器访问 `http://localhost:3000`，应该能看到应用（虽然可能显示"暂无无料信息"，因为还没有 giveaways 数据）

3. **添加更多测试数据**: 通过 Supabase Dashboard 的 Table Editor 手动添加一些测试数据，或使用上面的完整测试数据脚本

---

## 故障排除

### T012 问题

**Q: 无法创建 Public bucket**
- A: 确保您有项目管理员权限

**Q: 上传图片时权限错误**
- A: 检查 Storage Policies 是否正确配置

### T013 问题

**Q: 找不到返回的 Event ID**
- A: 在 SQL Editor 中运行：
  ```sql
  SELECT id, name FROM events ORDER BY created_at DESC LIMIT 1;
  ```

**Q: 应用仍然显示"暂无无料信息"**
- A: 这是正常的，因为还没有 giveaways 数据。您可以：
  - 通过 Supabase Dashboard 的 Table Editor 手动添加
  - 或者等待后续功能实现后通过应用添加
