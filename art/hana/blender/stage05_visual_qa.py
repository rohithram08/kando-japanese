"""
CHECKPOINT 3 — STAGE 5: VISUAL QA RENDERING SUITE (14 QA RENDERS)
==================================================================
Renders all 14 visual QA images required by Checkpoint 3 from
art/hana/blender/_source/hana-sensei-master.blend:

1. prod_qa_front.png
2. prod_qa_three_quarter.png
3. prod_qa_side.png
4. prod_qa_back.png
5. prod_qa_face_closeup.png
6. prod_qa_hair_closeup.png
7. prod_qa_full_kimono.png
8. prod_qa_cap.png
9. prod_qa_hana_holding_wand.png
10. prod_qa_wand_closeup.png
11. prod_qa_pointing_pose.png
12. prod_qa_waving_pose.png
13. prod_qa_talking_pose.png
14. prod_qa_celebrating_pose.png
"""

import bpy
import math
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
MASTER_BLEND = os.path.join(ROOT, "art", "hana", "blender", "_source", "hana-sensei-master.blend")
QA_DIR = os.path.join(ROOT, "art", "hana", "validation")
os.makedirs(QA_DIR, exist_ok=True)

def setup_studio_lighting():
    key = bpy.data.lights.new("QA_Key", type='AREA')
    key.energy = 85.0
    key.size = 2.0
    ko = bpy.data.objects.new("QA_Key", key)
    bpy.context.collection.objects.link(ko)
    ko.location = (1.2, -2.0, 2.2)
    ko.rotation_euler = (math.radians(50), math.radians(10), math.radians(-20))

    fill = bpy.data.lights.new("QA_Fill", type='AREA')
    fill.energy = 45.0
    fill.color = (0.96, 0.92, 0.98)
    fill.size = 2.5
    fo = bpy.data.objects.new("QA_Fill", fill)
    bpy.context.collection.objects.link(fo)
    fo.location = (-1.6, -1.4, 1.4)
    fo.rotation_euler = (math.radians(60), math.radians(-15), math.radians(25))

    rim = bpy.data.lights.new("QA_Rim", type='SPOT')
    rim.energy = 140.0
    rim.spot_size = math.radians(65)
    ro = bpy.data.objects.new("QA_Rim", rim)
    bpy.context.collection.objects.link(ro)
    ro.location = (0, 1.8, 2.6)
    ro.rotation_euler = (math.radians(-135), 0, 0)

    world = bpy.data.worlds.new("QA_World")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.88, 0.85, 0.92, 1.0)
    bg.inputs['Strength'].default_value = 0.65

def render_view(cam_name, target_xyz, dist, angle_deg, elev_deg, lens, out_name, rx=768, ry=1024):
    cd = bpy.data.cameras.new(cam_name)
    cd.lens = lens
    cd.clip_start = 0.05
    cd.clip_end = 200.0
    co = bpy.data.objects.new(cam_name, cd)
    bpy.context.collection.objects.link(co)
    bpy.context.scene.camera = co

    tx, ty, tz = target_xyz
    rh = math.radians(angle_deg)
    rv = math.radians(elev_deg)
    cx = tx + dist * math.cos(rv) * math.sin(rh)
    cy = ty - dist * math.cos(rv) * math.cos(rh)
    cz = tz + dist * math.sin(rv)
    co.location = (cx, cy, cz)

    trk = bpy.data.objects.new("_trk_" + cam_name, None)
    trk.location = target_xyz
    bpy.context.collection.objects.link(trk)
    con = co.constraints.new(type='TRACK_TO')
    con.target = trk
    con.track_axis = 'TRACK_NEGATIVE_Z'
    con.up_axis = 'UP_Y'

    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
    scene.render.resolution_x = rx
    scene.render.resolution_y = ry
    out_path = os.path.join(QA_DIR, out_name)
    scene.render.filepath = out_path
    bpy.ops.render.render(write_still=True)

    co.constraints.remove(con)
    bpy.data.objects.remove(trk)
    bpy.data.objects.remove(co)
    bpy.data.cameras.remove(cd)
    print(f"  [QA Render] {out_name}")
    return out_path

