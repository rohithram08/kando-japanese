import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

console.log('THREE version:', THREE.REVISION);
console.log('GLTFExporter available:', typeof GLTFExporter === 'function');
