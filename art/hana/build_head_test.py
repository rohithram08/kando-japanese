import bpy
import bmesh
import math
from mathutils import Vector, Matrix

# Clear existing scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# 1. Setup Camera and Lighting for portrait close-up
cam_data = bpy.data.cameras.new("PortraitCam")
cam_data.lens = 85 # 85mm portrait lens to avoid wide-angle distortion
cam_obj = bpy.data.objects.new("PortraitCam", cam_data)
bpy.context.collection.objects.link(cam_obj)
cam_obj.location = (0, -0.95, 1.52)
cam_obj.rotation_euler = (math.radians(88), 0, 0)
scene.camera = cam_obj

# Three-point lighting setup for anime character
# Key light
key_data = bpy.data.lights.new("KeyLight", type='AREA')
key_data.energy = 45.0
key_data.size = 0.5
key_obj = bpy.data.objects.new("KeyLight", key_data)
bpy.context.collection.objects.link(key_obj)
key_obj.location = (0.4, -0.7, 1.8)
key_obj.rotation_euler = (math.radians(60), math.radians(20), math.radians(-30))

# Fill light (soft pink/purple tint for Hana)
fill_data = bpy.data.lights.new("FillLight", type='AREA')
fill_data.energy = 25.0
fill_data.color = (0.95, 0.85, 0.95)
fill_data.size = 0.8
fill_obj = bpy.data.objects.new("FillLight", fill_data)
bpy.context.collection.objects.link(fill_obj)
fill_obj.location = (-0.5, -0.6, 1.5)
fill_obj.rotation_euler = (math.radians(70), math.radians(-25), math.radians(30))

# Rim light (hair highlight)
rim_data = bpy.data.lights.new("RimLight", type='SPOT')
rim_data.energy = 80.0
rim_data.spot_size = math.radians(45)
rim_obj = bpy.data.objects.new("RimLight", rim_data)
bpy.context.collection.objects.link(rim_obj)
rim_obj.location = (0, 0.6, 2.1)
rim_obj.rotation_euler = (math.radians(-140), 0, 0)

# Environment / World background
world = bpy.data.worlds.new("HanaWorld")
scene.world = world
world.use_nodes = True
bg_node = world.node_tree.nodes['Background']
bg_node.inputs['Color'].default_value = (0.85, 0.80, 0.90, 1.0) # soft lavender
bg_node.inputs['Strength'].default_value = 0.6

# Palette materials
def create_mat(name, base_color, roughness=0.5, metallic=0.0, specular=0.5):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*base_color, 1.0)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    return mat

mat_skin = create_mat("Mat_Skin", (0.99, 0.92, 0.88), roughness=0.35)
mat_hair = create_mat("Mat_Hair", (0.24, 0.13, 0.08), roughness=0.45)
mat_eye_amber = create_mat("Mat_EyeAmber", (0.75, 0.42, 0.12), roughness=0.1)
mat_eye_white = create_mat("Mat_EyeWhite", (0.95, 0.95, 0.98), roughness=0.2)
mat_eyeliner = create_mat("Mat_Eyeliner", (0.10, 0.06, 0.04), roughness=0.6)
mat_cap = create_mat("Mat_Cap", (0.12, 0.10, 0.22), roughness=0.4)
mat_gold = create_mat("Mat_Gold", (0.83, 0.66, 0.26), roughness=0.25, metallic=0.9)
mat_sakura = create_mat("Mat_Sakura", (0.98, 0.78, 0.83), roughness=0.4)

# 2. Build Modeled Anime Head Topology using BMesh
# Custom quad mesh with anime jaw, chin, eye sockets, and nose
bm_head = bmesh.new()

