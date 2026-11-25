"""
Turns a bright studio HDRI into a dark one: the walls and floor (anything under ~2) are cut to
15%, the softboxes (over ~6) are kept, with a smooth step between. Like black flags around the
lights in a product shoot: surfaces reflect the softboxes, not a white room, so the bike stops
looking shiny all over. Writes the full size (for the Blender stills) and a 256x128 copy (the page).

  /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/kord/dark_studio.py -- <in.hdr> <out_full.hdr> <out_small.hdr> [wall_gain]
"""
import bpy, sys
a = sys.argv[sys.argv.index("--") + 1:]
src, out_full, out_small = a[:3]
gain = float(a[3]) if len(a) > 3 else 0.15
img = bpy.data.images.load(src)
px = list(img.pixels)
lo, hi = 2.0, 6.0
for i in range(0, len(px), 4):
    l = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]
    t = min(1.0, max(0.0, (l - lo) / (hi - lo))); t = t * t * (3 - 2 * t)
    k = gain + (1 - gain) * t
    px[i] *= k; px[i + 1] *= k; px[i + 2] *= k
img.pixels = px
img.filepath_raw = out_full; img.file_format = "HDR"; img.save()
img.scale(256, 128)
img.filepath_raw = out_small; img.save()
print("WROTE", out_full, out_small)
