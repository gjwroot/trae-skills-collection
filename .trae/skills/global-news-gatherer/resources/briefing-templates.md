# 场景早报模板 v5

所有场景共用统一模板结构（见 `output-template.md`），此文件定义每个场景的**特有板块、特殊格式、Tier S Bash 命令和趋势检测规则**。

---

## 1. 综合早报

**板块顺序**：
1. 🔥 趋势话题（跨源共同报道，如有）
2. ⭐ 头条精选（Top 3，带深度点评）
3. 🔬 科技前沿（HN + Techmeme + TechCrunch + Verge）
4. 🚀 国内创投（36氪）
5. 💼 财经商业（华尔街见闻）
6. 🏠 社会热点（微博热搜）
7. 💡 编辑推荐 Top 3

**趋势检测重点**：科技公司动态、融资事件、产品发布

**强制要求**：
- 🔢 **最低信源数**：≥5 个（HN + Techmeme/TechCrunch/Verge + GitHub/PH + 36氪 + 微博）
- 🈯 **中文翻译**：HN/Techmeme/TechCrunch/Verge/GitHub/PH 的英文内容全部翻译；36氪/微博保持中文
- 🔗 **原链**：每条必须有 `🔗 [链接](url)`，URL 来自实际抓取
- 📊 **板块最低条目**：头条≥3，科技前沿≥3，国内创投≥2，财经≥2，社会热点≥2

---

## 2. 财经早报

**板块顺序**：
1. 🔥 趋势话题
2. ⭐ 头条精选（Top 3，带市场影响分析）
3. 📈 市场动态（华尔街见闻 + Reddit r/investing）
4. 🏢 公司新闻（财新 + 36氪融资）
5. 💰 投资观点
6. 🌍 国际财经（第一财经）
7. 💡 编辑推荐 Top 3

**特殊**：头条增加"市场影响"分析：
```markdown
> 📊 **市场影响**：{analysis}
```

**趋势检测重点**：央行政策、大公司财报、行业监管

**强制要求**：
- 🔢 **最低信源数**：≥3 个（Reddit r/investing + 36氪 + 华尔街见闻/财新/第一财经）
- 🈯 **中文翻译**：Reddit 英文内容全部翻译；中文源保持中文
- 🔗 **原链**：每条必须有 `🔗 [链接](url)`
- 📊 **板块最低条目**：头条≥3，市场动态≥3，公司新闻≥2，投资观点≥2

---

## 3. 科技早报

**板块顺序**：
1. 🔥 趋势话题
2. ⭐ 头条精选（Top 3，带技术亮点）
3. 🦄 硅谷动态（Hacker News）— 使用 HN 帖子格式
4. 🐱 新产品发现（Product Hunt）— 使用产品卡片格式
5. 🐙 开源趋势（GitHub Trending）— 使用项目卡片格式
6. 🇨🇳 国内创投（36氪）
7. 💡 编辑推荐 Top 3

**趋势检测重点**：新框架/工具发布、科技公司动态、开源项目爆火

**强制要求**：
- 🔢 **最低信源数**：≥5 个（HN + Techmeme/TechCrunch/Verge/Ars/Wired + GitHub + PH + 36氪）
- 🈯 **中文翻译**：所有英文标题和摘要必须翻译；GitHub 项目描述翻译；PH tagline 翻译
- 🔗 **原链**：每条必须有 `🔗 [链接](url)`，GitHub 项目链接到仓库页
- 📊 **板块最低条目**：头条≥3，硅谷动态≥3，新产品≥3，开源趋势≥3，国内≥2

---

## 4. AI 深度日报

**板块顺序**：
1. 🔥 趋势话题
2. ⭐ 头条精选（Top 3，带技术深度分析）
3. 📝 论文精选（ArXiv cs.AI/cs.LG/cs.CL via Bash curl + HuggingFace Papers + Papers With Code）— 使用学术卡片格式
4. 📰 行业动态（Ben's Bites + Latent Space + TLDR AI）
5. 🛠️ 开源项目（GitHub Trending AI + Reddit r/ML + r/LocalLLaMA）
6. 💭 深度观点
7. 🎯 本周技术趋势 Top 3
8. 💡 编辑推荐 Top 3

**特殊**：论文条目使用学术卡片：
```markdown
### {rank}. [{paper_title}]({url})
**作者**：{authors} | **机构**：{institution}
**摘要**：{abstract_zh}（1-2 句）
**核心贡献**：
- {contribution_1}
- {contribution_2}
```

**趋势检测重点**：新模型发布、Benchmark 突破、开源大模型、AI 监管政策

**强制要求**：
- 🔢 **最低信源数**：≥4 个（HN AI搜索 + ArXiv + Reddit r/ML/r/LocalLLaMA + TLDR AI + HuggingFace/PWC + 掘金AI）
- 🈯 **中文翻译**：ArXiv 论文标题/摘要全部翻译；Reddit/HN 英文内容翻译；HuggingFace 论文翻译
- 🔗 **原链**：论文必须链接到 ArXiv 原文；项目必须链接到 GitHub
- 📊 **板块最低条目**：头条≥3，论文精选≥3，行业动态≥3，开源项目≥3

---

## 5. AI & 编程早报

**板块顺序**：
1. 🔥 趋势话题
2. ⭐ 头条精选（Top 3）
3. 🤖 AI 动态（TLDR AI + HN AI 相关）
4. 💻 编程热点（Lobsters JSON API + Dev.to API — **均为 Tier S 直取**）
5. 🐙 开源趋势（GitHub Trending 多语言）— 使用项目卡片
6. 🛠️ 开发者工具（新工具/库发布）
7. 💡 编辑推荐 Top 3

