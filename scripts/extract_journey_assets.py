#!/usr/bin/env python3
"""Extract Journey week scenes and mascot/decoration sprites from the source sheet.

Does not modify the original sheet. Re-run if crop boxes need adjustment.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SOURCE = Path(
    "/home/ubuntu/.cursor/projects/workspace/assets/faf52274-0446-4726-87d5-a4a0e87db407.png"
)
OUT_DIR = Path("/workspace/assets/images/app/journey")
CONTACT_PATH = Path("/opt/cursor/artifacts/journey_assets_contact.png")

# Landscape: five equal rects. Measured gutters / label band on the 1536x1024 sheet.
# Content columns (solid interior): 13-303, 320-607, 624-910, 926-1216, 1232-1523
# Landscape rows: y=13..732; labels start ~y=748. Inset past rounded corners.
BG_Y0 = 16
BG_HEIGHT = 712  # y=16..727
BG_WIDTH = 286
BACKGROUND_BOXES = {
    "journey-days-01-07.png": (15, BG_Y0, BG_WIDTH, BG_HEIGHT),
    "journey-days-08-14.png": (321, BG_Y0, BG_WIDTH, BG_HEIGHT),
    "journey-days-15-21.png": (624, BG_Y0, BG_WIDTH, BG_HEIGHT),
    "journey-days-22-28.png": (928, BG_Y0, BG_WIDTH, BG_HEIGHT),
    "journey-days-29-30.png": (1235, BG_Y0, BG_WIDTH, BG_HEIGHT),
}

# Search windows for bottom-row sprites (sheet coords). Non-overlapping.
SPRITE_WINDOWS = {
    "journey-mascot-idle.png": (20, 790, 170, 965),
    "journey-mascot-walk.png": (185, 790, 340, 965),
    "journey-mascot-look.png": (350, 790, 505, 965),
    "journey-mascot-sit.png": (505, 790, 708, 965),
    "journey-mascot-celebrate.png": (708, 788, 888, 965),
    "journey-checkpoint-sign.png": (885, 788, 1078, 965),
    "journey-rock.png": (1078, 800, 1245, 965),
    "journey-flowers.png": (1245, 820, 1368, 965),
    "journey-fence.png": (1365, 820, 1534, 965),
}

# Flood only near-sheet cream from the crop edges. Soft-feather nearby fringe.
FLOOD_DIST = 9.0
SOFT_DIST = 22.0
PAD = 2


def color_distance(rgb: np.ndarray, bg: np.ndarray) -> np.ndarray:
    return np.sqrt(((rgb.astype(np.float32) - bg.astype(np.float32)) ** 2).sum(axis=-1))


def flood_background(distance: np.ndarray, flood_dist: float) -> np.ndarray:
    """True where a pixel is connected to the crop edge through near-bg colors."""
    height, width = distance.shape
    is_bg = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def consider(row: int, col: int) -> None:
        if is_bg[row, col]:
            return
        if distance[row, col] <= flood_dist:
            is_bg[row, col] = True
            queue.append((row, col))

    for col in range(width):
        consider(0, col)
        consider(height - 1, col)
    for row in range(height):
        consider(row, 0)
        consider(row, width - 1)

    while queue:
        row, col = queue.popleft()
        for d_row, d_col in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            next_row = row + d_row
            next_col = col + d_col
            if 0 <= next_row < height and 0 <= next_col < width:
                consider(next_row, next_col)
    return is_bg


def has_bg_neighbor(is_bg: np.ndarray) -> np.ndarray:
    padded = np.pad(is_bg, 1, mode="constant", constant_values=False)
    neighbor = (
        padded[:-2, 1:-1]
        | padded[2:, 1:-1]
        | padded[1:-1, :-2]
        | padded[1:-1, 2:]
        | padded[:-2, :-2]
        | padded[:-2, 2:]
        | padded[2:, :-2]
        | padded[2:, 2:]
    )
    return neighbor


def key_enclosed_sheet_holes(
    distance: np.ndarray,
    is_bg: np.ndarray,
    flood_dist: float,
    min_pixels: int = 40,
) -> np.ndarray:
    """Key large cream pockets that edge-flood cannot reach (e.g. between sign posts).

    Tiny interior matches are left alone so cream/white artwork (flower petals,
    hat weave, sign board) is not punched out and then eaten by the AA fringe.
    """
    height, width = distance.shape
    remaining = (distance <= flood_dist) & (~is_bg)
    if not remaining.any():
        return is_bg

    visited = np.zeros_like(remaining)
    for start_row, start_col in zip(*np.where(remaining), strict=False):
        if visited[start_row, start_col]:
            continue
        stack = [(int(start_row), int(start_col))]
        component: list[tuple[int, int]] = []
        while stack:
            row, col = stack.pop()
            if visited[row, col] or not remaining[row, col]:
                continue
            visited[row, col] = True
            component.append((row, col))
            for d_row, d_col in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                next_row = row + d_row
                next_col = col + d_col
                if 0 <= next_row < height and 0 <= next_col < width:
                    stack.append((next_row, next_col))
        if len(component) < min_pixels:
            continue
        for row, col in component:
            is_bg[row, col] = True
    return is_bg


def key_sprite(rgb: np.ndarray, bg: np.ndarray, punch_enclosed_holes: bool = False) -> np.ndarray:
    """Return RGBA with sheet cream keyed to true alpha. Interiors stay opaque."""
    distance = color_distance(rgb, bg)
    is_bg = flood_background(distance, FLOOD_DIST)
    if punch_enclosed_holes:
        is_bg = key_enclosed_sheet_holes(distance, is_bg, FLOOD_DIST)
    neighbor = has_bg_neighbor(is_bg)

    alpha = np.full(distance.shape, 255, dtype=np.uint8)
    alpha[is_bg] = 0

    fringe = (~is_bg) & neighbor & (distance < SOFT_DIST)
    if fringe.any():
        # Smooth AA: closer to sheet cream => more transparent.
        t = (distance[fringe] - FLOOD_DIST) / (SOFT_DIST - FLOOD_DIST)
        t = np.clip(t, 0.0, 1.0)
        alpha[fringe] = (t * 255.0).astype(np.uint8)

    rgba = np.dstack([rgb, alpha])
    return rgba


def content_bbox(alpha: np.ndarray, pad: int = PAD) -> tuple[int, int, int, int]:
    rows = np.any(alpha > 8, axis=1)
    cols = np.any(alpha > 8, axis=0)
    if not rows.any() or not cols.any():
        raise RuntimeError("Sprite keying removed all content")
    y0, y1 = np.where(rows)[0][[0, -1]]
    x0, x1 = np.where(cols)[0][[0, -1]]
    height, width = alpha.shape
    x0 = max(0, int(x0) - pad)
    y0 = max(0, int(y0) - pad)
    x1 = min(width - 1, int(x1) + pad)
    y1 = min(height - 1, int(y1) + pad)
    return x0, y0, x1 + 1, y1 + 1


def sample_sheet_bg(arr: np.ndarray) -> np.ndarray:
    # Known empty sheet corner (above panels / gutters).
    patch = arr[0:10, 0:10].astype(np.float32)
    return patch.mean(axis=(0, 1))


def extract_backgrounds(sheet: Image.Image) -> list[tuple[str, Image.Image, tuple[int, int, int, int]]]:
    results = []
    for name, (x0, y0, width, height) in BACKGROUND_BOXES.items():
        box = (x0, y0, x0 + width, y0 + height)
        crop = sheet.crop(box)
        if crop.size != (BG_WIDTH, BG_HEIGHT):
            raise RuntimeError(f"{name} size {crop.size} != {BG_WIDTH}x{BG_HEIGHT}")
        path = OUT_DIR / name
        crop.save(path, "PNG")
        results.append((name, crop, box))
        print(f"BG {name}: crop={box} size={crop.size} mode={crop.mode}")
    return results


def extract_sprites(sheet: Image.Image, bg: np.ndarray) -> list[tuple[str, Image.Image, tuple[int, int, int, int]]]:
    arr = np.array(sheet)
    results = []
    for name, (x0, y0, x1, y1) in SPRITE_WINDOWS.items():
        window = arr[y0:y1, x0:x1]
        punch_holes = name == "journey-checkpoint-sign.png"
        rgba = key_sprite(window, bg, punch_enclosed_holes=punch_holes)
        left, top, right, bottom = content_bbox(rgba[:, :, 3])
        tight = rgba[top:bottom, left:right]
        image = Image.fromarray(tight, "RGBA")
        path = OUT_DIR / name
        image.save(path, "PNG")
        sheet_box = (x0 + left, y0 + top, x0 + right, y0 + bottom)
        results.append((name, image, sheet_box))
        alpha = tight[:, :, 3]
        print(
            f"SP {name}: window=({x0},{y0},{x1},{y1}) "
            f"sheet_box={sheet_box} size={image.size} "
            f"alpha0={(alpha == 0).sum()} opaque={(alpha == 255).sum()} "
            f"partial={((alpha > 0) & (alpha < 255)).sum()}"
        )
    return results


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


def build_contact_sheet(
    backgrounds: list[tuple[str, Image.Image, tuple[int, int, int, int]]],
    sprites: list[tuple[str, Image.Image, tuple[int, int, int, int]]],
) -> None:
    tile_w, tile_h = 220, 320
    label_h = 36
    cols = 5
    rows = 3
    pad = 16
    canvas_w = cols * tile_w + (cols + 1) * pad
    canvas_h = rows * (tile_h + label_h) + (rows + 1) * pad + 28
    canvas = Image.new("RGB", (canvas_w, canvas_h), (248, 244, 236))
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
    except OSError:
        font = ImageFont.load_default()
        title_font = font

    items: list[tuple[str, Image.Image]] = [(n, im) for n, im, _ in backgrounds] + [
        (n, im) for n, im, _ in sprites
    ]

    draw.text((pad, 8), "Journey extracted assets (QA contact sheet)", fill=(60, 50, 40), font=title_font)

    for index, (name, image) in enumerate(items):
        row, col = divmod(index, cols)
        x = pad + col * (tile_w + pad)
        y = 28 + pad + row * (tile_h + label_h + pad)
        tile = checkerboard((tile_w, tile_h))
        preview = image.convert("RGBA")
        preview.thumbnail((tile_w - 12, tile_h - 12), Image.Resampling.LANCZOS)
        px = (tile_w - preview.width) // 2
        py = (tile_h - preview.height) // 2
        tile_rgba = tile.convert("RGBA")
        tile_rgba.paste(preview, (px, py), preview if preview.mode == "RGBA" else None)
        canvas.paste(tile_rgba.convert("RGB"), (x, y))
        label = name.replace("journey-", "").replace(".png", "")
        draw.rectangle((x, y + tile_h, x + tile_w, y + tile_h + label_h), fill=(252, 247, 239))
        draw.text((x + 6, y + tile_h + 10), label, fill=(50, 44, 36), font=font)

    CONTACT_PATH.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(CONTACT_PATH, "PNG")
    print(f"Contact sheet: {CONTACT_PATH} {canvas.size}")


def print_qa(out_dir: Path) -> None:
    print("\n=== Extracted file QA ===")
    iphone_13 = (1170, 2532)
    iphone_14_pro = (1290, 2796)
    for path in sorted(out_dir.glob("*.png")):
        image = Image.open(path)
        arr = np.array(image)
        has_alpha = image.mode == "RGBA"
        zero_alpha = int((arr[:, :, 3] == 0).sum()) if has_alpha else 0
        print(
            f"{path.name:32s} {image.width}x{image.height} mode={image.mode} "
            f"has_alpha={has_alpha} alpha0={zero_alpha}"
        )
        if path.name.startswith("journey-days-"):
            scale_13 = min(iphone_13[0] / image.width, iphone_13[1] / image.height)
            scale_14 = min(iphone_14_pro[0] / image.width, iphone_14_pro[1] / image.height)
            print(
                f"  vs 1170x2532: would need {scale_13:.2f}x upscale "
                f"({image.width}/{iphone_13[0]} w, {image.height}/{iphone_13[1]} h)"
            )
            print(
                f"  vs 1290x2796: would need {scale_14:.2f}x upscale "
                f"({image.width}/{iphone_14_pro[0]} w, {image.height}/{iphone_14_pro[1]} h)"
            )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sheet = Image.open(SOURCE)
    print(f"Source: {SOURCE}")
    print(f"Source size: {sheet.width}x{sheet.height} mode={sheet.mode}")
    arr = np.array(sheet.convert("RGB"))
    bg = sample_sheet_bg(arr)
    print(f"Sheet background sample RGB: {tuple(round(float(c), 2) for c in bg)}")

    backgrounds = extract_backgrounds(sheet.convert("RGB"))
    sprites = extract_sprites(sheet.convert("RGB"), bg)
    build_contact_sheet(backgrounds, sprites)
    print_qa(OUT_DIR)


if __name__ == "__main__":
    main()
