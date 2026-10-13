"""
CHECKPOINT 2D — REFINED RENDERS & COMPATIBILITY INSPECTOR
=========================================================
Generates accurate, well-framed renders for:
- Hana face closeup (centered on eye bone Z=1.10)
- Hana eyes closeup
- Hana hair closeup
- Hana hands closeup
- Wand renders (framed to actual object bounds)
- Hana + Wand compatibility view (wand scaled & positioned at right hand)
"""

import bpy
import os
import math
import json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
VAL_DIR = os.path.join(ROOT, "art", "hana", "validation")
os.makedirs(VAL_DIR, exist_ok=True)

def ensure_vrm_addon():
    import addon_utils
    try:
        bpy.ops.preferences.addon_enable(module='bl_ext.user_default.vrm')
    except:
        pass
    for mod in addon_utils.modules():
        if 'vrm' in mod.__name__.lower():
            try:
                bpy.ops.preferences.addon_enable(module=mod.__name__)
            except:
                pass

def clean_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh)
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)
    for cam in list(bpy.data.cameras):
        bpy.data.cameras.remove(cam)
    for light in list(bpy.data.lights):
        bpy.data.lights.remove(light)
    for arm in list(bpy.data.armatures):
        bpy.data.armatures.remove(arm)
    for action in list(bpy.data.actions):
        bpy.data.actions.remove(action)

