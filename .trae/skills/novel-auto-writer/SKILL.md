---
name: "novel-auto-writer"
description: "小说自动化写作技能 v5.0，支持20维度质量评估（增强梗含量/潮流热度/新鲜感）、Meme数据库、月度更新。当用户要求写小说、生成章节、网文写作或需要小说创作支持时调用。"
---

# Novel Auto Writer v5.0

小说自动化写作技能，支持交互式执行、多维度质量评估（20维度 v5.0）、Meme数据库智能引用、自动反馈修改。

## Description

这是一个功能完善的AI辅助小说写作系统，支持：

- 交互式执行（一章节一执行）
- 多维度质量评估（20维度 v5.0）
- **Meme数据库智能引用**：内置梗资源库，支持热度等级追踪、过期检测、替代建议
- **月度更新机制**：每月扫描热门梗，自动调整热度等级
- 自动反馈修改机制
- 多平台发布适配
- 进度追踪与状态管理
- AI味道检测（降低AI痕迹）
- 剧情紧凑度、信息量密度、剧情反转设计
- 强调创新性、新鲜感、潮流感，融入新梗热梗

## Meme Database System

### Database Structure

```
resources/
├── meme/
│   ├── _schema.md           # Meme数据库Schema
│   ├── anime_jojo.md       # JOJO系列梗
│   ├── anime_db.md          # 龙珠系列梗
│   ├── anime_attack.md      # 进击的巨人梗
│   ├── anime_diga.md        # 奥特曼系列梗
│   ├── anime_other.md       # 其他动漫梗
│   ├── game_lol.md          # LOL梗
│   ├── game_genshin.md      # 原神梗
│   ├── game_other.md        # 其他游戏梗
│   ├── internet_trending.md # 互联网梗
│   ├── pun_memes.md         # 谐音梗
│   ├── tv_memes.md          # 影视梗
│   ├── yearly_memes.md      # 年度热梗
│   ├── story_memes.md       # 故事梗
│   ├── reader_memes.md      # 读者梗
│   └── meme_usage.md        # 梗使用指南
├── title/
│   ├── _templates.md        # Title模板
│   ├── qidian_titles.md     # 起点Title库
│   ├── jinjiang_titles.md   # 晋江Title库
│   ├── fanqie_titles.md     # 番茄Title库
│   └── feilu_titles.md      # 飞卢Title库
└── trending/
    └── 2025_2026_trends.md # 2025-2026趋势
```

### Meme Schema

每个Meme包含以下字段：

| Field | Type | Required | Description |
|:---|:---|:---:|:---|
| id | string | Yes | 唯一ID，格式 meme_XXX |
| name | string | Yes | Meme名称 |
| category | enum | Yes | 主分类 |
| subcategory | string | No | 子分类 |
| created | date | Yes | 创建日期 |
| trending_level | enum | Yes | A/B/C/D热度等级 |
| expire_date | date | No | 建议过期日期 |
| last_used | date | No | 最后使用日期 |
| use_count | int | No | 使用次数 |
| tags | array | No | 搜索标签 |
| alternatives | array | No | 替代梗 |
| reverse_example | string | No | 反向使用示例 |
| notes | string | No | 使用备注 |

### Trending Level System

| Level | Name | Lifespan | Description |
|:---:|:---|:---:|:---|
| A | Top Meme | 3-6 months | 全网爆火，必须使用 |
| B | Hot Meme | 6-12 months | 圈内流行 |
| C | Common Meme | 1-2 years | 经典常用 |
| D | Classic Meme | Unlimited | 永不过时 |

### Progressive Loading

| Level | Content | Load Timing |
|:---|:---|:---|
| L1 | Classic(D) + Common(C) + Top 10 A-level | On startup |
| L2 | By category (on-demand) | During writing |
| L3 | Archived expired memes | On explicit reference |

### Monthly Update Process

```
[Monthly Scan]
     ↓
[Heat Detection] → Search trend API
     ↓
[Level Adjustment] → Auto/Manual confirmation
     ↓
[Expiry Marking] → Set expire_date or demote
     ↓
[Alternative Suggestion] → Recommend similar memes
     ↓
[Archive] → Move to archive / mark as expired
```

## Usage Scenario

