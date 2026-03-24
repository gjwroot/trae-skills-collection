# 📰 新闻信源配置详解

## 信源分类与配置

### 🎯 全球科技信源（6个）

| 信源名称 | 搜索关键词 | 优先级 | 说明 |
|---------|-----------|--------|------|
| **Hacker News** | `"Hacker News top stories {date}"` | 1 | 硅谷科技圈热榜，最具影响力的科技新闻源 |
| **Product Hunt** | `"Product Hunt today's top products {date}"` | 2 | 每日新产品发现，创业圈必备 |
| **GitHub Trending** | `"GitHub trending repositories {date}"` | 3 | 开源项目趋势，技术风向标 |
| **TechCrunch** | `"TechCrunch latest news {date}"` | 4 | 科技创业资讯，融资动态 |
| **Wired** | `"Wired technology news {date}"` | 5 | 科技深度报道，长文分析 |
| **V2EX** | `"V2EX 热门话题 {date}"` | 6 | 国内开发者社区，技术讨论 |

---

### 🇨🇳 国内科技信源（6个）

| 信源名称 | 搜索关键词 | 优先级 | 说明 |
|---------|-----------|--------|------|
| **36Kr** | `"36氪 科技新闻 {date}"` | 1 | 中国创投，创业公司动态 |
| **虎嗅** | `"虎嗅网 科技商业 {date}"` | 2 | 科技商业深度分析 |
| **钛媒体** | `"钛媒体 科技新闻 {date}"` | 3 | 科技商业资讯 |
| **腾讯科技** | `"腾讯科技 新闻 {date}"` | 4 | 综合科技新闻 |
| **爱范儿** | `"爱范儿 消费电子 {date}"` | 5 | 消费电子、产品评测 |
| **品玩** | `"品玩 科技文化 {date}"` | 6 | 科技文化、趣闻 |

---

### 💰 金融市场信源（5个）

| 信源名称 | 搜索关键词 | 优先级 | 说明 |
|---------|-----------|--------|------|
| **华尔街见闻** | `"华尔街见闻 全球金融 {date}"` | 1 | 全球金融市场动态 |
| **财新网** | `"财新网 财经新闻 {date}"` | 2 | 财经深度报道 |
| **第一财经** | `"第一财经 商业新闻 {date}"` | 3 | 财经商业资讯 |
| **经济观察报** | `"经济观察报 {date}"` | 4 | 财经观察分析 |
| **21世纪经济报道** | `"21世纪经济报道 {date}"` | 5 | 财经新闻 |

---

### 🔥 社会热点信源（4个）

| 信源名称 | 搜索关键词 | 优先级 | 说明 |
|---------|-----------|--------|------|
| **微博热搜** | `"微博热搜榜 {date}"` | 1 | 热门话题风向标 |
| **知乎热榜** | `"知乎热榜 {date}"` | 2 | 深度热门讨论 |
| **百度热搜** | `"百度热搜榜 {date}"` | 3 | 大众搜索热点 |
| **抖音热点** | `"抖音热点榜 {date}"` | 4 | 短视频热门 |

---

### 🤖 AI 行业内参（5个）

| 信源名称 | 搜索关键词 | 优先级 | 说明 |
|---------|-----------|--------|------|
| **Hugging Face Papers** | `"Hugging Face latest papers {date}"` | 1 | AI 论文发布 |
| **Latent Space AINews** | `"Latent Space AI news {date}"` | 2 | AI 新闻精选 |
| **ChinAI** | `"ChinAI China AI news {date}"` | 3 | 中国 AI 动态 |
| **Ben's Bites** | `"Ben's Bites AI news {date}"` | 4 | AI 每日资讯 |
| **One Useful Thing** | `"One Useful Thing AI {date}"` | 5 | AI 深度洞见 |

---

### 🎙️ 深度思考 & 播客（4个）

| 信源名称 | 搜索关键词 | 优先级 | 说明 |
|---------|-----------|--------|------|
| **Paul Graham** | `"Paul Graham latest essays {date}"` | 1 | 创业教父文章 |
| **Wait But Why** | `"Wait But Why new posts {date}"` | 2 | 深度长文 |
| **Lex Fridman Podcast** | `"Lex Fridman latest episodes {date}"` | 3 | 顶级播客 |
| **Latent Space Podcast** | `"Latent Space podcast {date}"` | 4 | AI 播客 |

---

## 🔍 搜索关键词模板

### 按信源类型

