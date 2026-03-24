"""
Markdown 报告生成模块
"""
from datetime import datetime
from typing import Dict, List
import os
import logging

from ..processors.classifier import NewsClassifier

logger = logging.getLogger(__name__)


class MarkdownGenerator:
    """Markdown 报告生成器"""

    BRIEFING_TEMPLATES = {
        "comprehensive": {
            "title": "📰 全球新闻早报",
            "categories": ["politics", "finance", "tech", "programming", "sports", "entertainment", "international", "society"],
        },
        "finance": {
            "title": "💼 财经早报",
            "categories": ["finance", "international", "tech"],
        },
        "tech": {
            "title": "🔬 科技早报",
            "categories": ["tech", "programming", "finance"],
        },
        "ai": {
            "title": "🤖 AI 深度日报",
            "categories": ["tech", "research", "programming"],
        },
        "research": {
            "title": "📚 论文与学术早报",
            "categories": ["research", "tech", "education"],
        },
        "entertainment": {
            "title": "🎭 吃瓜早报",
            "categories": ["entertainment", "sports", "society"],
        },
    }

    def __init__(self, output_dir: str = "data/output"):
        self.output_dir = output_dir
        self.classifier = NewsClassifier()
        os.makedirs(output_dir, exist_ok=True)

    def generate(
        self,
        news_items: List[Dict],
        briefing_type: str = "comprehensive",
        score_threshold: float = 6.0,
    ) -> str:
        """
        生成 Markdown 报告

        Args:
            news_items: 新闻列表
            briefing_type: 早报类型
            score_threshold: 分数阈值

        Returns:
            生成的文件路径
        """
        template = self.BRIEFING_TEMPLATES.get(briefing_type, self.BRIEFING_TEMPLATES["comprehensive"])

        # 筛选新闻
        filtered_items = [item for item in news_items if item.get("ai_score", 0) >= score_threshold]

        # 按分类分组
        categorized = self._group_by_category(filtered_items, template["categories"])

        # 生成 Markdown
        markdown = self._render(template, categorized, filtered_items)

        # 保存文件
        filename = f"daily_brief_{datetime.now().strftime('%Y%m%d')}_{briefing_type}.md"
        filepath = os.path.join(self.output_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(markdown)

        logger.info(f"Report generated: {filepath}")
        return filepath

    def _group_by_category(self, items: List[Dict], target_categories: List[str]) -> Dict[str, List[Dict]]:
        """按分类分组"""
        categorized = {}
        for item in items:
            cat = item.get("category", "society")
            if cat in target_categories:
                if cat not in categorized:
                    categorized[cat] = []
                categorized[cat].append(item)

        # 按分数排序
        for cat in categorized:
            categorized[cat].sort(key=lambda x: x.get("ai_score", 0), reverse=True)

        return categorized

    def _render(
        self,
        template: Dict,
        categorized: Dict[str, List[Dict]],
        all_items: List[Dict],
    ) -> str:
        """渲染 Markdown"""
        date_str = datetime.now().strftime("%Y年%m月%d日")
        time_str = datetime.now().strftime("%H:%M:%S")

        lines = []
        lines.append(f"# {template['title']} - {date_str}\n")
        lines.append("---\n")

        # 概览
        lines.append("## 📊 今日概览")
        lines.append(f"- 📅 日期: {date_str}")
        lines.append(f"⏰ 生成时间: {time_str}")
        lines.append(f"📰 新闻总数: {len(all_items)}")
        lines.append(f"⭐ 平均评分: {self._avg_score(all_items):.1f}")
        lines.append("---\n")

        # 头条新闻
        lines.append("## 🔥 头条新闻（AI 评分 Top 20）")
        top_items = sorted(all_items, key=lambda x: x.get("ai_score", 0), reverse=True)[:20]
        for i, item in enumerate(top_items, 1):
            lines.append(self._render_news_item(item, i, show_detail=True))
        lines.append("---\n")

        # 分类新闻 - 显示所有
        for cat_id in template["categories"]:
            if cat_id in categorized:
                cat_info = self.classifier.get_category_info(cat_id)
                lines.append(f"## {cat_info['emoji']} {cat_info['name']} (共 {len(categorized[cat_id])} 条)")
                for item in categorized[cat_id]:
                    lines.append(self._render_news_item(item))
                lines.append("---\n")

        return "\n".join(lines)

    def _render_news_item(self, item: Dict, index: int = None, show_detail: bool = False) -> str:
        """渲染单个新闻条目（统一报告模板）"""
        lines = []

        title = item.get("title", "无标题")
        score = item.get("ai_score", 0)
        source = item.get("source", "")
        link = item.get("link", "")
        heat = item.get("heat", "N/A")
        published_at = item.get("published_at", "")

        # 格式化时间
        time_str = ""
        if published_at:
            try:
                if hasattr(published_at, 'strftime'):
                    time_str = published_at.strftime("%Y-%m-%d")
                else:
                    time_str = str(published_at)[:10]
            except Exception:
                time_str = ""

        if index:
            if link:
                lines.append(f"\n### {index}. [{title}]({link})")
            else:
                lines.append(f"\n### {index}. {title}")
        else:
            if link:
                lines.append(f"\n- **[{title}]({link})**")
            else:
                lines.append(f"\n- **{title}**")

        # Source | Time | Heat
        meta_parts = []
        if source:
            meta_parts.append(f"**Source**: {source}")
        if time_str:
            meta_parts.append(f"**Time**: {time_str}")
        if heat and heat != "N/A":
            meta_parts.append(f"**Heat**: 🔥 {heat}")
        meta_parts.append(f"**Score**: ⭐{score:.1f}")

        if meta_parts:
            lines.append(f"- {' | '.join(meta_parts)}")

        # Summary
        if item.get("summary"):
            summary = item["summary"].strip()
            if len(summary) > 120:
                summary = summary[:120] + "..."
            lines.append(f"- {summary}")

        return "\n".join(lines)

    def _avg_score(self, items: List[Dict]) -> float:
        """计算平均分数"""
        if not items:
            return 0
        scores = [item.get("ai_score", 0) for item in items]
        return sum(scores) / len(scores)