当用户需要以下场景时调用：

- 写小说（"写小说"、"创作小说"）
- 生成章节（"生成章节"、"写第X章"）
- 网文写作（"网文写作"、"小说投稿"）
- 优化小说（"优化小说"、"修改章节"）
- 自动化写作（"自动化写作"、"连续写作"）

## Instructions

### Phase 1: 初始化与准备

**目标**: 确认小说大纲、章节配置、输出目录

**执行步骤**:

1. **检查项目目录**:
   ```
   检查是否存在 projects/{小说名}/ 目录
   若无则创建：
   - projects/{小说名}/
     ├── outline/                  # 大纲文件夹
     │   ├── outline.md           # 大纲文件
     │   └── chapters.md          # 章节清单（所有章节标题）
     ├── config/                  # 配置文件夹
     │   └── .novel_state.json   # 状态文件
     ├── chapters/                # 章节文件夹（一章一文件）
     │   ├── 第01章_觉醒·命运的转折.md
     │   ├── 第02章_重生·这一世我不会再输.md
     │   └── ...
     └── .current_prompt.txt     # 当前创作提示
   ```

2. **读取章节配置**:
   ```python
   # 读取 outline/chapters.md 获取章节列表（Markdown格式）
   # 解析 ## 第1章 标题 格式
   # 总章节数 = 解析出的章节数
   ```

3. **确认写作参数**:
   - 目标字数：每章根据平台自适应（从config读取）
   - 评估标准：总分 ≥ 7.0
   - 章节数：从 outline/chapters.md 动态读取

### Phase 2: 章节生成

**目标**: 生成符合质量标准的章节内容（根据平台自适应）

**执行步骤**:

1. **加载Meme资源** (L1级别):
   ```
   启动时加载：Classic(D) + Common(C) + Top 10 A-level memes
   按需加载：写作时根据场景加载对应分类的meme
   ```

2. **生成章节内容**:
   ```
   根据章节标题和序号，生成符合以下标准的章节：
   - 字数：根据平台自适应
   - 包含：引子(200-300字) + 人物出场(100-200字) + 核心情节(3000-3500字) + 结尾悬念(200-300字)
   - 避免AI特征词：突然→霎时，然而→但是，没想到→殊不知
   - **每章必须融入5个以上新梗/热梗（从meme数据库选取）**
   - **必须有1个以上热门元素组合**
   - **必须有反套路设计（打脸/真香/反转）**
   ```

3. **质量评估**:
   ```
   调用 quality_evaluator.py 进行20维度评估（权重合计100% v5.0）：

   【创新三维度 - 核心考核】
   - 梗含量 (8%): 新梗热梗密度，从meme数据库引用，支持热度等级检测
   - 潮流热度 (6%): 热门元素组合数量
   - 新鲜感 (6%): 反套路设计，反转密度

   【基础维度】
   - 剧情吸引力 (8%): 悬念+冲突+节奏
   - 人物塑造 (5%): 对话+心理
   - 文笔流畅度 (5%): 句式+段落
   - 字数要求 (5%): 平台自适应字数
   - 幽默风趣度 (5%): 幽默词频
   - 情感共鸣 (5%): 情感词+细节
   - 世界观构建 (4%): 设定词
   - 创新程度 (6%): 创新词
   - 单元剧质量 (6%): 本章完整性
   - 剧情连贯性 (6%): 前后关联
   - AI味道(低为好) (3%): 越低越好
   - 有趣度 (3%): 意想不到的幽默
   - 剧情紧凑度 (5%): 节奏控制
   - 信息量密度 (3%): 小概率事件
   - 剧情反转 (5%): 5种反转类型
   - 作者评价 (3%): 专业视角
   - 读者评价 (3%): 读者体验
   ```

4. **质量判定**:
   ```
   - 达标线：总分≥7.0 且 字数满足平台要求
   - 优秀线：总分≥8.0 且 字数超过平台要求

   若不达标：
   - 分析问题（哪几个维度低）
   - 针对问题重写
   - 重新评估（最多3次）
   ```

### Phase 3: 自动反馈修改

**目标**: 针对低分维度进行定向优化

**执行步骤**:

