---
name: "global-news-gatherer"
description: "全球新闻聚合器 Ultimate v5 - 五级数据源（Bash curl → RSS → WebFetch → WebSearch → MCP），50+ 信源含 ArXiv/少数派/RSSHub，Bash 直取 JSON API，深度阅读，趋势检测，多轮追问，定时早报。Invoke when user asks to gather, organize, or categorize news from global or Chinese sources."
---

# 全球新闻聚合器 Ultimate v5

> **v5 核心升级**：新增 Bash curl+jq 直取 JSON API（已验证 HN Algolia 完美可用）、ArXiv 论文 RSS、少数派 RSS、RSSHub 万能兜底、定时自动早报、历史对比模式、信源健康监控。

---

## 核心能力

| 能力 | 说明 |
|------|------|
| **五级数据源** | Tier S Bash curl → Tier 0 RSS → Tier 1 WebFetch → Tier 2 WebSearch → Tier 3 MCP |
| **Bash 直取 JSON** | `curl + python3/jq` 直接解析 HN Algolia API、GitHub API，**已实测验证**，100% 可靠 |
| **50+ 信源** | 含 ArXiv (cs.AI/cs.LG/cs.CL)、少数派、Techmeme、Papers With Code、RSSHub |
| **7 大场景早报** | 综合、财经、科技、AI 深度、AI 编程、前端开发者、吃瓜 |
| **深度阅读** | Top 新闻 WebFetch 原文全文 + 社区评论 |
| **跨源趋势检测** | 2+ 信源共同报道 → 🔥趋势置顶 |
| **多轮追问** | 早报后支持 "展开第N条"、"第N条评论"、"搜搜XXX" |
| **三种输出格式** | 详细卡片 / 紧凑表格 / 纯链接列表 |
| **定时自动早报** | 集成 CronCreate，每天定时自动推送 |
| **历史对比** | 对比上次早报，标记 🆕 新内容 |
| **信源健康监控** | 记录成功/失败，自动调整降级策略 |

---

## 五级信源架构

### Tier S：Bash curl 直取 JSON API（最可靠，已实测验证）

> **为什么 Tier S 最强**：Bash curl 不经过 WebFetch 的 AI 解析，直接获取原始 JSON/XML 数据，再用 python3 精确解析。零幻觉、零遗漏、100% 结构化。

#### 已验证可用的 Bash 命令：

**Hacker News Algolia API（首页热门）**：
```bash
curl -s "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=20" | python3 -c "
import sys,json
data=json.load(sys.stdin)
for i,h in enumerate(data['hits'],1):
    print(f\"{i}. {h['title']} | {h.get('points',0)} pts | {h.get('num_comments',0)} comments | {h.get('url','https://news.ycombinator.com/item?id='+str(h['objectID']))}\")
"
```

**Hacker News Algolia API（AI 话题搜索）**：
```bash
curl -s "https://hn.algolia.com/api/v1/search?query=AI+LLM+GPT+Claude&tags=story&hitsPerPage=15&numericFilters=points>50" | python3 -c "
import sys,json
data=json.load(sys.stdin)
for i,h in enumerate(data['hits'],1):
    print(f\"{i}. {h['title']} | {h.get('points',0)} pts | {h.get('num_comments',0)} comments | {h.get('url','')}\")
"
```

**Hacker News Algolia API（Show HN）**：
```bash
curl -s "https://hn.algolia.com/api/v1/search?tags=show_hn&hitsPerPage=10" | python3 -c "
import sys,json
data=json.load(sys.stdin)
for i,h in enumerate(data['hits'],1):
    print(f\"{i}. {h['title']} | {h.get('points',0)} pts | {h.get('url','')}\")
"
```

**Hacker News Algolia API（Ask HN）**：
```bash
curl -s "https://hn.algolia.com/api/v1/search?tags=ask_hn&hitsPerPage=10" | python3 -c "
import sys,json
data=json.load(sys.stdin)
for i,h in enumerate(data['hits'],1):
    print(f\"{i}. {h['title']} | {h.get('points',0)} pts | {h.get('num_comments',0)} comments\")
"
```

**Hacker News Algolia API（任意关键词搜索）**：
```bash
curl -s "https://hn.algolia.com/api/v1/search?query={KEYWORD}&tags=story&hitsPerPage=15&numericFilters=points>20" | python3 -c "
import sys,json
data=json.load(sys.stdin)
for i,h in enumerate(data['hits'],1):
    print(f\"{i}. {h['title']} | {h.get('points',0)} pts | {h.get('url','')}\")
"
```
> 将 `{KEYWORD}` 替换为搜索词，如 `React+19`、`Rust`、`TypeScript`、`DeepSeek` 等。多词用 `+` 连接。

