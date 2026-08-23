import json, time, os, sys
import urllib.request

BASE = "http://127.0.0.1:9000"
OUT_ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
RAW_DIR = os.path.join(os.path.dirname(__file__), "_raw")
os.makedirs(RAW_DIR, exist_ok=True)

PEOPLE_DIRECTION = (
    "the volunteers are Indian people, a natural range of fair to medium "
    "skin tones (not all dark-skinned), ordinary casual clothing such as "
    "t-shirts and kurtas, candid unposed body language, real facial features, "
)

NEGATIVE = (
    "depth of field, blur, focal blur, text, watermark, logo, low quality, "
    "cartoon, illustration, oversaturated, plastic skin, uncanny, out of frame, "
    "disfigured, bad anatomy, extra limbs, deformed hands, worst quality, jpeg artifacts"
)

ILLUSTRATION_NEGATIVE = (
    "photo, photorealistic, 3d render, gradient, drop shadow, text, watermark, "
    "letters, words, low quality, blurry, noisy, faces, realistic skin"
)

# id -> (gen_w, gen_h, final_w, final_h, out_path, prompt, negative, quality, priority)
JOBS = [
    (
        "home.hero", 1536, 640, 2560, 1097, "scenes/hero.webp",
        "Wide documentary photograph of a diverse group of Indian volunteers doing "
        "a coastal cleanup at golden hour, mid-action picking up litter into bags, "
        + PEOPLE_DIRECTION +
        "natural candid framing, generous open negative space in the upper-left third "
        "of the frame for a headline overlay, warm golden sunset light, muted warm "
        "color palette, shallow crisp focus on the volunteers, wide-angle documentary "
        "photojournalism style, shot on a DSLR, 35mm lens, high detail",
        NEGATIVE, 82, True,
    ),
    (
        "home.narrative.1", 896, 704, 720, 576, "scenes/narrative-1.webp",
        "Documentary photograph of plastic bottles and debris washed up and collected "
        "along an Indian coastline, overcast soft natural light, sombre but not grim "
        "mood, muted earthy color palette, close mid-ground composition, no people, "
        "high detail, photojournalism style",
        NEGATIVE, 82, False,
    ),
    (
        "home.narrative.2", 896, 704, 720, 576, "scenes/narrative-2.webp",
        "Candid photograph of a small group of Indian volunteers gathered in a briefing "
        "circle outdoors before a cleanup event, one person gesturing at a clipboard "
        "or map, " + PEOPLE_DIRECTION +
        "natural daylight, warm neutral color palette, documentary photojournalism "
        "style, high detail",
        NEGATIVE, 82, False,
    ),
    (
        "home.narrative.3", 896, 704, 720, 576, "scenes/narrative-3.webp",
        "Close-up documentary photograph of a pair of Indian hands with fair to medium "
        "skin tone firming dark soil around a young tree sapling, shallow depth of "
        "field, warm natural sunlight, rich green and earth tones, high detail macro "
        "photography",
        NEGATIVE, 82, False,
    ),
    (
        "home.narrative.4", 896, 704, 720, 576, "scenes/narrative-4.webp",
        "Documentary photograph of Indian volunteers sorting collected waste into "
        "labelled containers at an outdoor collection point, organised and purposeful, "
        + PEOPLE_DIRECTION +
        "natural daylight, muted warm color palette, documentary photojournalism style, "
        "high detail",
        NEGATIVE, 82, False,
    ),
    (
        "about.story", 1280, 720, 1200, 675, "scenes/about-story.webp",
        "Candid photograph of Indian event organisers checking supplies and equipment "
        "on a folding table before a community volunteer day, " + PEOPLE_DIRECTION +
        "warm neutral color palette, natural daylight, documentary photojournalism "
        "style, high detail",
        NEGATIVE, 82, False,
    ),
    (
        "event.type.cleanup", 1152, 640, 720, 400, "events/type-cleanup.webp",
        "Flat minimal editorial vector illustration of a shoreline with collected "
        "plastic debris gathered into a neat pile, two to three tone flat color build "
        "using a deep forest green, a soft mint green, and a warm off-white background, "
        "one small cobalt blue accent shape, geometric shapes, clean simple composition, "
        "no gradients, no text, no faces, no people, flat design, vector art style",
        ILLUSTRATION_NEGATIVE, 90, False,
    ),
    (
        "event.type.plantation", 1152, 640, 720, 400, "events/type-plantation.webp",
        "Flat minimal editorial vector illustration of neat rows of young tree saplings "
        "with a pair of stylised simplified hands placing one sapling into soil, two to "
        "three tone flat color build using a deep forest green, a soft mint green, and a "
        "warm off-white background, one small cobalt blue accent shape, geometric shapes, "
        "no gradients, no text, no faces, no people, flat design, vector art style",
        ILLUSTRATION_NEGATIVE, 90, False,
    ),
    (
        "event.type.ewaste", 1152, 640, 720, 400, "events/type-ewaste.webp",
        "Flat minimal editorial vector illustration of stacked simplified silhouettes "
        "of old electronic devices like phones and monitors being sorted into a bin, "
        "two to three tone flat color build using a deep forest green, a soft mint "
        "green, and a warm off-white background, one small cobalt blue accent shape, "
        "geometric shapes, no gradients, no text, no faces, no people, flat design, "
        "vector art style",
        ILLUSTRATION_NEGATIVE, 90, False,
    ),
    (
        "event.type.restoration", 1152, 640, 720, 400, "events/type-restoration.webp",
        "Flat minimal editorial vector illustration of a riverbank with tall reeds and "
        "a simplified returning bird silhouette, two to three tone flat color build "
        "using a deep forest green, a soft mint green, and a warm off-white background, "
        "one small cobalt blue accent shape, geometric shapes, no gradients, no text, "
        "no faces, no people, flat design, vector art style",
        ILLUSTRATION_NEGATIVE, 90, False,
    ),
    (
        "event.type.community", 1152, 640, 720, 400, "events/type-community.webp",
        "Flat minimal editorial vector illustration of an abstract gathering circle of "
        "simplified geometric human figures standing around a shared garden plot, two "
        "to three tone flat color build using a deep forest green, a soft mint green, "
        "and a warm off-white background, one small cobalt blue accent shape, geometric "
        "shapes, no gradients, no text, no realistic faces, flat design, vector art style",
        ILLUSTRATION_NEGATIVE, 90, False,
    ),
    (
        "event.type.other", 1152, 640, 720, 400, "events/type-other.webp",
        "Flat minimal editorial vector illustration of an abstract leaf and grid motif, "
        "deliberately generic and simple, two to three tone flat color build using a "
        "deep forest green, a soft mint green, and a warm off-white background, one "
        "small cobalt blue accent shape, geometric shapes, no gradients, no text, no "
        "faces, no people, flat design, vector art style",
        ILLUSTRATION_NEGATIVE, 90, False,
    ),
]

