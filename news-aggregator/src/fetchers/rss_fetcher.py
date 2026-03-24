"""
RSS 新闻抓取模块
"""
import feedparser
import requests
import re
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


def clean_html(html_text: str) -> str:
    """清理 HTML 标签，只保留纯文本"""
    if not html_text:
        return ""
    # 移除 HTML 标签
    text = re.sub(r"<[^>]+>", "", html_text)
    # 移除多余空白
    text = re.sub(r"\s+", " ", text).strip()
    return text


class RSSFetcher:
    """RSS 新闻抓取器"""

    def __init__(self, timeout: int = 30):
        self.timeout = timeout

    def fetch(self, url: str, name: str = "") -> List[Dict]:
        """
        从 RSS 源抓取新闻

        Args:
            url: RSS 源 URL
            name: 源名称

        Returns:
            新闻列表
        """
        try:
            logger.info(f"Fetching RSS from {url}")
            feed = feedparser.parse(url)

            if feed.bozo:
                logger.warning(f"Feed parsing error: {feed.bozo_exception}")

            news_items = []
            for entry in feed.entries:
                item = self._parse_entry(entry, name)
                if item:
                    news_items.append(item)

            logger.info(f"Fetched {len(news_items)} items from {name or url}")
            return news_items

        except Exception as e:
            logger.error(f"Error fetching RSS {url}: {e}")
            return []

    def _parse_entry(self, entry: Dict, source_name: str) -> Optional[Dict]:
        """
        解析单个 RSS 条目

        Args:
            entry: RSS 条目
            source_name: 源名称

        Returns:
            解析后的新闻条目
        """
        try:
            # 获取发布时间
            published_at = self._get_published_time(entry)

            # 只保留最近 48 小时的新闻
            if published_at:
                cutoff = datetime.now() - timedelta(hours=48)
                if published_at < cutoff:
                    return None

            item = {
                "title": clean_html(entry.get("title", "")),
                "summary": clean_html(entry.get("summary", "")),
                "link": entry.get("link", ""),
                "source": source_name,
                "published_at": published_at,
                "authors": self._get_authors(entry),
                "tags": self._get_tags(entry),
                "heat": self._get_heat(entry, source_name),
            }
            return item

        except Exception as e:
            logger.debug(f"Error parsing entry: {e}")
            return None

    def _get_published_time(self, entry: Dict) -> Optional[datetime]:
        """获取发布时间"""
        time_fields = ["published_parsed", "updated_parsed", "created_parsed"]

        for field in time_fields:
            if field in entry and entry[field]:
                try:
                    return datetime(*entry[field][:6])
                except Exception:
                    continue

        return None

    def _get_authors(self, entry: Dict) -> List[str]:
        """获取作者列表"""
        authors = []
        if "author" in entry:
            authors.append(entry["author"])
        if "authors" in entry:
            for author in entry["authors"]:
                if "name" in author:
                    authors.append(author["name"])
        return list(set(authors))

    def _get_tags(self, entry: Dict) -> List[str]:
        """获取标签列表"""
        tags = []
        if "tags" in entry:
            for tag in entry["tags"]:
                if "term" in tag:
                    tags.append(tag["term"])
        return tags

    def _get_heat(self, entry: Dict, source_name: str) -> Optional[str]:
        """获取热度值（根据信源不同）"""
        try:
            # 尝试从不同字段获取热度
            heat_fields = [
                "heat", "score", "votes", "points", "stars",
                "views", "comments", "shares"
            ]

            for field in heat_fields:
                if field in entry and entry[field]:
                    return str(entry[field])

            # 根据信源特殊处理
            if source_name.lower() == "hacker news":
                if "score" in entry:
                    return f"{entry['score']} points"

            # 默认用 AI 评分作为热度
            return "N/A"

        except Exception:
            return "N/A"
