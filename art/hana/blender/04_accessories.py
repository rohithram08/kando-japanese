"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 04: ACCESSORIES
=========================================================
Builds and positions Hana's canonical educational props:
1. Academic mortarboard cap (tilted 5° to the right)
2. Gold central button and hanging silk tassel (18cm drop)
3. Sakura blossom hair ornament on right temple
4. Purple bead drop earrings (left and right)
5. Magical sakura teaching wand (gold shaft, sakura bloom ring, tassel)
6. Socket binding to right hand bone for animation tracking
"""

import bpy
import bmesh
import math
import os
import sys
from mathutils import Vector, Euler

def build_accessories():
    print("\n[04_accessories] Building Hana's canonical accessories and props...")
    
    armature = next((o for o in bpy.data.objects if o.type == 'ARMATURE'), None)
    acc_col = bpy.data.collections.get("Hana_Accessories") or bpy.context.scene.collection
    
    # 1. Graduation Mortarboard Cap
    # Flat square board (24cm x 24cm)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.01, 1.68))
    cap_board = bpy.context.active_object
    cap_board.name = "Hana_Mortarboard_Cap"
    cap_board.scale = (0.24, 0.24, 0.012)
    # Tilted 5 degrees right (+Z rotation 15 deg, +X rotation 5 deg)
    cap_board.rotation_euler = (math.radians(5), math.radians(-3), math.radians(15))
    
    # Cap central gold button
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.012, depth=0.008, location=(0, -0.01, 1.69))
    cap_btn = bpy.context.active_object
    cap_btn.name = "Hana_Cap_GoldButton"
    cap_btn.rotation_euler = cap_board.rotation_euler
    
    # 18cm Gold Tassel drooping to right shoulder
    bm_tassel = bmesh.new()
    p_top = Vector((0, -0.01, 1.69))
    p_edge = Vector((0.11, -0.04, 1.67))
    p_mid = Vector((0.13, -0.05, 1.56))
    p_tip = Vector((0.13, -0.05, 1.48))
    
    verts = [bm_tassel.verts.new(p) for p in [p_top, p_edge, p_mid, p_tip]]
    for i in range(len(verts) - 1):
        bm_tassel.edges.new((verts[i], verts[i+1]))
        
    mesh_tassel = bpy.data.meshes.new("Hana_Gold_Tassel")
    bm_tassel.to_mesh(mesh_tassel)
    bm_tassel.free()
    obj_tassel = bpy.data.objects.new("Hana_Gold_Tassel", mesh_tassel)
    sol_t = obj_tassel.modifiers.new("Skin", type='SKIN')
    
    # 2. Sakura Hair Ornament (Right temple)
    bpy.ops.mesh.primitive_cylinder_add(vertices=5, radius=0.024, depth=0.006, location=(0.092, -0.062, 1.58))
    pin_obj = bpy.context.active_object
    pin_obj.name = "Hana_Hair_SakuraPin"
    pin_obj.rotation_euler = (math.radians(70), math.radians(-30), math.radians(15))
    
    # 3. Purple Drop Earrings (Left & Right)
    for side, sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=12, radius=0.008, location=(sign * 0.088, -0.025, 1.48))
        earring = bpy.context.active_object
        earring.name = f"Hana_Earring_{side}"
        
    # 4. Magical Sakura Wand
    # Gold shaft (45cm length)
    wand_group = []
    
    # Default right hand holding position: near right hip / torso ready for gesturing
    wand_base_pos = Vector((0.30, -0.15, 1.05))
    
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.008, depth=0.45, location=wand_base_pos)
    wand_shaft = bpy.context.active_object
    wand_shaft.name = "Hana_Wand_Shaft"
    wand_shaft.rotation_euler = (math.radians(-15), math.radians(10), math.radians(5))
    wand_group.append(wand_shaft)
    
    # Wand top gold ring (12cm diameter)
    wand_top_pos = wand_base_pos + Vector((-0.03, 0.05, 0.24))
    bpy.ops.mesh.primitive_torus_add(major_radius=0.055, minor_radius=0.006, location=wand_top_pos)
    wand_ring = bpy.context.active_object
    wand_ring.name = "Hana_Wand_Ring"
    wand_ring.rotation_euler = wand_shaft.rotation_euler
    wand_group.append(wand_ring)
    
    # Floating 5-petal sakura flower inside ring (emissive)
    bpy.ops.mesh.primitive_cylinder_add(vertices=5, radius=0.035, depth=0.004, location=wand_top_pos)
    wand_bloom = bpy.context.active_object
    wand_bloom.name = "Hana_Wand_SakuraBloom"
    wand_bloom.rotation_euler = wand_shaft.rotation_euler
    wand_group.append(wand_bloom)
    
    # Purple tassel below ring
    tassel_pos = wand_top_pos - Vector((0, 0, 0.08))
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.008, depth=0.07, location=tassel_pos)
    wand_tassel = bpy.context.active_object
    wand_tassel.name = "Hana_Wand_PurpleTassel"
    wand_group.append(wand_tassel)
    
    # Link all accessory objects to Hana_Accessories collection
    all_acc = [cap_board, cap_btn, obj_tassel, pin_obj, wand_shaft, wand_ring, wand_bloom, wand_tassel]
    all_acc.extend([o for o in bpy.data.objects if "Earring" in o.name])
    
    for obj in all_acc:
        if obj.name not in acc_col.objects:
            acc_col.objects.link(obj)
        if obj.name in bpy.context.scene.collection.objects:
            bpy.context.scene.collection.objects.unlink(obj)
            
    # Parent accessories to armature bones if available
    if armature:
        # Head props parented to head bone
        head_bone = armature.data.bones.get("head")
        if head_bone:
            for h_obj in [cap_board, cap_btn, obj_tassel, pin_obj]:
                h_obj.parent = armature
                h_obj.parent_type = 'BONE'
                h_obj.parent_bone = "head"
                
        # Wand parented to right hand bone
        hand_r = armature.data.bones.get("hand.R") or armature.data.bones.get("J_Bip_R_Hand")
        if hand_r:
            for w_obj in wand_group:
                w_obj.parent = armature
                w_obj.parent_type = 'BONE'
                w_obj.parent_bone = hand_r.name
                
    print("[04_accessories] Accessories built and parented.")
    
    # Save working blend
    blend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "_source"))
    work_blend = os.path.join(blend_dir, "hana-working.blend")
    bpy.ops.wm.save_as_mainfile(filepath=work_blend)
    print(f"[04_accessories] Saved updated scene to: {work_blend}")
    return True

if __name__ == "__main__":
    build_accessories()
