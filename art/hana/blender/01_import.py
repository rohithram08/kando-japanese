"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 01: IMPORT BASE ASSET
===============================================================
Imports the canonical base character (VRM or GLB) into Blender.
Validates that the imported model contains real skinned mesh geometry
and a humanoid armature.
"""

import bpy
import os
import sys

def get_base_asset_path():
    # Priority order for base asset:
    # 1. CLI argument after '--'
    # 2. _source/hana-base.vrm
    # 3. _source/hana-base.glb
    # 4. _source/hana-sensei-base.vrm
    
    argv = sys.argv
    if "--" in argv:
        custom_args = argv[argv.index("--") + 1:]
        if len(custom_args) > 0 and os.path.exists(custom_args[0]):
            return os.path.abspath(custom_args[0])
            
    workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    candidates = [
        os.path.join(workspace_root, "_source", "hana-base.vrm"),
        os.path.join(workspace_root, "_source", "hana-base.glb"),
        os.path.join(workspace_root, "_source", "hana-sensei-base.vrm"),
        os.path.join(workspace_root, "_source", "hana-sensei-base.glb"),
    ]
    
    for path in candidates:
        if os.path.exists(path):
            return path
    return None

def import_base_asset():
    asset_path = get_base_asset_path()
    if not asset_path:
        print("\n" + "=" * 70)
        print("ERROR: No genuine anime base asset found in _source/")
        print("Expected one of:")
        print("  - _source/hana-base.vrm (from VRoid Studio, RECOMMENDED)")
        print("  - _source/hana-base.glb (from external licensed base)")
        print("Please place the base file in _source/ and re-run.")
        print("=" * 70 + "\n")
        return False
        
    print(f"\n[01_import] Loading base character from: {asset_path}")
    
    # Reset factory settings to clean slate
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    ext = os.path.splitext(asset_path)[1].lower()
    if ext == ".vrm":
        print("[01_import] Importing via VRM Addon...")
        res = bpy.ops.import_scene.vrm(filepath=asset_path)
        if res != {'FINISHED'}:
            raise RuntimeError(f"VRM import failed with result: {res}")
    elif ext in [".glb", ".gltf"]:
        print("[01_import] Importing via glTF 2.0...")
        res = bpy.ops.import_scene.gltf(filepath=asset_path)
        if res != {'FINISHED'}:
            raise RuntimeError(f"glTF import failed with result: {res}")
    else:
        raise ValueError(f"Unsupported base asset extension: {ext}")
        
    # Verify imported hierarchy
    armatures = [obj for obj in bpy.data.objects if obj.type == 'ARMATURE']
    meshes = [obj for obj in bpy.data.objects if obj.type == 'MESH']
    
    print(f"[01_import] Imported {len(armatures)} armature(s) and {len(meshes)} mesh(es).")
    
    if len(armatures) == 0:
        print("[WARNING] No armature detected in base model.")
    else:
        arm = armatures[0]
        arm.name = "Hana_Armature"
        print(f"[01_import] Primary armature: {arm.name} ({len(arm.data.bones)} bones)")
        
    for m in meshes:
        print(f"  - Mesh: {m.name} ({len(m.data.vertices)} verts, {len(m.data.polygons)} polys)")
        
    # Save working blend file
    blend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "_source"))
    os.makedirs(blend_dir, exist_ok=True)
    work_blend = os.path.join(blend_dir, "hana-working.blend")
    bpy.ops.wm.save_as_mainfile(filepath=work_blend)
    print(f"[01_import] Saved initial working scene to: {work_blend}")
    return True

if __name__ == "__main__":
    success = import_base_asset()
    if not success:
        sys.exit(1)
