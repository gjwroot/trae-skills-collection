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

---

## 5. AI & 编程早报

**板块顺序**：
1. 🔥 趋势话题
2. ⭐ 头条精选（Top 3）
3. 🤖 AI 动态（TLDR AI + HN AI 相关）
4. 💻 编程热点（Dev.to + Lobsters）
5. 🐙 开源趋势（GitHub Trending 多语言）— 使用项目卡片
6. 🛠️ 开发者工具（新工具/库发布）
7. 💡 编辑推荐 Top 3

**趋势检测重点**：新语言/框架版本、AI 编程工具、开发者体验

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

---

## 通用规则

1. **趋势话题**放在最前面（如有检测到），没有则跳过
2. **头条精选**紧随其后，3-5 条最重要新闻，默认带深度点评
3. **编辑推荐**放在最后，3 条 + 推荐理由
4. 每板块按信源原生指标降序排列
5. 板块不足 3 条 → 标注 `📌 补充` + 放宽搜索
6. 英文翻译中文摘要，保留原文标题和链接
7. **追问提示**：每份早报末尾必须附带追问引导语
