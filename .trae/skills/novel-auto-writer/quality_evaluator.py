#!/usr/bin/env python3
"""
小说质量评估模块 v4.0
多维度评估 + 平台适配评分 + AI味道检测 + 有趣度 + 紧凑度 + 信息密度 + 反转设计
"""

import re
import json
import os
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Tuple
from datetime import datetime

class MemeDatabaseLoader:
    """Meme数据库加载器 v1.0"""

    MEME_DB_PATH = os.path.join(os.path.dirname(__file__), "resources", "meme")

    TRENDING_LEVELS = {
        "A": {"name": "Top Meme", "lifespan_months": 6},
        "B": {"name": "Hot Meme", "lifespan_months": 12},
        "C": {"name": "Common Meme", "lifespan_months": 24},
        "D": {"name": "Classic Meme", "lifespan_months": None}
    }

    def __init__(self):
        self.memes: Dict[str, dict] = {}
        self.memes_by_category: Dict[str, List[dict]] = {}
        self.memes_by_level: Dict[str, List[dict]] = {}
        self.alternatives: Dict[str, List[str]] = {}

    def load_yaml_meme_file(self, file_path: str) -> List[dict]:
        """加载单个meme yaml文件"""
        memes = []
        if not os.path.exists(file_path):
            return memes

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        yaml_pattern = r'- id:\s*(\S+)\s*\n\s*name:\s*"([^"]+)"\s*\n\s*category:\s*(\S+)\s*\n\s*subcategory:\s*(\S+)\s*\n\s*created:\s*"([^"]+)"\s*\n\s*trending_level:\s*(\S+)\s*\n(?:\s*expire_date:\s*"([^"]+)"\s*\n)?(?:\s*last_used:\s*(\S+)\s*\n)?(?:\s*use_count:\s*(\d+)\s*\n)?(?:\s*tags:\s*\[([^\]]+)\]\s*\n)?(?:\s*alternatives:\s*(\[[^\]]*\])?\s*\n)?(?:\s*reverse_example:\s*"([^"]*)"\s*\n)?(?:\s*notes:\s*"([^"]*)"\s*\n)?'

        matches = re.findall(yaml_pattern, content, re.MULTILINE)
        for match in matches:
            meme = {
                'id': match[0],
                'name': match[1],
                'category': match[2],
                'subcategory': match[3],
                'created': match[4],
                'trending_level': match[5],
                'expire_date': match[6] if match[6] else None,
                'last_used': match[7] if match[7] else None,
                'use_count': int(match[8]) if match[8] else 0,
                'tags': [t.strip() for t in match[9].split(',')] if match[9] else [],
                'alternatives': [],
                'reverse_example': match[11] if match[11] else '',
                'notes': match[12] if match[12] else ''
            }
            memes.append(meme)
        return memes

    def load_all_memes(self):
        """加载所有meme文件"""
        if not os.path.exists(self.MEME_DB_PATH):
            return

        for filename in os.listdir(self.MEME_DB_PATH):
            if filename.endswith('.md') and not filename.startswith('_'):
                file_path = os.path.join(self.MEME_DB_PATH, filename)
                memes = self.load_yaml_meme_file(file_path)
                for meme in memes:
                    self.add_meme(meme)

    def add_meme(self, meme: dict):
        """添加meme到数据库"""
        meme_id = meme.get('id', '')
        self.memes[meme_id] = meme

        category = meme.get('category', 'unknown')
        if category not in self.memes_by_category:
            self.memes_by_category[category] = []
        self.memes_by_category[category].append(meme)

        level = meme.get('trending_level', 'C')
        if level not in self.memes_by_level:
            self.memes_by_level[level] = []
        self.memes_by_level[level].append(meme)

        alternatives = meme.get('alternatives', [])
        if alternatives:
            self.alternatives[meme_id] = alternatives

    def get_memes_by_category(self, category: str) -> List[dict]:
        """按分类获取meme"""
        return self.memes_by_category.get(category, [])

    def get_memes_by_level(self, level: str) -> List[dict]:
        """按热度等级获取meme"""
        return self.memes_by_level.get(level, [])

    def get_l1_memes(self) -> List[dict]:
        """获取L1级别加载的meme (D + C + Top 10 A)"""
        result = []
        result.extend(self.get_memes_by_level('D'))
        result.extend(self.get_memes_by_level('C'))
        a_level = self.get_memes_by_level('A')
        result.extend(a_level[:10])
        return result

    def get_meme_names(self, memes: List[dict] = None) -> List[str]:
        """获取meme名称列表"""
        if memes is None:
            memes = list(self.memes.values())
        return [m.get('name', '') for m in memes if m.get('name')]

    def is_expired(self, meme: dict) -> bool:
        """检查meme是否过期"""
        expire_date = meme.get('expire_date')
        if not expire_date:
            return False
        try:
            expire = datetime.strptime(expire_date, "%Y-%m-%d")
            return datetime.now() > expire
        except:
            return False

    def get_alternatives(self, meme_id: str) -> List[str]:
        """获取替代meme"""
        return self.alternatives.get(meme_id, [])

    def get_meme_count(self) -> int:
        """获取meme总数"""
        return len(self.memes)

@dataclass
class QualityScore:
    """质量评分数据类"""
    dimension: str
    score: float
    weight: float
    comment: str

@dataclass
class EvaluationResult:
    """评估结果"""
    chapter: int
    title: str
    scores: Dict[str, float]
    weights: Dict[str, float]
    total_score: float
    grade: str
    passed: bool
    platform: str
    platform_compliant: bool
    suggestions: List[str]
    revision_needed: bool
    revision_count: int

