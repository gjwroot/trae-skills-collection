#!/usr/bin/env python3
"""
生图模型使用示例
"""

import os
import sys

from generator import ImageGenerator, ImageProvider, ImageSize


def main():

    print("=" * 60)
    print("生图模型使用示例")
    print("=" * 60)

    generator = ImageGenerator(
        provider=ImageProvider.OPENAI_DALL_E3,
        output_dir="./generated_images"
    )

    prompt = (
        "一个程序员的办公桌，旁边有绿植，"
        "电脑屏幕上显示 Git 分支图，"
        "温暖的阳光从窗户照进来，"
        "温馨、治愈、极简风格，"
        "适合做公众号封面图"
    )

    print(f"\n🎨 正在生成图片...")
    print(f"📝 Prompt: {prompt}")

    results = generator.generate(
        prompt=prompt,
        size=ImageSize.LANDSCAPE_1792_1024,
        style="vivid",
        num_images=1,
        filename_prefix="branch_life_cover"
    )

    for i, result in enumerate(results):
        if result.success:
            print(f"\n✅ 图片 {i+1} 生成成功！")
            print(f"📍 保存路径: {result.image_url}")
        else:
            print(f"\n❌ 图片 {i+1} 生成失败")
            print(f"📛 错误: {result.error_message}")

    print("\n" + "=" * 60)
    print("示例完成！")
    print("=" * 60)


if __name__ == "__main__":
    main()
