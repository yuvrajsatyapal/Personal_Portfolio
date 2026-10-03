"""Extract the supplied 5x pixel-art sheet without interpolation (requires Pillow)."""
import argparse
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument("source", type=Path)
parser.add_argument("--output", type=Path, default=Path("public/sprites/snoopy"))
args = parser.parse_args()
source = Image.open(args.source).convert("RGB")
if source.size != (1250, 770):
    raise ValueError("Expected the original 1250×770 sprite sheet")
args.output.mkdir(parents=True, exist_ok=True)
frames = {
    "snoopy-idle": (350,330,80,110), "snoopy-walk-1": (350,330,80,110),
    "snoopy-walk-2": (440,335,80,105), "snoopy-rest": (710,205,75,105),
    "snoopy-right-idle": (530,330,80,110), "snoopy-right-walk-1": (530,330,80,110),
    "snoopy-right-walk-2": (620,335,85,105),
    "snoopy-front": (10,330,75,115), "snoopy-front-step": (95,320,75,115),
    "snoopy-three-quarter": (180,330,75,110), "snoopy-three-quarter-step": (265,320,75,115),
    "snoopy-back": (705,330,80,110), "snoopy-back-step": (800,320,75,115),
    "snoopy-back-alt": (885,325,75,115), "snoopy-back-alt-step": (970,320,75,115),
    "snoopy-side-rest": (795,205,120,105), "snoopy-companion-rest": (975,205,75,105),
    "snoopy-interaction-standing": (1150,200,80,110),
    "aviator-left-idle": (405,460,100,120), "aviator-left-walk-1": (405,460,100,120),
    "aviator-left-walk-2": (515,465,95,115),
    "aviator-right-idle": (620,460,95,125), "aviator-right-walk-1": (620,460,95,125),
    "aviator-right-walk-2": (725,465,95,115),
    "aviator-front": (10,460,85,120), "aviator-front-step": (105,450,95,125),
    "aviator-three-quarter": (210,460,85,120), "aviator-three-quarter-step": (305,450,95,125),
    "aviator-back": (830,460,95,125), "aviator-back-step": (935,450,95,125),
    "aviator-back-alt": (1040,455,95,125), "aviator-back-alt-step": (1145,450,95,125),
    "woodstock-walk-1": (10,590,65,80), "woodstock-walk-2": (80,590,75,80),
    "woodstock-lean": (160,590,70,75), "woodstock-turn": (235,590,80,75),
    "woodstock-turn-alt": (325,590,75,75), "woodstock-wing": (405,590,80,65),
    "woodstock-idle": (10,680,65,80), "woodstock-idle-alt": (80,685,80,75),
    "woodstock-companion": (1055,230,65,80), "woodstock-raised-wing": (1145,125,65,75),
    "doghouse-empty": (10,145,165,165), "doghouse-aviator-1": (185,30,170,285),
    "doghouse-aviator-2": (360,40,165,275), "doghouse-sleep": (535,80,165,230),
    "z-1": (540,55,30,35), "z-2": (505,10,40,40),
}
for name, (x,y,w,h) in frames.items():
    image = Image.new("RGBA", (w//5,h//5))
    for py in range(image.height):
        for px in range(image.width):
            color = source.getpixel((x+px*5+2,y+py*5+2))
            background = all(abs(color[i] - channel) <= 2 for i, channel in enumerate((0, 150, 136)))
            image.putpixel((px,py), (0,0,0,0) if background else (*color,255))
    points = {(x,y) for y in range(image.height) for x in range(image.width) if image.getpixel((x,y))[3]}
    groups = []
    while points:
        queue = [points.pop()]
        group = []
        while queue:
            px,py = queue.pop()
            group.append((px,py))
            for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
                point = (px+dx,py+dy)
                if point in points:
                    points.remove(point)
                    queue.append(point)
        groups.append(group)
    # Scene crops contain disconnected Z fragments; retain the connected roof artwork.
    largest = max(groups, key=len)
    for group in groups:
        if len(group) == 1 or (name.startswith("doghouse") and group is not largest):
            for point in group:
                image.putpixel(point,(0,0,0,0))
    if name.startswith("snoopy"):
        canvas_size = (26,24) if name == "snoopy-side-rest" else (18,24)
    elif name.startswith("aviator"):
        canvas_size = (22,28)
    elif name.startswith("woodstock"):
        canvas_size = (18,18)
    elif name.startswith("doghouse"):
        canvas_size = (36,58)
    else:
        canvas_size = image.size
    if canvas_size != image.size:
        canvas = Image.new("RGBA",canvas_size)
        canvas.alpha_composite(image,((canvas.width-image.width)//2,canvas.height-1-image.height))
        image = canvas
    image.save(args.output/(name+".png"))
print(f"Prepared {len(frames)} transparent native-grid assets")