def build_prompt(text, negative, w, h, seed):
    return {
        "51": {"inputs": {"text": text, "clip": ["56", 0]}, "class_type": "CLIPTextEncode"},
        "52": {"inputs": {"width": w, "height": h, "batch_size": 1}, "class_type": "EmptyLatentImage"},
        "54": {"inputs": {"samples": ["81", 0], "vae": ["57", 0]}, "class_type": "VAEDecode"},
        "55": {"inputs": {"unet_name": "realismByStableYogi_v25INT8Turbo.safetensors", "weight_dtype": "default"}, "class_type": "UNETLoader"},
        "56": {"inputs": {"clip_name": "qwen3vl_4b_fp8_scaled.safetensors", "type": "krea2", "device": "default"}, "class_type": "CLIPLoader"},
        "57": {"inputs": {"vae_name": "qwen_image_vae.safetensors"}, "class_type": "VAELoader"},
        "79": {"inputs": {"text": negative, "clip": ["56", 0]}, "class_type": "CLIPTextEncode"},
        "81": {"inputs": {"seed": seed, "steps": 8, "cfg": 1, "sampler_name": "euler", "scheduler": "simple", "denoise": 1, "model": ["55", 0], "positive": ["51", 0], "negative": ["79", 0], "latent_image": ["52", 0]}, "class_type": "KSampler"},
        "127": {"inputs": {"filename_prefix": "asset", "images": ["54", 0]}, "class_type": "SaveImage"},
    }

def submit(prompt_graph):
    data = json.dumps({"prompt": prompt_graph}).encode("utf-8")
    req = urllib.request.Request(f"{BASE}/prompt", data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

def wait_for(prompt_id, timeout=120):
    start = time.time()
    while time.time() - start < timeout:
        with urllib.request.urlopen(f"{BASE}/history/{prompt_id}") as resp:
            h = json.loads(resp.read())
        if prompt_id in h:
            return h[prompt_id]
        time.sleep(1)
    raise TimeoutError(f"{prompt_id} did not finish in {timeout}s")

def download(image_info, dest):
    q = urllib.parse.urlencode(image_info)
    url = f"{BASE}/view?{q}"
    urllib.request.urlretrieve(url, dest)

import urllib.parse

def main():
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    for i, (asset_id, gw, gh, fw, fh, out_rel, prompt_text, negative, quality, priority) in enumerate(JOBS):
        if only and asset_id not in only:
            continue
        seed = 100000 + i * 7919
        graph = build_prompt(prompt_text, negative, gw, gh, seed)
        print(f"[{asset_id}] submitting ({gw}x{gh}) seed={seed}...")
        res = submit(graph)
        if res.get("node_errors"):
            print("  NODE ERRORS:", res["node_errors"])
            continue
        pid = res["prompt_id"]
        hist = wait_for(pid)
        status = hist.get("status", {}).get("status_str")
        print(f"  status={status}")
        imgs = hist.get("outputs", {}).get("127", {}).get("images", [])
        if not imgs:
            print("  NO OUTPUT IMAGES")
            continue
        raw_path = os.path.join(RAW_DIR, f"{asset_id.replace('.', '_')}.png")
        download(imgs[0], raw_path)
        print(f"  raw -> {raw_path}")

if __name__ == "__main__":
    main()