PLATFORM_CONFIGS = {
    "起点中文网": {
        "min_chapter_words": 3000,
        "target_chapter_words": 4000,
        "word_count_tolerance": 500,
        "daily_update_min": 3000,
        "sign_threshold_words": 30000,
        "focus_genres": ["玄幻", "修真", "都市", "科幻"],
        "special_notes": "前5000字决定是否过审，竞争激烈需精品"
    },
    "晋江文学城": {
        "min_chapter_words": 3000,
        "target_chapter_words": 3500,
        "word_count_tolerance": 500,
        "daily_update_min": 3000,
        "sign_threshold_words": 10000,
        "focus_genres": ["言情", "纯爱", "衍生", "同人"],
        "special_notes": "女频为主，文风细腻，需签约简纲286-290字"
    },
    "番茄小说": {
        "min_chapter_words": 4000,
        "target_chapter_words": 4000,
        "word_count_tolerance": 200,
        "daily_update_min": 4000,
        "sign_threshold_words": 20000,
        "focus_genres": ["都市", "玄幻", "言情", "穿越"],
        "special_notes": "免费赛道，8万字首秀，日更4000-6000字"
    },
    "纵横中文网": {
        "min_chapter_words": 3000,
        "target_chapter_words": 4000,
        "word_count_tolerance": 500,
        "daily_update_min": 3000,
        "sign_threshold_words": 30000,
        "focus_genres": ["玄幻", "都市", "游戏", "历史"],
        "special_notes": "签约即送全勤，慢热型编辑一对一指导"
    },
    "七猫小说": {
        "min_chapter_words": 4000,
        "target_chapter_words": 4000,
        "word_count_tolerance": 200,
        "daily_update_min": 4000,
        "sign_threshold_words": 50000,
        "focus_genres": ["现言", "古言", "玄幻", "都市"],
        "special_notes": "精品文路线，文笔套路要求高，保底千字20元起"
    },
    "飞卢小说": {
        "min_chapter_words": 4000,
        "target_chapter_words": 5000,
        "word_count_tolerance": 500,
        "daily_update_min": 6000,
        "sign_threshold_words": 30000,
        "focus_genres": ["同人", "都市", "玄幻", "游戏"],
        "special_notes": "四快著称，签约上架快追热点，日更6000+月更18万+"
    }
}

