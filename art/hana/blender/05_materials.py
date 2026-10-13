"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 05: MATERIALS
=======================================================
Establishes the canonical 20-color PBR material palette:
1. Mat_Hana_Face: anime peach skin tone (#fdf2e9), SSS 0.05
2. Mat_Hana_Hair: rich dark chocolate brown (#3d2215), anisotropic specular
3. Mat_Hana_Kimono: royal educational lavender (#9b6cc4)
4. Mat_Hana_InnerCollar: crisp white (#ffffff)
5. Mat_Hana_Obi: deep plum/navy structured brocade (#2d1b4e)
6. Mat_Hana_Gold: polished ceremonial gold (#d4a843, metallic 0.92)
7. Mat_Hana_SakuraGlow: delicate pink blossom with bloom emission (#f8c8d4, emission #ffb7c5)
8. Mat_Hana_Earrings: translucent purple crystal (#6b3fa0)
9. Mat_Hana_Cap: dark navy scholastic felt (#2d1b4e)
"""

import bpy
import os
import sys

HEX_PALETTE = {
    "kimonoBody": "#9b6cc4",
    "kimonoGradient": "#6b3fa0",
    "kimonoShadow": "#7a52a8",
    "obiCap": "#2d1b4e",
    "goldTrim": "#d4a843",
    "sakuraPetals": "#f8c8d4",
    "wandGlow": "#ffb7c5",
    "skinBase": "#fdf2e9",
    "skinShadow": "#f8d7c4",
    "blush": "#fca5a5",
    "hairBase": "#3d2215",
    "hairHighlight": "#5a3622",
    "eyeIris": "#8b5a2b",
    "eyeMidtone": "#d48b38",
    "eyeHighlight": "#ffdd80",
    "eyePupil": "#2c1810",
    "eyeliner": "#1a0f0a",
    "innerCollar": "#ffffff",
    "sakuraTwigs": "#5a3622",
    "earrings": "#6b3fa0"
}

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    r = int(hex_str[0:2], 16) / 255.0
    g = int(hex_str[2:4], 16) / 255.0
    b = int(hex_str[4:6], 16) / 255.0
    # Convert sRGB to linear for Blender
    def srgb_to_linear(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (srgb_to_linear(r), srgb_to_linear(g), srgb_to_linear(b))

def get_or_create_material(name, base_color_hex, roughness=0.5, metallic=0.0, emission_hex=None, emission_strength=1.0):
    mat = bpy.data.materials.get(name)
    if not mat:
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    if bsdf:
        rgb = hex_to_rgb(base_color_hex)
        bsdf.inputs['Base Color'].default_value = (*rgb, 1.0)
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metallic
        
        if emission_hex:
            em_rgb = hex_to_rgb(emission_hex)
            bsdf.inputs['Emission Color'].default_value = (*em_rgb, 1.0)
            bsdf.inputs['Emission Strength'].default_value = emission_strength
            
    return mat

def assign_materials():
    print("\n[05_materials] Configuring canonical PBR materials...")
    
    mats = {
        "face": get_or_create_material("Mat_Hana_Face", HEX_PALETTE["skinBase"], roughness=0.38),
        "hair": get_or_create_material("Mat_Hana_Hair", HEX_PALETTE["hairBase"], roughness=0.48),
        "kimono": get_or_create_material("Mat_Hana_Kimono", HEX_PALETTE["kimonoBody"], roughness=0.55),
        "collar": get_or_create_material("Mat_Hana_InnerCollar", HEX_PALETTE["innerCollar"], roughness=0.3),
        "obi": get_or_create_material("Mat_Hana_Obi", HEX_PALETTE["obiCap"], roughness=0.5),
        "gold": get_or_create_material("Mat_Hana_Gold", HEX_PALETTE["goldTrim"], roughness=0.22, metallic=0.92),
        "sakura": get_or_create_material("Mat_Hana_SakuraGlow", HEX_PALETTE["sakuraPetals"], roughness=0.4, emission_hex=HEX_PALETTE["wandGlow"], emission_strength=1.5),
        "earring": get_or_create_material("Mat_Hana_Earrings", HEX_PALETTE["earrings"], roughness=0.2, metallic=0.1),
        "cap": get_or_create_material("Mat_Hana_Cap", HEX_PALETTE["obiCap"], roughness=0.45)
    }
    
    # Material assignment rules by object name pattern
    assignments = [
        (["Kimono", "Sleeve"], mats["kimono"]),
        (["InnerCollar", "Juban"], mats["collar"]),
        (["Obi"], mats["obi"]),
        (["Cap_Gold", "GoldBtn", "Tassel", "Wand_Shaft", "Wand_Ring"], mats["gold"]),
        (["SakuraPin", "Wand_SakuraBloom", "Bloom"], mats["sakura"]),
        (["Earring", "Wand_PurpleTassel"], mats["earring"]),
        (["Mortarboard", "Cap_Board", "Cap_Dome"], mats["cap"]),
    ]
    
    for obj in bpy.data.objects:
        if obj.type != 'MESH':
            continue
        for patterns, target_mat in assignments:
            if any(p in obj.name for p in patterns):
                if len(obj.data.materials) == 0:
                    obj.data.materials.append(target_mat)
                else:
                    obj.data.materials[0] = target_mat
                break
                
    print("[05_materials] Canonical materials successfully assigned.")
    
    # Save working blend
    blend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "_source"))
    work_blend = os.path.join(blend_dir, "hana-working.blend")
    bpy.ops.wm.save_as_mainfile(filepath=work_blend)
    print(f"[05_materials] Saved updated scene to: {work_blend}")
    return True

if __name__ == "__main__":
    assign_materials()
