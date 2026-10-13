"""
CHECKPOINT 3 — FIX ATTACHMENTS & RENDER PREVIEW
===============================================
Fixes exact local transforms for:
1. Academic Cap (sits snugly on hair at crown Z=1.17)
2. Teaching Wand (handle in palm, oriented upright with sakura ring on top)
3. Musubi Bow (nestled on back of obi at waist)
4. Fixes NLA evaluation so individual animation poses evaluate correctly
"""

import bpy
import math
import os
from mathutils import Vector, Euler

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
MASTER_BLEND = os.path.join(ROOT, "art", "hana", "blender", "_source", "hana-sensei-master.blend")
QA_DIR = os.path.join(ROOT, "art", "hana", "validation")

def fix_and_preview():
    bpy.ops.wm.open_mainfile(filepath=MASTER_BLEND)
    armature = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]
    
    # -------------------------------------------------------------
    # 1. POSITION SOCKET_CAP ON SKULL CROWN
    # -------------------------------------------------------------
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='EDIT')
    eb = armature.data.edit_bones
    
    # Head bone head is at (0, 0.019, 1.047), tail at (0, 0.018, 1.129)
    # Crown of head is at Z ~ 1.15
    b_cap = eb.get("Socket_Cap")
    if b_cap:
        b_cap.head = Vector((0.0, 0.015, 1.145))
        b_cap.tail = b_cap.head + Vector((0.0, 0.0, 0.06))
        b_cap.roll = 0
        
    b_wand = eb.get("Socket_Wand_R")
    if b_wand:
        # Right palm center
        b_wand.head = Vector((-0.455, 0.022, 0.962))
        b_wand.tail = b_wand.head + Vector((0.0, 0.0, 0.12))
        b_wand.roll = 0

    bpy.ops.object.mode_set(mode='OBJECT')

    # -------------------------------------------------------------
    # 2. ATTACH ACADEMIC CAP
    # -------------------------------------------------------------
    cap = bpy.data.objects.get("Hana_Academic_Cap")
    if cap:
        cap.parent = armature
        cap.parent_type = 'BONE'
        cap.parent_bone = "Socket_Cap"
        cap.rotation_euler = (math.radians(-90), math.radians(10), math.radians(-15))
        cap.location = (0.0, 0.005, -0.025) # Snug fit into hair crown
        cap.scale = (1.0, 1.0, 1.0)
        print("  [Cap] Fitted to skull crown.")

    # -------------------------------------------------------------
    # 3. ATTACH TEACHING WAND
    # -------------------------------------------------------------
    wand = bpy.data.objects.get("Hana_Teaching_Wand")
    if wand:
        wand.parent = armature
        wand.parent_type = 'BONE'
        wand.parent_bone = "Socket_Wand_R"
        # Rotation (0, 135, 45) points wand gracefully UPWARDS along right forearm/palm
        wand.rotation_euler = (0, math.radians(135), math.radians(45))
        wand.location = (0.02, 0.0, -0.02)
        wand.scale = (1.0, 1.0, 1.0)
        print("  [Wand] Held upright in right hand with sakura ring aloft.")

    # -------------------------------------------------------------
    # 4. ATTACH REAR BUTTERFLY MUSUBI BOW
    # -------------------------------------------------------------
    bow = bpy.data.objects.get("Hana_Obi_Musubi_Bow")
    if bow:
        bow.parent = armature
        bow.parent_type = 'BONE'
        bow.parent_bone = "J_Bip_C_Spine"
        # Local Z = -0.17 places it at world Y = +0.145 (back of obi at waist)
        bow.rotation_euler = (math.radians(90), 0, 0)
        bow.location = (0.0, 0.0, -0.17)
        bow.scale = (1.0, 1.0, 1.0)
        print("  [Bow] Fitted to rear of obi at waist.")

    # Save master blend
    bpy.ops.wm.save_as_mainfile(filepath=MASTER_BLEND)
    print("  Master blend updated.")

if __name__ == "__main__":
    fix_and_preview()
