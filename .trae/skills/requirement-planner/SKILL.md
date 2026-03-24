---
name: requirement-planner
description: 需求分析与规划技能。对复杂任务进行需求分析、计划制定、任务拆分和执行跟踪。当用户要求规划、任务拆分、需求分析或询问下一步时调用此技能。
compatibility: 为 Claude Code/TRAE 或类似 AI 编程助手设计
metadata:
  author: trae-community
  version: "1.0"
---

# Requirement Planner

## Description

Comprehensive requirement analysis, planning, and execution tracking skill for complex software engineering tasks. This skill helps break down requirements into actionable plans with clear milestones, task tracking, and quality checkpoints.

## Usage Scenario

触发此技能的场景：
- 用户要求"分析需求"、"制定计划"、"任务拆分"
- 用户提出复杂任务需要分解为可执行的步骤
- 用户询问"如何开始"、"下一步是什么"
- 需要对现有计划进行进度跟踪和调整
- 用户要求"继续执行上一个计划"

## Instructions

### Phase 1: 需求理解 (Requirement Understanding)

**Goal**: 确保对需求的完整理解，识别所有关键要素

**Step 1.1: 澄清需求**
- 与用户确认需求背景和目标
- 识别关键利益相关者 (Stakeholders)
- 明确验收标准 (Acceptance Criteria) 和成功指标 (Success Metrics)

**Step 1.2: 需求分类**
- 功能性需求：用户期望实现的核心功能
- 非功能性需求：性能 (Performance)、安全 (Security)、可扩展性 (Scalability)、可用性 (Usability)
- 技术约束：现有技术栈、团队能力、时间限制

**Step 1.3: 风险识别**
- 识别潜在风险 (Risks) 和假设条件 (Assumptions)
- 确定依赖关系 (Dependencies) 和外部依赖 (External Dependencies)

**Output**: 生成需求理解文档

### Phase 2: 计划制定 (Planning)

**Goal**: 将需求转化为可执行的里程碑计划

**Step 2.1: 目标定义**
- 设定清晰、可衡量的目标
- 确定关键里程碑 (Milestones)
- 设定阶段性检查点 (Checkpoints)

**Step 2.2: 任务拆分 (Task Decomposition)**
- 使用 WBS (Work Breakdown Structure) 方法拆分任务
- 每个任务必须是原子性的、可独立执行的
- 估算每个任务的 effort（小时）
- 确定任务间的依赖关系和执行顺序

**Step 2.3: 优先级排序**
- MoSCoW 优先级：Must > Should > Could > Won't
- 确定关键路径 (Critical Path)
- 识别可以并行的任务

**Step 2.4: 初始化 Todo 列表**
- 使用 TodoWrite 工具创建任务列表
- 为每个里程碑创建子任务
- 设置任务状态为 pending

**Output**: 任务拆解清单 + Todo 列表

### Phase 3: 执行与跟踪 (Execution & Tracking)

**Goal**: 按计划执行任务并跟踪进度

**Step 3.1: 进度跟踪**
- 更新任务状态（pending → in_progress → completed）
- 识别阻塞任务 (Blocked Tasks) 并上报
- 记录计划变更及原因

**Step 3.2: 检查点验证**
- 在每个里程碑结束时进行验证
- 确认该阶段交付物是否符合预期
- 收集用户反馈并调整下一步计划

**Step 3.3: 闭环交付**
- 验证所有 Must 级别任务完成
- 总结交付成果
- 输出最终报告

**Output**: 执行状态报告 + 交付文档

## Output Templates

### Requirement Document

```markdown
## Requirements Overview
- Project Name:
- Objective:
- Success Metrics:

## Stakeholders
- Primary:
- Secondary:

## Functional Requirements
| ID | Requirement | Priority | Acceptance Criteria |
|-----|-------------|----------|-------------------|
| FR-001 |             | Must     |                   |

## Non-Functional Requirements
| ID | Requirement | Target | Acceptance Criteria |
|-----|-------------|--------|-------------------|
| NFR-001 |         |         |                    |

## Risks & Assumptions
| Risk/Assumption | Impact | Mitigation |
|-----------------|--------|------------|
|                 |        |            |

## Dependencies
| Dependency | Owner | Due Date |
|------------|-------|----------|
|            |       |          |
```

### Task Breakdown

```markdown
## Milestone 1: [Name]
**Goal**: [Description]
**Deadline**: [Date]

- [ ] Task 1.1: [Description] (Est: Xh, Priority: Must)
- [ ] Task 1.2: [Description] (Est: Xh, Priority: Should)

## Milestone 2: [Name]
**Goal**: [Description]
**Deadline**: [Date]

- [ ] Task 2.1: [Description] (Est: Xh, Priority: Must)
- [ ] Task 2.2: [Description] (Est: Xh, Priority: Could)
```

### Progress Report

```markdown
## Progress Report - [Date]

### Overall Progress
- Completed: X/Y tasks (X%)
- Blocked: X tasks

### Milestone Status
| Milestone | Status | Completed Tasks |
|-----------|--------|----------------|
| M1        | ✅     | 2/3            |
| M2        | 🔄     | 1/4            |

### Blocked Tasks
| Task | Blocker | Escalation |
|------|---------|------------|
|      |         |            |

### Next Steps
1. [Next task to execute]
2. [Following task]
```

## Examples

### Example 1: 用户输入"我需要一个用户登录系统"

```markdown
1. 需求理解阶段:
   - 分析登录系统需求（用户注册、登录、登出、密码找回等）
   - 识别非功能需求（安全性、Session 管理、错误处理）
   - 识别利益相关者：前端开发者、后端开发者、终端用户

2. 计划制定阶段:
   - 拆解里程碑：数据库设计 -> API 开发 -> 前端实现 -> 测试 -> 部署
   - 使用 TodoWrite 创建任务列表
   - 设定优先级：Must（登录/注册）、Should（密码找回）、Could（第三方登录）

3. 执行跟踪阶段:
   - 按里程碑执行并更新状态
   - 在关键检查点验证
   - 最终交付登录系统
```

### Example 2: 用户输入"继续执行上一个计划"

```markdown
1. 查看当前 Todo 列表状态
2. 找到下一个 pending 状态的任务
3. 报告整体进度（已完成 X/Y）
4. 继续执行下一个任务
5. 更新任务状态为 completed
```

## Best Practices

1. **Be Specific**: 使用具体、可衡量的术语描述任务和目标
2. **Prioritize Ruthlessly**: 优先关注 MVP，区分 Must/Should/Could
3. **Identify Dependencies Early**: 尽早识别依赖关系和关键路径
4. **Build in Review Points**: 在每个里程碑设置质量检查点
5. **Document Decisions**: 记录决策和理由，便于追溯
6. **Stay Flexible**: 当现实与假设不符时，及时调整计划
7. **Atomic Tasks**: 每个任务应该足够小，可在 1-4 小时内完成
8. **Progress Visibility**: 保持任务状态可见，及时更新

## References

详细的需求分析方法和模板可参考：
- IEEE Std 830-1998 软件需求规格说明书规范
- MoSCoW 优先级排序方法
- WBS 工作分解结构方法