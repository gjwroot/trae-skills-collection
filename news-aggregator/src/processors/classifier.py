"""
新闻分类模块 - 增强版
"""
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


# 信源名称到默认分类的映射（当关键词无法决定时使用）
SOURCE_CATEGORY_MAP = {
    "arXiv CS.AI": "research", "arXiv CS.LG": "research", "arXiv CS.CL": "research",
    "arXiv CS.CV": "research", "arXiv CS.NE": "research", "arXiv stat.ML": "research",
    "MIT Press": "research", "Nature Machine Intelligence": "research",
    "Science Robotics": "research", "IEEE Spectrum AI": "research",
    "Go Blog": "programming", "Rust Blog": "programming", "Python Insider": "programming",
    "JavaScript Weekly": "programming", "Node.js Blog": "programming",
    "React Blog": "programming", "Vue Blog": "programming", "Swift Blog": "programming",
    "Kotlin Blog": "programming", "TypeScript Blog": "programming",
    "CSS Tricks": "programming", "Smashing Magazine": "programming",
    "Martin Fowler": "programming", "InfoQ": "programming",
    "The Pragmatic Engineer": "programming",
    "Reddit Programming": "programming", "Reddit Python": "programming",
    "Reddit JavaScript": "programming", "Lobsters": "programming",
    "Reddit Machine Learning": "tech",
    "Reddit Technology": "tech",
    "Financial Times": "finance", "Bloomberg": "finance",
    "Wall Street Journal": "finance", "MarketWatch": "finance",
    "Yahoo Finance": "finance", "Reuters RSS": "finance", "路透社": "finance",
    "ESPN": "sports", "Bleacher Report": "sports", "BBC Sport": "sports",
    "新浪体育": "sports", "腾讯体育": "sports", "网易体育": "sports",
    "TMZ": "entertainment", "Entertainment Weekly": "entertainment",
    "Variety": "entertainment", "Hollywood Reporter": "entertainment",
    "微博热搜": "society", "知乎热榜": "society", "今日头条": "society",
    "澎湃新闻": "society", "界面新闻": "society", "新浪新闻": "society",
    "Product Hunt": "tech", "Hacker News Best": "tech",
}


