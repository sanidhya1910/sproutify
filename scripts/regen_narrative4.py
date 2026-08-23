"""Regenerate home.narrative.4.

The first generation put hand-lettered signs on the sorting bins, which the
model rendered as garbled pseudo-text ("IDEVRS", "ZCERAIL"). Visible fake
lettering is the single most obvious generated-image tell, so this pass
pushes labels/signage/text hard into the negative prompt and reframes the
scene so no signage is implied.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from gen_assets import build_prompt, submit, wait_for, download, RAW_DIR, PEOPLE_DIRECTION

PROMPT = (
    "Documentary photograph of Indian volunteers kneeling around plain unmarked "
    "plastic crates, sorting collected bottles and cans by hand, close mid-shot "
    "focused on hands and crates, " + PEOPLE_DIRECTION +
    "clean uncluttered background, natural daylight, muted warm palette, "
    "documentary photojournalism style, high detail"
)

NEGATIVE = (
    "text, letters, writing, handwriting, signs, signage, labels, printed labels, "
    "placards, cardboard signs, posters, numbers, watermark, logo, brand markings, "
    "depth of field, blur, focal blur, low quality, cartoon, illustration, "
    "oversaturated, plastic skin, uncanny, out of frame, disfigured, bad anatomy, "
    "extra limbs, deformed hands, worst quality, jpeg artifacts"
)

def main():
    seed = int(sys.argv[1]) if len(sys.argv) > 1 else 720411
    graph = build_prompt(PROMPT, NEGATIVE, 896, 704, seed)
    print(f"submitting seed={seed}...")
    res = submit(graph)
    if res.get("node_errors"):
        print("NODE ERRORS:", res["node_errors"])
        return
    hist = wait_for(res["prompt_id"])
    print("status:", hist.get("status", {}).get("status_str"))
    imgs = hist.get("outputs", {}).get("127", {}).get("images", [])
    if not imgs:
        print("NO OUTPUT")
        return
    os.makedirs(RAW_DIR, exist_ok=True)
    out = os.path.join(RAW_DIR, "home_narrative_4.png")
    download(imgs[0], out)
    print("raw ->", out)

if __name__ == "__main__":
    main()