**少数派 RSS（已验证可用）**：
```bash
curl -s "https://sspai.com/feed" | python3 -c "
import sys,re
content=sys.stdin.read()
items=re.findall(r'<item>.*?<title>(.*?)</title>.*?<link>(.*?)</link>.*?</item>',content,re.DOTALL)
for i,(t,l) in enumerate(items[:15],1):
    print(f'{i}. {t} | {l}')
"
```

**ArXiv cs.AI 论文（已验证可用，需 -L 跟随重定向）**：
```bash
curl -sL "https://export.arxiv.org/rss/cs.AI" | python3 -c "
import sys,re,html
content=sys.stdin.read()
items=re.findall(r'<item[^>]*>.*?<title>(.*?)</title>.*?<link>(.*?)</link>.*?<description>(.*?)</description>.*?</item>',content,re.DOTALL)
for i,(t,l,d) in enumerate(items[:10],1):
    title=html.unescape(re.sub(r'<[^>]+>','',t)).strip()
    desc=html.unescape(re.sub(r'<[^>]+>','',d)).strip()[:150]
    print(f'{i}. {title} | {l} | {desc}...')
"
```

**ArXiv cs.LG（机器学习）**：
```bash
curl -sL "https://export.arxiv.org/rss/cs.LG" | python3 -c "
import sys,re,html
content=sys.stdin.read()
items=re.findall(r'<item[^>]*>.*?<title>(.*?)</title>.*?<link>(.*?)</link>',content,re.DOTALL)
for i,(t,l) in enumerate(items[:10],1):
    print(f'{i}. {html.unescape(re.sub(r\"<[^>]+>\",\"\",t)).strip()} | {l}')
"
```

**ArXiv cs.CL（NLP/计算语言学）**：
```bash
curl -sL "https://export.arxiv.org/rss/cs.CL" | python3 -c "
import sys,re,html
content=sys.stdin.read()
items=re.findall(r'<item[^>]*>.*?<title>(.*?)</title>.*?<link>(.*?)</link>',content,re.DOTALL)
for i,(t,l) in enumerate(items[:10],1):
    print(f'{i}. {html.unescape(re.sub(r\"<[^>]+>\",\"\",t)).strip()} | {l}')
"
```

**Lobsters JSON API（已验证可用）**：
```bash
curl -s --connect-timeout 10 --max-time 30 "https://lobste.rs/hottest.json" | python3 -c "
import sys,json
data=json.load(sys.stdin)
for i,h in enumerate(data[:15],1):
    tags=','.join(h.get('tags',[]))
    print(f\"{i}. {h['title']} | {h.get('score',0)} pts | {tags} | {h.get('url','')}\")
"
```

**Dev.to API（已验证可用）**：
```bash
curl -s --connect-timeout 10 --max-time 30 "https://dev.to/api/articles?per_page=15&top=7" | python3 -c "
import sys,json
data=json.load(sys.stdin)
for i,h in enumerate(data[:15],1):
    print(f\"{i}. {h['title']} | {h.get('positive_reactions_count',0)} reactions | {h.get('url','')}\")
"
```

**Dev.to API（按标签搜索，如 AI/react/vue）**：
```bash
curl -s --connect-timeout 10 --max-time 30 "https://dev.to/api/articles?tag={TAG}&per_page=10&top=7" | python3 -c "
import sys,json
data=json.load(sys.stdin)
for i,h in enumerate(data[:10],1):
    print(f\"{i}. {h['title']} | {h.get('positive_reactions_count',0)} reactions | {h.get('url','')}\")
"
```
> 将 `{TAG}` 替换为标签名，如 `ai`、`react`、`vue`、`typescript`、`python` 等。

**HN Firebase API（Algolia 备用，已验证可用）**：
```bash
curl -s --connect-timeout 10 --max-time 30 "https://hacker-news.firebaseio.com/v0/topstories.json" | python3 -c "
import sys,json,urllib.request
ids=json.load(sys.stdin)[:20]
for i,id in enumerate(ids,1):
    item=json.loads(urllib.request.urlopen(f'https://hacker-news.firebaseio.com/v0/item/{id}.json').read())
    print(f\"{i}. {item.get('title','')} | {item.get('score',0)} pts | {item.get('url','')}\")
"
```
> 当 HN Algolia API 不可用时使用此备用方案。

### Tier 0：RSS / WebFetch（高可靠）

用 WebFetch 抓取 RSS feed 或 HTML 页面。

#### RSS Feeds（WebFetch 提取）

