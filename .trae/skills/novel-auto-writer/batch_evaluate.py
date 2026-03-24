#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, '/Users/gengjiawei/Documents/trae_projects/testFront/.trae/skills/novel-auto-writer')

from quality_evaluator import QualityEvaluator
import json
import re

NOVEL_DIR = '/Users/gengjiawei/Documents/trae_projects/testFront/projects/novel2/chapters'

def get_chapter_title(filename):
    match = re.search(r'第(\d+)章_(.+)\.md', filename)
    if match:
        return int(match.group(1)), match.group(2)
    return None, None

def batch_evaluate():
    evaluator = QualityEvaluator(platform="番茄小说")

    files = sorted([f for f in os.listdir(NOVEL_DIR) if f.endswith('.md') and f.startswith('第')])

    results = []
    for filename in files:
        chapter_num, title = get_chapter_title(filename)
        if chapter_num is None:
            continue

        filepath = os.path.join(NOVEL_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        result = evaluator.evaluate_chapter(chapter_num, title, content)

        word_count = evaluator.count_words(content)
        results.append({
            'chapter': chapter_num,
            'title': title,
            'score': result.total_score,
            'grade': result.grade,
            'passed': result.passed,
            'word_count': word_count,
            'platform_compliant': result.platform_compliant,
            'suggestions': result.suggestions[:3] if result.suggestions else []
        })

        status = "✅" if result.passed else "❌"
        print(f"{status} 第{chapter_num:2d}章 {title[:10]:10s} | 总分:{result.total_score:.2f} | {result.grade} | {word_count}字")

    print("\n" + "="*60)
    print("批量评估汇总")
    print("="*60)

    passed_count = sum(1 for r in results if r['passed'])
    total_count = len(results)

    print(f"通过：{passed_count}/{total_count} ({(passed_count/total_count*100):.1f}%)")

    avg_score = sum(r['score'] for r in results) / len(results)
    avg_words = sum(r['word_count'] for r in results) / len(results)

    print(f"平均总分：{avg_score:.2f}")
    print(f"平均字数：{avg_words:.0f}字")

    score_ranges = {'优秀(≥9)': 0, '良好(7-9)': 0, '及格(5-7)': 0, '不及格(<5)': 0}
    for r in results:
        if r['score'] >= 9:
            score_ranges['优秀(≥9)'] += 1
        elif r['score'] >= 7:
            score_ranges['良好(7-9)'] += 1
        elif r['score'] >= 5:
            score_ranges['及格(5-7)'] += 1
        else:
            score_ranges['不及格(<5)'] += 1

    print("\n评分分布：")
    for range_name, count in score_ranges.items():
        pct = count / total_count * 100
        bar = "█" * int(pct/5) + "░" * (20 - int(pct/5))
        print(f"  {range_name:10s} [{bar}] {count}章 ({pct:.1f}%)")

    low_score_chapters = [r for r in results if r['score'] < 7]
    if low_score_chapters:
        print(f"\n⚠️ 低分章节 (<7分)：")
        for r in low_score_chapters[:5]:
            print(f"  第{r['chapter']}章 {r['title']} - {r['score']:.2f}分")

    return results

if __name__ == "__main__":
    batch_evaluate()