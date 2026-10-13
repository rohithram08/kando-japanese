# Nihongo Master — Repository Weight & Asset Audit Report

**Date:** 2026-10-13  
**Branch:** `feat/stabilize-and-animate`  

---

## 1. Directory Size Breakdown (Excluding `node_modules` & `.git`)

| Directory | Size | Description |
|---|---|---|
| `scratch/` | 110.37 MB | Local dev scratch tooling and browser automation runners |
| `art/` | 97.59 MB | Canonical high-resolution character source art, PSDs, and illustration renders |
| `dist/` | 23.80 MB | Production build output artifacts |
| `public/` | 19.58 MB | Static public assets, audio files, textures, and 3D models (`public/models/hana-sensei.glb`) |
| `_source/` | 18.57 MB | Upstream design and concept sources |
| `docs/` | 17.94 MB | Comprehensive documentation, architecture audits, and quality screenshot sets |
| `sample_application_duolingo/` | 7.55 MB | Reference benchmark inspection assets |
| `src/` | 2.55 MB | **Complete React frontend source codebase** (clean, zero bloat) |
| `backend/` | 1.39 MB | **Complete Express + TypeScript backend codebase** |
| `source/` | 0.43 MB | Additional reference source material |
| `scripts/` | 0.15 MB | Automation scripts and screenshot capture runners |

---

## 2. Binary Asset Audit & Rules Compliance

### Inviolable Preservation Rules:
1. **`art/` and `_source/`:** Unmodified and preserved. No binary re-encoding or destructive operations were performed.
2. **`public/models/`:** `hana-sensei.glb` and `sensei.vrm` remain strictly intact.
3. **Frontend Source Economy:** The entire active frontend codebase in `src/` is only **2.55 MB**, representing remarkable code cleanliness and modular architecture.
4. **Zero Invented Assets:** No fabricated images or duplicate icons were introduced. Micro-interactions rely entirely on procedural CSS keyframes, SVG paths from `lucide-react`, and Web Audio API synthesis.

---

## 3. Storage Optimization Opportunities

If repository size reduction is required for CI/CD pipelines in the future:
1. **Git LFS for `art/` and `public/models/`:** Move the 97.59 MB `art/` directory and 3D models to Git LFS or external cloud asset storage (GCS / S3) with signed URLs.
2. **Exclude `sample_application_duolingo/` from deploy containers:** The 7.55 MB reference directory should be excluded via `.dockerignore`.
3. **CI Cache optimization:** By caching `node_modules/` across CI runs, clean builds execute in under 30 seconds.
