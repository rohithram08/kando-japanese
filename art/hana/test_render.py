import bpy
import math

# Clear all objects
bpy.ops.wm.read_factory_settings(use_empty=True)

# Add a camera
cam_data = bpy.data.cameras.new("TestCam")
cam_obj = bpy.data.objects.new("TestCam", cam_data)
bpy.context.collection.objects.link(cam_obj)
cam_obj.location = (0, -3.0, 1.5)
cam_obj.rotation_euler = (math.radians(90), 0, 0)
bpy.context.scene.camera = cam_obj

# Add a light
light_data = bpy.data.lights.new("TestLight", type='SUN')
light_data.energy = 2.0
light_obj = bpy.data.objects.new("TestLight", light_data)
bpy.context.collection.objects.link(light_obj)
light_obj.rotation_euler = (math.radians(45), math.radians(30), 0)

# Add a quick test Suzanne head to test Eevee rendering
bpy.ops.mesh.primitive_monkey_add(location=(0, 0, 1.5))

# Set render settings
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 512
scene.render.resolution_y = 512
scene.render.filepath = "e:/Nihongo-testing/nihongo-master/art/hana/validation/test_render.png"

# Render
bpy.ops.render.render(write_still=True)
print("Render completed successfully to:", scene.render.filepath)
