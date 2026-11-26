"""
Builds Kord's road bike in Blender, from nothing: an aero carbon frame blended from
tubes (voxel remesh), deep-section wheels, a 2x12 drivetrain with a real chain path,
an integrated drop-bar cockpit, saddle and disc brakes.

  /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/kord/build_bike.py -- <out_dir> [--preview] [--glb <file>] [--stills <dir>] [--donor <scene.gltf>]

With --donor, the frame, fork, cockpit, seatpost and saddle come from "Road Bike" by tanity
(CC BY 4.0; see "donor frame" below) instead of being built here. The site's models (public/builds/kord/models/) use it.

Units are metres. X runs along the bike (front = +X), Y across (drive side = -Y, the rider's right), Z up.
Geometry: a 56 cm race frame — 990 mm wheelbase, 410 mm chainstays, 70 mm BB drop,
73 deg head angle, 73.5 deg seat angle, stack 570 / reach 390, 700x28 tyres.

Everything is named so the page (three.js) can find it. Objects (each one an exploded-view
part, origin at its own pivot): Frame, Fork, Wheel_F, Wheel_R, Cockpit, Seatpost, Saddle,
Crankset, Chain, RearDerailleur, FrontDerailleur, Brake_F, Brake_R, Wordmark.
Materials: Paint (frame colour), Carbon, Decal, Badge, Tire, TireWall, Metal, Silver, Rotor,
Tape, Hood, Saddle, Rubber (and Pedal, Reflector with --donor).
"""
import bpy, bmesh, math, sys, os
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "."
PREVIEW = "--preview" in argv
GLB = argv[argv.index("--glb") + 1] if "--glb" in argv else None
STILLS = argv[argv.index("--stills") + 1] if "--stills" in argv else None   # transparent renders for the page
DONOR = argv[argv.index("--donor") + 1] if "--donor" in argv else None     # see "donor frame" below
BAKE_AO = "--ao" in argv                                                    # bake ambient occlusion into a color attribute
HDRI = argv[argv.index("--hdri") + 1] if "--hdri" in argv else None        # an equirect .hdr lighting the stills
HDRI_STRENGTH = float(argv[argv.index("--hdri-strength") + 1]) if "--hdri-strength" in argv else 1.5   # = ENV_GAIN on the page
ALL_PAINTS = "--all-paints" in argv                                         # stills of this bike in every paint: <bike>-<paint>.png
RANGE_DIM = "--range-light" not in argv                                     # off by default: the rig made the bike look fake (the user, 2026-11-25); --range-light turns it on
RANGE_POWER = float(argv[argv.index("--range-power") + 1]) if "--range-power" in argv else 0.7   # scales that rig (0.7: the whole bike reads, and black stays black)
SHADOW = argv[argv.index("--shadow") + 1] if "--shadow" in argv else None   # bake the floor shadow to a PNG
SHADOW_W, SHADOW_D = 2.4, 1.2           # its area (m), along and across the bike: = SHADOW_W/_D in BikeStory.js
CYCLES = "--pathtrace" in argv                                               # render the stills with Cycles
TREAD_RATIO = float(argv[argv.index("--tread") + 1]) if "--tread" in argv else 0.15  # the donor tread's decimation (0.3: 925 KB GLB, 0.15: 697 KB)
# Each model is its own build (2026-11-24; until then one frame stood in for all four): its name on the
# head badge, its rim depth and tire width (from `wheels` / `tires` in data.js), and its frame — a taller
# front end for the endurance and all-road bikes (their extra stack, in DETAILS), a compact rear triangle
# for the climber, and its own chainstays (`cs`) and wheelbase (`wb`), also from DETAILS: our wheels, chain,
# derailleur and brakes are built at its axles, and the donor frame (fitted at the Arc's) is stretched to them.
BIKE = argv[argv.index("--bike") + 1] if "--bike" in argv else "arc"
VARIANTS = {
    "arc":      dict(name="ARC™",      rim=0.050, tire=28, stack=0.0,   drop=0.0,   cs=0.410, wb=0.990),
    "crest":    dict(name="CREST™",    rim=0.035, tire=28, stack=0.0,   drop=0.035, cs=0.408, wb=0.985),
    "meridian": dict(name="MERIDIAN™", rim=0.040, tire=32, stack=0.025, drop=0.0,   cs=0.415, wb=1.005),
    "atlas":    dict(name="ATLAS™",    rim=0.030, tire=38, stack=0.020, drop=0.0,   cs=0.430, wb=1.030),
}
VAR = VARIANTS[BIKE]
# --lite <ratio>: the phones' model — every part but the decals decimated to this ratio, a thinner tread
LITE = float(argv[argv.index("--lite") + 1]) if "--lite" in argv else None
if LITE: TREAD_RATIO = min(TREAD_RATIO, 0.07)
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = scene.collection
TAU = math.tau

# ----------------------------------------------------------------- helpers
def lerp(a, b, t): return a + (b - a) * t
def V(*a): return Vector(a)

