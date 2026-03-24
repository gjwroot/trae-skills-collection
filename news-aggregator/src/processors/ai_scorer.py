"""
AI 评分模块 - 多维度加权评分引擎
"""
from typing import Dict, List
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class AIScorer:
    """AI 新闻评分器 - 5 维度评分系统"""

    # 加权关键词：每个关键词有独立权重 0.1-3.0
    WEIGHTED_KEYWORDS = {
        "tech_depth": {
            "开源": 1.5, "GitHub": 1.5, "API": 1.0, "技术": 0.8, "算法": 1.5,
            "架构": 1.5, "框架": 1.2, "代码": 0.8,
            "open source": 1.5, "opensource": 1.5, "AI": 1.2, "agent": 1.5,
            "framework": 1.2, "library": 1.0, "machine learning": 2.0,
            "deep learning": 2.0, "neural network": 2.0, "LLM": 2.5,
            "transformer": 2.0, "GPT": 2.0, "diffusion": 1.8,
            "fine-tune": 1.5, "benchmark": 1.5, "SOTA": 2.0,
            "kubernetes": 1.5, "docker": 1.2, "microservice": 1.3,
            "compiler": 1.5, "runtime": 1.2, "kernel": 1.5,
            "database": 1.0, "distributed": 1.5, "consensus": 1.5,
            "rust": 1.0, "go": 0.8, "python": 0.8, "typescript": 0.8,
            "react": 0.8, "vue": 0.8, "swift": 0.8, "kotlin": 0.8,
        },
        "novelty": {
            "最新": 0.8, "刚刚": 1.0, "今天": 0.5, "今日": 0.5,
            "首发": 1.5, "首次": 1.5, "新突破": 2.0, "突破": 1.5,
            "today": 0.5, "just": 0.5, "new": 0.3, "latest": 0.5,
            "first": 1.0, "breakthrough": 2.0, "novel": 1.5,
            "state-of-the-art": 2.0, "revolutionary": 1.5,
            "breaking": 1.5, "exclusive": 1.2, "unprecedented": 1.5,
        },
        "influence": {
            "融资": 1.5, "上市": 1.5, "收购": 1.5, "亿美元": 2.0,
            "百万": 1.0, "重大": 1.0, "独角兽": 1.5,
            "funding": 1.5, "acquisition": 1.5, "IPO": 2.0,
            "billion": 2.0, "million": 1.0, "major": 0.8,
            "partnership": 1.0, "regulation": 1.2, "antitrust": 1.5,
            "layoff": 1.2, "hire": 0.8, "expansion": 0.8,
            "market share": 1.2, "valuation": 1.5,
        },
        "readability": {
            "教程": 1.5, "指南": 1.5, "入门": 1.0, "实战": 1.5,
            "案例": 1.2, "深度": 1.2, "解读": 1.0,
            "tutorial": 1.5, "guide": 1.5, "how to": 1.2,
            "example": 0.8, "case study": 1.5, "walkthrough": 1.5,
            "analysis": 1.2, "insight": 1.2, "deep dive": 1.5,
            "opinion": 0.8, "review": 1.0, "comparison": 1.2,
            "explained": 1.2, "introduction": 1.0,
        },
    }

    # 信源权威度加权
    SOURCE_AUTHORITY = {
        "Nature Machine Intelligence": 3.0,
        "Science Robotics": 3.0,
        "MIT Technology Review": 2.8,
        "IEEE Spectrum AI": 2.5,
        "arXiv CS.AI": 2.5, "arXiv CS.LG": 2.5, "arXiv CS.CL": 2.5,
        "arXiv CS.CV": 2.5, "arXiv CS.NE": 2.5, "arXiv stat.ML": 2.5,
        "MIT Press": 2.5,
        "TechCrunch": 2.5, "The Verge": 2.3, "Ars Technica": 2.5,
        "WIRED": 2.3,
        "Hacker News": 2.2, "Hacker News RSS": 2.0, "Hacker News Best": 2.2,
        "OpenAI Blog": 2.8, "Anthropic Blog": 2.8, "DeepMind Blog": 2.8,
        "Google AI Blog": 2.8, "Meta AI Blog": 2.5, "NVIDIA Blog": 2.3,
        "Hugging Face Blog": 2.5,
        "Financial Times": 2.5, "Bloomberg": 2.5, "Wall Street Journal": 2.5,
        "Reuters RSS": 2.5, "路透社": 2.5,
        "BBC News": 2.3, "CNN": 2.0,
        "Martin Fowler": 2.5, "The Pragmatic Engineer": 2.3,
        "InfoQ": 2.0, "Smashing Magazine": 2.0,
        "Go Blog": 2.2, "Rust Blog": 2.2, "Python Insider": 2.0,
        "TypeScript Blog": 2.0, "React Blog": 2.0, "Swift Blog": 2.0,
        "Lobsters": 2.0,
        "Reddit Programming": 1.8, "Reddit Technology": 1.8,
        "Reddit Machine Learning": 1.8,
        "GitHub Blog": 2.2, "Stack Overflow Blog": 2.0,
        "Dev.to": 1.5, "FreeCodeCamp": 1.5,
    }

    # 分类偏好加权（针对不同 briefing 类型）
    CATEGORY_PREFERENCE = {
        "tech": {"tech": 0.5, "programming": 0.3},
        "ai": {"tech": 0.5, "research": 0.5},
        "finance": {"finance": 0.5, "international": 0.2},
        "research": {"research": 0.5, "tech": 0.2},
        "entertainment": {"entertainment": 0.5, "sports": 0.3},
    }

    def score(self, news_item: Dict, briefing_type: str = "comprehensive") -> float:
        """对新闻进行 5 维度评分 (0-10)"""
        title = news_item.get("title", "").lower()
        summary = news_item.get("summary", "").lower()
        text = f"{title} {summary}"

        # 维度1：内容质量（关键词深度 + 信源权威）0-3
        content_quality = self._score_content_quality(text, news_item)

        # 维度2：时效性（发布时间 + 新鲜度）0-2
        timeliness = self._score_timeliness(news_item)

        # 维度3：丰富度（标题/摘要/标签/作者完整性）0-2
        richness = self._score_richness(news_item)

        # 维度4：影响力（互动信号 + 高影响关键词）0-2
        influence = self._score_influence(text, news_item)

        # 维度5：加分项（特殊源加分等）0-1
        bonus = self._score_bonus(news_item, briefing_type)

        total = content_quality + timeliness + richness + influence + bonus
        return round(min(max(total, 0), 10), 1)

    def batch_score(self, news_items: List[Dict], briefing_type: str = "comprehensive") -> List[Dict]:
        """批量评分"""
        for item in news_items:
            item["ai_score"] = self.score(item, briefing_type)
        return news_items

    def _score_content_quality(self, text: str, news_item: Dict) -> float:
        """内容质量维度：加权关键词 + 信源权威度，0-3 分"""
        # 加权关键词累计（多个命中叠加，设上限）
        keyword_score = 0.0
        for dimension, keywords in self.WEIGHTED_KEYWORDS.items():
            dim_score = 0.0
            for keyword, weight in keywords.items():
                if keyword.lower() in text:
                    dim_score += weight
            keyword_score += min(dim_score, 2.0)  # 每个维度上限 2.0

        # 归一化到 0-2 范围
        keyword_normalized = min(keyword_score / 4.0, 2.0)

        # 信源权威度 0-1
        source = news_item.get("source", "")
        authority = self.SOURCE_AUTHORITY.get(source, 1.0)
        authority_score = min((authority - 1.0) / 2.0, 1.0)

        return min(keyword_normalized + authority_score, 3.0)

    def _score_timeliness(self, news_item: Dict) -> float:
        """时效性维度：基于发布时间的衰减因子，0-2 分"""
        published_at = news_item.get("published_at")
        if not published_at:
            return 0.8  # 无时间信息给中等分

        if isinstance(published_at, str):
            try:
                published_at = datetime.fromisoformat(published_at)
            except (ValueError, TypeError):
                return 0.8

        now = datetime.now()
        hours_ago = (now - published_at).total_seconds() / 3600

        if hours_ago < 0:
            hours_ago = 0

        if hours_ago <= 6:
            decay = 1.0
        elif hours_ago <= 12:
            decay = 0.95
        elif hours_ago <= 24:
            decay = 0.85
        elif hours_ago <= 48:
            decay = 0.7
        else:
            decay = 0.5

        return round(2.0 * decay, 1)

    def _score_richness(self, news_item: Dict) -> float:
        """丰富度维度：标题/摘要/标签/作者完整性，0-2 分"""
        score = 0.0

        title = news_item.get("title", "")
        if len(title) > 20:
            score += 0.4
        elif len(title) > 10:
            score += 0.2

        summary = news_item.get("summary", "")
        if len(summary) > 200:
            score += 0.6
        elif len(summary) > 50:
            score += 0.4
        elif len(summary) > 0:
            score += 0.2

        tags = news_item.get("tags", [])
        if tags and len(tags) > 0:
            score += 0.3
        if tags and len(tags) > 3:
            score += 0.2

        authors = news_item.get("authors", [])
        if authors and len(authors) > 0:
            score += 0.3

        if news_item.get("link"):
            score += 0.2

        return min(score, 2.0)

    def _score_influence(self, text: str, news_item: Dict) -> float:
        """影响力维度：互动信号 + 高影响关键词，0-2 分"""
        score = 0.0

        # 互动信号
        hn_score = news_item.get("score", 0)
        if isinstance(hn_score, (int, float)):
            if hn_score > 500:
                score += 1.0
            elif hn_score > 300:
                score += 0.8
            elif hn_score > 100:
                score += 0.5
            elif hn_score > 50:
                score += 0.3

        descendants = news_item.get("descendants", 0)
        if isinstance(descendants, (int, float)) and descendants > 100:
            score += 0.3

        heat = news_item.get("heat", "N/A")
        if heat and heat != "N/A":
            try:
                heat_val = int(str(heat).split()[0])
                if heat_val > 500:
                    score += 0.5
                elif heat_val > 100:
                    score += 0.3
            except (ValueError, IndexError):
                pass

        # 高影响关键词
        influence_keywords = self.WEIGHTED_KEYWORDS.get("influence", {})
        influence_kw_score = 0.0
        for keyword, weight in influence_keywords.items():
            if keyword.lower() in text:
                influence_kw_score += weight * 0.3
        score += min(influence_kw_score, 0.8)

        return min(score, 2.0)

    def _score_bonus(self, news_item: Dict, briefing_type: str) -> float:
        """加分项维度：分类偏好 + 特殊来源加分，0-1 分"""
        score = 0.0

        # 分类偏好加权
        category = news_item.get("category", "")
        prefs = self.CATEGORY_PREFERENCE.get(briefing_type, {})
        score += prefs.get(category, 0)

        # 特殊信源额外加分
        source = news_item.get("source", "")
        if source in ("Nature Machine Intelligence", "Science Robotics"):
            score += 0.3
        elif "arXiv" in source:
            score += 0.2

        return min(score, 1.0)