1. **问题分析**:
   ```
   识别得分 < 6.0 的维度
   制定优化策略
   ```

2. **定向修改**:
   ```
   【创新类问题】
   - 梗含量低 → 从meme数据库融入5个以上新梗热梗，增加弹幕吐槽
   - 潮流热度低 → 加入热门元素组合（重生+系统等）
   - 新鲜感低 → 增加反套路设计，打脸/真香/反转
   - 套路旧 → 避免老套开场，创新主角设定

   【基础类问题】
   - AI味道过高 → 替换特征词，调整句式
   - 剧情紧凑度低 → 删除冗余描述，加快节奏
   - 有趣度低 → 增加意外转折或幽默元素
   - 字数不足 → 扩充情节但不水文
   ```

3. **复评验证**:
   ```
   重新评估修改后的内容
   确认达标后保存
   ```

### Phase 4: 保存与交付

**目标**: 保存章节文件，继续下一章

**执行步骤**:

1. **保存文件**:
   ```
   文件路径: projects/{小说名}/chapters/第{X}章_{标题}.md
   章节格式: # 第{X}章 {标题}
   内容包含: 章节标题 + 正文 + 质量评分
   状态更新: .novel_state.json
   ```

2. **更新进度**:
   ```
   记录已完成章节
   准备下一章节
   ```

3. **循环执行**:
   ```
   自动化流程：直到所有章节完成，无需用户确认
   ```

## Meme Usage Guidelines

### Per-Chapter Requirements

| Element | Minimum | Recommended |
|:---|:---:|:---:|
| New/Hot Memes | 5 | 8+ |
| Popular Element Combos | 1 | 2+ |
| Anti-Trope Designs | 1 | 2+ |

### Scene-Based Selection

| Scene | Recommended Categories |
|:---|:---|
| Combat | anime_jojo, anime_db, game_lol |
| Daily Life | internet_trending, yearly_memes |
| Romance | tv_drama, story_memes |
| Mystery | anime_attack, game_other |
| Fantasy | game_genshin, anime_other |

### Integration Styles

**Style 1: Inline Commentary**
```
主角一拳轰出，"欧拉欧拉欧拉！"【弹幕：欧拉连打！】
```

**Style 2: Bracket Thoughts**
```
反派：（自以为天下无敌）
主角：（呵，究极生物？）
```

**Style 3: Breaking the Fourth Wall**
```
作者：这时候应该来个反转...
读者：来了来了！
```

## Chapter Writing Standards

### Naming Convention

**Novel Title Format**:
```
《主题词》 或 《背景+主题》
示例：《九州问道录》《都市修仙录》《星河归途》
```

**Chapter Title Format**:
```
第X章 主标题·副标题（可选）
分隔符：·（推荐）
长度：8-16字

示例：
- 第1章 觉醒
- 第1章 觉醒·命运的转折
- 第1章 混沌之始·天地未分
```

### 2025-2026 Popular Styles & Meme Culture

**Popular Genres**:
- Family Survival: 《玄鉴仙族》- Traditional cultivation, no golden finger
- Passionate Guardian: 《赤心巡天》- Sword cultivator protecting the world
- Folklore Mystery: 《捞尸人》- Rule horror
- Infinite Flow: 《十日终焉》- Strict logic, multi-layered reading

**Must-Use New/Hot Memes (at least 5/chapter)**:
```
绝绝子、YYDS、emo、躺平、摆烂、内卷、社死、破防、打脸、真香、
上头、下头、芜湖、凡尔赛、显眼包、整活、小丑、笑死、离谱、
急急急、家人们谁懂啊、完蛋、栓Q、麻了、绷不住、蚌埠住
```

**Hot Element Combinations (at least 1/chapter)**:
```
重生+系统、穿书+病娇、霸总+甜宠、星际+异能、直播+带货、
年代文+空间、无限流+悬疑、师尊+师兄、团宠+马甲
```

**Anti-Trope Formulas (at least 1/chapter)**:
```
本以为...却、谁知...偏偏、打脸...来的、真香定律、反转再反转
```

**Danmu/Bracket Commentary Style**:
```
【弹幕: 哈哈哈】(括号吐槽)(这谁顶得住)(我人没了)
```

