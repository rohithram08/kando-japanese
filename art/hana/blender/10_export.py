"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 10: GLB & BLEND EXPORT
================================================================
Exports the certified production assets:
1. Master Blender source file: _source/hana-sensei-master.blend
2. WebGL production runtime file: public/models/hana-sensei.glb

Configures strict glTF 2.0 export flags:
- Embeds all 14 NLA animation clips
- Preserves all 18 facial morph target shape keys
- Exports PBR materials and armature hierarchies
"""

import bpy
import os
import sys

def export_final_assets():
    print("\n[10_export] Starting production asset export...")
    
    workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    source_dir = os.path.join(workspace_root, "_source")
    models_dir = os.path.join(workspace_root, "public", "models")
    
    os.makedirs(source_dir, exist_ok=True)
    os.makedirs(models_dir, exist_ok=True)
    
    master_blend_path = os.path.join(source_dir, "hana-sensei-master.blend")
    final_glb_path = os.path.join(models_dir, "hana-sensei.glb")
    
    # 1. Save master .blend source file
    bpy.ops.wm.save_as_mainfile(filepath=master_blend_path)
    print(f"[10_export] Master Blender source preserved: {master_blend_path}")
    
    # 2. Export production GLB
    print(f"[10_export] Exporting production GLB to: {final_glb_path}")
    
    # Deselect all, select character objects
    bpy.ops.object.select_all(action='SELECT')
    
    bpy.ops.export_scene.gltf(
        filepath=final_glb_path,
        export_format='GLB',
        use_selection=False,
        export_apply=False, # Must be False to preserve armature skinning & morph targets!
        export_animations=True,
        export_nla_strips=True,
        export_frame_range=False,
        export_current_frame=False,
        export_morph=True,
        export_morph_normal=True,
        export_morph_tangent=False,
        export_def_bones=True,
        export_materials='EXPORT',
        export_image_format='AUTO',
        export_colors=True
    )
    
    if os.path.exists(final_glb_path):
        size_bytes = os.path.getsize(final_glb_path)
        print(f"[10_export] GLB export completed successfully: {size_bytes:,} bytes ({size_bytes / (1024*1024):.2f} MB)")
        return True
    else:
        print("[10_export] ERROR: GLB file was not created!")
        return False

if __name__ == "__main__":
    export_final_assets()
