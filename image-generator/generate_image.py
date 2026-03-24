#!/usr/bin/env python3
"""
快速生图命令行工具
"""

import sys
import argparse

from generator import ImageGenerator, ImageProvider, ImageSize


def main():
    parser = argparse.ArgumentParser(description="生图工具")
    parser.add_argument("prompt", help="图片描述")
    parser.add_argument("--provider", "-p", default="openai_dalle3", 
                       choices=["openai_dalle3", "openai_dalle2", "stability_sd"],
                       help="生图模型提供商")
    parser.add_argument("--size", "-s", default="1792x1024",
                       choices=["1024x1024", "1792x1024", "1024x1792", "1920x1080"],
                       help="图片尺寸")
    parser.add_argument("--style", default="vivid",
                       choices=["vivid", "natural"],
                       help="图片风格（仅 DALL-E 3）")
    parser.add_argument("--num", "-n", type=int, default=1,
                       help="生成图片数量")
    parser.add_argument("--output", "-o", default="./generated_images",
                       help="输出目录")
    parser.add_argument("--prefix", default="image",
                       help="文件名前缀")

    args = parser.parse_args()

    provider_map = {
        "openai_dalle3": ImageProvider.OPENAI_DALL_E3,
        "openai_dalle2": ImageProvider.OPENAI_DALL_E2,
        "stability_sd": ImageProvider.STABILITY_SD
    }

    size_map = {
        "1024x1024": ImageSize.SQUARE_1024,
        "1792x1024": ImageSize.LANDSCAPE_1792_1024,
        "1024x1792": ImageSize.PORTRAIT_1024_1792,
        "1920x1080": ImageSize.WIDESCREEN_16_9
    }

    generator = ImageGenerator(
        provider=provider_map[args.provider],
        output_dir=args.output
    )

    print("=" * 60)
    print("🎨 生图工具")
    print("=" * 60)
    print(f"📝 Prompt: {args.prompt}")
    print(f"🖼️  模型: {args.provider}")
    print(f"📐 尺寸: {args.size}")
    print(f"🎨 风格: {args.style}")
    print(f"🖼️  数量: {args.num}")
    print("=" * 60)

    results = generator.generate(
        prompt=args.prompt,
        size=size_map[args.size],
        style=args.style,
        num_images=args.num,
        filename_prefix=args.prefix
    )

    success_count = 0
    for i, result in enumerate(results):
        if result.success:
            success_count += 1
            print(f"\n✅ 图片 {i+1}/{args.num} 生成成功！")
            print(f"📍 保存路径: {result.image_url}")
        else:
            print(f"\n❌ 图片 {i+1}/{args.num} 生成失败")
            print(f"📛 错误: {result.error_message}")

    print("\n" + "=" * 60)
    print(f"完成！成功: {success_count}/{args.num}")
    print("=" * 60)

    return 0 if success_count == args.num else 1


if __name__ == "__main__":
    sys.exit(main())