class NewsClassifier:
    """新闻分类器"""

    CATEGORIES = {
        "research": {
            "name": "论文与学术",
            "emoji": "📚",
            "keywords": [
                "arxiv", "论文", "研究", "学术", "science", "nature", "neurips",
                "icml", "iclr", "cvpr", "nips", "顶会", "期刊", "实验室",
                "mit", "stanford", "harvard", "oxford", "cambridge",
                "paper", "research", "study", "experiment", "dataset",
                "survey", "benchmark", "evaluation", "peer review",
                "journal", "conference", "proceedings", "thesis",
                "methodology", "hypothesis", "empirical", "theoretical",
                "citation", "preprint", "abstract", "publication",
            ],
        },
        "programming": {
            "name": "编程开发",
            "emoji": "💻",
            "keywords": [
                "编程", "代码", "程序", "开发者", "前端", "后端", "全栈",
                "programming", "coding", "developer", "frontend", "backend",
                "fullstack", "devops", "CI/CD", "git", "github",
                "rust", "golang", "python", "javascript", "typescript",
                "java", "kotlin", "swift", "ruby", "php", "c++", "c#",
                "react", "vue", "angular", "svelte", "next.js", "nuxt",
                "node.js", "deno", "bun", "express", "fastapi", "django",
                "flask", "spring", "rails",
                "compiler", "interpreter", "runtime", "debugger",
                "package", "npm", "pip", "cargo", "gem", "maven",
                "IDE", "vscode", "vim", "neovim", "emacs",
                "refactor", "design pattern", "clean code", "testing",
                "unit test", "integration test", "TDD", "BDD",
                "css", "html", "web", "responsive", "accessibility",
                "api", "rest", "graphql", "grpc", "websocket",
                "database", "sql", "nosql", "redis", "postgresql", "mongodb",
                "docker", "kubernetes", "microservice", "serverless",
                "open source", "opensource", "library", "framework",
            ],
        },
        "politics": {
            "name": "时政要闻",
            "emoji": "📰",
            "keywords": [
                "政府", "政策", "政治", "选举", "外交", "国际", "国家",
                "government", "policy", "politics", "election", "diplomacy",
                "congress", "senate", "parliament", "legislation", "law",
                "president", "prime minister", "summit", "treaty",
                "sanction", "embargo", "referendum", "campaign",
                "democrat", "republican", "liberal", "conservative",
            ],
        },
        "finance": {
            "name": "财经商业",
            "emoji": "💼",
            "keywords": [
                "股市", "股票", "金融", "经济", "投资", "融资", "上市",
                "收购", "银行", "基金", "财经", "财报", "营收", "利润",
                "stock", "market", "finance", "economy", "investment",
                "funding", "IPO", "acquisition", "merger", "bank",
                "fund", "venture capital", "private equity", "hedge fund",
                "revenue", "profit", "earnings", "valuation",
                "cryptocurrency", "bitcoin", "ethereum", "blockchain",
                "forex", "bond", "commodity", "inflation", "interest rate",
                "GDP", "recession", "bull", "bear", "trading",
                "wall street", "nasdaq", "dow jones", "S&P",
                "federal reserve", "central bank", "monetary",
            ],
        },
        "tech": {
            "name": "科技前沿",
            "emoji": "🔬",
            "keywords": [
                "科技", "AI", "人工智能", "算法", "技术", "创新",
                "app", "apple", "iphone", "google", "微软", "亚马逊",
                "tesla", "robot", "机器人", "芯片", "半导体",
                "互联网", "数码", "手机", "电脑", "vr", "ar",
                "元宇宙", "游戏", "cloud", "云", "大数据",
                "machine learning", "deep learning", "neural network",
                "LLM", "gpt", "claude", "gemini", "chatbot",
                "spacex", "nasa", "航天", "太空",
                "technology", "innovation", "startup", "gadget",
                "smartphone", "laptop", "wearable", "IoT",
                "5G", "6G", "quantum", "autonomous", "self-driving",
                "augmented reality", "virtual reality", "metaverse",
                "cybersecurity", "privacy", "encryption",
                "semiconductor", "chip", "processor", "GPU", "TPU",
                "product launch", "tech giant", "silicon valley",
                "artificial intelligence", "generative AI",
                "computer vision", "NLP", "reinforcement learning",
                "agent", "multi-modal", "foundation model",
            ],
        },
        "sports": {
            "name": "体育竞技",
            "emoji": "🏆",
            "keywords": [
                "体育", "足球", "篮球", "比赛", "奥运", "冠军", "联赛",
                "sport", "football", "soccer", "basketball", "baseball",
                "tennis", "golf", "cricket", "rugby", "hockey",
                "olympic", "champion", "league", "tournament", "match",
                "FIFA", "NBA", "NFL", "MLB", "UEFA", "F1",
                "athlete", "coach", "stadium", "score", "victory",
                "playoff", "finals", "world cup", "super bowl",
                "transfer", "signing", "season", "draft",
            ],
        },
        "entertainment": {
            "name": "文化娱乐",
            "emoji": "🎭",
            "keywords": [
                "明星", "电影", "音乐", "综艺", "娱乐", "艺人", "演唱会",
                "movie", "film", "cinema", "actor", "actress", "director",
                "music", "album", "song", "concert", "festival",
                "tv", "show", "series", "streaming", "netflix", "disney",
                "celebrity", "entertainment", "award", "oscar", "grammy",
                "emmy", "golden globe", "box office", "premiere",
                "anime", "manga", "comic", "novel", "book",
                "theater", "broadway", "performance", "art", "gallery",
            ],
        },
        "international": {
            "name": "国际新闻",
            "emoji": "🌍",
            "keywords": [
                "国际", "全球", "世界", "外国", "海外",
                "international", "global", "world", "foreign", "overseas",
                "united nations", "NATO", "EU", "ASEAN",
                "geopolitics", "conflict", "war", "peace", "refugee",
                "climate", "environment", "humanitarian", "aid",
                "trade war", "tariff", "bilateral", "multilateral",
            ],
        },
        "society": {
            "name": "社会民生",
            "emoji": "🏠",
            "keywords": [
                "社会", "民生", "生活", "房价", "教育", "医疗", "交通",
                "society", "community", "housing", "healthcare", "transport",
                "employment", "job", "salary", "welfare", "pension",
                "crime", "safety", "environment", "pollution",
                "immigration", "population", "urban", "rural",
            ],
        },
        "education": {
            "name": "教育资讯",
            "emoji": "🎓",
            "keywords": [
                "教育", "学校", "大学", "考试", "培训", "学习",
                "education", "school", "university", "college", "exam",
                "student", "teacher", "curriculum", "scholarship",
                "online learning", "MOOC", "e-learning", "degree",
                "admission", "graduation", "campus",
            ],
        },
        "health": {
            "name": "健康医疗",
            "emoji": "🏥",
            "keywords": [
                "健康", "医疗", "医院", "疾病", "疫苗", "药品",
                "health", "medical", "hospital", "disease", "vaccine",
                "medicine", "drug", "treatment", "therapy", "surgery",
                "mental health", "nutrition", "fitness", "wellness",
                "pandemic", "epidemic", "clinical trial", "FDA",
                "diagnosis", "symptom", "cancer", "diabetes",
            ],
        },
    }

    def classify(self, news_item: Dict) -> str:
        """对新闻进行分类"""
        title = news_item.get("title", "").lower()
        summary = news_item.get("summary", "").lower()
        text = f"{title} {summary}"

        scores = {}
        for category_id, category_info in self.CATEGORIES.items():
            keywords = category_info["keywords"]
            score = sum(1 for keyword in keywords if keyword.lower() in text)
            scores[category_id] = score

        if scores:
            best_cat, best_score = max(scores.items(), key=lambda x: x[1])
            if best_score > 0:
                return best_cat

        # 当关键词无法决定时，使用信源名称辅助分类
        source = news_item.get("source", "")
        if source in SOURCE_CATEGORY_MAP:
            return SOURCE_CATEGORY_MAP[source]

        return "society"

    def batch_classify(self, news_items: List[Dict]) -> List[Dict]:
        """批量分类"""
        for item in news_items:
            item["category"] = self.classify(item)
        return news_items

    def get_category_info(self, category_id: str) -> Dict:
        """获取分类信息"""
        return self.CATEGORIES.get(category_id, self.CATEGORIES["society"])
