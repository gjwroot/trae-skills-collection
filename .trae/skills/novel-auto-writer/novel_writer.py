#!/usr/bin/env python3
"""
小说自动化写作脚本 v4.5 - 创新驱动版
目录清晰：一章一文件，动态读取配置
强调创新性、新鲜感、潮流感，融入新梗热梗
"""

import os
import sys
import json
import re
from datetime import datetime
from pathlib import Path

SKILL_DIR = Path(__file__).parent
sys.path.insert(0, str(SKILL_DIR))

from quality_evaluator import QualityEvaluator, PLATFORM_CONFIGS

PLATFORM_LIST = list(PLATFORM_CONFIGS.keys())
PROMPT_FILE = ".current_prompt.txt"


def get_project_dirs(project_dir):
    """根据项目根目录计算各子目录"""
    project_dir = Path(project_dir)
    return {
        'project': project_dir,
        'outline': project_dir / "outline",
        'config': project_dir / "config",
        'chapters': project_dir / "chapters",
        'outline_file': project_dir / "outline" / "outline.md",
        'chapters_list_file': project_dir / "outline" / "chapters.md",
        'state_file': project_dir / "config" / ".novel_state.json",
        'prompt_file': project_dir / PROMPT_FILE,
    }


class NovelState:
    def __init__(self, project_dir):
        self.dirs = get_project_dirs(project_dir)
        self.project_dir = self.dirs['project']
        self.outline_dir = self.dirs['outline']
        self.outline_file = self.dirs['outline_file']
        self.chapters_list_file = self.dirs['chapters_list_file']
        self.config_dir = self.dirs['config']
        self.state_file = self.dirs['state_file']
        self.chapters_dir = self.dirs['chapters']
        self.prompt_file = self.dirs['prompt_file']
        self.current_chapter = 0
        self.total_chapters = 0
        self.chapters = {}
        self.completed_chapters = []
        self.evaluations = {}
        self.platform = "番茄小说"
        self.title = "未命名小说"
        self.load()

    def ensure_dirs(self):
        self.project_dir.mkdir(parents=True, exist_ok=True)
        self.outline_dir.mkdir(exist_ok=True)
        self.config_dir.mkdir(exist_ok=True)
        self.chapters_dir.mkdir(exist_ok=True)

    def load(self):
        if self.state_file.exists():
            with open(self.state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.current_chapter = data.get('current_chapter', 0)
                self.completed_chapters = data.get('completed_chapters', [])
                self.evaluations = data.get('evaluations', {})
                self.platform = data.get('platform', '番茄小说')
                self.total_chapters = data.get('total_chapters', 0)
                self.title = data.get('title', '未命名小说')

        self.load_chapters_list()

    def load_chapters_list(self):
        if self.chapters_list_file.exists():
            with open(self.chapters_list_file, 'r', encoding='utf-8') as f:
                content = f.read()
            self.chapters = self.parse_chapters_from_md(content)
            self.total_chapters = len(self.chapters)

    def parse_chapters_from_md(self, md_content):
        """从Markdown解析章节列表"""
        chapters = {}
        lines = md_content.split('\n')
        for line in lines:
            match = re.match(r'^##?\s*第(\d+)章\s+(.+)$', line.strip())
            if match:
                num = match.group(1)
                title = match.group(2).strip()
                chapters[num] = title
        return chapters

    def save(self):
        self.ensure_dirs()
        data = {
            'current_chapter': self.current_chapter,
            'completed_chapters': self.completed_chapters,
            'evaluations': self.evaluations,
            'platform': self.platform,
            'total_chapters': self.total_chapters,
            'title': self.title,
            'updated_at': datetime.now().isoformat()
        }
        with open(self.state_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def save_chapters_list(self):
        with open(self.chapters_list_file, 'w', encoding='utf-8') as f:
            f.write("# 章节清单\n\n")
            for num, title in sorted(self.chapters.items(), key=lambda x: int(x[0])):
                f.write(f"## 第{num}章 {title}\n")

    def mark_completed(self, chapter_num, score=None):
        if chapter_num not in self.completed_chapters:
            self.completed_chapters.append(chapter_num)
        self.current_chapter = max(self.current_chapter, chapter_num)
        if score is not None:
            self.evaluations[str(chapter_num)] = score
        self.save()

    def set_platform(self, platform):
        if platform in PLATFORM_LIST:
            self.platform = platform
            self.save()
            return True
        return False

    def get_progress(self):
        completed = len(self.completed_chapters)
        total = self.total_chapters
        percent = int(completed / total * 100) if total > 0 else 0
        return completed, total, percent

    def get_chapter_title(self, chapter_num):
        return self.chapters.get(str(chapter_num), f"第{chapter_num}章")

    def get_chapter_file(self, chapter_num):
        title = self.get_chapter_title(chapter_num)
        safe_title = title.replace('/', '_').replace('\\', '_').replace(':', '_')
        filename = f"第{chapter_num:02d}章_{safe_title}.md"
        return self.chapters_dir / filename


def generate_prompt(state, chapter_num):
    title = state.get_chapter_title(chapter_num)
    config = PLATFORM_CONFIGS.get(state.platform, PLATFORM_CONFIGS.get("番茄小说", {}))
    target_words = config.get('target_chapter_words', 4000)
    min_words = config.get('min_chapter_words', 3000)
    ai_flavor_words = config.get('ai_flavor_words', ['突然', '然而', '没想到', '竟然'])

    prev_chapter_info = ""
    if chapter_num > 1:
        prev_title = state.get_chapter_title(chapter_num - 1)
        prev_eval = state.evaluations.get(str(chapter_num - 1), {})
        suggestions = prev_eval.get('suggestions', [])
        prev_chapter_info = f"""
【前情提要】
上一章: {prev_title}
质量建议: {'; '.join(suggestions[:3]) if suggestions else '无'}
特别注意: 上章若有"太典了"、"套路旧"、"梗不足"等评价，本章必须改进
"""

    outline_content = ""
    if state.outline_file.exists():
        with open(state.outline_file, 'r', encoding='utf-8') as f:
            outline_content = f.read()

    prompt = f"""
【小说创作任务 - 创新驱动版】

小说标题: {state.title}
目标平台: {state.platform}
章节标题: {title}
章节序号: 第{chapter_num}章 / 共{state.total_chapters}章

【硬性指标 - 必须达标】
目标字数: {target_words}字+
最低字数: {min_words}字+
允许浮动: ±500字
⚠️ 字数不达标直接扣分，别整水文！

【创新三维度 - 核心考核】
1. 梗含量(8%): 必须融入新梗热梗
   - 必用梗: 绝绝子、YYDS、emo、躺平、摆烂、内卷、社死、破防、打脸、真香、上头、下头、芜湖、凡尔赛、显眼包、整活、小丑、笑死、离谱、急急急、家人们谁懂啊、完蛋、栓Q
   - 弹幕风格: 可以用【弹幕: xxx】或(括号吐槽)
   
2. 潮流热度(6%): 必须有当前热门元素组合
   - 推荐组合: 重生+系统、穿书+病娇、霸总+甜宠、星际+异能、直播+带货、年代文+空间
   - 元素库: 系统、金手指、马甲、团宠、病娇、疯批、修罗场、火葬场、打脸、爽文、反套路
   
3. 新鲜感(6%): 必须有反套路设计
   - 反套路公式: 本以为...却、谁知...偏偏、打脸...来的、真香定律、反转再反转
   - 破防式吐槽: 完了完了、完蛋、我人没了、我傻了、这谁顶得住

【评估标准 v4.5 (20维度)】
- 梗含量(8%): 新梗热梗密度，弹幕/括号吐槽风格
- 潮流热度(6%): 热门元素组合数量
- 新鲜感(6%): 反套路设计，反转密度
- 剧情吸引力(10%): 悬念+冲突+节奏
- 幽默风趣度(5%): 幽默元素密度
- 有趣度(4%): 意想不到的幽默手法
- 剧情紧凑度(5%): 信息密度高，节奏快
- 信息量密度(4%): 小概率事件密度
- 剧情反转(5%): 身份反转、局势突变
- AI味道(3%): 越低越好

【写作红线 - 绝对禁止】
1. 不用AI词汇: {', '.join(ai_flavor_words)}（扣分项）
2. 不写老套剧情: 上来就退婚、窝囊废被欺、千年老套开场
3. 不走老套路: 无脑升级、种马后宫、无脑甜宠
4. 不能太正经: 整章正儿八经没有梗，直接不及格

【写作要求】
1. 每章必须{target_words}字+，节奏紧凑，信息密度高
2. 融入5个以上新梗/热梗
3. 至少1个热门元素组合（重生+系统、穿书+病娇等）
4. 必须有反套路设计（打脸、真香、反转）
5. 对话要生动有趣，带梗带吐槽
6. 结尾留悬念，吸引继续阅读

【加分项】
- 网红金句: "家人们谁懂啊"、"急急急"、"笑死"、"完蛋"、"我真的会谢"
- 多重反转: 反转再反转设计
- 破防式吐槽: "我人没了"、"我傻了"、"这谁顶得住"
- 弹幕风格: 【弹幕: 哈哈哈】或(括号吐槽)

{prev_chapter_info}

请开始创作，必须体现创新性、新鲜感、潮流感！
"""
    return prompt


def cmd_status(state):
    completed, total, percent = state.get_progress()
    print("=" * 50)
    print("小说自动化写作状态")
    print("=" * 50)
    print(f"  小说标题: {state.title}")
    print(f"  目标平台: {state.platform}")
    print(f"  项目目录: {state.project_dir}")
    print(f"  大纲目录: {state.outline_dir}")
    print(f"  配置目录: {state.config_dir}")
    print(f"  章节目录: {state.chapters_dir}")
    print(f"  总章节数: {total}")
    print(f"  已完成: {completed}/{total} ({percent}%)")
    print(f"  当前进度: 第{state.current_chapter}章")

    if state.completed_chapters:
        print(f"\n已完成章节: {', '.join(str(c) for c in sorted(state.completed_chapters))}")

    if state.evaluations:
        passed = sum(1 for e in state.evaluations.values() if e.get('passed'))
        print(f"\n评分统计: {passed}/{len(state.evaluations)} 章节达标")

    print("=" * 50)


def cmd_list(state):
    if state.total_chapters == 0:
        print("[提示] 请先初始化项目: init --chapters-list <文件路径>")
        return

    print("=" * 50)
    print(f"章节列表 [平台: {state.platform}]")
    print("=" * 50)

    for i in range(1, state.total_chapters + 1):
        title = state.get_chapter_title(i)
        status = "✓" if i in state.completed_chapters else "○"
        eval_info = ""
        if str(i) in state.evaluations:
            score = state.evaluations[str(i)].get('total_score', 0)
            passed = state.evaluations[str(i)].get('passed', False)
            eval_info = f" [{score:.1f}分 {'✓' if passed else '✗'}]"
        print(f"  {status} 第{i:2d}章：{title}{eval_info}")
    print("=" * 50)


def parse_init_args(param_str):
    title = None
    author = None
    total = None
    chapters_list = None

    if not param_str:
        return title, author, total, chapters_list

    parts = param_str.split()
    i = 0
    while i < len(parts):
        p = parts[i]
        if p in ['--title', '-t'] and i+1 < len(parts):
            title = parts[i+1]
            i += 2
        elif p in ['--chapters-list', '-j'] and i+1 < len(parts):
            chapters_list = parts[i+1]
            i += 2
        elif p in ['--author', '-a'] and i+1 < len(parts):
            author = parts[i+1]
            i += 2
        else:
            i += 1
    return title, author, total, chapters_list


def cmd_init(state, title=None, author=None, chapters_list_path=None):
    state.ensure_dirs()

    title = title or "未命名小说"

    if chapters_list_path and Path(chapters_list_path).exists():
        with open(chapters_list_path, 'r', encoding='utf-8') as f:
            chapters_md = f.read()
        state.chapters = state.parse_chapters_from_md(chapters_md)
        state.total_chapters = len(state.chapters)
        if state.chapters:
            first_title = list(state.chapters.values())[0]
            if '《' in first_title or 'title' not in title.lower():
                pass
        with open(state.chapters_list_file, 'w', encoding='utf-8') as f:
            f.write("# 章节清单\n\n")
            for num, ch_title in sorted(state.chapters.items(), key=lambda x: int(x[0])):
                f.write(f"## 第{num}章 {ch_title}\n")
    else:
        state.title = title
        state.total_chapters = 0
        state.chapters = {}
        print("[提示] 未指定章节清单，请手动创建: outline/chapters.md")

    outline_content = f"""# {state.title}

## 小说作品

**作者**: {author or "AI Assistant"}
**创建时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**总章节数**: {state.total_chapters}
**目标平台**: {state.platform}

---

## 故事大纲

（待填充）

---

## 角色设定

（待填充）

---

## 世界观

（待填充）
"""
    with open(state.outline_file, 'w', encoding='utf-8') as f:
        f.write(outline_content)

    state.current_chapter = 0
    state.completed_chapters = []
    state.evaluations = {}
    state.save()

    print(f"✓ 初始化完成")
    print(f"  小说标题: {state.title}")
    print(f"  总章节数: {state.total_chapters}")
    print(f"  目标平台: {state.platform}")
    print(f"  项目目录: {state.project_dir}")
    print(f"  大纲目录: {state.outline_dir}")
    print(f"  配置目录: {state.config_dir}")
    print(f"  章节目录: {state.chapters_dir}")


def cmd_genprompt(state, chapter_num):
    if state.total_chapters == 0:
        print("[提示] 请先初始化项目")
        return False

    if chapter_num < 1 or chapter_num > state.total_chapters:
        print(f"错误: 章节号应在1-{state.total_chapters}之间")
        return False

    title = state.get_chapter_title(chapter_num)
    prompt = generate_prompt(state, chapter_num)

    with open(state.prompt_file, 'w', encoding='utf-8') as f:
        f.write(prompt)

    print(f"【第{chapter_num}章】{title}")
    print("=" * 50)
    print(prompt)
    print("=" * 50)
    print(f"\n[提示] 请根据以上要求创作章节内容")
    print(f"[提示] 完成后将内容写入: {state.get_chapter_file(chapter_num)}")

    return True


def cmd_write(state, chapter_num, content):
    if state.total_chapters == 0:
        print("[提示] 请先初始化项目")
        return False

    if chapter_num < 1 or chapter_num > state.total_chapters:
        print(f"错误: 章节号应在1-{state.total_chapters}之间")
        return False

    title = state.get_chapter_title(chapter_num)
    chapter_file = state.get_chapter_file(chapter_num)

    chapter_content = f"""# 第{chapter_num}章 {title}

{content}

---

*本章完*
"""
    with open(chapter_file, 'w', encoding='utf-8') as f:
        f.write(chapter_content)

    print(f"✓ 第{chapter_num}章内容已写入: {chapter_file}")
    return True


def cmd_read(state, chapter_num):
    if state.total_chapters == 0:
        print("[提示] 请先初始化项目")
        return None

    if chapter_num < 1 or chapter_num > state.total_chapters:
        print(f"错误: 章节号应在1-{state.total_chapters}之间")
        return None

    chapter_file = state.get_chapter_file(chapter_num)
    if not chapter_file.exists():
        print(f"[提示] 第{chapter_num}章文件不存在")
        return None

    with open(chapter_file, 'r', encoding='utf-8') as f:
        return f.read()


def cmd_evaluate(state, chapter_num):
    if state.total_chapters == 0:
        print("[提示] 请先初始化项目")
        return False

    chapter_file = state.get_chapter_file(chapter_num)
    if not chapter_file.exists():
        print(f"错误: 第{chapter_num}章文件不存在，请先执行 write")
        return False

    with open(chapter_file, 'r', encoding='utf-8') as f:
        content = f.read()

    title = state.get_chapter_title(chapter_num)

    lines = content.split('\n')
    正文_lines = []
    in_chapter = False
    skip_title = True
    for line in lines:
        if line.startswith('# 第'):
            in_chapter = True
            skip_title = True
            continue
        if in_chapter:
            if skip_title:
                skip_title = False
                continue
            if line.startswith('*本章完'):
                break
            正文_lines.append(line)

    chapter_text = '\n'.join(正文_lines).strip()

    if not chapter_text or len(chapter_text) < 100:
        print(f"[提示] 第{chapter_num}章内容为空或过短")
        return False

    evaluator = QualityEvaluator(state.platform)
    result = evaluator.evaluate_chapter(chapter_num, title, chapter_text)

    state.evaluations[str(chapter_num)] = {
        'total_score': result.total_score,
        'grade': result.grade,
        'passed': result.passed,
        'scores': result.scores,
        'suggestions': result.suggestions,
        'platform': state.platform
    }
    state.save()

    print(evaluator.generate_report(result))

    if result.passed:
        print(f"\n✓ 第{chapter_num}章达标!")
        state.mark_completed(chapter_num, result.total_score)
    else:
        print(f"\n✗ 第{chapter_num}章未达标，建议修改")

    return result.passed


def cmd_auto(state, start_chapter=None, max_iterations=None):
    if state.total_chapters == 0:
        print("[提示] 请先初始化项目: init --chapters-list <文件>")
        return False

    if start_chapter is None:
        start_chapter = state.current_chapter + 1
        if start_chapter == 1 and state.current_chapter == 0:
            start_chapter = 1

    if start_chapter > state.total_chapters:
        print("所有章节已完成!")
        return True

    print("=" * 60)
    print("小说自动化写作 v4.3 - Trae集成版")
    print("=" * 60)
    print(f"起始章节: 第{start_chapter}章")
    print(f"总章节数: {state.total_chapters}")
    print(f"目标平台: {state.platform}")
    print(f"评估标准: v4.0 (17维度)")
    print("=" * 60)

    iteration = 0

    for chapter_num in range(start_chapter, state.total_chapters + 1):
        if max_iterations and iteration >= max_iterations:
            print(f"\n达到最大迭代次数 {max_iterations}，暂停")
            break

        iteration += 1
        title = state.get_chapter_title(chapter_num)
        chapter_file = state.get_chapter_file(chapter_num)

        print(f"\n{'='*60}")
        print(f"【第{chapter_num}章】{title}")
        print(f"{'='*60}")

        if chapter_file.exists():
            print(f"[跳过] 章节文件已存在: {chapter_file.name}")
        else:
            print(f"[待写] 章节文件不存在")

        prompt = generate_prompt(state, chapter_num)
        with open(state.prompt_file, 'w', encoding='utf-8') as f:
            f.write(prompt)

        print(f"\n!!! 需要AI生成内容 !!!")
        print(f"\n请在Trae中执行以下操作:")
        print(f"  1. 读取 .current_prompt.txt 获取创作要求")
        print(f"  2. 根据要求创作第{chapter_num}章内容")
        print(f"  3. 执行: python3 novel_writer.py write {chapter_num} \"<内容>\"")
        print(f"  4. 执行: python3 novel_writer.py evaluate {chapter_num}")
        print()
        print(f"[提示] 也可以直接说: '帮我写第{chapter_num}章'")

        state.current_chapter = chapter_num
        state.save()

        print(f"\n[进度] {chapter_num}/{state.total_chapters}")

    print(f"\n{'='*60}")
    print(f"[完成] 已处理 {iteration} 个章节")
    print(f"[文件] 提示已保存到: {state.prompt_file}")
    print("=" * 60)

    return True


def main():
    if len(sys.argv) < 2:
        print("小说自动化写作脚本 v4.5 - 创新驱动版")
        print("目录结构：")
        print("  outline/           - 大纲目录")
        print("    outline.md       - 大纲文件")
        print("    chapters.md     - 章节清单")
        print("  config/           - 配置目录")
        print("  chapters/         - 章节目录")
        print()
        print("用法:")
        print("  init --chapters-list <文件>  - 初始化项目（必需）")
        print("  status                           - 查看状态")
        print("  list                             - 章节列表")
        print("  genprompt <章节号>             - 生成创作提示")
        print("  write <章节号> <内容>          - 写入章节")
        print("  read <章节号>                  - 读取章节")
        print("  evaluate <章节号>               - 评估章节")
        print("  auto [起始章] [最大迭代]      - 自动流程")
        print("  platform [set <平台名>]        - 平台设置")
        print()
        print("示例:")
        print("  NOVEL_PROJECT_DIR=/path/to/novel python3 novel_writer.py init --chapters-list outline/chapters.md")
        print("  NOVEL_PROJECT_DIR=/path/to/novel python3 novel_writer.py auto 1 10")
        print()
        print("注意: 项目目录通过环境变量 NOVEL_PROJECT_DIR 设置")
        return

    command = sys.argv[1]
    param = sys.argv[2:] if len(sys.argv) > 2 else []
    param_str = ' '.join(param)

    project_dir = os.environ.get('NOVEL_PROJECT_DIR', None)
    if not project_dir:
        print("错误: 请设置环境变量 NOVEL_PROJECT_DIR 指定项目目录")
        print("示例: NOVEL_PROJECT_DIR=/path/to/novel python3 novel_writer.py init ...")
        return

    state = NovelState(project_dir)

    if command == 'status':
        cmd_status(state)
    elif command == 'list':
        cmd_list(state)
    elif command == 'init':
        title, author, total, chapters_list = parse_init_args(param_str)
        cmd_init(state, title, author, chapters_list)
    elif command == 'genprompt':
        if not param_str or not param_str.strip().isdigit():
            print("请指定章节号: genprompt <1-N>")
            return
        cmd_genprompt(state, int(param_str))
    elif command == 'write':
        if not param_str:
            print("请指定章节号: write <1-N> <内容>")
            return
        parts = param_str.split(' ', 1)
        if len(parts) < 2:
            print("请提供内容: write <章节号> <内容>")
            return
        cmd_write(state, int(parts[0]), parts[1])
    elif command == 'read':
        if not param_str or not param_str.strip().isdigit():
            print("请指定章节号: read <1-N>")
            return
        cmd_read(state, int(param_str))
    elif command == 'evaluate':
        if not param_str or not param_str.strip().isdigit():
            print("请指定章节号: evaluate <1-N>")
            return
        cmd_evaluate(state, int(param_str))
    elif command == 'platform':
        if not param_str:
            print("支持的平台:", ', '.join(PLATFORM_LIST))
            print("用法: platform set <平台名>")
            return
        elif param_str.startswith('set '):
            platform_name = param_str[4:].strip()
            if state.set_platform(platform_name):
                print(f"✓ 已切换到平台: {platform_name}")
            else:
                print(f"✗ 不支持的平台: {platform_name}")
        else:
            print("支持的平台:", ', '.join(PLATFORM_LIST))
    elif command == 'auto':
        start_ch = None
        max_iter = None
        if param_str:
            parts = param_str.split()
            if parts and parts[0].isdigit():
                start_ch = int(parts[0])
            if len(parts) > 1 and parts[1].isdigit():
                max_iter = int(parts[1])
        cmd_auto(state, start_ch, max_iter)
    else:
        print(f"未知命令: {command}")
        print("可用命令: status, list, init, genprompt, write, read, evaluate, auto, platform")


if __name__ == "__main__":
    main()
