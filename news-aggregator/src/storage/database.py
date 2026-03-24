"""
SQLite 缓存存储模块
"""
import sqlite3
import json
import os
import logging
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

project_root = Path(__file__).parent.parent.parent
DB_PATH = project_root / "data" / "news_cache.db"


class Database:
    """SQLite 新闻缓存数据库"""

    def __init__(self, db_path: str = None):
        self.db_path = db_path or str(DB_PATH)
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    def _get_conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        conn = self._get_conn()
        try:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS articles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    link TEXT,
                    source TEXT,
                    summary TEXT,
                    score REAL DEFAULT 0,
                    category TEXT DEFAULT 'society',
                    published_at TEXT,
                    fetched_at TEXT NOT NULL,
                    authors TEXT,
                    tags TEXT,
                    heat TEXT,
                    extra TEXT,
                    UNIQUE(link)
                )
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_articles_score ON articles(score DESC)
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_articles_fetched_at ON articles(fetched_at DESC)
            """)
            conn.commit()
            logger.info(f"Database initialized at {self.db_path}")
        finally:
            conn.close()

    def save_articles(self, articles: List[Dict]) -> int:
        """批量保存文章，跳过已存在的（基于 link 去重）"""
        conn = self._get_conn()
        saved = 0
        try:
            for article in articles:
                try:
                    published_at = article.get("published_at")
                    if isinstance(published_at, datetime):
                        published_at = published_at.isoformat()

                    conn.execute("""
                        INSERT OR IGNORE INTO articles
                        (title, link, source, summary, score, category,
                         published_at, fetched_at, authors, tags, heat, extra)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        article.get("title", ""),
                        article.get("link", ""),
                        article.get("source", ""),
                        article.get("summary", ""),
                        article.get("ai_score", 0),
                        article.get("category", "society"),
                        published_at,
                        datetime.now().isoformat(),
                        json.dumps(article.get("authors", []), ensure_ascii=False),
                        json.dumps(article.get("tags", []), ensure_ascii=False),
                        article.get("heat", "N/A"),
                        json.dumps({
                            k: v for k, v in article.items()
                            if k not in ("title", "link", "source", "summary",
                                         "ai_score", "category", "published_at",
                                         "authors", "tags", "heat")
                        }, ensure_ascii=False, default=str),
                    ))
                    if conn.total_changes:
                        saved += 1
                except sqlite3.IntegrityError:
                    pass
            conn.commit()
            logger.info(f"Saved {saved} new articles to database")
        finally:
            conn.close()
        return saved

    def get_articles(
        self,
        category: Optional[str] = None,
        min_score: float = 0,
        limit: int = 200,
        offset: int = 0,
        search: Optional[str] = None,
    ) -> List[Dict]:
        """查询文章"""
        conn = self._get_conn()
        try:
            query = "SELECT * FROM articles WHERE score >= ?"
            params: list = [min_score]

            if category and category != "all":
                query += " AND category = ?"
                params.append(category)

            if search:
                query += " AND (title LIKE ? OR summary LIKE ?)"
                params.extend([f"%{search}%", f"%{search}%"])

            query += " ORDER BY score DESC, fetched_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            rows = conn.execute(query, params).fetchall()
            return [self._row_to_dict(row) for row in rows]
        finally:
            conn.close()

    def get_category_counts(self) -> Dict[str, int]:
        """获取每个分类的文章数量"""
        conn = self._get_conn()
        try:
            rows = conn.execute(
                "SELECT category, COUNT(*) as cnt FROM articles GROUP BY category"
            ).fetchall()
            return {row["category"]: row["cnt"] for row in rows}
        finally:
            conn.close()

    def get_total_count(self) -> int:
        conn = self._get_conn()
        try:
            row = conn.execute("SELECT COUNT(*) as cnt FROM articles").fetchone()
            return row["cnt"]
        finally:
            conn.close()

    def clear_old(self, hours: int = 72):
        """清理超过指定小时数的旧文章"""
        conn = self._get_conn()
        try:
            conn.execute(
                "DELETE FROM articles WHERE fetched_at < datetime('now', ?)",
                [f"-{hours} hours"],
            )
            conn.commit()
        finally:
            conn.close()

    def _row_to_dict(self, row: sqlite3.Row) -> Dict:
        d = dict(row)
        try:
            d["authors"] = json.loads(d.get("authors") or "[]")
        except (json.JSONDecodeError, TypeError):
            d["authors"] = []
        try:
            d["tags"] = json.loads(d.get("tags") or "[]")
        except (json.JSONDecodeError, TypeError):
            d["tags"] = []
        d["ai_score"] = d.pop("score", 0)
        return d
