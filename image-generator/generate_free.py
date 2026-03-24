#!/usr/bin/env python3
"""
免费生图工具 - 使用 Trae 内置 API
"""

import sys
import urllib.parse
from pathlib import Path


def generate_image(prompt: str, image_size: str = "landscape_16_9", output_dir: str = "./generated_images"):
    """
    生成图片
    
    image_size 可选值:
    - square_hd
    - square
    - portrait_4_3
    - portrait_16_9
    - landscape_4_3
    - landscape_16_9 (默认，适合公众号封面)
    """
    
    prompt_encoded = urllib.parse.quote(prompt)
    
    image_url = f"https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt={prompt_encoded}&image_size={image_size}"
    
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    print("=" * 70)
    print("🎨 免费生图工具")
    print("=" * 70)
    print(f"📝 描述: {prompt}")
    print(f"📐 尺寸: {image_size}")
    print("=" * 70)
    print(f"\n🖼️  图片地址:")
    print(image_url)
    print("\n" + "=" * 70)
    print("💡 使用说明:")
    print("1. 复制上面的图片地址")
    print("2. 在浏览器中打开查看图片")
    print("3. 右键保存图片到本地")
    print("4. 上传到公众号使用")
    print("=" * 70)
    
    return image_url


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使用方法: python generate_free.py '图片描述' [尺寸]")
        print("\n示例:")
        print("  python generate_free.py '一只可爱的猫咪'")
        print("  python generate_free.py '一个程序员的办公桌' landscape_16_9")
        print("\n尺寸可选: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9")
        sys.exit(1)
    
    prompt = sys.argv[1]
    image_size = sys.argv[2] if len(sys.argv) > 2 else "landscape_16_9"
    
    generate_image(prompt, image_size)
