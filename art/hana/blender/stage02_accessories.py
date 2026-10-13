"""
CHECKPOINT 3 — STAGE 2: ACCESSORIES & RIGGING
=============================================
1. Loads art/hana/blender/_source/hana-sensei-master.blend
2. Cleans up any existing accessory objects for clean rebuild
3. Builds Canonical Academic Mortarboard Cap (#2D1B4E plum navy, #D4A843 gold tassel, button)
4. Builds Canonical 38cm Teaching Wand (Gold shaft from source, #D4A843 ring, #F8C8D4 sakura, #FFB7C5 glow)
5. Builds Rear Butterfly Musubi Bow for Obi (#2D1B4E plum navy, #D4A843 gold trim)
6. Configures Socket_Cap and Socket_Wand_R bones on Armature
7. Sets up alias shape keys for 11 emotions, 3 blinks, and 5 Japanese visemes
"""

import bpy
import bmesh
import math
import os
import sys
from mathutils import Vector, Euler, Matrix

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
MASTER_BLEND = os.path.join(ROOT, "art", "hana", "blender", "_source", "hana-sensei-master.blend")
WAND_BLEND = os.path.join(ROOT, "_source", "Staff - Harry Potter.blend")

def hex_to_linear(hex_str, alpha=1.0):
    """Converts sRGB hex string to Blender scene linear RGB."""
    hex_str = hex_str.lstrip('#')
    r = int(hex_str[0:2], 16) / 255.0
    g = int(hex_str[2:4], 16) / 255.0
    b = int(hex_str[4:6], 16) / 255.0
    def srgb_to_lin(c):
        return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92
    return (srgb_to_lin(r), srgb_to_lin(g), srgb_to_lin(b), alpha)

def get_or_create_material(name, hex_color, metallic=0.0, roughness=0.5, emission_hex=None, emission_strength=1.0):
    mat = bpy.data.materials.get(name)
    if not mat:
        mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if not bsdf:
        for n in nodes:
            if n.type == 'BSDF_PRINCIPLED':
                bsdf = n
                break
    if bsdf:
        bsdf.inputs['Base Color'].default_value = hex_to_linear(hex_color)
        bsdf.inputs['Metallic'].default_value = metallic
        bsdf.inputs['Roughness'].default_value = roughness
        if emission_hex:
            em_col = hex_to_linear(emission_hex)
            if 'Emission Color' in bsdf.inputs:
                bsdf.inputs['Emission Color'].default_value = em_col
                bsdf.inputs['Emission Strength'].default_value = emission_strength
            elif 'Emission' in bsdf.inputs:
                bsdf.inputs['Emission'].default_value = em_col
                if 'Emission Strength' in bsdf.inputs:
                    bsdf.inputs['Emission Strength'].default_value = emission_strength
        else:
            if 'Emission Strength' in bsdf.inputs:
                bsdf.inputs['Emission Strength'].default_value = 0.0
    return mat

def create_cylinder_geometry(bm, p1, p2, radius, segments=8, mat_idx=0):
    """Creates a 3D tube/cylinder between two points in bmesh."""
    v_dir = p2 - p1
    length = v_dir.length
    if length < 1e-6:
        return []
    v_dir.normalize()
    up = Vector((0, 0, 1)) if abs(v_dir.z) < 0.9 else Vector((1, 0, 0))
    side = v_dir.cross(up).normalized()
    perp = side.cross(v_dir).normalized()

    ring1 = []
    ring2 = []
    for i in range(segments):
        ang = 2 * math.pi * i / segments
        offset = (side * math.cos(ang) + perp * math.sin(ang)) * radius
        ring1.append(bm.verts.new(p1 + offset))
        ring2.append(bm.verts.new(p2 + offset))

    faces = []
    for i in range(segments):
        i_next = (i + 1) % segments
        f = bm.faces.new((ring1[i], ring2[i], ring2[i_next], ring1[i_next]))
        f.material_index = mat_idx
        faces.append(f)
    f1 = bm.faces.new(list(reversed(ring1)))
    f1.material_index = mat_idx
    f2 = bm.faces.new(ring2)
    f2.material_index = mat_idx
    faces.extend([f1, f2])
    return faces