# Define cross-sectional contour rings for an anime head
# Rings go from neck (bottom) to crown (top)
# Each ring has 16 vertices around the circumference, shaped to form chin, cheeks, forehead
rings_def = [
    # z, rx, ry_front, ry_back, y_offset
    (1.36, 0.038, 0.038, 0.038, 0.000),  # Neck base
    (1.40, 0.042, 0.042, 0.042, -0.002), # Neck top
    (1.43, 0.035, 0.055, 0.050, -0.015), # Pointed chin tip
    (1.46, 0.062, 0.075, 0.068, -0.010), # Lower jaw & chin transition
    (1.49, 0.078, 0.088, 0.078, -0.008), # Mouth level & cheeks
    (1.52, 0.084, 0.092, 0.082, -0.004), # Eye level / cheekbones (widest)
    (1.55, 0.082, 0.090, 0.082, 0.000),  # Brow level
    (1.58, 0.076, 0.085, 0.080, 0.005),  # Lower forehead
    (1.61, 0.065, 0.072, 0.072, 0.010),  # Upper forehead
    (1.63, 0.042, 0.048, 0.048, 0.012),  # Crown top
]

N_VERTS = 16
ring_verts = []

for z, rx, ry_f, ry_b, y_off in rings_def:
    current_ring = []
    for i in range(N_VERTS):
        angle = 2.0 * math.pi * i / N_VERTS
        cos_a = math.cos(angle)
        sin_a = math.sin(angle)
        
        # x is lateral
        vx = rx * sin_a
        # y is anterior/posterior (front is positive y? In blender +Y is back, -Y is front!)
        # We put camera at -Y looking towards +Y. So FRONT of face is -Y!
        if cos_a < 0: # Front of face (cos < 0 -> -Y)
            vy = ry_f * cos_a + y_off
        else: # Back of head
            vy = ry_b * cos_a + y_off
            
        v = bm_head.verts.new((vx, vy, z))
        current_ring.append(v)
    ring_verts.append(current_ring)

# Bridge rings with quad faces
for r in range(len(ring_verts) - 1):
    r1 = ring_verts[r]
    r2 = ring_verts[r+1]
    for i in range(N_VERTS):
        i_next = (i + 1) % N_VERTS
        bm_head.faces.new((r1[i], r1[i_next], r2[i_next], r2[i]))

# Cap crown
crown_top = bm_head.verts.new((0, 0.012, 1.64))
for i in range(N_VERTS):
    i_next = (i + 1) % N_VERTS
    bm_head.faces.new((ring_verts[-1][i], ring_verts[-1][i_next], crown_top))

# Refine face features: indent eye sockets, create nose bump, mouth groove
bm_head.verts.ensure_lookup_table()
for v in bm_head.verts:
    # Eye sockets: z ~ 1.50 to 1.54, x between 0.02 and 0.06, front face (y < -0.06)
    if 1.50 <= v.co.z <= 1.54 and 0.02 <= abs(v.co.x) <= 0.065 and v.co.y < -0.06:
        v.co.y += 0.012 # indent slightly into face
    # Small anime nose: z ~ 1.48 to 1.49, center (|x| < 0.012), front
    if 1.48 <= v.co.z <= 1.50 and abs(v.co.x) < 0.012 and v.co.y < -0.07:
        v.co.y -= 0.008 # project outward
        v.co.z -= 0.002
    # Small gentle mouth: z ~ 1.455 to 1.465, center (|x| < 0.025), front
    if 1.455 <= v.co.z <= 1.465 and abs(v.co.x) < 0.025 and v.co.y < -0.065:
        v.co.y += 0.004 # slight indentation

mesh_head = bpy.data.meshes.new("Hana_Head_Mesh")
bm_head.to_mesh(mesh_head)
bm_head.free()

obj_head = bpy.data.objects.new("Hana_Head", mesh_head)
bpy.context.collection.objects.link(obj_head)
obj_head.data.materials.append(mat_skin)

# Add Subdivision Surface for smooth anime skin topology
subsurf = obj_head.modifiers.new("Subdivision", type='SUBSURF')
subsurf.levels = 2
subsurf.render_levels = 2

