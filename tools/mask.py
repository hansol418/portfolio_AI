"""캡처 원본(assets-src/, 저장소 제외)을 가린 뒤 assets/img/에 webp로 저장한다.

실행: py -3.11 tools/mask.py
가릴 위치는 tools/masks.json에 원본 픽셀 좌표로 적는다.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src"
OUT = ROOT / "assets" / "img"
MAX_WIDTH = 1600


def hide(image: Image.Image, box: list[int]) -> None:
    """글자를 읽을 수 없게 모자이크한 뒤 흐리게 덮는다."""
    region = image.crop(box)
    w, h = region.size
    # 블록을 40px로 크게 잡아야 휴대폰 캡처처럼 큰 글자도 읽히지 않는다.
    small = region.resize((max(1, w // 40), max(1, h // 40)), Image.Resampling.BILINEAR)
    image.paste(small.resize((w, h), Image.Resampling.NEAREST).filter(ImageFilter.GaussianBlur(12)), box)


def process(src: Path, boxes: list[list[int]]) -> Path:
    image = Image.open(src).convert("RGB")
    for box in boxes:
        x0, y0, x1, y1 = box
        if not (0 <= x0 < x1 <= image.width and 0 <= y0 < y1 <= image.height):
            raise ValueError(f"{src.name}: 좌표 {box}가 이미지({image.width}x{image.height}) 밖입니다. tools/masks.json을 고치세요.")
        hide(image, box)
    if image.width > MAX_WIDTH:
        image = image.resize((MAX_WIDTH, round(image.height * MAX_WIDTH / image.width)), Image.Resampling.LANCZOS)
    dest = OUT / src.parent.name / (src.stem + ".webp")
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, "WEBP", quality=82)
    return dest


def main() -> int:
    if not SRC.exists():
        print(f"원본 폴더가 없습니다: {SRC}. 캡처를 assets-src/<프로젝트>/NN.png로 먼저 넣으세요.", file=sys.stderr)
        return 1
    masks = {k: v for k, v in json.loads((ROOT / "tools" / "masks.json").read_text(encoding="utf-8")).items() if not k.startswith("_")}
    sources = sorted(SRC.glob("*/*.png"))
    for src in sources:
        process(src, masks.get(f"{src.parent.name}/{src.stem}", []))
    unknown = set(masks) - {f"{s.parent.name}/{s.stem}" for s in sources}
    if unknown:
        print(f"masks.json에 있지만 원본이 없는 항목: {sorted(unknown)}", file=sys.stderr)
        return 1
    print(f"{len(sources)}장 저장, 가린 이미지 {len(masks)}장")
    return 0


if __name__ == "__main__":
    sys.exit(main())
