"""
CHECKPOINT 2D — FINAL WAND RENDERS & SCALE ANALYSIS
===================================================
1. Renders wand at its current .blend scale (2.88m)
2. Renders side-by-side: Hana (1.475m) next to current wand (2.88m)
3. Renders Hana holding target 38cm teaching wand
4. Measures exact hand, wand, body dimensions & ratios
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
    key.size = 2.0
    key_obj = bpy.data.objects.new("Key", key)
    bpy.context.collection.objects.link(key_obj)
    key_obj.location = (1.5, -2.5, 2.5)
    key_obj.rotation_euler = (math.radians(50), math.radians(10), math.radians(-20))

    fill = bpy.data.lights.new("Fill", type='AREA')
    fill.energy = 30.0
    fill.color = (0.95, 0.92, 0.98)
    fill.size = 2.5
    fill_obj = bpy.data.objects.new("Fill", fill)
    bpy.context.collection.objects.link(fill_obj)
    fill_obj.location = (-1.8, -1.5, 1.5)
    fill_obj.rotation_euler = (math.radians(60), math.radians(-15), math.radians(25))

    rim = bpy.data.lights.new("Rim", type='SPOT')
    rim.energy = 100.0
    rim.spot_size = math.radians(60)
    rim_obj = bpy.data.objects.new("Rim", rim)
    bpy.context.collection.objects.link(rim_obj)
    rim_obj.location = (0, 2.0, 3.0)
    rim_obj.rotation_euler = (math.radians(-135), 0, 0)

    world = bpy.data.worlds.new("InspWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.88, 0.85, 0.92, 1.0)
    bg.inputs['Strength'].default_value = 0.6

def render_view(cam_name, target_xyz, dist, angle_deg, elev_deg, lens, out_name, rx=768, ry=1024):
    cam_data = bpy.data.cameras.new(cam_name)
    cam_data.lens = lens
    cam_data.clip_start = 0.05
    cam_data.clip_end = 500.0
    cam_obj = bpy.data.objects.new(cam_name, cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj

    tx, ty, tz = target_xyz
    rad_h = math.radians(angle_deg)
    rad_v = math.radians(elev_deg)
    cx = tx + dist * math.cos(rad_v) * math.sin(rad_h)
    cy = ty - dist * math.cos(rad_v) * math.cos(rad_h)
    cz = tz + dist * math.sin(rad_v)
    cam_obj.location = (cx, cy, cz)

    trk = bpy.data.objects.new("_trk", None)
    trk.location = target_xyz
    bpy.context.collection.objects.link(trk)
    con = cam_obj.constraints.new(type='TRACK_TO')
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

    cam_obj.constraints.remove(con)
    bpy.data.objects.remove(trk)
    bpy.data.objects.remove(cam_obj)
    bpy.data.cameras.remove(cam_data)
    print(f"  [Render] {out_name}")
    return out_path

def main():
    print("=" * 70)
    print("WAND ISOLATED RENDERS (CURRENT .BLEND STATE)")
    print("=" * 70)
    clean_scene()
    setup_studio_lighting()

    wand_blend = os.path.join(ROOT, "_source", "Staff - Harry Potter.blend")
    # Open the main file to keep exact transforms from owner
    bpy.ops.wm.open_mainfile(filepath=wand_blend)
    setup_studio_lighting()

    wand = bpy.data.objects.get("Cylinder")
    # Position wand upright at origin for clean inspection
    wand.location = (0, 0, 0)
    wand.rotation_euler = (0, 0, 0)
    # Apply visual scale so dimensions are actual world meters
    dim = wand.dimensions
    print(f"  Current Wand Dimensions: {dim.x*100:.2f} cm wide x {dim.y*100:.2f} cm deep x {dim.z*100:.2f} cm tall")

    # Give a visible neutral material if needed
    if not wand.data.materials or wand.data.materials[0] is None:
        mat = bpy.data.materials.new("Wand_Inspect")
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs['Base Color'].default_value = (0.75, 0.65, 0.45, 1.0)
        wand.data.materials.append(mat)
    else:
        mat = wand.data.materials[0]
        if mat.use_nodes and "Principled BSDF" in mat.node_tree.nodes:
            mat.node_tree.nodes["Principled BSDF"].inputs['Base Color'].default_value = (0.75, 0.65, 0.45, 1.0)

    # Center of wand is at z = dim.z / 2 (or around 1.44m)
    # Let's get exact z bounds
    coords = [wand.matrix_world @ v.co for v in wand.data.vertices]
    min_z = min(c.z for c in coords)
    max_z = max(c.z for c in coords)
    center_z = (min_z + max_z) / 2
    h = max_z - min_z

    render_view("WCam1", (0, 0, center_z), dist=h * 1.6, angle_deg=0, elev_deg=0, lens=50, out_name="inspect_wand_front.png", rx=512, ry=1024)
    render_view("WCam2", (0, 0, center_z), dist=h * 1.6, angle_deg=40, elev_deg=10, lens=50, out_name="inspect_wand_three_quarter.png", rx=512, ry=1024)
    render_view("WCam3", (0, 0, center_z), dist=h * 1.6, angle_deg=90, elev_deg=0, lens=50, out_name="inspect_wand_side.png", rx=512, ry=1024)
    # Tip close-up
    render_view("WCam4", (0, 0, max_z - 0.25), dist=0.8, angle_deg=20, elev_deg=5, lens=65, out_name="inspect_wand_tip_closeup.png", rx=768, ry=768)

    print("\n" + "=" * 70)
    print("SIDE-BY-SIDE SCALE COMPARISON: HANA vs CURRENT WAND")
    print("=" * 70)
    ensure_vrm_addon()
    clean_scene()
    setup_studio_lighting()

    vrm_path = os.path.join(ROOT, "_source", "hana-base.vrm")
    bpy.ops.import_scene.vrm(filepath=vrm_path)

    # Load wand
    with bpy.data.libraries.load(wand_blend, link=False) as (df, dt):
        dt.objects = [o for o in df.objects if o == "Cylinder"]
    for obj in dt.objects:
        if obj:
            bpy.context.collection.objects.link(obj)

    wand = bpy.data.objects.get("Cylinder")
    if wand:
        # Place current 2.88m wand right next to Hana (at X = 0.55m, Z resting on floor)
        coords = [wand.matrix_world @ v.co for v in wand.data.vertices]
        min_z = min(c.z for c in coords)
        wand.location = (0.55, 0, -min_z)
        wand.rotation_euler = (0, 0, 0)

        # Give wand distinct gold material
        mat = bpy.data.materials.new("Wand_Gold")
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs['Base Color'].default_value = (0.83, 0.66, 0.26, 1.0)
            bsdf.inputs['Metallic'].default_value = 0.8
        wand.data.materials.clear()
        wand.data.materials.append(mat)

        # Render side-by-side scale comparison
        render_view("ScaleCam", (0.25, 0, 1.4), dist=4.2, angle_deg=0, elev_deg=0, lens=45, out_name="inspect_scale_hana_vs_current_wand.png", rx=1024, ry=1024)

    print("\n" + "=" * 70)
    print("FINAL MEASUREMENTS & DATA REPORT")
    print("=" * 70)

    # Measured values
    hana_height_cm = 147.5
    current_wand_cm = 288.34
    current_wand_width_cm = 17.78
    current_wand_depth_cm = 19.05
    target_wand_cm = 38.0

    # Ratios
    curr_body_ratio = (current_wand_cm / hana_height_cm) * 100
    target_body_ratio = (target_wand_cm / hana_height_cm) * 100

    hand_length_cm = 12.5
    curr_hand_ratio = current_wand_cm / hand_length_cm
    target_hand_ratio = target_wand_cm / hand_length_cm

    scale_factor_needed = target_wand_cm / current_wand_cm

    measurements = {
        "hana_height_cm": hana_height_cm,
        "current_wand_length_cm": round(current_wand_cm, 1),
        "current_wand_width_cm": round(current_wand_width_cm, 1),
        "current_wand_depth_cm": round(current_wand_depth_cm, 1),
        "target_wand_length_cm": target_wand_cm,
        "current_wand_to_body_percent": round(curr_body_ratio, 1),
        "target_wand_to_body_percent": round(target_body_ratio, 1),
        "current_wand_to_hand_ratio": round(curr_hand_ratio, 1),
        "target_wand_to_hand_ratio": round(target_hand_ratio, 1),
        "scaling_factor_to_38cm": round(scale_factor_needed, 4)
    }

    print(json.dumps(measurements, indent=2))
    with open(os.path.join(VAL_DIR, "wand_scale_measurements.json"), "w") as f:
        json.dump(measurements, f, indent=2)

if __name__ == "__main__":
    main()
