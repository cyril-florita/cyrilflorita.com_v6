"""
Builds the pitch's car in Blender, from nothing: a fastback coupe lofted from
cross-sections, with wheels, lights and glass.

  /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/mustang/build_car.py -- <out_dir> [--preview] [--glb <file>]

Units are metres. X runs along the car (front = +X), Y across, Z up.
Everything is named so the page (three.js) can find it: materials Paint,
Glass, Trim, Tire, Rim, Disc, Caliper, Chrome, LightWhite, LightRed, Interior,
Screen; objects Body, Wheel_FL/FR/RL/RR, ...
"""
import bpy, bmesh, math, sys, os
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "."
PREVIEW = "--preview" in argv
GLB = argv[argv.index("--glb") + 1] if "--glb" in argv else None
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = scene.collection

# ----------------------------------------------------------------- helpers
def lerp(a, b, t): return a + (b - a) * t
def smooth(t):
    t = max(0.0, min(1.0, t)); return t * t * (3 - 2 * t)
def curve(keys):
    keys = sorted(keys)
    def f(x):
        if x <= keys[0][0]: return keys[0][1]
        if x >= keys[-1][0]: return keys[-1][1]
        for (x0, v0), (x1, v1) in zip(keys, keys[1:]):
            if x0 <= x <= x1:
                return lerp(v0, v1, (x - x0) / (x1 - x0))
    return f

