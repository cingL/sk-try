# Implementation Plan: 活动无料信息展示

**Branch**: `001-giveaway-listing` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-giveaway-listing/spec.md`

## Summary

构建一个移动端优先的响应式网页应用，用于展示和搜索活动中的无料/互换信息。采用 Material Design 设计语言，实现简洁直观的用户界面。核心功能包括：列表浏览、搜索筛选、详情查看、外部链接跳转和信息发布。

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: React 18, Material UI (MUI) 5.x  
**Storage**: Supabase (PostgreSQL + Storage + Auth)  
**Testing**: Vitest + React Testing Library  
**Target Platform**: Web (Mobile-first PWA), 支持 iOS Safari / Android Chrome  
**Project Type**: Web application (frontend + BaaS)  
**Performance Goals**: 首屏 <1s, 交互响应 <200ms, 60fps 滚动  
**Constraints**: 首屏 LCP <1s, 内存 <100MB, 支持弱网环境  
**Scale/Scope**: 单活动场景，预计 1000-5000 条无料信息，1000+ 并发用户

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. 直观展示 ✅

| 要求 | 设计方案 | 状态 |
|------|----------|------|
| 核心数据首屏可见 | 列表页直接展示卡片，无需登录或引导页 | ✅ |
| 信息层级清晰 | Material Design 卡片布局，视觉层次分明 | ✅ |
| 视觉服务信息 | 使用 MUI 组件库，避免过度装饰 | ✅ |
| 图形化表达 | 缩略图优先，状态用图标+颜色表示 | ✅ |

### II. 简洁交互 ✅

| 要求 | 设计方案 | 状态 |
|------|----------|------|
| 操作 ≤3 步 | 浏览(1步)、搜索(2步)、发布(3步) | ✅ |
| 平台原生规范 | MUI 遵循 Material Design 规范 | ✅ |
| 无无关选项 | 主流程仅保留核心操作入口 | ✅ |
| 200ms 响应 | 客户端搜索 + 乐观更新 | ✅ |

### III. 便捷跳转 ✅

| 要求 | 设计方案 | 状态 |
|------|----------|------|
| Deep Link 跳转 | 使用平台 URL Scheme (twitter://, pixiv://) | ✅ |
| 降级方案 | 检测失败后 fallback 到 HTTPS 链接 | ✅ |
| 清晰返回路径 | SPA 路由保持状态，浏览器返回可用 | ✅ |
| 可配置入口 | 外部链接存储在数据模型中，动态渲染 | ✅ |

### 体验标准 ✅

| 指标 | 目标 | 技术方案 |
|------|------|----------|
| 首屏 <1s | <1s | 静态托管 + CDN + 懒加载 |
| 响应 <200ms | <200ms | 客户端过滤 + React 虚拟化 |
| 跳转 <500ms | <500ms | 预渲染链接 + 原生跳转 |
| 60fps | 60fps | MUI 硬件加速 + 虚拟列表 |
| 内存 <100MB | <100MB | 图片懒加载 + 分页 |

## Project Structure

### Documentation (this feature)

```text
specs/001-giveaway-listing/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Developer guide
├── contracts/           # Phase 1: API contracts
│   └── api.yaml         # OpenAPI specification
└── checklists/          # Quality checklists
    └── requirements.md
```

### Source Code (repository root)

```text
src/
├── components/          # React components
│   ├── common/          # Shared components (Button, Card, etc.)
│   ├── giveaway/        # Giveaway-specific components
│   │   ├── GiveawayCard.tsx
│   │   ├── GiveawayList.tsx
│   │   ├── GiveawayDetail.tsx
│   │   └── GiveawayForm.tsx
│   └── layout/          # Layout components (Header, Navigation)
├── pages/               # Page components / Routes
│   ├── HomePage.tsx     # List view
│   ├── DetailPage.tsx   # Detail view
│   └── PublishPage.tsx  # Publish form
├── hooks/               # Custom React hooks
│   ├── useGiveaways.ts
│   ├── useSearch.ts
│   └── useExternalLink.ts
├── services/            # API and external services
│   ├── supabase.ts      # Supabase client
│   └── storage.ts       # Image upload service
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── deepLink.ts      # External app linking
├── theme/               # MUI theme customization
│   └── index.ts
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.html           # HTML template

public/
├── icons/               # PWA icons
└── manifest.json        # PWA manifest

tests/
├── components/          # Component tests
├── hooks/               # Hook tests
└── e2e/                 # End-to-end tests
```

**Structure Decision**: 采用单项目 Web 应用结构，前端使用 React + MUI，后端使用 Supabase BaaS 服务。目录结构按功能模块划分，便于独立开发和测试各用户故事。

## Complexity Tracking

> 无复杂性违规需要记录。设计符合宪法所有原则。
