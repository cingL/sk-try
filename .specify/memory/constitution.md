<!--
Sync Impact Report:
- Version change: N/A → 1.0.0 (Initial Constitution)
- Added Principles:
  1. I. 直观展示 (Intuitive Display)
  2. II. 简洁交互 (Concise Interaction)
  3. III. 便捷跳转 (Easy Navigation)
- Added Sections:
  - 体验标准 (Experience Standards)
  - 开发流程 (Development Workflow)
  - Governance
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check placeholder compatible)
  - ✅ .specify/templates/spec-template.md (User scenarios structure aligned)
  - ✅ .specify/templates/tasks-template.md (Task categorization compatible)
- Follow-up TODOs: None
-->

# Muryo Constitution

## Core Principles

### I. 直观展示

信息展示 MUST 遵循直观原则：

- 用户核心数据 MUST 在首屏可见，无需滚动或点击即可获取关键信息
- 信息层级 MUST 清晰分明，主次关系一目了然
- 视觉元素 MUST 服务于信息传达，避免装饰性干扰
- 数据可视化 SHOULD 优先使用图形化表达，减少纯文字堆砌

**理由**：直观的信息展示降低用户认知负担，提升使用效率。

### II. 简洁交互

交互设计 MUST 遵循简洁原则：

- 主要操作路径 MUST 不超过 3 步完成
- 交互控件 MUST 遵循平台原生规范，避免自定义学习成本
- 无关操作选项 MUST NOT 出现在主交互流程中
- 反馈机制 MUST 即时且明确，用户操作后 200ms 内给予响应

**理由**：简洁的交互减少用户误操作，提升任务完成率。

### III. 便捷跳转

跨应用跳转 MUST 遵循便捷原则：

- Deep Link MUST 支持直接跳转至目标 App 的具体页面
- 跳转失败时 MUST 提供降级方案（如应用商店引导）
- 返回路径 MUST 清晰，支持用户快速回到本应用
- 跳转入口 SHOULD 可自定义配置，适应不同用户习惯

**理由**：便捷的跳转体验使本应用成为用户的效率枢纽。

## 体验标准

本节定义用户体验的量化标准：

- 首屏加载时间 MUST < 1 秒
- 交互响应延迟 MUST < 200ms
- 跳转启动时间 MUST < 500ms
- 界面帧率 SHOULD 保持 60fps，MUST NOT 低于 30fps
- 内存占用 SHOULD < 100MB

## 开发流程

开发流程需确保宪法原则得到贯彻：

- 新功能设计 MUST 通过宪法原则审查（三原则自检）
- UI/UX 变更 MUST 提供交互原型并验证直观性
- 跳转功能 MUST 包含端到端测试覆盖
- 代码审查 MUST 检查性能指标合规性

## Governance

本宪法是项目开发的最高准则：

- 所有设计决策和代码实现 MUST 符合宪法原则
- 违反宪法的功能 MUST NOT 合并到主分支
- 宪法修订需遵循语义版本规则：
  - MAJOR：原则移除或根本性重定义
  - MINOR：新增原则或重大扩展
  - PATCH：措辞优化、澄清说明
- 每季度进行一次宪法合规审查

**Version**: 1.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13