| 信源 | RSS URL | 场景 |
|------|---------|------|
| **HN RSS** | `https://hnrss.org/frontpage?count=20` | 综合、科技、AI编程 |
| **HN Best** | `https://hnrss.org/best?count=15` | 科技 |
| **Techmeme** | `https://www.techmeme.com/feed.xml` | 综合、科技 |
| **TechCrunch** | `https://techcrunch.com/feed/` | 综合、科技 |
| **The Verge** | `https://www.theverge.com/rss/index.xml` | 综合、科技 |
| **Ars Technica** | `https://feeds.arstechnica.com/arstechnica/index` | 科技 |
| **Wired** | `https://www.wired.com/feed/rss` | 科技 |
| **Lobsters** | `https://lobste.rs/rss` | AI编程、前端 |
| **Dev.to** | `https://dev.to/feed` | AI编程、前端 |
| **Reddit r/technology** | `https://www.reddit.com/r/technology/.rss` | 综合、科技 |
| **Reddit r/programming** | `https://www.reddit.com/r/programming/.rss` | AI编程 |
| **Reddit r/MachineLearning** | `https://www.reddit.com/r/MachineLearning/.rss` | AI深度 |
| **Reddit r/LocalLLaMA** | `https://www.reddit.com/r/LocalLLaMA/.rss` | AI深度 |
| **Reddit r/webdev** | `https://www.reddit.com/r/webdev/.rss` | 前端 |
| **Reddit r/reactjs** | `https://www.reddit.com/r/reactjs/.rss` | 前端 |
| **Reddit r/vuejs** | `https://www.reddit.com/r/vuejs/.rss` | 前端 |
| **Reddit r/investing** | `https://www.reddit.com/r/investing/.rss` | 财经 |
| **TLDR Tech** | `https://tldr.tech/api/rss/tech` | AI编程 |
| **TLDR AI** | `https://tldr.tech/api/rss/ai` | AI深度、AI编程 |
| **TLDR Web Dev** | `https://tldr.tech/api/rss/webdev` | 前端 |
| **JS Weekly** | `https://javascriptweekly.com/rss/` | 前端 |
| **Frontend Focus** | `https://frontendfoc.us/rss/` | 前端 |
| **React Status** | `https://react.statuscode.com/rss/` | 前端 |
| **Node Weekly** | `https://nodeweekly.com/rss/` | 前端 |
| **Bytes.dev** | `https://bytes.dev/rss` | 前端 |
| **CSS Weekly** | `https://css-weekly.com/feed/` | 前端 |
| **This Week in Rust** | `https://this-week-in-rust.org/atom.xml` | AI编程 |
| **Golang Weekly** | `https://golangweekly.com/rss/` | AI编程 |

**通用 WebFetch RSS Prompt**: "从此 RSS/Atom feed 提取所有文章条目：标题、简介(如有)、链接URL。中文编号列表输出。"

#### WebFetch HTML（无 RSS 的信源）

| 信源 | URL | 场景 |
|------|-----|------|
| **GitHub Trending** | `https://github.com/trending` | 综合、科技、AI编程 |
| **GitHub Trending (Python)** | `https://github.com/trending/python` | AI编程 |
| **GitHub Trending (TypeScript)** | `https://github.com/trending/typescript` | 前端、AI编程 |
| **GitHub Trending (Rust)** | `https://github.com/trending/rust` | AI编程 |
| **GitHub Trending (Go)** | `https://github.com/trending/go` | AI编程 |
| **Product Hunt** | `https://www.producthunt.com/` | 综合、科技 |
| **HuggingFace Papers** | `https://huggingface.co/papers` | AI深度 |
| **Papers With Code** | `https://paperswithcode.com/latest` | AI深度 |
| **Techmeme HTML** | `https://techmeme.com/` | 综合、科技 |
| **Echo JS** | `https://www.echojs.com/` | 前端 |
| **CSS-Tricks** | `https://css-tricks.com/` | 前端 |
| **Smashing Magazine** | `https://www.smashingmagazine.com/articles/` | 前端 |

### Tier 1：RSSHub 万能代理（中国源的救星）

> RSSHub 可以为几乎所有中国网站生成 RSS。使用公共实例或自建实例。

**公共实例**（按可用性排序尝试）：
1. `https://rsshub.app`
2. `https://rsshub.rssforever.com`
3. `https://rsshub.pseudoyu.com`

