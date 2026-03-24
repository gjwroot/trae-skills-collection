"""
Hacker News API 抓取模块
"""
import requests
from datetime import datetime
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class HackerNewsFetcher:
    """Hacker News 新闻抓取器"""

    BASE_URL = "https://hacker-news.firebaseio.com/v0"

    def __init__(self, timeout: int = 30):
        self.timeout = timeout
        self.session = requests.Session()

    def get_top_stories(self, limit: int = 30) -> List[int]:
        """获取热门故事 ID 列表"""
        try:
            url = f"{self.BASE_URL}/topstories.json"
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            story_ids = response.json()
            return story_ids[:limit]
        except Exception as e:
            logger.error(f"Error fetching top stories: {e}")
            return []

    def get_item(self, item_id: int) -> Optional[Dict]:
        """获取单个条目详情"""
        try:
            url = f"{self.BASE_URL}/item/{item_id}.json"
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching item {item_id}: {e}")
            return None

    def fetch_stories(self, limit: int = 30) -> List[Dict]:
        """
        获取热门新闻

        Args:
            limit: 获取数量

        Returns:
            新闻列表
        """
        story_ids = self.get_top_stories(limit)
        stories = []

        for story_id in story_ids:
            item = self.get_item(story_id)
            if item and self._is_valid_story(item):
                parsed = self._parse_story(item)
                if parsed:
                    stories.append(parsed)

        logger.info(f"Fetched {len(stories)} stories from Hacker News")
        return stories

    def _is_valid_story(self, item: Dict) -> bool:
        """验证是否为有效故事"""
        return (
            item.get("type") == "story"
            and "title" in item
            and "url" in item
        )

    def _parse_story(self, item: Dict) -> Optional[Dict]:
        """解析故事条目"""
        try:
            # 获取时间
            published_at = None
            if "time" in item:
                published_at = datetime.fromtimestamp(item["time"])

            return {
                "title": item.get("title", ""),
                "summary": "",
                "link": item.get("url", ""),
                "source": "Hacker News",
                "published_at": published_at,
                "score": item.get("score", 0),
                "by": item.get("by", ""),
                "descendants": item.get("descendants", 0),
                "tags": [],
            }
        except Exception as e:
            logger.debug(f"Error parsing story: {e}")
            return None
