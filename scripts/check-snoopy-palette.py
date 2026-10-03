"""Verify Snoopy poses contain no leftover sprite-sheet background pixels."""
from pathlib import Path
from PIL import Image

for path in Path("public/sprites/snoopy").glob("snoopy-*.png"):
    image = Image.open(path).convert("RGBA")
    for pixel in image.getdata():
        assert not (pixel[3] and all(abs(pixel[i] - channel) <= 2 for i, channel in enumerate((0, 150, 136)))), f"Teal residue in {path}: {pixel}"
print("Snoopy palette check passed")
