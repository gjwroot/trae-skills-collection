# 统一输出模板 v5

支持三种输出格式 + 历史对比模式 + 信源健康报告。

---

## 格式 A：详细卡片（默认）

```markdown
# {scene_emoji} {date} {scene_name}

> 📊 **信源**：{source_1}、{source_2}、{source_3}、... ({source_count} 个) | **新闻**：{total_count} 条 | **格式**：详细 | **生成**：{time}

---

## 🔥 趋势话题
> 以下话题被多个信源同时报道

### 🔥🔥 {topic_name}
> 被 {N} 个信源报道：{source_1}、{source_2}、{source_3}
**综合摘要**：{merged_summary}
**相关链接**：
- [{source_1} 报道]({url_1})
- [{source_2} 报道]({url_2})
- [{source_3} 报道]({url_3})

### 🔥 {topic_name_2}
> 被 {N} 个信源报道：...

---

## ⭐ 头条精选

<!-- ⚠️ 必填字段：📝中文翻译、来源、🔗链接 — 任何条目缺少这三项则不得展示 -->

### 1. {title}
- 📝 **中文翻译**：{title_zh}  ← **必填**
- **来源**：{source} | **{metric_name}**：{metric_value}  ← **必填**
- 🔗 [链接]({url})  ← **必填，真实URL**
> 💡 **深度点评**：{insight}

### 2. {title}
- 📝 **中文翻译**：{title_zh}
- **来源**：{source} | **{metric_name}**：{metric_value}
- 🔗 [链接]({url})
> 💡 **深度点评**：{insight}

### 3. {title}
- 📝 **中文翻译**：{title_zh}
- **来源**：{source} | **{metric_name}**：{metric_value}
- 🔗 [链接]({url})

---

## {section_emoji} {section_name}

### {rank}. {title}
- 📝 **中文翻译**：{title_zh}
- **来源**：{source} | **{metric_name}**：{metric_value}
- 🔗 [链接]({url})

---

（更多板块...）

---

## 💡 编辑推荐

1. **{title}** — {one_line_reason} 🔗 [链接]({url})
2. **{title}** — {one_line_reason} 🔗 [链接]({url})
3. **{title}** — {one_line_reason} 🔗 [链接]({url})

---

> 💬 **可以追问**："展开第 N 条"、"第 N 条的评论"、"搜搜 XXX 的更多信息"

_由 🌍 全球新闻聚合器 Ultimate v5 生成 | {time}_
```

---

## 格式 B：紧凑表格

```markdown
# {scene_emoji} {date} {scene_name}

> 📊 **信源**：{source_1}、{source_2}、{source_3}、... ({source_count} 个) | **新闻**：{total_count} 条 | **格式**：紧凑 | **生成**：{time}

## 🔥 趋势
| 话题 | 信源数 | 链接 |
|------|--------|------|
| {topic} | {N} 个 | [链接1]({url}) [链接2]({url}) |

## ⭐ 头条
| # | 标题 | 中文翻译 | 来源 | 指标 | 链接 |
|---|------|----------|------|------|------|
| 1 | {title} | {title_zh} | {source} | {metric} | [链接]({url}) |
| 2 | {title} | {title_zh} | {source} | {metric} | [链接]({url}) |
| 3 | {title} | {title_zh} | {source} | {metric} | [链接]({url}) |

## {section_emoji} {section_name}
| # | 标题 | 中文翻译 | 来源 | 指标 | 链接 |
|---|------|----------|------|------|------|
| 1 | {title} | {title_zh} | {source} | {metric} | [链接]({url}) |
| 2 | {title} | {title_zh} | {source} | {metric} | [链接]({url}) |
| ... | ... | ... | ... | ... | ... |

（更多板块...）

## 💡 推荐
1. [{title}]({url}) — {reason}
2. [{title}]({url}) — {reason}
3. [{title}]({url}) — {reason}

_🌍 v5 | {time}_
```

---

## 格式 C：纯链接列表

```markdown
# {scene_emoji} {date} {scene_name}（快速版）

🔥 **趋势**：{topic_1}({N}源) | {topic_2}({N}源)

**⭐ 头条**
1. [{title}]({url}) — {source}, {metric}
2. [{title}]({url}) — {source}, {metric}
3. [{title}]({url}) — {source}, {metric}

**{section_name}**
4. [{title}]({url}) — {source}
5. [{title}]({url}) — {source}
...

**{section_name}**
N. [{title}]({url}) — {source}
...

💡 **推荐**：[{title_1}]({url}) | [{title_2}]({url}) | [{title_3}]({url})

_🌍 v5 | {time}_
```

---

## 深度阅读输出格式

当用户要求深度阅读或追问某条新闻时：

```markdown
### 📖 深度阅读：{title}

**来源**：{source} | **发布时间**：{time} | **{metric_name}**：{metric_value}

#### 全文摘要
{detailed_summary_5_8_sentences}

#### 关键数据
- {data_point_1}
- {data_point_2}
- {data_point_3}

#### 背景知识
{background_context_2_3_sentences}

#### 社区讨论精华
> "{top_comment_1}" — {commenter_1}
> "{top_comment_2}" — {commenter_2}
> "{top_comment_3}" — {commenter_3}

#### 深度点评
{analysis_2_3_sentences}

**原文链接**：[阅读原文]({url})
```

---

## 场景自适应配置

### 板块映射

