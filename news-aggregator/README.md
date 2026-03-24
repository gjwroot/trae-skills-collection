# 🌍 全球新闻聚合器 Pro

一个专业的新闻聚合系统，支持 RSS 订阅、官方 API、智能 AI 评分和杂志级 Markdown 报告生成。

---

## ✨ 功能特点

- 📰 **多源聚合**：支持 RSS 订阅、Hacker News API、Product Hunt API 等
- 🤖 **AI 评分**：0-10 分智能评分，技术深度、新颖性、影响力、可读性
- 📊 **智能分类**：自动分类到时政、财经、科技、体育、娱乐等 9 大分类
- 📝 **Markdown 报告**：生成杂志级排版的早报
- 🔄 **去重合并**：自动跨源去重，合并重复新闻
- 💾 **本地缓存**：支持本地数据缓存，避免重复抓取

---

## 🚀 快速开始

### 安装依赖

```bash
cd news-aggregator
pip install -r requirements.txt
```

### 配置

编辑 `config/config.yaml`，配置你的 RSS 源和 API 密钥。

### 运行

```bash
# 生成综合早报
python src/main.py --briefing comprehensive

# 生成财经早报
python src/main.py --briefing finance

# 生成科技早报
python src/main.py --briefing tech

# 生成 AI 深度日报
python src/main.py --briefing ai

# 生成吃瓜早报
python src/main.py --briefing entertainment
```

---

## 📁 项目结构

```
news-aggregator/
├── src/
│   ├── main.py              # 主程序入口
│   ├── fetchers/            # 新闻抓取模块
│   │   ├── rss_fetcher.py
│   │   ├── hackernews_api.py
│   │   └── producthunt_api.py
│   ├── processors/          # 处理模块
│   │   ├── ai_scorer.py
│   │   ├── classifier.py
│   │   └── deduplicator.py
│   └── generators/          # 生成模块
│       └── markdown_generator.py
├── config/
│   ├── config.yaml          # 主配置文件
│   └── sources.yaml         # 信源配置
├── data/
│   ├── cache/               # 缓存目录
│   └── output/              # 输出目录
├── requirements.txt
└── README.md
```

---

## ⚙️ 配置说明

### config/config.yaml

```yaml
general:
  timezone: "Asia/Shanghai"
  cache_enabled: true
  cache_ttl_hours: 24

ai:
  scoring_enabled: true
  score_threshold: 6.0

output:
  format: "markdown"
  output_dir: "data/output"
```

### config/sources.yaml

```yaml
rss:
  - name: "Reuters"
    url: "https://www.reutersagency.com/feed/?best-topics"
    enabled: true

  - name: "TechCrunch"
    url: "https://techcrunch.com/feed"
    enabled: true

apis:
  hackernews:
    enabled: true
    top_stories: 30

  producthunt:
    enabled: true
    api_key: "your_api_key_here"
```

---

## 📊 新闻分类

- 📰 时政要闻
- 💼 财经商业
- 🔬 科技前沿
- 🏆 体育竞技
- 🎭 文化娱乐
- 🌍 国际新闻
- 🏠 社会民生
- 🎓 教育资讯
- 🏥 健康医疗

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

---

## 📄 许可证

MIT License