def run_visual_qa():
    print("=" * 70)
    print("STAGE 5: VISUAL QUALITY ASSURANCE RENDERING")
    print("=" * 70)

    bpy.ops.wm.open_mainfile(filepath=MASTER_BLEND)
    setup_studio_lighting()

    armature = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]
    scene = bpy.context.scene

    # Coordinates
    body_center = (0, 0, 0.75)
    face_center = (0, 0, 1.08)
    head_center = (0, 0, 1.20)
    hand_r_pos = (-0.42, 0.05, 0.90)

    # -------------------------------------------------------------
    # 1. BASE STATIC / IDLE RENDERS (Frame 1 of idle)
    # -------------------------------------------------------------
    def set_pose_action(action_name, frame):
        armature.animation_data.use_nla = False
        act = bpy.data.actions.get(action_name)
        if act:
            armature.animation_data.action = act
        scene.frame_set(frame)
        bpy.context.view_layer.update()

    print("\n  Rendering Static / Neutral Poses...")
    # 1. Front (idle, frame 1)
    set_pose_action("idle", 1)
    render_view("QACam1", body_center, dist=2.6, angle_deg=0, elev_deg=0, lens=70, out_name="prod_qa_front.png")
    # 2. 3/4
    render_view("QACam2", body_center, dist=2.6, angle_deg=35, elev_deg=0, lens=70, out_name="prod_qa_three_quarter.png")
    # 3. Side
    render_view("QACam3", body_center, dist=2.6, angle_deg=90, elev_deg=0, lens=70, out_name="prod_qa_side.png")
    # 4. Back
    render_view("QACam4", body_center, dist=2.6, angle_deg=180, elev_deg=0, lens=70, out_name="prod_qa_back.png")

    # 5. Face Close-up
    render_view("QACam5", face_center, dist=0.48, angle_deg=5, elev_deg=-2, lens=65, out_name="prod_qa_face_closeup.png", rx=768, ry=768)
    # 6. Hair Close-up
    render_view("QACam6", (0, 0.05, 1.12), dist=0.85, angle_deg=140, elev_deg=12, lens=55, out_name="prod_qa_hair_closeup.png", rx=768, ry=768)
    # 7. Full Kimono view
    render_view("QACam7", (0, 0, 0.65), dist=2.2, angle_deg=20, elev_deg=-5, lens=60, out_name="prod_qa_full_kimono.png", rx=768, ry=1024)
    # 8. Cap Close-up
    render_view("QACam8", (0, 0, 1.22), dist=0.45, angle_deg=15, elev_deg=14, lens=65, out_name="prod_qa_cap.png", rx=768, ry=768)

    # 9. Hana Holding Wand
    render_view("QACam9", (0, 0, 0.85), dist=2.3, angle_deg=15, elev_deg=0, lens=65, out_name="prod_qa_hana_holding_wand.png", rx=768, ry=1024)
    # 10. Wand Close-up (Sakura ring & glow)
    render_view("QACam10", (-0.29, -0.12, 1.04), dist=0.45, angle_deg=0, elev_deg=-6, lens=75, out_name="prod_qa_wand_closeup.png", rx=768, ry=768)

    # -------------------------------------------------------------
    # 2. ACTION POSE RENDERS
    # -------------------------------------------------------------
    print("\n  Rendering Core Action Poses...")

    # 11. Pointing Pose (Action: pointing, Frame 30) - -40 deg angle captures right side with forward-reaching arm & wand
    set_pose_action("pointing", 30)
    render_view("QACam11", (0, 0, 0.85), dist=2.5, angle_deg=-40, elev_deg=2, lens=65, out_name="prod_qa_pointing_pose.png")

    # 12. Waving Pose (Action: waving, Frame 25)
    set_pose_action("waving", 25)
    render_view("QACam12", body_center, dist=2.5, angle_deg=15, elev_deg=0, lens=65, out_name="prod_qa_waving_pose.png")

    # 13. Talking Pose (Action: talking, Frame 25)
    set_pose_action("talking", 25)
    render_view("QACam13", (0, 0, 0.90), dist=2.1, angle_deg=20, elev_deg=0, lens=65, out_name="prod_qa_talking_pose.png")

    # 14. Celebrating Pose (Action: celebrating, Frame 30)
    set_pose_action("celebrating", 30)
    render_view("QACam14", (0, 0, 0.95), dist=2.6, angle_deg=10, elev_deg=0, lens=65, out_name="prod_qa_celebrating_pose.png")

    print("\n" + "=" * 70)
    print("ALL 14 VISUAL QA RENDERS SUCCESSFULLY GENERATED")
    print("=" * 70)

if __name__ == "__main__":
    run_visual_qa()
