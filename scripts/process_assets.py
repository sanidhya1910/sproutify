import os
from PIL import Image

ROOT = os.path.dirname(__file__)
RAW = os.path.join(ROOT, "_raw")
PUBLIC = os.path.join(ROOT, "..", "public")

# raw_filename -> (final_w, final_h, out_rel_path, quality)
JOBS = [
    ("home_hero.png", 2560, 1097, "scenes/hero.webp", 82),
    ("home_narrative_1.png", 720, 576, "scenes/narrative-1.webp", 82),
    ("home_narrative_2.png", 720, 576, "scenes/narrative-2.webp", 82),
    ("home_narrative_3.png", 720, 576, "scenes/narrative-3.webp", 82),
    ("home_narrative_4.png", 720, 576, "scenes/narrative-4.webp", 82),
    ("about_story.png", 1200, 675, "scenes/about-story.webp", 82),
    ("event_type_cleanup.png", 720, 400, "events/type-cleanup.webp", 90),
    ("event_type_plantation.png", 720, 400, "events/type-plantation.webp", 90),
    ("event_type_ewaste.png", 720, 400, "events/type-ewaste.webp", 90),
    ("event_type_restoration.png", 720, 400, "events/type-restoration.webp", 90),
    ("event_type_community.png", 720, 400, "events/type-community.webp", 90),
    ("event_type_other.png", 720, 400, "events/type-other.webp", 90),
]

def cover_resize(img, target_w, target_h):
    src_w, src_h = img.size
    src_ratio = src_w / src_h
    dst_ratio = target_w / target_h
    if src_ratio > dst_ratio:
        # source is wider than target -> match height, crop width
        new_h = target_h
        new_w = round(src_ratio * new_h)
    else:
        new_w = target_w
        new_h = round(new_w / src_ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return img.crop((left, top, left + target_w, top + target_h))

def main():
    for raw_name, w, h, out_rel, quality in JOBS:
        src_path = os.path.join(RAW, raw_name)
        if not os.path.exists(src_path):
            print(f"MISSING {src_path}")
            continue
        img = Image.open(src_path).convert("RGB")
        out = cover_resize(img, w, h)
        out_path = os.path.normpath(os.path.join(PUBLIC, out_rel))
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        out.save(out_path, "WEBP", quality=quality, method=6)
        size_kb = os.path.getsize(out_path) / 1024
        print(f"{out_rel}: {w}x{h} q{quality} -> {size_kb:.0f}KB")

if __name__ == "__main__":
    main()
