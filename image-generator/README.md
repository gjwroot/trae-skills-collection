# 🎨 生图模型接入模块

灵活的生图 API 接入工具，支持多种主流生图模型。

## ✨ 支持的模型

| 模型 | 提供商 | 说明 |
| --- | --- | --- |
| DALL-E 3 | OpenAI | 高质量，适合创意设计 |
| DALL-E 2 | OpenAI | 性价比高，快速生成 |
| Stable Diffusion XL | Stability AI | 可定制性强 |
| Midjourney | (待接入) | 艺术感强 |

## 🚀 快速开始

### 1. 安装依赖

```bash
cd image-generator
pip install -r requirements.txt
```

### 2. 配置 API Key

复制配置示例：

```bash
cp config.example.env .env
```

编辑 `.env`，填入你的 API Key：

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 运行示例

```bash
python example.py
```

## 💻 代码使用

### 基本用法

```python
from generator import ImageGenerator, ImageProvider, ImageSize

generator = ImageGenerator(
    provider=ImageProvider.OPENAI_DALL_E3
)

results = generator.generate(
    prompt="一只可爱的猫咪",
    size=ImageSize.SQUARE_1024,
    num_images=1
)

for result in results:
    if result.success:
        print(f"图片已保存: {result.image_url}")
```

### 公众号封面图（推荐尺寸）

```python
results = generator.generate(
    prompt="你的封面图描述",
    size=ImageSize.LANDSCAPE_1792_1024,  # 1792x1024 适合公众号
    style="vivid",
    filename_prefix="wechat_cover"
)
```

### 切换模型

```python
# 使用 DALL-E 2
generator = ImageGenerator(provider=ImageProvider.OPENAI_DALL_E2)

# 使用 Stable Diffusion
generator = ImageGenerator(provider=ImageProvider.STABILITY_SD)
```

## 📐 图片尺寸参考

| 尺寸 | 适用场景 |
| --- | --- |
| 1024x1024 | 通用方形图 |
| 1792x1024 | 公众号封面（推荐）⭐ |
| 1024x1792 | 竖屏海报 |
| 1920x1080 | 宽屏视频封面 |

## 🎯 为「分支人生」公众号定制的提示词

### 封面图通用提示词

```
一个程序员的办公桌，旁边有绿植，
电脑屏幕上显示 Git 分支图，
温暖的阳光从窗户照进来，
温馨、治愈、极简风格，
适合做公众号封面图
```

### 技术主题

```
代码编辑器界面，显示 Python 或 JavaScript 代码，
旁边有一杯咖啡，台灯暖光，
深色主题，科技感但不冰冷，
极简风格
```

### 生活主题

```
温馨的房间角落，
有绿植、有阳光、有笔记本，
生活气息，治愈风格，
适合分享日常
```

## 📝 提示词编写技巧

1. **主体 + 环境 + 风格**
2. **具体细节**（光线、颜色、视角）
3. **用途说明**（封面图、插图等）

## ⚙️ 配置说明

### 环境变量

| 变量名 | 说明 |
| --- | --- |
| OPENAI_API_KEY | OpenAI API Key |
| STABILITY_API_KEY | Stability AI API Key |

## 📄 License

MIT
