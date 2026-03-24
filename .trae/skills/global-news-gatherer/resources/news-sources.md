# 信源配置详解 v5

## 五级信源体系

---

## Tier S：Bash curl 直取（已实测，最可靠）

### Hacker News Algolia API

| 用途 | Bash 命令 |
|------|----------|
| **首页热门** | `curl -s "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=20" \| python3 -c "import sys,json; data=json.load(sys.stdin); [print(f'{i}. {h[\"title\"]} \| {h.get(\"points\",0)} pts \| {h.get(\"num_comments\",0)} comments \| {h.get(\"url\",\"\")}') for i,h in enumerate(data['hits'],1)]"` |
| **AI 话题** | 同上，query 改为 `query=AI+LLM+GPT+Claude` |
| **Show HN** | 同上，tags 改为 `tags=show_hn` |
| **Ask HN** | 同上，tags 改为 `tags=ask_hn` |
| **任意搜索** | 同上，query 改为目标关键词，`+` 连接多词 |

### ArXiv 论文 RSS

| 领域 | Bash 命令 |
|------|----------|
| **cs.AI** | `curl -sL "https://export.arxiv.org/rss/cs.AI" \| python3 -c "import sys,re,html; c=sys.stdin.read(); items=re.findall(r'<item[^>]*>.*?<title>(.*?)</title>.*?<link>(.*?)</link>',c,re.DOTALL); [print(f'{i}. {html.unescape(re.sub(r\"<[^>]+>\",\"\",t)).strip()} \| {l}') for i,(t,l) in enumerate(items[:10],1)]"` |
| **cs.LG** | 同上，路径改为 `/rss/cs.LG` |
| **cs.CL** | 同上，路径改为 `/rss/cs.CL` |
| **cs.CV** | 同上，路径改为 `/rss/cs.CV` |
| **cs.SE** | 同上，路径改为 `/rss/cs.SE`（软件工程） |

### 少数派

```bash
curl -s "https://sspai.com/feed" | python3 -c "
import sys,re
content=sys.stdin.read()
items=re.findall(r'<item>.*?<title>(.*?)</title>.*?<link>(.*?)</link>.*?</item>',content,re.DOTALL)
for i,(t,l) in enumerate(items[:15],1):
    print(f'{i}. {t} | {l}')
"
```

---

## Tier 0：RSS + WebFetch

（信源列表见 SKILL.md Tier 0 部分，此处仅补充 WebFetch prompt 模板）

### 通用 RSS WebFetch Prompt
> "从此 RSS/Atom feed 提取所有文章条目：标题、简介(如有)、链接URL。中文编号列表输出。"

### 信源专用 WebFetch Prompt

| 信源 | Prompt |
|------|--------|
| **GitHub Trending** | "提取趋势仓库前 15 个：仓库全名(owner/repo)、描述、语言、今日 star 增长。中文编号列表输出。" |
| **Product Hunt** | "提取今日热门产品前 10 个：产品名、tagline、票数、链接。中文编号列表输出。" |
| **HuggingFace Papers** | "提取今日热门论文前 10：标题、作者、1-2句摘要、链接。中文编号列表输出。" |
| **Papers With Code** | "提取最新 10 篇带代码的论文：标题、GitHub 仓库链接(如有)、star 数(如有)。中文编号列表输出。" |
| **Techmeme HTML** | "提取页面上所有主要新闻：标题、来源媒体、链接。尽量多提取。中文编号列表输出。" |
| **Echo JS** | "提取首页热门 JS 文章前 10：标题、链接、投票数。中文编号列表输出。" |
| **CSS-Tricks** | "提取最新 8 篇文章：标题、简介、链接。中文编号列表输出。" |
| **Smashing Magazine** | "提取最新 8 篇文章：标题、简介、链接。中文编号列表输出。" |

---

## Tier 1：RSSHub 中国源

### 公共实例（按优先级尝试）
1. `https://rsshub.app`
2. `https://rsshub.rssforever.com`
3. `https://rsshub.pseudoyu.com`

### 完整路径表

| 信源 | 路径 | 场景 |
|------|------|------|
| 36氪热榜 | `/36kr/hot-list` | 综合、科技 |
| 知乎热榜 | `/zhihu/hot` | 吃瓜 |
| 微博热搜 | `/weibo/search/hot` | 综合、吃瓜 |
| B站热门 | `/bilibili/ranking/0/3/1` | 吃瓜 |
| 抖音热点 | `/douyin/trending` | 吃瓜 |
| 虎嗅 | `/huxiu/article` | 科技 |
| 钛媒体 | `/tmtpost/recommend` | 科技 |
| V2EX热门 | `/v2ex/topics/hot` | AI编程 |
| InfoQ中文 | `/infoq/recommend` | AI编程 |
| 掘金前端 | `/juejin/trending/frontend/1` | 前端 |
| 掘金后端 | `/juejin/trending/backend/1` | AI编程 |
| 掘金AI | `/juejin/trending/ai/1` | AI深度 |
| 豆瓣电影 | `/douban/movie/playing` | 吃瓜 |
| 虎扑热帖 | `/hupu/all/hot` | 吃瓜 |

---

## 场景 → 信源映射速查（v5）

| 场景 | Tier S (Bash) | Tier 0 (RSS/WebFetch) | Tier 1 (RSSHub) | Tier 2 (WebSearch) |
|------|--------------|----------------------|-----------------|-------------------|
| **综合** | HN API | Techmeme RSS, TC RSS, Verge RSS, GH Trending, PH | 36氪, 微博 | 华尔街见闻 |
| **财经** | — | Reddit r/investing RSS | 36氪 | 华尔街见闻, 财新, 第一财经 |
| **科技** | HN API | Techmeme RSS, TC RSS, Verge RSS, Ars RSS, Wired RSS, GH Trending, PH | 36氪 | — |
| **AI深度** | HN API(AI), ArXiv cs.AI, cs.LG, cs.CL | Reddit r/ML RSS, r/LocalLLaMA RSS, TLDR AI RSS, HF Papers, PWC | 掘金AI | Latent Space, Ben's Bites |
| **AI编程** | HN API, 少数派 | Lobsters RSS, Dev.to RSS, TLDR AI/Tech RSS, GH Trending(多语言) | V2EX, 掘金后端, InfoQ | — |
| **前端** | HN API(前端搜索) | JS/Frontend/React/Node Weekly RSS, Bytes RSS, CSS Weekly RSS, Reddit r/reactjs/vuejs/webdev RSS, Dev.to RSS, Lobsters RSS, Echo JS, CSS-Tricks, Smashing, GH(TS) | 掘金前端 | Vue/Next/Tailwind |
| **吃瓜** | — | — | 微博, 知乎, B站, 抖音, 虎扑, 豆瓣 | 百度热搜 |

---

## 深度阅读信源

| 原始来源 | 操作 | URL |
|---------|------|-----|
| HN 帖子 | WebFetch 评论 | `https://news.ycombinator.com/item?id={id}` |
| HN 帖子 | Bash API 评论 | `curl -s "https://hn.algolia.com/api/v1/items/{id}" \| python3 解析 children` |
| Reddit | WebFetch 帖子 | 原帖 URL |
| 论文 | WebFetch 论文页 | 原论文 URL |
| 博客 | WebFetch 原文 | 原文 URL |
| GitHub | WebFetch README | `https://github.com/{owner}/{repo}` |
