"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * THE CHROME SPIRAL — Notch Team's centerpiece.
 *
 * A faceted chrome rod twisted into a descending helix (the old staircase,
 * distilled), with a glossy ball that slides down the path as you scroll.
 * Studio lighting, code-generated reflections, dark void. The value-prop
 * sits on a glassmorphism panel floating over the scene.
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
    renderer.toneMappingExposure = 1.05;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, host.clientWidth / host.clientHeight, 0.1, 60);
    camera.position.set(0, 0.9, 8.4);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.85;
    pmrem.dispose();

    // studio lighting
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(5, 7, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x3b82f6, 1.1);
    rim.position.set(-6, 1, -5);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));

    const world = new THREE.Group();
    scene.add(world);

    // the rod — hex cross-section so the chrome reads as cut metal
    const helix = makeHelix(fine ? 256 : 160);
    const rodGeo = new THREE.TubeGeometry(helix, fine ? 240 : 150, 0.085, 6, false);
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.07,
      envMapIntensity: 1.25,
    });
    world.add(new THREE.Mesh(rodGeo, rodMat));

    // the ball — glossy, starts at the peak
    const ballGeo = new THREE.SphereGeometry(0.28, 48, 48);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.04,
      envMapIntensity: 1.4,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    world.add(ball);

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
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      clock.getDelta();
      const t = clock.elapsedTime;

      current += (target - current) * 0.08; // smooth slide
      place(current);
      world.rotation.y = t * 0.05 + current * Math.PI * 0.8; // scroll turns the spiral
      camera.lookAt(0, -0.5 + current * 0.4, 0);

      renderer.render(scene, camera);
    };

    if (reduced) {
      place(0.3);
      world.rotation.y = 0.6;
      renderer.render(scene, camera);
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      rodGeo.dispose();
      rodMat.dispose();
      ballGeo.dispose();
      ballMat.dispose();
      env.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [hostRef, sectionRef]);
}

export function ChromeSpiral() {
  const rm = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useChromeSpiral(hostRef, sectionRef);

  return (
    <section ref={sectionRef} aria-label="How we work" className="relative h-[260svh] bg-void">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* the 3D scene */}
        <div ref={hostRef} className="absolute inset-0" aria-hidden />

        {/* glass value-prop panel floating over the scene */}
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
            <div className="mt-7 flex items-center gap-2 text-micro tracking-[0.1em] text-white/35 uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-energy" />
              Scroll — the ball follows
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
