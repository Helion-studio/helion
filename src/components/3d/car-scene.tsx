"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useEffect, useRef } from "react";

/**
 * THE DRIFT CAR — Game Development showcase.
 *
 * Model axes (measured from the GLB bounds — supercar proportions):
 *   local Y = length 4.97 (nose at −Y, verified by the narrow-tip profile)
 *   local X = width 2.06
 *   local Z = height 1.22  ← UP is +Z (the earlier build wrongly stood X up)
 *
 * The car drifts in from the right with tire smoke, settles nose-to-camera,
 * then idles. PC: the nose leans toward the cursor. Touch: horizontal drag
 * turns the car. If the nose ever points the wrong way, flip BASE_YAW's sign.
 */

const BASE_YAW = Math.PI / 2; // nose (−X after the basis fix) → +Z, toward camera
const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3);

/** soft round sprite for smoke/dust/shadow */
function makePuffTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.5, "rgba(255,255,255,0.18)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

class Smoke {
  points: THREE.Points;
  private life: Float32Array;
  private vel: Float32Array;
  private n: number;
  private cursor = 0;

  constructor(n: number, tex: THREE.Texture) {
    this.n = n;
    const pos = new Float32Array(n * 3);
    this.life = new Float32Array(n);
    this.vel = new Float32Array(n * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.55,
      map: tex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      color: 0xb9c8dd,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
  }

  spawn(x: number, y: number, z: number, spread = 0.9) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.n;
    const p = this.points.geometry.attributes.position as THREE.BufferAttribute;
    p.setXYZ(i, x + (Math.random() - 0.5) * 0.2, y + 0.05, z + (Math.random() - 0.5) * 0.2);
    this.vel[i * 3] = (Math.random() - 0.5) * spread;
    this.vel[i * 3 + 1] = 0.35 + Math.random() * 0.5;
    this.vel[i * 3 + 2] = (Math.random() - 0.5) * spread;
    this.life[i] = 1;
  }

  update(dt: number) {
    const p = this.points.geometry.attributes.position as THREE.BufferAttribute;
    const mat = this.points.material as THREE.PointsMaterial;
    let alive = 0;
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt * 0.9;
      p.setXYZ(
        i,
        p.getX(i) + this.vel[i * 3] * dt,
        p.getY(i) + this.vel[i * 3 + 1] * dt * 0.6,
        p.getZ(i) + this.vel[i * 3 + 2] * dt,
      );
      alive++;
    }
    p.needsUpdate = true;
    mat.opacity = alive ? 0.5 : 0;
  }
}

