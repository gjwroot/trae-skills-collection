"""
Flask Web 应用 - 新闻聚合器
"""
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from flask import Flask, render_template, jsonify, request
from src.storage import Database
from src.processors.classifier import NewsClassifier

app = Flask(
    __name__,
    template_folder=str(Path(__file__).parent / "templates"),
    static_folder=str(Path(__file__).parent / "static"),
)

db = Database()
classifier = NewsClassifier()


@app.route("/")
def index():
    """主页 - 新闻列表"""
    categories = list(classifier.CATEGORIES.keys())
    category_info = {
        cid: classifier.get_category_info(cid)
        for cid in categories
    }
    return render_template(
        "index.html",
        categories=categories,
        category_info=category_info,
    )


@app.route("/api/news")
def api_news():
    """JSON API - 获取新闻列表"""
    category = request.args.get("category", "all")
    min_score = float(request.args.get("min_score", 0))
    limit = int(request.args.get("limit", 200))
    offset = int(request.args.get("offset", 0))
    search = request.args.get("search", "").strip() or None

    articles = db.get_articles(
        category=category,
        min_score=min_score,
        limit=limit,
        offset=offset,
        search=search,
    )

    # 序列化 datetime 对象
    for a in articles:
        if a.get("published_at") and hasattr(a["published_at"], "isoformat"):
            a["published_at"] = a["published_at"].isoformat()

    return jsonify({
        "articles": articles,
        "total": db.get_total_count(),
        "category_counts": db.get_category_counts(),
    })


@app.route("/api/refresh", methods=["POST"])
def api_refresh():
    """触发新闻抓取"""
    import subprocess
    try:
        result = subprocess.Popen(
            [sys.executable, str(project_root / "src" / "main.py")],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        return jsonify({"status": "started", "pid": result.pid})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


def main():
    print("=" * 60)
    print("新闻聚合器 - Flask Web 应用")
    print("=" * 60)
    print("访问地址: http://localhost:8080")
    print("按 Ctrl+C 停止\n")
    app.run(host="0.0.0.0", port=8080, debug=False)


if __name__ == "__main__":
    main()
