"""
CHECKPOINT 3 — STAGE 3: SKELETAL ANIMATION SUITE (14 CLIPS)
===========================================================
Creates 14 canonical animation clips for Hana-sensei:
1. idle
2. greeting
3. waving
4. talking
5. thinking
6. happy
7. encouraging
8. confused
9. celebrating
10. teaching
11. pointing
12. listening
13. error
14. sleeping

All clips use real humanoid skeletal keyframes on Hana_Armature.
Pushes all clips to NLA strips with Fake User so glTF exporter includes them.
"""

import bpy
import math
import os
import sys
from mathutils import Euler, Quaternion, Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
MASTER_BLEND = os.path.join(ROOT, "art", "hana", "blender", "_source", "hana-sensei-master.blend")

def build_animations():
    print("=" * 70)
    print("STAGE 3: BUILDING 14 CANONICAL SKELETAL ANIMATIONS")
    print("=" * 70)

    bpy.ops.wm.open_mainfile(filepath=MASTER_BLEND)
    armature = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='POSE')

    # Ensure animation data
    if not armature.animation_data:
        armature.animation_data_create()

    pose_bones = armature.pose.bones

    # Helper function to reset all pose bones to rest pose
    def reset_pose():
        for pb in pose_bones:
            pb.location = (0, 0, 0)
            pb.rotation_quaternion = (1, 0, 0, 0)
            pb.rotation_euler = (0, 0, 0)
            pb.scale = (1, 1, 1)

    # Helper function to apply a finger grip pose on right hand
    def apply_right_hand_grip(grip_strength=0.75):
        # Curl fingers around wand handle
        finger_prefixes = ["J_Bip_R_Index", "J_Bip_R_Middle", "J_Bip_R_Ring", "J_Bip_R_Little"]
        for prefix in finger_prefixes:
            for seg in [1, 2, 3]:
                # Try both naming conventions: e.g. J_Bip_R_Index1 or J_Bip_R_Index_Proximal
                for bname in [f"{prefix}{seg}", f"{prefix}_{seg}", f"{prefix}Distal", f"{prefix}Proximal", f"{prefix}Intermediate"]:
                    pb = pose_bones.get(bname)
                    if pb:
                        pb.rotation_mode = 'XYZ'
                        pb.rotation_euler = (0, 0, math.radians(-35 * grip_strength))

        # Thumb wraps around opposite side
        for bname in ["J_Bip_R_Thumb1", "J_Bip_R_Thumb2", "J_Bip_R_Thumb3", "J_Bip_R_Thumb_Proximal", "J_Bip_R_Thumb_Intermediate", "J_Bip_R_Thumb_Distal"]:
            pb = pose_bones.get(bname)
            if pb:
                pb.rotation_mode = 'XYZ'
                pb.rotation_euler = (math.radians(-20 * grip_strength), 0, math.radians(25 * grip_strength))

    # Helper function to set keyframe on bone rotation/location
    def key_bone(pb, frame, rot_euler=None, loc=None):
        if not pb:
            return
        pb.rotation_mode = 'XYZ'
        if rot_euler is not None:
            pb.rotation_euler = Euler((math.radians(rot_euler[0]), math.radians(rot_euler[1]), math.radians(rot_euler[2])), 'XYZ')
            pb.keyframe_insert(data_path="rotation_euler", frame=frame)
        if loc is not None:
            pb.location = Vector(loc)
            pb.keyframe_insert(data_path="location", frame=frame)

    created_actions = []

    # Map bone shortcuts to actual VRoid bone names
    b_hips = pose_bones.get("J_Bip_C_Hips")
    b_spine = pose_bones.get("J_Bip_C_Spine")
    b_chest = pose_bones.get("J_Bip_C_Chest")
    b_upper_chest = pose_bones.get("J_Bip_C_UpperChest")
    b_neck = pose_bones.get("J_Bip_C_Neck")
    b_head = pose_bones.get("J_Bip_C_Head")

    b_arm_l = pose_bones.get("J_Bip_L_UpperArm")
    b_forearm_l = pose_bones.get("J_Bip_L_LowerArm")
    b_hand_l = pose_bones.get("J_Bip_L_Hand")

    b_arm_r = pose_bones.get("J_Bip_R_UpperArm")
    b_forearm_r = pose_bones.get("J_Bip_R_LowerArm")
    b_hand_r = pose_bones.get("J_Bip_R_Hand")

    b_wand = pose_bones.get("Socket_Wand_R")

    # =============================================================
    # 1. IDLE (60 frames, 2.0s looped)
    # =============================================================
    act_idle = bpy.data.actions.new(name="idle")
    armature.animation_data.action = act_idle
    reset_pose()
    apply_right_hand_grip(0.8)

    for f, breath in [(1, 0), (30, 1), (60, 0)]:
        # Base natural standing posture: arms resting down from T-pose
        key_bone(b_arm_l, f, (0, 0, -68 + breath * 2))
        key_bone(b_forearm_l, f, (0, 20, 15))
        # Right arm holds wand neatly in front
        key_bone(b_arm_r, f, (-15, -10, 58 - breath * 1))
        key_bone(b_forearm_r, f, (-25, -35, -20))
        # Subtle spine breathing
        key_bone(b_spine, f, (0, 0, 0), (0, 0, breath * 0.005))
        key_bone(b_chest, f, (breath * 1.5, 0, 0))
        key_bone(b_head, f, (breath * -1.0, breath * 1.0, 0))
    created_actions.append(act_idle)

    # =============================================================
    # 2. GREETING (60 frames, 2.0s polite bow)
    # =============================================================
    act_greet = bpy.data.actions.new(name="greeting")
    armature.animation_data.action = act_greet
    reset_pose()
    apply_right_hand_grip(0.85)

    # Frame 1: standing neutral
    key_bone(b_spine, 1, (0, 0, 0))
    key_bone(b_chest, 1, (0, 0, 0))
    key_bone(b_head, 1, (0, 0, 0))
    key_bone(b_arm_l, 1, (0, 0, -65))
    key_bone(b_arm_r, 1, (-15, -10, 58))
    key_bone(b_forearm_r, 1, (-25, -35, -20))

    # Frame 25-35: bow down 25 degrees
    for f in [25, 35]:
        key_bone(b_spine, f, (18, 0, 0))
        key_bone(b_chest, f, (12, 0, 0))
        key_bone(b_head, f, (-10, 0, 0))
        # Hands fold neatly in front
        key_bone(b_arm_l, f, (15, 0, -55))
        key_bone(b_forearm_l, f, (0, 35, 25))
        key_bone(b_arm_r, f, (15, -5, 52))
        key_bone(b_forearm_r, f, (-30, -30, -25))

    # Frame 60: return to upright
    key_bone(b_spine, 60, (0, 0, 0))
    key_bone(b_chest, 60, (0, 0, 0))
    key_bone(b_head, 60, (2, 0, 0))
    key_bone(b_arm_l, 60, (0, 0, -65))
    key_bone(b_arm_r, 60, (-15, -10, 58))
    key_bone(b_forearm_r, 60, (-25, -35, -20))
    created_actions.append(act_greet)

    # =============================================================
    # 3. WAVING (60 frames, 2.0s cheerful wave)
    # =============================================================
    act_wave = bpy.data.actions.new(name="waving")
    armature.animation_data.action = act_wave
    reset_pose()
    apply_right_hand_grip(0.8)

    # Left arm raised high waving
    key_bone(b_arm_l, 1, (0, 15, 65))
    key_bone(b_forearm_l, 1, (0, 45, 30))
    key_bone(b_hand_l, 1, (0, 0, -15))

    key_bone(b_arm_l, 20, (0, 20, 68))
    key_bone(b_forearm_l, 20, (0, 50, 35))
    key_bone(b_hand_l, 20, (0, 0, 20))

    key_bone(b_arm_l, 40, (0, 15, 65))
    key_bone(b_forearm_l, 40, (0, 45, 30))
    key_bone(b_hand_l, 40, (0, 0, -20))

    key_bone(b_arm_l, 60, (0, 15, 65))
    key_bone(b_forearm_l, 60, (0, 45, 30))
    key_bone(b_hand_l, 60, (0, 0, -15))

    # Head tilts playfully
    key_bone(b_head, 1, (0, 5, 5))
    key_bone(b_head, 30, (0, -5, -5))
    key_bone(b_head, 60, (0, 5, 5))

    # Right hand holds wand neatly
    for f in [1, 30, 60]:
        key_bone(b_arm_r, f, (-15, -10, 58))
        key_bone(b_forearm_r, f, (-25, -35, -20))
    created_actions.append(act_wave)

    # =============================================================
    # 4. TALKING (60 frames, 2.0s conversational gestures)
    # =============================================================
    act_talk = bpy.data.actions.new(name="talking")
    armature.animation_data.action = act_talk
    reset_pose()
    apply_right_hand_grip(0.8)

    for f, d in [(1, 0), (20, 1), (40, -1), (60, 0)]:
        key_bone(b_head, f, (d * 3.0, d * 2.0, 0))
        key_bone(b_arm_r, f, (-20 + d * 6, -10, 55 + d * 5))
        key_bone(b_forearm_r, f, (-30 + d * 8, -35, -18))
        key_bone(b_arm_l, f, (d * 4, 0, -62 + d * 4))
        key_bone(b_forearm_l, f, (0, 25 + d * 5, 15))
    created_actions.append(act_talk)

    # =============================================================
    # 5. THINKING (60 frames, 2.0s contemplative pose)
    # =============================================================
    act_think = bpy.data.actions.new(name="thinking")
    armature.animation_data.action = act_think
    reset_pose()
    apply_right_hand_grip(0.8)

    # Left hand to chin, head tilted up-right
    for f, d in [(1, 0), (30, 1), (60, 0)]:
        key_bone(b_head, f, (-6 + d * 1.5, 8, 4))
        key_bone(b_arm_l, f, (15, 20, -25))
        key_bone(b_forearm_l, f, (0, 85 + d * 2, 40))
        key_bone(b_hand_l, f, (-10, 0, -15))
        # Right arm holds wand comfortably low
        key_bone(b_arm_r, f, (-10, -5, 62))
        key_bone(b_forearm_r, f, (-15, -25, -15))
    created_actions.append(act_think)

    # =============================================================
    # 6. HAPPY (45 frames, 1.5s cheerful celebration bounce)
    # =============================================================
    act_happy = bpy.data.actions.new(name="happy")
    armature.animation_data.action = act_happy
    reset_pose()
    apply_right_hand_grip(0.85)

    for f, lift in [(1, 0), (22, 1), (45, 0)]:
        key_bone(b_hips, f, (0, 0, 0), (0, 0, lift * 0.025))
        key_bone(b_head, f, (lift * -3.0, lift * 6.0, lift * 3.0))
        key_bone(b_arm_r, f, (-25 + lift * 15, -15, 45 - lift * 10))
        key_bone(b_forearm_r, f, (-45, -45, -15))
        key_bone(b_arm_l, f, (lift * 10, lift * 10, -45 + lift * 15))
        key_bone(b_forearm_l, f, (0, 45 + lift * 15, 25))
    created_actions.append(act_happy)

    # =============================================================
    # 7. ENCOURAGING (60 frames, 2.0s "Ganbatte!" gesture)
    # =============================================================
    act_encourage = bpy.data.actions.new(name="encouraging")
    armature.animation_data.action = act_encourage
    reset_pose()
    apply_right_hand_grip(0.9)

    # Body leans forward confidently, wand extends forward
    for f, pulse in [(1, 0), (25, 1), (45, 0.5), (60, 0)]:
        key_bone(b_spine, f, (pulse * 6.0, 0, 0))
        key_bone(b_chest, f, (pulse * 4.0, 0, 0))
        key_bone(b_head, f, (pulse * -3.0, 0, 0))
        # Right wand extends forward encouragingly
        key_bone(b_arm_r, f, (-35 - pulse * 12, -15, 35 - pulse * 8))
        key_bone(b_forearm_r, f, (-20 - pulse * 10, -30, -10))
        # Left hand makes gentle fist at chest
        key_bone(b_arm_l, f, (10, 10, -50))
        key_bone(b_forearm_l, f, (0, 55 + pulse * 10, 30))
    created_actions.append(act_encourage)

    # =============================================================
    # 8. CONFUSED (60 frames, 2.0s puzzled head tilt)
    # =============================================================
    act_confused = bpy.data.actions.new(name="confused")
    armature.animation_data.action = act_confused
    reset_pose()
    apply_right_hand_grip(0.8)

    for f, d in [(1, 0), (30, 1), (60, 0)]:
        key_bone(b_head, f, (2, -12 * d, -4 * d))
        key_bone(b_arm_l, f, (5, -5, -55 + d * 10))
        key_bone(b_forearm_l, f, (0, 35 + d * 15, 25))
        key_bone(b_arm_r, f, (-15, -10, 58))
        key_bone(b_forearm_r, f, (-25, -35, -20))
    created_actions.append(act_confused)

    # =============================================================
    # 9. CELEBRATING (60 frames, 2.0s triumphant wand aloft)
    # =============================================================
    act_celeb = bpy.data.actions.new(name="celebrating")
    armature.animation_data.action = act_celeb
    reset_pose()
    apply_right_hand_grip(0.95)

    # Right wand aloft high in air, left arm raised in victory
    for f, b in [(1, 0), (30, 1), (60, 0)]:
        key_bone(b_hips, f, (0, 0, 0), (0, 0, b * 0.03))
        key_bone(b_chest, f, (b * -4, 0, 0))
        key_bone(b_head, f, (-10 - b * 5, 0, 0))
        # Wand arm high overhead
        key_bone(b_arm_r, f, (-45 - b * 15, -25, -25 - b * 15))
        key_bone(b_forearm_r, f, (-10, -20, 0))
        # Left arm high overhead
        key_bone(b_arm_l, f, (b * 15, 20, 65 + b * 10))
        key_bone(b_forearm_l, f, (0, 45, 25))
    created_actions.append(act_celeb)

    # =============================================================
    # 10. TEACHING (60 frames, 2.0s sensei lecture gesture)
    # =============================================================
    act_teach = bpy.data.actions.new(name="teaching")
    armature.animation_data.action = act_teach
    reset_pose()
    apply_right_hand_grip(0.85)

    for f, p in [(1, 0), (25, 1), (45, -0.5), (60, 0)]:
        key_bone(b_spine, f, (2, 0, p * 2))
        key_bone(b_head, f, (p * 2, p * 3, 0))
        # Wand draws attention to board
        key_bone(b_arm_r, f, (-30 + p * 8, -15, 40 - p * 6))
        key_bone(b_forearm_r, f, (-25 + p * 5, -25, -15))
        key_bone(b_arm_l, f, (0, 5, -60))
        key_bone(b_forearm_l, f, (0, 25, 15))
    created_actions.append(act_teach)

    # =============================================================
    # 11. POINTING (60 frames, 2.0s precise UI pointer)
    # =============================================================
    act_point = bpy.data.actions.new(name="pointing")
    armature.animation_data.action = act_point
    reset_pose()
    apply_right_hand_grip(0.95)

    # Right arm and wand pointed directly forward at UI element
    for f, sway in [(1, 0), (30, 1), (60, 0)]:
        key_bone(b_chest, f, (0, 0, 5))
        key_bone(b_head, f, (0, -2, -3))
        # Precise straight arm point
        key_bone(b_arm_r, f, (-70, -10, 15 + sway * 1))
        key_bone(b_forearm_r, f, (-10, -5, 0))
        # Wand aligned with pointing direction
        key_bone(b_arm_l, f, (0, 0, -65))
        key_bone(b_forearm_l, f, (0, 20, 15))
    created_actions.append(act_point)

    # =============================================================
    # 12. LISTENING (60 frames, 2.0s patient attentive listening)
    # =============================================================
    act_listen = bpy.data.actions.new(name="listening")
    armature.animation_data.action = act_listen
    reset_pose()
    apply_right_hand_grip(0.8)

    for f, n in [(1, 0), (20, 1), (40, 0), (60, 0)]:
        # Subtle attentive nod
        key_bone(b_head, f, (n * 3.5, 4, 0))
        key_bone(b_chest, f, (n * 1.0, 0, 0))
        key_bone(b_arm_r, f, (-15, -10, 58))
        key_bone(b_forearm_r, f, (-25, -35, -20))
        key_bone(b_arm_l, f, (0, 0, -65))
        key_bone(b_forearm_l, f, (0, 20, 15))
    created_actions.append(act_listen)

    # =============================================================
    # 13. ERROR (60 frames, 2.0s gentle sympathetic reassurance)
    # =============================================================
    act_error = bpy.data.actions.new(name="error")
    armature.animation_data.action = act_error
    reset_pose()
    apply_right_hand_grip(0.8)

    for f, s in [(1, 0), (15, 1), (30, -1), (45, 0.5), (60, 0)]:
        # Gentle sympathetic head shake
        key_bone(b_head, f, (1, s * 4.0, s * 2.0))
        key_bone(b_chest, f, (1.5, 0, 0))
        key_bone(b_arm_r, f, (-10, -5, 60))
        key_bone(b_forearm_r, f, (-20, -30, -18))
        key_bone(b_arm_l, f, (0, 0, -62))
        key_bone(b_forearm_l, f, (0, 25, 20))
    created_actions.append(act_error)

    # =============================================================
    # 14. SLEEPING (60 frames, 2.0s calm resting breathing)
    # =============================================================
    act_sleep = bpy.data.actions.new(name="sleeping")
    armature.animation_data.action = act_sleep
    reset_pose()
    apply_right_hand_grip(0.7)

    for f, b in [(1, 0), (30, 1), (60, 0)]:
        # Drooping relaxed head and shoulders
        key_bone(b_head, f, (8 + b * 1.5, 3, 0))
        key_bone(b_spine, f, (2, 0, 0), (0, 0, -b * 0.005))
        key_bone(b_chest, f, (-b * 1.5, 0, 0))
        key_bone(b_arm_r, f, (-10, -5, 65))
        key_bone(b_forearm_r, f, (-15, -25, -15))
        key_bone(b_arm_l, f, (0, 0, -68))
        key_bone(b_forearm_l, f, (0, 15, 10))
    created_actions.append(act_sleep)

    # -------------------------------------------------------------
    # PUSH ACTIONS TO NLA STRIPS (Ensures glTF export exports all clips)
    # -------------------------------------------------------------
    print("\n  Pushing all 14 actions to NLA tracks...")
    bpy.ops.object.mode_set(mode='OBJECT')

    for act in created_actions:
        act.use_fake_user = True
        track = armature.animation_data.nla_tracks.new()
        track.name = act.name
        strip = track.strips.new(act.name, int(act.frame_range[0]), act)
        strip.name = act.name
        print(f"    [NLA] Track '{track.name}' created ({int(act.frame_range[1])} frames)")

    # Set default active action to idle
    armature.animation_data.action = act_idle

    # Save to master .blend file
    bpy.ops.wm.save_as_mainfile(filepath=MASTER_BLEND)
    print(f"\n  Successfully created and saved all {len(created_actions)} animation clips to: {MASTER_BLEND}")
    return True

if __name__ == "__main__":
    build_animations()