| 信源 | RSSHub 路径 | 完整 URL (rsshub.app) | 场景 |
|------|------------|----------------------|------|
| **36氪热榜** | `/36kr/hot-list` | `https://rsshub.app/36kr/hot-list` | 综合、科技 |
| **知乎热榜** | `/zhihu/hot` | `https://rsshub.app/zhihu/hot` | 吃瓜 |
| **微博热搜** | `/weibo/search/hot` | `https://rsshub.app/weibo/search/hot` | 综合、吃瓜 |
| **B站热门** | `/bilibili/ranking/0/3/1` | `https://rsshub.app/bilibili/ranking/0/3/1` | 吃瓜 |
| **抖音热点** | `/douyin/trending` | `https://rsshub.app/douyin/trending` | 吃瓜 |
| **虎嗅** | `/huxiu/article` | `https://rsshub.app/huxiu/article` | 科技 |
| **钛媒体** | `/tmtpost/recommend` | `https://rsshub.app/tmtpost/recommend` | 科技 |
| **V2EX 热门** | `/v2ex/topics/hot` | `https://rsshub.app/v2ex/topics/hot` | AI编程 |
| **InfoQ 中文** | `/infoq/recommend` | `https://rsshub.app/infoq/recommend` | AI编程 |
| **掘金前端** | `/juejin/trending/frontend/1` | `https://rsshub.app/juejin/trending/frontend/1` | 前端 |
| **掘金后端** | `/juejin/trending/backend/1` | `https://rsshub.app/juejin/trending/backend/1` | AI编程 |
| **掘金 AI** | `/juejin/trending/ai/1` | `https://rsshub.app/juejin/trending/ai/1` | AI深度 |

**使用方式**：
```
WebFetch(url="https://rsshub.app/36kr/hot-list", prompt="从此 RSS feed 提取所有条目：标题、链接。中文编号列表输出。")
```
如果 rsshub.app 不可用，依次尝试其他公共实例。

### Tier 2：WebSearch（兜底）

| 信源 | 搜索查询 | 场景 |
|------|---------|------|
| 36氪 | `"36氪 {date} 今日热门"` | 综合、科技 |
| 虎嗅 | `"虎嗅网 {date} 科技"` | 科技 |
| 华尔街见闻 | `"华尔街见闻 {date} 全球金融"` | 综合、财经 |
| 财新网 | `"财新网 {date} 财经"` | 财经 |
| 第一财经 | `"第一财经 {date} 商业"` | 财经 |
| 微博热搜 | `"微博热搜榜 今天"` | 综合、吃瓜 |
| 知乎热榜 | `"知乎热榜 今天"` | 吃瓜 |
| 百度热搜 | `"百度热搜 今天"` | 吃瓜 |
| Latent Space | `"Latent Space AI news {date}"` | AI深度 |
| Ben's Bites | `"Ben's Bites AI {date}"` | AI深度 |
| Vue.js | `"Vue.js news latest {date}"` | 前端 |
| Next.js | `"Next.js blog latest {date}"` | 前端 |

### Tier 3：MCP 工具（最后兜底）

`mcp_hotnews.get_hot_news` / `mcp_HotNews_Server.get_hot_news`：
1=知乎, 2=36氪, 3=百度, 4=B站, 5=微博, 6=抖音, 7=虎扑, 8=豆瓣, 9=IT新闻

---

## 7 大场景配置

### 1. 综合早报

| 优先级 | 信源 | 方式 |
|--------|------|------|
| **Tier S** | HN Algolia API (curl) | Bash |
| **Tier 0** | Techmeme RSS, TechCrunch RSS, Verge RSS | WebFetch RSS |
| **Tier 0** | GitHub Trending, Product Hunt | WebFetch HTML |
| **Tier 1** | 36氪 (RSSHub), 微博热搜 (RSSHub) | WebFetch RSSHub |
| **Tier 2** | 华尔街见闻 | WebSearch |

**板块**：🔥趋势 → ⭐头条 → 🔬科技前沿 → 🚀国内创投 → 💼财经 → 🏠社会热点 → 💡推荐Top3

### 2. 财经早报

| 优先级 | 信源 | 方式 |
|--------|------|------|
| **Tier 0** | Reddit r/investing RSS | WebFetch RSS |
| **Tier 1** | 36氪 (RSSHub) | WebFetch RSSHub |
| **Tier 2** | 华尔街见闻, 财新网, 第一财经 | WebSearch |

**板块**：🔥趋势 → ⭐头条 → 📈市场动态 → 🏢公司新闻 → 💰投资观点 → 🌍国际财经

### 3. 科技早报

