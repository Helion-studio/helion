"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * THE CHROME SPIRAL — Notch Team's centerpiece.
 *
 * A faceted chrome rod twisted into a descending helix with an additive
 * energy sheath hugging it, a glossy ball that rides the path carrying its
 * own blue light (the rod glows where the ball is), a pulsing arrival ring
 * at the base, and drifting dust for depth. Scrolling drives everything:
 * the ball slides, the world turns, and the camera dollies in and down.
 * The glass value-prop panel floats over the scene; a mission-control HUD
 * tracks the drop.
 *
 * Mobile: capped pixel ratio, lighter geometry, scroll-only motion (no
 * pointer dependency), pauses off-screen, static frame under
 * reduced-motion.
 */

const TURNS = 2.25;
const RADIUS = 2.1;
const HEIGHT = 5.2;

function makeHelix(segments: number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = t * Math.PI * 2 * TURNS;
    pts.push(new THREE.Vector3(Math.cos(a) * RADIUS, (0.55 - t) * HEIGHT, Math.sin(a) * RADIUS));
  }
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0);
}

function useChromeSpiral(
  hostRef: React.RefObject<HTMLDivElement | null>,
  sectionRef: React.RefObject<HTMLElement | null>,
  hudRef: React.RefObject<HTMLSpanElement | null>,
  barRef: React.RefObject<HTMLDivElement | null>,
  hintRef: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const host = hostRef.current;
    const section = sectionRef.current;
    if (!host || !section) return;

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
    const camera = new THREE.PerspectiveCamera(40, host.clientWidth / host.clientHeight, 0.1, 60);
    camera.position.set(0, 0.9, 8.4);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.85;
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(5, 7, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3b82f6, 1.1);
    rim.position.set(-6, 1, -5);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));

    const world = new THREE.Group();
    scene.add(world);
    const helix = makeHelix(fine ? 256 : 160);

    // chrome rod — hex cross-section so it reads as cut metal
    const rodGeo = new THREE.TubeGeometry(helix, fine ? 240 : 150, 0.085, 6, false);
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.07,
      envMapIntensity: 1.25,
    });
    world.add(new THREE.Mesh(rodGeo, rodMat));

    // energy sheath — faint additive halo hugging the rod
    const sheathGeo = new THREE.TubeGeometry(helix, fine ? 200 : 120, 0.14, 6, false);
    const sheathMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    world.add(new THREE.Mesh(sheathGeo, sheathMat));

    // the ball — glossy, carries its own light so the path glows as it passes
    const ballGeo = new THREE.SphereGeometry(0.28, 48, 48);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.04,
      envMapIntensity: 1.4,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    const ballLight = new THREE.PointLight(0x3b82f6, 7, 4.5, 1.6);
    ball.add(ballLight);
    world.add(ball);

    // arrival ring — where the journey ends, gently pulsing
    const end = helix.getPointAt(1);
    const ringGeo = new THREE.TorusGeometry(0.34, 0.02, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(end.x, end.y - 0.06, end.z);
    world.add(ring);

    // drifting dust — depth in the void
    const dustCount = fine ? 90 : 50;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 1.4 + Math.random() * 3.2;
      const a = Math.random() * Math.PI * 2;
      dustPos[i * 3] = Math.cos(a) * r;
      dustPos[i * 3 + 1] = -5.5 + Math.random() * 8;
      dustPos[i * 3 + 2] = Math.sin(a) * r;
    }
    const dustGeo = new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.BufferAttribute(dustPos, 3),
    );
    const dustMat = new THREE.PointsMaterial({
      color: 0x9cc5ff,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    world.add(dust);

    const place = (p: number) => {
      helix.getPointAt(THREE.MathUtils.clamp(p, 0, 1), ball.position);
      ball.position.y += 0.28; // ride on top of the rod
    };
    place(0);

    // scroll → progress (scoped to this section)
    let target = 0;
    let current = 0;
    const measure = () => {
      const r = section.getBoundingClientRect();
      target = THREE.MathUtils.clamp(
        (window.scrollY - (r.top + window.scrollY)) / Math.max(1, r.height - window.innerHeight),
        0,
        1,
      );
    };
    const onScroll = () => measure();
    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
      measure();
    };
    measure();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "60px" });
    io.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    let lastPct = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      clock.getDelta();
      const t = clock.elapsedTime;

      current += (target - current) * 0.08;
      place(current);

      // spin as it travels; world turns with the scroll
      ball.rotation.x = current * 14;
      ball.rotation.z = current * 5;
      world.rotation.y = t * 0.05 + current * Math.PI * 0.8;

      // camera dollies in and down — real travel, never aggressive
      camera.position.set(0, 0.9 - current * 0.75, 8.4 - current * 1.15);
      camera.lookAt(0, -0.5 + current * 0.4, 0);

      // arrival ring breathes
      const pulse = 1 + Math.sin(t * 2.2) * 0.07;
      ring.scale.setScalar(pulse);
      ringMat.opacity = 0.6 + Math.sin(t * 2.2) * 0.25;

      dust.rotation.y = t * 0.02;

      // HUD (direct DOM — no re-renders)
      const pct = Math.round(current * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        if (hudRef.current)
          hudRef.current.textContent = `DROP ${String(pct).padStart(3, "0")} / 100`;
        if (barRef.current) barRef.current.style.transform = `scaleX(${current})`;
        if (hintRef.current) hintRef.current.style.opacity = current > 0.06 ? "0" : "1";
      }

      renderer.render(scene, camera);
    };

    if (reduced) {
      place(0.3);
      world.rotation.y = 0.6;
      renderer.render(scene, camera);
      if (hudRef.current) hudRef.current.textContent = "DROP 030 / 100";
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      [rodGeo, sheathGeo, ballGeo, ringGeo, dustGeo].forEach((g) => g.dispose());
      [rodMat, sheathMat, ballMat, ringMat, dustMat].forEach((m) => m.dispose());
      env.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [hostRef, sectionRef, hudRef, barRef, hintRef]);
}

export function ChromeSpiral() {
  const rm = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useChromeSpiral(hostRef, sectionRef, hudRef, barRef, hintRef);

  return (
    <section ref={sectionRef} aria-label="How we work" className="relative h-[260svh] bg-void">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div ref={hostRef} className="absolute inset-0" aria-hidden />

        {/* glass value-prop panel */}
        <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
          <motion.div
            initial={rm ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel max-w-lg p-8 md:p-10"
          >
            <p className="eyebrow">
              <span className="font-mono text-arc">01</span> The approach
            </p>
            <h2 className="mt-5 font-display text-section leading-[1.05] font-light tracking-[-0.02em] text-white">
              Tailored Engineering for <span className="font-medium">Any Workflow</span>
            </h2>
            <p className="mt-5 text-pretty text-body leading-relaxed text-white/65">
              Are you looking for an end-to-end team to manage your entire business workflow, or a
              specialized group to integrate seamlessly with your existing team? Notch Team has
              you covered.
            </p>
            <div
              ref={hintRef}
              className="mt-7 flex items-center gap-2 text-micro tracking-[0.1em] text-white/35 uppercase transition-opacity duration-500"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-energy" />
              Scroll — the ball follows
            </div>
          </motion.div>
        </div>

        {/* mission-control HUD */}
        <div className="pointer-events-none absolute bottom-6 left-5 flex items-center gap-3 md:left-8">
          <span
            ref={hudRef}
            className="font-mono text-micro tracking-[0.14em] text-white/50 uppercase"
          >
            DROP 000 / 100
          </span>
          <div className="h-px w-24 overflow-hidden bg-white/10 md:w-36">
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-arc"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
