#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小说质量评估脚本
对《星河归途》进行20维度质量评估
"""

import os
import sys
sys.path.insert(0, '/Users/gengjiawei/Documents/trae_projects/testFront/.trae/skills/novel-auto-writer')

from quality_evaluator import QualityEvaluator

chapters = [
    ('第01章_觉醒·命运的转折.md', 1, '觉醒·命运的转折'),
    ('第02章_重生·这一世我不会再输.md', 2, '重生·这一世我不会再输'),
    ('第03章_车祸？不过是挠痒痒.md', 3, '车祸？不过是挠痒痒'),
    ('第04章_父母·血浓于水.md', 4, '父母·血浓于水'),
    ('第05章_秘密·修仙界的真相.md', 5, '秘密·修仙界的真相'),
    ('第06章_修炼·逆天改命.md', 6, '修炼·逆天改命'),
    ('第07章_聚会·嘲讽与打脸.md', 7, '聚会·嘲讽与打脸'),
    ('第08章_老者·仙盟的暗中布局.md', 8, '老者·仙盟的暗中布局'),
    ('第09章_大选·各路天才云集.md', 9, '大选·各路天才云集'),
    ('第10章_考核·谁才是真正的天才.md', 10, '考核·谁才是真正的天才'),
]

evaluator = QualityEvaluator('番茄小说')

print('=' * 70)
print('《星河归途》小说质量评估报告')
print('=' * 70)
print()
print('【评估范围】第1-10章')
print('【目标平台】番茄小说')
print('【字数要求】每章≥4000字')
print()

results = []
for filename, chapter_num, title in chapters:
    filepath = f'/Users/gengjiawei/Documents/trae_projects/testFront/projects/novel2/chapters/{filename}'
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        lines = content.split('\n')
        text_lines = []
        in_chapter = False
        for line in lines:
            if line.startswith(f'# 第{chapter_num}章'):
                in_chapter = True
                continue
            if line.startswith('*本章完*') or line.startswith('## 质量评估'):
                break
            if in_chapter and line.strip():
                text_lines.append(line)

        text = '\n'.join(text_lines)
        word_count = evaluator.count_words(text)

        result = evaluator.evaluate_chapter(chapter_num, title, text)
        results.append((chapter_num, title, word_count, result.total_score, result.grade, result.passed))

        status = '✓' if result.passed else '✗'
        print(f'{status} 第{chapter_num:2d}章 {title:20s} | 字数:{word_count:5d} | 总分:{result.total_score:.2f} | 等级:{result.grade}')

print()
print('=' * 70)
print('【评估汇总】')
print('=' * 70)

if results:
    total_words = sum(r[2] for r in results)
    avg_score = sum(r[3] for r in results) / len(results)
    pass_count = sum(1 for r in results if r[5])

    print(f'  评估章节数: {len(results)}章')
    print(f'  总字数: {total_words}字')
    print(f'  平均字数: {total_words//len(results)}字/章')
    print(f'  平均总分: {avg_score:.2f}/10')
    print(f'  通过数: {pass_count}/{len(results)}')
    print(f'  通过率: {pass_count/len(results)*100:.1f}%')
print()