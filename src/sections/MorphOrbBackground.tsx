import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 3D Simplex Noise (JavaScript implementation for CPU-side velocity calculations)
class SimplexNoise {
  private grad3: number[][];
  private perm: number[];

  constructor() {
    this.grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
    ];
    const p: number[] = [];
    for (let i = 0; i < 256; i++) p[i] = i;
    // Shuffle
    for (let i = 255; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [p[i], p[r]] = [p[r], p[i]];
    }
    this.perm = new Array(512);
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  noise3D(xin: number, yin: number, zin: number): number {
    const grad3 = this.grad3;
    const perm = this.perm;

    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;

    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);

    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    let i1: number, j1: number, k1: number;
    let i2: number, j2: number, k2: number;

    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let n0: number, n1: number, n2: number, n3: number;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0;
    else { t0 *= t0; n0 = t0 * t0 * (grad3[perm[ii + perm[jj + perm[kk]]] % 12][0] * x0 + grad3[perm[ii + perm[jj + perm[kk]]] % 12][1] * y0 + grad3[perm[ii + perm[jj + perm[kk]]] % 12][2] * z0); }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0;
    else { t1 *= t1; n1 = t1 * t1 * (grad3[perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12][0] * x1 + grad3[perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12][1] * y1 + grad3[perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12][2] * z1); }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0;
    else { t2 *= t2; n2 = t2 * t2 * (grad3[perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12][0] * x2 + grad3[perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12][1] * y2 + grad3[perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12][2] * z2); }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0;
    else { t3 *= t3; n3 = t3 * t3 * (grad3[perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12][0] * x3 + grad3[perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12][1] * y3 + grad3[perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12][2] * z3); }

    return 32.0 * (n0 + n1 + n2 + n3);
  }
}

const particleVertexShader = `
attribute float size;
attribute vec3 particleColor;
varying vec3 vColor;
uniform float uTime;
uniform float uPixelRatio;

void main() {
  vColor = particleColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * uPixelRatio * (50.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const particleFragmentShader = `
varying vec3 vColor;
uniform float uOpacity;