def material(name, color, metallic=0.0, rough=0.5, coat=0.0, coat_rough=0.05, spec=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = rough
    b.inputs["Specular IOR Level"].default_value = 0.5 * spec      # spec < 1: reflects less (rubber, tape)
    if coat and "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
        b.inputs["Coat Roughness"].default_value = coat_rough
    return m

MAT = {
    "Paint": material("Paint", (0.012, 0.013, 0.015), metallic=0.4, rough=0.32, coat=1.0, spec=0.75),
    "Carbon": material("Carbon", (0.010, 0.010, 0.011), rough=0.66, spec=0.65),     # satin raw carbon, no clear coat
    "Decal": material("Decal", (0.52, 0.85, 0.02), rough=0.35),            # chartreuse
    "Badge": material("Badge", (0.52, 0.85, 0.02), rough=0.5),             # the head badge: contrasts with each paint (badge in PAINTS)
    "Group": material("Group", (0.035, 0.036, 0.040), metallic=0.55, rough=0.6),   # the groupset's alloy (cranks, derailleurs, brakes): the page sets its finish per groupset
    "Tire": material("Tire", (0.012, 0.012, 0.012), rough=0.92, spec=0.45),
    "TireWall": material("TireWall", (0.020, 0.019, 0.018), rough=0.88, spec=0.45),
    "Metal": material("Metal", (0.035, 0.036, 0.040), metallic=0.55, rough=0.6),            # anodised alloy
    "Silver": material("Silver", (0.50, 0.51, 0.53), metallic=1.0, rough=0.45),
    "Rotor": material("Rotor", (0.40, 0.40, 0.41), metallic=1.0, rough=0.58),
    "Tape": material("Tape", (0.015, 0.015, 0.016), rough=0.9, spec=0.4),
    "Hood": material("Hood", (0.005, 0.005, 0.0055), rough=0.78, spec=0.5),
    "Saddle": material("Saddle", (0.012, 0.012, 0.013), rough=0.75, spec=0.5),
    "Rubber": material("Rubber", (0.008, 0.008, 0.009), rough=0.92, spec=0.45),
    "Pedal": material("Pedal", (0.025, 0.025, 0.027), rough=0.88, spec=0.5),          # the donor's platform pedals
    "Reflector": material("Reflector", (0.8, 0.22, 0.006), rough=0.4),
    "Gumwall": material("Gumwall", (0.195, 0.088, 0.034), rough=0.92, spec=0.45),       # the donor's tan sidewalls, muted
}
MAT["Badge"].use_fake_user = True      # unused until the head badge is made; the donor import's cleanup would delete it
MAT["Group"].use_fake_user = True

def obj_from_bm(name, bm, mats, smooth_shade=True, origin=(0, 0, 0), sharp=None):
    """bm is built in world coordinates; the object's origin is moved to `origin`."""
    bmesh.ops.translate(bm, vec=-Vector(origin), verts=bm.verts)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    for m in mats: me.materials.append(MAT[m])
    if smooth_shade:
        for p in me.polygons: p.use_smooth = True
    if sharp: me.set_sharp_from_angle(angle=math.radians(sharp))
    o = bpy.data.objects.new(name, me)
    o.location = origin
    col.objects.link(o)
    return o

def bake(o):
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    old = o.data
    o.modifiers.clear()
    o.data = me
    bpy.data.meshes.remove(old)
    return o

def set_mat(bm, faces, idx):
    for f in faces: f.material_index = idx

def frame_axes(t, up=V(0, 1, 0)):
    """Local frame for a tube running along t: (side, normal). side ~ +Y unless t is along Y."""
    t = t.normalized()
    s = up - t * up.dot(t)
    if s.length < 1e-4:
        s = V(0, 0, 1) - t * t.z
    s.normalize()
    n = t.cross(s).normalized()
    return s, n

def profile(w, d, k=2.4, segs=20, tail=0.0, flip=False):
    """Cross-section points (side, normal): a superellipse w wide (across) and d deep, with an
    optional truncated-airfoil tail (tail > 0 sharpens the trailing side, -normal)."""
    pts = []
    for i in range(segs):
        a = TAU * i / segs
        c, s = math.cos(a), math.sin(a)
        x = math.copysign(abs(c) ** (2 / k), c) * w / 2
        y = math.copysign(abs(s) ** (2 / k), s) * d / 2
        if tail and y < 0:
            x *= 1 - tail * (-y / (d / 2)) ** 1.5
        pts.append((x, -y if flip else y))
    return pts

def sweep(bm, path, sections, closed_ends=True, up=V(0, 1, 0), mat=0, twist_up=None):
    """Loft rings along `path` (list of Vectors). sections: list of profile lists (one per path
    point) or a single profile. Returns the faces."""
    if not isinstance(sections[0], list): sections = [sections] * len(path)
    rings = []
    for i, p in enumerate(path):
        t = (path[min(i + 1, len(path) - 1)] - path[max(i - 1, 0)])
        u = twist_up[i] if twist_up else up
        s, n = frame_axes(t, u)
        rings.append([bm.verts.new(p + s * x + n * y) for x, y in sections[i]])
    faces = []
    m = len(rings[0])
    for a, b in zip(rings, rings[1:]):
        for j in range(m):
            faces.append(bm.faces.new((a[j], a[(j + 1) % m], b[(j + 1) % m], b[j])))
    if closed_ends:
        faces.append(bm.faces.new(list(reversed(rings[0]))))
        faces.append(bm.faces.new(rings[-1]))
    for f in faces: f.material_index = mat
    return faces

def sweep_rmf(bm, path, sections, s0, mat=0):
    """Like sweep(), but frames are carried along by parallel transport from an initial
    side vector s0, so curves through any direction never flip."""
    rings = []
    t_prev = (path[1] - path[0]).normalized()
    s = (s0 - t_prev * s0.dot(t_prev)).normalized()
    for i, p in enumerate(path):
        t = (path[min(i + 1, len(path) - 1)] - path[max(i - 1, 0)]).normalized()
        s = t_prev.rotation_difference(t) @ s
        s = (s - t * s.dot(t)).normalized()
        n = t.cross(s).normalized()
        t_prev = t
        rings.append([bm.verts.new(p + s * x + n * y) for x, y in sections[i]])
    faces = []
    m = len(rings[0])
    for a, b in zip(rings, rings[1:]):
        for j in range(m):
            faces.append(bm.faces.new((a[j], a[(j + 1) % m], b[(j + 1) % m], b[j])))
    faces.append(bm.faces.new(list(reversed(rings[0]))))
    faces.append(bm.faces.new(rings[-1]))
    for f in faces: f.material_index = mat
    return faces

def line(a, b, n=8):
    return [a.lerp(b, i / n) for i in range(n + 1)]

def bezier(p0, p1, p2, p3, n=16):
    out = []
    for i in range(n + 1):
        t = i / n
        out.append(p0 * (1 - t) ** 3 + p1 * 3 * t * (1 - t) ** 2 + p2 * 3 * t * t * (1 - t) + p3 * t ** 3)
    return out

def lathe(bm, prof, steps=96, axis="Y", center=V(0, 0, 0), mat=0, closed=True):
    """Revolve (radius, axial) points around an axis through `center`."""
    rings = []
    for i in range(steps):
        a = TAU * i / steps
        ring = []
        for r, y in prof:
            if axis == "Y": p = V(math.cos(a) * r, y, math.sin(a) * r)
            else: p = V(y, math.cos(a) * r, math.sin(a) * r)
            ring.append(bm.verts.new(center + p))
        rings.append(ring)
    faces = []
    m = len(prof)
    for i in range(steps):
        a, b = rings[i], rings[(i + 1) % steps]
        for j in range(m - 1 if not closed else m):
            jj = (j + 1) % m
            faces.append(bm.faces.new((a[j], b[j], b[jj], a[jj])))
    for f in faces: f.material_index = mat
    return faces

def part_box(size, loc, rot=None, bevel=0.0):
    """A bevelled box in its own bmesh, merged into `into` (keeps the transform local)."""
    b = bmesh.new()
    r = bmesh.ops.create_cube(b, size=1.0)
    bmesh.ops.scale(b, vec=size, verts=b.verts)
    if bevel:
        bmesh.ops.bevel(b, geom=list(b.edges), offset=bevel, segments=3, affect="EDGES", profile=0.5)
    if rot: bmesh.ops.rotate(b, cent=(0, 0, 0), matrix=rot, verts=b.verts)
    bmesh.ops.translate(b, vec=loc, verts=b.verts)
    return b

def merge(into, src, mat=0):
    """Append bmesh `src` into `into`, with material index `mat`."""
    me = bpy.data.meshes.new("_tmp")
    src.to_mesh(me); src.free()
    for p in me.polygons: p.material_index = mat
    into.from_mesh(me)
    bpy.data.meshes.remove(me)

def gear(bm_mat, teeth, r_root, r_tip, thick, center, y, mat=0, hole=0.0, steps_per_tooth=4):
    """A flat toothed disc in the XZ plane at depth y (normal along Y)."""
    b = bmesh.new()
    n = teeth * steps_per_tooth
    outer = []
    for i in range(n):
        a = TAU * i / n
        ph = (i % steps_per_tooth) / steps_per_tooth
        r = r_tip if ph in (0.25, 0.5) or (steps_per_tooth == 2 and ph == 0) else r_root
        outer.append((math.cos(a) * r, math.sin(a) * r))
    inner = [(math.cos(TAU * i / n) * hole, math.sin(TAU * i / n) * hole) for i in range(n)] if hole else None
    top, bot = [], []
    for (x, z) in outer:
        top.append(b.verts.new(center + V(x, y + thick / 2, z)))
        bot.append(b.verts.new(center + V(x, y - thick / 2, z)))
    for i in range(n):
        j = (i + 1) % n
        b.faces.new((bot[i], bot[j], top[j], top[i]))
    if inner:
        it, ib = [], []
        for (x, z) in inner:
            it.append(b.verts.new(center + V(x, y + thick / 2, z)))
            ib.append(b.verts.new(center + V(x, y - thick / 2, z)))
        for i in range(n):
            j = (i + 1) % n
            b.faces.new((top[i], top[j], it[j], it[i]))
            b.faces.new((bot[j], bot[i], ib[i], ib[j]))
            b.faces.new((it[i], it[j], ib[j], ib[i]))
    else:
        b.faces.new(top); b.faces.new(list(reversed(bot)))
    merge(bm_mat, b, mat)

# ------------------------------------------------------------ geometry
R_WHEEL = 0.3395                       # 700x28: 622 bead + 2 x 28.5
BB = V(0, 0, 0.2695)                   # 70 mm drop
RA0 = V(-0.404, 0, R_WHEEL)            # the Arc's rear axle (410 mm chainstay): the donor frame is fitted here
FA0 = V(0.586, 0, R_WHEEL)             # the Arc's front axle (990 mm wheelbase)
RA = V(-math.sqrt(VAR["cs"] ** 2 - (R_WHEEL - BB.z) ** 2), 0, R_WHEEL)   # this model's axles (its chainstay length,
FA = V(RA.x + VAR["wb"], 0, R_WHEEL)                                     # measured from the BB, and its wheelbase)
HA = math.radians(73.0)
HT_DIR = V(math.cos(HA), 0, -math.sin(HA))       # down the head tube
HTT = V(0.390, 0, BB.z + 0.570)        # stack / reach
HTB = HTT + HT_DIR * 0.150
SA = math.radians(73.5)
ST_DIR = V(-math.cos(SA), 0, math.sin(SA))       # up the seat tube
STT = BB + ST_DIR * 0.520
SADDLE_H = 0.735                       # BB to saddle top along the seat tube
SEAT = BB + ST_DIR * SADDLE_H

# ----------------------------------------------------------------- frame
fb = bmesh.new()
def tube(a, b, w0, d0, w1=None, d1=None, n=10, tail=0.25, k=2.6, segs=22, flip=False):
    w1 = w0 if w1 is None else w1; d1 = d0 if d1 is None else d1
    pts = line(a, b, n)
    secs = [profile(lerp(w0, w1, i / n), lerp(d0, d1, i / n), k=k, segs=segs, tail=tail, flip=flip) for i in range(n + 1)]
    sweep(fb, pts, secs)

# head tube: deep, aero (the tail faces backwards: our profile's -normal points to -X here)
tube(HTT + HT_DIR * -0.012, HTB + HT_DIR * 0.012, 0.046, 0.066, 0.050, 0.072, tail=0.35)
# down tube: head tube to the BB, deep and wide, flattening into the shell
tube(HTB + V(-0.004, 0, 0.022), BB + V(0.03, 0, 0.012), 0.044, 0.062, 0.070, 0.056, tail=0.15, n=14)
# top tube: sloping, slim
TT_B = BB + ST_DIR * 0.475
tube(HTT + V(-0.006, 0, -0.022), TT_B + V(0.008, 0, 0.004), 0.034, 0.040, 0.026, 0.034, tail=0.2, n=12, flip=True)
# seat tube: aero, from the BB to the seat cluster
tube(BB + ST_DIR * 0.010, STT + ST_DIR * 0.010, 0.050, 0.052, 0.030, 0.056, tail=0.45, n=14, flip=True)
# BB shell
for f in sweep(fb, line(V(0, -0.044, BB.z), V(0, 0.044, BB.z), 2), profile(0.050, 0.050, k=2.0, segs=24), up=V(0, 0, 1)):
    pass
for sgn in (1, -1):
    # chainstays: deep at the BB, slim at the dropout; the drive side stays a little lower
    a = BB + V(-0.025, sgn * 0.030, -0.004)
    b = RA + V(0.012, sgn * 0.064, -0.004)
    mid = a.lerp(b, 0.5) + V(0, sgn * 0.016, -0.006)
    pts = bezier(a, a.lerp(mid, 0.6), mid.lerp(b, 0.4), b, 12)
    secs = [profile(lerp(0.024, 0.014, i / 12), lerp(0.040, 0.020, i / 12), k=2.2, segs=16) for i in range(13)]
    sweep(fb, pts, secs, up=V(0, 0, 1))
    # dropped seat stays: from the seat tube ~ 140 mm below the top tube, to the axle
    a = BB + ST_DIR * 0.33 + V(-0.012, sgn * 0.012, 0)
    b = RA + V(0.010, sgn * 0.064, 0.010)
    mid = a.lerp(b, 0.45) + V(0, sgn * 0.024, 0)
    pts = bezier(a, a.lerp(mid, 0.7), mid.lerp(b, 0.3), b, 12)
    secs = [profile(lerp(0.016, 0.012, i / 12), lerp(0.030, 0.018, i / 12), k=2.2, segs=16, tail=0.3) for i in range(13)]
    sweep(fb, pts, secs)
    # dropouts
    merge(fb, part_box((0.034, 0.008, 0.032), RA + V(0.004, sgn * 0.064, 0.002), bevel=0.004))
frame_obj = obj_from_bm("Frame", fb, ["Paint"], origin=BB)
rm = frame_obj.modifiers.new("R", "REMESH"); rm.mode = "VOXEL"; rm.voxel_size = 0.0024; rm.use_smooth_shade = True
sm = frame_obj.modifiers.new("S", "CORRECTIVE_SMOOTH"); sm.factor = 0.7; sm.iterations = 12; sm.use_only_smooth = True
bake(frame_obj)
dm = frame_obj.modifiers.new("D", "DECIMATE"); dm.ratio = 0.35
bake(frame_obj)

# ------------------------------------------------------------------ fork
kb = bmesh.new()
# steerer (inside the head tube) and an aero crown
sweep(kb, line(HTT + HT_DIR * -0.04, HTB, 4), profile(0.030, 0.030, k=2, segs=16))
crown = HTB + HT_DIR * 0.022
sweep(kb, line(crown + V(0, -0.058, 0), crown + V(0, 0.058, 0), 6),
      profile(0.034, 0.070, k=2.6, segs=20, tail=0.3), up=V(0, 0, 1))
for sgn in (1, -1):
    a = crown + V(0.004, sgn * 0.050, -0.012)
    b = FA + V(0.0, sgn * 0.056, 0.0)
    mid = a.lerp(b, 0.5) + V(0.006, sgn * 0.006, 0)
    pts = bezier(a, a.lerp(mid, 0.6), mid.lerp(b, 0.5), b, 14)
    secs = [profile(lerp(0.026, 0.014, i / 14), lerp(0.052, 0.030, i / 14), k=2.4, segs=18, tail=0.35) for i in range(15)]
    sweep(kb, pts, secs)
    merge(kb, part_box((0.026, 0.008, 0.026), FA + V(0, sgn * 0.056, 0), bevel=0.004))
fork_obj = obj_from_bm("Fork", kb, ["Paint"], origin=HTB)
rm = fork_obj.modifiers.new("R", "REMESH"); rm.mode = "VOXEL"; rm.voxel_size = 0.0022; rm.use_smooth_shade = True
sm = fork_obj.modifiers.new("S", "CORRECTIVE_SMOOTH"); sm.factor = 0.7; sm.iterations = 10; sm.use_only_smooth = True
bake(fork_obj)
dm = fork_obj.modifiers.new("D", "DECIMATE"); dm.ratio = 0.35
bake(fork_obj)

# ---------------------------------------------------------------- wheels
RIM_STRIPE = False
# material slots for wheels: 0 Tire, 1 TireWall, 2 Carbon, 3 Decal, 4 Metal, 5 Silver, 6 Rotor
def wheel(name, center, rear):
    wb = bmesh.new()
    tr = 0.0142                                   # tyre section radius
    rc = R_WHEEL - tr
    prof = []
    for i in range(24):
        a = TAU * i / 24
        prof.append((rc + math.cos(a) * tr, math.sin(a) * tr * 0.98))
    faces = lathe(wb, prof, steps=120, center=center)
    for f in faces:                                # tread band vs sidewalls
        c = f.calc_center_median() - center
        r = math.hypot(c.x, c.z)
        f.material_index = 0 if r > rc + tr * 0.55 else 1
    # deep rim, 50 mm, 28 mm wide, U-shaped
    rim = [(0.3105, 0.0118), (0.3108, 0.0098), (0.300, 0.0138), (0.285, 0.0140), (0.270, 0.0118),
           (0.262, 0.0070), (0.2595, 0.0), (0.262, -0.0070), (0.270, -0.0118), (0.285, -0.0140),
           (0.300, -0.0138), (0.3108, -0.0098), (0.3105, -0.0118)]
    rk = VAR["rim"] / 0.050                       # this model's rim depth (the profile is the 50 mm one)
    rim = [(0.3108 - (0.3108 - r) * rk, y) for r, y in rim]
    lathe(wb, rim, steps=120, center=center, mat=2, closed=True)
    # decals: a band on each rim face (thin rings just proud of the carbon) — off since 2026-11-23,
    # when the user didn't like the colored outlines on the wheels; RIM_STRIPE brings them back
    for sgn in ((1, -1) if RIM_STRIPE else ()):
        band = [(0.2795, sgn * 0.01335), (0.2765, sgn * 0.01315)]
        b2 = bmesh.new()
        lathe(b2, band, steps=120, center=center, closed=False)
        merge(wb, b2, 3)
    # hub
    hw = 0.066 if rear else 0.050
    hub = [(0.006, -hw), (0.016, -hw), (0.016, -hw + 0.008), (0.028, -hw + 0.012), (0.028, -hw + 0.016), (0.014, -hw + 0.022),
           (0.014, hw - 0.022), (0.028, hw - 0.016), (0.028, hw - 0.012), (0.016, hw - 0.008), (0.016, hw), (0.006, hw)]
    b2 = bmesh.new(); lathe(b2, hub, steps=32, center=center, closed=True); merge(wb, b2, 4)
    # spokes: 24 bladed, 2-cross-ish (tangential offset at the hub)
    n = 24
    for i in range(n):
        a = TAU * i / n
        sgn = 1 if i % 2 else -1
        off = (0.10 if i % 4 < 2 else -0.10)
        h = center + V(math.cos(a + off) * 0.026, sgn * (hw - 0.014), math.sin(a + off) * 0.026)
        rs = 0.3108 - (0.3108 - 0.262) * VAR["rim"] / 0.050      # the spoke ends just inside the rim's base
        r = center + V(math.cos(a) * rs, sgn * 0.003, math.sin(a) * rs)
        b2 = bmesh.new()
        d = (r - h)
        mid = (h + r) / 2
        rot = d.to_track_quat("Z", "Y").to_matrix().to_4x4()
        bm2 = part_box((0.0024, 0.0009, d.length), mid, rot=rot)
        merge(wb, bm2, 5)
    # rotor (non-drive side, 160 mm) with a spider
    ry = center.y - hw + 0.004
    b2 = bmesh.new()
    lathe(b2, [(0.080, -0.0009), (0.080, 0.0009), (0.064, 0.0009), (0.064, -0.0009)], steps=64, center=V(center.x, ry, center.z))
    merge(wb, b2, 6)
    for i in range(6):
        a = TAU * i / 6
        p = center + V(math.cos(a) * 0.043, 0, math.sin(a) * 0.043)
        p.y = ry
        rot = Matrix.Rotation(-a, 4, "Y")
        merge(wb, part_box((0.046, 0.002, 0.008), p, rot=rot, bevel=0.0015), 4)
    if rear:
        # cassette: 12 speeds, 11-34, drive side
        for k, t in enumerate([11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30, 34]):
            rr = 0.0127 * t / TAU
            y = center.y + 0.067 - 0.0105 - k * 0.0039
            gear(wb, t, rr - 0.0022, rr + 0.0012, 0.0018, V(center.x, 0, center.z), y, mat=5, hole=0.012)
    return obj_from_bm(name, wb, ["Tire", "TireWall", "Carbon", "Decal", "Metal", "Silver", "Rotor"], origin=center, sharp=50)

wheel("Wheel_F", FA, False)
wheel("Wheel_R", RA, True)

# ------------------------------------------------------------- drivetrain
CY = 0.045                                  # chainline (drive side)
R52, R36 = 0.0127 * 52 / TAU, 0.0127 * 36 / TAU
cb = bmesh.new()
gear(cb, 52, R52 - 0.0028, R52 + 0.0012, 0.004, BB, CY + 0.003, mat=0, hole=R52 - 0.016)
gear(cb, 36, R36 - 0.0028, R36 + 0.0012, 0.004, BB, CY - 0.005, mat=0, hole=R36 - 0.012)
# 4-arm spider
for i in range(4):
    a = TAU * i / 4 + math.radians(30)
    p = BB + V(math.cos(a) * 0.045, CY + 0.008, math.sin(a) * 0.045)
    merge(cb, part_box((0.080, 0.008, 0.016), p, rot=Matrix.Rotation(-a, 4, "Y"), bevel=0.003), 1)
CRANK = 0.1725
CA = math.radians(-35)                      # drive arm points forward-down
for sgn, ang in ((1, CA), (-1, CA + math.pi)):
    d = V(math.cos(ang), 0, math.sin(ang))
    a = BB + V(0, sgn * (CY + 0.018), 0)
    b = a + d * CRANK
    pts = line(a, b, 6)
    secs = [profile(0.012, lerp(0.034, 0.022, i / 6), k=2.6, segs=16) for i in range(7)]
    sweep(cb, pts, secs, up=V(0, 1, 0), mat=1)
    # pedal: spindle and a flat clipless body (with --donor, the donor's platform pedals instead)
    if not DONOR:
        sweep(cb, line(b, b + V(0, sgn * 0.055, 0), 2), profile(0.010, 0.010, k=2, segs=12), up=V(0, 0, 1), mat=4)
        merge(cb, part_box((0.090, 0.060, 0.016), b + V(0.004, sgn * 0.058, 0), bevel=0.006), 3)
# axle
sweep(cb, line(BB + V(0, -(CY + 0.02), 0), BB + V(0, CY + 0.02, 0), 2), profile(0.024, 0.024, k=2, segs=16), up=V(0, 0, 1), mat=4)
obj_from_bm("Crankset", cb, ["Group", "Carbon", "Silver", "Carbon", "Silver"], origin=BB, sharp=45)

# --- chain path: ring (ccw) -> cog -> upper jockey (cw) -> lower jockey (ccw) -> back
COG_T = 14
RCOG = 0.0127 * COG_T / TAU
RJ = 0.0127 * 12 / TAU
JU = V(RA.x + 0.004, 0, RA.z - 0.062)
JL = V(RA.x + 0.020, 0, RA.z - 0.128)
# 2D in (x, z); positive radius = wrap counter-clockwise viewed from +Y... we work in the XZ plane
circles = [((BB.x, BB.z), R52), ((RA.x, RA.z), RCOG), ((JU.x, JU.z), -RJ), ((JL.x, JL.z), RJ)]
def tangent(c1, r1, c2, r2):
    dx, dz = c2[0] - c1[0], c2[1] - c1[1]
    L = math.hypot(dx, dz)
    ux, uz = dx / L, dz / L
    vx, vz = -uz, ux
    a = (r1 - r2) / L
    for bs in (1, -1):
        b = bs * math.sqrt(max(0, 1 - a * a))
        nx, nz = a * ux + b * vx, a * uz + b * vz
        p1 = (c1[0] + r1 * nx, c1[1] + r1 * nz)
        p2 = (c2[0] + r2 * nx, c2[1] + r2 * nz)
        tx, tz = -nz, nx                  # travel direction
        if tx * dx + tz * dz > 0:
            return p1, p2
    return None
segs = []
k = len(circles)
for i in range(k):
    c1, r1 = circles[i]; c2, r2 = circles[(i + 1) % k]
    segs.append(tangent(c1, r1, c2, r2))
path = []
for i in range(k):
    c, r = circles[i]
    p_in = segs[i - 1][1]; p_out = segs[i][0]
    a0 = math.atan2(p_in[1] - c[1], p_in[0] - c[0]); a1 = math.atan2(p_out[1] - c[1], p_out[0] - c[0])
    if r > 0:
        while a1 < a0: a1 += TAU
    else:
        while a1 > a0: a1 -= TAU
    steps = max(2, int(abs(a1 - a0) * abs(r) / 0.002))
    for j in range(steps + 1):
        a = lerp(a0, a1, j / steps)
        path.append((c[0] + abs(r) * math.cos(a), c[1] + abs(r) * math.sin(a)))
    path.append(segs[i][1])
# resample by the chain pitch
pts = [V(p[0], CY, p[1]) for p in path]
lengths = [0]
for a, b in zip(pts, pts[1:] + pts[:1]): lengths.append(lengths[-1] + (b - a).length)
total = lengths[-1]
nlinks = int(total / 0.0127)
pitch = total / nlinks
def at(s):
    s %= total
    for i in range(len(pts)):
        if lengths[i + 1] >= s:
            a, b = pts[i], pts[(i + 1) % len(pts)]
            return a.lerp(b, (s - lengths[i]) / max(1e-9, lengths[i + 1] - lengths[i]))
    return pts[0]
chb = bmesh.new()
for i in range(nlinks):
    a, b = at(i * pitch), at((i + 1) * pitch)
    d = b - a
    mid = (a + b) / 2
    rot = Matrix.Rotation(-math.atan2(d.z, d.x), 4, "Y")
    w = 0.0042 if i % 2 else 0.0034
    for sgn in (1, -1):
        merge(chb, part_box((0.0158, 0.0010, 0.0072), mid + V(0, sgn * w, 0), rot=rot, bevel=0.0012), 0)
    rb = bmesh.new()
    bmesh.ops.create_cone(rb, cap_ends=True, segments=8, radius1=0.0036, radius2=0.0036, depth=0.0066,
                          matrix=Matrix.Translation(a) @ Matrix.Rotation(math.pi / 2, 4, "X"))
    merge(chb, rb, 1)
obj_from_bm("Chain", chb, ["Silver", "Metal"], origin=BB, sharp=40)

# rear derailleur: hanger knuckle, parallelogram body, cage with jockeys
rb = bmesh.new()
RDY = CY
merge(rb, part_box((0.030, 0.014, 0.040), RA + V(-0.004, 0.074, -0.022), bevel=0.005), 0)
merge(rb, part_box((0.050, 0.020, 0.024), RA + V(-0.010, 0.078, -0.050), rot=Matrix.Rotation(math.radians(30), 4, "Y"), bevel=0.006), 1)
cage_c = (JU + JL) / 2
d = JL - JU
rot = Matrix.Rotation(-math.atan2(d.z, d.x), 4, "Y")
for sgn in (1, -1):
    merge(rb, part_box((d.length + 0.040, 0.002, 0.030), cage_c + V(0, RDY + sgn * 0.007, 0), rot=rot, bevel=0.008), 1 if sgn > 0 else 0)
for j in (JU, JL):
    gear(rb, 12, RJ - 0.002, RJ + 0.0008, 0.003, V(j.x, 0, j.z), RDY, mat=2)
obj_from_bm("RearDerailleur", rb, ["Group", "Carbon", "Silver"], origin=RA, sharp=40)

# front derailleur: a cage over the big ring on a braze-on
fd = bmesh.new()
fdp = BB + ST_DIR * 0.165 + V(-0.008, CY + 0.010, 0)
merge(fd, part_box((0.060, 0.016, 0.018), fdp + V(0.012, 0, -0.010), rot=Matrix.Rotation(math.radians(-20), 4, "Y"), bevel=0.005), 0)
merge(fd, part_box((0.030, 0.012, 0.030), fdp + V(-0.004, -0.012, 0.010), bevel=0.005), 1)
obj_from_bm("FrontDerailleur", fd, ["Group", "Carbon"], origin=fdp, sharp=40)

# ----------------------------------------------------------------- brakes
for nm, c, side_y, ang in (("Brake_F", FA, -0.056, math.radians(-60)), ("Brake_R", RA, -0.064, math.radians(30))):
    b = bmesh.new()
    p = c + V(math.cos(ang) * 0.072, side_y - 0.010, math.sin(ang) * 0.072)
    merge(b, part_box((0.060, 0.020, 0.024), p, rot=Matrix.Rotation(-(ang + math.pi / 2), 4, "Y"), bevel=0.007), 0)
    obj_from_bm(nm, b, ["Group"], origin=p, sharp=40)

# --------------------------------------------------------------- cockpit
ckb = bmesh.new()
spacer_top = HTT + HT_DIR * -0.030
sweep(ckb, line(HTT + HT_DIR * -0.005, spacer_top, 2), profile(0.040, 0.058, k=2.6, segs=20, tail=0.35), mat=0)
STEM_L = 0.110
stem_a = spacer_top + V(-0.012, 0, 0.008)
stem_b = stem_a + V(STEM_L, 0, -STEM_L * math.tan(math.radians(6)))
sweep(ckb, line(stem_a, stem_b, 6), profile(0.040, 0.034, k=2.8, segs=20), up=V(0, 1, 0), mat=0)
BAR = stem_b + V(0.010, 0, 0)
for sgn in (1, -1):
    # one continuous sweep per side: flat aero tops (carbon) morphing into a round, taped
    # ramp, hood bend and drop. Rotation-minimising frames, so it never twists or pinches.
    hood = BAR + V(0.085, sgn * 0.200, -0.012)
    drop_lo = BAR + V(0.050, sgn * 0.205, -0.125)
    end = BAR + V(-0.045, sgn * 0.205, -0.118)
    t_end = BAR + V(0.006, sgn * 0.150, 0.002)
    pth = line(BAR, t_end, 8)
    pth += bezier(t_end, t_end + V(0.012, sgn * 0.035, 0), hood + V(-0.032, 0, 0.004), hood, 12)[1:]
    pth += bezier(hood, hood + V(0.040, 0, -0.010), drop_lo + V(0.045, 0, 0.030), drop_lo, 14)[1:]
    pth += bezier(drop_lo, drop_lo + V(-0.030, 0, -0.004), end + V(0.030, 0, 0.0), end, 8)[1:]
    secs = []
    for i in range(len(pth)):
        u = min(1.0, max(0.0, (i - 6) / 10))          # 0 on the tops, 1 from the ramp on
        u = u * u * (3 - 2 * u)
        secs.append(profile(lerp(0.036, 0.0235, u), lerp(0.014, 0.0235, u), k=lerp(3.0, 2.0, u), segs=18))
    fcs = sweep_rmf(ckb, pth, secs, V(1, 0, 0))
    for j, f in enumerate(fcs[:-2]):
        f.material_index = 0 if j // 18 < 9 else 1
    # shift/brake hoods and levers
    hb = bmesh.new()
    hp = hood + V(0.034, 0, 0.022)
    # a shoe-shaped body on the bar's forward bend, rising to a peak (the horn) at its nose
    hpath = bezier(hood + V(-0.022, 0, 0.010), hood + V(0.004, 0, 0.012), hp + V(-0.012, 0, 0.004), hp + V(0.012, 0, 0.014), 10)
    hsec = [profile(lerp(0.026, 0.020, i / 10), 0.026 + 0.014 * math.sin(math.pi * min(1, i / 8)), k=2.6, segs=16) for i in range(11)]
    sweep(hb, hpath, hsec, up=V(0, 1, 0))
    merge(ckb, hb, 2)
    lb = bmesh.new()
    lever = bezier(hp + V(0.006, 0, -0.006), hp + V(0.030, 0, -0.050), drop_lo + V(0.058, 0, 0.030), drop_lo + V(0.042, 0, -0.012), 12)
    sweep(lb, lever, [profile(lerp(0.016, 0.010, i / 12), 0.007, k=2.6, segs=12) for i in range(13)], up=V(0, 1, 0))
    merge(ckb, lb, 3)
# a bar-end computer mount and head unit, ahead of the stem
merge(ckb, part_box((0.060, 0.050, 0.014), BAR + V(0.050, 0, 0.012), bevel=0.005), 3)
merge(ckb, part_box((0.050, 0.046, 0.016), BAR + V(0.066, 0, 0.026), rot=Matrix.Rotation(math.radians(-12), 4, "Y"), bevel=0.004), 2)
obj_from_bm("Cockpit", ckb, ["Carbon", "Tape", "Hood", "Metal", "Decal"], origin=HTT, sharp=50)

# --------------------------------------------------------- seatpost, saddle
spb = bmesh.new()
post_top = SEAT + ST_DIR * -0.045
sweep(spb, line(STT + ST_DIR * -0.06, post_top, 6), profile(0.028, 0.050, k=2.6, segs=18, tail=0.45, flip=True), mat=0)
merge(spb, part_box((0.040, 0.034, 0.018), post_top + V(0, 0, 0.004), bevel=0.005), 1)
obj_from_bm("Seatpost", spb, ["Carbon", "Metal"], origin=STT, sharp=50)

sab = bmesh.new()
L_SAD = 0.250
sx0 = SEAT.x - 0.125 + 0.012               # rear
secs, pth = [], []
for i in range(15):
    t = i / 14
    x = sx0 + t * L_SAD
    w = 0.140 * (1 - t) ** 0.35 * (1 - 0.68 * t ** 1.6) + 0.032 * t
    w = max(w, 0.030)
    h = lerp(0.016, 0.012, t)
    z = SEAT.z - 0.006 + 0.010 * (1 - t) ** 3 - 0.004 * math.sin(math.pi * t) + 0.004 * t
    pth.append(V(x, 0, z))
    secs.append([(math.cos(a) * w / 2 * (1 if math.sin(a) > 0 else 0.92),
                  math.copysign(abs(math.sin(a)) ** 0.7, math.sin(a)) * h / 2 + (0.003 if math.sin(a) > 0 else 0))
                 for a in [TAU * j / 22 for j in range(22)]])
sweep(sab, pth, secs, up=V(0, 0, 1), mat=0)
for sgn in (1, -1):                         # carbon rails
    rails = bezier(V(sx0 + 0.020, sgn * 0.034, SEAT.z - 0.008), V(sx0 + 0.060, sgn * 0.030, SEAT.z - 0.040),
                   V(sx0 + 0.170, sgn * 0.020, SEAT.z - 0.040), V(sx0 + 0.225, sgn * 0.008, SEAT.z - 0.008), 10)
    rb2 = bmesh.new(); sweep(rb2, rails, profile(0.007, 0.009, k=2, segs=10), up=V(0, 1, 0)); merge(sab, rb2, 1)
obj_from_bm("Saddle", sab, ["Saddle", "Carbon"], origin=SEAT, sharp=60)

# Everything above was built with the drivetrain on +Y; a rider facing +X has their right
# (the drive side) on -Y, so mirror the whole bike across Y.
for o in list(col.objects):
    if o.type != "MESH": continue
    b = bmesh.new(); b.from_mesh(o.data)
    bmesh.ops.transform(b, matrix=Matrix.Scale(-1, 4, (0, 1, 0)), verts=b.verts)
    bmesh.ops.reverse_faces(b, faces=b.faces)
    b.to_mesh(o.data); b.free()
    o.location.y = -o.location.y

# ----------------------------------------------------------- donor frame
# --donor <scene.gltf>: swap our frame, fork, cockpit, seatpost and saddle for the ones in
# "Road Bike" by tanity (CC BY 4.0, https://sketchfab.com/3d-models/road-bike-cb03b0657fbc4693b59194124ba713db).
# That model is unfinished (one ring, no derailleurs, rim brakes, box rims), so it keeps our
# wheels, drivetrain and disc brakes. Its geometry matches ours once scaled: the axles are
# mapped onto ours (wheelbase 990 mm), which lands its BB within a millimetre of ours.
# Each part's donor meshes are listed with the material each takes; anything not listed
# (wheels, tires, spokes, chainring, chain, cranks, pedals, rim brakes, outside cables and their
# guides) is dropped.
DONOR_PARTS = {
    "Frame": ({"1_rama_0": "Paint", "1_orange.metal_0": "Carbon", "Circle.022_rama_0": "Paint"},
              ["Paint", "Carbon"], BB),     # (1_seat.plastic and Circle.050 were outside cable guides)
    "Fork": ({"Circle.004_rama_0": "Paint"}, ["Paint"], FA),
    "Cockpit": ({"Circle.003_rama_0": "Carbon", "Circle.007_metal.black_0": "Carbon", "Circle.010_metal.black_0": "Carbon",
                 "Circle_metal.black_0": "Carbon", "Circle.011_seat.plastic_0": "Carbon", "Circle.033_metal.silver_0": "Metal",
                 "Circle.012_seat.skin_0": "Tape", "Circle.013_seat.skin_0": "Tape", "Circle.017_seat.skin_0": "Tape",
                 "Circle.014_metal.black_0": "Hood", "Circle.015_metal.silver2_0": "Metal", "Circle.016_Blue_0": "Carbon",
                 "Circle.034_metal.silver_0": "Metal", "Circle.036_metal.silver_0": "Metal"},
                ["Carbon", "Tape", "Hood", "Metal"], HTT),
    "Seatpost": ({"Plane.008_metal.black_0": "Carbon", "Circle.037_metal.black_0": "Metal", "Circle.038_metal.black_0": "Metal"},
                 ["Carbon", "Metal"], STT),
    "Saddle": ({"Plane.001_seat.skin_0": "Saddle", "Plane.001_wheel.orange_0": "Decal", "Plane.004_seat.plastic_0": "Carbon",
                "Plane.005_seat.plastic_0": "Metal", "Plane.007_seat.plastic_0": "Metal", "Plane.016_seat.plastic_0": "Metal",
                "Plane.017_seat.plastic_0": "Metal", "NurbsPath_metal.black_0": "Carbon", "NurbsPath.002_metal.black_0": "Carbon"},
               ["Saddle", "Carbon", "Decal", "Metal"], SEAT),
}
if DONOR:
    for n in DONOR_PARTS: bpy.data.objects.remove(bpy.data.objects[n])
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=DONOR)
    imported = [o for o in bpy.data.objects if o not in before]
    bpy.context.view_layer.update()
    def wcenter(n):
        o = bpy.data.objects[n]; return sum((o.matrix_world @ Vector(c) for c in o.bound_box), Vector()) / 8
    d_ra, d_fa = wcenter("Circle.019_metal.silver_0"), wcenter("Circle.028_metal.silver_0")   # the axles
    k = (FA0 - RA0).length / (d_fa - d_ra).length          # fitted at the Arc's axles, then stretched (below)
    to_ours = Matrix.Translation(RA0 - d_ra * k) @ Matrix.Scale(k, 4)
    for name, (meshes, mats, origin) in DONOR_PARTS.items():
        bm = bmesh.new()
        for mn, dst in meshes.items():
            o = bpy.data.objects[mn]
            me = o.data.copy(); me.transform(to_ours @ o.matrix_world)
            for p in me.polygons: p.material_index = mats.index(dst)
            bm.from_mesh(me); bpy.data.meshes.remove(me)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.00002)
        ob = obj_from_bm(name, bm, mats, origin=origin, sharp=55)
        if name == "Frame": frame_obj = ob
    # pedals: the donor's platform pedal (its non-drive one, which sits level), its spindle's inner
    # end put on our crank arms' outer faces, mirrored for the drive side; added to the Crankset so
    # they turn with it
    crank = bpy.data.objects["Crankset"]
    pm = {"Plane.026_seat.plastic_0": "Pedal", "Plane.026_light.orange_0": "Reflector"}
    tpl = bmesh.new()
    for mn, dst in pm.items():
        o = bpy.data.objects[mn]
        me = o.data.copy(); me.transform(to_ours @ o.matrix_world)
        if dst not in [m.name for m in crank.data.materials]: crank.data.materials.append(MAT[dst])
        for q in me.polygons: q.material_index = [m.name for m in crank.data.materials].index(dst)
        tpl.from_mesh(me); bpy.data.meshes.remove(me)
    ys = [v.co.y for v in tpl.verts]
    xs = [v.co.x for v in tpl.verts]; zs = [v.co.z for v in tpl.verts]
    seat_pt = V((min(xs) + max(xs)) / 2, min(ys), (min(zs) + max(zs)) / 2)   # spindle's inner end (it's on +Y)
    cbm = bmesh.new(); cbm.from_mesh(crank.data)
    for sgn, ang in ((-1, CA), (1, CA + math.pi)):        # after the mirror the drive side is -Y
        end = BB + V(math.cos(ang), 0, math.sin(ang)) * CRANK + V(0, sgn * (CY + 0.024), 0)
        ped = tpl.copy()
        bmesh.ops.translate(ped, vec=-seat_pt, verts=ped.verts)
        if sgn < 0:
            bmesh.ops.transform(ped, matrix=Matrix.Scale(-1, 4, (0, 1, 0)), verts=ped.verts)
            bmesh.ops.reverse_faces(ped, faces=ped.faces)
        bmesh.ops.translate(ped, vec=end - crank.location, verts=ped.verts)
        me = bpy.data.meshes.new("_p"); ped.to_mesh(me); ped.free()
        cbm.from_mesh(me); bpy.data.meshes.remove(me)
    tpl.free()
    cbm.to_mesh(crank.data); cbm.free()
    for q in crank.data.polygons: q.use_smooth = True
    crank.data.set_sharp_from_angle(angle=math.radians(45))
    # tires: the donor's (a molded tread band over a tan gumwall), in place of ours. Its tread is
    # modelled block by block (~86k triangles a tire), so it's decimated; its axles are ours, so
    # its tires land on our rims as they are. Our Tire/TireWall faces are removed.
    TIRES = {"Wheel_R": ("wheel left_", "protector_"), "Wheel_F": ("wheel left.001_", "protector.002_")}
    for wname, (wp, tp) in TIRES.items():
        wo = bpy.data.objects[wname]
        names = [m.name for m in wo.data.materials]
        wbm = bmesh.new(); wbm.from_mesh(wo.data)
        bmesh.ops.delete(wbm, geom=[f for f in wbm.faces if names[f.material_index] in ("Tire", "TireWall")], context="FACES")
        bmesh.ops.delete(wbm, geom=[v for v in wbm.verts if not v.link_faces], context="VERTS")   # their loose points
        if "Gumwall" not in names: wo.data.materials.append(MAT["Gumwall"]); names.append("Gumwall")
        parts = [(o, "Tire") for o in imported if o.type == "MESH" and o.name.startswith(tp)]
        parts += [(bpy.data.objects[wp + "wheel.black_0"], "Tire"), (bpy.data.objects[wp + "wheel.orange_0"], "Gumwall")]
        for o, dst in parts:
            me = o.data.copy(); me.transform(Matrix.Translation(-(RA0 if wname == "Wheel_R" else FA0)) @ to_ours @ o.matrix_world)
            for q in me.polygons: q.material_index = names.index(dst)
            if o.name.startswith(tp):            # thin the tread
                tmp = bpy.data.objects.new("_t", me); col.objects.link(tmp)
                dm = tmp.modifiers.new("D", "DECIMATE"); dm.ratio = TREAD_RATIO
                bake(tmp); me = tmp.data; bpy.data.objects.remove(tmp)
            wbm.from_mesh(me); bpy.data.meshes.remove(me)
        if VAR["tire"] != 28:
            # this model's tire width: the donor's 28 mm tire scaled about the rim's bead, across and outward
            tk, r0 = VAR["tire"] / 28, 0.3105
            for v in {v for f in wbm.faces if names[f.material_index] in ("Tire", "Gumwall") for v in f.verts}:
                r = math.hypot(v.co.x, v.co.z)
                if r < 1e-6: continue
                nr = r0 + (r - r0) * tk
                v.co.x *= nr / r; v.co.z *= nr / r; v.co.y *= tk
        wbm.to_mesh(wo.data); wbm.free()
        for q in wo.data.polygons: q.use_smooth = True
        wo.data.set_sharp_from_angle(angle=math.radians(50))
    for o in imported: bpy.data.objects.remove(o)
    for m in [m for m in bpy.data.materials if m.users == 0]: bpy.data.materials.remove(m)
    # this model's frame: displacement fields, linear across the tubes so straight tubes stay straight
    def deform(obj, fn):
        M = obj.matrix_world; Mi = M.inverted()
        for v in obj.data.vertices:
            w = M @ v.co; d = fn(w)
            if d.length > 0: v.co = Mi @ (w + d)
    cl = lambda t: max(0.0, min(1.0, t))
    # this model's axles: the rear triangle stretched back to its rear axle (from the seat tube, which
    # stays, to the dropouts), the front end forward to its front axle (from mid top tube and down tube
    # to the head tube); the fork and cockpit move with the head tube. Linear in x, so tubes stay straight.
    dr, df = RA.x - RA0.x, FA.x - FA0.x
    if abs(dr) > 1e-5 or abs(df) > 1e-5:
        deform(frame_obj, lambda w: V(dr * cl((-0.16 - w.x) / (0.404 - 0.16)) + df * cl((w.x - 0.10) / (0.36 - 0.10)), 0, 0))
        for nm in ("Fork", "Cockpit"): bpy.data.objects[nm].location.x += df
    if VAR["stack"]:
        # a taller front end: the head tube stretched up its own axis (its top by `stack` vertically, its
        # bottom and the fork crown where they were), the top tube's front end lifted with it, the cockpit too
        up = -HT_DIR; L = VAR["stack"] / up.z
        deform(frame_obj, lambda w: up * (L * cl((w.z - 0.70) / 0.10) * cl((w.x + 0.10) / 0.40)))
        bpy.data.objects["Cockpit"].location += up * L
    if VAR["drop"]:
        # a compact rear triangle: the seat cluster (top tube's rear end, seatstay tops, seat tube top)
        # lowered by `drop`, fading to nothing at the head tube and the dropouts; more seatpost shows
        deform(frame_obj, lambda w: V(0, 0, -VAR["drop"] * cl((w.z - 0.42) / 0.32) * cl((0.32 - w.x) / 0.44)))
        # the seatpost reaches down into the lowered seat tube: its part below the old cluster slides
        # down the seat tube's axis by as much, its top and the saddle stay where they were
        kk = VAR["drop"] / ST_DIR.z
        deform(bpy.data.objects["Seatpost"], lambda w: -ST_DIR * kk if w.z < 0.80 else V(0, 0, 0))
    # where the donor's down tube runs, for the wordmark
    from mathutils.bvhtree import BVHTree
    tree = BVHTree.FromObject(frame_obj, bpy.context.evaluated_depsgraph_get())
    def hits(o, d):
        out, o = [], Vector(o)
        while True:
            loc, nrm, i, dist = tree.ray_cast(o, Vector(d))
            if loc is None: return out
            out.append(loc); o = loc + Vector(d) * 0.0005
    dt_pts = []
    for x in (0.06, 0.36):                  # the down tube's centre line: its first two hits from below
        zs = [h.z + frame_obj.location.z for h in hits(V(x, 0, 0) - frame_obj.location, (0, 0, 1))]
        dt_pts.append(V(x, 0, (zs[0] + zs[1]) / 2))
    DONOR_DT = (dt_pts[1], dt_pts[0])       # (head-tube end, BB end)
    # (its seat tube at the front derailleur's height runs x -0.067..-0.033, where ours does, so the
    # derailleur stays put)

