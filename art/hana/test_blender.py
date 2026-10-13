import sys
import bpy

print("=== BLENDER PYTHON ENVIRONMENT TEST ===")
print("Blender version:", bpy.app.version_string)
print("Python version:", sys.version)
print("Executable:", bpy.app.binary_path)

# Check rendering engines
engines = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items]
print("Available rendering engines:", engines)

# Check Cycles GPU devices if cycles addon exists
try:
    cycles_prefs = bpy.context.preferences.addons['cycles'].preferences
    devices = cycles_prefs.get_devices()
    print("Cycles device types:", [t[0] for t in cycles_prefs.get_device_types(bpy.context)])
    print("Detected GPU/CPU compute devices:")
    for d in cycles_prefs.devices:
        print(f"  - {d.name} ({d.type}, use={d.use})")
except Exception as e:
    print("Cycles preferences error or not available:", e)

# Test basic mesh and shape key creation
bpy.ops.wm.read_factory_settings(use_empty=True)
mesh = bpy.data.meshes.new("TestMesh")
obj = bpy.data.objects.new("TestObject", mesh)
bpy.context.collection.objects.link(obj)

import bmesh
bm = bmesh.new()
bmesh.ops.create_cube(bm, size=1.0)
bm.to_mesh(mesh)
bm.free()

# Test shape key
sk_basis = obj.shape_key_add(name="Basis")
sk_test = obj.shape_key_add(name="test_morph")
print("Shape keys created successfully:", len(obj.data.shape_keys.key_blocks))

# Test glTF export operator availability
has_gltf = hasattr(bpy.ops.export_scene, "gltf")
print("glTF 2.0 export operator available:", has_gltf)

print("=== BLENDER TEST COMPLETE: SUCCESS ===")