# 3. Add Anime Eyes (Left and Right)
# Amber iris, pupil, eye whites, and eyeliner
for side, sign in [("L", -1), ("R", 1)]:
    eye_x = sign * 0.038
    eye_y = -0.075
    eye_z = 1.520
    
    # Sclera (Eye White)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=0.019, location=(eye_x, eye_y, eye_z))
    eye_white_obj = bpy.context.active_object
    eye_white_obj.name = f"EyeWhite_{side}"
    eye_white_obj.rotation_euler = (math.radians(-90), 0, sign * math.radians(5))
    eye_white_obj.data.materials.append(mat_eye_white)
    
    # Iris (Amber convex disc)
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.013, depth=0.003, location=(eye_x, eye_y - 0.016, eye_z))
    iris_obj = bpy.context.active_object
    iris_obj.name = f"Iris_{side}"
    iris_obj.rotation_euler = (math.radians(90), 0, sign * math.radians(5))
    iris_obj.data.materials.append(mat_eye_amber)
    
    # Pupil (Dark chocolate center)
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.005, depth=0.0035, location=(eye_x, eye_y - 0.0165, eye_z))
    pupil_obj = bpy.context.active_object
    pupil_obj.name = f"Pupil_{side}"
    pupil_obj.rotation_euler = (math.radians(90), 0, sign * math.radians(5))
    pupil_obj.data.materials.append(mat_eyeliner)
    
    # Eyeliner / Lash line (curved arc above eye)
    bm_lash = bmesh.new()
    lash_pts = [
        Vector((eye_x - sign*0.018, eye_y - 0.014, eye_z - 0.002)),
        Vector((eye_x - sign*0.010, eye_y - 0.016, eye_z + 0.011)),
        Vector((eye_x + sign*0.006, eye_y - 0.016, eye_z + 0.012)),
        Vector((eye_x + sign*0.020, eye_y - 0.013, eye_z + 0.006)),
        Vector((eye_x + sign*0.024, eye_y - 0.010, eye_z + 0.008)), # flick
    ]
    lash_verts = [bm_lash.verts.new(p) for p in lash_pts]
    for k in range(len(lash_verts) - 1):
        bm_lash.edges.new((lash_verts[k], lash_verts[k+1]))
    mesh_lash = bpy.data.meshes.new(f"Eyelash_{side}")
    bm_lash.to_mesh(mesh_lash)
    bm_lash.free()
    lash_obj = bpy.data.objects.new(f"Eyelash_{side}", mesh_lash)
    bpy.context.collection.objects.link(lash_obj)
    lash_obj.data.materials.append(mat_eyeliner)
    
    # Skin modifier or solidify to give eyeliner thickness
    skin_mod = lash_obj.modifiers.new("Solidify", type='SOLIDIFY')
    skin_mod.thickness = 0.0035

# 4. Modeled Anime Hair Structure
# Back wavy volume + front bangs + side locks
bm_hair = bmesh.new()

# Front bangs: draped cards across forehead
for b_idx, x_off in enumerate([-0.05, -0.025, 0.0, 0.025, 0.05]):
    p0 = Vector((x_off * 0.8, -0.065, 1.62)) # root
    p1 = Vector((x_off * 0.9, -0.092, 1.58)) # curve out
    p2 = Vector((x_off * 1.05 + 0.005, -0.088, 1.54)) # tip above eyes
    
    # Create quad strip for bang strand
    w = 0.018
    v0_l = bm_hair.verts.new(p0 + Vector((-w/2, 0, 0)))
    v0_r = bm_hair.verts.new(p0 + Vector((w/2, 0, 0)))
    v1_l = bm_hair.verts.new(p1 + Vector((-w/2, 0, 0)))
    v1_r = bm_hair.verts.new(p1 + Vector((w/2, 0, 0)))
    v2_l = bm_hair.verts.new(p2 + Vector((-w/4, 0, 0)))
    v2_r = bm_hair.verts.new(p2 + Vector((w/4, 0, 0)))
    
    bm_hair.faces.new((v0_l, v0_r, v1_r, v1_l))
    bm_hair.faces.new((v1_l, v1_r, v2_r, v2_l))

