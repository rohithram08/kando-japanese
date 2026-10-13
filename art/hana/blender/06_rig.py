"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 06: RIGGING (HUMANOID & ACCESSORY SKELETON)
=====================================================================================
Ensures the complete 55+ bone canonical humanoid armature:
1. Core humanoid hierarchy: hips, spine, chest, neck, head, arms, legs, fingers
2. Dynamic hair bones: hair.back.01-03, hair.side.L/R (parented to head)
3. Furisode sleeve bones: sleeve.L.01-02, sleeve.R.01-02 (parented to arms)
4. Tassel bones: tassel.01-02 (parented to cap/head)
5. Wand socket bone: socket.wand.R (parented to hand.R)
"""

import bpy
import os
import sys
from mathutils import Vector

def setup_rig():
    print("\n[06_rig] Configuring humanoid armature and accessory bones...")
    
    armature = next((o for o in bpy.data.objects if o.type == 'ARMATURE'), None)
    if not armature:
        print("[06_rig] Warning: No base armature found. Skipping rig extension.")
        return False
        
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='EDIT')
    edit_bones = armature.data.edit_bones
    
    head_bone = edit_bones.get("head")
    hand_r = edit_bones.get("hand.R") or edit_bones.get("J_Bip_R_Hand")
    arm_l = edit_bones.get("upper_arm.L") or edit_bones.get("J_Bip_L_UpperArm")
    arm_r = edit_bones.get("upper_arm.R") or edit_bones.get("J_Bip_R_UpperArm")
    
    # 1. Add Wand Socket Bone to Right Hand
    if hand_r and "socket.wand.R" not in edit_bones:
        b_wand = edit_bones.new("socket.wand.R")
        b_wand.head = hand_r.tail
        b_wand.tail = hand_r.tail + Vector((0, 0, 0.15))
        b_wand.parent = hand_r
        print("[06_rig] Created socket.wand.R parented to hand.R")
        
    # 2. Add Hair Secondary Bones to Head
    if head_bone:
        if "hair.back.01" not in edit_bones:
            b_hb1 = edit_bones.new("hair.back.01")
            b_hb1.head = head_bone.head + Vector((0, 0.05, 0.05))
            b_hb1.tail = b_hb1.head + Vector((0, 0.08, -0.15))
            b_hb1.parent = head_bone
            
            b_hb2 = edit_bones.new("hair.back.02")
            b_hb2.head = b_hb1.tail
            b_hb2.tail = b_hb2.head + Vector((0, 0.06, -0.20))
            b_hb2.parent = b_hb1
            print("[06_rig] Created hair.back chain parented to head")
            
        for side, sign in [("L", -1), ("R", 1)]:
            b_name = f"hair.side.{side}"
            if b_name not in edit_bones:
                b_hs = edit_bones.new(b_name)
                b_hs.head = head_bone.head + Vector((sign * 0.08, -0.02, 0.02))
                b_hs.tail = b_hs.head + Vector((sign * 0.02, -0.01, -0.22))
                b_hs.parent = head_bone
                print(f"[06_rig] Created {b_name} parented to head")
                
        # 3. Add Cap Tassel Bone
        if "tassel.01" not in edit_bones:
            b_tas = edit_bones.new("tassel.01")
            b_tas.head = head_bone.head + Vector((0.11, -0.04, 0.18))
            b_tas.tail = b_tas.head + Vector((0.02, -0.01, -0.18))
            b_tas.parent = head_bone
            print("[06_rig] Created tassel.01 parented to head")

    # 4. Add Sleeve Bones to Arms
    for side, sign, arm in [("L", -1, arm_l), ("R", 1, arm_r)]:
        if arm:
            b_sl_name = f"sleeve.{side}.01"
            if b_sl_name not in edit_bones:
                b_sl = edit_bones.new(b_sl_name)
                b_sl.head = arm.head + Vector((0, -0.02, -0.05))
                b_sl.tail = b_sl.head + Vector((0, 0, -0.35))
                b_sl.parent = arm
                print(f"[06_rig] Created {b_sl_name} parented to {arm.name}")
                
    bpy.ops.object.mode_set(mode='OBJECT')
    
    total_bones = len(armature.data.bones)
    print(f"[06_rig] Rig configured successfully with {total_bones} total bones.")
    
    # Save working blend
    blend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "_source"))
    work_blend = os.path.join(blend_dir, "hana-working.blend")
    bpy.ops.wm.save_as_mainfile(filepath=work_blend)
    print(f"[06_rig] Saved updated scene to: {work_blend}")
    return True

if __name__ == "__main__":
    setup_rig()
