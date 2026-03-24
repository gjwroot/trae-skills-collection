"""
去重模块 - 支持链接去重 + 标题相似度去重
"""
from typing import Dict, List
import hashlib
import re
import logging

logger = logging.getLogger(__name__)

JACCARD_THRESHOLD = 0.8


def _tokenize(text: str) -> set:
    """将文本分词为 token 集合（支持中英文）"""
    text = text.lower().strip()
    # 英文按空格和标点分词
    tokens = set(re.findall(r'[a-z0-9]+', text))
    # 中文按字符分词（bigram）
    chinese_chars = re.findall(r'[\u4e00-\u9fff]', text)
    for i in range(len(chinese_chars) - 1):
        tokens.add(chinese_chars[i] + chinese_chars[i + 1])
    # 单个中文字也加入
    for ch in chinese_chars:
        tokens.add(ch)
    return tokens


def _jaccard_similarity(set_a: set, set_b: set) -> float:
    """计算两个集合的 Jaccard 相似度"""
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a & set_b)
    union = len(set_a | set_b)
    return intersection / union if union > 0 else 0.0


class Deduplicator:
    """新闻去重器"""

    def deduplicate(self, news_items: List[Dict]) -> List[Dict]:
        """对新闻列表去重：先链接去重，再标题相似度去重"""
        # 阶段1：链接哈希去重
        seen_hashes = set()
        after_hash = []

        for item in news_items:
            item_hash = self._calculate_hash(item)
            if item_hash not in seen_hashes:
                seen_hashes.add(item_hash)
                after_hash.append(item)
            else:
                logger.debug(f"Hash duplicate: {item.get('title', '')}")

        # 阶段2：标题相似度去重
        unique_items = []
        title_tokens_list = []

        for item in after_hash:
            title = item.get("title", "")
            if not title:
                unique_items.append(item)
                title_tokens_list.append(set())
                continue

            tokens = _tokenize(title)
            is_dup = False
            for existing_tokens in title_tokens_list:
                if _jaccard_similarity(tokens, existing_tokens) >= JACCARD_THRESHOLD:
                    is_dup = True
                    logger.debug(f"Title similarity duplicate: {title}")
                    break

            if not is_dup:
                unique_items.append(item)
                title_tokens_list.append(tokens)

        logger.info(
            f"Deduplicated: {len(news_items)} -> {len(after_hash)} (hash) "
            f"-> {len(unique_items)} (similarity)"
        )
        return unique_items

    def _calculate_hash(self, item: Dict) -> str:
        """计算新闻条目的哈希值"""
        if item.get("link"):
            return hashlib.md5(item["link"].encode()).hexdigest()
        if item.get("title"):
            return hashlib.md5(item["title"].encode()).hexdigest()
        text = f"{item.get('title', '')}{item.get('summary', '')}"
        return hashlib.md5(text.encode()).hexdigest()