# Side framing strands (Hime locks)
for s_sign in [-1, 1]:
    pts = [
        Vector((s_sign * 0.075, -0.05, 1.60)),
        Vector((s_sign * 0.090, -0.06, 1.52)),
        Vector((s_sign * 0.095, -0.05, 1.44)),
        Vector((s_sign * 0.092, -0.04, 1.36)),
        Vector((s_sign * 0.085, -0.03, 1.28)),
    ]
    w = 0.020
    prev_l, prev_r = None, None
    for p in pts:
        vl = bm_hair.verts.new(p + Vector((-w/2, 0, 0)))
        vr = bm_hair.verts.new(p + Vector((w/2, 0, 0)))
        if prev_l and prev_r:
            bm_hair.faces.new((prev_l, prev_r, vr, vl))
        prev_l, prev_r = vl, vr
        w *= 0.85 # taper

# Back voluminous hair
for row in range(5):
    z_h = 1.62 - row * 0.08
    y_h = 0.02 + row * 0.03
    w_h = 0.10 + row * 0.04
    pts = [
        Vector((-w_h, y_h, z_h)),
        Vector((-w_h * 0.5, y_h + 0.04, z_h)),
        Vector((0, y_h + 0.05, z_h)),
        Vector((w_h * 0.5, y_h + 0.04, z_h)),
        Vector((w_h, y_h, z_h)),
    ]
    # Create quads connecting rows
    # (Simplified hair mesh generation)

mesh_hair = bpy.data.meshes.new("Hana_Hair_Mesh")
bm_hair.to_mesh(mesh_hair)
bm_hair.free()

obj_hair = bpy.data.objects.new("Hana_Hair", mesh_hair)
bpy.context.collection.objects.link(obj_hair)
obj_hair.data.materials.append(mat_hair)
solid_hair = obj_hair.modifiers.new("SolidifyHair", type='SOLIDIFY')
solid_hair.thickness = 0.005
subsurf_hair = obj_hair.modifiers.new("SubsurfHair", type='SUBSURF')
subsurf_hair.levels = 1

# 5. Add Mortarboard Cap (Tilted 5 degrees)
bm_cap = bmesh.new()
# Cap skull dome
cap_dome = bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=0.088, location=(0, 0.01, 1.59))
cap_dome_obj = bpy.context.active_object
cap_dome_obj.name = "Cap_Dome"
cap_dome_obj.data.materials.append(mat_cap)

# Cap flat square board (26cm x 26cm)
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.01, 1.68))
cap_board = bpy.context.active_object
cap_board.name = "Cap_Board"
cap_board.scale = (0.24, 0.24, 0.012)
cap_board.rotation_euler = (math.radians(6), math.radians(-4), math.radians(20))
cap_board.data.materials.append(mat_cap)

# Gold button on cap center
bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.012, depth=0.008, location=(0, -0.01, 1.69))
cap_btn = bpy.context.active_object
cap_btn.name = "Cap_GoldBtn"
cap_btn.rotation_euler = cap_board.rotation_euler
cap_btn.data.materials.append(mat_gold)

# Sakura blossom pin on right temple
bpy.ops.mesh.primitive_cylinder_add(vertices=5, radius=0.022, depth=0.006, location=(0.088, -0.065, 1.59))
pin_obj = bpy.context.active_object
pin_obj.name = "Sakura_HairPin"
pin_obj.rotation_euler = (math.radians(70), math.radians(-30), math.radians(15))
pin_obj.data.materials.append(mat_sakura)

# 6. Set Render Settings and Render Close-Up Head Test
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 768
scene.render.resolution_y = 768
scene.render.filepath = "e:/Nihongo-testing/nihongo-master/art/hana/validation/hana_head_test_render.png"

bpy.ops.render.render(write_still=True)
print("Face close-up test render written to:", scene.render.filepath)