void main() {
  vec2 xy = gl_PointCoord.xy - vec2(0.5);
  float ll = length(xy);
  if (ll > 0.5) discard;
  float strength = 1.0 - (ll * 2.0);
  strength = pow(strength, 1.5);
  gl_FragColor = vec4(vColor, strength * uOpacity);
}
`;

export default function MorphOrbBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 800 : 1800;
    const spread = 120;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07070a);
    scene.fog = new THREE.FogExp2(0x07070a, 0.008);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    mountEl.appendChild(renderer.domElement);

    const canvasEl = renderer.domElement;
    canvasEl.style.position = 'fixed';
    canvasEl.style.inset = '0';
    canvasEl.style.zIndex = '0';
    canvasEl.setAttribute('aria-hidden', 'true');
    canvasEl.setAttribute('role', 'presentation');

    // Generate particle data
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3); // live, blended each frame
    const darkColors = new Float32Array(particleCount * 3);
    const lightColors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const simplex = new SimplexNoise();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      // Gold/amber palette for dark sections
      const darkHue = 0.08 + Math.random() * 0.04;
      const darkSat = 0.5 + Math.random() * 0.3;
      const darkLight = 0.4 + Math.random() * 0.4;
      const dCol = new THREE.Color().setHSL(darkHue, darkSat, darkLight);
      darkColors[i3] = dCol.r;
      darkColors[i3 + 1] = dCol.g;
      darkColors[i3 + 2] = dCol.b;

      // Deeper bronze/ember palette for light sections (reads on cream instead of washing out)
      const lightHue = 0.06 + Math.random() * 0.05;
      const lightSat = 0.55 + Math.random() * 0.35;
      const lightLight = 0.22 + Math.random() * 0.22;
      const lCol = new THREE.Color().setHSL(lightHue, lightSat, lightLight);
      lightColors[i3] = lCol.r;
      lightColors[i3 + 1] = lCol.g;
      lightColors[i3 + 2] = lCol.b;

      colors[i3] = dCol.r;
      colors[i3 + 1] = dCol.g;
      colors[i3 + 2] = dCol.b;

      sizes[i] = 0.5 + Math.random() * 1.5;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;
    }

    // Create geometry and material
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('particleColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const uniforms = {
      uTime: { value: 0.0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.25) },
      uOpacity: { value: 0.9 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- Network graph structure ---
    // Nodes and connecting edges, like a live system-architecture / dependency
    // graph — the visual language of software, not biology. Sits behind the
    // particle field for depth. Nodes drift and react to the cursor, and a
    // pulse of light continuously travels along each edge, like data moving
    // through a network. Everything is additive/emissive (same technique as
    // the particles) so it survives the frosted-glass section panels instead
    // of getting crushed under them.
    const graphGroup = new THREE.Group();
    graphGroup.position.z = -14;
    scene.add(graphGroup);

    const nodeCount = isMobile ? 8 : 14;
    const nodeSpreadX = 55;
    const nodeSpreadY = 65;
    const nodeSpreadZ = 16;

    const nodeHome: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodeHome.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * nodeSpreadX * 2,
          (Math.random() - 0.5) * nodeSpreadY * 2,
          (Math.random() - 0.5) * nodeSpreadZ
        )
      );
    }
    const nodeCurrent = nodeHome.map((v) => v.clone());
    const nodePhase = nodeHome.map(() => Math.random() * Math.PI * 2);

    // Connect each node to its nearest couple of neighbors within range —
    // produces an organic circuit/graph layout rather than a regular grid.
    type Edge = { a: number; b: number; phase: number };
    const edges: Edge[] = [];
    const edgeKeys = new Set<string>();
    const maxEdgeDist = 42;
    for (let i = 0; i < nodeCount; i++) {
      const dists = nodeHome
        .map((v, j) => ({ j, d: i === j ? Infinity : v.distanceTo(nodeHome[i]) }))
        .sort((p, q) => p.d - q.d);
      let added = 0;
      for (const { j, d } of dists) {
        if (added >= 2 || d > maxEdgeDist) break;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edges.push({ a: i, b: j, phase: Math.random() * Math.PI * 2 });
          added++;
        }
      }
    }

    // Nodes reuse the same glowing-dot shader as the particles for a
    // consistent visual language, just bigger and slower-breathing.
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    const nodeSizes = new Float32Array(nodeCount);
    for (let i = 0; i < nodeCount; i++) {
      nodePositions[i * 3] = nodeCurrent[i].x;
      nodePositions[i * 3 + 1] = nodeCurrent[i].y;
      nodePositions[i * 3 + 2] = nodeCurrent[i].z;
      nodeSizes[i] = 4.2 + Math.random() * 2.2;
    }
    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeometry.setAttribute('particleColor', new THREE.BufferAttribute(nodeColors, 3));
    nodeGeometry.setAttribute('size', new THREE.BufferAttribute(nodeSizes, 1));
    const nodeUniforms = {
      uTime: { value: 0.0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.25) },
      uOpacity: { value: 1.0 },
    };
    const nodeMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: nodeUniforms,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
    graphGroup.add(nodePoints);

    // Edges — subdivided so a bright pulse can travel smoothly along each one.
    const segsPerEdge = 14;
    const edgeVertexCount = edges.length * segsPerEdge * 2;
    const edgePositions = new Float32Array(edgeVertexCount * 3);
    const edgeColors = new Float32Array(edgeVertexCount * 3);
    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
    edgeGeometry.setAttribute('color', new THREE.BufferAttribute(edgeColors, 3));
    const edgeMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 1,
    });
    const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    graphGroup.add(edgeLines);

    const graphDarkColor = new THREE.Color(0xd4a853);
    const graphLightColor = new THREE.Color(0x8a5a2b);
    const liveGraphColor = new THREE.Color();
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();

    // Mouse tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let animationId: number;
    const clock = new THREE.Clock();

    // --- Scroll-driven theme blending ---
    // Every section on the page carries data-bg-theme="dark" | "light".
    // Each frame we measure how much of the viewport each theme currently
    // occupies and smoothly ease toward that ratio, so the background never
    // "snaps" — it drifts continuously as sections cross the viewport.
    const themeEls = Array.from(document.querySelectorAll<HTMLElement>('[data-bg-theme]'));
    const darkBgColor = new THREE.Color(0x07070a);
    const lightBgColor = new THREE.Color(0xf5f3ee);
    const currentBgColor = new THREE.Color(0x07070a);
    let themeBlend = 0; // 0 = fully dark theme, 1 = fully light theme
    let targetThemeBlend = 0;

    const updateTargetThemeBlend = () => {
      let darkCoverage = 0;
      let lightCoverage = 0;
      const vh = window.innerHeight;
      for (const el of themeEls) {
        const rect = el.getBoundingClientRect();
        const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (visible <= 0) continue;
        if (el.dataset.bgTheme === 'light') lightCoverage += visible;
        else darkCoverage += visible;
      }
      const total = darkCoverage + lightCoverage;
      targetThemeBlend = total > 0 ? lightCoverage / total : themeBlend;
    };

    const getScrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    let themeBlendRaf = 0;
    const scheduleThemeBlendUpdate = () => {
      if (themeBlendRaf) return;
      themeBlendRaf = requestAnimationFrame(() => {
        themeBlendRaf = 0;
        updateTargetThemeBlend();
      });
    };

    let resizePending = false;
    let resizeRafId = 0;
    const onResize = () => {
      if (resizePending) return;
      resizePending = true;
      resizeRafId = requestAnimationFrame(() => {
        resizePending = false;
        resizeRafId = 0;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        const pixelRatio = Math.min(window.devicePixelRatio, 1.25);
        material.uniforms.uPixelRatio.value = pixelRatio;
        nodeMaterial.uniforms.uPixelRatio.value = pixelRatio;
        updateTargetThemeBlend();
      });
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', scheduleThemeBlendUpdate, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    updateTargetThemeBlend();

    const animate = () => {
      if (document.hidden) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();
      material.uniforms.uTime.value = elapsed;

      // Smooth mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Ease the theme blend toward whatever the current scroll position calls for
      themeBlend += (targetThemeBlend - themeBlend) * 0.05;

      currentBgColor.lerpColors(darkBgColor, lightBgColor, themeBlend);
      scene.background = currentBgColor;
      (scene.fog as THREE.FogExp2).color.copy(currentBgColor);
      // Additive blending overexposes on a light backdrop, so ease opacity down as we lighten
      material.uniforms.uOpacity.value = 0.9 - themeBlend * 0.45;

      // Network graph: gentle whole-group rotation tied to scroll (a slow
      // drift, not a spin — this isn't meant to look like it's "unwinding"),
      // nodes breathe and drift, and react to the cursor like the particles do.
      const scrollProgress = getScrollProgress();
      graphGroup.rotation.y = scrollProgress * Math.PI * 0.5 + Math.sin(elapsed * 0.05) * 0.05;
      graphGroup.rotation.x = mouse.y * 0.08;
      graphGroup.position.z = -14 + scrollProgress * 8;

      liveGraphColor.lerpColors(graphDarkColor, graphLightColor, themeBlend);
      const graphOpacity = prefersReducedMotion ? 0.65 : 1.0 - themeBlend * 0.2;

      const gMouseWorldX = mouse.x * 45;
      const gMouseWorldY = mouse.y * 45;

      const nPos = nodePoints.geometry.attributes.position.array as Float32Array;
      const nCol = nodePoints.geometry.attributes.particleColor.array as Float32Array;
      const nSize = nodePoints.geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        const home = nodeHome[i];
        const cur = nodeCurrent[i];

        // Slow independent bob so the graph feels alive even at rest
        const bob = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.4 + nodePhase[i]) * 1.5;
        let tx = home.x;
        let ty = home.y + bob;
        const tz = home.z;

        // Cursor repulsion, same language as the particle field
        const dx = tx - gMouseWorldX;
        const dy = ty - gMouseWorldY;
        const distSq = dx * dx + dy * dy;
        const maxDist = 26;
        const maxDistSq = maxDist * maxDist;
        if (distSq < maxDistSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = ((maxDist - dist) / maxDist) * 6;
          tx += (dx / dist) * force;
          ty += (dy / dist) * force;
        }

        cur.x += (tx - cur.x) * 0.06;
        cur.y += (ty - cur.y) * 0.06;
        cur.z += (tz - cur.z) * 0.06;

        nPos[i * 3] = cur.x;
        nPos[i * 3 + 1] = cur.y;
        nPos[i * 3 + 2] = cur.z;

        const pulse = 0.7 + Math.sin(elapsed * 1.4 + nodePhase[i]) * 0.3;
        nCol[i * 3] = liveGraphColor.r * pulse;
        nCol[i * 3 + 1] = liveGraphColor.g * pulse;
        nCol[i * 3 + 2] = liveGraphColor.b * pulse;
        nSize[i] = (4.2 + (i % 3) * 1.2) * (0.85 + pulse * 0.3);
      }
      nodePoints.geometry.attributes.position.needsUpdate = true;
      nodePoints.geometry.attributes.particleColor.needsUpdate = true;
      nodePoints.geometry.attributes.size.needsUpdate = true;
      nodeMaterial.uniforms.uTime.value = elapsed;
      nodeMaterial.uniforms.uOpacity.value = graphOpacity;

      // Edges: rebuild the (small) subdivided line buffer from current node
      // positions each frame, with a bright pulse traveling a→b on a loop —
      // reads as data flowing through the connections.
      const ePos = edgeLines.geometry.attributes.position.array as Float32Array;
      const eCol = edgeLines.geometry.attributes.color.array as Float32Array;
      let vi = 0;
      for (const edge of edges) {
        const a = nodeCurrent[edge.a];
        const b = nodeCurrent[edge.b];
        const pulsePos = ((elapsed * 0.25 + edge.phase / (Math.PI * 2)) % 1 + 1) % 1;
        for (let s = 0; s < segsPerEdge; s++) {
          const t0 = s / segsPerEdge;
          const t1 = (s + 1) / segsPerEdge;
          tmpA.lerpVectors(a, b, t0);
          tmpB.lerpVectors(a, b, t1);

          const base = 0.16;
          const bright0 = base + Math.exp(-Math.pow((t0 - pulsePos) * 5, 2)) * 1.4;
          const bright1 = base + Math.exp(-Math.pow((t1 - pulsePos) * 5, 2)) * 1.4;

          ePos[vi * 3] = tmpA.x; ePos[vi * 3 + 1] = tmpA.y; ePos[vi * 3 + 2] = tmpA.z;
          eCol[vi * 3] = liveGraphColor.r * bright0;
          eCol[vi * 3 + 1] = liveGraphColor.g * bright0;
          eCol[vi * 3 + 2] = liveGraphColor.b * bright0;
          vi++;

          ePos[vi * 3] = tmpB.x; ePos[vi * 3 + 1] = tmpB.y; ePos[vi * 3 + 2] = tmpB.z;
          eCol[vi * 3] = liveGraphColor.r * bright1;
          eCol[vi * 3 + 1] = liveGraphColor.g * bright1;
          eCol[vi * 3 + 2] = liveGraphColor.b * bright1;
          vi++;
        }
      }
      edgeLines.geometry.attributes.position.needsUpdate = true;
      edgeLines.geometry.attributes.color.needsUpdate = true;
      edgeMaterial.opacity = graphOpacity;

      // Update particle positions
      const posArray = particles.geometry.attributes.position.array as Float32Array;
      const sizeArray = particles.geometry.attributes.size.array as Float32Array;
      const colorArray = particles.geometry.attributes.particleColor.array as Float32Array;

      const mouseWorldX = mouse.x * 40;
      const mouseWorldY = mouse.y * 40;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let x = posArray[i3];
        let y = posArray[i3 + 1];
        let z = posArray[i3 + 2];

        if (!prefersReducedMotion) {
          // Flow field noise
          const nx = x * 0.008 + elapsed * 0.08;
          const ny = y * 0.008 + elapsed * 0.06;
          const nz = z * 0.008 + elapsed * 0.04;

          velocities[i3] += simplex.noise3D(nx, ny, nz) * delta * 1.2;
          velocities[i3 + 1] += simplex.noise3D(ny, nz, nx) * delta * 1.2;
          velocities[i3 + 2] += simplex.noise3D(nz, nx, ny) * delta * 0.6;

          // Damping
          velocities[i3] *= 0.98;
          velocities[i3 + 1] *= 0.98;
          velocities[i3 + 2] *= 0.98;

          // Apply velocity
          x += velocities[i3];
          y += velocities[i3 + 1];
          z += velocities[i3 + 2];

          // Mouse repulsion
          const dx = x - mouseWorldX;
          const dy = y - mouseWorldY;
          const distSq = dx * dx + dy * dy;
          const maxDist = 20;
          const maxDistSq = maxDist * maxDist;
          if (distSq < maxDistSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (maxDist - dist) / maxDist * 0.15;
            x += (dx / dist) * force;
            y += (dy / dist) * force;
          }
        }

        // Wraparound
        if (x > spread / 2) x -= spread;
        else if (x < -spread / 2) x += spread;
        if (y > spread / 2) y -= spread;
        else if (y < -spread / 2) y += spread;
        if (z > 30) z -= 60;
        else if (z < -30) z += 60;

        posArray[i3] = x;
        posArray[i3 + 1] = y;
        posArray[i3 + 2] = z;

        // Blend this particle's color toward the current scroll theme
        colorArray[i3] = darkColors[i3] + (lightColors[i3] - darkColors[i3]) * themeBlend;
        colorArray[i3 + 1] = darkColors[i3 + 1] + (lightColors[i3 + 1] - darkColors[i3 + 1]) * themeBlend;
        colorArray[i3 + 2] = darkColors[i3 + 2] + (lightColors[i3 + 2] - darkColors[i3 + 2]) * themeBlend;

        // Calm center zone — reduce size near center for text readability
        const distFromCenter = Math.sqrt(x * x + y * y);
        const calmRadius = 15;
        if (distFromCenter < calmRadius) {
          const calmFactor = distFromCenter / calmRadius;
          sizeArray[i] = sizes[i] * Math.max(calmFactor, 0.15);
        } else {
          sizeArray[i] = sizes[i];
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;
      particles.geometry.attributes.particleColor.needsUpdate = true;

      // Gentle rotation
      particles.rotation.y = elapsed * 0.008;
      particles.rotation.x = Math.sin(elapsed * 0.005) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      cancelAnimationFrame(resizeRafId);
      cancelAnimationFrame(themeBlendRaf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', scheduleThemeBlendUpdate);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      mountEl.innerHTML = '';
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />;
}