| 场景 | emoji | 板块顺序 |
|------|-------|---------|
| **综合** | 🌅 | 趋势 → 头条 → 🔬科技前沿 → 🚀国内创投 → 💼财经商业 → 🏠社会热点 → 推荐 |
| **财经** | 💼 | 趋势 → 头条 → 📈市场动态 → 🏢公司新闻 → 💰投资观点 → 🌍国际财经 → 推荐 |
| **科技** | 🚀 | 趋势 → 头条 → 🦄硅谷动态 → 🐱新产品 → 🐙开源趋势 → 🇨🇳国内创投 → 推荐 |
| **AI深度** | 🧠 | 趋势 → 头条 → 📝论文精选 → 📰行业动态 → 🛠️开源项目 → 💭深度观点 → 🎯技术趋势 → 推荐 |
| **AI编程** | ⚡ | 趋势 → 头条 → 🤖AI动态 → 💻编程热点 → 🐙开源趋势 → 🛠️开发者工具 → 推荐 |
| **前端** | 🎨 | 趋势 → 头条 → ⚛️框架动态 → 🎨CSS&UI → 🔧工具链 → 📘TS/Node → 📦组件库 → 📬Newsletter精华 → 推荐 |
| **吃瓜** | 🍉 | 🔥热搜Top10 → 🎭娱乐 → 💬知乎热议 → 😂最佳评论 → 推荐 |

### 指标名称

| 信源 | metric_name | 示例 |
|------|------------|------|
| Hacker News | Points | 342 pts |
| GitHub | ⭐ Today | +1.2k ⭐ |
| Product Hunt | Votes | 567 🔺 |
| Reddit | Upvotes | 2.3k ⬆ |
| Dev.to | Reactions | 128 ❤️ |
| Lobsters | Score | 45 |
| Techmeme | — | (元聚合，无原生指标) |
| 微博 | 热度 | 108万 🔥 |
| 知乎 | 关注 | 5.2万 |

---

## 特殊条目格式

### GitHub 项目卡片
```markdown
### {owner} / {repo}
- 📝 **中文翻译**：{description_zh}
- 📝 {description_en}
- 👉 语言: {language} | ⭐ +{today_stars} today | 总 Stars: {total_stars}
- 🔗 [链接]({url})
```

### Product Hunt 产品卡片
```markdown
### {rank}. {product_name}
- 📝 **中文翻译**：{tagline_zh}
- 📝 {tagline_en}
- 👉 票数: {votes}
- 🔗 [链接]({url})
```

### 论文学术卡片
```markdown
### {rank}. {paper_title}
- 📝 **中文翻译**：{title_zh}
- 🔗 [链接]({url})
- 📝 Abstract: {abstract_truncated}...
```

### 热搜条目
```markdown
### {rank}. {topic} — 🔥 {heat_value}
- 📝 **平台**：{platform} | **类型**：{category}
- 📝 {summary}
```

### 补充内容
```markdown
### 📌 {title}
- 📝 **中文翻译**：{title_zh}
- 🔗 [链接]({url})
```

---

## 追问提示

每份早报末尾必须附带追问提示：

```markdown
> 💬 **可以追问**：
> - "展开第 N 条" — 深度阅读某条新闻
> - "第 N 条的评论" — 查看社区讨论
> - "搜搜 XXX" — 扩展搜索某个话题
> - "这个项目的 GitHub" — 查看开源项目详情
> - "表格格式" — 切换为紧凑表格重新展示
> - "和上次比" — 对比上次早报，标记新内容
> - "每天早上9点" — 设置定时自动推送
```

---

## 历史对比输出格式（v5 新增）

当用户要求 "和上次比" 时：

```markdown
## 📊 与上次早报对比

**上次早报**：{last_date} {last_scene}
**本次早报**：{this_date} {this_scene}

### 🆕 新出现
1. [{title}]({url}) — {source}（上次未出现）
2. ...

### 📈 排名上升
1. [{title}]({url}) — 从第{old_rank}升至第{new_rank}
2. ...

### 🔄 持续热门
1. [{title}]({url}) — 连续{N}次上榜
2. ...

### 📉 已消失
1. {title} — 上次第{rank}，本次未出现
```

---

## 信源健康报告（v5 新增）

仅当有信源失败时在早报末尾附带：

```markdown
> ⚙️ **信源状态**：{success}/{total} 成功
> ⚠️ 降级：{source_1}(Tier S→Tier 0), {source_2}(Tier 0→Tier 2)
> ❌ 跳过：{source_3}(所有 Tier 均失败)
```

---

## ArXiv 论文卡片格式（v5 新增）

```markdown
### {rank}. {paper_title}
- 📝 **中文翻译**：{title_zh}
- 📝 **领域**：{cs.AI/cs.LG/cs.CL} | **日期**：{date}
- 🔗 [链接]({arxiv_url})
- 📝 Abstract: {abstract_truncated}...
```

---

## 质量自检区块（内部使用，不输出给用户）

在生成最终 Markdown 之前，执行以下检查。不通过则补数据后重新生成：

```
✅ 中文翻译：{english_items_with_zh}/{total_english_items} = {percentage}% （要求 100%）
✅ 原链覆盖：{items_with_link}/{total_items} = {percentage}% （要求 100%）
✅ 信源多样性：实际信源 = [{source_list}] = {count} 个（要求 ≥ 场景最低数）
✅ 板块条目数：头条={n}(≥3) | {section1}={n}(≥2) | {section2}={n}(≥2) | ...
✅ 趋势跨源：{trend_count} 个趋势，每个 ≥2 信源
```

> **关键原则**：宁可少展示几条高质量条目，也不要展示缺翻译、缺链接、缺来源的条目。