def material(name, color, metallic=0.0, rough=0.5, emission=None, strength=0.0, coat=0.0, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = rough
    if coat and "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
        b.inputs["Coat Roughness"].default_value = 0.08
    if emission:
        b.inputs["Emission Color"].default_value = (*emission, 1)
        b.inputs["Emission Strength"].default_value = strength
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
        m.surface_render_method = "BLENDED" if hasattr(m, "surface_render_method") else m.surface_render_method
    return m

MAT = {
    "Paint": material("Paint", (0.045, 0.070, 0.105), metallic=0.9, rough=0.28, coat=1.0),
    "Glass": material("Glass", (0.002, 0.003, 0.005), metallic=0.0, rough=0.02, coat=1.0),
    "Trim": material("Trim", (0.004, 0.004, 0.005), rough=0.45),
    "Tire": material("Tire", (0.010, 0.010, 0.011), rough=0.85),
    "Rim": material("Rim", (0.06, 0.065, 0.075), metallic=0.9, rough=0.3),
    "Disc": material("Disc", (0.30, 0.30, 0.31), metallic=1.0, rough=0.38),
    "Caliper": material("Caliper", (0.02, 0.12, 0.65), rough=0.4),
    "Grille": material("Grille", (0.012, 0.013, 0.015), metallic=0.3, rough=0.5),
    "Mesh": material("Mesh", (0.020, 0.021, 0.024), metallic=0.9, rough=0.30),
    "Chrome": material("Chrome", (0.80, 0.81, 0.83), metallic=1.0, rough=0.12),
    "LightWhite": material("LightWhite", (1, 1, 1), emission=(0.82, 0.92, 1.0), strength=14),
    "LightRed": material("LightRed", (1, 0.05, 0.03), emission=(1.0, 0.06, 0.03), strength=10),
    "Interior": material("Interior", (0.016, 0.017, 0.020), rough=0.7),
    "Screen": material("Screen", (0.02, 0.05, 0.10), emission=(0.10, 0.45, 0.95), strength=3),
}

def obj_from_bm(name, bm, mats, smooth_shade=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    for m in mats: me.materials.append(MAT[m])
    if smooth_shade:
        for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me)
    col.objects.link(o)
    return o

def bake(o):
    """Apply the object's modifiers into its mesh."""
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    old = o.data
    o.modifiers.clear()
    o.data = me
    bpy.data.meshes.remove(old)
    return o

# ------------------------------------------------------------ dimensions
L2 = 2.405                       # half length (4.81 m)
AX_F, AX_R = 1.5255, -1.1925     # axles (2.718 m wheelbase)
WHEEL_R, WHEEL_Y = 0.345, 0.815

W = curve([(-2.405, 0.80), (-2.34, 0.87), (-2.15, 0.925), (-1.75, 0.952), (-1.19, 0.9575), (-0.75, 0.935),
           (-0.2, 0.912), (0.5, 0.912), (1.0, 0.935), (1.5255, 0.955), (1.95, 0.945), (2.2, 0.905), (2.34, 0.845), (2.405, 0.76)])
# Traced from the Dark Horse side photo (new-work/mustang/ref/dark-horse-2.webp): scaled by the
# wheelbase, with the overhangs stretched to the real 4.81 m and heights to the real 1.40 m roof,
# since the wide lens shrinks the ends. ZB: the shoulder / glass line; ZR: the top silhouette.
ZB = curve([(2.405, 0.70), (2.34, 0.72), (2.2, 0.75), (1.95, 0.80), (1.5255, 0.88), (1.2, 0.945), (0.95, 0.985),
            (0.2, 1.03), (-0.6, 1.04), (-1.19, 1.05), (-1.75, 1.06), (-2.15, 1.06), (-2.3, 1.065), (-2.405, 1.045)])
ZR = curve([(2.405, 0.72), (2.34, 0.756), (2.2, 0.78), (1.97, 0.846), (1.59, 0.914), (1.28, 0.98), (0.98, 1.01),
            (0.80, 1.024), (0.55, 1.15), (0.3, 1.28), (0.05, 1.36), (-0.21, 1.40), (-0.55, 1.39), (-0.85, 1.35), (-1.01, 1.28),
            (-1.3, 1.2), (-1.575, 1.12), (-1.95, 1.095),(-2.15, 1.09), (-2.3, 1.095), (-2.405, 1.055)])
ZF = curve([(-2.405, 0.34), (-2.3, 0.30), (-1.9, 0.20), (-1.19, 0.165), (1.5, 0.165), (2.1, 0.185), (2.34, 0.20), (2.405, 0.22)])
WR = curve([(0.98, 0.66), (0.2, 0.62), (-0.3, 0.635), (-0.8, 0.615), (-1.19, 0.56), (-1.5, 0.52), (-1.95, 0.52)])
INSET = curve([(0.98, 0.06), (0.2, 0.08), (-0.6, 0.095), (-1.19, 0.15), (-1.78, 0.21)])
SCALLOP = curve([(-1.19, 0.0), (-0.75, 0.055), (0.6, 0.062), (1.1, 0.0)])   # the doors tuck in between the wheels

XS = [-2.405, -2.37, -2.3, -2.15, -1.95, -1.78, -1.5, -1.19, -0.9, -0.6, -0.25, 0.2, 0.5, 0.75, 0.98, 1.2,
      1.5255, 1.95, 2.2, 2.34, 2.39, 2.405]
NP = 13  # points per half section

def section(x):
    w, zb, zr, zf = W(x), ZB(x), ZR(x), ZF(x)
    s = smooth((zr - zb - 0.045) / 0.10)                # 0 = hood/deck, 1 = cabin
    crown = zr - zb
    bulge = 0.026 * smooth((x - 1.05) / 0.3) * smooth((2.3 - x) / 0.25)   # the hood's centre dome
    fc = 0.034 * math.exp(-((x - 1.55) / 0.50) ** 2) + 0.052 * math.exp(-((x + 1.30) / 0.60) ** 2)   # fenders crown over the wheels
    pts = [(0.0, zf), (w * 0.84, zf), (w * 0.965, zf + 0.035), (w * 0.99, zf + 0.14),
           (w - SCALLOP(x), zf + 0.30), (w, lerp(zf + 0.30, zb, 0.60)), (w * 0.992, zb - 0.10 + fc * 0.5), (w * 0.94, zb - 0.012 + fc)]
    hood = [(w * 0.80, zb + crown * 0.45 + fc * 0.55), (w * 0.62, zb + crown * 0.75), (w * 0.42, zb + crown * 0.92 + bulge * 0.4),
            (w * 0.22, zr + bulge)]
    wg, wr = w - INSET(x), WR(x)
    y8, z8, y10, z10 = wg, zb + 0.012, wr, zr - 0.045
    cabin = [(y8, z8), (lerp(y8, y10, 0.5) + 0.025, lerp(z8, z10, 0.52)), (y10, z10), (wr * 0.55, zr - 0.006)]
    for h, c in zip(hood, cabin):
        pts.append((lerp(h[0], c[0], s), lerp(h[1], c[1], s)))
    pts.append((0.0, zr + bulge))
    return pts

def shear(x, z):
    """Shark nose and ducktail: lean the ends."""
    if x > 2.2: return x + 0.20 * (z - 0.47) * (x - 2.2) / 0.205
    if x < -2.2: return x - 0.10 * (z - 0.70) * (-2.2 - x) / 0.205
    return x

# ------------------------------------------------------------------ body
bm = bmesh.new()
rings = []          # per station: list of ring verts, and their (side, j)
for x in XS:
    pts = section(x)
    ring = [bm.verts.new((shear(x, pts[0][1]), 0, pts[0][1]))]
    idx = [0]
    for j in range(1, NP - 1):
        ring.append(bm.verts.new((shear(x, pts[j][1]), pts[j][0], pts[j][1]))); idx.append(j)
    ring.append(bm.verts.new((shear(x, pts[-1][1]), 0, pts[-1][1]))); idx.append(NP - 1)
    for j in range(NP - 2, 0, -1):
        ring.append(bm.verts.new((shear(x, pts[j][1]), -pts[j][0], pts[j][1]))); idx.append(j)
    rings.append((ring, idx, pts))

def seg_material(xm, j):
    if j <= 1: return 2                                             # Trim: floor and rocker
    if j in (10, 11) and (0.2 < xm < 0.75 or -1.78 < xm < -0.6): return 1   # windshield, rear window
    if j in (8, 9) and -1.1 < xm < 0.2: return 1                    # side glass
    if j == 8 and 0.2 < xm < 0.62: return 1                         # the side glass's front corner
    return 0

nring = len(rings[0][0])
for i in range(len(XS) - 1):
    (ra, ia, _), (rb, _, _) = rings[i], rings[i + 1]
    xm = (XS[i] + XS[i + 1]) / 2
    for k in range(nring):
        k2 = (k + 1) % nring
        j = min(ia[k], ia[k2])
        f = bm.faces.new((ra[k], ra[k2], rb[k2], rb[k]))
        f.material_index = seg_material(xm, j)

def cap(station, flip):
    ring, idx, pts = rings[station]
    x = XS[station]
    right = {idx[k]: ring[k] for k in range(0, NP)}                  # j -> vert (y >= 0)
    left = {idx[k]: ring[k] for k in range(NP - 1, nring)}
    left[0], left[NP - 1] = ring[0], ring[NP - 1]
    rows = []
    for j in range(1, NP - 1):
        y, z = pts[j]
        if j == 1: mid = ring[0]
        elif j == NP - 2: mid = ring[NP - 1]
        else: mid = bm.verts.new((shear(x, z), 0, z))
        a = bm.verts.new((shear(x, z), y * 0.5, z)); b = bm.verts.new((shear(x, z), -y * 0.5, z))
        rows.append([left[j], b, mid, a, right[j]])
    for r0, r1 in zip(rows, rows[1:]):
        for c in range(4):
            vs = (r0[c], r0[c + 1], r1[c + 1], r1[c])
            f = bm.faces.new(vs if not flip else vs[::-1])
            f.material_index = 0
cap(0, False); cap(len(XS) - 1, True)

bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
crease = bm.edges.layers.float.get("crease_edge") or bm.edges.layers.float.new("crease_edge")
end_x = (min(v.co.x for v in bm.verts), max(v.co.x for v in bm.verts))
for e in bm.edges:
    mats = {f.material_index for f in e.link_faces}
    if len(mats) > 1 and 1 in mats: e[crease] = 0.8                # around the glass
    elif len(mats) > 1: e[crease] = 0.35                            # paint / lower trim
jof = {}
for ring, idx, _ in rings:
    for v, j in zip(ring, idx): jof[v] = j
for e in bm.edges:                                                  # the shoulder and the belt are real creases
    a, b2 = e.verts
    if a in jof and b2 in jof and jof[a] == jof[b2] and jof[a] in (6, 7) and abs(a.co.x) < 2.2 and abs(b2.co.x) < 2.2:
        e[crease] = max(e[crease], 0.92 if jof[a] == 7 else 0.65)
for station in (0, len(XS) - 1):                                    # hold the fascias' outline
    ring = rings[station][0]
    for k in range(nring):
        e = bm.edges.get((ring[k], ring[(k + 1) % nring]))
        if e: e[crease] = 0.75
body = obj_from_bm("Body", bm, ["Paint", "Glass", "Trim"])
sub = body.modifiers.new("Subsurf", "SUBSURF"); sub.levels = 3; sub.render_levels = 3
bake(body)

# wheel arches: cut through the sides, with a dark liner behind each
def cylinder_y(name, x, z, r, y0, y1, seg=64, mats=("Trim",)):
    b = bmesh.new()
    bmesh.ops.create_cone(b, cap_ends=True, segments=seg, radius1=r, radius2=r, depth=abs(y1 - y0),
                          matrix=Matrix.Translation((x, (y0 + y1) / 2, z)) @ Matrix.Rotation(math.pi / 2, 4, "X"))
    return obj_from_bm(name, b, list(mats))

ARCH_R = 0.376
cutters = []
for ax in (AX_F, AX_R):
    for side in (1, -1):
        cutters.append(cylinder_y("cut", ax, WHEEL_R + 0.005, ARCH_R, side * 0.55, side * 1.3))
for c in cutters:
    m = body.modifiers.new("arch", "BOOLEAN"); m.operation = "DIFFERENCE"; m.object = c; m.solver = "EXACT"
bake(body)
for c in cutters: bpy.data.objects.remove(c)
for p in body.data.polygons: p.use_smooth = True
body.data.set_sharp_from_angle(angle=math.radians(38))

lb = bmesh.new()
for ax in (AX_F, AX_R):
    for side in (1, -1):
        r, n, y0, y1 = ARCH_R + 0.012, 32, side * 0.50, side * (W(ax) - 0.03)
        ring0, ring1 = [], []
        for t in range(n + 1):
            a = math.radians(-14 + 208 * t / n)
            ring0.append(lb.verts.new((ax + r * math.cos(a), y0, WHEEL_R + r * math.sin(a))))
            ring1.append(lb.verts.new((ax + r * math.cos(a), y1, WHEEL_R + r * math.sin(a))))
        for t in range(n):
            lb.faces.new((ring0[t], ring0[t + 1], ring1[t + 1], ring1[t]))
        c0 = lb.verts.new((ax, y0, WHEEL_R))
        for t in range(n):
            lb.faces.new((c0, ring0[t + 1], ring0[t]))
obj_from_bm("WheelWells", lb, ["Trim"])

# ----------------------------------------------------------------- wheels
def lathe(b, profile, steps=56, angle=math.tau):
    vs = [b.verts.new((r, y, 0)) for r, y in profile]
    es = [b.edges.new((vs[i], vs[i + 1])) for i in range(len(vs) - 1)]
    bmesh.ops.spin(b, geom=vs + es, cent=(0, 0, 0), axis=(0, 1, 0), angle=angle, steps=steps, use_duplicate=False)
    bmesh.ops.remove_doubles(b, verts=b.verts, dist=1e-5)

def build_wheel():
    b = bmesh.new()
    lathe(b, [(0.262, -0.128), (0.310, -0.137), (0.336, -0.124), (0.345, -0.085), (0.345, 0.085),
              (0.336, 0.124), (0.310, 0.137), (0.262, 0.128)])
    tire = set(b.faces)
    lathe(b, [(0.262, 0.128), (0.272, 0.132), (0.270, 0.112), (0.252, 0.102), (0.240, 0.0), (0.249, -0.120), (0.262, -0.128)])
    lathe(b, [(0.0, 0.094), (0.050, 0.094), (0.060, 0.080), (0.062, 0.02)], steps=24)      # hub
    for k in range(5):                                                                    # ten thin spokes, five Y pairs (after the S650's wheels)
        for tw in (-0.11, 0.11):
            rot = Matrix.Rotation(k * math.tau / 5 + tw, 4, "Y")
            geom = bmesh.ops.create_cube(b, size=1.0)["verts"]
            bmesh.ops.scale(b, vec=(0.222, 0.030, 0.022), verts=geom)
            bmesh.ops.translate(b, vec=(0.156, 0.090, 0), verts=geom)
            bmesh.ops.rotate(b, cent=(0, 0, 0), matrix=rot, verts=geom)
    rim = set(b.faces) - tire
    lathe(b, [(0.0, 0.040), (0.214, 0.040), (0.214, 0.018), (0.0, 0.018)], steps=40)       # brake disc
    for f in b.faces:
        f.material_index = 0 if f in tire else 1 if f in rim else 2
    bmesh.ops.recalc_face_normals(b, faces=b.faces)
    me = bpy.data.meshes.new("Wheel")
    b.to_mesh(me); b.free()
    for m in ("Tire", "Rim", "Disc"): me.materials.append(MAT[m])
    for p in me.polygons: p.use_smooth = True
    me.set_sharp_from_angle(angle=math.radians(40))
    return me

wheel_mesh = build_wheel()
cb = bmesh.new()                                                     # caliper: an arc hugging the disc
lathe(cb, [(0.165, 0.010), (0.232, 0.010), (0.232, 0.066), (0.165, 0.066), (0.165, 0.010)], steps=10, angle=math.radians(62))
bmesh.ops.holes_fill(cb, edges=cb.edges[:])
bmesh.ops.rotate(cb, cent=(0, 0, 0), matrix=Matrix.Rotation(math.radians(-118), 4, "Y"), verts=cb.verts)
bmesh.ops.recalc_face_normals(cb, faces=cb.faces)
cal_tmp = obj_from_bm("cal", cb, ["Caliper"], smooth_shade=False); cal_mesh = cal_tmp.data
bpy.data.objects.remove(cal_tmp)
for name, ax, side in (("Wheel_FL", AX_F, 1), ("Wheel_FR", AX_F, -1), ("Wheel_RL", AX_R, 1), ("Wheel_RR", AX_R, -1)):
    o = bpy.data.objects.new(name, wheel_mesh); col.objects.link(o)
    o.location = (ax, side * WHEEL_Y, WHEEL_R)
    if side < 0: o.rotation_euler = (0, 0, math.pi)
    c = bpy.data.objects.new(name.replace("Wheel", "Caliper"), cal_mesh); col.objects.link(c)
    c.location = o.location
    if side < 0: c.rotation_euler = (0, 0, math.pi)

# ----------------------------------------------------------------- decals
def project(o, where, offset, thickness=0.0):
    m = o.modifiers.new("wrap", "SHRINKWRAP")
    m.target = body; m.wrap_method = "PROJECT"; m.offset = offset
    m.use_project_x = where in ("front", "rear")
    m.use_project_y = where in ("left", "right")
    m.use_project_z = where == "top"
    neg = where in ("front", "left", "top")
    m.use_negative_direction = neg; m.use_positive_direction = not neg
    bake(o)
    out = {"front": Vector((1, 0, 0)), "rear": Vector((-1, 0, 0)), "left": Vector((0, 1, 0)),
           "right": Vector((0, -1, 0)), "top": Vector((0, 0, 1))}[where]
    b = bmesh.new(); b.from_mesh(o.data)
    bmesh.ops.recalc_face_normals(b, faces=b.faces)
    if sum(f.normal.dot(out) for f in b.faces) < 0: bmesh.ops.reverse_faces(b, faces=b.faces)
    b.to_mesh(o.data); b.free()
    if thickness:
        sm = o.modifiers.new("solid", "SOLIDIFY"); sm.thickness = thickness; sm.offset = 1
        bake(o)
    for p in o.data.polygons: p.use_smooth = True
    return o

def place(where, u, v):
    return {"front": (3.2, u, v), "rear": (-3.2, u, v), "left": (u, 2.0, v), "right": (u, -2.0, v), "top": (u, v, 3.0)}[where]

def decal(name, quad, where, mat, offset=0.004, nu=10, nv=6, thickness=0.0):
    """Four (u, v) corners, as a grid, projected onto the body from one side and
    sitting `offset` proud of it. front/rear: (y, z); left/right: (x, z); top: (x, y)."""
    b = bmesh.new()
    (a, bb, c, d) = quad
    grid = [[b.verts.new(place(where, lerp(lerp(a[0], bb[0], i / nu), lerp(d[0], c[0], i / nu), k / nv),
                                      lerp(lerp(a[1], bb[1], i / nu), lerp(d[1], c[1], i / nu), k / nv)))
             for i in range(nu + 1)] for k in range(nv + 1)]
    for k in range(nv):
        for i in range(nu):
            b.faces.new((grid[k][i], grid[k][i + 1], grid[k + 1][i + 1], grid[k + 1][i]))
    return project(obj_from_bm(name, b, [mat]), where, offset, thickness)

def mirror(q): return [(-u, v) for u, v in q][::-1]
def both(name, quad, where, mat, **kw):
    decal(name + "_L", quad, where, mat, **kw); decal(name + "_R", mirror(quad), where, mat, **kw)

# front: grille with mesh bars, lower intake, side intakes, swept headlights with three slanted LEDs each
def decal_poly(name, pts, where, mat, offset=0.004, rings=8, steps=4):
    """A convex outline (u, v) filled as rings shrinking to its centre, projected like decal()."""
    b = bmesh.new()
    cu = sum(p[0] for p in pts) / len(pts); cv = sum(p[1] for p in pts) / len(pts)
    edge = []
    for i in range(len(pts)):                                                # each side split for curvature
        (u0, v0), (u1, v1) = pts[i], pts[(i + 1) % len(pts)]
        edge += [(lerp(u0, u1, t / steps), lerp(v0, v1, t / steps)) for t in range(steps)]
    rows = [[b.verts.new(place(where, lerp(u, cu, k / rings), lerp(v, cv, k / rings))) for (u, v) in edge] for k in range(rings)]
    centre = b.verts.new(place(where, cu, cv))
    for k in range(rings - 1):
        for i in range(len(edge)):
            j = (i + 1) % len(edge)
            b.faces.new((rows[k][i], rows[k][j], rows[k + 1][j], rows[k + 1][i]))
    for i in range(len(edge)):
        b.faces.new((rows[-1][i], rows[-1][(i + 1) % len(edge)], centre))
    return project(obj_from_bm(name, b, [mat]), where, offset)

decal_poly("Grille", [(-0.42, 0.635), (0.42, 0.635), (0.56, 0.545), (0.47, 0.415), (-0.47, 0.415), (-0.56, 0.545)], "front", "Grille")
decal("Intake_Low", [(-0.66, 0.235), (0.66, 0.235), (0.56, 0.355), (-0.56, 0.355)], "front", "Trim", nu=24)
decal("Intake_Slot", [(-0.60, 0.372), (0.60, 0.372), (0.59, 0.384), (-0.59, 0.384)], "front", "Mesh", offset=0.006, nu=24, nv=1)
both("Intake_Side", [(0.62, 0.340), (0.76, 0.370), (0.76, 0.500), (0.64, 0.480)], "front", "Trim")
def zl(y): return 0.575 + 0.10 * (y - 0.45)                                  # the headlight sweeps up toward the fender
both("Headlight", [(0.45, zl(0.45) - 0.008), (0.80, zl(0.80) - 0.004), (0.80, zl(0.80) + 0.052), (0.47, zl(0.47) + 0.046)],
     "front", "Trim", offset=0.003, nu=16)
for n, y0 in enumerate((0.52, 0.61, 0.70)):
    both(f"LED_F_{n}", [(y0, zl(y0)), (y0 + 0.052, zl(y0 + 0.052)), (y0 + 0.064, zl(y0 + 0.064) + 0.040), (y0 + 0.020, zl(y0 + 0.020) + 0.040)],
         "front", "LightWhite", offset=0.007, nu=4, nv=4)
both("LED_Low", [(0.50, 0.300), (0.64, 0.318), (0.64, 0.328), (0.50, 0.310)], "front", "LightWhite", offset=0.007, nu=8, nv=1)
# rear: black tail panel, three slanted bars a side, diffuser
decal("Tail_Panel", [(-0.74, 0.835), (0.74, 0.835), (0.76, 0.992), (-0.76, 0.992)], "rear", "Trim", nu=22)
decal("Diffuser", [(-0.62, 0.36), (0.62, 0.36), (0.68, 0.52), (-0.68, 0.52)], "rear", "Trim", nu=20)
ZT, ZM, ZBOT, TIP, BW = 0.975, 0.9165, 0.858, 0.040, 0.034                 # three chevrons a side, pointing outward
for n, y0 in enumerate((0.33, 0.445, 0.56)):
    both(f"LED_R_{n}a", [(y0, ZBOT), (y0 + BW, ZBOT), (y0 + TIP + BW, ZM), (y0 + TIP, ZM)], "rear", "LightRed", offset=0.008, nu=3, nv=4)
    both(f"LED_R_{n}b", [(y0 + TIP, ZM), (y0 + TIP + BW, ZM), (y0 + BW, ZT), (y0, ZT)], "rear", "LightRed", offset=0.008, nu=3, nv=4)
# hood: two vents; panel gaps for the hood, doors and boot lid
GAP = dict(mat="Trim", offset=0.0015)
for sgn in (1, -1):
    decal(f"HoodVent_{sgn}", [(1.12, sgn * 0.19), (1.56, sgn * 0.15), (1.54, sgn * 0.30), (1.16, sgn * 0.33)][::sgn], "top", "Trim", nu=10)
    decal(f"Gap_Hood_{sgn}", [(0.80, sgn * 0.74), (2.33, sgn * 0.60), (2.33, sgn * 0.607), (0.80, sgn * 0.747)][::sgn], "top", nu=28, nv=1, **GAP)
    decal(f"Dome_{sgn}", [(1.10, sgn * 0.375), (2.30, sgn * 0.335), (2.30, sgn * 0.341), (1.10, sgn * 0.381)][::sgn], "top", nu=28, nv=1, **GAP)
    decal(f"Gap_Boot_{sgn}", [(-2.33, sgn * 0.60), (-1.84, sgn * 0.60), (-1.84, sgn * 0.607), (-2.33, sgn * 0.607)][::sgn], "top", nu=12, nv=1, **GAP)
    side = "left" if sgn > 0 else "right"
    for n, x in enumerate((0.72, -0.46)):
        q = [(x, 0.30), (x + 0.007, 0.30), (x + 0.007, 0.945), (x, 0.945)]
        decal(f"Gap_Door_{sgn}_{n}", q if sgn > 0 else q[::-1], side, nu=1, nv=24, **GAP)
    q = [(-0.46, 0.30), (0.72, 0.30), (0.72, 0.307), (-0.46, 0.307)]
    decal(f"Gap_Sill_{sgn}", q if sgn > 0 else q[::-1], side, nu=24, nv=1, **GAP)
decal("Gap_Cowl", [(0.785, -0.735), (0.792, -0.735), (0.792, 0.735), (0.785, 0.735)], "top", nu=1, nv=28, **GAP)
decal("Gap_Boot", [(-1.84, -0.607), (-1.833, -0.607), (-1.833, 0.607), (-1.84, 0.607)], "top", nu=1, nv=24, **GAP)

# the character line along each side, from the headlight back through the doors to the tail
for sgn in (1, -1):
    side = "left" if sgn > 0 else "right"
    q = [(-2.10, 0.77), (2.00, 0.80), (2.00, 0.807), (-2.10, 0.777)]
    decal(f"Line_{sgn}", q if sgn > 0 else q[::-1], side, nu=40, nv=1, **GAP)

for sgn in (1, -1):                                                    # flush door handles
    side = "left" if sgn > 0 else "right"
    q = [(0.02, 0.875), (0.20, 0.875), (0.20, 0.895), (0.02, 0.895)]
    decal(f"Handle_{sgn}", q if sgn > 0 else q[::-1], side, "Trim", offset=0.004, nu=6, nv=1)

# wheel-arch lips: a ring wrapped onto the body around each arch, with a little thickness
for ax in (AX_F, AX_R):
    for sgn in (1, -1):
        b = bmesh.new(); n = 48; r0, r1 = ARCH_R - 0.004, ARCH_R + 0.05
        rows = []
        for t in range(n + 1):
            a = math.radians(-6 + 192 * t / n)
            rows.append([b.verts.new((ax + r * math.cos(a), sgn * 2.0, WHEEL_R + 0.005 + r * math.sin(a))) for r in (r0, (r0 + r1) / 2, r1)])
        for t in range(n):
            for k in range(2):
                b.faces.new((rows[t][k], rows[t + 1][k], rows[t + 1][k + 1], rows[t][k + 1]))
        project(obj_from_bm(f"ArchLip_{ax > 0}_{sgn}", b, ["Paint"]), "left" if sgn > 0 else "right", 0.002, thickness=0.012)

# front splitter and rear wing
sp = bmesh.new()
bmesh.ops.create_cube(sp, size=1.0)
bmesh.ops.scale(sp, vec=(0.17, 1.52, 0.014), verts=sp.verts)
bmesh.ops.translate(sp, vec=(2.33, 0, 0.215), verts=sp.verts)
for f in sp.faces: f.smooth = False
obj_from_bm("Splitter", sp, ["Trim"], smooth_shade=False)
wg = bmesh.new()
blade = bmesh.ops.create_cube(wg, size=1.0)["verts"]
bmesh.ops.scale(wg, vec=(0.17, 1.30, 0.020), verts=blade)
bmesh.ops.translate(wg, vec=(-2.27, 0, 1.175), verts=blade)
for y in (-0.46, 0.46):
    st = bmesh.ops.create_cube(wg, size=1.0)["verts"]
    bmesh.ops.scale(wg, vec=(0.07, 0.035, 0.09), verts=st)
    bmesh.ops.translate(wg, vec=(-2.22, y, 1.12), verts=st)
for y in (-0.65, 0.65):
    ep = bmesh.ops.create_cube(wg, size=1.0)["verts"]
    bmesh.ops.scale(wg, vec=(0.17, 0.016, 0.07), verts=ep)
    bmesh.ops.translate(wg, vec=(-2.27, y, 1.17), verts=ep)
obj_from_bm("Wing", wg, ["Trim"], smooth_shade=False)

# --------------------------------------------------------------- interior
# An inner shell (the cabin's walls and headliner, open where the glass is), a
# floor, dashboard with a wide display, steering wheel, console and seats.
ib = bmesh.new()
cabin_x = [x for x in XS if -1.95 <= x <= 1.2]
irings = []
for x in cabin_x:
    pts = section(x)
    ring = []
    for j in range(3, NP):                                           # from the sill up to the roof centre
        y, z = pts[j]
        ring.append((y * 0.955, 0.72 + (z - 0.72) * 0.955))
    irings.append(ring)
for i in range(len(cabin_x) - 1):
    xm = (cabin_x[i] + cabin_x[i + 1]) / 2
    for k in range(len(irings[i]) - 1):
        if seg_material(xm, k + 3) == 1: continue                    # leave the windows open
        for sgn in (1, -1):
            q = [(cabin_x[i], sgn * irings[i][k][0], irings[i][k][1]), (cabin_x[i], sgn * irings[i][k + 1][0], irings[i][k + 1][1]),
                 (cabin_x[i + 1], sgn * irings[i + 1][k + 1][0], irings[i + 1][k + 1][1]), (cabin_x[i + 1], sgn * irings[i + 1][k][0], irings[i + 1][k][1])]
            vs = [ib.verts.new(c) for c in q]
            ib.faces.new(vs if sgn < 0 else vs[::-1])
bmesh.ops.remove_doubles(ib, verts=ib.verts, dist=1e-4)
def box(b, size, at, bevel=0.0, rot=None):
    """Adds a box to bmesh `b`: sized, optionally bevelled and rotated about its centre, then moved to `at`."""
    t = bmesh.new()
    bmesh.ops.create_cube(t, size=1.0)
    bmesh.ops.scale(t, vec=size, verts=t.verts)
    if bevel: bmesh.ops.bevel(t, geom=t.edges[:], offset=bevel, segments=3, affect="EDGES")
    if rot is not None: bmesh.ops.rotate(t, cent=(0, 0, 0), matrix=rot, verts=t.verts)
    bmesh.ops.translate(t, vec=at, verts=t.verts)
    me = bpy.data.meshes.new("tmp"); t.to_mesh(me); t.free()
    b.from_mesh(me); bpy.data.meshes.remove(me)
box(ib, (2.9, 1.70, 0.02), (-0.40, 0, 0.30))                           # floor
box(ib, (0.02, 1.60, 0.62), (-1.62, 0, 0.62))                          # rear bulkhead
box(ib, (0.02, 1.70, 0.50), (1.02, 0, 0.56))                           # firewall
box(ib, (0.40, 1.62, 0.20), (0.78, 0, 0.865), bevel=0.04)              # dashboard
box(ib, (0.26, 1.46, 0.05), (0.74, 0, 0.945), bevel=0.02)              # dash top
box(ib, (1.25, 0.22, 0.26), (0.05, 0, 0.44), bevel=0.03)               # centre console
for sgn in (1, -1):                                                    # front seats
    box(ib, (0.52, 0.50, 0.16), (-0.12, sgn * 0.40, 0.45), bevel=0.05)
    box(ib, (0.15, 0.50, 0.62), (-0.44, sgn * 0.40, 0.80), bevel=0.05, rot=Matrix.Rotation(math.radians(-14), 4, "Y"))
    box(ib, (0.10, 0.26, 0.17), (-0.545, sgn * 0.40, 1.165), bevel=0.04, rot=Matrix.Rotation(math.radians(-10), 4, "Y"))
box(ib, (0.48, 1.30, 0.16), (-1.18, 0, 0.47), bevel=0.05)              # rear bench
box(ib, (0.14, 1.30, 0.50), (-1.46, 0, 0.76), bevel=0.05, rot=Matrix.Rotation(math.radians(-18), 4, "Y"))
obj_from_bm("Interior", ib, ["Interior"]).data.set_sharp_from_angle(angle=math.radians(40))

sb = bmesh.new()                                                       # the wide display, in front of the driver
n = 16
row0, row1 = [], []
for i in range(n + 1):
    y = lerp(0.66, -0.10, i / n)
    x = 0.615 + 0.05 * ((y - 0.28) / 0.38) ** 2                        # curved towards the driver
    row0.append(sb.verts.new((x + 0.012, y, 0.925))); row1.append(sb.verts.new((x - 0.012, y, 1.045)))
for i in range(n):
    sb.faces.new((row0[i], row0[i + 1], row1[i + 1], row1[i]))
uv = sb.loops.layers.uv.new("UVMap")
for f in sb.faces:
    for l in f.loops:
        l[uv].uv = ((0.66 - l.vert.co.y) / 0.76, (l.vert.co.z - 0.925) / 0.12)
obj_from_bm("Screen", sb, ["Screen"], smooth_shade=True)

wb = bmesh.new()                                                       # steering wheel
lathe(wb, [(0.175 + 0.017 * math.cos(a), 0.017 * math.sin(a)) for a in [k * math.tau / 10 for k in range(11)]], steps=40)
box(wb, (0.11, 0.05, 0.08), (0, 0.01, 0))
for a in (0, math.radians(115), math.radians(-115)):
    box(wb, (0.03, 0.02, 0.17), (0, 0, 0.09), rot=Matrix.Rotation(a, 4, "Y") @ Matrix.Rotation(math.pi, 4, "Y"))
bmesh.ops.rotate(wb, cent=(0, 0, 0), matrix=Matrix.Rotation(math.radians(90), 4, "Z") @ Matrix.Rotation(math.radians(-22), 4, "X"), verts=wb.verts)
bmesh.ops.translate(wb, vec=(0.47, 0.40, 0.94), verts=wb.verts)
obj_from_bm("SteeringWheel", wb, ["Interior"]).data.set_sharp_from_angle(angle=math.radians(40))

# exhaust tips and mirrors
for y in (-0.60, -0.47, 0.47, 0.60):
    b = bmesh.new()
    bmesh.ops.create_cone(b, cap_ends=False, segments=24, radius1=0.047, radius2=0.047, depth=0.16,
                          matrix=Matrix.Translation((-2.36, y, 0.335)) @ Matrix.Rotation(math.pi / 2, 4, "Y"))
    obj_from_bm("Exhaust", b, ["Chrome"])
for sgn in (1, -1):
    b = bmesh.new()
    bmesh.ops.create_uvsphere(b, u_segments=20, v_segments=12, radius=1.0)
    bmesh.ops.scale(b, vec=(0.085, 0.105, 0.062), verts=b.verts)
    for v in b.verts:                                     # flatten the glass side, taper the nose
        if v.co.x < -0.02: v.co.x = -0.02 + (v.co.x + 0.02) * 0.25
    y = W(0.62) - 0.085 + 0.115
    bmesh.ops.translate(b, vec=(0.62, sgn * y, ZB(0.62) + 0.085), verts=b.verts)
    stalk = bmesh.ops.create_cube(b, size=1.0)["verts"]
    bmesh.ops.scale(b, vec=(0.06, 0.10, 0.022), verts=stalk)
    bmesh.ops.translate(b, vec=(0.62, sgn * (y - 0.085), ZB(0.62) + 0.045), verts=stalk)
    obj_from_bm(f"Mirror_{sgn}", b, ["Paint"])

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "mustang.blend"))

