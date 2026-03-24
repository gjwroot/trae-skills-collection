# 交互式菜单 v5

## 主菜单

当用户说"新闻聚合器"或类似触发词时，展示：

```
# 🌍 全球新闻聚合器 Ultimate v5

请选择场景（回复数字）：

📰 【场景早报】
1. 🌅 综合早报 — 全球科技 + 国内创投 + 财经 + 热点
2. 💼 财经早报 — 股市、投资、商业动态
3. 🚀 科技早报 — HN + Techmeme + GitHub + PH + 36氪
4. 🧠 AI 深度日报 — ArXiv论文 + HuggingFace + 大模型动态
5. ⚡ AI & 编程早报 — AI + 编程 + GitHub + 少数派
6. 🎨 前端/开发者日报 — React/Vue/CSS/工具链/10+ Newsletter + 掘金
7. 🍉 吃瓜早报 — 微博 + 知乎 + B站 + 抖音 + 虎扑 + 豆瓣

🔧 【自定义 & 高级】
8. 🌍 自选信源组合
9. 🔍 搜索特定主题
10. 📖 深度阅读模式（Top 5 深度解读）
11. ⏰ 设置定时早报（每天自动推送）
12. 📊 和上次早报对比（标记新内容）

⚙️ 【输出格式】（可附加在任何场景后）
- 默认：详细卡片 | "表格"：紧凑表格 | "链接"：纯列表

请回复数字（或直接说需求）：_
```

---

## 子菜单 8：自选信源组合

```
# 🌍 自选信源（可多选，逗号分隔）

🎯 全球科技
[1] Hacker News     [2] Techmeme        [3] GitHub Trending
[4] Product Hunt    [5] TechCrunch      [6] The Verge
[7] Ars Technica    [8] Wired

💻 开发者社区
[9] Dev.to          [10] Lobsters       [11] Reddit r/programming

🎨 前端
[12] Echo JS        [13] CSS-Tricks     [14] Smashing Magazine
[15] JS Weekly      [16] Frontend Focus [17] React Status
[18] Node Weekly    [19] Bytes.dev      [20] CSS Weekly

🇨🇳 国内
[21] 36氪           [22] 虎嗅           [23] 钛媒体

💰 财经
[24] 华尔街见闻     [25] 财新网         [26] 第一财经

🔥 社会热点
[27] 微博热搜       [28] 知乎热榜       [29] 百度热搜
[30] 抖音热点

🤖 AI
[31] HuggingFace Papers  [32] Reddit r/ML
[33] Reddit r/LocalLLaMA [34] TLDR AI
[35] ArXiv cs.AI         [36] Papers With Code

🇨🇳 中文开发者
[37] 少数派             [38] V2EX (RSSHub)
[39] 掘金前端           [40] 掘金后端
[41] 掘金AI             [42] InfoQ中文

📬 Newsletters
[43] TLDR Newsletter  [44] TLDR Web Dev  [45] Golang Weekly
[46] This Week in Rust [47] Bytes.dev     [48] CSS Weekly

请输入编号（例如：1,3,9,31,35）：_
```

---

## 子菜单 9：搜索特定主题

```
# 🔍 搜索特定主题

请输入关键词，我会自动扩展并搜索全网：

示例：
- "React 19"    → React 19 Server Components, 社区讨论, 迁移指南
- "DeepSeek"    → 模型更新、论文、开源动态
- "Rust"        → 语言生态、新 crate、This Week in Rust
- "Tailwind v4" → 新特性、迁移、社区反馈
- "新能源汽车"   → 行业新闻、销量数据
- "Web3"        → 区块链、DeFi 动态

请输入关键词：_
```

---

## 子菜单 10：深度阅读模式

```
# 📖 深度阅读模式

将为你获取今日 Top 5 热门新闻的：
- 📄 原文全文摘要（5-8 句）
- 📊 关键数据点
- 🧠 背景知识
- 💬 社区讨论精华（HN/Reddit Top 评论）
- 🔍 深度分析点评

请选择基础场景：
1. 科技（HN + Techmeme + TechCrunch）
2. AI（HuggingFace + Reddit r/ML + TLDR AI）
3. 前端（Dev.to + JS Weekly + GitHub TS Trending）
4. 综合（各场景 Top 1 合并）

请回复数字：_
```

---

## 子菜单 11：定时早报

```
# ⏰ 设置定时早报

选择场景和时间，我会每天自动推送：

场景：回复 1-7（对应上方场景编号）
时间：回复具体时间（如 "9:00"、"早上8点"）

示例："3 9:00" = 每天 9 点推送科技早报

注意：定时任务仅在当前会话中有效（最长 7 天）

请输入 "场景编号 时间"：_
```

---

## 子菜单 12：历史对比

```
# 📊 历史对比

将与上次早报对比，标记：
🆕 新出现的新闻
📈 排名上升的条目
🔄 持续热门的话题
📉 已消失的内容

请选择要对比的场景（回复 1-7）：_
```

---

## 处理中提示

抓取过程中分阶段告知进度：

```
📡 Phase 2: 五级并行抓取中...

Tier S (Bash curl):
✅ HN Algolia API (20 条)
✅ ArXiv cs.AI (10 篇论文)
✅ 少数派 (15 条)

Tier 0 (RSS/WebFetch):
✅ Techmeme RSS (12 条)
✅ TechCrunch RSS (10 条)
⏳ GitHub Trending...

Tier 1 (RSSHub):
⏳ 36氪...
⏳ 微博热搜...

Tier 2 (Search):
⏳ 华尔街见闻...
```

---

## 完成提示

```
✅ 早报生成完成！

📊 {source_count} 个信源 | {total_count} 条新闻 | 🔥 {trend_count} 个趋势话题
⚙️ Tier S: {bash_count} | Tier 0: {rss_count} | Tier 1: {rsshub_count} | Tier 2: {search_count}
📁 已保存：{file_path}

💬 可以追问："展开第 N 条"、"第 N 条评论"、"搜搜 XXX"、"和上次比"、"每天9点推送"
```
