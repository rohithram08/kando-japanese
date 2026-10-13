"""
HANA-SENSEI 3D PRODUCTION PIPELINE — MASTER ORCHESTRATOR
========================================================
Executes the complete 10-step character production pipeline in sequence:
  Step 01: Import Base Asset (VRM/GLB)
  Step 02: Character Cleanup & Hierarchy Standardization
  Step 03: Costume Construction (Furisode & Obi)
  Step 04: Accessories & Prop Socketing (Cap, Tassel, Wand)
  Step 05: Canonical 20-Color PBR Materials
  Step 06: Humanoid & Accessory Rig Extension
  Step 07: Facial Morph Shape Key Mapping (18 targets)
  Step 08: Skeletal Animation Action Keyframing (14 clips)
  Step 09: Production Optimization (Triangles & Height)
  Step 10: GLB & Blend Master Export
  Step 11: Validation & Turnaround Rendering

Usage:
  blender --background --python art/hana/blender/run_pipeline.py -- _source/hana-base.vrm
"""

import os
import sys
import subprocess

PIPELINE_STEPS = [
    "01_import.py",
    "02_character_cleanup.py",
    "03_costume.py",
    "04_accessories.py",
    "05_materials.py",
    "06_rig.py",
    "07_facial_shapes.py",
    "08_animations.py",
    "09_optimize.py",
    "10_export.py",
    "validate_asset.py"
]

def run_master_pipeline():
    print("=" * 75)
    print("HANA-SENSEI MASTER 3D PRODUCTION PIPELINE START")
    print("=" * 75)
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    blender_exe = bpy.app.binary_path if 'bpy' in globals() else "blender"
    
    # Forward any CLI arguments (like custom base model path)
    custom_args = []
    if "--" in sys.argv:
        custom_args = sys.argv[sys.argv.index("--"):]
        
    for step_file in PIPELINE_STEPS:
        step_path = os.path.join(script_dir, step_file)
        if not os.path.exists(step_path):
            print(f"[ERROR] Step script missing: {step_path}")
            return False
            
        print(f"\n>>> EXECUTING STEP: {step_file} <<<")
        
        # If running inside Blender, execute directly
        if 'bpy' in globals():
            with open(step_path, 'r', encoding='utf-8') as f:
                code = compile(f.read(), step_path, 'exec')
                exec(code, globals())
        else:
            cmd = [blender_exe, "--background", "--python", step_path]
            if custom_args:
                cmd.extend(custom_args)
            res = subprocess.run(cmd)
            if res.returncode != 0:
                print(f"[ERROR] Pipeline aborted at step: {step_file}")
                return False
                
    print("\n" + "=" * 75)
    print("HANA-SENSEI MASTER 3D PRODUCTION PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 75)
    return True

if __name__ == "__main__":
    success = run_master_pipeline()
    if not success:
        sys.exit(1)
