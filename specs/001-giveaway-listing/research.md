# Research: 活动无料信息展示

**Branch**: `001-giveaway-listing`  
**Date**: 2026-01-13

## Overview

本文档记录技术选型过程中的研究结论，解决 Technical Context 中的所有决策点。

---

## 1. Frontend Framework

### Decision: React 18 + TypeScript

### Rationale

- **生态成熟**: React 是最广泛使用的前端框架，社区资源丰富
- **TypeScript 支持**: 原生支持 TypeScript，类型安全提升代码质量
- **Concurrent Features**: React 18 的并发特性优化列表渲染性能
- **Material UI 兼容**: MUI 是 React 生态中最成熟的 Material Design 实现

### Alternatives Considered

| 方案 | 优点 | 排除原因 |
|------|------|----------|
| Vue 3 + Vuetify | 学习曲线平缓 | Material Design 实现不如 MUI 成熟 |
| Svelte + Skeleton | 包体积小 | Material Design 生态不完善 |
| Next.js | SSR 支持 | 单活动场景不需要 SEO，增加复杂度 |

---

## 2. UI Component Library

### Decision: Material UI (MUI) 5.x

### Rationale

- **用户要求**: 用户明确指定 Material Design 设计语言
- **组件完整**: 提供完整的 Material Design 组件集
- **主题定制**: 支持深度主题定制，可调整品牌色彩
- **响应式支持**: 内置响应式断点和栅格系统
- **无障碍**: 组件默认符合 WCAG 无障碍标准

### Alternatives Considered

| 方案 | 优点 | 排除原因 |
|------|------|----------|
| Chakra UI | API 简洁 | 非 Material Design 风格 |
| Ant Design | 企业级组件 | 设计语言不符合要求 |
| 手写 CSS | 完全控制 | 开发效率低，难以保证一致性 |

---

## 3. Backend / Storage

### Decision: Supabase (PostgreSQL + Storage + Auth)

### Rationale

- **简化架构**: BaaS 模式无需维护服务器，符合简洁原则
- **功能完整**: 同时提供数据库、文件存储、认证服务
- **实时能力**: 支持 Realtime 订阅，新发布信息可即时展示
- **免费额度**: 免费额度足够单活动场景使用
- **PostgreSQL**: 成熟的关系型数据库，支持全文搜索

### Alternatives Considered

| 方案 | 优点 | 排除原因 |
|------|------|----------|
| Firebase | 生态成熟 | NoSQL 不适合关系数据，中国访问不稳定 |
| 自建 Node.js | 完全控制 | 增加运维复杂度，不符合简洁原则 |
| 纯静态 JSON | 最简单 | 不支持用户发布功能 |

---

## 4. Image Storage

### Decision: Supabase Storage

### Rationale

- **统一平台**: 与数据库同一平台，简化认证和管理
- **CDN 支持**: 内置 CDN 加速图片访问
- **转换功能**: 支持图片尺寸转换，自动生成缩略图
- **访问控制**: 可配置公开/私有访问策略

### Image Strategy

```
原图上传 → Supabase Storage
         ↓
缩略图: 300x300 (列表卡片)
大图: 1200xAuto (详情页)
```

---

## 5. Authentication

### Decision: Supabase Auth (Magic Link)

### Rationale

- **用户友好**: Magic Link 无需记忆密码，符合简洁交互原则
- **低门槛**: 邮箱即可登录，适合单次活动场景
- **安全**: 一次性链接，无密码泄露风险

### Auth Flow

```
发布功能 → 检测未登录 → 输入邮箱 → 发送 Magic Link → 点击链接 → 已登录
```

### Alternatives Considered

| 方案 | 优点 | 排除原因 |
|------|------|----------|
| 社交登录 (Twitter/X) | 用户常用 | 配置复杂，部分用户无账号 |
| 邮箱密码 | 传统方式 | 注册流程繁琐，不符合简洁原则 |
| 匿名发布 | 最简单 | 无法追溯发布者，易被滥用 |

---

## 6. Search Implementation

### Decision: Client-side filtering + PostgreSQL Full-text Search

### Rationale

- **响应速度**: 客户端过滤可实现 <200ms 响应目标
- **离线可用**: 已加载数据在弱网下仍可搜索
- **大数据集**: 超过 1000 条时使用服务端全文搜索

### Implementation Strategy

```
数据量 ≤ 1000: 客户端过滤 (Array.filter)
数据量 > 1000: 服务端 PostgreSQL ts_vector 全文搜索
```

---

## 7. External Link Handling

### Decision: URL Scheme 优先 + HTTPS 降级

### Rationale

- **原生体验**: URL Scheme 可直接唤起目标 App
- **可靠性**: HTTPS 链接作为降级保证 100% 可访问
- **无需检测**: 使用 iframe 探测技术，避免依赖 App 列表

### Implementation

```typescript
const openExternalLink = async (url: string, appScheme?: string) => {
  if (appScheme) {
    // 尝试 App Scheme
    const opened = await tryOpenScheme(appScheme);
    if (opened) return;
  }
  // 降级到 HTTPS
  window.open(url, '_blank');
};
```

### Supported Platforms

| 平台 | URL Scheme | HTTPS Fallback |
|------|------------|----------------|
| Twitter/X | `twitter://user?screen_name=xxx` | `https://twitter.com/xxx` |
| Pixiv | `pixiv://users/xxx` | `https://pixiv.net/users/xxx` |
| 其他 | N/A | 直接使用 HTTPS |

---

## 8. Performance Optimization

### Decision: 多层优化策略

### Strategies

| 优化点 | 技术方案 | 目标指标 |
|--------|----------|----------|
| 首屏加载 | Vite 代码分割 + CDN 静态托管 | LCP <1s |
| 列表滚动 | react-window 虚拟列表 | 60fps |
| 图片加载 | 懒加载 + 渐进式加载 | 减少初始带宽 |
| 搜索响应 | 客户端过滤 + debounce | <200ms |
| 缓存 | Service Worker + IndexedDB | 离线可用 |

---

## 9. Deployment

### Decision: Vercel (静态托管)

### Rationale

- **免费额度**: 足够单活动场景使用
- **CDN 全球**: 自动全球 CDN 分发
- **CI/CD**: Git push 自动部署
- **预览环境**: PR 自动生成预览链接

---

## Summary

| 领域 | 选型 | 关键理由 |
|------|------|----------|
| 前端框架 | React 18 + TypeScript | 生态成熟，MUI 兼容 |
| UI 组件 | Material UI 5.x | 用户指定 Material Design |
| 后端服务 | Supabase | 简化架构，功能完整 |
| 图片存储 | Supabase Storage | 统一平台，CDN 支持 |
| 认证 | Magic Link | 简洁无密码 |
| 搜索 | 客户端 + 服务端混合 | 响应速度与扩展性平衡 |
| 外部链接 | URL Scheme + HTTPS | 原生体验 + 可靠降级 |
| 部署 | Vercel | 免费 CDN + 自动部署 |

所有技术选型均符合宪法三原则：直观展示、简洁交互、便捷跳转。