# -------------------------------------------------------------- wordmark
bpy.ops.object.text_add()
txt = bpy.context.object
txt.data.body = "KORD"
txt.data.font = bpy.data.fonts.load(os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts", "ArchivoExpanded-Black.ttf"))
txt.data.size = 0.044 if DONOR else 0.05    # the donor's down tube is ~40 mm deep, ours 60
txt.data.space_character = 1.0
txt.data.align_x = "CENTER"; txt.data.align_y = "CENTER"
bpy.ops.object.convert(target="MESH")
txt = bpy.context.object
wm = bmesh.new(); wm.from_mesh(txt.data); bpy.data.objects.remove(txt)
# the logo's stretch (scripts/kord/make_wordmark.py): 2.2x wide, 0.8x tall
bmesh.ops.scale(wm, vec=(2.2, 0.8, 1), verts=wm.verts)
# the ® after KORD (2026-11-24, the user's call): JetBrains Mono like the page's, not stretched, about
# 45% of the letters' height, its top level with theirs, hanging off to the right so KORD stays centered
bpy.ops.object.text_add()
_r = bpy.context.object
_r.data.body = "®"; _r.data.font = bpy.data.fonts.load(os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts", "JetBrainsMono-TM-ExtraBold.ttf"))
_r.data.size = 0.01
bpy.ops.object.convert(target="MESH")
_r = bpy.context.object
rb = bmesh.new(); rb.from_mesh(_r.data); bpy.data.objects.remove(_r)
wcap = max(v.co.y for v in wm.verts) - min(v.co.y for v in wm.verts)
rh = max(v.co.y for v in rb.verts) - min(v.co.y for v in rb.verts)
bmesh.ops.scale(rb, vec=(0.45 * wcap / rh,) * 2 + (1,), verts=rb.verts)
bmesh.ops.translate(rb, vec=(max(v.co.x for v in wm.verts) + 0.07 * wcap - min(v.co.x for v in rb.verts),
                             max(v.co.y for v in wm.verts) - max(v.co.y for v in rb.verts), 0), verts=rb.verts)
_m = bpy.data.meshes.new("_reg"); rb.to_mesh(_m); rb.free(); wm.from_mesh(_m); bpy.data.meshes.remove(_m)
bmesh.ops.triangulate(wm, faces=wm.faces)
for _ in range(8):                          # small triangles, so the wrap can follow the tube
    long = [e for e in wm.edges if e.calc_length() > 0.0035]   # 3.5 mm: enough to follow the tube
    if not long: break
    bmesh.ops.subdivide_edges(wm, edges=long, cuts=1, use_grid_fill=False)
    bmesh.ops.triangulate(wm, faces=[f for f in wm.faces if len(f.verts) > 3])
dt_a, dt_b = DONOR_DT if DONOR else (HTB + V(-0.004, 0, 0.022), BB + V(0.03, 0, 0.012))
dt_mid = dt_a.lerp(dt_b, 0.52)
ang = math.atan2(dt_a.z - dt_b.z, dt_a.x - dt_b.x)
out = bmesh.new()
for sgn in (1, -1):
    c = wm.copy()
    # text lies in XY (reads along +X); stand it up in XZ facing +-Y, along the down tube
    # -Y (drive side, front on the right): reads +X, up the tube; +Y: reads -X, so it reads
    # left to right from that side too
    rot = Matrix.Rotation(-ang, 4, "Y")
    face = Matrix.Rotation(math.pi / 2, 4, "X") if sgn < 0 else Matrix.Rotation(math.pi, 4, "Z") @ Matrix.Rotation(math.pi / 2, 4, "X")
    bmesh.ops.transform(c, matrix=rot @ face, verts=c.verts)
    bmesh.ops.translate(c, vec=dt_mid + V(0, sgn * 0.040, 0), verts=c.verts)
    merge(out, c, 0)
wm.free()
wobj = obj_from_bm("Wordmark", out, ["Decal"], smooth_shade=False, origin=BB)
sw = wobj.modifiers.new("W", "SHRINKWRAP"); sw.target = frame_obj; sw.wrap_method = "PROJECT"
sw.use_project_y = True; sw.use_negative_direction = True; sw.use_positive_direction = True; sw.offset = 0.0005
bake(wobj)

# ----------------------------------------------------------- head badge
# The model name across the front of the head tube: "ARC" in Archivo Expanded Black, unstretched,
# reading left to right seen from the front (2026-11-24, the user's call; it ran down the tube, one
# letter under another, until then). As wide as the part of the tube's front that faces forward
# (measured by ray casts: out to where it has curved 8 mm back), so the letters don't wrap round the sides. Its own material, Badge, colored per paint to contrast with it (the
# down-tube wordmark sits on raw carbon, so the Decal color works there, but the head tube's front is
# paint: a chartreuse badge vanished on Volt and a pale one on Glacier). Projected onto the tube
# like the wordmark, then merged into the Wordmark object so it stays with the frame when the bike
# comes apart.
BADGE = VAR["name"]                              # the model's name, with its ™ (2026-11-24)
from mathutils.bvhtree import BVHTree
_tree = BVHTree.FromObject(frame_obj, bpy.context.evaluated_depsgraph_get())
_Mi = frame_obj.matrix_world.inverted()
_back = (_Mi.to_3x3() @ V(-1, 0, 0)).normalized()
def front_of_tube(z, y=0.0):
    hit = _tree.ray_cast(_Mi @ V(1.5, y, z), _back)[0]
    return None if hit is None else frame_obj.matrix_world @ hit
hz_top, hz_bot = (0.80, 0.72) if DONOR else (HTT.z - 0.02, HTB.z + 0.02)
p_top, p_bot = front_of_tube(hz_top), front_of_tube(hz_bot)
mid_z = (hz_top + hz_bot) / 2
p_mid = front_of_tube(mid_z)
half_w, prof = 0.0, []
for i in range(1, 80):                           # how far the front faces forward: out to where the
    y = i * 0.0005                               # surface has curved 8 mm back (~50° round a 33 mm tube)
    h = front_of_tube(mid_z, y)
    dx = None if h is None else p_mid.x - h.x
    if i % 4 == 0: prof.append((round(y * 1000, 1), None if dx is None else round(dx * 1000, 1)))
    if dx is None or dx > 0.008: break
    half_w = y
print("HEAD TUBE PROFILE (y mm, set back mm):", prof)
A = (p_top - p_bot).normalized()                 # up the tube
R = V(0, 1, 0)                                   # reading direction: the viewer's right, seen from the front
U = A                                            # letters' tops: up the tube
N = R.cross(U).normalized()                      # facing forward, out of the tube
FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
def text_mesh(body, font_file, size):
    bpy.ops.object.text_add()
    t = bpy.context.object
    t.data.body = body; t.data.font = bpy.data.fonts.load(os.path.join(FONTS, font_file))
    t.data.size = size; t.data.space_character = 1.08
    bpy.ops.object.convert(target="MESH")
    t = bpy.context.object
    m = bmesh.new(); m.from_mesh(t.data); bpy.data.objects.remove(t)
    return m
name, tm = BADGE.replace("™", ""), "™" in BADGE
if len(name) > 5:
    # a long name (MERIDIAN) came out ~3 mm tall across the tube: its initial instead, as a monogram
    # (no ™ on a single letter), at the short names' letter height (2026-11-24, the user's call)
    name, tm = name[0], False
bb = text_mesh(name, "ArchivoExpanded-Black.ttf", 0.01)
cap = max(v.co.y for v in bb.verts) - min(v.co.y for v in bb.verts)
# the name is what's centered on the tube (2026-11-24, the user's call); the ™ hangs off to its right
name_c = V((max(v.co.x for v in bb.verts) + min(v.co.x for v in bb.verts)) / 2, (max(v.co.y for v in bb.verts) + min(v.co.y for v in bb.verts)) / 2, 0)
if tm:
    # the ™ in Archivo at normal width, like the page (the user's call, 2026-11-24; it was JetBrains
    # Mono): its own piece, about half the letters' height, its top level with theirs, just after the name
    cap = max(v.co.y for v in bb.verts) - min(v.co.y for v in bb.verts)
    right = max(v.co.x for v in bb.verts)
    tb = text_mesh("™", "Archivo-TM.ttf", 0.01)        # a plain sans: Archivo at normal width, regular weight
    th = max(v.co.y for v in tb.verts) - min(v.co.y for v in tb.verts)
    k_tm = 0.5 * cap / th
    bmesh.ops.scale(tb, vec=(k_tm, k_tm, 1), verts=tb.verts)
    dx = right + 0.08 * cap - min(v.co.x for v in tb.verts)
    dy = max(v.co.y for v in bb.verts) - max(v.co.y for v in tb.verts)
    bmesh.ops.translate(tb, vec=(dx, dy, 0), verts=tb.verts)
    m = bpy.data.meshes.new("_tm"); tb.to_mesh(m); tb.free(); bb.from_mesh(m); bpy.data.meshes.remove(m)
bmesh.ops.translate(bb, vec=-name_c, verts=bb.verts)   # the name centered
BADGE_W = min(2 * half_w, 0.034)                 # across the forward-facing part of the tube (34 mm with the ™)
k = (BADGE_W / 2) / max(abs(v.co.x) for v in bb.verts)   # its widest side (the ™'s) inside half of that
k = min(k, 0.0055 / cap)                         # letters no taller than ARC's (5.5 mm): a monogram stays a badge
bmesh.ops.scale(bb, vec=(k, k, 1), verts=bb.verts)
bmesh.ops.triangulate(bb, faces=bb.faces)
for _ in range(8):
    long = [e for e in bb.edges if e.calc_length() > 0.0012]
    if not long: break
    bmesh.ops.subdivide_edges(bb, edges=long, cuts=1, use_grid_fill=False)
    bmesh.ops.triangulate(bb, faces=[f for f in bb.faces if len(f.verts) > 3])
bme = bpy.data.meshes.new("Badge"); bb.to_mesh(bme); bb.free()
badge = bpy.data.objects.new("Badge", bme); col.objects.link(badge)
rot = Matrix((R, U, N)).transposed().to_4x4()
badge.matrix_world = Matrix.Translation(p_mid + N * 0.006) @ rot
sw = badge.modifiers.new("W", "SHRINKWRAP"); sw.target = frame_obj; sw.wrap_method = "PROJECT"
sw.use_project_z = True; sw.use_negative_direction = True; sw.use_positive_direction = True; sw.offset = 0.0005
bake(badge)
bme = badge.data; bme.transform(badge.matrix_world); bme.transform(wobj.matrix_world.inverted())
n_word = len(wobj.data.polygons)
wb = bmesh.new(); wb.from_mesh(wobj.data); wb.from_mesh(bme); wb.to_mesh(wobj.data); wb.free()
wobj.data.materials.append(MAT["Badge"])
for i, q in enumerate(wobj.data.polygons): q.material_index = 0 if i < n_word else 1
bpy.data.objects.remove(badge)
print("BADGE", name + ("™" if tm else ""), f"across the head tube at z {mid_z:.3f}: forward-facing front {2 * half_w * 1000:.1f} mm wide, letters {cap * k * 1000:.1f} mm tall")

# ------------------------------------------------------------ this model's stance, the phones' model
# wider tires sit the bike higher: lift everything so they stand on the floor
LIFT = (VAR["tire"] / 28 - 1) * (R_WHEEL - 0.3105)
if LIFT > 0:
    for o in col.objects:
        if o.type == "MESH" and o.parent is None: o.location.z += LIFT
if LITE:
    for o in [o for o in col.objects if o.type == "MESH" and o.name != "Wordmark"]:
        m = o.modifiers.new("Lite", "DECIMATE"); m.ratio = LITE; bake(o)
print("VARIANT", BIKE, VAR, "lift", round(LIFT * 1000, 1), "mm", "lite", LITE)

# ------------------------------------------------------------ ambient occlusion
# Baked with Cycles into each part's "AO" color attribute (per vertex), exported as its UV (see GLB). The
# page applies it to reflected and ambient light only, as real occlusion works, and fades it as
# the bike comes apart (it was baked assembled). Rays reach 12 cm, so it darkens crevices and the
# places parts meet, not whole faces.
AO_FLOOR = {"Wheel": {"Silver": 0.8}, "Chain": {"Silver": 0.65, "Metal": 0.65}}
if BAKE_AO:
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"; scene.cycles.samples = 128
    if not scene.world: scene.world = bpy.data.worlds.new("W")
    scene.world.light_settings.distance = 0.12
    meshes = [o for o in col.objects if o.type == "MESH"]
    for o in meshes:
        a = o.data.color_attributes.new("AO", "BYTE_COLOR", "POINT")
        o.data.color_attributes.active_color = a
    bpy.ops.object.select_all(action="DESELECT")
    for o in meshes: o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    def flip_all():
        for o in meshes:
            b = bmesh.new(); b.from_mesh(o.data); bmesh.ops.reverse_faces(b, faces=b.faces); b.to_mesh(o.data); b.free()
    # Some procedural parts (rims, spokes, hubs, rotors, rings, chain, cassette) came out inside
    # out, and rays from an inward face start inside the part and come back black. So bake twice,
    # as is and with every face flipped: a face whose flipped bake is clearly brighter was inside
    # out and is flipped for good (which also fixes its shading on the page), and each point keeps
    # the brighter of its two results.
    bpy.ops.object.bake(type="AO", target="VERTEX_COLORS")
    first = {o.name: [c.color[0] for c in o.data.color_attributes["AO"].data] for o in meshes}
    flip_all()
    bpy.ops.object.bake(type="AO", target="VERTEX_COLORS")
    flip_all()                                  # back as they were, then fix the inside-out faces
    for o in meshes:
        a = first[o.name]
        d = o.data.color_attributes["AO"].data
        bvals = [c.color[0] for c in d]
        b = bmesh.new(); b.from_mesh(o.data)
        # decided per connected part (a rim, a spoke, a ring), by a majority of its faces: per face, a
        # few faces of the rim's lip — under the tire's bead, dark both ways, so their two bakes were
        # noise — flipped on their own and showed as grey blocks on the rims (2026-11-24)
        vote = {f.index: sum(bvals[v.index] - a[v.index] for v in f.verts) / len(f.verts) > 0.2 for f in b.faces}
        bad, seen = [], set()
        for f0 in b.faces:
            if f0.index in seen: continue
            part, stack = [], [f0]; seen.add(f0.index)
            while stack:
                f = stack.pop(); part.append(f)
                for e in f.edges:
                    for g in e.link_faces:
                        if g.index not in seen: seen.add(g.index); stack.append(g)
            if sum(vote[f.index] for f in part) * 2 > len(part): bad += part
        bmesh.ops.reverse_faces(b, faces=bad); b.to_mesh(o.data); b.free()
        d = o.data.color_attributes["AO"].data
        vals = [max(x, y) for x, y in zip(a, bvals)]
        # spokes and chain plates have vertices only at their ends, buried in the hub, rim or the
        # next plate, so their per-vertex AO reads black; give them a floor
        floor = AO_FLOOR.get(o.name.split("_")[0], {})
        if floor:
            mn = [m.name for m in o.data.materials]
            for q in o.data.polygons:
                f = floor.get(mn[q.material_index])
                if f:
                    for vi in q.vertices: vals[vi] = max(vals[vi], f)
        # wheels are round, and they roll: their rims and tires get the same AO all the way round — each
        # ring (a radius and a distance across, to the mm) takes its median. Baked as is, the rim's faces
        # were blotchy (bake noise, plus the frame's and fork's shadows printed on the rim, which would
        # turn with the wheel), and the user saw the blotches as shadows (2026-11-24)
        if o.name.startswith("Wheel"):
            mn = [m.name for m in o.data.materials]
            vm = {}
            for q in o.data.polygons:
                for vi in q.vertices: vm.setdefault(vi, mn[q.material_index])
            rings = {}
            for vi, m in vm.items():
                if m not in ("Carbon", "Gumwall", "Tire", "Decal"): continue
                co = o.data.vertices[vi].co
                rings.setdefault((m, round(math.hypot(co.x, co.z) * 1000), round(co.y * 1000)), []).append(vi)
            for vis in rings.values():
                med = sorted(vals[i] for i in vis)[len(vis) // 2]
                for i in vis: vals[i] = med
        for i, c in enumerate(d):
            c.color = (vals[i], vals[i], vals[i], 1)
        print("AO", o.name, round(sum(max(x, y) for x, y in zip(a, bvals)) / max(1, len(a)), 3), "flipped", len(bad), "of", len(o.data.polygons))

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "bike.blend"))

# ---------------------------------------------------------------- preview
if PREVIEW:
    world = bpy.data.worlds.new("W"); scene.world = world; world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.03, 0.032, 0.036, 1)
    g = bmesh.new(); bmesh.ops.create_grid(g, x_segments=1, y_segments=1, size=20)
    me = bpy.data.meshes.new("G"); g.to_mesh(me); g.free()
    ground = bpy.data.objects.new("Ground", me); col.objects.link(ground)
    ground.data.materials.append(material("Floor", (0.05, 0.05, 0.055), rough=0.4))
    def area(loc, tgt, sx, sy, power):
        d = bpy.data.lights.new("L", "AREA"); d.shape = "RECTANGLE"; d.size = sx; d.size_y = sy; d.energy = power
        o = bpy.data.objects.new("L", d); o.location = loc; col.objects.link(o)
        o.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    area((0.1, 0, 2.6), (0.1, 0, 0), 2.5, 0.6, 260)
    area((0.4, 2.4, 1.2), (0.1, 0, 0.5), 2.0, 1.0, 180)
    area((0.3, -2.4, 1.0), (0.1, 0, 0.5), 2.0, 1.0, 90)
    area((-2.5, 0.5, 1.0), (0, 0, 0.5), 0.4, 1.6, 120)
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam")); col.objects.link(cam); scene.camera = cam
    cam.data.clip_start = 0.01
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 1600, 900
    views = {"side": ((0.09, -2.6, 0.52), (0.09, 0, 0.50), 50), "front34": ((1.6, -1.7, 0.85), (0.09, 0, 0.48), 50),
             "rear34": ((-1.7, -1.5, 0.9), (0.0, 0, 0.45), 50), "nds": ((0.3, 2.2, 0.7), (0.09, 0, 0.48), 50),
             "drive": ((0.05, -0.75, 0.45), (-0.18, -0.04, 0.30), 50), "cockpit": ((0.9, -0.45, 1.05), (0.45, 0, 0.85), 45),
             "logo": ((0.22, -0.9, 0.52), (0.22, 0, 0.50), 50), "bars": ((0.75, -0.55, 0.85), (0.52, -0.1, 0.78), 40)}
    for name, (loc, tgt, lens) in views.items():
        cam.location = loc; cam.data.lens = lens
        cam.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        scene.render.filepath = os.path.join(OUT, f"preview_{name}.png")
        bpy.ops.render.render(write_still=True)

