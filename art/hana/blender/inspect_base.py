"""
HANA-SENSEI — BASE ASSET INSPECTOR
===================================
Inspects a provided VRM/GLB base asset WITHOUT modifying it.
Generates a detailed report and comparison renders.

Usage:
  blender --background --python art/hana/blender/inspect_base.py

Looks for:
  _source/hana-base.vrm  (primary)
  _source/hana-base.glb  (fallback)
"""

import bpy
import os
import sys
import math
import json

def find_base_asset():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    for name in ["hana-base.vrm", "hana-base.glb"]:
        path = os.path.join(root, "_source", name)
        if os.path.exists(path):
            return path
    return None

def inspect_base():
    asset_path = find_base_asset()
    if not asset_path:
        print("=" * 70)
        print("NO BASE ASSET FOUND.")
        print("Place your exported VRM at: _source/hana-base.vrm")
        print("=" * 70)
        return None

    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    val_dir = os.path.join(root, "art", "hana", "validation")
    os.makedirs(val_dir, exist_ok=True)

    file_size = os.path.getsize(asset_path)
    ext = os.path.splitext(asset_path)[1].lower()

    print("=" * 70)
    print(f"INSPECTING BASE ASSET: {os.path.basename(asset_path)}")
    print(f"  Path: {asset_path}")
    print(f"  Size: {file_size:,} bytes ({file_size / (1024*1024):.2f} MB)")
    print(f"  Format: {ext}")
    print("=" * 70)

    # Import into clean scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    if ext == ".vrm":
        result = bpy.ops.import_scene.vrm(filepath=asset_path)
    else:
        result = bpy.ops.import_scene.gltf(filepath=asset_path)

    report = {
        "file": os.path.basename(asset_path),
        "size_bytes": file_size,
        "size_mb": round(file_size / (1024*1024), 2),
        "format": ext,
        "import_result": str(result),
    }

    # === MESHES ===
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
    report["total_triangles"] = total_tris
    report["mesh_names"] = [m.name for m in meshes]

    print(f"\n  Meshes: {len(meshes)}")
    for m in meshes:
        v = len(m.data.vertices)
        p = len(m.data.polygons)
        mat_count = len(m.data.materials)
        print(f"    - {m.name}: {v:,} verts, {p:,} polys, {mat_count} materials")
    print(f"  Total: {total_verts:,} verts, {total_polys:,} polys, ~{total_tris:,} tris")

    # === ARMATURE ===
    armatures = [o for o in bpy.data.objects if o.type == 'ARMATURE']
    if armatures:
        arm = armatures[0]
        bones = list(arm.data.bones)
        report["armature_name"] = arm.name
        report["bone_count"] = len(bones)
        report["bone_names"] = [b.name for b in bones]
        print(f"\n  Armature: {arm.name} ({len(bones)} bones)")

        # Check for key humanoid bones
        key_bones = ["hips", "spine", "chest", "neck", "head",
                      "J_Bip_C_Hips", "J_Bip_C_Spine", "J_Bip_C_Chest",
                      "J_Bip_C_Neck", "J_Bip_C_Head"]
        found_key = [b for b in key_bones if any(bn.name == b for bn in bones)]
        report["humanoid_bones_found"] = found_key
        print(f"  Humanoid bones detected: {len(found_key)} ({', '.join(found_key[:8])}...)")
    else:
        report["armature_name"] = None
        report["bone_count"] = 0
        print("\n  WARNING: No armature/skeleton found!")

    # === SHAPE KEYS / BLENDSHAPES ===
    all_shape_keys = {}
    for m in meshes:
        if m.data.shape_keys:
            keys = [k.name for k in m.data.shape_keys.key_blocks if k.name != "Basis"]
            if keys:
                all_shape_keys[m.name] = keys

    total_morphs = sum(len(v) for v in all_shape_keys.values())
    report["shape_key_count"] = total_morphs
    report["shape_keys"] = all_shape_keys
    print(f"\n  Shape Keys (Blendshapes): {total_morphs} total")
    for mesh_name, keys in all_shape_keys.items():
        print(f"    {mesh_name}: {len(keys)} keys")
        for k in keys[:10]:
            print(f"      - {k}")
        if len(keys) > 10:
            print(f"      ... and {len(keys) - 10} more")

    # === MATERIALS ===
    materials = list(bpy.data.materials)
    report["material_count"] = len(materials)
    report["material_names"] = [mat.name for mat in materials]
    print(f"\n  Materials: {len(materials)}")
    for mat in materials:
        print(f"    - {mat.name}")

    # === BOUNDING BOX / SCALE ===
    if meshes:
        all_min_z = float('inf')
        all_max_z = float('-inf')
        for m in meshes:
            for v in m.data.vertices:
                world_co = m.matrix_world @ v.co
                all_min_z = min(all_min_z, world_co.z)
                all_max_z = max(all_max_z, world_co.z)
        height_m = all_max_z - all_min_z
        report["height_meters"] = round(height_m, 4)
        report["height_cm"] = round(height_m * 100, 1)
        print(f"\n  Character Height: {height_m * 100:.1f} cm")

    # === RENDER 3 COMPARISON VIEWS ===
    print("\n  Rendering comparison views...")

    # Camera
    cam_data = bpy.data.cameras.new("InspCam")
    cam_data.lens = 70
    cam_obj = bpy.data.objects.new("InspCam", cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj

    # Light
    sun = bpy.data.lights.new("InspSun", type='SUN')
    sun.energy = 3.0
    sun_obj = bpy.data.objects.new("InspSun", sun)
    bpy.context.collection.objects.link(sun_obj)
    sun_obj.rotation_euler = (math.radians(50), math.radians(20), 0)

    # Fill light
    fill = bpy.data.lights.new("InspFill", type='AREA')
    fill.energy = 20.0
    fill.size = 2.0
    fill_obj = bpy.data.objects.new("InspFill", fill)
    bpy.context.collection.objects.link(fill_obj)
    fill_obj.location = (-1.5, -1.0, 1.2)
    fill_obj.rotation_euler = (math.radians(70), math.radians(-30), math.radians(20))

    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
    scene.render.resolution_x = 768
    scene.render.resolution_y = 1024

    # World background
    world = bpy.data.worlds.new("InspWorld")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.88, 0.84, 0.92, 1.0)
    bg.inputs['Strength'].default_value = 0.6

    # Calculate center of character
    center_z = (all_min_z + all_max_z) / 2 if meshes else 0.8
    cam_height = center_z

    views = [
        ("base_front", 0),
        ("base_three_quarter", 45),
        ("base_side", 90),
    ]

    render_paths = []
    for name, deg in views:
        rad = math.radians(deg)
        dist = 2.8
        cam_obj.location = (dist * math.sin(rad), -dist * math.cos(rad), cam_height)
        # Point camera at center
        direction = bpy.data.objects.new("_tmp_target", None)
        direction.location = (0, 0, cam_height)
        bpy.context.collection.objects.link(direction)

        constraint = cam_obj.constraints.new(type='TRACK_TO')
        constraint.target = direction
        constraint.track_axis = 'TRACK_NEGATIVE_Z'
        constraint.up_axis = 'UP_Y'

        out_path = os.path.join(val_dir, f"hana_{name}.png")
        scene.render.filepath = out_path
        bpy.ops.render.render(write_still=True)
        render_paths.append(out_path)
        print(f"    ✓ {name} → {out_path}")

        cam_obj.constraints.remove(constraint)
        bpy.data.objects.remove(direction)

    report["render_paths"] = render_paths

    # === WRITE JSON REPORT ===
    report_json_path = os.path.join(val_dir, "base_inspection.json")
    with open(report_json_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"\n  Report JSON: {report_json_path}")

    # === SUMMARY ===
    print("\n" + "=" * 70)
    print("BASE ASSET INSPECTION SUMMARY")
    print("=" * 70)
    has_mesh = len(meshes) > 0
    has_arm = len(armatures) > 0
    has_morphs = total_morphs > 0
    has_face = any("face" in m.name.lower() or "head" in m.name.lower() for m in meshes)
    has_hair = any("hair" in m.name.lower() for m in meshes)
    has_eye = any("eye" in m.name.lower() for m in meshes)

    checks = [
        ("Valid import", result == {'FINISHED'}),
        ("Mesh geometry exists", has_mesh),
        ("Armature/skeleton exists", has_arm),
        ("Face/head mesh exists", has_face),
        ("Hair mesh exists", has_hair),
        ("Eye mesh exists", has_eye),
        ("Blendshapes present", has_morphs),
        (f"Triangles reasonable (<100k)", total_tris < 100000),
    ]

    all_pass = True
    for label, passed in checks:
        status = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_pass = False
        print(f"  [{status}] {label}")

    print("=" * 70)
    if all_pass:
        print("  RESULT: BASE ASSET ACCEPTABLE — Ready for visual comparison")
    else:
        print("  RESULT: BASE ASSET HAS ISSUES — Review failures above")
    print("=" * 70)

    return report

if __name__ == "__main__":
    inspect_base()
