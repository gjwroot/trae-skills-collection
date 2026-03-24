"""
全球新闻聚合器主程序 - 并发抓取版
"""
import argparse
import yaml
import os
import sys
import logging
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

# 添加项目根目录到 Python 路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from src.fetchers import RSSFetcher, HackerNewsFetcher
from src.processors import AIScorer, NewsClassifier, Deduplicator
from src.generators import MarkdownGenerator
from src.storage import Database


def load_config():
    """加载配置文件"""
    config_path = project_root / "config" / "config.yaml"
    sources_path = project_root / "config" / "sources.yaml"

    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    with open(sources_path, "r", encoding="utf-8") as f:
        sources = yaml.safe_load(f)

    return config, sources


def setup_logging(config):
    """统一日志配置"""
    log_config = config.get("logging", {})
    level = getattr(logging, log_config.get("level", "INFO").upper(), logging.INFO)
    fmt = log_config.get("format", "%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    logging.basicConfig(level=level, format=fmt, force=True)


def _fetch_single_source(rss_fetcher, url, name):
    """抓取单个 RSS 源（供线程池调用）"""
    try:
        items = rss_fetcher.fetch(url, name)
        return name, items, None
    except Exception as e:
        return name, [], e


def main():
    parser = argparse.ArgumentParser(description="全球新闻聚合器")
    parser.add_argument(
        "--briefing",
        type=str,
        default="comprehensive",
        choices=["comprehensive", "finance", "tech", "ai", "research", "entertainment"],
        help="早报类型 (默认: comprehensive)",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=None,
        help="AI 评分阈值 (默认从 config.yaml 读取)",
    )
    args = parser.parse_args()

    print("=" * 60)
    print("全球新闻聚合器 Pro")
    print("=" * 60)

    # 加载配置
    config, sources = load_config()
    setup_logging(config)
    logger = logging.getLogger(__name__)

    # 从 config 读取默认阈值
    threshold = args.threshold
    if threshold is None:
        threshold = config.get("ai", {}).get("score_threshold", 3.0)

    print(f"配置加载完成 (评分阈值: {threshold})")

    all_news = []

    # 抓取 RSS 源 - 并发模式
    print("\n正在抓取 RSS 源 (并发模式)...")
    rss_fetcher = RSSFetcher()

    # 定义所有领域分组
    category_groups = [
        "global_tech",
        "china_tech",
        "finance",
        "ai_ml",
        "research_papers",
        "sports_entertainment",
        "social_hot",
        "programming",
        "community",
    ]

    # 收集所有需要抓取的源
    fetch_tasks = []
    for category in category_groups:
        if category in sources:
            for rss_source in sources[category]:
                if rss_source.get("enabled", False):
                    fetch_tasks.append((rss_source["url"], rss_source["name"]))

    success_count = 0
    fail_count = 0

    # 并发抓取
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = {
            executor.submit(_fetch_single_source, rss_fetcher, url, name): name
            for url, name in fetch_tasks
        }

        for future in as_completed(futures):
            name, items, error = future.result()
            if error:
                print(f"   {name}: 失败 ({error})")
                fail_count += 1
            elif items:
                all_news.extend(items)
                print(f"   {name}: {len(items)} 条")
                success_count += 1
            else:
                print(f"   {name}: 无数据")
                fail_count += 1

    print(f"\nRSS 源统计: {success_count} 个成功, {fail_count} 个失败")

    # 抓取 Hacker News
    if sources.get("apis", {}).get("hackernews", {}).get("enabled", False):
        print("\n正在抓取 Hacker News... ", end="", flush=True)
        try:
            hn_fetcher = HackerNewsFetcher()
            hn_limit = sources["apis"]["hackernews"].get("top_stories", 30)
            hn_items = hn_fetcher.fetch_stories(hn_limit)
            if hn_items:
                all_news.extend(hn_items)
                print(f"成功 ({len(hn_items)} 条)")
                success_count += 1
            else:
                print("无数据")
                fail_count += 1
        except Exception as e:
            print(f"失败: {e}")
            fail_count += 1

    if not all_news:
        print("\n未抓取到任何新闻（所有源都失败了）")
        print("建议：检查网络连接，或在 config/sources.yaml 中启用更多信源")
        return

    print(f"\n抓取完成: {len(all_news)} 条新闻")

    # 去重
    print("\n正在去重...")
    deduplicator = Deduplicator()
    unique_news = deduplicator.deduplicate(all_news)
    print(f"   去重后: {len(unique_news)} 条")

    # 分类（先分类再评分，评分可利用分类信息）
    print("\n正在分类...")
    classifier = NewsClassifier()
    classified_news = classifier.batch_classify(unique_news)
    categories = {}
    for item in classified_news:
        cat = item.get("category", "society")
        categories[cat] = categories.get(cat, 0) + 1
    print(f"   分类分布: {categories}")

    # AI 评分
    print("\n正在 AI 评分...")
    scorer = AIScorer()
    scored_news = scorer.batch_score(classified_news, briefing_type=args.briefing)
    avg_score = sum(item.get("ai_score", 0) for item in scored_news) / len(scored_news)
    print(f"   平均评分: {avg_score:.1f}")

    # 保存到 SQLite 数据库
    print("\n正在保存到数据库...")
    db = Database()
    saved = db.save_articles(scored_news)
    print(f"   新增 {saved} 条到数据库")

    # 生成报告
    print(f"\n正在生成 {args.briefing} 早报...")
    output_dir = project_root / config["output"]["output_dir"]
    generator = MarkdownGenerator(str(output_dir))
    report_path = generator.generate(
        scored_news,
        briefing_type=args.briefing,
        score_threshold=threshold,
    )

    print("\n" + "=" * 60)
    print(f"早报生成成功!")
    print(f"文件路径: {report_path}")
    print("=" * 60)

    # 显示 Web 服务器访问地址
    print("\n访问方式:")
    print("   Flask 应用: http://localhost:8080")
    print("\n提示: 启动 Web 服务器请运行:")
    print("   python src/server.py")


if __name__ == "__main__":
    main()