| 优先级 | 信源 | 方式 |
|--------|------|------|
| **Tier S** | HN Algolia API (curl) | Bash |
| **Tier 0** | Techmeme RSS, TechCrunch RSS, Verge RSS, Ars RSS, Wired RSS | WebFetch RSS |
| **Tier 0** | GitHub Trending, Product Hunt | WebFetch HTML |
| **Tier 1** | 36氪 (RSSHub) | WebFetch RSSHub |

**板块**：🔥趋势 → ⭐头条 → 🦄硅谷(HN) → 🐱新产品(PH) → 🐙开源(GH) → 🇨🇳国内 → 💡推荐Top3

### 4. AI 深度日报

| 优先级 | 信源 | 方式 |
|--------|------|------|
| **Tier S** | HN Algolia (AI搜索, curl), ArXiv cs.AI (curl), ArXiv cs.LG (curl), ArXiv cs.CL (curl) | Bash |
| **Tier 0** | Reddit r/ML RSS, Reddit r/LocalLLaMA RSS, TLDR AI RSS | WebFetch RSS |
| **Tier 0** | HuggingFace Papers, Papers With Code | WebFetch HTML |
| **Tier 1** | 掘金 AI (RSSHub) | WebFetch RSSHub |
| **Tier 2** | Latent Space, Ben's Bites | WebSearch |

**板块**：🔥趋势 → ⭐头条 → 📝论文精选(ArXiv+HF) → 📰行业动态 → 🛠️开源项目 → 💭深度观点 → 🎯技术趋势 → 💡推荐Top3

### 5. AI & 编程早报

| 优先级 | 信源 | 方式 |
|--------|------|------|
| **Tier S** | HN Algolia API (curl), 少数派 RSS (curl), Lobsters JSON API (curl), Dev.to API (curl) | Bash |
| **Tier S 备用** | HN Firebase API (curl) — Algolia 不可用时 | Bash |
| **Tier 0** | TLDR AI RSS, TLDR Tech RSS | WebFetch RSS |
| **Tier 0** | GitHub Trending, GH(Python), GH(TypeScript), GH(Rust), GH(Go) | WebFetch HTML |
| **Tier 1** | V2EX (RSSHub), 掘金后端 (RSSHub), InfoQ (RSSHub) | WebFetch RSSHub |

**板块**：🔥趋势 → ⭐头条 → 🤖AI动态 → 💻编程热点 → 🐙开源趋势 → 🛠️开发者工具 → 💡推荐Top3

### 6. 前端/开发者日报

| 优先级 | 信源 | 方式 |
|--------|------|------|
| **Tier S** | HN Algolia (React/Vue/CSS/TypeScript 搜索, curl), Lobsters JSON API (curl), Dev.to API (tag:react/vue/css, curl) | Bash |
| **Tier S 备用** | HN Firebase API (curl) — Algolia 不可用时 | Bash |
| **Tier 0** | JS Weekly RSS, Frontend Focus RSS, React Status RSS, Node Weekly RSS, Bytes RSS, CSS Weekly RSS, TLDR WebDev RSS | WebFetch RSS |
| **Tier 0** | Reddit r/reactjs RSS, r/vuejs RSS, r/webdev RSS | WebFetch RSS |
| **Tier 0** | Echo JS, CSS-Tricks, Smashing Magazine, GH Trending(TS) | WebFetch HTML |
| **Tier 1** | 掘金前端 (RSSHub) | WebFetch RSSHub |
| **Tier 2** | Vue.js news, Next.js blog, Tailwind CSS | WebSearch |

**板块**：🔥趋势 → ⭐头条 → ⚛️框架(React/Vue/Svelte) → 🎨CSS&UI → 🔧工具链(Vite/Bun) → 📘TS/Node → 📦组件库 → 📬Newsletter精华 → 💡推荐Top3

### 7. 吃瓜早报

| 优先级 | 信源 | 方式 |
|--------|------|------|
| **Tier 1** | 微博 (RSSHub), 知乎 (RSSHub), B站 (RSSHub), 抖音 (RSSHub) | WebFetch RSSHub |
| **Tier 2** | 微博热搜, 知乎热榜, 百度热搜, 抖音热点 | WebSearch |
| **Tier 3** | MCP hotnews (5,1,3,6,7,8,4) | MCP |

**板块**：🔥热搜Top10 → 🎭娱乐 → 💬知乎热议 → 😂最佳评论 → 💡最值得关注的3个瓜

---

## 工作流程（4 Phase + 3 高级模式）

### Phase 1: Resolve（模式判断）

