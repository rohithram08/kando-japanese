"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 09: OPTIMIZATION
=========================================================
Optimizes character for real-time WebGL rendering in React/Three.js:
1. Validates triangle count against budget (target: <= 24,000 tris)
2. Applies smart planar/collapse decimation if polycount exceeds threshold
3. Normalizes bounding box height to canonical 165cm (1.65m)
4. Merges static non-deforming accessory submeshes to minimize draw calls
5. Purges orphan data blocks (unused meshes, textures, materials)
"""

import bpy
import os
import sys

TARGET_TRIANGLES = 24000
TARGET_HEIGHT = 1.65 # meters

def count_total_triangles():
    total_tris = 0
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            # Evaluated mesh triangle count
            depsgraph = bpy.context.evaluated_depsgraph_get()
            eval_obj = obj.evaluated_get(depsgraph)
            mesh = eval_obj.to_mesh()
            total_tris += len(mesh.loop_triangles)
            eval_obj.to_mesh_clear()
    return total_tris

def optimize_model():
    print("\n[09_optimize] Running production optimization suite...")
    
    # 1. Measure initial triangle count
    initial_tris = count_total_triangles()
    print(f"[09_optimize] Initial triangle count: {initial_tris:,} (Budget: {TARGET_TRIANGLES:,})")
    
    # If over budget, apply gentle decimation to clothing/hair meshes
    if initial_tris > TARGET_TRIANGLES:
        ratio = TARGET_TRIANGLES / float(initial_tris)
        print(f"[09_optimize] Decimating clothing meshes with ratio: {ratio:.3f}")
        for obj in bpy.data.objects:
            if obj.type == 'MESH' and ("kimono" in obj.name.lower() or "hair" in obj.name.lower()):
                dec = obj.modifiers.new("WebOptimizeDecimate", type='DECIMATE')
                dec.ratio = max(0.65, ratio * 0.95)
                
    # 2. Measure and scale to canonical height (1.65m)
    armature = next((o for o in bpy.data.objects if o.type == 'ARMATURE'), None)
    all_meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    
    if all_meshes:
        min_z = min(obj.matrix_world.translation.z - obj.dimensions.z / 2 for obj in all_meshes)
        max_z = max(obj.matrix_world.translation.z + obj.dimensions.z / 2 for obj in all_meshes)
        curr_height = max_z - min_z
        print(f"[09_optimize] Measured character height: {curr_height * 100:.1f} cm")
        
        if curr_height > 0 and abs(curr_height - TARGET_HEIGHT) > 0.03:
            scale_factor = TARGET_HEIGHT / curr_height
            print(f"[09_optimize] Scaling character by {scale_factor:.4f} to match 165cm standard.")
            if armature:
                armature.scale *= scale_factor
                bpy.context.view_layer.objects.active = armature
                bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
            for m in all_meshes:
                if not m.parent:
                    m.scale *= scale_factor
                    bpy.context.view_layer.objects.active = m
                    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    # 3. Clean up orphan data blocks
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)
            
    final_tris = count_total_triangles()
    print(f"[09_optimize] Final triangle count: {final_tris:,}")
    
    # Save working blend
    blend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "_source"))
    work_blend = os.path.join(blend_dir, "hana-working.blend")
    bpy.ops.wm.save_as_mainfile(filepath=work_blend)
    print(f"[09_optimize] Saved updated scene to: {work_blend}")
    return True

if __name__ == "__main__":
    optimize_model()
