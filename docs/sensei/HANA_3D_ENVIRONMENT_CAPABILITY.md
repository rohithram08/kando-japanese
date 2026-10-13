# HANA-SENSEI — 3D ENVIRONMENT CAPABILITY AUDIT

**Date**: 2026-09-07  
**Machine**: Windows (AMD Ryzen 3 7320U)  
**Purpose**: Determine what this machine can use for real 3D character production

---

## 1. Hardware

| Resource | Value | Assessment |
|---|---|:---:|
| **CPU** | AMD Ryzen 3 7320U, 4 cores / 8 threads | ⚠️ Low-end mobile |
| **GPU** | AMD Radeon (integrated), 512 MB VRAM | ⚠️ Integrated only |
| **RAM** | 7.3 GB total, ~1.1 GB free | ⚠️ Very tight |
| **Disk** | 21.23 GB free on E: | ✅ Sufficient |
| **Rendering** | No discrete GPU. Eevee possible, Cycles will be very slow | ⚠️ CPU-only rendering |

**Assessment**: Low-end hardware. Blender will run but slowly. No CUDA/OptiX. Eevee rendering feasible. Cycles will be CPU-bound. 7.3 GB RAM may struggle with complex scenes.

---

## 2. Installed Software

### Core Runtime

| Tool | Version | Status |
|---|---|:---:|
| **Python** | 3.12.10 | ✅ Installed |
| **Node.js** | v24.13.0 | ✅ Installed |
| **npm** | 11.17.0 | ✅ Installed |
| **npx** | 11.17.0 | ✅ Installed |
| **Git** | 2.53.0 | ✅ Installed |
| **winget** | v1.29.290 | ✅ Installed |
| **curl** | 8.21.0 | ✅ Installed |

### 3D / Modeling Tools

| Tool | Status |
|---|:---:|
| **Blender** | ❌ NOT INSTALLED |
| **VRoid Studio** | ❌ NOT INSTALLED |
| **AccuRIG** | ❌ NOT INSTALLED |
| **Mixamo** | ⚡ Web-based (free, Adobe account) |

### JavaScript 3D Libraries (in project)

| Library | Version | Status |
|---|---|:---:|
| **Three.js** | 0.185.1 | ✅ In node_modules |
| **@react-three/fiber** | Present | ✅ In node_modules |
| **@react-three/drei** | Present | ✅ In node_modules |
| **@pixiv/three-vrm** | Present | ✅ In node_modules |

### Python Scientific Packages

| Package | Status |
|---|:---:|
| **numpy** | ✅ 2.4.3 |
| **pillow** | ✅ 12.1.1 |
| **scipy** | ✅ 1.17.1 |
| **trimesh** | ❌ Not installed |
| **pygltflib** | ❌ Not installed |
| **open3d** | ❌ Not installed |
| **bpy** (standalone Blender Python) | ❌ Not installed |

### Image / Media Tools

| Tool | Status |
|---|:---:|
| **ImageMagick** | ❌ NOT INSTALLED |
| **FFmpeg** | ❌ NOT INSTALLED |
| **sharp** (Node) | ❌ Not installed |

### GLB Validators / Converters

| Tool | Status |
|---|:---:|
| **gltf-pipeline** (npm) | ⚡ Available via npx (not cached) |
| **gltf-validator** | ❌ NOT INSTALLED |
| **GLTFExporter** (Three.js) | ✅ Available in node_modules |
| **GLTFLoader** (Three.js) | ✅ Available in node_modules |

---

## 3. Network / Download Capability

| Capability | Status |
|---|:---:|
| HTTP downloads | ✅ Working (tested httpbin.org) |
| curl.exe | ✅ Available |
| Invoke-WebRequest | ✅ Available |
| winget install | ✅ Available |
| npm install | ✅ Available |
| pip install | ✅ Available |

**Can download external software**: YES

---

## 4. Key Capabilities Summary

### CAN DO (Today)
- ✅ Run Three.js scripts via Node.js (GLTFLoader, GLTFExporter)
- ✅ Process images via Python (Pillow, numpy)
- ✅ Download and install new software (winget, curl, pip, npm)
- ✅ Load and validate GLB files
- ✅ Export GLB files with morph targets and animations
- ✅ Use @pixiv/three-vrm to load VRM models

### CANNOT DO (Without Installation)
- ❌ Sculpt organic 3D geometry (needs Blender)
- ❌ UV unwrap meshes (needs Blender)
- ❌ Bake textures (needs Blender)
- ❌ Create skeletal rigs (needs Blender)
- ❌ Weight paint (needs Blender)
- ❌ Create real morph targets on sculpted geometry (needs Blender)
- ❌ Create multi-bone skeletal animation (needs Blender)
- ❌ Process/convert FBX files (needs Blender or dedicated tool)
- ❌ Run AI image-to-3D locally (not feasible on this hardware)

### INSTALLABLE
- 🔧 **Blender Portable** — ~800MB ZIP, no admin needed, unlocks full 3D pipeline
- 🔧 **VRoid Studio** — Free, Steam or direct download, anime character creation
- 🔧 **AccuRIG** — Free, Windows, auto-rigging for humanoids
- 🔧 **trimesh** (Python) — `pip install trimesh`, mesh processing
- 🔧 **pygltflib** (Python) — `pip install pygltflib`, GLB read/write

---

## 5. Web-Based Services (No Installation Needed)

| Service | What It Does | Free Tier | Anime Quality |
|---|---|:---:|:---:|
| **Meshy.ai** | Image-to-3D, auto-rig, animate | ✅ Limited credits | ⚠️ Moderate |
| **Tripo3D** | Image-to-3D, PBR, quad-remesh | ✅ Limited credits | ⚠️ Good |
| **Rodin (Hyper3D)** | Image-to-3D, anime presets | ✅ Limited credits | ✅ Good |
| **Mixamo** | Auto-rig, animation library | ✅ Free (Adobe) | N/A (rigging only) |
| **AccuRIG Online** | Auto-rigging | ✅ Free | N/A (rigging only) |

---

## 6. Blender Installation Feasibility

| Requirement | Status |
|---|:---:|
| **Disk space** | ✅ 21 GB free (needs ~800 MB) |
| **Admin rights** | ✅ Not needed (portable ZIP) |
| **Download** | ✅ curl/browser available |
| **Python API** | ✅ Bundled with Blender |
| **Headless mode** | ✅ `blender --background --python script.py` |
| **GPU for Eevee** | ⚠️ Integrated AMD — will work but slowly |
| **RAM for modeling** | ⚠️ 7.3 GB total — tight for complex scenes |

**VERDICT**: Blender CAN be installed as portable. It is the critical missing tool for real 3D production.