1. **触发词映射**：
   | 触发词 | 场景 |
   |--------|------|
   | 新闻聚合器、news | → 交互菜单 |
   | 综合早报、今日新闻 | 综合 |
   | 财经早报、股市、金融 | 财经 |
   | 科技早报、tech news、硅谷 | 科技 |
   | AI日报、AI新闻、大模型 | AI深度 |
   | AI编程、coding news、开发者新闻 | AI编程 |
   | 前端日报、React、Vue、CSS | 前端 |
   | 吃瓜、热搜、八卦 | 吃瓜 |

2. **格式选择**：默认详细卡片 / "表格"→紧凑 / "链接"→纯列表

3. **高级模式检测**：
   - "深度模式" → 开启深度阅读
   - "和上次比" / "有什么新的" → 历史对比模式
   - "每天早上9点" → 定时早报模式

### Phase 2: Fetch（五级并行抓取 - 核心！）

**降级链**：Tier S → Tier 0 → Tier 1 → Tier 2 → Tier 3，成功即停。

#### Step 1：Tier S — 并行 Bash curl 命令

**在同一 turn 内并行发起多个 Bash 调用**，直取 JSON/XML API：

```
并行 Bash 调用（所有 Tier S 同时发起）：
1. curl HN Algolia API → python3 解析 → 结构化新闻列表
2. curl ArXiv cs.AI RSS → python3 解析 → 论文列表（AI 场景）
3. curl 少数派 RSS → python3 解析 → 文章列表（AI编程场景）
4. curl Lobsters JSON API → python3 解析 → 编程热点列表
5. curl Dev.to API → python3 解析 → 开发者文章列表
```
> 所有 curl 命令加 `--connect-timeout 10 --max-time 30` 超时参数，避免长时间挂起。

> Bash 获取的数据是**最精确的**，因为 python3 直接解析 JSON/XML，无 AI 幻觉。

#### Step 2：Tier 0 — 并行 WebFetch RSS + HTML

```
并行 WebFetch 调用：
- WebFetch(url="https://www.techmeme.com/feed.xml", prompt="提取所有条目：标题、来源、链接。中文编号列表。")
- WebFetch(url="https://github.com/trending", prompt="提取趋势仓库前15个：全名、描述、语言、今日star。中文编号列表。")
- WebFetch(url="https://www.producthunt.com/", prompt="提取今日产品前10：名称、tagline、票数、链接。中文编号列表。")
```

#### Step 3：Tier 1 — 并行 WebFetch RSSHub（中国源）

```
并行 WebFetch 调用（RSSHub 中国源）：
- WebFetch(url="https://rsshub.app/36kr/hot-list", prompt="提取所有条目：标题、链接。中文编号列表。")
- WebFetch(url="https://rsshub.app/weibo/search/hot", prompt="提取热搜条目：排名、话题、热度。中文编号列表。")
```
> 如果 rsshub.app 不可用，尝试 rsshub.rssforever.com 或 rsshub.pseudoyu.com。

#### Step 4：Tier 2 — 并行 WebSearch

```
并行 WebSearch 调用：
- WebSearch("华尔街见闻 全球金融 2026年3月24日")
- WebSearch("知乎热榜 今天")
```

#### Step 5：Tier 3 — MCP 备选

仅当所有上游 Tier 都失败时。

#### 降级规则
- 返回错误/超时/空内容 → 静默降级
- 有效条目 < 2 → 降级
- **不在输出中提及降级**

#### 降级决策链（v5.1 强化）

每个信源都有明确的多级降级路径，按顺序尝试直至成功：

| 信源 | Tier S 失败时 → | Tier 0 失败时 → | Tier 1 失败时 → | 最终兜底 |
|------|----------------|----------------|----------------|---------|
| **HN** | Algolia → Firebase API | Firebase → hnrss.org RSS | — | WebSearch "Hacker News top today" |
| **Lobsters** | JSON API → | RSS feed (lobste.rs/rss) | — | WebSearch "lobste.rs top this week" |
| **Dev.to** | JSON API → | RSS feed (dev.to/feed) | — | WebSearch "dev.to top articles" |
| **ArXiv** | curl RSS → | — | — | WebSearch "arxiv cs.AI latest papers" |
| **少数派** | curl RSS → | — | — | WebSearch "少数派 sspai 最新" |
| **GitHub** | — | WebFetch HTML | — | WebSearch "GitHub trending today {date}" |
| **Product Hunt** | — | WebFetch HTML | — | WebSearch "Product Hunt top today {date}" |
| **36氪** | — | — | RSSHub 3 实例轮询 | WebSearch "36氪 今日热门 {date}" |
| **微博** | — | — | RSSHub 3 实例轮询 | WebSearch "微博热搜榜 今天" |
| **知乎** | — | — | RSSHub 3 实例轮询 | WebSearch "知乎热榜 今天" |

