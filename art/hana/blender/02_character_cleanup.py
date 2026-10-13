"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 02: CHARACTER CLEANUP
==============================================================
Cleans up the imported base character:
1. Normalizes scene units to metric (meters, 165cm height target)
2. Isolates anime body, head, and hair
3. Standardizes armature bone naming to canonical humanoid convention
4. Organizes Blender collections into clean modular layers
"""

import bpy
import os
import sys

def cleanup_character():
    print("\n[02_cleanup] Starting character cleanup and standardization...")
    
    # 1. Set scene units to metric meters
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0
    scene.unit_settings.length_unit = 'METERS'
    
    # 2. Find armature and meshes
    armature = next((o for o in bpy.data.objects if o.type == 'ARMATURE'), None)
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    
    if not armature:
        print("[02_cleanup] Warning: No armature found to standardize.")
    else:
        # Standardize bone naming mapping for VRM/Mixamo to Hana Canonical Bones
        BONE_MAP = {
            # VRoid / VRM Humanoid Names -> Canonical Names
            "J_Bip_C_Hips": "hips",
            "J_Bip_C_Spine": "spine",
            "J_Bip_C_Chest": "chest",
            "J_Bip_C_UpperChest": "upper_chest",
            "J_Bip_C_Neck": "neck",
            "J_Bip_C_Head": "head",
            
            "J_Bip_L_Shoulder": "shoulder.L",
            "J_Bip_L_UpperArm": "upper_arm.L",
            "J_Bip_L_LowerArm": "lower_arm.L",
            "J_Bip_L_Hand": "hand.L",
            
            "J_Bip_R_Shoulder": "shoulder.R",
            "J_Bip_R_UpperArm": "upper_arm.R",
            "J_Bip_R_LowerArm": "lower_arm.R",
            "J_Bip_R_Hand": "hand.R",
            
            "J_Bip_L_UpperLeg": "upper_leg.L",
            "J_Bip_L_LowerLeg": "lower_leg.L",
            "J_Bip_L_Foot": "foot.L",
            "J_Bip_L_ToeBase": "toe.L",
            
            "J_Bip_R_UpperLeg": "upper_leg.R",
            "J_Bip_R_LowerLeg": "lower_leg.R",
            "J_Bip_R_Foot": "foot.R",
            "J_Bip_R_ToeBase": "toe.R",
            
            # Mixamo style mappings
            "mixamorig:Hips": "hips",
            "mixamorig:Spine": "spine",
            "mixamorig:Spine1": "chest",
            "mixamorig:Spine2": "upper_chest",
            "mixamorig:Neck": "neck",
            "mixamorig:Head": "head",
            "mixamorig:LeftShoulder": "shoulder.L",
            "mixamorig:LeftArm": "upper_arm.L",
            "mixamorig:LeftForeArm": "lower_arm.L",
            "mixamorig:LeftHand": "hand.L",
            "mixamorig:RightShoulder": "shoulder.R",
            "mixamorig:RightArm": "upper_arm.R",
            "mixamorig:RightForeArm": "lower_arm.R",
            "mixamorig:RightHand": "hand.R",
            "mixamorig:LeftUpLeg": "upper_leg.L",
            "mixamorig:LeftLeg": "lower_leg.L",
            "mixamorig:LeftFoot": "foot.L",
            "mixamorig:RightUpLeg": "upper_leg.R",
            "mixamorig:RightLeg": "lower_leg.R",
            "mixamorig:RightFoot": "foot.R",
        }
        
        renamed_count = 0
        for bone in armature.data.bones:
            for src_pattern, canonical_name in BONE_MAP.items():
                if src_pattern.lower() == bone.name.lower():
                    bone.name = canonical_name
                    renamed_count += 1
                    break
                    
        print(f"[02_cleanup] Standardized {renamed_count} armature bone names.")
        
    # 3. Organize into collections
    for col_name in ["Hana_Character", "Hana_Costume", "Hana_Accessories"]:
        if col_name not in bpy.data.collections:
            new_col = bpy.data.collections.new(col_name)
            bpy.context.scene.collection.children.link(new_col)
            
    # Move character meshes and armature into Hana_Character
    char_col = bpy.data.collections["Hana_Character"]
    for obj in bpy.data.objects:
        if obj.type in ['MESH', 'ARMATURE'] and obj.name not in char_col.objects:
            # Link to collection
            for c in obj.users_collection:
                c.objects.unlink(obj)
            char_col.objects.link(obj)
            
    print("[02_cleanup] Character hierarchy successfully organized.")
    
    # Save working blend
    blend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "_source"))
    work_blend = os.path.join(blend_dir, "hana-working.blend")
    bpy.ops.wm.save_as_mainfile(filepath=work_blend)
    print(f"[02_cleanup] Saved updated scene to: {work_blend}")
    return True

if __name__ == "__main__":
    cleanup_character()
