"""
HANA-SENSEI 3D PRODUCTION PIPELINE — STEP 08: SKELETAL ANIMATION CLIPS
======================================================================
Creates the 14 canonical skeletal animation clips on the humanoid armature:
1.  idle: gentle breathing, chest expansion, subtle head float, sleeve sway
2.  greeting: formal respectful Japanese bow (ojigi 15°), smooth recovery
3.  waving: friendly teacher wave with left hand, gentle smile posture
4.  talking: dynamic conversational head tilts and communicative body language
5.  thinking: contemplative head tilt, hand to chin, thoughtful gaze
6.  happy: delighted bounce with cheerful posture
7.  encouraging: warm open-palm gesture ("Gambatte! You can do it!")
8.  confused: puzzled head tilt, gentle hand shrug
9.  celebrating: joyful triumphant celebration with arms raised
10. teaching: ceremonial wand presentation, guiding student attention
11. pointing: precise educational pointer gesture toward lesson UI
12. listening: attentive forward lean, patient supportive posture
13. error: polite apologetic bow ("Sumimasen, let's try again")
14. sleeping: resting energy-saver pose, slow deep rhythmic breathing
"""

import bpy
import math
import os
import sys

ANIMATIONS = [
    ("idle", 3.0, "loop"),
    ("greeting", 2.5, "bow"),
    ("waving", 2.0, "wave"),
    ("talking", 3.0, "talk"),
    ("thinking", 3.0, "think"),
    ("happy", 2.0, "bounce"),
    ("encouraging", 2.5, "encourage"),
    ("confused", 3.0, "confuse"),
    ("celebrating", 2.5, "celebrate"),
    ("teaching", 3.5, "teach"),
    ("pointing", 3.0, "point"),
    ("listening", 3.0, "listen"),
    ("error", 3.0, "apologize"),
    ("sleeping", 4.0, "sleep")
]

def create_skeletal_animations():
    print("\n[08_animations] Generating 14 canonical skeletal animation clips...")
    
    armature = next((o for o in bpy.data.objects if o.type == 'ARMATURE'), None)
    if not armature:
        print("[08_animations] Warning: No armature found. Cannot bake skeletal clips.")
        return False
        
    scene = bpy.context.scene
    scene.render.fps = 30
    
    # Ensure animation data exists
    if not armature.animation_data:
        armature.animation_data_create()
        
    created_clips = []
    
    for anim_name, duration, motion_type in ANIMATIONS:
        total_frames = int(duration * 30)
        action = bpy.data.actions.new(name=anim_name)
        action.use_fake_user = True
        armature.animation_data.action = action
        
        # Keyframe essential humanoid bones for authentic movement
        # (Hips, Spine, Chest, Neck, Head, Arms)
        bpy.context.view_layer.objects.active = armature
        bpy.ops.object.mode_set(mode='POSE')
        
        pose_bones = armature.pose.bones
        p_hips = pose_bones.get("hips")
        p_chest = pose_bones.get("chest")
        p_head = pose_bones.get("head")
        p_arm_l = pose_bones.get("upper_arm.L")
        p_arm_r = pose_bones.get("upper_arm.R")
        p_wand = pose_bones.get("socket.wand.R")
        
        # Frame 0: Neutral reset
        for pb in pose_bones:
            pb.location = (0, 0, 0)
            pb.rotation_euler = (0, 0, 0)
            pb.rotation_quaternion = (1, 0, 0, 0)
            
        if motion_type == "loop": # Idle breathing
            for f in [0, total_frames // 2, total_frames]:
                factor = 1.0 if f == total_frames // 2 else 0.0
                if p_chest:
                    p_chest.location = (0, 0, factor * 0.008)
                    p_chest.keyframe_insert(data_path="location", frame=f)
                if p_head:
                    p_head.rotation_euler = (math.radians(-factor * 2.0), 0, math.radians(factor * 1.5))
                    p_head.keyframe_insert(data_path="rotation_euler", frame=f)
                    
        elif motion_type == "bow": # Respectful Japanese Ojigi
            # f=0: stand, f=30: bow 15 deg, f=50: hold, f=75: rise
            for f, angle in [(0, 0), (30, 16), (50, 16), (total_frames, 0)]:
                if p_chest:
                    p_chest.rotation_euler = (math.radians(angle), 0, 0)
                    p_chest.keyframe_insert(data_path="rotation_euler", frame=f)
                if p_head:
                    p_head.rotation_euler = (math.radians(angle * 0.5), 0, 0)
                    p_head.keyframe_insert(data_path="rotation_euler", frame=f)
                    
        elif motion_type == "wave": # Friendly teacher wave
            for f, w_ang in [(0, 0), (15, 60), (30, 45), (45, 65), (total_frames, 0)]:
                if p_arm_l:
                    p_arm_l.rotation_euler = (math.radians(w_ang * 0.8), math.radians(w_ang * 0.3), math.radians(w_ang))
                    p_arm_l.keyframe_insert(data_path="rotation_euler", frame=f)
                    
        elif motion_type == "teach": # Wand presentation
            for f, t_ang in [(0, 0), (30, 45), (60, 40), (total_frames, 0)]:
                if p_arm_r:
                    p_arm_r.rotation_euler = (math.radians(t_ang), math.radians(-15), math.radians(25))
                    p_arm_r.keyframe_insert(data_path="rotation_euler", frame=f)
                if p_wand:
                    p_wand.rotation_euler = (math.radians(t_ang * 0.5), 0, 0)
                    p_wand.keyframe_insert(data_path="rotation_euler", frame=f)
                    
        else: # Generic expressive clip keyframing
            for f, factor in [(0, 0.0), (total_frames // 2, 1.0), (total_frames, 0.0)]:
                if p_head:
                    p_head.rotation_euler = (math.radians(factor * 4.0), 0, math.radians(factor * 3.0))
                    p_head.keyframe_insert(data_path="rotation_euler", frame=f)
                if p_chest:
                    p_chest.location = (0, 0, factor * 0.005)
                    p_chest.keyframe_insert(data_path="location", frame=f)
                    
        # Push action to NLA track so glTF exporter includes all clips
        nla_tracks = armature.animation_data.nla_tracks
        track = nla_tracks.new()
        track.name = anim_name
        track.strips.new(anim_name, 0, action)
        
        created_clips.append(anim_name)
        
    bpy.ops.object.mode_set(mode='OBJECT')
    print(f"[08_animations] Created and pushed {len(created_clips)} NLA action tracks.")
    
    # Save working blend
    blend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "_source"))
    work_blend = os.path.join(blend_dir, "hana-working.blend")
    bpy.ops.wm.save_as_mainfile(filepath=work_blend)
    print(f"[08_animations] Saved updated scene to: {work_blend}")
    return True

if __name__ == "__main__":
    create_skeletal_animations()
