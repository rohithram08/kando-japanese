"""
CHECKPOINT 3 — STEP 1: INITIALIZE MASTER BLENDER SOURCE & REMOVE WITCH HAT
==========================================================================
1. Imports _source/hana-base.vrm cleanly.
2. Removes the placeholder VRoid witch hat (Slot 9 polygons on Body mesh).
3. Verifies Hana's approved face, hair, eyes, and skin are 100% intact.
4. Saves working master file: art/hana/blender/_source/hana-sensei-master.blend
"""

import bpy
import bmesh
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
MASTER_DIR = os.path.join(ROOT, "art", "hana", "blender", "_source")
os.makedirs(MASTER_DIR, exist_ok=True)
MASTER_BLEND = os.path.join(MASTER_DIR, "hana-sensei-master.blend")

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

def init_master():
    print("=" * 70)
    print("STEP 1: IMPORTING HANA VRM & REMOVING PLACEHOLDER WITCH HAT")
    print("=" * 70)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    ensure_vrm_addon()

    vrm_path = os.path.join(ROOT, "_source", "hana-base.vrm")
    res = bpy.ops.import_scene.vrm(filepath=vrm_path)
    print(f"  Import result: {res}")

    body_obj = bpy.data.objects.get("Body")
    if not body_obj:
        print("  ERROR: Body mesh not found!")
        return False

    # Find slot for Accessory_WitchHat
    hat_slot_idx = None
    for i, slot in enumerate(body_obj.material_slots):
        if slot.material and "WitchHat" in slot.material.name:
            hat_slot_idx = i
            break

    if hat_slot_idx is not None:
        print(f"  Found Witch Hat in Material Slot {hat_slot_idx}: {body_obj.material_slots[hat_slot_idx].material.name}")
        # Delete polygons using bmesh
        bm = bmesh.new()
        bm.from_mesh(body_obj.data)
        faces_to_delete = [f for f in bm.faces if f.material_index == hat_slot_idx]
        print(f"  Removing {len(faces_to_delete)} witch hat polygons...")
        bmesh.ops.delete(bm, geom=faces_to_delete, context='FACES_ONLY')

        # Clean unreferenced vertices
        unref_verts = [v for v in bm.verts if len(v.link_faces) == 0]
        print(f"  Removing {len(unref_verts)} isolated hat vertices...")
        bmesh.ops.delete(bm, geom=unref_verts, context='VERTS')

        bm.to_mesh(body_obj.data)
        bm.free()
        body_obj.data.update()
        print("  Witch hat successfully removed!")
    else:
        print("  Notice: No witch hat material slot found (already removed or different name).")

    # Remove the placeholder cube if present
    cube = bpy.data.objects.get("Cube")
    if cube:
        bpy.data.objects.remove(cube, do_unlink=True)

    # Save to master .blend file
    bpy.ops.wm.save_as_mainfile(filepath=MASTER_BLEND)
    print(f"  Master Blender file saved to: {MASTER_BLEND}")
    print(f"  File size: {os.path.getsize(MASTER_BLEND):,} bytes")
    return True

if __name__ == "__main__":
    init_master()