if STILLS:
    # Transparent stills: the hero's no-WebGL poster (same angle as the page's hero) and one
    # per bike in the range, each in its own paint (the concept uses the one frame for all four).
    os.makedirs(STILLS, exist_ok=True)
    for o in list(col.objects):
        if o.name in ("Ground", "Cam") or o.type == "LIGHT": bpy.data.objects.remove(o)
    if not scene.world:
        scene.world = bpy.data.worlds.new("W"); scene.world.use_nodes = True
    bgn = scene.world.node_tree.nodes["Background"]
    bgn.inputs[0].default_value = (0.05, 0.05, 0.055, 1)
    bgn.inputs[1].default_value = 0.3
    if HDRI:                                   # the same studio the page reflects
        env = scene.world.node_tree.nodes.new("ShaderNodeTexEnvironment")
        env.image = bpy.data.images.load(os.path.abspath(HDRI))
        scene.world.node_tree.links.new(env.outputs["Color"], bgn.inputs["Color"])
        bgn.inputs[1].default_value = HDRI_STRENGTH
    def area(loc, tgt, sx, sy, power):
        d = bpy.data.lights.new("L", "AREA"); d.shape = "RECTANGLE"; d.size = sx; d.size_y = sy; d.energy = power
        o = bpy.data.objects.new("L", d); o.location = loc; col.objects.link(o)
        o.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    if HDRI:
        # lit by the studio alone, toned like the page (three's NeutralToneMapping is Khronos PBR
        # Neutral; exposure 1.25 = +0.32 stops), plus the page's chartreuse rim from behind
        scene.view_settings.view_transform = "Khronos PBR Neutral"
        scene.view_settings.exposure = math.log2(1.25)
        area((-2.6, -0.6, 1.0), (0, 0, 0.5), 0.4, 1.6, 45)
    else:
        # (dimmer than when the materials were glossy: rough surfaces pick up every light evenly)
        area((0.1, 0, 2.6), (0.1, 0, 0), 2.5, 0.6, 170)
        area((0.6, -2.4, 1.1), (0.1, 0, 0.5), 2.2, 1.2, 70)
        area((-0.4, 2.4, 1.2), (0.1, 0, 0.5), 2.0, 1.0, 50)
        area((-2.6, -0.6, 1.0), (0, 0, 0.5), 0.4, 1.6, 120)
    scene.render.engine = "CYCLES" if CYCLES else "BLENDER_EEVEE"
    if CYCLES:
        scene.cycles.device = "CPU"; scene.cycles.samples = 96; scene.cycles.use_denoising = True
    scene.render.film_transparent = True
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam")); col.objects.link(cam); scene.camera = cam
    def lin(h):
        c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
        return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)
    def paint(hexc, decal, metal, rough, coat, coat_rough, badge):    # the same values as PAINTS in data.js
        b = MAT["Paint"].node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = (*lin(hexc), 1); b.inputs["Metallic"].default_value = metal; b.inputs["Roughness"].default_value = rough
        b.inputs["Coat Weight"].default_value = coat; b.inputs["Coat Roughness"].default_value = coat_rough
        MAT["Decal"].node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (*lin(decal), 1)
        MAT["Badge"].node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (*lin(badge), 1)
    def shot(path, yaw, elev, lens, w, h, fill):
        c = Vector((0.09, 0, 0.5))
        dist = 1.85 / fill / (2 * math.tan(math.atan(18 / lens)))   # 36 mm sensor: half-width 18
        d = Vector((math.sin(yaw), -math.cos(yaw), math.sin(elev))).normalized()
        cam.location = c + d * dist; cam.data.lens = lens
        cam.rotation_euler = (c - cam.location).to_track_quat("-Z", "Y").to_euler()
        scene.render.resolution_x, scene.render.resolution_y = w, h
        scene.render.filepath = path
        bpy.ops.render.render(write_still=True)
    paint("#16171a", "#c8f031", 0.05, 0.68, 0.0, 0.5, "#c8f031")           # Stealth, the page's default
    if BIKE == "arc": shot(os.path.join(STILLS, "hero.png"), 0.5, 0.06, 60, 1600, 900, 0.86)
    # An optional product-shot rig for the range stills (--range-light; off by default: tried on 2026-11-25 for
    # dark bikes on dark cards, and the user found it made the bike look fake — the cards' brighter backdrop,
    # --cd-shot-glow in kord.css, does that job instead). The hero still above keeps
    # the studio alone, since it must match the 3D hero it crossfades into. An overhead softbox for sheen
    # along the top tube, saddle and bars; a soft key from the camera's side and a gentle fill opposite; and
    # two tall strips behind the bike that rim the tires, frame and bars against the dark card.
    if not RANGE_DIM:
        area((0.1, 0, 2.7), (0.1, 0, 0.4), 2.6, 0.9, RANGE_POWER * 260)          # overhead softbox
        area((1.4, -2.6, 1.7), (0.1, 0, 0.5), 2.0, 1.4, RANGE_POWER * 190)       # key, camera side
        area((-1.8, -2.2, 1.0), (0.1, 0, 0.5), 1.6, 1.0, RANGE_POWER * 70)       # fill
        area((-1.7, 2.1, 1.1), (0.1, 0, 0.55), 0.35, 1.8, RANGE_POWER * 160)     # rims, behind
        area((1.9, 1.9, 1.1), (0.1, 0, 0.55), 0.35, 1.8, RANGE_POWER * 160)
    # every paint, as PAINTS in data.js (hex, decal, metal, rough, coat, coat roughness, badge)
    PAINTS_PY = {"stealth": ("#16171a", "#c8f031", 0.05, 0.68, 0.0, 0.5, "#c8f031"), "volt": ("#c8f031", "#c8f031", 0.0, 0.64, 0.0, 0.5, "#16171a"),
                 "glacier": ("#e4e8ec", "#f4f6f8", 0.0, 0.64, 0.0, 0.5, "#16171a"), "ember": ("#b8321c", "#f4f1ea", 0.15, 0.6, 0.0, 0.5, "#f4f1ea"),
                 "cobalt": ("#2350c8", "#f4f6f8", 0.12, 0.6, 0.0, 0.5, "#f4f6f8")}
    # --paints cobalt,volt: only those (a new paint renders without redoing the rest)
    ONLY = argv[argv.index("--paints") + 1].split(",") if "--paints" in argv else None
    if ALL_PAINTS:
        # the page shows any bike in any paint (Compare's paint picker, the range cards' swatches, the cart),
        # so paint isn't read as part of the model (2026-11-25): bikes/<bike>-<paint>.webp
        for pid, pv in PAINTS_PY.items():
            if ONLY and pid not in ONLY: continue
            paint(*pv)
            shot(os.path.join(STILLS, f"{BIKE}-{pid}.png"), 0.22, 0.05, 70, 1200, 720, 0.84)
    for bid, *pv in (() if ALL_PAINTS else (("arc", "#16171a", "#c8f031", 0.05, 0.68, 0.0, 0.5, "#c8f031"), ("crest", "#e4e8ec", "#f4f6f8", 0.0, 0.64, 0.0, 0.5, "#16171a"),
                     ("meridian", "#b8321c", "#f4f1ea", 0.15, 0.6, 0.0, 0.5, "#f4f1ea"), ("atlas", "#c8f031", "#c8f031", 0.0, 0.64, 0.0, 0.5, "#16171a"))):
        if bid != BIKE: continue                    # each model's build renders its own still
        paint(*pv)
        shot(os.path.join(STILLS, f"{bid}.png"), 0.22, 0.05, 70, 1200, 720, 0.84)

