"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useRef } from "react";

/**
 * THE SERVER GATE — Backend / BaaS showcase.
 *
 * The untextured sculpt (no UVs, two meshes) gets:
 *   1. generated box-projected UVs,
 *   2. a procedural emissive texture — dark metal panels with glowing
 *      blue channel lines (matching the backend-baas key art),
 *   3. a chrome shell material fed by a code-generated environment.
 *
 * The outer ring rotates uniformly by default. Pointer devices can stop
 * it (hover) and fling it — opposite direction or faster — with inertia
 * easing back to idle. Touch: drag to spin. Chrome cubes orbit the core.
 */

/** per-triangle planar (box) UVs — no DCC unwrapping needed */
function boxUnwrap(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const idx = geo.index;
  const uv = new Float32Array(pos.count * 2);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const n = new THREE.Vector3();
  const triCount = idx ? idx.count / 3 : pos.count / 3;
  for (let t = 0; t < triCount; t++) {
    const i0 = idx ? idx.getX(t * 3) : t * 3;
    const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
    a.fromBufferAttribute(pos, i0);
    b.fromBufferAttribute(pos, i1);
    c.fromBufferAttribute(pos, i2);
    ab.subVectors(b, a);
    ac.subVectors(c, a);
    n.crossVectors(ab, ac);
    const ax = Math.abs(n.x),
      ay = Math.abs(n.y),
      az = Math.abs(n.z);
    const project = (v: THREE.Vector3): [number, number] =>
      ax > ay && ax > az
        ? [v.z, v.y] // x-dominant
        : ay > az
          ? [v.x, v.z] // y-dominant
          : [v.x, v.y]; // z-dominant
    const [u0, v0] = project(a);
    const [u1, v1] = project(b);
    const [u2, v2] = project(c);
    uv[i0 * 2] = u0;
    uv[i0 * 2 + 1] = v0;
    uv[i1 * 2] = u1;
    uv[i1 * 2 + 1] = v1;
    uv[i2 * 2] = u2;
    uv[i2 * 2 + 1] = v2;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

/** procedural server-gate emissive: dark panels + glowing blue channels */
function gateEmissiveTexture(): THREE.CanvasTexture {
  const S = 512;
  const cnv = document.createElement("canvas");
  cnv.width = cnv.height = S;
  const g = cnv.getContext("2d")!;

  g.fillStyle = "#000000";
  g.fillRect(0, 0, S, S);

  // vertical channel lines (the blue data veins)
  const lines = [40, 128, 256, 384, 472];
  lines.forEach((x, i) => {
    const w = i === 2 ? 5 : 3;
    const grad = g.createLinearGradient(0, 0, 0, S);
    grad.addColorStop(0, "rgba(59,130,246,0.15)");
    grad.addColorStop(0.5, "rgba(96,165,250,1)");
    grad.addColorStop(1, "rgba(59,130,246,0.15)");
    g.fillStyle = grad;
    g.fillRect(x - w / 2, 0, w, S);
  });

  // horizontal vent slits with a soft glow
  for (let y = 56; y < S; y += 72) {
    g.fillStyle = "rgba(96,165,250,0.8)";
    g.fillRect(64, y, S - 128, 2);
    g.fillStyle = "rgba(96,165,250,0.12)";
    g.fillRect(60, y - 4, S - 120, 10);
  }

  // bright node dots where lines cross vents
  lines.forEach((x) => {
    for (let y = 56; y < S; y += 72) {
      const grad = g.createRadialGradient(x, y, 0, x, y, 10);
      grad.addColorStop(0, "rgba(190,225,255,1)");
      grad.addColorStop(1, "rgba(96,165,250,0)");
      g.fillStyle = grad;
      g.fillRect(x - 10, y - 10, 20, 20);
    }
  });

  const tex = new THREE.CanvasTexture(cnv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function ServerScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, fine ? 2 : 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, host.clientWidth / host.clientHeight, 0.1, 40);
    camera.position.set(0.4, 1.7, 4.6);
    camera.lookAt(0, 0.05, 0);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    pmrem.dispose();
    scene.environmentIntensity = 0.7;

    const key = new THREE.DirectionalLight(0xffffff, 2);
    key.position.set(4, 6, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3b82f6, 1.2);
    rim.position.set(-5, 1, -4);
    scene.add(rim);

    const emis = gateEmissiveTexture();
    emis.repeat.set(2, 1);
    const disposables: Array<{ dispose: () => void }> = [env, emis];

    const coreGroup = new THREE.Group();
    const ringGroup = new THREE.Group();
    scene.add(coreGroup, ringGroup);

    const orbiters = new THREE.Group();
    scene.add(orbiters);

    let disposed = false;
    new GLTFLoader().load("/models/server.glb", (gltf) => {
      if (disposed) return;
      const nodes = [...gltf.scene.children] as THREE.Mesh[];

      // the wider mesh is the outer ring; the other one is the core
      const spanX = (m: THREE.Mesh) => {
        const b = new THREE.Box3().setFromObject(m);
        return b.getSize(new THREE.Vector3()).x;
      };
      const sorted = nodes.sort((a, b) => spanX(b) - spanX(a));
      const ringMesh: THREE.Mesh | null = sorted[0] ?? null;
      const coreMesh: THREE.Mesh | null = sorted[1] ?? null;
      if (!ringMesh) return;

      const fit = (m: THREE.Mesh, target: number) => {
        boxUnwrap(m.geometry);
        const b = new THREE.Box3().setFromObject(m);
        const s = b.getSize(new THREE.Vector3()).length();
        const k = target / s;
        m.scale.setScalar(k);
        const b2 = new THREE.Box3().setFromObject(m);
        const c = b2.getCenter(new THREE.Vector3());
        m.position.sub(c);
        return m;
      };

      const matFor = (base: number, eInt: number) => {
        const mat = new THREE.MeshStandardMaterial({
          color: base,
          metalness: 0.72,
          roughness: 0.34,
          emissive: new THREE.Color(0x3b82f6),
          emissiveMap: emis,
          emissiveIntensity: eInt,
        });
        disposables.push(mat);
        return mat;
      };

      if (ringMesh) {
        ringMesh.material = matFor(0x2a313c, 1.0);
        ringGroup.add(fit(ringMesh, 2.1));
      }
      if (coreMesh) {
        coreMesh.material = matFor(0x161b23, 1.25);
        coreGroup.add(fit(coreMesh, 1.55));
      }

      // orbiting chrome cubes — nod to the key art
      const cubeGeo = new THREE.BoxGeometry(0.13, 0.13, 0.13);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.08,
        envMapIntensity: 1.4,
      });
      disposables.push(cubeGeo, cubeMat);
      for (let i = 0; i < 3; i++) {
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        const pivot = new THREE.Group();
        pivot.rotation.x = 0.35 + i * 0.22;
        pivot.rotation.z = i * 0.6;
        cube.position.x = 1.35 + i * 0.22;
        pivot.add(cube);
        orbiters.add(pivot);
      }
    });

    // ---------- ring control: uniform idle, hover-slow, fling ----------
    const IDLE_SPEED = 0.35;
    let speed = IDLE_SPEED;
    let hover = false;
    let dragging = false;
    let lastX = 0;

    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      speed += dx * 0.012; // fling: opposite direction or faster
    };
    const onUp = () => (dragging = false);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    host.style.cursor = fine ? "ew-resize" : "auto";

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "40px" });
    io.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // ease toward idle speed — hover nearly stops it, flings decay home
      const rest = hover && !dragging ? IDLE_SPEED * 0.12 : IDLE_SPEED;
      if (!dragging) speed += (rest - speed) * Math.min(1, dt * 0.9);
      ringGroup.rotation.y += speed * dt;
      if (ringGroup.rotation.y > Math.PI * 2) ringGroup.rotation.y -= Math.PI * 2;
      if (ringGroup.rotation.y < 0) ringGroup.rotation.y += Math.PI * 2;

      orbiters.rotation.y = t * 0.22;
      orbiters.children.forEach((p, i) => {
        p.rotation.y = t * (0.3 + i * 0.12);
      });

      // core breathes
      const mats = [coreGroup, ringGroup].map((g) =>
        (g.children[0] as THREE.Mesh | undefined)?.material as THREE.MeshStandardMaterial | undefined,
      );
      mats.forEach((m, i) => {
        if (m) m.emissiveIntensity = (i === 0 ? 1.25 : 1.0) * (0.88 + Math.sin(t * 1.8 + i) * 0.12);
      });

      renderer.render(scene, camera);
    };

    if (reduced) {
      ringGroup.rotation.y = 0.8;
      renderer.render(scene, camera);
    } else {
      tick();
    }

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className="h-full w-full touch-pan-y" aria-label="Rotating server gate" />;
}
