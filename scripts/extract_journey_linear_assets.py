#!/usr/bin/env python3
"""Extract linear Journey sprites from the new mockup/asset sheet.

The sheet already has true alpha (transparent, not cream/black). Crops are
tight content boxes so labels and neighboring art stay out of the PNGs.
Does not bake sign copy — blank board only.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SOURCE = Path(
    "/home/ubuntu/.cursor/projects/workspace/assets/aaf8b9df-43e7-44ed-b733-903465e96e9f.png"
)
OUT_DIR = Path("/workspace/assets/images/app/journey")
CONTACT_PATH = Path("/opt/cursor/artifacts/journey_linear_assets_contact.png")

# Connected-component windows measured on the 1536x1024 sheet (inclusive).
# Values are (x0, y0, x1, y1) in sheet pixels, then tightened by alpha bbox.
SPRITE_WINDOWS: dict[str, tuple[int, int, int, int]] = {
    "journey-mascot-idle.png": (24, 56, 107, 164),
    "journey-mascot-walk.png": (127, 62, 204, 164),
    "journey-mascot-walk-2.png": (230, 59, 308, 164),
    "journey-mascot-walk-3.png": (329, 58, 403, 164),
    "journey-mascot-walk-4.png": (430, 57, 510, 164),
    "journey-mascot-look.png": (17, 237, 93, 342),
    "journey-mascot-cheer.png": (133, 228, 228, 341),
    "journey-mascot-sit.png": (229, 251, 332, 344),
    "journey-mascot-think.png": (337, 226, 414, 333),
    "journey-mascot-wave.png": (428, 219, 515, 328),
    "journey-sign.png": (27, 440, 107, 527),
    "journey-rock.png": (199, 473, 284, 521),
    "journey-bush.png": (282, 455, 342, 515),
    "journey-flowers.png": (352, 467, 404, 517),
    "journey-butterfly.png": (424, 459, 451, 486),
    "journey-grass.png": (473, 479, 509, 512),
    "journey-cloud.png": (84, 754, 143, 783),
    "journey-sun.png": (164, 728, 218, 782),
    "journey-clouds.png": (238, 736, 320, 775),
    # Start below the overlapping sun so the strip is ground + bushes only.
    "journey-ground-strip.png": (23, 786, 407, 890),
}

# Celebrate pose is the cheer sprite from this sheet.
CELEBRATE_COPY = ("journey-mascot-cheer.png", "journey-mascot-celebrate.png")

PAD = 2
ALPHA_CUTOFF = 12


def content_bbox(alpha: np.ndarray, pad: int = PAD) -> tuple[int, int, int, int]:
    rows = np.any(alpha > ALPHA_CUTOFF, axis=1)
    cols = np.any(alpha > ALPHA_CUTOFF, axis=0)
    if not rows.any() or not cols.any():
        raise RuntimeError("Sprite crop has no visible pixels")
    y0, y1 = np.where(rows)[0][[0, -1]]
    x0, x1 = np.where(cols)[0][[0, -1]]
    height, width = alpha.shape
    x0 = max(0, int(x0) - pad)
    y0 = max(0, int(y0) - pad)
    x1 = min(width - 1, int(x1) + pad)
    y1 = min(height - 1, int(y1) + pad)
    return x0, y0, x1 + 1, y1 + 1


def extract_sprite(
    sheet: Image.Image, name: str, window: tuple[int, int, int, int]
) -> tuple[str, Image.Image, tuple[int, int, int, int]]:
    x0, y0, x1, y1 = window
    crop = sheet.crop((x0, y0, x1 + 1, y1 + 1)).convert("RGBA")
    arr = np.array(crop)
    left, top, right, bottom = content_bbox(arr[:, :, 3])
    tight = arr[top:bottom, left:right]
    image = Image.fromarray(tight, "RGBA")
    path = OUT_DIR / name
    image.save(path, "PNG")
    sheet_box = (x0 + left, y0 + top, x0 + right, y0 + bottom)
    alpha = tight[:, :, 3]
    creamish = (
        (tight[:, :, 0] > 230) & (tight[:, :, 1] > 220) & (tight[:, :, 2] > 200) & (alpha > 200)
    ).sum()
    print(
        f"SP {name}: window=({x0},{y0},{x1},{y1}) sheet_box={sheet_box} "
        f"size={image.size} alpha0={(alpha == 0).sum()} opaque={(alpha == 255).sum()} "
        f"partial={((alpha > 0) & (alpha < 255)).sum()} creamish_opaque={int(creamish)}"
    )
    if image.width < 8 or image.height < 8:
        raise RuntimeError(f"{name} crop too small: {image.size}")
    return name, image, sheet_box


def checkerboard(size: tuple[int, int], cell: int = 10) -> Image.Image:
    width, height = size
    board = Image.new("RGB", size, (186, 198, 210))
    pixels = board.load()
    assert pixels is not None
    for y in range(height):
        for x in range(width):
            if ((x // cell) + (y // cell)) % 2 == 0:
                pixels[x, y] = (228, 234, 240)
    return board


def build_contact_sheet(sprites: list[tuple[str, Image.Image, tuple[int, int, int, int]]]) -> None:
    tile_w, tile_h = 200, 220
    label_h = 36
    cols = 5
    rows = 4
    pad = 14
    canvas_w = cols * tile_w + (cols + 1) * pad
    canvas_h = rows * (tile_h + label_h) + (rows + 1) * pad + 32
    canvas = Image.new("RGB", (canvas_w, canvas_h), (248, 244, 236))
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except OSError:
        font = ImageFont.load_default()
        title_font = font

    draw.text(
        (pad, 8),
        "Linear Journey extracted assets (true alpha)",
        fill=(60, 50, 40),
        font=title_font,
    )

    for index, (name, image) in enumerate((n, im) for n, im, _ in sprites):
        row, col = divmod(index, cols)
        x = pad + col * (tile_w + pad)
        y = 32 + pad + row * (tile_h + label_h + pad)
        tile = checkerboard((tile_w, tile_h))
        preview = image.convert("RGBA")
        preview.thumbnail((tile_w - 12, tile_h - 12), Image.Resampling.LANCZOS)
        px = (tile_w - preview.width) // 2
        py = (tile_h - preview.height) // 2
        tile_rgba = tile.convert("RGBA")
        tile_rgba.paste(preview, (px, py), preview)
        canvas.paste(tile_rgba.convert("RGB"), (x, y))
        label = name.replace("journey-", "").replace(".png", "")
        draw.rectangle((x, y + tile_h, x + tile_w, y + tile_h + label_h), fill=(252, 247, 239))
        draw.text((x + 6, y + tile_h + 10), f"{label} {image.width}x{image.height}", fill=(50, 44, 36), font=font)

    CONTACT_PATH.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(CONTACT_PATH, "PNG")
    print(f"Contact sheet: {CONTACT_PATH} {canvas.size}")


def print_qa(out_dir: Path, names: list[str]) -> None:
    print("\n=== Linear Journey extracted file QA ===")
    for name in names:
        path = out_dir / name
        image = Image.open(path)
        arr = np.array(image)
        has_alpha = image.mode == "RGBA"
        zero_alpha = int((arr[:, :, 3] == 0).sum()) if has_alpha else 0
        print(
            f"{path.name:32s} {image.width}x{image.height} mode={image.mode} "
            f"has_alpha={has_alpha} alpha0={zero_alpha}"
        )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sheet = Image.open(SOURCE)
    print(f"Source: {SOURCE}")
    print(f"Source size: {sheet.width}x{sheet.height} mode={sheet.mode}")

    sprites: list[tuple[str, Image.Image, tuple[int, int, int, int]]] = []
    for name, window in SPRITE_WINDOWS.items():
        sprites.append(extract_sprite(sheet, name, window))

    cheer_path = OUT_DIR / CELEBRATE_COPY[0]
    celebrate_path = OUT_DIR / CELEBRATE_COPY[1]
    Image.open(cheer_path).save(celebrate_path, "PNG")
    celebrate = Image.open(celebrate_path)
    sprites.append((CELEBRATE_COPY[1], celebrate, (0, 0, celebrate.width, celebrate.height)))
    print(f"SP {CELEBRATE_COPY[1]}: copy of {CELEBRATE_COPY[0]} size={celebrate.size}")

    build_contact_sheet(sprites)
    print_qa(OUT_DIR, [name for name, _, _ in sprites])


if __name__ == "__main__":
    main()