**Tier S 直取信源（优先并行）**：HN Algolia、少数派 RSS、Lobsters JSON、Dev.to API
**Tier S 备用**：HN Firebase API

**趋势检测重点**：新语言/框架版本、AI 编程工具、开发者体验

**强制要求**：
- 🔢 **最低信源数**：≥5 个（HN + Lobsters/Dev.to + TLDR AI/Tech + GitHub Trending 多语言 + V2EX/掘金/InfoQ + 少数派）
- 🈯 **中文翻译**：HN/Lobsters/Dev.to/TLDR/GitHub 英文内容全部翻译；V2EX/掘金/InfoQ/少数派保持中文
- 🔗 **原链**：每条必须有 `🔗 [链接](url)`；GitHub 项目链接到仓库
- 📊 **板块最低条目**：头条≥3，AI动态≥3，编程热点≥3，开源趋势≥3，开发者工具≥2

---

## 6. 前端/开发者日报

**板块顺序**：
1. 🔥 趋势话题
2. ⭐ 头条精选（Top 3）
3. ⚛️ 框架动态（React/Vue/Svelte/Angular 相关）
4. 🎨 CSS & UI（CSS-Tricks + Tailwind + 设计系统）
5. 🔧 工具链（Vite/Webpack/esbuild/Turbopack/Bun/Deno）
6. 📘 TypeScript / Node.js（Node Weekly + TS 相关）
7. 📦 开源组件库（新发布/更新的 UI 库和工具包）
8. 📬 本周 Newsletter 精华（合并 JS Weekly + Frontend Focus + React Status + Bytes.dev）
9. 💡 编辑推荐 Top 3

**Tier S 直取信源（优先并行）**：HN Algolia (前端关键词搜索)、Lobsters JSON、Dev.to API (tag:react/vue/css/typescript)
**Tier S 备用**：HN Firebase API

**特殊**：Newsletter 精华用合并表格：
```markdown
#### 📬 本周 Newsletter 精华
| 来源 | 标题 | 简介 |
|------|------|------|
| JS Weekly | [{title}]({url}) | {desc} |
| Frontend Focus | [{title}]({url}) | {desc} |
| React Status | [{title}]({url}) | {desc} |
| Bytes.dev | [{title}]({url}) | {desc} |
```

**分类关键词映射**：
| 板块 | 归类关键词 |
|------|-----------|
| 框架动态 | React, Vue, Svelte, Angular, Next.js, Nuxt, Remix, Solid, Qwik, Astro |
| CSS & UI | CSS, Tailwind, UnoCSS, Sass, styled-components, Radix, shadcn, Open Props |
| 工具链 | Vite, Webpack, esbuild, Turbopack, Rollup, Bun, Deno, pnpm, Biome |
| TS/Node | TypeScript, Node.js, Express, Fastify, Hono, tRPC, Zod |
| 开源组件库 | UI library, component, design system, Ant Design, Material UI, Headless UI |

**趋势检测重点**：框架新版本、CSS 新特性、构建工具更新、浏览器 API

**强制要求**：
- 🔢 **最低信源数**：≥5 个（HN + JS Weekly/Frontend Focus/React Status/Bytes/CSS Weekly + Reddit r/reactjs/r/vuejs/r/webdev + Dev.to/Lobsters + Echo JS/CSS-Tricks/Smashing + 掘金前端）
- 🈯 **中文翻译**：所有英文 Newsletter/Reddit/HN 内容翻译；掘金保持中文
- 🔗 **原链**：每条必须有 `🔗 [链接](url)`
- 📊 **板块最低条目**：头条≥3，框架动态≥3，CSS&UI≥2，工具链≥2，TS/Node≥2，Newsletter精华≥4

---

## 7. 吃瓜早报

**板块顺序**：
1. 🔥 热搜 Top 10（微博 + 百度 + 抖音合并，按热度排序）
2. 🎭 娱乐动态
3. 💬 知乎热议（Top 讨论 + 高赞回答摘要）
4. 😂 今日最佳评论/段子
5. 💡 编辑推荐 — 最值得关注的 3 个瓜

**特殊**：热搜条目格式：
```markdown
### {rank}. {topic} — 🔥 {heat_value}
**平台**：{platform} | **类型**：{category}
**摘要**：{summary}
```

**合并排序规则**：微博热度 > 百度搜索量 > 抖音播放量，归一化后统一排序

**强制要求**：
- 🔢 **最低信源数**：≥3 个（微博 + 知乎 + B站/抖音/百度）
- 🈯 **中文翻译**：中文源为主，保持中文原文即可
- 🔗 **原链**：热搜条目尽量附带话题链接；知乎热议附带问题链接
- 📊 **板块最低条目**：热搜Top10≥10，娱乐≥3，知乎热议≥3，最佳评论≥2

---

## 通用规则

1. **趋势话题**放在最前面（如有检测到），没有则跳过
2. **头条精选**紧随其后，3-5 条最重要新闻，默认带深度点评
3. **编辑推荐**放在最后，3 条 + 推荐理由
4. 每板块按信源原生指标降序排列
5. 板块不足最低条目数 → 用 Tier 2 WebSearch 补充，直至达标
6. **中文翻译强制**：所有英文内容必须提供 `📝 **中文翻译**：` 行，翻译自然通顺。中文源保持原文
7. **原链强制**：每条必须有 `🔗 [链接]({url})`，链接来自真实抓取数据，无链接的条目不展示
8. **多信源标注**：统计行 `📊 信源：` 必须列出所有实际命中的信源名称
9. **追问提示**：每份早报末尾必须附带追问引导语
