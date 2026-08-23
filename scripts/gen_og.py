import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(__file__)
PUBLIC = os.path.join(ROOT, "..", "public")

W, H = 1200, 630
BG = (251, 250, 247)       # --background 45 33% 98%
INK = (33, 30, 24)         # --foreground-ish dark
GREEN = (20, 83, 45)       # #14532D primary
GREEN_LIGHT = (82, 162, 118)

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# Left band, full height, deep green
BAND_W = 18
draw.rectangle([0, 0, BAND_W, H], fill=GREEN)

# thin baseline rule
draw.rectangle([0, H - 10, W, H], fill=GREEN)

MARGIN = 96

# Logomark
logo = Image.open(os.path.join(PUBLIC, "logo.png")).convert("RGBA")
logo_size = 84
logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
logo_y = 108
img.paste(logo, (MARGIN, logo_y), logo)

wordmark_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 92)
wordmark_bold = ImageFont.truetype("C:/Windows/Fonts/seguisb.ttf", 92) if os.path.exists("C:/Windows/Fonts/seguisb.ttf") else ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 88)
tagline_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 36)

wm_x = MARGIN + logo_size + 28
wm_y = logo_y + logo_size / 2
draw.text((wm_x, wm_y), "Sproutify", font=wordmark_bold, fill=GREEN, anchor="lm")

tagline = "Community-led environmental action"
draw.text((MARGIN, logo_y + logo_size + 64), tagline, font=tagline_font, fill=INK)

sub_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 28)
draw.text((MARGIN, logo_y + logo_size + 64 + 56), "Cleanups · plantations · restoration, organised.", font=sub_font, fill=(110, 104, 94))

out_path = os.path.join(PUBLIC, "brand", "og.png")
os.makedirs(os.path.dirname(out_path), exist_ok=True)
img.save(out_path, "PNG", optimize=True)
print("saved", out_path, os.path.getsize(out_path) / 1024, "KB")
