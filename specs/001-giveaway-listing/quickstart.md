# Quickstart: 活动无料信息展示

**Branch**: `001-giveaway-listing`  
**Date**: 2026-01-13

本指南帮助开发者快速搭建本地开发环境并运行项目。

---

## Prerequisites

- **Node.js**: 18.x 或更高版本
- **pnpm**: 8.x 或更高版本 (推荐) 或 npm/yarn
- **Supabase CLI**: 用于本地开发 (可选)
- **Git**: 版本控制

### 验证环境

```bash
node --version   # v18.x+
pnpm --version   # 8.x+
```

---

## 1. 项目初始化

### 1.1 创建 React + Vite 项目

```bash
pnpm create vite muryo --template react-ts
cd muryo
```

### 1.2 安装依赖

```bash
# 核心依赖
pnpm add react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled

# Supabase 客户端
pnpm add @supabase/supabase-js

# 虚拟列表 (性能优化)
pnpm add react-window

# 开发依赖
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 1.3 项目结构

```bash
mkdir -p src/{components/{common,giveaway,layout},pages,hooks,services,types,utils,theme}
mkdir -p tests/{components,hooks,e2e}
```

---

## 2. 环境配置

### 2.1 创建环境变量文件

```bash
# .env.local (本地开发，不提交到 Git)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_EVENT_ID=your-event-uuid
```

### 2.2 TypeScript 配置

更新 `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2.3 Vite 配置

更新 `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
});
```

---

## 3. Supabase 设置

### 3.1 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并创建新项目
2. 记录 Project URL 和 anon key
3. 更新 `.env.local`

### 3.2 运行数据库迁移

在 Supabase Dashboard SQL Editor 中执行 `data-model.md` 中的 SQL 脚本。

### 3.3 配置 Storage Bucket

```sql
-- 在 SQL Editor 中执行
INSERT INTO storage.buckets (id, name, public)
VALUES ('giveaway-images', 'giveaway-images', true);
```

### 3.4 创建测试活动

```sql
-- 插入测试活动
INSERT INTO events (name, start_time, end_time, location, status)
VALUES (
  '示例同人展',
  '2026-01-20 09:00:00+08',
  '2026-01-20 17:00:00+08',
  '东京国际展示场',
  'upcoming'
);

-- 获取活动 ID 用于 .env.local
SELECT id FROM events WHERE name = '示例同人展';
```

---

## 4. 核心代码模板

### 4.1 Supabase 客户端

`src/services/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4.2 类型定义

`src/types/index.ts`:

```typescript
export type EventStatus = 'upcoming' | 'ongoing' | 'ended';
export type GiveawayStatus = 'available' | 'limited' | 'ended';
export type GiveawayCategory = 'goods' | 'print' | 'digital' | 'other';
export type LinkPlatform = 'twitter' | 'pixiv' | 'website' | 'other';

export interface ExternalLink {
  platform: LinkPlatform;
  username: string;
  url: string;
  scheme?: string;
}

export interface Event {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  location: string;
  status: EventStatus;
  created_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  name: string;
  booth_area: string;
  booth_number: string;
  external_links: ExternalLink[];
  created_at: string;
}

export interface Giveaway {
  id: string;
  event_id: string;
  provider_id: string;
  title: string;
  description: string;
  images: string[];
  pickup_condition?: string;
  category?: GiveawayCategory;
  status: GiveawayStatus;
  created_at: string;
  updated_at: string;
}

export interface GiveawayWithProvider extends Giveaway {
  provider: Provider;
}
```

### 4.3 数据获取 Hook

`src/hooks/useGiveaways.ts`:

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { GiveawayWithProvider } from '@/types';

const EVENT_ID = import.meta.env.VITE_EVENT_ID;

export function useGiveaways() {
  const [giveaways, setGiveaways] = useState<GiveawayWithProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGiveaways() {
      try {
        const { data, error } = await supabase
          .from('giveaways')
          .select('*, provider:providers(*)')
          .eq('event_id', EVENT_ID)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGiveaways(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchGiveaways();
  }, []);

  return { giveaways, loading, error };
}
```

### 4.4 MUI 主题

`src/theme/index.ts`:

```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6200EE',
    },
    secondary: {
      main: '#03DAC6',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
```

### 4.5 应用入口

`src/App.tsx`:

```typescript
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from '@/theme';
import HomePage from '@/pages/HomePage';
import DetailPage from '@/pages/DetailPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/giveaway/:id" element={<DetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
```

---

## 5. 开发命令

```bash
# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 类型检查
pnpm tsc --noEmit

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

---

## 6. 验证清单

完成上述步骤后，验证以下功能：

- [ ] 开发服务器在 `http://localhost:3000` 正常启动
- [ ] 控制台无 TypeScript 错误
- [ ] Supabase 连接正常 (无 CORS 或认证错误)
- [ ] 能够从数据库获取活动信息
- [ ] MUI 组件正确渲染 (Material Design 样式)

---

## 7. 常见问题

### Q: Supabase 连接失败

**A**: 检查 `.env.local` 中的 URL 和 Key 是否正确，确保 Supabase 项目已启用。

### Q: CORS 错误

**A**: Supabase 默认允许 localhost，确保使用正确的 anon key。

### Q: 类型错误

**A**: 确保 `src/types/index.ts` 与数据库 schema 匹配。

---

## Next Steps

1. 实现 `GiveawayCard` 组件
2. 实现 `GiveawayList` 列表页
3. 实现搜索和筛选功能
4. 实现详情页和外部链接跳转
5. 实现发布功能

详见 `tasks.md` (由 `/speckit.tasks` 命令生成)。