if SHADOW:
    # The floor shadow under the page's bike, baked: Cycles renders a shadow-catcher floor from
    # straight above (orthographic, SHADOW_W x SHADOW_D m around the bike's middle), so it's dark where the
    # tires touch and soft elsewhere, like a real one. The
    # page lays it on a plane under the bike that turns with it (SHADOW_* in BikeStory.js).
    for o in list(col.objects):
        if o.name in ("Ground", "Cam") or o.type == "LIGHT": bpy.data.objects.remove(o)
    g = bmesh.new(); bmesh.ops.create_grid(g, x_segments=1, y_segments=1, size=3)
    me = bpy.data.meshes.new("Floor"); g.to_mesh(me); g.free()
    floor = bpy.data.objects.new("Floor", me); col.objects.link(floor); floor.is_shadow_catcher = True
    # Lit for a floor shadow, not by the studio HDRI (its softboxes sit low at the sides and threw
    # long sideways shadows): a big softbox overhead, a little to the camera's side like the page's
    # key light, so the shadow falls just behind the bike, plus an even ambient for the
    # contact darkening
    sw = bpy.data.worlds.new("ShadowWorld"); sw.use_nodes = True; scene.world = sw
    sw.node_tree.nodes["Background"].inputs[0].default_value = (1, 1, 1, 1)
    sw.node_tree.nodes["Background"].inputs[1].default_value = 0.35
    L = bpy.data.lights.new("ShadowKey", "AREA"); L.shape = "DISK"; L.size = 2.2; L.energy = 900
    key = bpy.data.objects.new("ShadowKey", L); col.objects.link(key); key.location = (0.3, -0.45, 3.4)
    key.rotation_euler = (Vector((0.09, 0, 0)) - key.location).to_track_quat("-Z", "Y").to_euler()
    cam = bpy.data.objects.new("ShadowCam", bpy.data.cameras.new("ShadowCam")); col.objects.link(cam); scene.camera = cam
    cam.data.type = "ORTHO"; cam.data.ortho_scale = SHADOW_W
    cam.location = (0.09, 0, 3.0); cam.rotation_euler = (0, 0, 0)
    scene.render.engine = "CYCLES"; scene.cycles.device = "CPU"; scene.cycles.samples = 256; scene.cycles.use_denoising = True
    scene.render.film_transparent = True
    scene.render.resolution_x, scene.render.resolution_y = 1024, int(1024 * SHADOW_D / SHADOW_W)
    scene.view_settings.view_transform = "Standard"; scene.view_settings.exposure = 0
    for o in col.objects:
        if o.type == "MESH" and o is not floor: o.visible_camera = False   # cast shadows, but don't show
    scene.render.image_settings.file_format = "PNG"; scene.render.image_settings.color_mode = "RGBA"
    scene.render.filepath = SHADOW
    bpy.ops.render.render(write_still=True)
    # fade its edges to nothing (a smoothstep over the outer 12%), so the shadow never ends in a
    # straight line where the plane does
    import numpy as np
    img = bpy.data.images.load(SHADOW); w, h = img.size
    px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
    def ramp(n):
        t = np.minimum(np.arange(n), np.arange(n)[::-1]) / (0.12 * n)
        t = np.clip(t, 0, 1); return t * t * (3 - 2 * t)
    px[:, :, 3] *= ramp(h)[:, None] * ramp(w)[None, :]
    img.pixels[:] = px.ravel(); img.filepath_raw = SHADOW; img.file_format = "PNG"; img.save()
    for o in col.objects:
        if o.type == "MESH": o.visible_camera = True
    bpy.data.objects.remove(floor); bpy.data.objects.remove(cam); bpy.data.objects.remove(key)