# ---------------------------------------------------------------- preview
if PREVIEW:
    world = bpy.data.worlds.new("W"); scene.world = world; world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.004, 0.007, 0.012, 1)
    g = bmesh.new(); bmesh.ops.create_grid(g, x_segments=1, y_segments=1, size=30)
    ground = obj_from_bm("Ground", g, ["Trim"], smooth_shade=False)
    gm = material("Floor", (0.010, 0.014, 0.022), rough=0.18); ground.data.materials.clear(); ground.data.materials.append(gm)
    def strip(loc, tgt, sx, sy, power, color=(1, 1, 1)):
        d = bpy.data.lights.new("L", "AREA"); d.shape = "RECTANGLE"; d.size = sx; d.size_y = sy; d.energy = power; d.color = color
        o = bpy.data.objects.new("L", d); o.location = loc; col.objects.link(o)
        o.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    strip((0.3, 0, 3.6), (0.3, 0, 0), 7.5, 1.1, 900, (0.80, 0.90, 1.0))
    strip((1.0, -4.6, 2.0), (0.3, 0, 0.7), 6.5, 0.5, 520)
    strip((1.0, 4.6, 2.0), (0.3, 0, 0.7), 6.5, 0.5, 520, (0.7, 0.82, 1.0))
    strip((6.0, 0, 1.6), (0, 0, 0.7), 0.5, 3.5, 260)
    strip((-6.0, 0, 1.8), (0, 0, 0.7), 0.5, 3.5, 260, (0.6, 0.75, 1.0))
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam")); col.objects.link(cam); scene.camera = cam
    cam.data.lens = 55
    for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT", "CYCLES"):
        try: scene.render.engine = eng; break
        except TypeError: continue
    scene.render.resolution_x, scene.render.resolution_y = 1600, 900
    views = {"hero": ((5.2, -3.9, 0.80), (1.0, 0.0, 0.66)), "front34": ((5.6, -4.4, 1.35), (0.25, 0, 0.60)), "rear34": ((-5.8, -4.0, 1.5), (-0.2, 0, 0.62)),
             "side": ((0, -8.2, 0.95), (0, 0, 0.66)), "front": ((8.0, 0.0, 0.85), (0, 0, 0.62)),
             "interior": ((-0.78, 0.0, 1.10), (0.7, 0.10, 0.93)), "top34": ((3.6, -3.0, 4.6), (0.2, 0, 0.5))}
    for name, (loc, tgt) in views.items():
        cam.location = loc
        cam.data.lens = 20 if name == "interior" else 45 if name == "hero" else 55
        cam.data.clip_start = 0.05
        cam.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        scene.render.filepath = os.path.join(OUT, f"preview_{name}.png")
        bpy.ops.render.render(write_still=True)

if GLB:
    for o in list(col.objects):
        if o.name in ("Ground", "Cam") or o.type == "LIGHT": bpy.data.objects.remove(o)
    bpy.ops.export_scene.gltf(filepath=GLB, export_format="GLB", export_apply=True, export_yup=True)
print("TRIS", sum(len(p.vertices) - 2 for o in col.objects if o.type == "MESH" for p in o.data.polygons))
