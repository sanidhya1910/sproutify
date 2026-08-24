"""Generate per-event photographic images for the three Mumbai events, plus
a clean regeneration of home.narrative.4 (the earlier version had garbled
pseudo-text on the sorting bins).

These are NOT category-art manifest slots — they're per-event `imageUrl`
values, set directly in Postgres after generation, matching how EventForm's
imageUrl override already works (AssetImage renders `override` above the
manifest slot).
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from gen_assets import build_prompt, submit, wait_for, download, RAW_DIR, PEOPLE_DIRECTION, NEGATIVE

JOBS = [
    (
        "event_juhu_beach_cleanup",
        "Wide documentary photograph of Indian volunteers doing a beach cleanup at Juhu "
        "Beach, Mumbai, mid-morning light, city skyline with high-rise buildings faintly "
        "visible in the hazy background, volunteers picking up litter into large bags along "
        "the tideline, " + PEOPLE_DIRECTION +
        "candid photojournalism style, warm natural light, shallow crisp focus on the "
        "volunteers, wide-angle documentary composition, high detail",
    ),
    (
        "event_aarey_plantation",
        "Documentary photograph of Indian volunteers planting tree saplings on a sloped "
        "forest clearing at Aarey Colony, Mumbai, dense green tree cover in the background, "
        "one volunteer kneeling and firming soil around a young sapling while another holds "
        "a small stack of saplings nearby, " + PEOPLE_DIRECTION +
        "overcast monsoon-adjacent natural light, rich green tones, documentary "
        "photojournalism style, high detail",
    ),
    (
        "event_powai_ewaste",
        "Documentary photograph of Indian student volunteers at an outdoor e-waste "
        "collection table beside a lake promenade in Mumbai, old phones and small "
        "electronics being logged into plastic crates on a folding table, a calm lake and "
        "a stone retaining wall visible behind them, " + PEOPLE_DIRECTION +
        "natural daylight, muted warm palette, documentary photojournalism style, high "
        "detail",
    ),
]

def main():
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    os.makedirs(RAW_DIR, exist_ok=True)
    for i, (name, prompt) in enumerate(JOBS):
        if only and name not in only:
            continue
        seed = 900000 + i * 6427
        graph = build_prompt(prompt, NEGATIVE, 1152, 640, seed)
        print(f"[{name}] submitting seed={seed}...")
        res = submit(graph)
        if res.get("node_errors"):
            print("  NODE ERRORS:", res["node_errors"])
            continue
        hist = wait_for(res["prompt_id"])
        print("  status:", hist.get("status", {}).get("status_str"))
        imgs = hist.get("outputs", {}).get("127", {}).get("images", [])
        if not imgs:
            print("  NO OUTPUT")
            continue
        out = os.path.join(RAW_DIR, f"{name}.png")
        download(imgs[0], out)
        print("  raw ->", out)

if __name__ == "__main__":
    main()