**RSSHub 轮询逻辑**：rsshub.app → rsshub.rssforever.com → rsshub.pseudoyu.com，第一个成功即停。

**判定失败标准**：
- HTTP 状态非 200
- 返回内容为空或无法解析
- 有效条目 < 2 条
- 响应超过 30 秒（使用 `--connect-timeout 10 --max-time 30`）

### Phase 3: Process（智能处理 + 趋势检测）

#### 3.1 跨源去重
- 核心实体重叠 >= 2 → 同一事件
- 标题相似度 > 60% → 同一事件
- 合并策略：保留最丰富版本，合并来源标注和链接

#### 3.2 跨源趋势检测
- 2+ 不同信源报道 → `🔥 趋势`
- 3+ 不同信源报道 → `🔥🔥 热门趋势`
- 趋势置顶展示

#### 3.3 排序
- 趋势 → 原生指标（points/stars/votes/热度）→ 搜索结果顺序

#### 3.4 深度阅读（Top 3-5 或用户要求时）
1. WebFetch 原文提取全文摘要
2. WebSearch 背景知识
3. WebFetch HN/Reddit 评论页提取 Top 讨论
4. 生成深度分析

#### 3.5 时间验证
- Tier S Bash：API 返回时间戳，精确校验
- Tier 0 RSS：pubDate 校验
- Tier 1 WebFetch：首页实时 = 当天
- Tier 2 WebSearch：检查日期标识
- 不确定 → `⚠️ 时间未确认`

#### 3.6 新鲜度过滤（v5.1 新增）

防止旧内容混入早报：

| 数据源类型 | 默认时间窗口 | 过滤方式 |
|-----------|------------|---------|
| **Tier S API** | 48 小时 | 使用 API 返回的 `created_at`/`pubDate` 时间戳精确过滤 |
| **Tier 0 RSS** | 48 小时 | 使用 RSS `pubDate` 字段过滤 |
| **Tier 0 HTML** | 当天 | GitHub Trending/PH 本身就是实时数据 |
| **Tier 1 RSSHub** | 当天 | 首页数据默认为最新 |
| **Tier 2 WebSearch** | 当天 | 搜索查询中包含日期限定 |

**特殊规则**：
- **周末/节假日**：放宽至 72 小时（周六日可包含周五内容）
- **超过 72 小时**的内容不得出现在早报中，除非用户明确要求
- **Newsletter** (JS Weekly 等)：以最新一期的发布日期为准，一周内有效

### Phase 4: Output

1. 在对话中完整展示 Markdown 早报
2. 保存 `daily_brief_{YYYYMMDD}_{scene}.md` 到当前工作目录
3. 告知文件路径
4. 附带追问提示

**模板参见** `resources/output-template.md`

---

## 高级模式 A：深度阅读

**触发**："深度模式"、"展开第 N 条"

**执行**：WebFetch 原文 → 全文摘要(5-8句) → 关键数据 → 社区讨论 → 深度点评

---

## 高级模式 B：多轮追问

**早报生成后支持**：
- "展开第 N 条" → 深度阅读
- "第 N 条的评论" → WebFetch 评论页
- "搜搜 XXX" → WebSearch 扩展
- "这个项目的 GitHub" → WebFetch README
- "这篇论文的方法" → WebFetch 论文页

---

## 高级模式 C：定时自动早报（v5 新增）

**触发**："每天早上9点给我科技早报"、"定时早报"

**执行**：使用 CronCreate 工具创建定时任务：
```
CronCreate(cron="3 9 * * *", prompt="请执行科技早报场景，生成今日科技早报。", recurring=true)
```

**注意**：
- CronCreate 任务仅在当前 Claude 会话中有效（会话关闭后失效）
- 定时任务最长持续 7 天
- 创建后告知用户会话限制

---

## 高级模式 D：历史对比（v5 新增）

**触发**："和上次比有什么新的"、"今天有什么新变化"

**执行**：
1. 检查当前工作目录是否有之前的 `daily_brief_*.md` 文件
2. 如果有，读取上一份早报
3. 对比新旧两份数据，标记：
   - `🆕` 新出现的新闻/项目
   - `📈` 排名上升的条目
   - `🔄` 持续热门的话题
4. 输出对比报告

---

## 高级模式 E：信源健康监控（v5 新增）

**执行逻辑**：
- 每次抓取时记录每个信源的成功/失败状态
- 在早报末尾附带信源状态摘要（仅当有失败时）：

```markdown
> ⚙️ 信源状态：{success_count}/{total_count} 成功
> ⚠️ 降级信源：{failed_source_1}(→WebSearch), {failed_source_2}(→跳过)
```

