"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";

/**
 * LIMB GLOW — the blue atmosphere over the hero artwork, in one raw
 * THREE.ShaderMaterial on a single fullscreen quad. No postprocessing,
 * no extra library: the render pipeline already pulls in three, so the
 * whole effect costs ~0 KB of new dependency weight.
 *
 * What it draws
 *   1. a limb/horizon arc that follows the artwork's planet edge
 *   2. a light band that travels along that arc on a slow loop
 *   3. a soft bloom that breathes (contrast is pushed hard on the blue
 *      channel so it reads as *light*, not as a blue smudge)
 *
 * Cost control
 *   - pixel ratio capped at 1.5 desktop / 1 mobile, and the canvas renders
 *     at half resolution then upscales (glow is blurry by nature — nobody
 *     notices, the GPU does half the work)
 *   - frame budget: one fragment shader, ~20 lines, no textures, no lights
 *   - pauses when off-screen, when the tab is hidden, and never runs at all
 *     under prefers-reduced-motion (a static frame is drawn instead)
 *   - touch devices get a slower travel speed and no cursor parallax
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uIntensity;

  void main() {
    // square-ish space so the radius reads the same at any aspect
    vec2 p = vUv - 0.5;
    p.x *= 1.35;
    p += uPointer * 0.012;

    // planet edge: the artwork's limb sits low-right of centre
    vec2 c = vec2(0.16, -0.74);
    float d = length(p - c);
    float R = 0.60;

    // 1. horizon band — tight and bright, this is the contrast
    float band = 1.0 - smoothstep(0.0, 0.030, abs(d - R));
    // 2. outer atmosphere — wide falloff above the limb only
    float above = smoothstep(-0.02, 0.16, d - R);
    float halo = (1.0 - smoothstep(0.0, 0.34, d - R)) * above;
    // 3. traveling light band along the arc (angle + time, sharpened)
    float ang = atan(p.y - c.y, p.x - c.x);
    float travel = 0.5 + 0.5 * sin(ang * 1.0 - uTime * 0.42);
    float sweep = pow(travel, 9.0);

    float glow = band * 1.0 + halo * 0.55 + band * sweep * 1.35;
    // breathing so it never looks like a static sticker
    glow *= 0.86 + 0.14 * sin(uTime * 0.75);

    // deep blue core → electric cyan rim
    vec3 tint = mix(vec3(0.09, 0.35, 0.98), vec3(0.42, 0.80, 1.0), band * 0.55 + sweep * 0.6);
    float a = clamp(glow, 0.0, 1.0) * uIntensity;
    gl_FragColor = vec4(tint * a, a);
  }
`;

export function LimbGlow({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      return; // no WebGL → the CSS glow underneath is the fallback
    }

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 1 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    renderer.setClearAlpha(0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5) * (coarse ? 0.4 : 0.5);
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer!.setPixelRatio(dpr);
      renderer!.setSize(w, h, false);
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = new THREE.Vector2(0, 0);
    const onMove = (e: PointerEvent) => {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    if (!coarse && !reduced) window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        // hero is a first-impression effect: hand the GPU back once it scrolls away
        uniforms.uIntensity.value = entry.isIntersecting ? 1 : 0;
      },
      { rootMargin: "120px" },
    );
    io.observe(host);

    let raf = 0;
    let last = 0;
    const frame = reduced
      ? () => {
          uniforms.uIntensity.value = 0.8;
          renderer!.render(scene, camera);
        }
      : (now: number) => {
          raf = requestAnimationFrame(frame);
          if (!visible || document.hidden) return;
          // 45fps desktop / 30fps mobile ceiling: plenty for a glow, saves battery
          if (now - last < (coarse ? 33 : 22)) return;
          last = now;
          uniforms.uTime.value += 0.035;
          uniforms.uPointer.value.lerp(pointer, 0.05);
          renderer!.render(scene, camera);
        };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      mesh.geometry.dispose();
      material.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`pointer-events-none mix-blend-screen ${className ?? ""}`}
    />
  );
}