class QualityEvaluator:
    """小说质量评估器 v5.0 - 新增Meme数据库集成"""

    DIMENSIONS = {
        "word_count": {"weight": 0.05, "name": "字数要求"},
        "plot_appeal": {"weight": 0.08, "name": "剧情吸引力"},
        "character": {"weight": 0.05, "name": "人物塑造"},
        "writing_flow": {"weight": 0.05, "name": "文笔流畅度"},
        "humor": {"weight": 0.05, "name": "幽默风趣度"},
        "emotion": {"weight": 0.05, "name": "情感共鸣"},
        "world_building": {"weight": 0.04, "name": "世界观构建"},
        "innovation": {"weight": 0.06, "name": "创新程度"},
        "standalone_quality": {"weight": 0.06, "name": "单元剧质量"},
        "continuity": {"weight": 0.06, "name": "剧情连贯性"},
        "ai_flavor": {"weight": 0.03, "name": "AI味道(低为好)"},
        "fun": {"weight": 0.03, "name": "有趣度"},
        "plot_pacing": {"weight": 0.05, "name": "剧情紧凑度"},
        "information_density": {"weight": 0.03, "name": "信息量密度"},
        "plot_twist": {"weight": 0.05, "name": "剧情反转"},
        "author_eval": {"weight": 0.03, "name": "作者评价"},
        "reader_eval": {"weight": 0.03, "name": "读者评价"},
        "meme_level": {"weight": 0.08, "name": "梗含量"},
        "trend_level": {"weight": 0.06, "name": "潮流热度"},
        "freshness": {"weight": 0.06, "name": "新鲜感"}
    }

    MODERN_MEMES = [
        "绝绝子", "YYDS", "emo", "躺平", "摆烂", "内卷", "社死", "破防", "扎心",
        "真香", "打脸", "上头", "下头", "芜湖", "凡尔赛", "社交牛杂症", "带薪如厕",
        "摸鱼", "划水", "卷王", "卷死", "润", "丧", "麻了", "栓Q", "笑死", "尬",
        "社恐", "社牛", "显眼包", "整活", "整烂活", "整好活", "整了个活", "下饭",
        "开摆", "摆烂", "开卷", "卷铺盖", "EMO", "yyds", "YYDS", "u1s1", "AWSL",
        " xswl", "笑死我了", "笑死根本笑不死", "大聪明", "大冤种", "大聪明行为",
        "服了你个老六", "老六行为", "挖呀挖", "挖野菜", "特种兵旅游", "公主请",
        "退退退", "哈基米", "墩墩", "完蛋", "我太难了", "我哭死", "暴风哭泣",
        "家人们谁懂啊", "救命", "啊啊啊", "急急急", "急死了", "急", "救命之恩",
        "老铁", "没毛病", "没毛病老铁", "扎心了老铁", "伤害性极强", "侮辱性极高",
        "蚌埠住", "绷不住", "真有你的", "就离谱", "离离原上谱", "离谱妈妈给离谱开门",
        "干饭", "干饭人", "干饭魂", "干饭魂觉醒", "小丑", "小丑竟是我自己",
        "酸了", "慕了", "馋哭了", "馋死谁了", "我谢谢你", "我真的会谢", "栓Q了",
        "摆烂吧", "摆烂人生", "躺平的人生", "躺平学大师", "卷不动了", "真的卷不动",
    ]

    MODERN_TRENDS = [
        "重生", "穿书", "系统", "金手指", "逆袭", "打脸", "团宠", "马甲", "病娇",
        "疯批", "霸总", "甜宠", "虐恋", "爽文", "反套路", "凡尔赛", "绿茶", "白莲花",
        "修罗场", "火葬场", "追妻火葬场", "真假千金", "豪门", "总裁", "契约",
        "暗恋", "青梅竹马", "天降", "国民", "顶流", "影帝", "大佬", "师尊", "师兄",
        "师妹", "师弟", "师门", "宗门", "修仙", "飞升", "渡劫", "天雷", "灵气",
        "丧尸", "末日", "星际", "虫族", "abo", "哨兵", "向导", "变异", "异能",
        "游戏", "全息", "虚拟", "电竞", "直播", "网红", "微商", "带货", "种田",
        "空间", "随身空间", "系统文", "快穿", "无限流", "悬疑", "推理", "烧脑",
        "恐怖", "灵异", "玄学", "风水", "算命", "直播问诊", "直播算命", "美食文",
        "年代文", "七零", "八零", "九零", "知青", "军婚", "先婚后爱", "暗恋成真",
    ]

    MEME_PATTERNS = [
        r"绝绝子", r"YYDS", r"emo", r"躺平", r"摆烂", r"内卷", r"社死", r"破防",
        r"真香", r"打脸", r"上头", r"下头", r"芜湖", r"凡尔赛", r"摸鱼", r"卷王",
        r"栓Q", r"笑死", r"社恐", r"社牛", r"显眼包", r"整活", r"下饭", r"开摆",
        r"服了.*老六", r"挖呀挖", r"墩墩", r"完蛋", r"家人们谁懂", r"急急急",
        r"老铁.*没毛病", r"蚌埠住", r"绷不住", r"离谱", r"干饭", r"小丑.*自己",
        r"酸了", r"慕了", r"馋哭了", r"我真的会谢", r"急.*急死了",
    ]

    ANTI_CLICHE_PATTERNS = [
        r"本以为.*却", r"谁知.*偏偏", r"没想到.*竟然", r"意外.*反转",
        r"打脸.*来的", r"真香.*定律", r"大型.*现场", r"反转.*再反转",
        r"原来.*是这样", r"真相.*往往", r"事情.*并不简单",
    ]

    def __init__(self, platform: str = "起点中文网"):
        self.platform = platform
        self.platform_config = PLATFORM_CONFIGS.get(platform, PLATFORM_CONFIGS["起点中文网"])
        self.evaluation_history: List[EvaluationResult] = []
        self.meme_loader = MemeDatabaseLoader()
        self.meme_loader.load_all_memes()

    def count_words(self, text: str) -> int:
        """统计字数（中文+英文）"""
        chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))
        english_words = len(re.findall(r'[a-zA-Z]+', text))
        return chinese_chars + english_words

    def evaluate_word_count(self, text: str) -> Tuple[float, str]:
        """评估字数（平台自适应）"""
        count = self.count_words(text)
        config = self.platform_config
        target = config["target_chapter_words"]
        min_words = config["min_chapter_words"]
        tolerance = config.get("word_count_tolerance", 500)

        if min_words <= count <= target + tolerance:
            ratio = (count - min_words) / (target - min_words) if target > min_words else 1.0
            score = 7 + ratio * 3
            return round(min(10, score), 1), f"字数{count}字，符合{self.platform}要求"
        elif count < min_words:
            ratio = count / min_words
            score = ratio * 6
            return round(max(1, score), 1), f"字数{count}字，低于{self.platform}最低要求{min_words}字"
        else:
            over_ratio = (count - target) / target
            score = max(5, 10 - over_ratio * 5)
            return round(score, 1), f"字数{count}字，超过建议字数{target}字"

    def evaluate_plot_appeal(self, text: str) -> Tuple[float, str]:
        """评估剧情吸引力"""
        score = 7.0
        comments = []

        if any(kw in text for kw in ["突然", "没想到", "竟然", "但是", "然而", "就在此时"]):
            score += 0.5
            comments.append("有悬念设置")
        else:
            score -= 0.5
            comments.append("缺少悬念")

        if any(kw in text for kw in ["矛盾", "冲突", "对抗", "挑战", "危机"]):
            score += 0.5
            comments.append("有冲突设计")
        else:
            score -= 0.5
            comments.append("冲突不够")

        paragraphs = text.split('\n\n')
        if 5 <= len(paragraphs) <= 15:
            score += 0.5
            comments.append("节奏适中")
        elif len(paragraphs) < 5:
            score -= 0.5
            comments.append("节奏过快")
        else:
            score -= 0.3
            comments.append("节奏偏慢")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_character(self, text: str) -> Tuple[float, str]:
        """评估人物塑造"""
        score = 7.0
        comments = []

        if any(kw in text for kw in ["林逸", "主角", "他", "她", "人物"]):
            score += 0.5
            comments.append("有人物描写")

        if any(kw in text for kw in ["心想", "想道", "感觉", "觉得", "心理"]):
            score += 0.5
            comments.append("有心理描写")
        else:
            score -= 0.5
            comments.append("缺少心理描写")

        dialogue_count = len(re.findall(r'["""\'\'"].*?["""\'\']', text))
        if dialogue_count >= 3:
            score += 0.5
            comments.append(f"有{dialogue_count}处对话")
        elif dialogue_count == 0:
            score -= 0.5
            comments.append("缺少对话")

        unique_says = len(set(re.findall(r'(?:说|道|问|答|笑|叹|怒|吼|喃喃|自语)', text)))
        if unique_says >= 5:
            score += 0.5
            comments.append("对话表达丰富")
        elif unique_says < 2:
            score -= 0.3
            comments.append("对话形式单一")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_writing_flow(self, text: str) -> Tuple[float, str]:
        """评估文笔流畅度"""
        score = 7.5
        comments = []

        incomplete_sentences = len(re.findall(r'[，,][\s]*$', text))
        if incomplete_sentences == 0:
            score += 0.5
            comments.append("语句完整")
        else:
            score -= min(1, incomplete_sentences * 0.2)
            comments.append(f"有{incomplete_sentences}处语句不完整")

        paragraphs = [p for p in text.split('\n\n') if p.strip()]
        avg_len = sum(len(p) for p in paragraphs) / max(1, len(paragraphs))
        if 100 <= avg_len <= 300:
            score += 0.5
            comments.append("段落长度适中")
        else:
            score -= 0.3
            comments.append("段落长度不均")

        transition_words = ["于是", "接着", "然后", "与此同时"]
        if any(tw in text for tw in transition_words):
            score += 0.3
            comments.append("有过渡衔接")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_humor(self, text: str) -> Tuple[float, str]:
        """评估幽默风趣度"""
        score = 6.0
        comments = []

        humor_markers = ["笑", "哈哈", "有趣", "调侃", "幽默", "搞笑", "忍俊不禁"]
        humor_count = sum(1 for m in humor_markers if m in text)
        if humor_count >= 3:
            score = 7.5
            comments.append(f"有{humor_count}处幽默元素")
        elif humor_count >= 1:
            score = 6.5
            comments.append(f"有少量幽默元素")
        else:
            score = 5.5
            comments.append("缺乏幽默元素")

        light_markers = ["轻松", "悠闲", "惬意", "舒服", "愉快"]
        if any(m in text for m in light_markers):
            score += 0.5
            comments.append("有轻松氛围")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "缺乏幽默"

    def evaluate_emotion(self, text: str) -> Tuple[float, str]:
        """评估情感共鸣"""
        score = 6.5
        comments = []

        emotion_words = ["感动", "温暖", "心酸", "心疼", "激动", "愤怒", "悲伤", "喜悦"]
        emotion_count = sum(1 for w in emotion_words if w in text)
        if emotion_count >= 3:
            score += 1.0
            comments.append(f"有{emotion_count}处情感描写")
        elif emotion_count >= 1:
            score += 0.3
            comments.append("有少量情感描写")
        else:
            comments.append("缺乏情感共鸣")

        if any(kw in text for kw in ["眼眶", "颤抖", "心跳", "热泪"]):
            score += 0.5
            comments.append("有情感细节")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "缺乏情感"

    def evaluate_world_building(self, text: str) -> Tuple[float, str]:
        """评估世界观构建"""
        score = 7.0
        comments = []

        setting_words = ["世界", "宇宙", "修仙", "灵气", "宗门", "仙界", "凡界"]
        setting_count = sum(1 for w in setting_words if w in text)
        if setting_count >= 4:
            score += 1.0
            comments.append(f"世界观设定丰富({setting_count}个设定词)")
        elif setting_count >= 2:
            score += 0.3
            comments.append("有基本世界观")
        else:
            comments.append("世界观不够完善")

        if any(kw in text for kw in ["境界", "修为", "功法", "规则"]):
            score += 0.5
            comments.append("有修炼体系")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_innovation(self, text: str) -> Tuple[float, str]:
        """评估创新程度"""
        score = 6.5
        comments = []

        innovation_markers = ["独特", "新颖", "创新", "首次", "第一次", "前所未有"]
        innovation_count = sum(1 for m in innovation_markers if m in text)
        if innovation_count >= 2:
            score += 1.0
            comments.append(f"有{innovation_count}处创新表达")
        elif innovation_count == 1:
            score += 0.5
            comments.append("有少量创新")
        else:
            comments.append("创新不足")

        unique_settings = ["重生", "穿越", "系统", "觉醒"]
        unique_count = sum(1 for s in unique_settings if s in text)
        if unique_count >= 1:
            score += 0.5
            comments.append("有独特设定")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "创新一般"

    def evaluate_standalone_quality(self, text: str, chapter_num: int) -> Tuple[float, str]:
        """评估单元剧质量（本章剧情完整性）"""
        score = 7.0
        comments = []

        chapter_markers = [f"第{chapter_num}章", f"第{chapter_num}节"]
        has_chapter_mark = any(m in text[:50] for m in chapter_markers)
        if has_chapter_mark:
            score += 0.5
            comments.append("章节标记清晰")
        else:
            score -= 0.3
            comments.append("章节标记不清晰")

        conclusion_markers = ["本章完", "本集完", "完", "结局", "结束"]
        has_conclusion = any(m in text[-100:] for m in conclusion_markers)
        if has_conclusion:
            score += 0.5
            comments.append("有本章总结")
        else:
            score -= 0.3
            comments.append("缺少本章总结")

        key_events = len(re.findall(r'["""\'\'"].*?[。!?]', text))
        if key_events >= 5:
            score += 0.5
            comments.append(f"有{key_events}个关键情节点")
        elif key_events >= 3:
            score += 0.2
            comments.append("情节点基本完整")
        else:
            score -= 0.3
            comments.append("情节点偏少")

        setup_climax = any(kw in text for kw in ["突然", "没想到", "然而", "就在此时", "刹那间"])
        if setup_climax:
            score += 0.5
            comments.append("有高潮铺垫")
        else:
            score -= 0.2
            comments.append("高潮铺垫不足")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_continuity(self, text: str, chapter_num: int) -> Tuple[float, str]:
        """评估剧情连贯性（与前后章节的关联）"""
        score = 7.5
        comments = []

        if chapter_num > 1:
            reference_markers = ["上章", "上文", "之前", "上一章", "那天", "那时", "后来", "之后"]
            has_reference = any(m in text[:200] for m in reference_markers)
            if has_reference:
                score += 0.5
                comments.append("有前文承接")
            else:
                score -= 0.3
                comments.append("缺少前文承接")

        if chapter_num < 75:
            cliffhanger_markers = ["欲知后事", "请看下章", "下回", "悬念", "但是", "然而", "就在这时"]
            has_teaser = any(m in text[-150:] for m in cliffhanger_markers)
            if has_teaser:
                score += 0.5
                comments.append("有下章悬念")
            else:
                score -= 0.3
                comments.append("缺少下章悬念")

        character_continuity = len(set(re.findall(r'林逸|李雨晴|王建明|张伟|王磊', text)))
        if character_continuity >= 2:
            score += 0.3
            comments.append(f"有人物连续性({character_continuity}个角色)")
        else:
            score -= 0.2
            comments.append("人物关联较少")

        timeline_markers = ["这天", "次日", "几天后", "数月后", "转眼", "时光飞逝"]
        has_timeline = any(m in text for m in timeline_markers)
        if has_timeline:
            score += 0.3
            comments.append("有时间线交代")
        else:
            score -= 0.1
            comments.append("时间线略模糊")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本连贯"

    def evaluate_ai_flavor(self, text: str) -> Tuple[float, str]:
        """评估AI味道（越低越好）"""
        score = 10.0
        comments = []

        ai_patterns = [
            (r'突然', 0.3),
            (r'然而', 0.2),
            (r'没想到', 0.3),
            (r'竟然', 0.2),
            (r'就在这时', 0.3),
            (r'不由得', 0.2),
            (r'显然', 0.2),
            (r'因此', 0.1),
            (r'所以', 0.1),
            (r'综上所述', 0.3),
            (r'总的来说', 0.2),
        ]

        pattern_count = 0
        for pattern, penalty in ai_patterns:
            matches = len(re.findall(pattern, text))
            pattern_count += matches
            score -= matches * penalty

        if pattern_count == 0:
            score = 10.0
            comments.append("无明显AI痕迹")
        elif pattern_count <= 5:
            score = 8.0 - pattern_count * 0.2
            comments.append(f"有少量AI特征({pattern_count}处)")
        elif pattern_count <= 10:
            score = 6.0 - (pattern_count - 5) * 0.3
            comments.append(f"AI特征较明显({pattern_count}处)")
        else:
            score = max(2.0, 4.0 - (pattern_count - 10) * 0.2)
            comments.append(f"AI特征过多({pattern_count}处)")

        perfect_sentences = len(re.findall(r'[^。！？]*[，。；；][^。！？]*[，。；；][^。！？]*[。！？]', text))
        if perfect_sentences > len(re.findall(r'[。！？]', text)) * 0.5:
            score -= 1.0
            comments.append("句式过于工整")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本正常"

    def evaluate_fun(self, text: str) -> Tuple[float, str]:
        """评估有趣度（意想不到的幽默）"""
        score = 6.0
        comments = []

        unexpected_humor = [
            (r'没想到.*结果', "意外反转式幽默"),
            (r'居然.*（.*）', "括号吐槽式幽默"),
            (r'这不是.*吗.*[？?]', "反问式幽默"),
            (r'谁知.*偏偏', "事与愿违式幽默"),
            (r'话说回来', "转折式幽默"),
            (r'说白了', "直白式幽默"),
            (r'说真的', "真诚式幽默"),
            (r'说实话', "坦白式幽默"),
        ]

        humor_types = 0
        found_humors = []
        for pattern, name in unexpected_humor:
            if re.search(pattern, text):
                humor_types += 1
                found_humors.append(name)

        if humor_types >= 3:
            score = 8.5
            comments.append(f"多种幽默手法({humor_types}种)")
        elif humor_types >= 1:
            score = 7.0 + humor_types * 0.5
            comments.append(f"有{humor_types}种幽默手法")
        else:
            score = 6.0
            comments.append("幽默手法单一")

        dialogue_without_say = len(re.findall(r'^[^"\'《]*[？?！!][^"\'《]*$', text, re.MULTILINE))
        if dialogue_without_say >= 2:
            score += 0.5
            comments.append("对话有趣省略提示语")

        exaggeration = len(re.findall(r'[极其|非常|特别|十分|相当][^，。]*[，。]?', text))
        if exaggeration >= 3:
            score += 0.3
            comments.append("有夸张描写增加喜感")
        elif exaggeration == 0:
            score -= 0.3
            comments.append("缺乏夸张幽默")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_plot_pacing(self, text: str) -> Tuple[float, str]:
        """评估剧情紧凑度"""
        score = 7.0
        comments = []

        sentences = re.split(r'[。！？.!?]', text)
        sentence_count = len([s for s in sentences if s.strip()])

        key_event_words = ["突然", "霎时", "刹那间", "顷刻", "瞬间", "蓦然", "骤然"]
        key_event_count = sum(1 for w in key_event_words if w in text)

        if key_event_count >= 5:
            score += 1.5
            comments.append(f"事件密集({key_event_count}个关键节点)")
        elif key_event_count >= 3:
            score += 1.0
            comments.append(f"节奏较快({key_event_count}个关键节点)")
        elif key_event_count >= 1:
            score += 0.3
            comments.append(f"有基本节奏({key_event_count}个关键节点)")
        else:
            score -= 0.5
            comments.append("节奏偏慢")

        short_sentences = len([s for s in sentences if len(s.strip()) < 15 and len(s.strip()) > 0])
        short_ratio = short_sentences / max(1, sentence_count)
        if short_ratio > 0.4:
            score += 0.5
            comments.append("短句穿插节奏快")
        elif short_ratio < 0.1:
            score -= 0.3
            comments.append("句式偏长节奏慢")

        paragraphs = [p for p in text.split('\n\n') if p.strip()]
        avg_para_len = sum(len(p) for p in paragraphs) / max(1, len(paragraphs))
        if avg_para_len < 150:
            score += 0.5
            comments.append("段落精简紧凑")
        elif avg_para_len > 400:
            score -= 0.5
            comments.append("段落偏长略显拖沓")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_information_density(self, text: str) -> Tuple[float, str]:
        """评估信息量密度"""
        score = 7.0
        comments = []

        rare_events = [
            (r'第一次', "首遇事件"),
            (r'前所未有', "前所未有事件"),
            (r'从未', "从未发生事件"),
            (r'意外', "意外事件"),
            (r'奇迹', "奇迹事件"),
            (r'破天荒', "破天荒事件"),
            (r'不可思议', "不可思议事件"),
        ]

        rare_count = 0
        rare_types = []
        for pattern, name in rare_events:
            if re.search(pattern, text):
                rare_count += len(re.findall(pattern, text))
                rare_types.append(name)

        if rare_count >= 5:
            score += 2.0
            comments.append(f"信息密度高({rare_count}个小概率事件)")
        elif rare_count >= 3:
            score += 1.0
            comments.append(f"信息量较密({rare_count}个小概率事件)")
        elif rare_count >= 1:
            score += 0.3
            comments.append(f"有基本密度({rare_count}个小概率事件)")
        else:
            score -= 0.5
            comments.append("信息密度偏低")

        concrete_details = len(re.findall(r'\d+[年月日时分秒厘米公里万元]|具体|精确|准确', text))
        if concrete_details >= 5:
            score += 0.5
            comments.append("有具体细节")
        elif concrete_details >= 2:
            score += 0.2
            comments.append("有少量具体细节")
        else:
            score -= 0.2
            comments.append("细节偏抽象")

        new_info = len(re.findall(r'新|首次|独创|独有|独特', text))
        if new_info >= 3:
            score += 0.5
            comments.append("新信息较多")
        elif new_info >= 1:
            score += 0.2
        else:
            score -= 0.1

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_plot_twist(self, text: str) -> Tuple[float, str]:
        """评估剧情反转设计"""
        score = 7.0
        comments = []

        twist_patterns = {
            "identity_twist": (r'没想到.*竟是|原来.*是|居然.*是|竟然.*是|其实.*是', "身份反转"),
            "situation_twist": (r'然而.*却|正当.*突然|就在.*霎时', "局势突变"),
            "expectation_twist": (r'本以为.*结果|以为.*却|谁知.*偏偏', "预期打破"),
            "hidden_truth": (r'直到.*才|原来.*真相|这才发现|真相是', "隐藏真相揭示"),
            "role_reversal": (r'反派.*竟|好人.*却|敌人.*其实', "正邪逆转"),
        }

        found_twists = []
        for twist_type, (pattern, name) in twist_patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                found_twists.append((twist_type, len(matches), name))

        if len(found_twists) >= 3:
            score += 2.0
            twist_names = ", ".join([t[2] for t in found_twists[:3]])
            comments.append(f"反转丰富({twist_names})")
        elif len(found_twists) >= 2:
            score += 1.0
            twist_names = ", ".join([t[2] for t in found_twists])
            comments.append(f"有双重反转({twist_names})")
        elif len(found_twists) == 1:
            score += 0.3
            comments.append(f"有基本反转({found_twists[0][2]})")
        else:
            score -= 0.5
            comments.append("缺少反转设计")

        foreshadow = len(re.findall(r'似乎|好像|仿佛|隐隐|总觉得', text))
        if foreshadow >= 3 and found_twists:
            score += 0.5
            comments.append("有伏笔呼应")
        elif foreshadow >= 5:
            score += 0.3
            comments.append("伏笔较多但无反转")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_author_eval(self, text: str) -> Tuple[float, str]:
        """评估作者视角（专业作者评价）"""
        score = 7.5
        comments = []

        author_voice_markers = [
            (r'说实话', "实话"),
            (r'说真的', "真话"),
            (r'笔者认为', "作者观点"),
            (r'本书.*认为', "书内观点"),
            (r'其实.*只是', "真相揭示"),
        ]

        author_markers_count = 0
        for pattern, name in author_voice_markers:
            if re.search(pattern, text):
                author_markers_count += 1

        if author_markers_count >= 2:
            score += 0.5
            comments.append("有作者主观视角")
        elif author_markers_count == 1:
            comments.append("有少量作者声音")
        else:
            score -= 0.3
            comments.append("作者视角不明显")

        descriptive_breaks = len(re.findall(r'只见|但见|忽见|遥望|定睛', text))
        if descriptive_breaks >= 2:
            score += 0.5
            comments.append("场景描写生动")
        elif descriptive_breaks >= 1:
            score += 0.2
        else:
            score -= 0.2
            comments.append("场景描写不足")

        metaphor_count = len(re.findall(r'像|如|似|仿佛|犹如', text))
        if metaphor_count >= 5:
            score += 0.5
            comments.append("善用比喻修辞")
        elif metaphor_count >= 2:
            score += 0.2
        else:
            score -= 0.1
            comments.append("比喻较少")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_reader_eval(self, text: str) -> Tuple[float, str]:
        """评估读者视角（读者体验评价）"""
        score = 7.0
        comments = []

        reader_hooks = [
            (r'欲知后事', "吊胃口式"),
            (r'请看下章', "预告式"),
            (r'下回分解', "章回式"),
            (r'你们觉得', "互动式"),
            (r'猜猜.*结果', "猜测式"),
            (r'没想到.*吧', "惊讶式"),
        ]

        hook_count = 0
        hook_types = []
        for pattern, name in reader_hooks:
            if re.search(pattern, text):
                hook_count += 1
                hook_types.append(name)

        if hook_count >= 2:
            score += 1.0
            comments.append(f"读者钩子多({hook_count}处)")
        elif hook_count == 1:
            score += 0.3
            comments.append(f"有基本读者钩子")
        else:
            score -= 0.3
            comments.append("缺少读者钩子")

        cliffhanger_ending = any(m in text[-100:] for m in ["但是", "然而", "就在", "突然", "却没", "没想到"])
        if cliffhanger_ending:
            score += 0.5
            comments.append("结尾有悬念")
        else:
            score -= 0.3
            comments.append("结尾缺少悬念")

        immersion_markers = len(re.findall(r'此时|此刻|这一刻|刹那间|一瞬间', text))
        if immersion_markers >= 3:
            score += 0.5
            comments.append("沉浸感强")
        elif immersion_markers >= 1:
            score += 0.2
        else:
            score -= 0.2
            comments.append("沉浸感一般")

        return round(max(1, min(10, score)), 1), "; ".join(comments) if comments else "基本合格"

    def evaluate_meme_level(self, text: str) -> Tuple[float, str]:
        """评估梗含量 - 新梗、热梗、流行梗"""
        score = 5.0
        comments = []

        meme_count = 0
        found_memes = []
        for meme in self.MODERN_MEMES:
            if meme in text:
                meme_count += 1
                found_memes.append(meme)

        pattern_count = 0
        for pattern in self.MEME_PATTERNS:
            matches = re.findall(pattern, text)
            pattern_count += len(matches)

        total_meme_density = meme_count + pattern_count

        if total_meme_density >= 8:
            score = 9.0
            comments.append(f"梗密度极高({total_meme_density}处)")
            comments.append(f"典型梗: {', '.join(found_memes[:5])}")
        elif total_meme_density >= 5:
            score = 8.0
            comments.append(f"梗含量较高({total_meme_density}处)")
        elif total_meme_density >= 3:
            score = 7.0
            comments.append(f"有基本梗元素({total_meme_density}处)")
        elif total_meme_density >= 1:
            score = 6.0
            comments.append(f"有少量梗({total_meme_density}处)")
        else:
            score = 5.0
            comments.append("梗含量不足，太正经")

        if any(m in text for m in ["家人们谁懂啊", "急急急", "笑死", "完蛋", "我真的会谢"]):
            score += 0.5
            comments.append("有网红金句")

        if re.search(r'\[.*?\]|\(.*?）|\(.*?\)', text):
            score += 0.3
            comments.append("有弹幕/括号吐槽风格")

        return round(min(10, score), 1), "; ".join(comments[:3]) if comments else "梗含量不足"

    def evaluate_trend_level(self, text: str) -> Tuple[float, str]:
        """评估潮流热度 - 当前热门元素"""
        score = 6.0
        comments = []

        trend_count = 0
        found_trends = []
        for trend in self.MODERN_TRENDS:
            if trend in text:
                trend_count += 1
                found_trends.append(trend)

        if trend_count >= 6:
            score = 9.0
            comments.append(f"潮流元素丰富({trend_count}种)")
            comments.append(f"包含: {', '.join(found_trends[:4])}")
        elif trend_count >= 4:
            score = 8.0
            comments.append(f"潮流元素较多({trend_count}种)")
        elif trend_count >= 2:
            score = 7.0
            comments.append(f"有基本潮流元素({trend_count}种)")
        elif trend_count >= 1:
            score = 6.5
            comments.append(f"有少量潮流元素({trend_count}种)")
        else:
            score = 5.5
            comments.append("潮流元素偏少")

        hot_combinations = [
            ("重生", "系统"), ("穿书", "病娇"), ("霸总", "甜宠"),
            ("星际", "异能"), ("直播", "带货"), ("年代文", "空间"),
            ("无限流", "悬疑"), ("师尊", "师兄"), ("团宠", "马甲")
        ]
        combo_count = sum(1 for combo in hot_combinations if all(t in text for t in combo))
        if combo_count >= 2:
            score += 1.0
            comments.append(f"热门组合{combo_count}组(叠加效果)")
        elif combo_count == 1:
            score += 0.5
            comments.append("有热门元素组合")

        return round(min(10, score), 1), "; ".join(comments[:3]) if comments else "潮流元素一般"

    def evaluate_freshness(self, text: str) -> Tuple[float, str]:
        """评估新鲜感 - 新套路、反套路、反转"""
        score = 6.0
        comments = []

        anti_cliche_count = 0
        found_anti_cliches = []
        for pattern in self.ANTI_CLICHE_PATTERNS:
            matches = re.findall(pattern, text)
            if matches:
                anti_cliche_count += len(matches)
                found_anti_cliches.append(pattern[:15])

        unexpected_elements = [
            "离谱", "意外", "反转", "打脸", "真香", "完蛋", "崩溃",
            "石化", "傻眼", "愣住", "窒息", "血压", "心肌梗塞"
        ]
        unexpected_count = sum(1 for e in unexpected_elements if e in text)

        fresh_score = anti_cliche_count * 0.8 + unexpected_count * 0.5

        if fresh_score >= 6:
            score = 9.0
            comments.append(f"新鲜感极强(反套路{anti_cliche_count}处)")
        elif fresh_score >= 4:
            score = 8.0
            comments.append(f"新鲜感较强({anti_cliche_count}处反套路)")
        elif fresh_score >= 2:
            score = 7.0
            comments.append(f"有一定新鲜感({anti_cliche_count}处反套路)")
        elif fresh_score >= 1:
            score = 6.5
            comments.append("有少量反套路设计")
        else:
            score = 5.5
            comments.append("套路较旧，缺乏新鲜感")

        if re.search(r'反转.*再反转|意外.*意外.*意外', text):
            score += 0.5
            comments.append("多重反转设计")

        if any(u in text for u in ["完了完了", "完蛋完了", "我人没了", "我傻了", "这谁顶得住"]):
            score += 0.5
            comments.append("有破防式吐槽")

        return round(min(10, score), 1), "; ".join(comments[:3]) if comments else "新鲜感一般"

    def check_platform_compliance(self, text: str, word_count: int) -> Tuple[bool, List[str]]:
        """检查平台合规性"""
        config = self.platform_config
        issues = []

        if word_count < config["min_chapter_words"]:
            issues.append(f"字数低于平台最低要求：{word_count} < {config['min_chapter_words']}")

        if word_count > config["target_chapter_words"] + config.get("word_count_tolerance", 500):
            issues.append(f"字数超过平台建议上限：{word_count} > {config['target_chapter_words'] + config.get('word_count_tolerance', 500)}")

        return len(issues) == 0, issues

    def evaluate_chapter(self, chapter_num: int, title: str, text: str) -> EvaluationResult:
        """评估整章"""
        scores = {}
        comments = {}

        word_score, word_comment = self.evaluate_word_count(text)
        scores["word_count"] = word_score
        comments["word_count"] = word_comment

        plot_score, plot_comment = self.evaluate_plot_appeal(text)
        scores["plot_appeal"] = plot_score
        comments["plot_appeal"] = plot_comment

        char_score, char_comment = self.evaluate_character(text)
        scores["character"] = char_score
        comments["character"] = char_comment

        flow_score, flow_comment = self.evaluate_writing_flow(text)
        scores["writing_flow"] = flow_score
        comments["writing_flow"] = flow_comment

        humor_score, humor_comment = self.evaluate_humor(text)
        scores["humor"] = humor_score
        comments["humor"] = humor_comment

        emotion_score, emotion_comment = self.evaluate_emotion(text)
        scores["emotion"] = emotion_score
        comments["emotion"] = emotion_comment

        world_score, world_comment = self.evaluate_world_building(text)
        scores["world_building"] = world_score
        comments["world_building"] = world_comment

        innovation_score, innovation_comment = self.evaluate_innovation(text)
        scores["innovation"] = innovation_score
        comments["innovation"] = innovation_comment

        standalone_score, standalone_comment = self.evaluate_standalone_quality(text, chapter_num)
        scores["standalone_quality"] = standalone_score
        comments["standalone_quality"] = standalone_comment

        continuity_score, continuity_comment = self.evaluate_continuity(text, chapter_num)
        scores["continuity"] = continuity_score
        comments["continuity"] = continuity_comment

        ai_score, ai_comment = self.evaluate_ai_flavor(text)
        scores["ai_flavor"] = ai_score
        comments["ai_flavor"] = ai_comment

        fun_score, fun_comment = self.evaluate_fun(text)
        scores["fun"] = fun_score
        comments["fun"] = fun_comment

        pacing_score, pacing_comment = self.evaluate_plot_pacing(text)
        scores["plot_pacing"] = pacing_score
        comments["plot_pacing"] = pacing_comment

        density_score, density_comment = self.evaluate_information_density(text)
        scores["information_density"] = density_score
        comments["information_density"] = density_comment

        twist_score, twist_comment = self.evaluate_plot_twist(text)
        scores["plot_twist"] = twist_score
        comments["plot_twist"] = twist_comment

        author_score, author_comment = self.evaluate_author_eval(text)
        scores["author_eval"] = author_score
        comments["author_eval"] = author_comment

        reader_score, reader_comment = self.evaluate_reader_eval(text)
        scores["reader_eval"] = reader_score
        comments["reader_eval"] = reader_comment

        meme_score, meme_comment = self.evaluate_meme_level(text)
        scores["meme_level"] = meme_score
        comments["meme_level"] = meme_comment

        trend_score, trend_comment = self.evaluate_trend_level(text)
        scores["trend_level"] = trend_score
        comments["trend_level"] = trend_comment

        freshness_score, freshness_comment = self.evaluate_freshness(text)
        scores["freshness"] = freshness_score
        comments["freshness"] = freshness_comment

        weights = {k: v["weight"] for k, v in self.DIMENSIONS.items()}
        total_score = sum(scores[k] * weights[k] for k in scores)

        if total_score >= 9:
            grade = "优秀"
        elif total_score >= 7:
            grade = "良好"
        elif total_score >= 5:
            grade = "及格"
        else:
            grade = "不及格"

        suggestions = []
        for dim, score_val in scores.items():
            if score_val < 6:
                dim_name = self.DIMENSIONS[dim]["name"]
                suggestions.append(f"{dim_name}偏低({score_val}分)：{comments[dim]}")

        word_count = self.count_words(text)
        platform_compliant, compliance_issues = self.check_platform_compliance(text, word_count)
        for issue in compliance_issues:
            suggestions.append(f"[平台合规]{issue}")

        revision_needed = total_score < 7.0 or any(s < 5 for s in scores.values()) or not platform_compliant

        result = EvaluationResult(
            chapter=chapter_num,
            title=title,
            scores=scores,
            weights=weights,
            total_score=round(total_score, 2),
            grade=grade,
            passed=total_score >= 7.0 and platform_compliant,
            platform=self.platform,
            platform_compliant=platform_compliant,
            suggestions=suggestions,
            revision_needed=revision_needed,
            revision_count=0
        )

        self.evaluation_history.append(result)
        return result

    def generate_report(self, result: EvaluationResult) -> str:
        """生成评估报告"""
        report = []
        report.append("=" * 60)
        report.append(f"《{result.title}》质量评估报告 v4.0")
        report.append("=" * 60)
        report.append(f"\n【基本信息】")
        report.append(f"  章节：第{result.chapter}章")
        report.append(f"  目标平台：{result.platform}")
        report.append(f"  总分：{result.total_score}/10")
        report.append(f"  等级：{result.grade}")
        report.append(f"  结果：{'✓ 通过' if result.passed else '✗ 需修改'}")
        report.append(f"  平台合规：{'✓ 符合' if result.platform_compliant else '✗ 不符合'}")

        report.append(f"\n【分项评分】")
        for dim, score in result.scores.items():
            dim_name = self.DIMENSIONS[dim]["name"]
            weight_pct = int(result.weights[dim] * 100)
            bar = "█" * int(score) + "░" * (10 - int(score))
            report.append(f"  {dim_name:10s} [{bar}] {score:.1f}分 (权重{weight_pct}%)")

        if result.suggestions:
            report.append(f"\n【改进建议】")
            for i, sug in enumerate(result.suggestions, 1):
                report.append(f"  {i}. {sug}")

        report.append("\n" + "=" * 60)
        return "\n".join(report)

    def to_json(self, result: EvaluationResult) -> str:
        """导出为JSON"""
        return json.dumps(asdict(result), ensure_ascii=False, indent=2)

    @staticmethod
    def get_platform_list() -> List[str]:
        """获取支持的平台列表"""
        return list(PLATFORM_CONFIGS.keys())

    @staticmethod
    def get_platform_config(platform: str) -> Dict:
        """获取平台配置"""
        return PLATFORM_CONFIGS.get(platform, PLATFORM_CONFIGS["起点中文网"])


if __name__ == "__main__":
    print("=" * 60)
    print("小说质量评估器 v5.0 - Meme数据库集成版")
    print("=" * 60)
    print("\n支持的平台：")
    for i, platform in enumerate(QualityEvaluator.get_platform_list(), 1):
        config = QualityEvaluator.get_platform_config(platform)
        print(f"  {i}. {platform}")
        print(f"     - 每章目标字数: {config['target_chapter_words']}字")
        print(f"     - 日更最低要求: {config['daily_update_min']}字")
        print(f"     - 签约门槛: {config['sign_threshold_words']}字")
        print()

    print("\n" + "=" * 60)
    print("评估维度 v4.5 (共20项)")
    print("=" * 60)
    for dim, info in QualityEvaluator.DIMENSIONS.items():
        print(f"  {info['name']:12s} - 权重{info['weight']*100:.0f}%")
