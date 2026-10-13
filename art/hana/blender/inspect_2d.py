"""
CHECKPOINT 2D — COMPREHENSIVE BASE + WAND ASSET INSPECTION
==========================================================
Non-destructive inspection of:
1. _source/hana-base.vrm (owner-created VRoid character)
2. _source/Staff - Harry Potter.blend (wand source)

Renders comparison views, measures technical specs, writes report.
Does NOT modify any source files.
"""

import bpy
import os
import sys
import math
import json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
VAL_DIR = os.path.join(ROOT, "art", "hana", "validation")
os.makedirs(VAL_DIR, exist_ok=True)

BLENDER_EXE = bpy.app.binary_path

def setup_studio_lighting():
    """Three-point portrait lighting for inspection renders."""
    # Key light
    key = bpy.data.lights.new("Key", type='AREA')
    key.energy = 50.0
    key.size = 1.5
    key_obj = bpy.data.objects.new("Key", key)
    bpy.context.collection.objects.link(key_obj)
    key_obj.location = (1.2, -1.8, 2.5)
    key_obj.rotation_euler = (math.radians(55), math.radians(15), math.radians(-25))

    # Fill light
    fill = bpy.data.lights.new("Fill", type='AREA')
    fill.energy = 25.0
    fill.color = (0.95, 0.90, 0.98)
    fill.size = 2.0
    fill_obj = bpy.data.objects.new("Fill", fill)
    bpy.context.collection.objects.link(fill_obj)
    fill_obj.location = (-1.5, -1.2, 1.5)
    fill_obj.rotation_euler = (math.radians(65), math.radians(-20), math.radians(30))

    # Rim light
    rim = bpy.data.lights.new("Rim", type='SPOT')
    rim.energy = 120.0
    rim.spot_size = math.radians(50)
    rim_obj = bpy.data.objects.new("Rim", rim)
    bpy.context.collection.objects.link(rim_obj)
    rim_obj.location = (0, 1.5, 2.8)
    rim_obj.rotation_euler = (math.radians(-140), 0, 0)

    # World background
    world = bpy.data.worlds.new("InspWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.90, 0.86, 0.93, 1.0)
    bg.inputs['Strength'].default_value = 0.5

def setup_camera(lens=70):
    cam_data = bpy.data.cameras.new("InspCam")
    cam_data.lens = lens
    cam_obj = bpy.data.objects.new("InspCam", cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj
    return cam_obj

def render_view(cam_obj, name, center_z, dist, angle_deg, res_x=768, res_y=1024):
    rad = math.radians(angle_deg)
    cam_obj.location = (dist * math.sin(rad), -dist * math.cos(rad), center_z)

    # Track to center
    target = bpy.data.objects.new("_trk", None)
    target.location = (0, 0, center_z)
    bpy.context.collection.objects.link(target)
    con = cam_obj.constraints.new(type='TRACK_TO')
    con.target = target
    con.track_axis = 'TRACK_NEGATIVE_Z'
    con.up_axis = 'UP_Y'

    scene = bpy.context.scene
    scene.render.resolution_x = res_x
    scene.render.resolution_y = res_y
    out = os.path.join(VAL_DIR, f"inspect_{name}.png")
    scene.render.filepath = out
    bpy.ops.render.render(write_still=True)

    cam_obj.constraints.remove(con)
    bpy.data.objects.remove(target)
    print(f"    [Render] {name} -> {out}")
    return out

def measure_bounds(meshes):
    min_z = float('inf')
    max_z = float('-inf')
    min_x = float('inf')
    max_x = float('-inf')
    for m in meshes:
        for v in m.data.vertices:
            wc = m.matrix_world @ v.co
            min_z = min(min_z, wc.z)
            max_z = max(max_z, wc.z)
            min_x = min(min_x, wc.x)
            max_x = max(max_x, wc.x)
    return min_z, max_z, min_x, max_x

def ensure_vrm_addon():
    import addon_utils
    try:
        bpy.ops.preferences.addon_enable(module='bl_ext.user_default.vrm')
    except Exception as e:
        print("Addon enable exception:", e)
    for mod in addon_utils.modules():
        if 'vrm' in mod.__name__.lower():
            try:
                bpy.ops.preferences.addon_enable(module=mod.__name__)
            except Exception:
                pass
    print("VRM import operator available:", hasattr(bpy.ops.import_scene, 'vrm'))

def clean_scene():
    """Clean all objects, meshes, materials, collections, but preserve addons and engine settings."""
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

# ====================================================================
# PHASE 1 & 2: HANA VRM INSPECTION
# ====================================================================
def inspect_hana():
    vrm_path = os.path.join(ROOT, "_source", "hana-base.vrm")
    if not os.path.exists(vrm_path):
        print("ERROR: hana-base.vrm not found!")
        return None

    file_size = os.path.getsize(vrm_path)
    print("=" * 70)
    print("PHASE 1: HANA VRM TECHNICAL INSPECTION")
    print("=" * 70)
    print(f"  File: {vrm_path}")
    print(f"  Size: {file_size:,} bytes ({file_size / (1024*1024):.2f} MB)")

    ensure_vrm_addon()
    clean_scene()
    result = bpy.ops.import_scene.vrm(filepath=vrm_path)
    print(f"  Import result: {result}")

    if result != {'FINISHED'}:
        print("  CRITICAL: VRM import FAILED!")
        return {"status": "FAILED", "error": "VRM import failed"}

    report = {
        "file": "hana-base.vrm",
        "size_bytes": file_size,
        "size_mb": round(file_size / (1024*1024), 2),
        "import_success": True,
    }

    # Meshes
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    total_verts = sum(len(m.data.vertices) for m in meshes)
    total_polys = sum(len(m.data.polygons) for m in meshes)
    total_tris = 0
    for m in meshes:
        for p in m.data.polygons:
            total_tris += max(1, len(p.vertices) - 2)

    report["mesh_count"] = len(meshes)
    report["total_vertices"] = total_verts
    report["total_polygons"] = total_polys
    report["total_triangles_approx"] = total_tris

    print(f"\n  Meshes ({len(meshes)}):")
    for m in meshes:
        v = len(m.data.vertices)
        p = len(m.data.polygons)
        mats = len(m.data.materials)
        has_sk = "Yes" if m.data.shape_keys else "No"
        print(f"    {m.name}: {v:,} verts, {p:,} polys, {mats} mats, shape_keys={has_sk}")
    print(f"  Totals: {total_verts:,} verts, {total_polys:,} polys, ~{total_tris:,} tris")

    # Armature
    armatures = [o for o in bpy.data.objects if o.type == 'ARMATURE']
    if armatures:
        arm = armatures[0]
        bones = list(arm.data.bones)
        report["armature_name"] = arm.name
        report["bone_count"] = len(bones)
        report["bone_names"] = [b.name for b in bones]

        print(f"\n  Armature: {arm.name} ({len(bones)} bones)")
        # Show first 25 bones
        for b in bones[:25]:
            parent = b.parent.name if b.parent else "ROOT"
            print(f"    {b.name} (parent: {parent})")
        if len(bones) > 25:
            print(f"    ... and {len(bones) - 25} more bones")

        # Check key humanoid bones (VRoid naming)
        key_bones_vrm = [
            "J_Bip_C_Hips", "J_Bip_C_Spine", "J_Bip_C_Chest",
            "J_Bip_C_Neck", "J_Bip_C_Head",
            "J_Bip_L_UpperArm", "J_Bip_R_UpperArm",
            "J_Bip_L_Hand", "J_Bip_R_Hand",
            "J_Bip_L_UpperLeg", "J_Bip_R_UpperLeg",
        ]
        found = [b for b in key_bones_vrm if b in [bn.name for bn in bones]]
        report["humanoid_bones_found"] = found
        print(f"  Humanoid bones verified: {len(found)}/{len(key_bones_vrm)}")
    else:
        report["armature_name"] = None
        report["bone_count"] = 0
        print("\n  WARNING: No armature found!")

    # Materials
    materials = list(bpy.data.materials)
    report["material_count"] = len(materials)
    report["material_names"] = [m.name for m in materials]
    print(f"\n  Materials ({len(materials)}):")
    for mat in materials:
        print(f"    {mat.name}")

    # Textures / Images
    images = list(bpy.data.images)
    report["image_count"] = len(images)
    report["image_names"] = [img.name for img in images]
    print(f"\n  Images/Textures ({len(images)}):")
    for img in images:
        w, h = img.size[0], img.size[1]
        print(f"    {img.name}: {w}x{h}")

    # Shape Keys / Blendshapes
    all_sk = {}
    for m in meshes:
        if m.data.shape_keys:
            keys = [k.name for k in m.data.shape_keys.key_blocks if k.name != "Basis"]
            if keys:
                all_sk[m.name] = keys

    total_morphs = sum(len(v) for v in all_sk.values())
    report["shape_key_count"] = total_morphs
    report["shape_keys_by_mesh"] = all_sk
    print(f"\n  Shape Keys / Blendshapes ({total_morphs} total):")
    for mesh_name, keys in all_sk.items():
        print(f"    {mesh_name}: {len(keys)} keys")
        for k in keys[:15]:
            print(f"      - {k}")
        if len(keys) > 15:
            print(f"      ... and {len(keys) - 15} more")

    # Animations
    actions = list(bpy.data.actions)
    report["action_count"] = len(actions)
    report["action_names"] = [a.name for a in actions]
    print(f"\n  Animations/Actions ({len(actions)}):")
    for a in actions:
        print(f"    {a.name}: {len(a.fcurves)} fcurves, frame_range={a.frame_range[:]}")

    # Bounding box / Height
    if meshes:
        min_z, max_z, min_x, max_x = measure_bounds(meshes)
        height_m = max_z - min_z
        width_m = max_x - min_x
        report["height_m"] = round(height_m, 4)
        report["height_cm"] = round(height_m * 100, 1)
        report["width_m"] = round(width_m, 4)
        center_z = (min_z + max_z) / 2
        print(f"\n  Height: {height_m * 100:.1f} cm")
        print(f"  Width:  {width_m * 100:.1f} cm")
    else:
        center_z = 0.8
        report["height_cm"] = 0

    # PHASE 2: VISUAL INSPECTION RENDERS
    print("\n" + "=" * 70)
    print("PHASE 2: HANA VISUAL INSPECTION RENDERS")
    print("=" * 70)

    setup_studio_lighting()
    cam = setup_camera(lens=70)
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE_NEXT'

    hana_renders = []

    # Full body views
    views = [
        ("hana_front", center_z, 2.6, 0, 768, 1024),
        ("hana_three_quarter", center_z, 2.6, 40, 768, 1024),
        ("hana_side", center_z, 2.6, 90, 768, 1024),
        ("hana_back", center_z, 2.6, 180, 768, 1024),
    ]
    for name, cz, dist, ang, rx, ry in views:
        p = render_view(cam, name, cz, dist, ang, rx, ry)
        hana_renders.append(p)

    # Close-up face
    face_z = max_z - height_m * 0.12 if meshes else 1.5
    p = render_view(cam, "hana_face_closeup", face_z, 0.6, 5, 768, 768)
    hana_renders.append(p)

    # Close-up eyes
    p = render_view(cam, "hana_eyes_closeup", face_z, 0.35, 0, 768, 512)
    hana_renders.append(p)

    # Hair view (3/4 from slightly above)
    hair_z = max_z - height_m * 0.08 if meshes else 1.55
    cam.data.lens = 55
    p = render_view(cam, "hana_hair_view", hair_z, 1.2, 130, 768, 768)
    hana_renders.append(p)
    cam.data.lens = 70

    # Hands close-up (front low angle)
    hand_z = center_z - height_m * 0.15 if meshes else 0.7
    p = render_view(cam, "hana_hands_closeup", hand_z, 1.0, 20, 768, 512)
    hana_renders.append(p)

    report["render_paths"] = hana_renders

    # Save Hana report JSON
    report_path = os.path.join(VAL_DIR, "hana_base_inspection.json")
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"\n  Report saved: {report_path}")

    return report

# ====================================================================
# PHASE 3: WAND SOURCE INSPECTION
# ====================================================================
def inspect_wand():
    print("\n" + "=" * 70)
    print("PHASE 3: WAND SOURCE INSPECTION")
    print("=" * 70)

    source_dir = os.path.join(ROOT, "_source")
    wand_files = {}
    for f in os.listdir(source_dir):
        if f.startswith("Staff - Harry Potter"):
            ext = os.path.splitext(f)[1].lower()
            full = os.path.join(source_dir, f)
            size = os.path.getsize(full)
            wand_files[ext] = {"name": f, "path": full, "size": size}
            print(f"  Found: {f} ({size:,} bytes, {ext})")

    if not wand_files:
        print("  WARNING: No wand source files found!")
        return None

    # Best import format priority: .blend > .fbx > .obj > .dae > .3ds
    import_priority = [".blend", ".fbx", ".obj", ".dae", ".3ds"]
    chosen_ext = None
    for ext in import_priority:
        if ext in wand_files:
            chosen_ext = ext
            break

    if not chosen_ext:
        print("  WARNING: No importable wand format found!")
        return None

    chosen = wand_files[chosen_ext]
    print(f"\n  Selected for import: {chosen['name']} ({chosen_ext})")

    # Import wand into clean scene
    clean_scene()

    if chosen_ext == ".blend":
        # Append all objects from the .blend file
        with bpy.data.libraries.load(chosen['path'], link=False) as (data_from, data_to):
            data_to.objects = data_from.objects
        for obj in data_to.objects:
            if obj is not None:
                bpy.context.collection.objects.link(obj)
        result = "APPENDED"
    elif chosen_ext == ".fbx":
        result = bpy.ops.import_scene.fbx(filepath=chosen['path'])
    elif chosen_ext == ".obj":
        result = bpy.ops.wm.obj_import(filepath=chosen['path'])
    elif chosen_ext == ".dae":
        result = bpy.ops.wm.collada_import(filepath=chosen['path'])
    else:
        print(f"  Cannot import {chosen_ext}")
        return None

    print(f"  Import result: {result}")

    wand_report = {
        "files_found": {k: {"name": v["name"], "size": v["size"]} for k, v in wand_files.items()},
        "imported_format": chosen_ext,
        "imported_file": chosen['name'],
    }

    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    total_verts = sum(len(m.data.vertices) for m in meshes)
    total_polys = sum(len(m.data.polygons) for m in meshes)
    total_tris = 0
    for m in meshes:
        for p in m.data.polygons:
            total_tris += max(1, len(p.vertices) - 2)

    wand_report["mesh_count"] = len(meshes)
    wand_report["total_vertices"] = total_verts
    wand_report["total_polygons"] = total_polys
    wand_report["total_triangles"] = total_tris

    print(f"\n  Meshes ({len(meshes)}):")
    for m in meshes:
        v = len(m.data.vertices)
        p = len(m.data.polygons)
        dim = m.dimensions
        print(f"    {m.name}: {v:,} verts, {p:,} polys, dimensions={dim.x:.4f} x {dim.y:.4f} x {dim.z:.4f} m")
    print(f"  Totals: {total_verts:,} verts, {total_polys:,} polys, ~{total_tris:,} tris")

    # Materials
    materials = list(bpy.data.materials)
    wand_report["material_count"] = len(materials)
    wand_report["material_names"] = [m.name for m in materials]
    print(f"\n  Materials ({len(materials)}):")
    for mat in materials:
        print(f"    {mat.name}")

    # Measure wand bounds
    if meshes:
        all_objects = [o for o in bpy.data.objects if o.type == 'MESH' or o.type == 'EMPTY']
        min_z = float('inf')
        max_z = float('-inf')
        for m in meshes:
            for v in m.data.vertices:
                wc = m.matrix_world @ v.co
                min_z = min(min_z, wc.z)
                max_z = max(max_z, wc.z)
        wand_height = max_z - min_z
        wand_report["height_m"] = round(wand_height, 4)
        wand_report["height_cm"] = round(wand_height * 100, 1)
        center_z = (min_z + max_z) / 2
        print(f"\n  Wand height: {wand_height * 100:.1f} cm")

    # Object hierarchy
    print(f"\n  Object hierarchy:")
    for obj in bpy.data.objects:
        parent_name = obj.parent.name if obj.parent else "ROOT"
        print(f"    {obj.type}: {obj.name} (parent: {parent_name})")

    # Render wand views
    print("\n  Rendering wand inspection views...")
    setup_studio_lighting()
    cam = setup_camera(lens=50)
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE_NEXT'

    wand_renders = []
    wand_center = center_z if meshes else 0

    wand_views = [
        ("wand_front", wand_center, 0.8, 0, 512, 1024),
        ("wand_three_quarter", wand_center, 0.8, 40, 512, 1024),
        ("wand_side", wand_center, 0.8, 90, 512, 1024),
        ("wand_closeup", wand_center, 0.4, 15, 768, 768),
    ]
    for name, cz, dist, ang, rx, ry in wand_views:
        p = render_view(cam, name, cz, dist, ang, rx, ry)
        wand_renders.append(p)

    wand_report["render_paths"] = wand_renders

    # Save wand report JSON
    report_path = os.path.join(VAL_DIR, "wand_inspection.json")
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(wand_report, f, indent=2, ensure_ascii=False)
    print(f"\n  Report saved: {report_path}")

    return wand_report

# ====================================================================
# MAIN
# ====================================================================
if __name__ == "__main__":
    print("\n" + "#" * 70)
    print("# CHECKPOINT 2D: HANA BASE + WAND ASSET INSPECTION")
    print("#" * 70)

    hana_report = inspect_hana()
    wand_report = inspect_wand()

    print("\n" + "=" * 70)
    print("INSPECTION COMPLETE")
    print("=" * 70)
    if hana_report:
        print(f"  Hana: {hana_report.get('mesh_count', 0)} meshes, "
              f"{hana_report.get('bone_count', 0)} bones, "
              f"{hana_report.get('shape_key_count', 0)} morphs, "
              f"{hana_report.get('height_cm', 0)} cm")
    if wand_report:
        print(f"  Wand: {wand_report.get('mesh_count', 0)} meshes, "
              f"{wand_report.get('total_triangles', 0)} tris, "
              f"{wand_report.get('height_cm', 0)} cm")