#### 全球科技
```
Hacker News: "Hacker News top stories {date}"
Product Hunt: "Product Hunt today's top products {date}"
GitHub Trending: "GitHub trending repositories {date}"
TechCrunch: "TechCrunch latest news {date}"
Wired: "Wired technology news {date}"
V2EX: "V2EX 热门话题 {date}"
```

#### 国内科技
```
36Kr: "36氪 科技新闻 {date}"
虎嗅: "虎嗅网 科技商业 {date}"
钛媒体: "钛媒体 科技新闻 {date}"
腾讯科技: "腾讯科技 新闻 {date}"
爱范儿: "爱范儿 消费电子 {date}"
品玩: "品玩 科技文化 {date}"
```

#### 金融市场
```
华尔街见闻: "华尔街见闻 全球金融 {date}"
财新网: "财新网 财经新闻 {date}"
第一财经: "第一财经 商业新闻 {date}"
经济观察报: "经济观察报 {date}"
21世纪经济报道: "21世纪经济报道 {date}"
```

#### 社会热点
```
微博热搜: "微博热搜榜 {date}"
知乎热榜: "知乎热榜 {date}"
百度热搜: "百度热搜榜 {date}"
抖音热点: "抖音热点榜 {date}"
```

#### AI 行业
```
Hugging Face Papers: "Hugging Face latest papers {date}"
Latent Space AINews: "Latent Space AI news {date}"
ChinAI: "ChinAI China AI news {date}"
Ben's Bites: "Ben's Bites AI news {date}"
One Useful Thing: "One Useful Thing AI {date}"
```

---

## 📊 场景配置映射

### 🚀 综合早报
```json
{
  "sources": ["hackernews", "producthunt", "36kr", "weibo", "wallstreetcn"],
  "categories": ["all"],
  "items_per_source": 10,
  "ai_score_threshold": 6.0
}
```

### 💰 财经早报
```json
{
  "sources": ["wallstreetcn", "caixin", "yicai", "eeo", "21jingji"],
  "categories": ["finance"],
  "items_per_source": 15,
  "ai_score_threshold": 5.5
}
```

### 🔬 科技早报
```json
{
  "sources": ["hackernews", "producthunt", "github", "36kr", "techcrunch"],
  "categories": ["tech"],
  "items_per_source": 15,
  "ai_score_threshold": 6.0
}
```

### 🤖 AI 深度日报
```json
{
  "sources": ["huggingface", "latentspace", "bensbites", "hackernews_ai"],
  "categories": ["ai"],
  "items_per_source": 10,
  "ai_score_threshold": 7.0,
  "deep_dive": true
}
```

### 🍉 吃瓜早报
```json
{
  "sources": ["weibo", "zhihu", "douyin", "baidu"],
  "categories": ["entertainment", "society"],
  "items_per_source": 20,
  "ai_score_threshold": 4.0
}
```

---

## 🏷️ 新闻分类体系

| 分类 | Emoji | 说明 | 相关信源 |
|------|-------|------|---------|
| **时政要闻** | 📰 | 政治、政策、国际大事 | 新华社、人民网、环球时报 |
| **财经商业** | 💼 | 股市、投资、公司动态 | 华尔街见闻、财新、36Kr |
| **科技前沿** | 🔬 | 技术突破、新产品、开源项目 | Hacker News、Product Hunt、GitHub |
| **体育竞技** | 🏆 | 体育赛事、运动员动态 | - |
| **文化娱乐** | 🎭 | 明星、影视、综艺 | 微博热搜、抖音热点 |
| **国际新闻** | 🌍 | 全球事件、国际关系 | Reuters、BBC、CNN |
| **社会民生** | 🏠 | 社会热点、民生政策 | 微博热搜、知乎热榜 |
| **教育资讯** | 🎓 | 教育政策、学校动态 | - |
| **健康医疗** | 🏥 | 医疗健康、疫情动态 | - |

---

## 💡 信源选择建议

### 按场景推荐

| 场景 | 推荐信源组合 |
|------|-------------|
| **科技从业者** | Hacker News + GitHub Trending + 36Kr |
| **投资人** | Product Hunt + 华尔街见闻 + 财新网 |
| **创业者** | Product Hunt + 36Kr + TechCrunch |
| **AI 研究员** | Hugging Face Papers + Latent Space |
| **想了解热点** | 微博热搜 + 知乎热榜 |
| **综合资讯** | Hacker News + 36Kr + 微博热搜 + 华尔街见闻 |

---

## 🔄 更新日志

- **v2.0** (2026-03-22): 全面升级，参考 GitHub 优秀项目，扩展到 28+ 信源，增加 AI 评分、场景早报等功能
- **v1.0** (2026-03-22): 初始版本，基础新闻搜集功能