def setup_studio_lighting():
    key = bpy.data.lights.new("Key", type='AREA')
    key.energy = 60.0
    key.size = 1.5
    key_obj = bpy.data.objects.new("Key", key)
    bpy.context.collection.objects.link(key_obj)
    key_obj.location = (0.8, -1.5, 2.0)
    key_obj.rotation_euler = (math.radians(50), math.radians(10), math.radians(-20))

    fill = bpy.data.lights.new("Fill", type='AREA')
    fill.energy = 30.0
    fill.color = (0.96, 0.92, 0.98)
    fill.size = 2.0
    fill_obj = bpy.data.objects.new("Fill", fill)
    bpy.context.collection.objects.link(fill_obj)
    fill_obj.location = (-1.2, -1.0, 1.2)
    fill_obj.rotation_euler = (math.radians(60), math.radians(-15), math.radians(25))

    rim = bpy.data.lights.new("Rim", type='SPOT')
    rim.energy = 100.0
    rim.spot_size = math.radians(60)
    rim_obj = bpy.data.objects.new("Rim", rim)
    bpy.context.collection.objects.link(rim_obj)
    rim_obj.location = (0, 1.2, 2.2)
    rim_obj.rotation_euler = (math.radians(-135), 0, 0)

    world = bpy.data.worlds.new("InspWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.88, 0.85, 0.92, 1.0)
    bg.inputs['Strength'].default_value = 0.6

def render_targeted_view(name, target_xyz, dist, angle_deg, elevation_deg=0, lens=70, res_x=768, res_y=768):
    cam_data = bpy.data.cameras.new("Cam_" + name)
    cam_data.lens = lens
    cam_data.clip_start = 0.05
    cam_data.clip_end = 500.0
    cam_obj = bpy.data.objects.new("Cam_" + name, cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj

    tx, ty, tz = target_xyz
    rad_h = math.radians(angle_deg)
    rad_v = math.radians(elevation_deg)

    cx = tx + dist * math.cos(rad_v) * math.sin(rad_h)
    cy = ty - dist * math.cos(rad_v) * math.cos(rad_h)
    cz = tz + dist * math.sin(rad_v)
    cam_obj.location = (cx, cy, cz)

    trk = bpy.data.objects.new("_trk_" + name, None)
    trk.location = target_xyz
    bpy.context.collection.objects.link(trk)

    con = cam_obj.constraints.new(type='TRACK_TO')
    con.target = trk
    con.track_axis = 'TRACK_NEGATIVE_Z'
    con.up_axis = 'UP_Y'

    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
    scene.render.resolution_x = res_x
    scene.render.resolution_y = res_y
    out = os.path.join(VAL_DIR, f"inspect_{name}.png")
    scene.render.filepath = out
    bpy.ops.render.render(write_still=True)

    cam_obj.constraints.remove(con)
    bpy.data.objects.remove(trk)
    bpy.data.objects.remove(cam_obj)
    bpy.data.cameras.remove(cam_data)
    print(f"  [Render] {name} -> {out}")
    return out

def run():
    print("=" * 70)
    print("STEP 1: IMPORT HANA AND RENDER TARGETED CLOSEUPS")
    print("=" * 70)
    ensure_vrm_addon()
    clean_scene()

    vrm_path = os.path.join(ROOT, "_source", "hana-base.vrm")
    bpy.ops.import_scene.vrm(filepath=vrm_path)
    setup_studio_lighting()

    # Target coordinates from bone detection:
    # Eyes: Z ~ 1.1007
    # Face center: (0, 0, 1.07)
    # Right hand: (-0.408, 0.019, 0.962)
    face_target = (0.0, 0.0, 1.07)
    eye_target = (0.0, 0.0, 1.09)
    r_hand_target = (-0.408, 0.019, 0.962)

    # Face close-up
    render_targeted_view("hana_face_closeup", face_target, dist=0.45, angle_deg=0, elevation_deg=-2, lens=65, res_x=768, res_y=768)
    # Eyes close-up
    render_targeted_view("hana_eyes_closeup", eye_target, dist=0.28, angle_deg=0, elevation_deg=0, lens=85, res_x=768, res_y=512)
    # Face 3/4 close-up
    render_targeted_view("hana_face_three_quarter", face_target, dist=0.48, angle_deg=35, elevation_deg=-2, lens=65, res_x=768, res_y=768)
    # Hair view
    render_targeted_view("hana_hair_view", (0.0, 0.0, 1.05), dist=0.9, angle_deg=145, elevation_deg=15, lens=50, res_x=768, res_y=768)
    # Hands close-up
    render_targeted_view("hana_hands_closeup", r_hand_target, dist=0.4, angle_deg=15, elevation_deg=10, lens=60, res_x=768, res_y=512)

    print("\n" + "=" * 70)
    print("STEP 2: INSPECT AND RENDER WAND SOURCE")
    print("=" * 70)
    clean_scene()
    setup_studio_lighting()

    wand_blend = os.path.join(ROOT, "_source", "Staff - Harry Potter.blend")
    with bpy.data.libraries.load(wand_blend, link=False) as (df, dt):
        dt.objects = [o for o in df.objects if o == "Cylinder"]
    for obj in dt.objects:
        if obj:
            bpy.context.collection.objects.link(obj)

    wand_obj = bpy.data.objects.get("Cylinder")
    if wand_obj:
        print(f"  Wand raw dimensions: {wand_obj.dimensions}")
        print(f"  Wand raw location: {wand_obj.location}")
        # Calculate bounding box
        coords = [wand_obj.matrix_world @ v.co for v in wand_obj.data.vertices]
        min_x = min(c.x for c in coords)
        max_x = max(c.x for c in coords)
        min_y = min(c.y for c in coords)
        max_y = max(c.y for c in coords)
        min_z = min(c.z for c in coords)
        max_z = max(c.z for c in coords)
        center_x = (min_x + max_x) / 2
        center_y = (min_y + max_y) / 2
        center_z = (min_z + max_z) / 2
        h = max_z - min_z
        print(f"  Bounds: X=[{min_x:.2f}, {max_x:.2f}], Y=[{min_y:.2f}, {max_y:.2f}], Z=[{min_z:.2f}, {max_z:.2f}]")
        print(f"  Height: {h:.2f} m, Center: ({center_x:.2f}, {center_y:.2f}, {center_z:.2f})")

        # Frame camera properly to this giant object
        cam_dist = h * 1.5
        render_targeted_view("wand_front", (center_x, center_y, center_z), dist=cam_dist, angle_deg=0, elevation_deg=0, lens=40, res_x=512, res_y=1024)
        render_targeted_view("wand_three_quarter", (center_x, center_y, center_z), dist=cam_dist, angle_deg=45, elevation_deg=10, lens=40, res_x=512, res_y=1024)
        # Tip close-up (top 20% of wand)
        tip_z = max_z - h * 0.1
        render_targeted_view("wand_tip_closeup", (center_x, center_y, tip_z), dist=h * 0.35, angle_deg=20, elevation_deg=5, lens=50, res_x=768, res_y=768)

    print("\n" + "=" * 70)
    print("STEP 3: PHASE 5 — HANA + WAND COMPATIBILITY TEST")
    print("=" * 70)
    clean_scene()
    setup_studio_lighting()

    # Import Hana
    bpy.ops.import_scene.vrm(filepath=vrm_path)
    arm = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]

    # Load wand mesh
    with bpy.data.libraries.load(wand_blend, link=False) as (df, dt):
        dt.objects = [o for o in df.objects if o == "Cylinder"]
    for obj in dt.objects:
        if obj:
            bpy.context.collection.objects.link(obj)

    wand = bpy.data.objects.get("Cylinder")
    if wand and arm:
        # Scale wand to ~38 cm (0.38 m)
        raw_h = wand.dimensions.z
        target_h = 0.38
        scale_factor = target_h / raw_h if raw_h > 0 else 0.0014
        wand.scale = (scale_factor, scale_factor, scale_factor)
        bpy.context.view_layer.objects.active = wand
        bpy.ops.object.transform_apply(scale=True)

        # Position at Hana's right hand
        r_hand_bone = arm.data.bones.get("J_Bip_R_Hand")
        if r_hand_bone:
            hand_world = arm.matrix_world @ r_hand_bone.head_local
            wand.location = (hand_world.x, hand_world.y, hand_world.z)
            # Give wand a warm gold material for visual inspection
            mat = bpy.data.materials.new("Wand_Gold_Test")
            mat.use_nodes = True
            bsdf = mat.node_tree.nodes.get("Principled BSDF")
            if bsdf:
                bsdf.inputs['Base Color'].default_value = (0.83, 0.66, 0.26, 1.0) # #D4A843
                bsdf.inputs['Metallic'].default_value = 0.9
                bsdf.inputs['Roughness'].default_value = 0.25
            wand.data.materials.clear()
            wand.data.materials.append(mat)

            print(f"  Wand placed at right hand: {hand_world}")
            print(f"  Wand dimensions after scaling: {wand.dimensions.x*100:.1f} x {wand.dimensions.y*100:.1f} x {wand.dimensions.z*100:.1f} cm")

            # Render full compatibility front view
            render_targeted_view("hana_wand_compatibility_full", (0, 0, 0.75), dist=2.6, angle_deg=0, elevation_deg=0, lens=70, res_x=768, res_y=1024)
            # Render right hand + wand close-up
            render_targeted_view("hana_wand_compatibility_hand", (hand_world.x, hand_world.y, hand_world.z), dist=0.65, angle_deg=20, elevation_deg=5, lens=65, res_x=768, res_y=768)

    print("=" * 70)
    print("ALL REFINED RENDERS COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    run()
