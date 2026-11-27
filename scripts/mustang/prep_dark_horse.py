"""
Prepares the licensed Dark Horse model for the page.

  "[FREE] 2024 Ford Mustang Dark Horse" by livanovbog, CC BY 4.0
  https://sketchfab.com/3d-models/free-2024-ford-mustang-dark-horse-a29c8bb07f6e41b594fe2248366cffbf

  /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/mustang/prep_dark_horse.py -- <scene.gltf> <out_dir> [--inspect] [--glb <file>] [--lite <ratio>] [--tex <px>]

--inspect lists the top-level objects and renders a quick look into out_dir.
--lite <ratio> builds the phones' model (car-lite.glb, built with --lite 0.3 --tex 512): every
  mesh decimated to that ratio except the paint and the interior (both crumpled, and clearing
  their normals afterwards made it worse) and the small, flat or see-through parts.
--tex <px> caps the textures' longest side (default 1024).
"""
import bpy, sys, os, math
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:]
SRC, OUT = argv[0], argv[1]
INSPECT = "--inspect" in argv
GLB = argv[argv.index("--glb") + 1] if "--glb" in argv else None
LITE = float(argv[argv.index("--lite") + 1]) if "--lite" in argv else None
TEX = int(argv[argv.index("--tex") + 1]) if "--tex" in argv else 1024
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
scene = bpy.context.scene
meshes = [o for o in scene.objects if o.type == "MESH"]

def world_bbox(objs):
    lo = Vector((1e9, 1e9, 1e9)); hi = Vector((-1e9, -1e9, -1e9))
    for o in objs:
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
    return lo, hi

lo, hi = world_bbox(meshes)
print("BBOX", [round(v, 3) for v in lo], [round(v, 3) for v in hi], "size", [round(v, 3) for v in hi - lo])

if INSPECT:
    tops = [o for o in scene.objects if o.parent is None]
    for t in tops: print("TOP", t.name, t.type, [round(v, 3) for v in t.location], [round(math.degrees(v), 1) for v in t.rotation_euler], [round(v, 3) for v in t.scale])
    named = [o for o in scene.objects if o.type == "EMPTY" and not o.name.startswith(("M_", "Sketchfab", "RootNode"))]
    for o in named:
        print("NODE", o.name, "parent", o.parent.name if o.parent else None, [round(math.degrees(v), 1) for v in o.rotation_euler])
    # a quick look from the front three-quarter and the side
    world = bpy.data.worlds.new("W"); scene.world = world; world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.35, 0.37, 0.4, 1)
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam")); scene.collection.objects.link(cam); scene.camera = cam
    centre = (lo + hi) / 2; size = (hi - lo).length
    for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
        try: scene.render.engine = eng; break
        except TypeError: continue
    scene.render.resolution_x, scene.render.resolution_y = 960, 540
    for name, d in {"a": Vector((1, -0.8, 0.35)), "b": Vector((0, -1, 0.15)), "c": Vector((-0.2, 0.2, 1))}.items():
        cam.location = centre + d.normalized() * size * 1.2
        cam.rotation_euler = (centre - cam.location).to_track_quat("-Z", "Y").to_euler()
        scene.render.filepath = os.path.join(OUT, f"inspect_{name}.png")
        bpy.ops.render.render(write_still=True)

