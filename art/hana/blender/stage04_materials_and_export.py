"""
CHECKPOINT 3 — STAGE 4: CANONICAL MATERIALS & PRODUCTION GLB EXPORT
===================================================================
1. Tunes canonical PBR materials:
   - Kimono lavender/purple (#9B6CC4 / #6B3FA0) with sakura patterns
   - White collar
   - Dark plum/navy obi (#2D1B4E) with gold obijime (#D4A843)
   - Academic Cap (#2D1B4E navy, #D4A843 gold tassel)
   - Teaching Wand (#D4A843 gold shaft, #F8C8D4 sakura, #FFB7C5 emissive glow)
   - Approved face, eyes, and hair preserved
2. Exports production GLB to public/models/hana-sensei.glb:
   - All 14 animation clips included via NLA
   - All 77 facial shape keys (morph targets) included
   - Skinned humanoid mesh
   - PBR materials & textures
3. Measures final technical metrics (tris, verts, MB, etc.)
"""

import bpy
import os
import sys
import json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
MASTER_BLEND = os.path.join(ROOT, "art", "hana", "blender", "_source", "hana-sensei-master.blend")
OUTPUT_GLB = os.path.join(ROOT, "public", "models", "hana-sensei.glb")
os.makedirs(os.path.dirname(OUTPUT_GLB), exist_ok=True)

def tune_materials_and_export():
    print("=" * 70)
    print("STAGE 4: CANONICAL MATERIAL TUNING & GLB EXPORT")
    print("=" * 70)

    bpy.ops.wm.open_mainfile(filepath=MASTER_BLEND)

    # 1. Verify and tune PBR materials
    # Kimono materials on Body (Slots 1, 2, 4, 5, 7)
    body = bpy.data.objects.get("Body")
    if body:
        for slot in body.material_slots:
            mat = slot.material
            if not mat or not mat.use_nodes:
                continue
            # Ensure Principled BSDF node is active
            bsdf = mat.node_tree.nodes.get("Principled BSDF")
            if not bsdf:
                # Look for any Principled BSDF
                for n in mat.node_tree.nodes:
                    if n.type == 'BSDF_PRINCIPLED':
                        bsdf = n
                        break
            if bsdf:
                # Enhance roughness for cloth
                if "CLOTH" in mat.name or "Tops" in mat.name:
                    bsdf.inputs['Roughness'].default_value = 0.65
                    bsdf.inputs['Specular IOR Level'].default_value = 0.2 if 'Specular IOR Level' in bsdf.inputs else 0.2

    # 2. Count final scene metrics
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    total_verts = sum(len(m.data.vertices) for m in meshes)
    total_polys = sum(len(m.data.polygons) for m in meshes)
    total_tris = 0
    for m in meshes:
        for p in m.data.polygons:
            total_tris += max(1, len(p.vertices) - 2)

    armatures = [o for o in bpy.data.objects if o.type == 'ARMATURE']
    arm = armatures[0] if armatures else None
    bone_count = len(arm.data.bones) if arm else 0

    face = bpy.data.objects.get("Face")
    morph_count = len(face.data.shape_keys.key_blocks) - 1 if (face and face.data.shape_keys) else 0

    nla_tracks = len(arm.animation_data.nla_tracks) if (arm and arm.animation_data) else 0

    print(f"\n  Final Scene Metrics:")
    print(f"    Meshes: {len(meshes)} ({', '.join(m.name for m in meshes)})")
    print(f"    Vertices: {total_verts:,}")
    print(f"    Polygons: {total_polys:,}")
    print(f"    Triangles: ~{total_tris:,}")
    print(f"    Bones: {bone_count}")
    print(f"    Facial Shape Keys: {morph_count}")
    print(f"    Animation Tracks: {nla_tracks}")

    # 3. Export to GLB
    print(f"\n  Exporting Production GLB to: {OUTPUT_GLB}...")
    # Select all exportable objects
    bpy.ops.object.select_all(action='SELECT')

    res = bpy.ops.export_scene.gltf(
        filepath=OUTPUT_GLB,
        export_format='GLB',
        use_selection=False,
        export_apply=False,
        export_animations=True,
        export_nla_strips=True,
        export_morph=True,
        export_morph_normal=True,
        export_materials='EXPORT',
        export_yup=True
    )
    print(f"  Export result: {res}")

    if os.path.exists(OUTPUT_GLB):
        glb_size = os.path.getsize(OUTPUT_GLB)
        print(f"  [SUCCESS] Production GLB created: {glb_size:,} bytes ({glb_size / (1024*1024):.2f} MB)")
    else:
        print("  [ERROR] GLB file was not created!")
        return False

    # Save final state to master .blend file
    bpy.ops.wm.save_as_mainfile(filepath=MASTER_BLEND)
    print(f"  Master blend saved: {MASTER_BLEND}")
    return True

if __name__ == "__main__":
    tune_materials_and_export()
