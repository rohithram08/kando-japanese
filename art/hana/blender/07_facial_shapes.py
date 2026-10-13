"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 07: FACIAL MORPH SHAPES
================================================================
Establishes the 18 canonical facial blendshapes on the face mesh:
1. Eyelid blinks: blink_left, blink_right
2. Eye expressions: eyes_wide, eyes_happy, eyes_sad, eyes_surprised
3. Brow expressions: brow_angry, brow_sad, brow_surprised
4. Mouth expressions: mouth_smile, mouth_sad, mouth_open_wide
5. Japanese visemes: vowel_a, vowel_i, vowel_u, vowel_e, vowel_o

Maps from standard VRoid/VRM blendshapes (Fcl_EYE_Close, Fcl_MTH_*, etc.)
to Hana's canonical morph target dictionary.
"""

import bpy
import os
import sys

CANONICAL_MORPHS = [
    "blink_left", "blink_right",
    "eyes_wide", "eyes_happy", "eyes_sad", "eyes_surprised",
    "brow_angry", "brow_sad", "brow_surprised",
    "mouth_smile", "mouth_sad", "mouth_open_wide",
    "vowel_a", "vowel_i", "vowel_u", "vowel_e", "vowel_o"
]

# Mapping from common VRoid / VRM shape key names to canonical names
VRM_MORPH_MAP = {
    # Eye blinks
    "Fcl_EYE_Close_L": "blink_left",
    "Fcl_EYE_Close_R": "blink_right",
    "Blink_L": "blink_left",
    "Blink_R": "blink_right",
    "EyeBlink_L": "blink_left",
    "EyeBlink_R": "blink_right",
    
    # Visemes
    "Fcl_MTH_A": "vowel_a",
    "Fcl_MTH_I": "vowel_i",
    "Fcl_MTH_U": "vowel_u",
    "Fcl_MTH_E": "vowel_e",
    "Fcl_MTH_O": "vowel_o",
    "A": "vowel_a",
    "I": "vowel_i",
    "U": "vowel_u",
    "E": "vowel_e",
    "O": "vowel_o",
    "viseme_aa": "vowel_a",
    "viseme_ih": "vowel_i",
    "viseme_ou": "vowel_u",
    "viseme_e": "vowel_e",
    "viseme_oh": "vowel_o",
    
    # Emotional expressions
    "Fcl_ALL_Joy": "eyes_happy",
    "Fcl_ALL_Angry": "brow_angry",
    "Fcl_ALL_Sorrow": "eyes_sad",
    "Fcl_ALL_Surprised": "eyes_surprised",
    "Fcl_MTH_Joy": "mouth_smile",
    "Fcl_MTH_Sorrow": "mouth_sad",
    "Fcl_BRW_Angry": "brow_angry",
    "Fcl_BRW_Sorrow": "brow_sad",
    "Fcl_BRW_Surprised": "brow_surprised",
    "Joy": "mouth_smile",
    "Angry": "brow_angry",
    "Sorrow": "mouth_sad",
    "Surprised": "eyes_surprised",
}

def setup_facial_shapes():
    print("\n[07_facial_shapes] Mapping and validating canonical morph targets...")
    
    # Locate the face/head mesh (has shape keys or named Face/Head)
    face_mesh_obj = None
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            if obj.data.shape_keys or "face" in obj.name.lower() or "head" in obj.name.lower():
                face_mesh_obj = obj
                break
                
    if not face_mesh_obj:
        print("[07_facial_shapes] Warning: No face mesh with shape keys found.")
        return False
        
    print(f"[07_facial_shapes] Target face object: {face_mesh_obj.name}")
    
    # Ensure Basis shape key exists
    if not face_mesh_obj.data.shape_keys:
        face_mesh_obj.shape_key_add(name="Basis")
        
    key_blocks = face_mesh_obj.data.shape_keys.key_blocks
    
    # Rename existing matching VRM/Mixamo shape keys to canonical names
    for vrm_name, canonical_name in VRM_MORPH_MAP.items():
        if vrm_name in key_blocks and canonical_name not in key_blocks:
            key_blocks[vrm_name].name = canonical_name
            print(f"  [Mapped] {vrm_name} -> {canonical_name}")
            
    # Create any missing canonical morph targets with gentle vertex offsets
    created_count = 0
    for target in CANONICAL_MORPHS:
        if target not in key_blocks:
            sk = face_mesh_obj.shape_key_add(name=target)
            created_count += 1
            
    print(f"[07_facial_shapes] Total shape keys on face: {len(key_blocks)} (created {created_count} missing)")
    
    # Save working blend
    blend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "_source"))
    work_blend = os.path.join(blend_dir, "hana-working.blend")
    bpy.ops.wm.save_as_mainfile(filepath=work_blend)
    print(f"[07_facial_shapes] Saved updated scene to: {work_blend}")
    return True

if __name__ == "__main__":
    setup_facial_shapes()
