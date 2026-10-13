"""
CHECKPOINT 2D — WAND RENDERS, TECHNICAL METRICS & SCALE ANALYSIS
================================================================
Generates all required wand views with proper modern EEVEE-Next PBR materials:
1. Wand Front
2. Wand 3/4
3. Wand Side
4. Wand Tip / Handle Close-up
5. Side-by-side: Hana (147.5cm) vs Current Wand (288.3cm)
6. Hana holding Target 38cm Teaching Wand
7. Close-up of Hana's hand holding wand
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

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def setup_lighting(energy_mult=1.0):
    key = bpy.data.lights.new("Key", type='AREA')
    key.energy = 80.0 * energy_mult
    key.size = 2.0
    ko = bpy.data.objects.new("Key", key)
    bpy.context.collection.objects.link(ko)
    ko.location = (1.5, -2.0, 2.5)
    ko.rotation_euler = (math.radians(50), math.radians(10), math.radians(-20))

    fill = bpy.data.lights.new("Fill", type='AREA')
    fill.energy = 40.0 * energy_mult
    fill.color = (0.95, 0.92, 0.98)
    fill.size = 2.5
    fo = bpy.data.objects.new("Fill", fill)
    bpy.context.collection.objects.link(fo)
    fo.location = (-1.8, -1.5, 1.5)
    fo.rotation_euler = (math.radians(60), math.radians(-15), math.radians(25))

    rim = bpy.data.lights.new("Rim", type='SPOT')
    rim.energy = 120.0 * energy_mult
    rim.spot_size = math.radians(60)
    ro = bpy.data.objects.new("Rim", rim)
    bpy.context.collection.objects.link(ro)
    ro.location = (0, 2.0, 3.0)
    ro.rotation_euler = (math.radians(-135), 0, 0)

    world = bpy.data.worlds.new("InspWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.88, 0.85, 0.92, 1.0)
    bg.inputs['Strength'].default_value = 0.6

def create_gold_material(name="Wand_PBR_Gold"):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (0.831, 0.659, 0.263, 1.0) # #D4A843
        bsdf.inputs['Metallic'].default_value = 0.85
        bsdf.inputs['Roughness'].default_value = 0.28
    return mat

def render_camera_to_file(cam_name, target_xyz, dist, angle_deg, elev_deg, lens, out_name, rx=768, ry=1024):
    cd = bpy.data.cameras.new(cam_name)
    cd.lens = lens
    cd.clip_start = 0.05
    cd.clip_end = 500.0
    co = bpy.data.objects.new(cam_name, cd)
    bpy.context.collection.objects.link(co)
    bpy.context.scene.camera = co

    tx, ty, tz = target_xyz
    rh = math.radians(angle_deg)
    rv = math.radians(elev_deg)
    cx = tx + dist * math.cos(rv) * math.sin(rh)
    cy = ty - dist * math.cos(rv) * math.cos(rh)
    cz = tz + dist * math.sin(rv)
    co.location = (cx, cy, cz)

    trk = bpy.data.objects.new("_trk_" + cam_name, None)
    trk.location = target_xyz
    bpy.context.collection.objects.link(trk)
    con = co.constraints.new(type='TRACK_TO')
    con.target = trk
    con.track_axis = 'TRACK_NEGATIVE_Z'
    con.up_axis = 'UP_Y'

    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
    scene.render.resolution_x = rx
    scene.render.resolution_y = ry
    out_path = os.path.join(VAL_DIR, out_name)
    scene.render.filepath = out_path
    bpy.ops.render.render(write_still=True)

    co.constraints.remove(con)
    bpy.data.objects.remove(trk)
    bpy.data.objects.remove(co)
    bpy.data.cameras.remove(cd)
    print(f"  [Render] {out_name} saved.")
    return out_path

def step1_render_wand_isolated():
    print("=" * 70)
    print("STEP 1: RENDER WAND ISOLATED (CURRENT .BLEND SOURCE)")
    print("=" * 70)
    reset_scene()
    setup_lighting(energy_mult=1.2)

    wand_blend = os.path.join(ROOT, "_source", "Staff - Harry Potter.blend")
    # Load mesh object
    with bpy.data.libraries.load(wand_blend, link=False) as (df, dt):
        dt.objects = [o for o in df.objects if o == "Cylinder"]

    wand = dt.objects[0]
    bpy.context.collection.objects.link(wand)

    # Apply modern gold material
    gold = create_gold_material("Wand_Gold")
    wand.data.materials.clear()
    wand.data.materials.append(gold)

    # Normalize position to origin for clean isolated studio shots
    # Current scale from file is preserved: scale = (0.0052, 0.011, 0.011)
    bpy.context.view_layer.objects.active = wand
    # Orient upright along Z
    wand.rotation_euler = (0, 0, 0)
    wand.location = (0, 0, 0)

    # Measure exact dimensions
    bpy.context.view_layer.update()
    dim = wand.dimensions
    length = max(dim.x, dim.y, dim.z)
    print(f"  Wand dimensions: {dim.x*100:.2f} cm x {dim.y*100:.2f} cm x {dim.z*100:.2f} cm")
    print(f"  Effective length: {length*100:.2f} cm")

    # Center camera on the wand body
    center = (0, 0, dim.z / 2)
    dist = dim.z * 1.35

    render_camera_to_file("WandFront", center, dist=dist, angle_deg=0, elev_deg=0, lens=50, out_name="inspect_wand_front.png", rx=512, ry=1024)
    render_camera_to_file("Wand34", center, dist=dist, angle_deg=35, elev_deg=10, lens=50, out_name="inspect_wand_three_quarter.png", rx=512, ry=1024)
    render_camera_to_file("WandSide", center, dist=dist, angle_deg=90, elev_deg=0, lens=50, out_name="inspect_wand_side.png", rx=512, ry=1024)
    # Tip close-up (top 25% of wand)
    tip_center = (0, 0, dim.z * 0.88)
    render_camera_to_file("WandTip", tip_center, dist=0.65, angle_deg=20, elev_deg=5, lens=65, out_name="inspect_wand_tip_closeup.png", rx=768, ry=768)

def step2_side_by_side_and_holding():
    print("\n" + "=" * 70)
    print("STEP 2: HANA + WAND SCALE COMPARISON & HAND ATTACHMENT")
    print("=" * 70)
    reset_scene()
    ensure_vrm_addon()
    setup_lighting(energy_mult=1.0)

    vrm_path = os.path.join(ROOT, "_source", "hana-base.vrm")
    bpy.ops.import_scene.vrm(filepath=vrm_path)
    arm = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]

    wand_blend = os.path.join(ROOT, "_source", "Staff - Harry Potter.blend")
    with bpy.data.libraries.load(wand_blend, link=False) as (df, dt):
        dt.objects = [o for o in df.objects if o == "Cylinder"]

    wand_raw = dt.objects[0]
    bpy.context.collection.objects.link(wand_raw)
    gold = create_gold_material("Wand_Gold_Comp")
    wand_raw.data.materials.clear()
    wand_raw.data.materials.append(gold)

    # 1. Side-by-side: Hana (1.475m) next to current 2.88m staff
    wand_raw.rotation_euler = (0, 0, 0)
    wand_raw.location = (0.55, 0, 0) # standing next to Hana on the floor
    bpy.context.view_layer.update()

    render_camera_to_file("ScaleCam", (0.25, 0, 1.4), dist=4.2, angle_deg=0, elev_deg=0, lens=45, out_name="inspect_scale_hana_vs_current_wand.png", rx=1024, ry=1024)

    # 2. Now duplicate / scale wand to target teaching size (~38 cm) and place in right hand
    wand_target = wand_raw
    # Current height is 2.8834m, scale to 0.38m
    current_len = wand_target.dimensions.z
    scale_factor = 0.38 / current_len if current_len > 0 else 0.132
    wand_target.scale = (wand_target.scale.x * scale_factor, wand_target.scale.y * scale_factor, wand_target.scale.z * scale_factor)
    bpy.context.view_layer.update()

    r_hand_bone = arm.data.bones.get("J_Bip_R_Hand")
    if r_hand_bone:
        hand_world = arm.matrix_world @ r_hand_bone.head_local
        # Palm center is offset ~5cm outward along -X in T-pose
        palm_world = (hand_world.x - 0.05, hand_world.y, hand_world.z)
        wand_target.location = palm_world
        # Rotate wand to be held vertically / angled slightly forward
        wand_target.rotation_euler = (math.radians(15), math.radians(10), 0)
        bpy.context.view_layer.update()

        print(f"  Target wand scaled: {wand_target.dimensions.x*100:.1f} x {wand_target.dimensions.y*100:.1f} x {wand_target.dimensions.z*100:.1f} cm")
        print(f"  Target wand placed in right hand palm: {palm_world}")

        # Render Hana holding target wand (full body)
        render_camera_to_file("HanaHoldingWand", (0, 0, 0.8), dist=2.6, angle_deg=15, elev_deg=0, lens=65, out_name="inspect_hana_holding_wand.png", rx=768, ry=1024)

        # Render Close-up of hand holding wand
        render_camera_to_file("HandWandCloseup", palm_world, dist=0.6, angle_deg=25, elev_deg=8, lens=70, out_name="inspect_hana_hand_wand_closeup.png", rx=768, ry=768)

def compute_measurements():
    hana_height_cm = 147.5
    current_wand_length_cm = 288.34
    current_wand_width_cm = 17.78
    current_wand_depth_cm = 19.05
    target_wand_length_cm = 38.0
    hand_length_cm = 12.5

    data = {
        "hana_height_cm": hana_height_cm,
        "current_wand_length_cm": round(current_wand_length_cm, 1),
        "current_wand_width_cm": round(current_wand_width_cm, 1),
        "current_wand_depth_cm": round(current_wand_depth_cm, 1),
        "target_wand_length_cm": target_wand_length_cm,
        "hand_length_cm": hand_length_cm,
        "current_wand_to_body_ratio_percent": round((current_wand_length_cm / hana_height_cm) * 100, 1),
        "target_wand_to_body_ratio_percent": round((target_wand_length_cm / hana_height_cm) * 100, 1),
        "current_wand_to_hand_ratio": round(current_wand_length_cm / hand_length_cm, 1),
        "target_wand_to_hand_ratio": round(target_wand_length_cm / hand_length_cm, 1),
        "scaling_factor_to_target_38cm": round(target_wand_length_cm / current_wand_length_cm, 4),
        "assessment": "The current wand in the .blend file (288.3 cm) is a 9.5-foot staff (195% of Hana's height). Scaled to 38 cm (scaling factor 0.1318), it achieves the target 25.8% body ratio and 3.0:1 hand ratio, perfectly fitting the elegant teaching wand aesthetic."
    }

    with open(os.path.join(VAL_DIR, "wand_scale_measurements.json"), "w") as f:
        json.dump(data, f, indent=2)
    print("\nMeasurements JSON saved:")
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    step1_render_wand_isolated()
    step2_side_by_side_and_holding()
    compute_measurements()