if GLB:
    for o in list(col.objects):
        if o.name in ("Ground", "Cam") or o.type == "LIGHT": bpy.data.objects.remove(o)
    if BAKE_AO:
        # Ship the AO as the only UV channel (u = AO, v = 0): Draco quantizes texture coordinates
        # (8 bits here) but not vertex colors in this exporter, so as COLOR_0 it cost ~430 KB and
        # as a UV ~26 KB. The page reads it from the `uv` attribute.
        for o in col.objects:
            if o.type != "MESH": continue
            me = o.data
            while me.uv_layers: me.uv_layers.remove(me.uv_layers[0])
            uv = me.uv_layers.new(name="AO")
            ao = me.color_attributes["AO"].data
            for li, l in enumerate(me.loops): uv.data[li].uv = (ao[l.vertex_index].color[0], 0.0)
    bpy.ops.export_scene.gltf(filepath=GLB, export_format="GLB", export_apply=True, export_yup=True,
                              export_vertex_color="NONE", export_draco_texcoord_quantization=8,
                              export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6)
for o in col.objects:
    if o.type == "MESH": print("PART", o.name, sum(len(p.vertices) - 2 for p in o.data.polygons))
print("TRIS", sum(len(p.vertices) - 2 for o in col.objects if o.type == "MESH" for p in o.data.polygons))
