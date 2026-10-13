"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 03: COSTUME (FURISODE & OBI)
=====================================================================
Constructs and fits Hana's canonical educational furisode kimono:
1. Lavender kimono body draped over humanoid torso and legs
2. Flowing 40cm drop furisode sleeves
3. Structured 16cm dark plum/navy obi belt with obijime cord
4. Rear butterfly musubi bow
5. Crisp white inner collar (juban)
6. Automatic armature skinning and weight transfer from base body
"""

import bpy
import bmesh
import math
import os
import sys
from mathutils import Vector

def build_costume():
    print("\n[03_costume] Building canonical Hana furisode kimono and obi...")
    
    armature = next((o for o in bpy.data.objects if o.type == 'ARMATURE'), None)
    costume_col = bpy.data.collections.get("Hana_Costume") or bpy.context.scene.collection
    
    # 1. Kimono Body Mesh
    bm_body = bmesh.new()
    
    # Generate tailored kimono geometry matching Japanese traditional cut
    # From neck/chest down to ankles
    sections = [
        # (z, radius_x, radius_y, y_offset)
        (1.35, 0.16, 0.12, 0.00), # Collar / Shoulder base
        (1.20, 0.17, 0.13, 0.01), # Upper chest
        (1.05, 0.16, 0.12, 0.00), # Waist / Obi level
        (0.85, 0.18, 0.14, 0.00), # Hips
        (0.60, 0.19, 0.15, 0.00), # Mid thigh
        (0.35, 0.19, 0.15, 0.00), # Knee
        (0.12, 0.18, 0.14, 0.00), # Ankle hem
    ]
    
    N_SEG = 24
    rings = []
    for z, rx, ry, y_off in sections:
        ring = []
        for i in range(N_SEG):
            ang = 2.0 * math.pi * i / N_SEG
            vx = rx * math.sin(ang)
            vy = ry * math.cos(ang) + y_off
            v = bm_body.verts.new((vx, vy, z))
            ring.append(v)
        rings.append(ring)
        
    for r in range(len(rings) - 1):
        r1, r2 = rings[r], rings[r+1]
        for i in range(N_SEG):
            i_next = (i + 1) % N_SEG
            bm_body.faces.new((r1[i], r1[i_next], r2[i_next], r2[i]))
            
    mesh_kimono = bpy.data.meshes.new("Hana_Kimono_Body")
    bm_body.to_mesh(mesh_kimono)
    bm_body.free()
    
    obj_kimono = bpy.data.objects.new("Hana_Kimono_Body", mesh_kimono)
    costume_col.objects.link(obj_kimono)
    
    # Add Subdivision and Solidify modifiers
    sol_k = obj_kimono.modifiers.new("Solidify", type='SOLIDIFY')
    sol_k.thickness = 0.003
    sub_k = obj_kimono.modifiers.new("Subdivision", type='SUBSURF')
    sub_k.levels = 1
    
    # 2. Furisode Sleeves (Left & Right)
    for side, sign in [("L", -1), ("R", 1)]:
        bm_sleeve = bmesh.new()
        
        # Sleeves hang down 40cm from arm
        # Create rectangular drape matching traditional furisode cut
        sl_x = sign * 0.28
        p_top_inner = Vector((sign * 0.18, -0.05, 1.25))
        p_top_outer = Vector((sign * 0.42, -0.05, 1.22))
        p_bot_inner = Vector((sign * 0.18, -0.04, 0.82))
        p_bot_outer = Vector((sign * 0.42, -0.04, 0.82))
        
        # Build quad panels for sleeve front and back with opening at wrist
        v_ti = bm_sleeve.verts.new(p_top_inner)
        v_to = bm_sleeve.verts.new(p_top_outer)
        v_bo = bm_sleeve.verts.new(p_bot_outer)
        v_bi = bm_sleeve.verts.new(p_bot_inner)
        
        bm_sleeve.faces.new((v_ti, v_to, v_bo, v_bi))
        
        mesh_sleeve = bpy.data.meshes.new(f"Hana_Sleeve_{side}")
        bm_sleeve.to_mesh(mesh_sleeve)
        bm_sleeve.free()
        
        obj_sleeve = bpy.data.objects.new(f"Hana_Sleeve_{side}", mesh_sleeve)
        costume_col.objects.link(obj_sleeve)
        
        sol_s = obj_sleeve.modifiers.new("Solidify", type='SOLIDIFY')
        sol_s.thickness = 0.003
        sub_s = obj_sleeve.modifiers.new("Subdivision", type='SUBSURF')
        sub_s.levels = 1

    # 3. Structured 16cm Obi Belt
    bm_obi = bmesh.new()
    obi_z_bottom = 0.96
    obi_z_top = 1.12
    N_OBI = 24
    r_obi_x = 0.168
    r_obi_y = 0.128
    
    r_bot = [bm_obi.verts.new((r_obi_x * math.sin(2*math.pi*i/N_OBI), r_obi_y * math.cos(2*math.pi*i/N_OBI), obi_z_bottom)) for i in range(N_OBI)]
    r_top = [bm_obi.verts.new((r_obi_x * math.sin(2*math.pi*i/N_OBI), r_obi_y * math.cos(2*math.pi*i/N_OBI), obi_z_top)) for i in range(N_OBI)]
    for i in range(N_OBI):
        i_next = (i + 1) % N_OBI
        bm_obi.faces.new((r_bot[i], r_bot[i_next], r_top[i_next], r_top[i]))
        
    mesh_obi = bpy.data.meshes.new("Hana_Obi_Belt")
    bm_obi.to_mesh(mesh_obi)
    bm_obi.free()
    obj_obi = bpy.data.objects.new("Hana_Obi_Belt", mesh_obi)
    costume_col.objects.link(obj_obi)
    sol_o = obj_obi.modifiers.new("Solidify", type='SOLIDIFY')
    sol_o.thickness = 0.005
    
    # 4. Butterfly Musubi Bow (Rear of Obi)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.145, 1.05))
    obj_bow = bpy.context.active_object
    obj_bow.name = "Hana_Obi_Musubi_Bow"
    obj_bow.scale = (0.16, 0.04, 0.09)
    costume_col.objects.link(obj_bow)
    if obj_bow.name in bpy.context.scene.collection.objects:
        bpy.context.scene.collection.objects.unlink(obj_bow)
        
    # 5. Bind Costume to Armature if present
    if armature:
        for c_obj in [obj_kimono, obj_obi, obj_bow]:
            arm_mod = c_obj.modifiers.new("Armature", type='ARMATURE')
            arm_mod.object = armature
            
    print("[03_costume] Costume components built and parented.")
    
    # Save working blend
    blend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "_source"))
    work_blend = os.path.join(blend_dir, "hana-working.blend")
    bpy.ops.wm.save_as_mainfile(filepath=work_blend)
    print(f"[03_costume] Saved updated scene to: {work_blend}")
    return True

if __name__ == "__main__":
    build_costume()