export function CarScene({ onFail }: { onFail?: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // the pane may not have layout yet when the lazy chunk mounts —
    // a 0×0 canvas yields NaN projection matrices and renders nothing
    const sized = () => host.clientWidth > 4 && host.clientHeight > 4;
    let cleanup: (() => void) | undefined;
    const start = () => {
      cleanup = initScene();
    };

    if (sized()) start();
    else {
      const ro = new ResizeObserver(() => {
        if (sized()) {
          ro.disconnect();
          start();
        }
      });
      ro.observe(host);
      cleanup = () => ro.disconnect();
    }

    const initScene = (): (() => void) | undefined => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fine = window.matchMedia("(pointer: fine)").matches;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        onFail?.();
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, fine ? 2 : 1.5));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight, 0.1, 40);
      camera.position.set(0.5, 1.15, 6.1);
      camera.lookAt(0, 0.42, 0);

      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = env;
      pmrem.dispose();
      scene.environmentIntensity = 0.8;

      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(4, 6, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x3b82f6, 1.4);
      rim.position.set(-5, 2, -4);
      scene.add(rim);
      scene.add(new THREE.AmbientLight(0xffffff, 0.25));

      // fake contact shadow
      const puffTex = makePuffTexture();
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(4.6, 2.6),
        new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, opacity: 0.55, color: 0x000000, depthWrite: false }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.005;
      scene.add(shadow);

      const smoke = new Smoke(fine ? 70 : 40, puffTex);
      scene.add(smoke.points);

      const carGroup = new THREE.Group(); // world placement (yaw)
      const modelGroup = new THREE.Group(); // idle micro-motion
      carGroup.add(modelGroup);
      carGroup.rotation.y = BASE_YAW;
      scene.add(carGroup);

      let disposed = false;
      const toDispose: Array<{ dispose: () => void }> = [env, puffTex];

      new GLTFLoader().load(
        "/models/car.glb",
        (gltf) => {
          if (disposed) return;
          try {
            const model = gltf.scene;

            // stand the sculpt up: local Z is up, local Y is length (nose −Y)
            const basis = new THREE.Matrix4().makeBasis(
              new THREE.Vector3(0, 0, 1), // local X (width)  → world Z
              new THREE.Vector3(1, 0, 0), // local Y (length) → world X
              new THREE.Vector3(0, 1, 0), // local Z (up)     → world Y
            );
            model.quaternion.setFromRotationMatrix(basis);

            // normalize: scale to ~2.35 long, center over origin, wheels down
            const s = 2.35 / Math.max(new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).x, 0.001);
            model.scale.setScalar(s);
            const b = new THREE.Box3().setFromObject(model);
            const c = b.getCenter(new THREE.Vector3());
            model.position.set(-c.x, -b.min.y + 0.02, -c.z);
            modelGroup.add(model);

            // metallic reflective paint — keep the sculpt's texture, boost the finish
            model.traverse((o) => {
              if ((o as THREE.Mesh).isMesh) {
                const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
                m.metalness = 0.82;
                m.roughness = 0.3;
                m.envMapIntensity = 1.35;
                toDispose.push(m);
              }
            });
          } catch (err) {
            console.error("[car-scene] model setup failed", err);
            onFail?.();
          }
        },
        undefined,
        (err) => {
          console.error("[car-scene] load failed", err);
          onFail?.();
        },
      );

      // ---------- animation ----------
      let entranceT: number; // <0 waiting, 0..1 drifting, 1 idle
      let started = false;
      if (reduced) {
        entranceT = 1;
        started = true;
        carGroup.position.x = 0;
      } else {
        entranceT = -1;
        carGroup.position.x = 3.6; // held just off-frame
      }

      const pointer = { x: 0, active: false };
      let dragYaw = 0;
      let dragging = false;
      let lastX = 0;

      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.active = true;
        if (dragging) {
          dragYaw = THREE.MathUtils.clamp(dragYaw + (e.clientX - lastX) * 0.006, -0.55, 0.55);
          lastX = e.clientX;
        }
      };
      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
      };
      const onUp = () => (dragging = false);
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "40px" });
      io.observe(host);
      const startIo = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && !started) {
            started = true;
            entranceT = 0.0001;
          }
        },
        { rootMargin: "0px" },
      );
      startIo.observe(host);

      const clock = new THREE.Clock();
      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        if (entranceT >= 0 && entranceT < 1) {
          // drift in from the right, counter-steer to rest
          entranceT = Math.min(1, entranceT + dt / 2.2);
          const e = EASE_OUT(entranceT);
          carGroup.position.x = (1 - e) * 3.6;
          carGroup.rotation.y = BASE_YAW + (1 - e) * -0.45;
          carGroup.rotation.z = (1 - e) * 0.04;

          // tire smoke + dust while sliding
          if (entranceT < 0.62 && Math.random() < 0.8) {
            smoke.spawn(carGroup.position.x + 0.9, 0.05, (Math.random() - 0.5) * 1.5, 1.2);
          }
        } else if (entranceT >= 1) {
          // idle — nose leans toward the cursor (PC), drag yaw (touch)
          const lean = fine && pointer.active ? pointer.x * 0.14 : 0;
          const targetYaw = BASE_YAW + lean + dragYaw;
          carGroup.rotation.y += (targetYaw - carGroup.rotation.y) * Math.min(1, dt * 5);
          carGroup.rotation.z *= 0.92;
          modelGroup.position.y = Math.sin(t * 1.7) * 0.008; // suspension breath
          modelGroup.rotation.z = Math.sin(t * 0.9) * 0.006;
          if (!dragging) dragYaw += -dragYaw * Math.min(1, dt * 3);
        }

        smoke.update(dt);
        renderer.render(scene, camera);
      };
      if (!reduced) tick();

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
        startIo.disconnect();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointerup", onUp);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerdown", onDown);
        smoke.points.geometry.dispose();
        (smoke.points.material as THREE.Material).dispose();
        shadow.geometry.dispose();
        (shadow.material as THREE.Material).dispose();
        toDispose.forEach((d) => d.dispose());
        renderer.dispose();
        if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      };
    }

    return () => cleanup?.();
  }, [onFail]);

  return <div ref={hostRef} className="h-full w-full touch-pan-y" aria-label="Concept car drifting in" />;
}