---

## 使用方式速查

| 方式 | 示例 |
|------|------|
| 交互菜单 | "新闻聚合器" |
| 场景早报 | "科技早报"、"AI深度日报"、"前端日报" |
| 自定义 | "把 HN 和 GH Trending 揉一起" |
| 格式指定 | "科技早报，表格格式" |
| 深度模式 | "综合早报，深度模式" |
| 追问 | "展开第3条"、"搜搜 React 19" |
| 定时 | "每天早上9点科技早报" |
| 对比 | "和上次比有什么新的" |

### 快捷指令
| 缩写 | 信源 |
|------|------|
| HN | Hacker News |
| GH | GitHub Trending |
| PH | Product Hunt |
| TM | Techmeme |
| HF | HuggingFace Papers |
| PWC | Papers With Code |
| DEV | Dev.to |
| 36氪 | 36Kr |
| 微博 | 微博热搜 |
| SSP | 少数派 |

---

## 智能关键词扩展

| 输入 | 扩展 |
|------|------|
| AI | AI, LLM, GPT, Claude, Agent, RAG, DeepSeek, Gemini, Llama, MCP |
| 大模型 | 大模型, LLM, GPT, Claude, 文心一言, 通义千问, DeepSeek, Kimi, Qwen |
| 前端 | React, Vue, Svelte, Angular, Next.js, Nuxt, CSS, TypeScript, Tailwind, Astro |
| 后端 | Node.js, Go, Rust, Python, Java, Kubernetes, Docker, API, gRPC |
| 开源 | 开源, open source, GitHub, MIT license, Apache |
| 融资 | 融资, funding, IPO, 收购, acquisition, Series A/B/C |
| Rust | Rust, Cargo, WASM, Tokio, Axum |
| 全栈 | Full-stack, Next.js, Nuxt, tRPC, Prisma, Supabase, Drizzle |
| DevOps | CI/CD, Docker, K8s, Terraform, GitHub Actions, ArgoCD |
| 安全 | Security, CVE, vulnerability, 漏洞, zero-day, OWASP |

---

## 重要规则（必须遵守）

1. **Tier S 最优先**：能用 Bash curl 的信源必须先 curl，它是最精确的
2. **极致并行**：同一 turn 内并行发起尽可能多的 Bash/WebFetch/WebSearch 调用
3. **完整展示**：必须在对话中完整展示早报，不要只保存文件
4. **保存文件**：同时保存 .md 文件
5. **中文翻译必填**：所有英文标题/摘要必须提供 `📝 **中文翻译**：{翻译}` 行；中文源内容保持中文原文。翻译要通顺自然，不要机翻味。**禁止任何条目缺少中文翻译**
6. **原链必须**：每条新闻/项目/论文必须附带 `🔗 [链接]({url})`，URL 必须来自抓取的真实数据。**禁止生成无链接条目、禁止编造链接**。如果某条目没有获取到链接则该条目不得出现在最终输出中
7. **多信源验证**：每份早报最终输出必须包含 ≥3 个不同信源的内容。统计行必须列出实际命中的信源名称。如信源不足，必须通过 Tier 2 WebSearch 补充直到达标
8. **真实指标**：不编造评分，用原生指标（points/stars/votes/热度等）
9. **静默降级**：失败时默默降级，用户只看结果
10. **趋势置顶**：多源报道话题必须置顶，趋势必须标注来自哪些信源
11. **支持追问**：保持上下文，支持追问
12. **RSSHub 多实例容错**：rsshub.app 失败时尝试备用实例

---

## Phase 4 质量自检清单（输出前必须逐项确认）

在生成最终早报 Markdown **之前**，必须自检以下项目。任何一项不通过则需补充数据后重新生成：

| # | 检查项 | 达标标准 |
|---|--------|---------|
| ✅1 | **中文翻译覆盖率** | 100% 英文条目有中文翻译行 |
| ✅2 | **原链覆盖率** | 100% 条目有 `🔗 [链接](url)`，且 URL 非空非编造 |
| ✅3 | **信源多样性** | 最终输出涉及 ≥3 个不同信源（综合/科技/AI编程/前端 ≥5 个） |
| ✅4 | **板块完整性** | 头条 ≥3 条，其他板块 ≥2 条（不足则用 Tier 2 补充） |
| ✅5 | **趋势跨源** | 趋势话题标注 ≥2 个不同信源来源 |
| ✅6 | **指标真实性** | 所有 metric 来自 API/RSS 原始数据，无编造 |
| ✅7 | **统计行准确** | `📊 信源：` 行列出所有实际命中的信源名称和数量 |
