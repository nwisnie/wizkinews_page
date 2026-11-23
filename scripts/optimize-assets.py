"""Regenerate web assets without modifying the original artwork.

Requires: python -m pip install pillow fonttools brotli
Run from any directory: python scripts/optimize-assets.py
"""

from pathlib import Path

from PIL import Image, ImageOps
from fontTools import subset
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets/web"


def export(source, destination, *, width=None, height=None, lossless=True):
    original = ROOT / "assets" / source
    target = OUTPUT / destination
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(original) as image:
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        if width or height:
            size = (width, round(image.height * width / image.width)) if width else (
                round(image.width * height / image.height), height
            )
            image = image.resize(size, Image.Resampling.LANCZOS)
        image.save(target, "WEBP", lossless=lossless, quality=85, method=6)
        print(f"{destination}: {image.width} x {image.height}, "
              f"{original.stat().st_size:,} -> {target.stat().st_size:,} bytes")


for name in ("me_me_main", "me_me_arm", "me_me_eye_whites", "me_me_eye_left",
             "me_me_eye_right", "me_me_eyes_closed"):
    export(f"images/character/{name}.png", f"character/{name}.webp", width=1000)

for name, source, height in (
    ("scientist", "images/characters/marquee/sci_guy_full.png", 860),
    ("idk-girl", "images/characters/marquee/idk_girl_full.png", 860),
    ("haz-thick", "images/characters/marquee/haz_thick_full.png", 688),
    ("haz-dude", "images/characters/marquee/haz_dude_full.png", 860),
    ("haz-big", "haz_big_better.png", 860),
    ("big-guy", "images/characters/marquee/big_guy_full.png", 860),
    ("armored-dog", "images/characters/marquee/grater_dog_full.png", 860),
    ("emo-they", "emo_they.png", 860),
    ("dog", "dog_uh.png", 688),
    ("blue-haired-girl", "images/characters/marquee/girl_not_good_full.png", 860),
):
    export(source, f"characters/{name}.webp", height=height)

export("images/characters/computer/computer_dude.png", "computer.webp", width=240)
export("images/branding/Wizkinews_logo.png", "logo.webp")
export("images/backgrounds/logo_bg.png", "logo-bg.webp", width=1200)
export("images/backgrounds/bg_sky.png", "sky-desktop.webp", width=2450, lossless=False)
export("images/backgrounds/bg_sky.png", "sky-mobile.webp", width=980, lossless=False)

with Image.open(ROOT / "assets/enemy_cube.png") as image:
    ImageOps.pad(image.convert("RGBA"), (64, 64), method=Image.Resampling.LANCZOS,
                 color=(0, 0, 0, 0)).save(OUTPUT / "favicon.png", optimize=True)

# The page uses Latin text. Include extended Latin, punctuation, and currency
# symbols so normal copy edits do not require regenerating the font.
options = subset.Options()
options.flavor = "woff2"
font = TTFont(ROOT / "assets/KosugiMaru-Regular.ttf")
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=subset.parse_unicodes(
    "U+0000-024F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+FFFD"
))
subsetter.subset(font)
font.flavor = "woff2"
font.save(OUTPUT / "kosugi-maru-latin.woff2")
print(f"Latin WOFF2: {(OUTPUT / 'kosugi-maru-latin.woff2').stat().st_size:,} bytes")