**Deflection-Style Golden Quotes**:
```
家人们谁懂啊、急急急、笑死、完蛋、我真的太谢了、
我人没了、我傻了、这谁顶得住、完了完了
```

### AI Feature Words (Avoid)

| Word | Alternative |
|:---|:---|
| 突然 | 霎时、顷刻、蓦地 |
| 然而 | 但是、不过、可 |
| 没想到 | 殊不知、出乎意料 |
| 竟然 | 居然、偏要、偏偏 |

### Quality Standards

- **Passing Line**: Total score ≥ 7.0 and word count meets platform requirements
- **Excellent Line**: Total score ≥ 8.0 and word count exceeds platform requirements

### Supported Platforms

- 起点中文网
- 晋江文学城
- 番茄小说
- 纵横中文网
- 七猫小说
- 飞卢小说

## Examples

### Example 1: Automated Writing Triggered

**Input**:
User: `"开始写小说《星河归途》，自动化执行到第5章"`

**Preconditions**:
- User has created `outline/chapters.md` (chapter list)
- User has created `outline/outline.md` (outline)

**Execution Flow**:
1. Set environment: `NOVEL_PROJECT_DIR=/path/to/novel`
2. Read `outline/chapters.md` to get chapter titles
3. Parse chapter titles: Extract format `## 第X章 标题`
4. Generate Chapter {N} content (based on platform word count)
5. Call quality_evaluator.py for evaluation
6. If not passing, auto-revise (max 3 times)
7. Save to `chapters/第01章_觉醒·命运的转折.md`
8. Auto-proceed to Chapter 2, repeat until Chapter 5 complete

**Output**:
```
✅ 第1章 觉醒·命运的转折 - Completed (Score: 7.8, Words: 4236)
✅ 第2章 重生·这一世我不会再输 - Completed (Score: 7.5, Words: 4156)
...
✅ 第5章 浮生若梦·繁华落尽 - Completed (Score: 8.1, Words: 4312)

Total: 5 chapters / {total} chapters, Total 21,234 words
```

### Example 2: Single Chapter Generation & Evaluation

**Input**:
User: `"写第3章 筑基·灵根觉醒"`

**Execution Flow**:
1. Generate chapter content (based on platform word count)
2. 20-dimension evaluation v5.0:
   - 梗含量: 8.5 (Meme database reference)
   - 潮流热度: 7.2 (Hot element combinations)
   - 新鲜感: 7.8 (Anti-trope design)
   - 剧情吸引力: 8.5
   - 人物塑造: 7.8
   - 文笔流畅度: 8.0
   - 字数要求: 8.2
   - AI味道: 2.1 (Low)
   - ... (20 items total)
3. Total Score: 7.6 / 10
4.判定：✅ Passed (≥7.0 and word count meets platform requirements)
5. Save file

**Output**:
```markdown
# 第3章 筑基·灵根觉醒

[Content...]

---
## 质量评估 v5.0
| Dimension | Score |
|:---|:---:|
| 梗含量 | 8.5 |
| 潮流热度 | 7.2 |
| 新鲜感 | 7.8 |
| 剧情吸引力 | 8.5 |
| 人物塑造 | 7.8 |
| ... | ... |
| **Total** | **7.6** |
| Word Count | 4236 |
| Status | ✅ Passed |
```

### Example 3: Meme Database Usage

**Input**:
User: `"写第8章，需要有战斗场景"`

**Execution Flow**:
1. Load L1 memes (Classic + Common + Top 10 A-level)
2. For combat scene, load category: anime_jojo, anime_db, game_lol
3. Select memes for combat:
   - OlaOla (anime_jojo, Level A)
   - 龟派气功 (anime_db, Level A)
   - 我的大刀已经饥渴难耐了 (game_lol, Level A)
4. Integrate into chapter content
5. Evaluate with quality_evaluator.py
6. Save with meme usage recorded

**Output**:
```
✅ Chapter 8 generated with 8 memes from database:
   - anime_jojo: OlaOla, MudaMuda, 究极生物
   - anime_db: 龟派气功, 战力只有5
   - game_lol: 我的大刀已经饥渴难耐了
   - yearly_memes: 急急急, 完蛋
Meme freshness: A-Level 85%, B-Level 15%
```