# ------------------------------------------------------------------ export
if GLB:
    # The open hood, doors, trunk, wing, mirrors and door glass are closed by
    # resetting their hinge matrices in the source JSON before import (see the
    # README); this script expects that closed scene.
    # Face +X like the stage's frame (the model faces -Y), centre it, wheels on the floor.
    root = next(o for o in scene.objects if o.parent is None)
    root.matrix_world = Matrix.Rotation(math.radians(90), 4, "Z") @ root.matrix_world   # the importer uses quaternions, so rotate the matrix
    bpy.context.view_layer.update()
    lo, hi = world_bbox([o for o in scene.objects if o.type == "MESH"])
    root.matrix_world = Matrix.Translation(-Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))) @ root.matrix_world
    bpy.context.view_layer.update()

    # Nothing sees the engine with the hood shut.
    for o in list(scene.objects):
        if o.type == "MESH" and any(s.material and s.material.name.startswith("M_Engine") for s in o.material_slots):
            bpy.data.objects.remove(o, do_unlink=True)

    # The page swaps in its own paint (five colours, metallic flake) and glass by name.
    RENAME = {"M_CarPaint": "Paint", "M_CarPaintNormal": "Paint", "M_Glass_Window": "Glass",
              "M_Rim_Main": "Rim", "M_Caliper": "Caliper"}   # gunmetal wheels and blue calipers, as in the user's Dark Horse photos
    for m in bpy.data.materials:
        if m.name in RENAME: m.name = RENAME[m.name]

    # A tiny grayscale swatch (the interior's tiled base colour) can't be written as WebP and
    # would leave a dangling texture: use its average colour on the material instead.
    for m in bpy.data.materials:
        if not m.use_nodes: continue
        for n in list(m.node_tree.nodes):
            if n.type == "TEX_IMAGE" and n.image and "InteriorTiledSimple_baseColor" in n.image.name:
                px = list(n.image.pixels); c = n.image.channels
                avg = sum(px[i] for i in range(0, len(px), c)) / max(1, len(px) // c)
                for link in list(n.outputs["Color"].links):
                    sock = link.to_socket; m.node_tree.links.remove(link)
                    if hasattr(sock, "default_value") and len(sock.default_value) >= 3: sock.default_value = (avg, avg, avg, 1)
                m.node_tree.nodes.remove(n)

    # Only the first two UV sets are used (UV1 by a few normal and emissive maps); the
    # source's other three were shipped on every mesh for nothing.
    for me in {o.data for o in scene.objects if o.type == "MESH"}:
        for uv in list(me.uv_layers)[2:]: me.uv_layers.remove(uv)

    # The phones' model: decimate everything but the paint and the interior (the body and the
    # cockpit close-up crumple when collapsed) and the parts that are small, flat or see-through,
    # where a collapse would show (window and lamp edges, badges, the plate).
    if LITE:
        KEEP = ("Paint", "M_CarPaint", "Glass", "M_LGlass", "M_Glass", "M_Badge", "M_RimBadge", "M_LicensePlate", "M_Grille", "M_Detail", "M_Interior")
        before = after = 0
        for o in [o for o in scene.objects if o.type == "MESH"]:
            names = [s.material.name for s in o.material_slots if s.material]
            tris = sum(len(p.vertices) - 2 for p in o.data.polygons); before += tris
            if tris > 200 and not any(n.startswith(KEEP) for n in names):
                if o.data.users > 1: o.data = o.data.copy()
                m = o.modifiers.new("Lite", "DECIMATE"); m.ratio = LITE
                bpy.context.view_layer.objects.active = o
                bpy.ops.object.modifier_apply(modifier=m.name)
            after += sum(len(p.vertices) - 2 for p in o.data.polygons)
        print("LITE", LITE, "triangles", before, "->", after)

    # Textures: at most TEX px (1024 by default; they ship as WebP).
    for img in list(bpy.data.images):
        if not img.size[0]: continue
        if img.channels < 3:                                   # WebP can't hold single-channel images: rebuild as RGBA
            w, h, c = img.size[0], img.size[1], img.channels
            px = list(img.pixels); rgba = []
            for i in range(w * h):
                v = px[i * c]; rgba += [v, v, v, px[i * c + 1] if c == 2 else 1.0]
            new = bpy.data.images.new(img.name + "_rgba", w, h, alpha=True); new.pixels = rgba
            img.user_remap(new); img = new
        k = min(1, TEX / max(img.size))                     # scaling every image also re-encodes palette PNGs WebP can't take
        img.scale(max(1, int(img.size[0] * k)), max(1, int(img.size[1] * k)))

    lo, hi = world_bbox([o for o in scene.objects if o.type == "MESH"])
    print("FINAL BBOX", [round(v, 3) for v in lo], [round(v, 3) for v in hi])
    for w in [o for o in scene.objects if o.name.startswith("Wheel")]:
        print("WHEEL", w.name, [round(v, 3) for v in w.matrix_world.translation])
    bpy.ops.export_scene.gltf(filepath=GLB, export_format="GLB", export_image_format="WEBP", export_image_quality=82,
                              export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
                              **({"export_draco_position_quantization": 12, "export_draco_texcoord_quantization": 10} if LITE else {}),
                              export_apply=True, export_yup=True)
    print("EXPORTED", GLB, os.path.getsize(GLB))