def build_accessories_and_rig():
    print("=" * 70)
    print("STAGE 2: ACCESSORIES, SOCKET RIGGING & FACIAL ALIASES (REBUILD)")
    print("=" * 70)

    bpy.ops.wm.open_mainfile(filepath=MASTER_BLEND)
    armature = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]

    # Remove any existing accessory objects
    for obj_name in ["Hana_Academic_Cap", "Hana_Teaching_Wand", "Hana_Obi_Musubi_Bow", "Hana_Wand_Head"]:
        old_obj = bpy.data.objects.get(obj_name)
        if old_obj:
            bpy.data.objects.remove(old_obj, do_unlink=True)
            print(f"  Removed prior {obj_name}")

    # Materials
    cap_mat = get_or_create_material("Hana_Cap_Navy", "#2D1B4E", metallic=0.05, roughness=0.55)
    gold_mat = get_or_create_material("Hana_Gold", "#D4A843", metallic=0.92, roughness=0.22)
    sakura_mat = get_or_create_material("Hana_Sakura_Pink", "#F8C8D4", metallic=0.0, roughness=0.40)
    glow_mat = get_or_create_material("Hana_Wand_Glow", "#FFB7C5", metallic=0.0, roughness=0.10, emission_hex="#FFB7C5", emission_strength=5.0)
    obi_mat = get_or_create_material("Hana_Obi_Plum", "#2D1B4E", metallic=0.05, roughness=0.65)

    # -------------------------------------------------------------
    # 1. SETUP SOCKET BONES IN ARMATURE
    # -------------------------------------------------------------
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='EDIT')
    eb = armature.data.edit_bones

    head_eb = eb.get("J_Bip_C_Head")
    hand_r_eb = eb.get("J_Bip_R_Hand")

    # Socket_Cap on Head
    b_cap = eb.get("Socket_Cap")
    if not b_cap and head_eb:
        b_cap = eb.new("Socket_Cap")
    if b_cap and head_eb:
        b_cap.parent = head_eb
        # Place socket on the crown of the head at hair top
        b_cap.head = Vector((0.0, 0.018, 1.170))
        b_cap.tail = b_cap.head + Vector((0.0, 0.0, 0.060))
        b_cap.roll = 0
        print("  [Rig] Socket_Cap configured at skull crown (Z=1.170)")

    # Socket_Wand_R on Right Hand
    b_wand = eb.get("Socket_Wand_R")
    if not b_wand and hand_r_eb:
        b_wand = eb.new("Socket_Wand_R")
    if b_wand and hand_r_eb:
        b_wand.parent = hand_r_eb
        # Right palm center
        b_wand.head = Vector((-0.435, 0.012, 0.962))
        b_wand.tail = b_wand.head + Vector((0.0, 0.0, 0.120))
        b_wand.roll = 0
        print("  [Rig] Socket_Wand_R configured at right palm")

    bpy.ops.object.mode_set(mode='OBJECT')

    # -------------------------------------------------------------
    # 2. BUILD CANONICAL ACADEMIC MORTARBOARD CAP
    # -------------------------------------------------------------
    print("\n  Building Academic Cap...")
    bm_cap = bmesh.new()

    # A. Skull cap base (semi-ellipsoid dome that sits on head)
    # Dome top at Z = 0.0, bottom opening at Z = -0.035
    dome_verts = []
    N_U = 16
    N_V = 6
    radius_x = 0.076
    radius_y = 0.082
    dome_h = 0.036

    for j in range(N_V + 1):
        v_ratio = j / N_V
        z = -dome_h * (1.0 - v_ratio)
        r_scale = math.sin(v_ratio * (math.pi / 2))
        ring = []
        for i in range(N_U):
            u_ratio = i / N_U
            ang = 2 * math.pi * u_ratio
            x = radius_x * r_scale * math.cos(ang)
            y = radius_y * r_scale * math.sin(ang)
            ring.append(bm_cap.verts.new((x, y, z)))
        dome_verts.append(ring)

    for j in range(N_V):
        for i in range(N_U):
            i_next = (i + 1) % N_U
            f = bm_cap.faces.new((dome_verts[j][i], dome_verts[j][i_next], dome_verts[j+1][i_next], dome_verts[j+1][i]))
            f.material_index = 0

    # B. Solid Mortarboard Plate (Diamond/Square)
    # Size: 0.19m across diagonals (half = 0.095m)
    # Z goes from 0.0 to 0.006 (6mm thick slab)
    ph = 0.095
    plate_b = 0.000
    plate_t = 0.006

    v_bot = [
        bm_cap.verts.new((0, ph, plate_b)),
        bm_cap.verts.new((ph, 0, plate_b)),
        bm_cap.verts.new((0, -ph, plate_b)),
        bm_cap.verts.new((-ph, 0, plate_b)),
    ]
    v_top = [
        bm_cap.verts.new((0, ph, plate_t)),
        bm_cap.verts.new((ph, 0, plate_t)),
        bm_cap.verts.new((0, -ph, plate_t)),
        bm_cap.verts.new((-ph, 0, plate_t)),
    ]
    f_top = bm_cap.faces.new(v_top)
    f_top.material_index = 0
    f_bot = bm_cap.faces.new(list(reversed(v_bot)))
    f_bot.material_index = 0
    for i in range(4):
        i_next = (i + 1) % 4
        f_side = bm_cap.faces.new((v_bot[i], v_bot[i_next], v_top[i_next], v_top[i]))
        f_side.material_index = 0

    # C. Center Button Pin (Gold)
    btn_r = 0.013
    btn_h = 0.006
    btn_base = plate_t
    N_BTN = 10
    btn_base_verts = []
    btn_mid_verts = []
    for i in range(N_BTN):
        ang = 2 * math.pi * i / N_BTN
        btn_base_verts.append(bm_cap.verts.new((btn_r * math.cos(ang), btn_r * math.sin(ang), btn_base)))
        btn_mid_verts.append(bm_cap.verts.new((btn_r * 0.7 * math.cos(ang), btn_r * 0.7 * math.sin(ang), btn_base + btn_h * 0.7)))
    btn_tip = bm_cap.verts.new((0, 0, btn_base + btn_h))

    for i in range(N_BTN):
        i_next = (i + 1) % N_BTN
        f = bm_cap.faces.new((btn_base_verts[i], btn_base_verts[i_next], btn_mid_verts[i_next], btn_mid_verts[i]))
        f.material_index = 1
        f2 = bm_cap.faces.new((btn_mid_verts[i], btn_mid_verts[i_next], btn_tip))
        f2.material_index = 1

    # D. Gold Silk Tassel (3D Tubing)
    # Tassel cord drapes from center button across right corner and cascades downward toward right shoulder
    p_btn = Vector((0, 0, btn_base + btn_h))
    p_edge = Vector((0.082, 0.0, plate_t))
    p_hang = Vector((0.094, 0.0, plate_t - 0.080))
    p_tip = Vector((0.094, 0.0, plate_t - 0.125))

    create_cylinder_geometry(bm_cap, p_btn, p_edge, radius=0.0022, segments=6, mat_idx=1)
    create_cylinder_geometry(bm_cap, p_edge, p_hang, radius=0.0022, segments=6, mat_idx=1)
    # Tassel fringe bundle at bottom
    create_cylinder_geometry(bm_cap, p_hang, p_tip, radius=0.0065, segments=8, mat_idx=1)

    mesh_cap = bpy.data.meshes.new("Hana_Academic_Cap")
    bm_cap.to_mesh(mesh_cap)
    bm_cap.free()

    obj_cap = bpy.data.objects.new("Hana_Academic_Cap", mesh_cap)
    bpy.context.collection.objects.link(obj_cap)
    obj_cap.data.materials.append(cap_mat)   # Slot 0: #2D1B4E Navy
    obj_cap.data.materials.append(gold_mat)  # Slot 1: #D4A843 Gold

    # Parent to Socket_Cap
    obj_cap.parent = armature
    obj_cap.parent_type = 'BONE'
    obj_cap.parent_bone = "Socket_Cap"
    # -88 deg X makes top plate horizontal; 5 deg Y tilts 5 deg to character right; -5 deg Z provides anime flair
    obj_cap.rotation_euler = (math.radians(-88), math.radians(5), math.radians(-5))
    obj_cap.location = (0.0, 0.0, -0.010)
    obj_cap.scale = (1.0, 1.0, 1.0)
    print("  [Cap] Academic Cap created and parented to Socket_Cap")

    # -------------------------------------------------------------
    # 3. BUILD CANONICAL MAGICAL TEACHING WAND (~38 CM)
    # -------------------------------------------------------------
    print("\n  Building Canonical Teaching Wand...")
    bm_wand = bmesh.new()

    # Load authentic wand shaft from source blend
    with bpy.data.libraries.load(WAND_BLEND, link=False) as (df, dt):
        dt.objects = [o for o in df.objects if o == "Cylinder"]
    source_obj = dt.objects[0]
    source_mesh = source_obj.data

    # Load shaft geometry into bm_wand
    bm_shaft = bmesh.new()
    bm_shaft.from_mesh(source_mesh)
    
    # Scale shaft so its length is 0.31m
    zs = [v.co.z for v in bm_shaft.verts]
    min_z, max_z = min(zs), max(zs)
    raw_h = max_z - min_z
    scale_shaft = 0.31 / raw_h if raw_h > 0 else 0.11

    # Shift so base of handle is at Z = 0
    for v in bm_shaft.verts:
        v.co.z = (v.co.z - min_z) * scale_shaft
        v.co.x *= scale_shaft
        v.co.y *= scale_shaft

    # Copy into bm_wand with mat_idx = 0 (Gold)
    vert_map = {}
    for v in bm_shaft.verts:
        vert_map[v] = bm_wand.verts.new(v.co)
    for f in bm_shaft.faces:
        new_f = bm_wand.faces.new([vert_map[v] for v in f.verts])
        new_f.material_index = 0
    bm_shaft.free()
    bpy.data.meshes.remove(source_mesh)

    # Top Head: Circular Ring + 5-Petal Sakura + Glowing Gem
    # Ring center at Z = 0.345m (top of ring at Z = 0.380m)
    ring_radius = 0.035
    ring_z = 0.345
    tube_r = 0.0035
    N_RING = 24
    N_TUBE = 8

    # Build Ring Torus (Slot 0: Gold)
    ring_rings = []
    for i in range(N_RING):
        phi = 2 * math.pi * i / N_RING
        cx = ring_radius * math.cos(phi)
        cz = ring_z + ring_radius * math.sin(phi)
        c_verts = []
        for j in range(N_TUBE):
            theta = 2 * math.pi * j / N_TUBE
            tr = tube_r * math.cos(theta)
            vy = tube_r * math.sin(theta)
            vx = (ring_radius + tr) * math.cos(phi)
            vz = ring_z + (ring_radius + tr) * math.sin(phi)
            c_verts.append(bm_wand.verts.new((vx, vy, vz)))
        ring_rings.append(c_verts)

    for i in range(N_RING):
        i_next = (i + 1) % N_RING
        for j in range(N_TUBE):
            j_next = (j + 1) % N_TUBE
            rf = bm_wand.faces.new((ring_rings[i][j], ring_rings[i_next][j], ring_rings[i_next][j_next], ring_rings[i][j_next]))
            rf.material_index = 0

    # Connect top of shaft to base of ring
    create_cylinder_geometry(bm_wand, Vector((0, 0, 0.308)), Vector((0, 0, 0.312)), radius=0.006, segments=8, mat_idx=0)

    # Build 5-Petal Sakura Blossom inside ring (Slot 1: Sakura Pink)
    N_PETALS = 5
    petal_r = 0.022
    center_front = bm_wand.verts.new((0, -0.0015, ring_z))
    center_back = bm_wand.verts.new((0, 0.0015, ring_z))

    for p in range(N_PETALS):
        ang_c = 2 * math.pi * p / N_PETALS
        ang_l = ang_c - 0.32
        ang_r = ang_c + 0.32
        tip_x = petal_r * math.cos(ang_c)
        tip_z = ring_z + petal_r * math.sin(ang_c)
        l_x = (petal_r * 0.75) * math.cos(ang_l)
        l_z = ring_z + (petal_r * 0.75) * math.sin(ang_l)
        r_x = (petal_r * 0.75) * math.cos(ang_r)
        r_z = ring_z + (petal_r * 0.75) * math.sin(ang_r)

        # Front petal faces
        vf_tip = bm_wand.verts.new((tip_x, -0.0015, tip_z))
        vf_l = bm_wand.verts.new((l_x, -0.0015, l_z))
        vf_r = bm_wand.verts.new((r_x, -0.0015, r_z))
        pf_f = bm_wand.faces.new((center_front, vf_l, vf_tip, vf_r))
        pf_f.material_index = 1

        # Back petal faces (inverted winding for double-sided)
        vb_tip = bm_wand.verts.new((tip_x, 0.0015, tip_z))
        vb_l = bm_wand.verts.new((l_x, 0.0015, l_z))
        vb_r = bm_wand.verts.new((r_x, 0.0015, r_z))
        pf_b = bm_wand.faces.new((center_back, vb_r, vb_tip, vb_l))
        pf_b.material_index = 1

    # Glowing Core Gem in center (Slot 2: Wand Glow)
    gem = bmesh.ops.create_uvsphere(bm_wand, u_segments=12, v_segments=8, radius=0.008)
    gem_verts = set(gem['verts'])
    for v in gem_verts:
        v.co.z += ring_z
    for f in bm_wand.faces:
        if all(v in gem_verts for v in f.verts):
            f.material_index = 2

    # Offset entire wand mesh so hand grip center (Z = 0.08m) is at origin (0, 0, 0)
    grip_z = 0.08
    for v in bm_wand.verts:
        v.co.z -= grip_z

    mesh_wand = bpy.data.meshes.new("Hana_Teaching_Wand")
    bm_wand.to_mesh(mesh_wand)
    bm_wand.free()

    obj_wand = bpy.data.objects.new("Hana_Teaching_Wand", mesh_wand)
    bpy.context.collection.objects.link(obj_wand)
    obj_wand.data.materials.append(gold_mat)    # Slot 0: Gold
    obj_wand.data.materials.append(sakura_mat)  # Slot 1: Sakura Pink
    obj_wand.data.materials.append(glow_mat)    # Slot 2: Emissive Glow

    # Parent to Socket_Wand_R
    obj_wand.parent = armature
    obj_wand.parent_type = 'BONE'
    obj_wand.parent_bone = "Socket_Wand_R"
    # Point wand gracefully aloft and forward with sakura blossom facing frontally
    obj_wand.rotation_euler = (math.radians(108.9), math.radians(6.7), math.radians(136.1))
    obj_wand.location = (0.012, -0.015, -0.010)
    obj_wand.scale = (1.0, 1.0, 1.0)
    print("  [Wand] Unified Teaching Wand created and parented to Socket_Wand_R")

    # -------------------------------------------------------------
    # 4. BUILD REAR BUTTERFLY MUSUBI BOW FOR OBI
    # -------------------------------------------------------------
    print("\n  Building Rear Butterfly Musubi Bow...")
    bm_bow = bmesh.new()

    # Central knot
    knot = bmesh.ops.create_cube(bm_bow, size=1.0)
    for v in knot['verts']:
        v.co.x *= 0.035
        v.co.y = v.co.y * 0.025 + 0.005
        v.co.z = v.co.z * 0.035 + 0.005

    # Gold knot tie band around center knot
    knot_tie = bmesh.ops.create_cube(bm_bow, size=1.0)
    tie_verts = set(knot_tie['verts'])
    for v in knot_tie['verts']:
        v.co.x *= 0.038
        v.co.y = v.co.y * 0.028 + 0.006
        v.co.z = v.co.z * 0.014 + 0.005

    # Elegant curved butterfly ribbon loops (2 upper wings, 2 lower wings)
    # Modeled with curved parametric strips that loop outward and back
    N_STEPS = 10
    ribbon_w = 0.045
    ribbon_thick = 0.007

    # Upper wings: arching out to X = +/- 0.165, Y = 0.025, Z = 0.06
    for sign in [-1, 1]:
        wing_verts_outer = []
        wing_verts_inner = []
        for s in range(N_STEPS + 1):
            t = s / N_STEPS # 0 to 1 loop
            angle = t * math.pi
            # Parametric loop curve
            lx = (0.030 + 0.135 * math.sin(angle)) * sign
            ly = 0.010 + 0.025 * math.sin(angle)
            lz = 0.005 + 0.055 * math.sin(angle) + (t - 0.5) * 0.02

            # Ribbon width across Y/Z
            wing_verts_outer.append(bm_bow.verts.new((lx, ly + ribbon_thick, lz + ribbon_w * 0.5 * (1 - 0.3 * t))))
            wing_verts_inner.append(bm_bow.verts.new((lx, ly - ribbon_thick, lz - ribbon_w * 0.5 * (1 - 0.3 * t))))

        for s in range(N_STEPS):
            f_top = bm_bow.faces.new((wing_verts_outer[s], wing_verts_outer[s+1], wing_verts_inner[s+1], wing_verts_inner[s]))

    # Lower wings: arching out to X = +/- 0.135, Y = 0.020, Z = -0.035
    for sign in [-1, 1]:
        wing2_verts_outer = []
        wing2_verts_inner = []
        for s in range(N_STEPS + 1):
            t = s / N_STEPS
            angle = t * math.pi
            lx = (0.025 + 0.110 * math.sin(angle)) * sign
            ly = 0.012 + 0.020 * math.sin(angle)
            lz = -0.010 - 0.040 * math.sin(angle)

            wing2_verts_outer.append(bm_bow.verts.new((lx, ly + ribbon_thick, lz + ribbon_w * 0.4 * (1 - 0.3 * t))))
            wing2_verts_inner.append(bm_bow.verts.new((lx, ly - ribbon_thick, lz - ribbon_w * 0.4 * (1 - 0.3 * t))))

        for s in range(N_STEPS):
            bm_bow.faces.new((wing2_verts_outer[s], wing2_verts_outer[s+1], wing2_verts_inner[s+1], wing2_verts_inner[s]))

    # 2 Hanging ribbon tails: cascading down from knot along back of kimono
    for sign in [-1, 1]:
        tail = bmesh.ops.create_cube(bm_bow, size=1.0)
        for v in tail['verts']:
            v.co.x = (v.co.x * 0.035 + 0.045) * sign
            v.co.y = v.co.y * 0.010 + 0.022
            v.co.z = v.co.z * 0.085 - 0.095

    # Assign materials: 0 for plum navy, 1 for gold tie
    for f in bm_bow.faces:
        if all(v in tie_verts for v in f.verts):
            f.material_index = 1
        else:
            f.material_index = 0

    mesh_bow = bpy.data.meshes.new("Hana_Obi_Musubi_Bow")
    bm_bow.to_mesh(mesh_bow)
    bm_bow.free()

    obj_bow = bpy.data.objects.new("Hana_Obi_Musubi_Bow", mesh_bow)
    bpy.context.collection.objects.link(obj_bow)
    obj_bow.data.materials.append(obi_mat)   # Slot 0: Plum Navy
    obj_bow.data.materials.append(gold_mat)  # Slot 1: Gold Trim

    # Parent bow to Spine bone
    obj_bow.parent = armature
    obj_bow.parent_type = 'BONE'
    obj_bow.parent_bone = "J_Bip_C_Spine"
    # Position at rear of waist: local Z along bone
    obj_bow.rotation_euler = (math.radians(90), 0, 0)
    obj_bow.location = (0.0, 0.0, -0.205)
    obj_bow.scale = (1.0, 1.0, 1.0)
    print("  [Bow] Butterfly Musubi Bow created and parented to J_Bip_C_Spine")

    # -------------------------------------------------------------
    # 5. CONFIGURE FACIAL MORPH ALIASES (11 EMOTIONS, 3 BLINKS, 5 VISEMES)
    # -------------------------------------------------------------
    print("\n  Normalizing Facial Shape Keys...")
    face_obj = bpy.data.objects.get("Face")
    if face_obj and face_obj.data.shape_keys:
        kb = face_obj.data.shape_keys.key_blocks
        existing_keys = {k.name: k for k in kb}
        print(f"  Existing shape keys count: {len(existing_keys)}")

        ALIAS_MAP = {
            # Emotions
            "neutral": "Fcl_ALL_Neutral",
            "happy": "Fcl_ALL_Joy",
            "encouraging": "Fcl_ALL_Fun",
            "surprised": "Fcl_ALL_Surprised",
            "sad": "Fcl_ALL_Sorrow",
            "confused": "Fcl_BRW_Sorrow",
            "thinking": "Fcl_BRW_Surprised",
            "listening": "Fcl_ALL_Neutral",
            "celebrating": "Fcl_ALL_Joy",
            "error": "Fcl_ALL_Angry",
            "sleepy": "Fcl_EYE_Close",

            # Blinks
            "blink": "Fcl_EYE_Close",
            "blink_left": "Fcl_EYE_Close_L",
            "blink_right": "Fcl_EYE_Close_R",

            # Japanese Visemes
            "vowel_a": "Fcl_MTH_A",
            "vowel_i": "Fcl_MTH_I",
            "vowel_u": "Fcl_MTH_U",
            "vowel_e": "Fcl_MTH_E",
            "vowel_o": "Fcl_MTH_O",
        }

        created_aliases = 0
        for alias_name, src_name in ALIAS_MAP.items():
            if alias_name not in kb and src_name in kb:
                src_block = kb[src_name]
                new_block = face_obj.shape_key_add(name=alias_name, from_mix=False)
                for i, v in enumerate(src_block.data):
                    new_block.data[i].co = v.co
                created_aliases += 1

        print(f"  [Facial] Created {created_aliases} canonical runtime shape key aliases.")
        print(f"  Total shape keys on Face: {len(face_obj.data.shape_keys.key_blocks)}")

    # Save to master .blend file
    bpy.ops.wm.save_as_mainfile(filepath=MASTER_BLEND)
    print(f"\nSaved updated master scene to: {MASTER_BLEND}")
    return True

if __name__ == "__main__":
    build_accessories_and_rig()

