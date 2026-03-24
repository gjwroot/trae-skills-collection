import os
import requests
import base64
from typing import Optional, Dict, Any, List
from enum import Enum
from dataclasses import dataclass
from pathlib import Path


class ImageProvider(Enum):
    OPENAI_DALL_E3 = "openai_dalle3"
    OPENAI_DALL_E2 = "openai_dalle2"
    STABILITY_SD = "stability_sd"
    MIDJOURNEY = "midjourney"


class ImageSize(Enum):
    SQUARE_1024 = "1024x1024"
    SQUARE_512 = "512x512"
    SQUARE_256 = "256x256"
    LANDSCAPE_1792_1024 = "1792x1024"
    PORTRAIT_1024_1792 = "1024x1792"
    WIDESCREEN_16_9 = "1920x1080"


@dataclass
class ImageResult:
    success: bool
    image_url: Optional[str] = None
    image_data: Optional[bytes] = None
    error_message: Optional[str] = None
    provider: Optional[ImageProvider] = None
    prompt: Optional[str] = None


class ImageGenerator:
    def __init__(
        self,
        provider: ImageProvider = ImageProvider.OPENAI_DALL_E3,
        api_key: Optional[str] = None,
        output_dir: str = "./generated_images"
    ):
        self.provider = provider
        self.api_key = api_key or self._get_default_api_key()
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def _get_default_api_key(self) -> Optional[str]:
        if self.provider in [ImageProvider.OPENAI_DALL_E3, ImageProvider.OPENAI_DALL_E2]:
            return os.getenv("OPENAI_API_KEY")
        elif self.provider == ImageProvider.STABILITY_SD:
            return os.getenv("STABILITY_API_KEY")
        return None

    def generate(
        self,
        prompt: str,
        size: ImageSize = ImageSize.SQUARE_1024,
        style: Optional[str] = None,
        num_images: int = 1,
        save_to_file: bool = True,
        filename_prefix: str = "image"
    ) -> List[ImageResult]:
        results = []

        if self.provider in [ImageProvider.OPENAI_DALL_E3, ImageProvider.OPENAI_DALL_E2]:
            results = self._generate_openai(prompt, size, style, num_images)
        elif self.provider == ImageProvider.STABILITY_SD:
            results = self._generate_stability(prompt, size, num_images)
        else:
            results = [ImageResult(
                success=False,
                error_message=f"Provider {self.provider} not implemented yet"
            )]

        if save_to_file:
            for i, result in enumerate(results):
                if result.success and result.image_data:
                    filename = f"{filename_prefix}_{i+1}.png"
                    filepath = self.output_dir / filename
                    with open(filepath, "wb") as f:
                        f.write(result.image_data)
                    result.image_url = str(filepath.absolute())

        return results

    def _generate_openai(
        self,
        prompt: str,
        size: ImageSize,
        style: Optional[str],
        num_images: int
    ) -> List[ImageResult]:
        results = []

        if not self.api_key:
            return [ImageResult(
                success=False,
                error_message="OpenAI API key not found. Set OPENAI_API_KEY environment variable."
            )]

        model = "dall-e-3" if self.provider == ImageProvider.OPENAI_DALL_E3 else "dall-e-2"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        for i in range(num_images):
            try:
                data = {
                    "model": model,
                    "prompt": prompt,
                    "n": 1,
                    "size": size.value,
                    "response_format": "b64_json"
                }

                if style and model == "dall-e-3":
                    data["style"] = style

                response = requests.post(
                    "https://api.openai.com/v1/images/generations",
                    headers=headers,
                    json=data,
                    timeout=60
                )

                if response.status_code == 200:
                    result_data = response.json()
                    image_b64 = result_data["data"][0]["b64_json"]
                    image_data = base64.b64decode(image_b64)

                    results.append(ImageResult(
                        success=True,
                        image_data=image_data,
                        provider=self.provider,
                        prompt=prompt
                    ))
                else:
                    results.append(ImageResult(
                        success=False,
                        error_message=f"API Error: {response.status_code} - {response.text}",
                        provider=self.provider,
                        prompt=prompt
                    ))

            except Exception as e:
                results.append(ImageResult(
                    success=False,
                    error_message=f"Exception: {str(e)}",
                    provider=self.provider,
                    prompt=prompt
                ))

        return results

    def _generate_stability(
        self,
        prompt: str,
        size: ImageSize,
        num_images: int
    ) -> List[ImageResult]:
        results = []

        if not self.api_key:
            return [ImageResult(
                success=False,
                error_message="Stability API key not found. Set STABILITY_API_KEY environment variable."
            )]

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "image/png"
        }

        width, height = map(int, size.value.split("x"))

        for i in range(num_images):
            try:
                data = {
                    "text_prompts": [{"text": prompt}],
                    "cfg_scale": 7,
                    "height": height,
                    "width": width,
                    "steps": 30,
                    "samples": 1
                }

                response = requests.post(
                    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                    headers=headers,
                    json=data,
                    timeout=60
                )

                if response.status_code == 200:
                    results.append(ImageResult(
                        success=True,
                        image_data=response.content,
                        provider=self.provider,
                        prompt=prompt
                    ))
                else:
                    results.append(ImageResult(
                        success=False,
                        error_message=f"API Error: {response.status_code} - {response.text}",
                        provider=self.provider,
                        prompt=prompt
                    ))

            except Exception as e:
                results.append(ImageResult(
                    success=False,
                    error_message=f"Exception: {str(e)}",
                    provider=self.provider,
                    prompt=prompt
                ))

        return results
